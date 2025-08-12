from flask import request, jsonify
from flask_restful import Resource
from azure.cosmos import CosmosClient, PartitionKey
from azure.storage.blob import BlobServiceClient, ContentSettings
from config import Config
import uuid
from datetime import datetime
import uuid


# Initialize Azure Blob Storage client
blob_service_client = BlobServiceClient.from_connection_string(Config.AZURE_STORAGE_CONNECTION_STRING)
blob_container_client = blob_service_client.get_container_client(Config.AZURE_BLOB_CONTAINER)

# Initialize Cosmos DB client
cosmos_client = CosmosClient(Config.COSMOS_URI, credential=Config.COSMOS_KEY)
database = cosmos_client.get_database_client(Config.COSMOS_DB_NAME)
videos_container = database.get_container_client("videos")
comments_container = database.get_container_client("comments")

class Videos(Resource):
    def post(self):
        """Upload a video to Azure Blob Storage and store metadata in Cosmos DB."""
        if "file" not in request.files:
            return {"message": "No video file provided"}, 400

        video_file = request.files["file"]
        title = request.form.get("title", "Untitled")
        uploaded_by = request.form.get("uploaded_by", "Anonymous")

        # Generate a unique name for the video in Blob Storage
        unique_filename = f"{uuid.uuid4()}-{video_file.filename}"

        try:
            # Upload the video to Azure Blob Storage
            blob_client = blob_container_client.get_blob_client(unique_filename)
            blob_client.upload_blob(
                video_file,
                content_settings=ContentSettings(content_type=video_file.mimetype),
            )

            # Construct the URL for the uploaded video
            video_url = f"https://{Config.AZURE_STORAGE_ACCOUNT_NAME}.blob.core.windows.net/{Config.AZURE_BLOB_CONTAINER}/{unique_filename}"

            # Add video metadata to Cosmos DB
            video = {
                "id": str(uuid.uuid4()),
                "title": title,
                "video_url": video_url,
                "uploaded_by": uploaded_by,
            }
            videos_container.create_item(video)

            return {"message": "Video uploaded successfully", "video": video}, 201

        except Exception as e:
            return {"message": f"Failed to upload video: {str(e)}"}, 500

    def get(self):
        """Retrieve all videos."""
        videos = list(videos_container.read_all_items())
        return {"videos": videos}, 200

class Comments(Resource):
    def post(self):
        """Add a new comment."""
        data = request.json
        video_id = data.get("video_id")
        user = data.get("user")
        comment = data.get("comment")

        if not video_id or not user or not comment:
            return {"message": "All fields (video_id, user, comment) are required."}, 400

        comment_data = {
            "id": str(uuid.uuid4()),
            "video_id": video_id,
            "user": user,
            "comment": comment,
            "timestamp": datetime.utcnow().isoformat()
        }

        comments_container.create_item(comment_data)
        return {"message": "Comment added successfully"}, 201

    def get(self):
        """Retrieve comments for a specific video."""
        video_id = request.args.get("video_id")
        if not video_id:
            return {"message": "video_id is required as a query parameter."}, 400

        query = f"SELECT * FROM c WHERE c.video_id = @video_id"
        parameters = [{"name": "@video_id", "value": video_id}]
        comments = list(comments_container.query_items(query=query, parameters=parameters, enable_cross_partition_query=True))

        return {"comments": comments}, 200