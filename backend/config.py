import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Application configuration."""

    # Flask
    DEBUG = os.getenv("FLASK_DEBUG", "True").lower() in ("true", "1")
    SECRET_KEY = os.getenv("SECRET_KEY", "nutria-dev-key")

    # Upload settings
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads")
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10 MB
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "bmp", "tiff"}

    # Tesseract path
    # Docker (Linux): /usr/bin/tesseract
    # Windows: C:\Program Files\Tesseract-OCR\tesseract.exe
    TESSERACT_CMD = os.getenv("TESSERACT_CMD", r"C:\Program Files\Tesseract-OCR\tesseract.exe")

    # Gemini API Key (dipakai oleh Anggota 3)
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
