import os
from pathlib import Path
from dotenv import load_dotenv

# Base directory is the project root (one level up from backend)
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env file from project root if present
load_dotenv(BASE_DIR / ".env")

class Config:
    """Base application configuration."""
    SECRET_KEY = os.environ.get("FLASK_SECRET_KEY", "mindh-lab-super-secret-key-2024-change-in-prod")
    DATA_DIR = os.environ.get("DATA_DIR", str(BASE_DIR / "data"))
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(DATA_DIR, 'mindh.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Upload settings
    UPLOADS_DIR = os.environ.get("UPLOADS_DIR", str(BASE_DIR / "public" / "uploads"))
    MAX_CONTENT_LENGTH = 15 * 1024 * 1024  # 15 MB
    ALLOWED_MIME_TYPES = {
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/svg+xml",
        "application/pdf",
    }
    
    # Session duration
    SESSION_DURATION_HOURS = 24
    
    # Frontend build directory
    FRONTEND_DIST_DIR = str(BASE_DIR / "dist")

class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    """Testing configuration with in-memory database."""
    DEBUG = True
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"

config_by_name = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
    "default": DevelopmentConfig,
}
