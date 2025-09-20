from pydantic import BaseModel

from typing import Optional

class CreateEmbeddingsRequest(BaseModel):
    file_path: str
    prefix: str = "default"
    role: Optional[str] = None

class CreateEmbeddingsResponse(BaseModel):
    message: str

class ChatRequest(BaseModel):
    query: str
    prefix: str = "default"

class ChatResponse(BaseModel):
    answer: str
