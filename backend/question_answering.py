import os
import requests
import numpy as np
import faiss
from create_embeddings import get_embedding

OLLAMA_URL = "http://localhost:11434/api/generate"
EMBEDDING_DIR = "embeddings"

def retrieve(query, index, chunks, embeddings, top_k=3):
	query_emb = get_embedding(query).reshape(1, -1)
	D, I = index.search(query_emb, top_k)
	return [chunks[i] for i in I[0]]

def answer_question(query, index, chunks, embeddings):
	context_chunks = retrieve(query, index, chunks, embeddings)
	context = "\n".join(context_chunks)
	prompt = f"Answer the following question based on the context below.\nContext: {context}\nQuestion: {query}\nAnswer:"
	payload = {
		"model": "llama3.2",
		"prompt": prompt,
		"stream": False
	}
	response = requests.post(OLLAMA_URL, json=payload)
	if response.status_code == 200:
		return response.json().get("response", "")
	else:
		return f"Error: {response.text}"

def load_embeddings_and_chunks():
	# Find the first available embeddings file in the directory
	for file in os.listdir(EMBEDDING_DIR):
		if file.endswith('_embeddings.npy'):
			prefix = file.replace('_embeddings.npy', '')
			embeddings = np.load(os.path.join(EMBEDDING_DIR, f"{prefix}_embeddings.npy"))
			with open(os.path.join(EMBEDDING_DIR, f"{prefix}_chunks.txt"), "r", encoding="utf-8") as f:
				chunks = [line.strip() for line in f.readlines()]
			dim = embeddings.shape[1]
			index = faiss.IndexFlatL2(dim)
			index.add(embeddings)
			return index, embeddings, chunks
	raise FileNotFoundError("No embeddings file found in the embeddings directory.")

def interactive_qa(query):
	index, embeddings, chunks = load_embeddings_and_chunks()
	answer = answer_question(query, index, chunks, embeddings)
	print(f"Answer: {answer}")
	return answer