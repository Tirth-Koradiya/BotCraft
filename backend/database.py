import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get values from .env
mongo_uri = os.getenv("MONGODB_URI")
db_name = os.getenv("MONGODB_DB")
collection_name = os.getenv("MONGODB_COLLECTION")
users_collection_name = os.getenv("MONGODB_USERS")

# Validate environment variables
if not all([mongo_uri, db_name, collection_name, users_collection_name]):
    raise ValueError("❌ One or more required environment variables are missing in .env.")

# Connect to MongoDB
try:
    client = MongoClient(mongo_uri, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("✅ Connected to MongoDB successfully!")
except Exception as e:
    print("❌ MongoDB connection failed:", e)
    exit()

# Access database and collections
db = client[db_name]
chats_collection = db[collection_name]
users_collection = db[users_collection_name]

# Optional: Insert a test document
# Remove this in production
if __name__ == "__main__":
    result = chats_collection.insert_one({"message": "Connection check successful!"})
    print(f"✅ Document inserted with ID: {result.inserted_id}")
