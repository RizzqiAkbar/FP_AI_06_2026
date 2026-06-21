import os
from flask import Flask
from flask_cors import CORS
from config import Config
from routes.analyze import analyze_bp
from dotenv import load_dotenv

load_dotenv()

def create_app():
    """Create and configure the Flask application."""
    app = Flask(__name__)
    app.config.from_object(Config)

    # Initialize cache DB
    from utils.cache import init_db
    init_db()

    # Enable CORS for frontend integration
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Ensure upload folder exists
    os.makedirs(app.config.get("UPLOAD_FOLDER", "uploads"), exist_ok=True)

    # Register blueprints
    app.register_blueprint(analyze_bp, url_prefix="/api")

    # Health check endpoint
    @app.route("/")
    def home():
        return {"status": "running", "app": "Nutria AI Backend"}

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=app.config.get("DEBUG", True), host="0.0.0.0", port=5000)
