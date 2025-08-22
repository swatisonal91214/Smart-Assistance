from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi import Request, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from create_embeddings import create_and_store_embeddings
from models import CreateEmbeddingsRequest, CreateEmbeddingsResponse, ChatRequest, ChatResponse
from question_answering import interactive_qa
import os

app = FastAPI()

# Add CORS middleware
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)
@app.get("/")
async def read_root():
	return JSONResponse(content={"message": "Hello, FastAPI!"})

# Endpoint to create embeddings
@app.post("/create-embeddings", response_model=CreateEmbeddingsResponse)
async def create_embeddings_endpoint(request: CreateEmbeddingsRequest):
	try:
		create_and_store_embeddings(request.file_path, request.prefix)
		return CreateEmbeddingsResponse(message="Embeddings created successfully.")
	except Exception as e:
		raise HTTPException(status_code=500, detail=str(e))

# Endpoint to upload file
@app.post("/upload-file")
async def upload_file(file: UploadFile = File(...)):
	upload_folder = "uploaded_files"
	os.makedirs(upload_folder, exist_ok=True)
	file_location = os.path.join(upload_folder, file.filename)
	with open(file_location, "wb") as f:
		f.write(await file.read())
	return {"file_path": file_location, "filename": file.filename}

# Endpoint to chat
@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        answer = interactive_qa(request.query)
        return ChatResponse(answer=answer)
    except Exception as e:
        import traceback
        print("/chat error:", traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

