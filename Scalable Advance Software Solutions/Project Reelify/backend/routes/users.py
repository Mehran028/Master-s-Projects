from flask import request
from flask_restful import Resource
from azure.cosmos import CosmosClient, exceptions
from config import Config

# Initialize Cosmos DB client
cosmos_client = CosmosClient(Config.COSMOS_URI, credential=Config.COSMOS_KEY)
database = cosmos_client.get_database_client(Config.COSMOS_DB_NAME)
users_container = database.get_container_client("users")


class Users(Resource):
    def get(self):
        """Endpoint to retrieve all users."""
        users = list(users_container.read_all_items())
        return {"users": users}, 200


class Register(Resource):
    def post(self):
        """Endpoint to register a new user."""
        data = request.json
        email = data.get("email")
        password = data.get("password")
        role = data.get("role")  # Accept role from request without defaulting immediately

        if not email or not password:
            return {"message": "Email and password are required"}, 400

        # Validate role
        if role not in ["admin", "consumer", "creator"]:
            role = "consumer"  # Default to 'consumer' if role is invalid or not provided

        # Check if the user already exists
        try:
            users_container.read_item(email, partition_key=email)
            return {"message": "User already exists"}, 400
        except exceptions.CosmosResourceNotFoundError:
            pass  # User does not exist; continue

        # Create a new user
        user = {
            "id": email,
            "email": email,
            "password": password,
            "role": role,
        }
        users_container.create_item(user)
        return {"message": f"User registered successfully with role {role}"}, 201



class Login(Resource):
    def post(self):
        """Endpoint to authenticate a user."""
        data = request.json
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return {"message": "Email and password are required"}, 400

        # Attempt to retrieve the user
        try:
            user = users_container.read_item(email, partition_key=email)
        except exceptions.CosmosResourceNotFoundError:
            return {"message": "Invalid email or password"}, 401

        # Check if the password matches
        if user["password"] != password:
            return {"message": "Invalid email or password"}, 401

        return {"message": "Login successful", "role": user["role"]}, 200
    
