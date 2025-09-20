
from typing import List
from fastapi import Query, FastAPI, UploadFile, File, Request, status, HTTPException
from fastapi.responses import JSONResponse
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

# GET /roles - return all role names
@app.get("/roles")
async def get_roles():
	conn = get_db_connection()
	cur = conn.cursor()
	cur.execute("SELECT RoleName FROM roles;")
	rows = cur.fetchall()
	cur.close()
	conn.close()
	role_names = [row[0] for row in rows]
	return {"roles": role_names}

# POST /roles - add a new role
@app.post("/roles")
async def add_role(request: Request):
	data = await request.json()
	role_name = data.get("roleName", "").strip()
	if not role_name:
		return {"success": False, "error": "Role name required"}
	conn = get_db_connection()
	cur = conn.cursor()
	# Generate next Roleid
	cur.execute("SELECT COUNT(*) FROM roles;")
	count = cur.fetchone()[0]
	role_id = f"R-{count+1:02d}"
	try:
		cur.execute("INSERT INTO roles (Roleid, RoleName) VALUES (%s, %s);", (role_id, role_name))
		conn.commit()
		return {"success": True}
	except Exception as e:
		return {"success": False, "error": str(e)}
	finally:
		cur.close()
		conn.close()

# DELETE /roles/{roleName} - remove a role by name
@app.delete("/roles/{roleName}")
async def delete_role(roleName: str):
	conn = get_db_connection()
	cur = conn.cursor()
	try:
		cur.execute("DELETE FROM roles WHERE RoleName=%s;", (roleName,))
		conn.commit()
		return {"success": True}
	except Exception as e:
		return {"success": False, "error": str(e)}
	finally:
		cur.close()
		conn.close()

# Add CORS middleware
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)
from typing import List
# Roles endpoints
from fastapi import Query

# GET /roles - return all role names
@app.get("/roles")
async def get_roles():
	conn = get_db_connection()
	cur = conn.cursor()
	cur.execute("SELECT RoleName FROM roles;")
	rows = cur.fetchall()
	cur.close()
	conn.close()
	role_names = [row[0] for row in rows]
	return {"roles": role_names}

# POST /roles - add a new role
@app.post("/roles")
async def add_role(request: Request):
	data = await request.json()
	role_name = data.get("roleName", "").strip()
	if not role_name:
		return {"success": False, "error": "Role name required"}
	conn = get_db_connection()
	cur = conn.cursor()
	# Generate next Roleid
	cur.execute("SELECT COUNT(*) FROM roles;")
	count = cur.fetchone()[0]
	role_id = f"R-{count+1:02d}"
	try:
		cur.execute("INSERT INTO roles (Roleid, RoleName) VALUES (%s, %s);", (role_id, role_name))
		conn.commit()
		return {"success": True}
	except Exception as e:
		return {"success": False, "error": str(e)}
	finally:
		cur.close()
		conn.close()

# DELETE /roles/{roleName} - remove a role by name
@app.delete("/roles/{roleName}")
async def delete_role(roleName: str):
	conn = get_db_connection()
	cur = conn.cursor()
	try:
		cur.execute("DELETE FROM roles WHERE RoleName=%s;", (roleName,))
		conn.commit()
		return {"success": True}
	except Exception as e:
		return {"success": False, "error": str(e)}
	finally:
		cur.close()
		conn.close()

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

from fastapi import Body

# Endpoint to create embeddings
@app.post("/create-embeddings", response_model=CreateEmbeddingsResponse)
async def create_embeddings_endpoint(request: CreateEmbeddingsRequest = Body(...)):
	try:
		# If role is provided, save embeddings in embeddings/<role>/
		embeddings_folder = "embeddings"
		if hasattr(request, "role") and request.role:
			embeddings_folder = os.path.join(embeddings_folder, request.role)
			os.makedirs(embeddings_folder, exist_ok=True)
		# Pass embeddings_folder to create_and_store_embeddings if needed
		# You may need to update create_and_store_embeddings to accept output folder
		create_and_store_embeddings(request.file_path, request.prefix, embeddings_folder)
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

# Endpoint for role-based document chat
from typing import Optional
from fastapi import Body

class RoleDocsChatRequest(BaseModel):
	query: str
	role: Optional[str] = None

@app.post("/role-docs-chat", response_model=ChatResponse)
async def role_docs_chat_endpoint(request: RoleDocsChatRequest = Body(...)):
	try:
		# Use role to select correct embeddings folder
		role_folder = None
		if request.role:
			role_folder = os.path.join("embeddings", request.role)
		# Pass role_folder to interactive_qa if supported
		answer = interactive_qa(request.query, role_folder=role_folder)
		return ChatResponse(answer=answer)
	except Exception as e:
		import traceback
		print("/role-docs-chat error:", traceback.format_exc())
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

# Assign role to user endpoint
from fastapi import Body

class AssignRoleRequest(BaseModel):
	userId: str
	role: str

@app.post("/assign-role")
async def assign_role(request: AssignRoleRequest):
	conn = get_db_connection()
	cur = conn.cursor()
	try:
		cur.execute("UPDATE users SET role=%s WHERE userId=%s", (request.role, request.userId))
		conn.commit()
		return {"success": True}
	except Exception as e:
		return {"success": False, "error": str(e)}
	finally:
		cur.close()
		conn.close()

# Get all users with roles

@app.get("/users")
async def get_users():
	conn = get_db_connection()
	cur = conn.cursor()
	try:
		cur.execute("SELECT userId, name, email, role FROM users WHERE role IS NOT NULL AND role <> ''")
		rows = cur.fetchall()
		users = [
			{"userId": row[0], "name": row[1], "email": row[2], "role": row[3]} for row in rows
		]
		return {"users": users}
	except Exception as e:
		return {"success": False, "error": str(e)}
	finally:
		cur.close()
		conn.close()

# Endpoint to get document names for a role
@app.get("/role-docs")
async def get_role_docs(role: str = Query(...)):
	folder = os.path.join("embeddings", role)
	if not os.path.exists(folder):
		return {"documents": []}
	# List .txt and .npy files, remove extension for display
	docs = []
	for fname in os.listdir(folder):
		if fname.endswith("_chunks.txt") or fname.endswith("_embeddings.npy"):
			docs.append(fname)
	# Optionally, strip suffix for display
	display_docs = set()
	for doc in docs:
		if doc.endswith("_chunks.txt"):
			display_docs.add(doc.replace("_chunks.txt", ""))
		elif doc.endswith("_embeddings.npy"):
			display_docs.add(doc.replace("_embeddings.npy", ""))
	return {"documents": sorted(display_docs)}