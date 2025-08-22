from pydantic import BaseModel

class CreateEmbeddingsRequest(BaseModel):
    file_path: str
    prefix: str = "default"

class CreateEmbeddingsResponse(BaseModel):
    message: str

class ChatRequest(BaseModel):
    query: str
    prefix: str = "default"

class ChatResponse(BaseModel):
    answer: str
