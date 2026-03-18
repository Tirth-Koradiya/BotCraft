BotCraft – AI Multi-Chatbots Platform

BotCraft is a modern AI-powered chatbot platform that allows users to interact with specialized assistants like CodeBot, HealthBot, EduBot, and more.

It combines a FastAPI backend with a React frontend to deliver real-time AI-powered conversations.

Features:

-> Multiple AI assistants (CodeBot, HealthBot, EduBot, CreativeBot)

-> FastAPI-powered backend for high performance

-> REST API integration with AI models

-> Real-time chat interface

-> Conversation history tracking

-> Clean and modern UI (React-based)

-> Easy to extend with custom AI models


Setup Instructions:
 
1. Clone the Repository

git clone https://github.com/Tirth-Koradiya/BotCraft.git
cd BotCraft

2. Backend Setup (FastAPI)
cd backend

# Create virtual environment
python -m venv venv

# Activate
venv\Scripts\activate   # Windows 
or
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

3. Add API Key
export HF_API_KEY or OPENAI_API_KEY="your_api_key_here"

4. Run Backend Server
uvicorn main:app --reload

Backend runs at:
http://127.0.0.1:8000

5. Frontend Setup (React)
cd frontend

npm install
npm start

Frontend runs at:
http://localhost:3000

API Example:
POST /chat

{
  "message": "Hello, who are you?"
}

Response:

{
  "response": "Hi! I'm your AI assistant."
}

What I Learned:

Structuring scalable backend APIs

Handling async operations in FastAPI

Integrating AI APIs into real applications

Connecting React frontend with backend services

Debugging real-world API and state issues




#AI #Python #FastAPI #BackendDevelopment #MachineLearning #React #Developers
