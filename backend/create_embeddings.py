import os
import requests
import numpy as np
import faiss
from file_reader import read_document

EMBEDDING_DIR = "embeddings"


def create_and_store_embeddings(file_path, prefix="default", output_folder=None):
    """
    Creates and stores embeddings for the given file.
    Args:
        file_path (str): Path to the file (PDF or text).
        prefix (str): Prefix for saved files.
        output_folder (str): Folder to save embeddings/chunks (optional).
    """
    text = read_document(file_path)
    if not text:
        raise RuntimeError(f"Failed to extract text from document: {file_path}")
    chunks = chunk_text(text)
    if not chunks:
        raise RuntimeError("No text chunks created from document")
    try:
        index, embeddings = build_faiss_index(chunks)
    except Exception as e:
        raise RuntimeError(f"Failed to build embeddings/index: {e}")
    save_embeddings_and_chunks(embeddings, chunks, prefix, output_folder)
    folder = output_folder if output_folder else EMBEDDING_DIR
    print(f"Embeddings and chunks saved to '{folder}' with prefix '{prefix}'.")


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
    try:
        response = requests.post(EMBED_URL, json=payload, timeout=30)
    except requests.exceptions.RequestException as e:
        raise RuntimeError(f"Embedding service request failed: {e}")
    if response.status_code == 200:
        data = response.json()
        # Ollama returns {'embedding': [[...]]} for batch, or {'embedding': [...]} for single
        emb = data.get("embedding")
        if emb is None:
            raise RuntimeError(f"Embedding response missing 'embedding' field: {data}")
        if isinstance(emb[0], list):
            emb = emb[0]
        return np.array(emb, dtype=np.float32)
    else:
        raise RuntimeError(f"Embedding error: {response.status_code} {response.text}")


def build_faiss_index(chunks):
    embeddings = np.array([get_embedding(chunk) for chunk in chunks])
    dim = embeddings.shape[1]
    index = faiss.IndexFlatL2(dim)
    index.add(embeddings)
    return index, embeddings


def save_embeddings_and_chunks(embeddings, chunks, prefix, output_folder=None):
    folder = output_folder if output_folder else EMBEDDING_DIR
    os.makedirs(folder, exist_ok=True)
    np.save(os.path.join(folder, f"{prefix}_embeddings.npy"), embeddings)
    with open(os.path.join(folder, f"{prefix}_chunks.txt"), "w", encoding="utf-8") as f:
        for chunk in chunks:
            f.write(chunk.replace('\n', ' ') + "\n")
