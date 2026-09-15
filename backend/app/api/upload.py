from flask import Blueprint, request, jsonify, send_from_directory, current_app
from backend.app.services.auth_service import require_admin_auth
from backend.app.services.upload_service import process_file_upload, process_file_delete, get_uploads_dir

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/api/admin/upload", methods=["POST"])
@require_admin_auth
def admin_upload_file():
    # Check if multipart form
    if "file" in request.files:
        f = request.files["file"]
        import base64
        file_bytes = f.read()
        b64 = base64.b64encode(file_bytes).decode("utf-8")
        data = {
            "filename": f.filename,
            "mimeType": f.content_type or "application/octet-stream",
            "base64Data": b64,
        }
        res, status = process_file_upload(data)
        return jsonify(res), status

    # JSON base64 upload
    data = request.get_json() or {}
    res, status = process_file_upload(data)
    return jsonify(res), status

@upload_bp.route("/api/admin/upload", methods=["DELETE"])
@require_admin_auth
def admin_delete_file():
    data = request.get_json() or {}
    url = data.get("url")
    res, status = process_file_delete(url)
    return jsonify(res), status

@upload_bp.route("/uploads/<path:filename>", methods=["GET"])
def serve_upload(filename):
    uploads_dir = get_uploads_dir()
    return send_from_directory(uploads_dir, filename)
