from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    COSMOS_URI = os.getenv("COSMOS_URI")
    COSMOS_KEY = os.getenv("COSMOS_KEY")
    COSMOS_DB_NAME = os.getenv("COSMOS_DB_NAME")
    AZURE_STORAGE_CONNECTION_STRING = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
    AZURE_BLOB_CONTAINER = os.getenv("AZURE_BLOB_CONTAINER")
    AZURE_STORAGE_ACCOUNT_NAME = os.getenv("AZURE_STORAGE_ACCOUNT_NAME")

