import os
import faiss
import numpy as np
import requests

# Ollama local endpoint
OLLAMA_URL = "http://localhost:11434/api/generate"

EMBEDDING_DIR = "embeddings"  # Folder to store embeddings and chunks

def read_document(file_path):
	with open(file_path, 'r', encoding='utf-8') as f:
		return f.read()

def chunk_text(text, chunk_size=500):
	# Simple chunking by words
	words = text.split()
	return [' '.join(words[i:i+chunk_size]) for i in range(0, len(words), chunk_size)]

def get_embedding(text):
	# Use Ollama's nomic-embed-text model for local embeddings
	EMBED_URL = "http://localhost:11434/api/embeddings"
	payload = {
		"model": "nomic-embed-text",
		"prompt": text
	}
	response = requests.post(EMBED_URL, json=payload)
	if response.status_code == 200:
		data = response.json()
		# Ollama returns {'embedding': [[...]]} for batch, or {'embedding': [...]} for single
		emb = data.get("embedding")
		if isinstance(emb[0], list):
			emb = emb[0]
		return np.array(emb, dtype=np.float32)
	else:
		raise RuntimeError(f"Embedding error: {response.text}")


def build_faiss_index(chunks):
	embeddings = np.array([get_embedding(chunk) for chunk in chunks])
	dim = embeddings.shape[1]
	index = faiss.IndexFlatL2(dim)
	index.add(embeddings)
	return index, embeddings

def save_embeddings_and_chunks(embeddings, chunks, prefix):
	os.makedirs(EMBEDDING_DIR, exist_ok=True)
	np.save(os.path.join(EMBEDDING_DIR, f"{prefix}_embeddings.npy"), embeddings)
	with open(os.path.join(EMBEDDING_DIR, f"{prefix}_chunks.txt"), "w", encoding="utf-8") as f:
		for chunk in chunks:
			f.write(chunk.replace('\n', ' ') + "\n")

def load_embeddings_and_chunks(prefix):
	embeddings = np.load(os.path.join(EMBEDDING_DIR, f"{prefix}_embeddings.npy"))
	with open(os.path.join(EMBEDDING_DIR, f"{prefix}_chunks.txt"), "r", encoding="utf-8") as f:
		chunks = [line.strip() for line in f.readlines()]
	dim = embeddings.shape[1]
	index = faiss.IndexFlatL2(dim)
	index.add(embeddings)
	return index, embeddings, chunks

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

def create_and_store_embeddings(file_path, prefix="default"):
	text = read_document(file_path)
	chunks = chunk_text(text)
	index, embeddings = build_faiss_index(chunks)
	save_embeddings_and_chunks(embeddings, chunks, prefix)
	print(f"Embeddings and chunks saved to '{EMBEDDING_DIR}' with prefix '{prefix}'.")

def interactive_qa(prefix="default"):
	index, embeddings, chunks = load_embeddings_and_chunks(prefix)
	print("Ready for questions. Type 'exit' to quit.")
	while True:
		question = input("Enter your question: ")
		if question.lower() in ["exit", "quit"]:
			break
		answer = answer_question(question, index, chunks, embeddings)
		print("A:", answer)

if __name__ == "__main__":
	# Example usage
	# file_path = "sample.txt"  # Change to your document path
	# text = read_document(file_path)
	# chunks = chunk_text(text)
	# index, embeddings = build_faiss_index(chunks)
	# question = "What are some fruits that people enjoy eating during the summer season?"
	# answer = answer_question(question, index, chunks, embeddings)
	# print("Q:", question)
	# print("A:", answer)
	# Step 1: Create and store embeddings (run once per document)
	# create_and_store_embeddings("sample.txt", prefix="sample")

	# Step 2: Interactive Q&A (run as needed)
	interactive_qa(prefix="sample")
