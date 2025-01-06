from flask import Flask, jsonify
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)  # Enable CORS

    # Import and register blueprints
    from .routes import review_routes
    app.register_blueprint(review_routes)

    # Home route
    @app.route('/')
    def home():
        return jsonify({"message": "Welcome to the Flask App! The server is running."})

    return app