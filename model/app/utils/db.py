from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

try:
    # Connect to MongoDB
    client = MongoClient(MONGO_URI)
    db = client.get_database('test')  # Automatically fetch the database from URI
    print("MongoDB Atlas connected successfully!")
except Exception as e:
    print(f"Error connecting to database: {e}")
