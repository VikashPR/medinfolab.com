import os
import re
import time
import secrets
import base64
from pathlib import Path
from flask import current_app
from werkzeug.utils import secure_filename

def get_uploads_dir() -> Path:
    uploads_dir = Path(current_app.config["UPLOADS_DIR"])
    uploads_dir.mkdir(parents=True, exist_ok=True)
    return uploads_dir

def process_file_upload(data: dict) -> tuple[dict, int]:
    """Processes base64 file upload from admin client."""
    base64_data = data.get("base64Data")
    mime_type = data.get("mimeType", "").lower().strip()
    raw_filename = data.get("filename", "uploaded_file")

    if not base64_data or not mime_type:
        return {"success": False, "message": "Missing base64Data or mimeType in request body."}, 400

    allowed_types = current_app.config["ALLOWED_MIME_TYPES"]
    if mime_type not in allowed_types:
        return {
            "success": False,
            "message": f"File type '{mime_type}' is not permitted. Allowed types: JPG, PNG, WEBP, GIF, SVG, PDF."
        }, 400

    # Clean data URL prefix if included
    clean_base64 = re.sub(r"^data:[^;]+;base64,", "", base64_data)

    try:
        file_bytes = base64.b64decode(clean_base64)
    except Exception as e:
        return {"success": False, "message": f"Corrupted base64 payload: {str(e)}"}, 400

    max_bytes = 10 * 1024 * 1024  # 10 MB
    if len(file_bytes) > max_bytes:
        size_mb = len(file_bytes) / (1024 * 1024)
        return {"success": False, "message": f"File exceeds maximum allowed size of 10MB (actual: {size_mb:.2f} MB)."}, 400

    # Sanitize filename
    safe_name = secure_filename(raw_filename) or "upload"
    base_name, ext = os.path.splitext(safe_name)
    if not ext:
        ext = ".pdf" if mime_type == "application/pdf" else ".png"

    unique_filename = f"{int(time.time() * 1000)}-{secrets.token_hex(4)}-{base_name}{ext}"
    uploads_dir = get_uploads_dir()
    target_path = uploads_dir / unique_filename

    with open(target_path, "wb") as f:
        f.write(file_bytes)

    public_url = f"/uploads/{unique_filename}"
    return {
        "success": True,
        "message": "File uploaded successfully",
        "url": public_url,
        "filename": unique_filename,
        "size": len(file_bytes),
        "mimeType": mime_type,
    }, 201

def process_file_delete(url: str) -> tuple[dict, int]:
    """Safely deletes an uploaded file from disk."""
    if not url or not isinstance(url, str):
        return {"success": False, "message": "Missing file url to delete"}, 400

    if not url.startswith("/uploads/"):
        return {"success": False, "message": "Invalid uploads path"}, 400

    filename = os.path.basename(url)
    uploads_dir = get_uploads_dir()
    target_path = (uploads_dir / filename).resolve()

    # Prevent directory traversal
    if not str(target_path).startswith(str(uploads_dir.resolve())):
        return {"success": False, "message": "Invalid file path traversal attempt"}, 400

    if target_path.exists() and target_path.is_file():
        target_path.unlink()
        return {"success": True, "message": f"File {filename} deleted successfully."}, 200
    else:
        return {"success": True, "message": "File already removed or not found."}, 200
