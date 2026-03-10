# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from chat_logic import chat_router
from auth import auth_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include both routers
app.include_router(auth_router)
app.include_router(chat_router)
