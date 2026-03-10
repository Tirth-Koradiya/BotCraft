from fastapi import APIRouter, HTTPException
from models import SignupRequest, LoginRequest
from database import users_collection
from bson import ObjectId
from pydantic import BaseModel  # ✅ Needed for GoogleSignIn model

auth_router = APIRouter()

@auth_router.post("/signup")
def signup(data: SignupRequest):
    if users_collection.find_one({"username": data.username}):
        raise HTTPException(status_code=400, detail="Username already exists")

    result = users_collection.insert_one({
    "username": data.username,
    "password": data.password,
    "name": data.username.split("@")[0]  # or add it from frontend
})

    return {
        "message": "✅ User created",
        "user_id": str(result.inserted_id)
    }


@auth_router.post("/login")
def login(data: LoginRequest):
    user = users_collection.find_one({"username": data.username, "password": data.password})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {"message": "✅ Login successful", "user_id": str(user["_id"])}

# ✅ Google login request model
class GoogleLoginRequest(BaseModel):
    email: str
    name: str

# ✅ Google Sign-In Endpoint
@auth_router.post("/google-login")
def google_login(data: GoogleLoginRequest):
    user = users_collection.find_one({"email": data.email})

    if user:
        return {"message": "✅ Google login successful", "user_id": str(user["_id"])}

    # If not found, create a new user
    new_user = {
        "email": data.email,
        "name": data.name,
        "auth_type": "google"  # Optional, useful for tracking
    }
    result = users_collection.insert_one(new_user)
    return {"message": "✅ Google account created", "user_id": str(result.inserted_id)}
