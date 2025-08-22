import os
import requests
import numpy as np
import faiss
from file_reader import read_document

EMBEDDING_DIR = "embeddings"


def create_and_store_embeddings(file_path, prefix="default"):
    """
    Creates and stores embeddings for the given file.
    Args:
        file_path (str): Path to the file (PDF or text).
        prefix (str): Prefix for saved files.
    """
    text = read_document(file_path)
    chunks = chunk_text(text)
    index, embeddings = build_faiss_index(chunks)
    save_embeddings_and_chunks(embeddings, chunks, prefix)
    print(f"Embeddings and chunks saved to '{EMBEDDING_DIR}' with prefix '{prefix}'.")


def chunk_text(text, chunk_size=500):
    # Simple chunking by words
    words = text.split()
    return [' '.join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]


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
