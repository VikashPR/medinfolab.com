from flask import jsonify, request, send_from_directory, current_app
from pathlib import Path

def register_error_handlers(app):
    @app.errorhandler(400)
    def bad_request(error):
        if request.path.startswith("/api/"):
            return jsonify({"success": False, "message": getattr(error, "description", "Bad request")}), 400
        return jsonify({"success": False, "message": "Bad request"}), 400

    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({
            "success": False,
            "message": getattr(error, "description", "Unauthorized: Authentication required")
        }), 401

    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({
            "success": False,
            "message": getattr(error, "description", "Forbidden: Access denied")
        }), 403

    @app.errorhandler(404)
    def not_found(error):
        if request.path.startswith("/api/"):
            return jsonify({"success": False, "message": f"Endpoint {request.path} not found"}), 404

        # For non-API routes, serve SPA index.html
        dist_dir = Path(app.config["FRONTEND_DIST_DIR"])
        index_file = dist_dir / "index.html"
        if index_file.exists():
            return send_from_directory(dist_dir, "index.html")
        return jsonify({"success": False, "message": "Resource not found"}), 404

    @app.errorhandler(413)
    def payload_too_large(error):
        return jsonify({"success": False, "message": "Uploaded file payload is too large (max 10MB)"}), 413

    @app.errorhandler(500)
    def internal_server_error(error):
        return jsonify({
            "success": False,
            "message": "An internal server error occurred.",
            "error": str(error) if app.debug else None
        }), 500
