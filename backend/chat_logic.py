from dotenv import load_dotenv
import os
import httpx
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query
from dotenv import load_dotenv
from database import chats_collection
from models import ChatRequest, ChatResponse
from bson import ObjectId



load_dotenv()

chat_router = APIRouter()







HF_API_KEY = os.getenv("HF_API_KEY")

MODEL_MAP = {
    "coding": "openai/gpt-oss-safeguard-20b",
    "healthcare": "openai/gpt-oss-safeguard-20b",
    "learning": "openai/gpt-oss-safeguard-20b",
    "creative": "openai/gpt-oss-safeguard-20b"
}

async def get_bot_reply(user_input: str, bot_type: str) -> str:

    model = MODEL_MAP.get(bot_type, "meta-llama/Meta-Llama-3-8B-Instruct")

    print("BOT TYPE:", bot_type)
    print("MODEL:", model)

    url = "https://router.huggingface.co/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {HF_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": model,
        "messages": [
            {"role": "user", "content": user_input}
        ]
    }

    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(url, headers=headers, json=payload)

        print("HF STATUS:", response.status_code)
        print("HF RAW RESPONSE:", response.text)

        if response.status_code != 200:
            return "Hugging Face API error."

        result = response.json()

        return result["choices"][0]["message"]["content"]

    except Exception as e:
        import traceback
        traceback.print_exc()
        return "AI service unavailable."

@chat_router.post("/chatbot/ask", response_model=ChatResponse)
async def chatbot_ask(request: ChatRequest):
    try:
        reply = await get_bot_reply(request.user_input, request.bot_type)

        chats_collection.insert_one({
            "user_id": request.user_id,
            "conversation_id": request.conversation_id,
            "user_input": request.user_input,
            "bot_type": request.bot_type,
            "bot_response": reply,
            "timestamp": datetime.utcnow()
        })

        return {"bot_response": reply}
    except httpx.HTTPStatusError as http_err:
        print("HuggingFace HTTP Error:", http_err.response.text)
        return {"bot_response": "HuggingFace API returned an error."}
    except Exception as e:
        import traceback
        print("HF API ERROR:")
        traceback.print_exc()
        return "Sorry, AI service unavailable."
    



@chat_router.get("/chatbot/history")
def get_chat_history(user_id: str = Query(...)):
    try:
        docs = chats_collection.find({"user_id": user_id}).sort("timestamp", 1)
        grouped = {}

        for doc in docs:
            conv_id = doc.get("conversation_id", "default")

            if conv_id not in grouped:
                grouped[conv_id] = {
                    "id": conv_id,
                    "title": f"Restored {doc.get('bot_type', 'chat')} chat",
                    "botType": doc.get("bot_type", "coding"),
                    "updatedAt": doc["timestamp"],
                    "messages": []
                }

            grouped[conv_id]["messages"].append({
                "id": str(ObjectId()),
                "content": doc["user_input"],
                "sender": "user",
                "timestamp": doc["timestamp"]
            })
            grouped[conv_id]["messages"].append({
                "id": str(ObjectId()),
                "content": doc["bot_response"],
                "sender": "bot",
                "timestamp": doc["timestamp"]
            })

        return list(grouped.values())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not load history: {str(e)}")


@chat_router.delete("/chatbot/delete")
def delete_conversation(
    user_id: str = Query(...),
    conversation_id: str = Query(...)
):
    result = chats_collection.delete_many({
        "user_id": user_id,
        "conversation_id": conversation_id
    })

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="No conversation found.")

    return {"message": "Conversation deleted."}

