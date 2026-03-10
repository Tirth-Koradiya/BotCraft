# models.py
from pydantic import BaseModel

# 🔐 Auth Models
class SignupRequest(BaseModel):
    username: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str

# 💬 Chat Models
class ChatRequest(BaseModel):
    user_id: str
    user_input: str
    bot_type: str
    conversation_id: str 

class ChatResponse(BaseModel):
    bot_response: str




