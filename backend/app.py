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

import psycopg2
from pydantic import BaseModel

def get_db_connection():
	return psycopg2.connect(
		dbname="postgres",
		user="postgres",
		password="admin",  # Change to your actual password
		host="localhost",
		port="5432"
	)

class SignupRequest(BaseModel):
	name: str
	email: str
	password: str

class LoginRequest(BaseModel):
	userId: str
	password: str
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

# Signup endpoint
@app.post("/signup")
async def signup(request: SignupRequest):
	conn = get_db_connection()
	cur = conn.cursor()
	cur.execute("SELECT COUNT(*) FROM users;")
	count = cur.fetchone()[0]
	user_id = f"USER-{count+1:02d}"
	try:
		cur.execute("""
			INSERT INTO users (userId, name, email, role, auth, password)
			VALUES (%s, %s, %s, %s, %s, %s)
		""", (user_id, request.name, request.email, '', 'user', request.password))
		conn.commit()
		return {"success": True, "userId": user_id}
	except Exception as e:
		return {"success": False, "error": str(e)}
	finally:
		cur.close()
		conn.close()

# Login endpoint
@app.post("/login")
async def login(request: LoginRequest):
	conn = get_db_connection()
	cur = conn.cursor()
	cur.execute("SELECT password, auth FROM users WHERE userId=%s", (request.userId,))
	result = cur.fetchone()
	cur.close()
	conn.close()
	if result and result[0] == request.password:
		return {"success": True, "auth": result[1]}
	else:
		return {"success": False, "error": "Not authenticated"}

