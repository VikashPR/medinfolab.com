import os
from pathlib import Path
from flask import Flask, send_from_directory, jsonify, request
from backend.config import config_by_name, Config
from backend.app.extensions import db, migrate, cors
from backend.app.api import all_blueprints
from backend.app.errors.handlers import register_error_handlers

def create_app(config_name=None):
    """Application factory for MINDH Lab Flask Backend."""
    if config_name is None:
        config_name = os.environ.get("FLASK_ENV", "development")

    config_class = config_by_name.get(config_name, Config)

    app = Flask(__name__, static_folder=None)
    app.config.from_object(config_class)

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    # Register blueprints
    for bp in all_blueprints:
        app.register_blueprint(bp)

    # Register error handlers
    register_error_handlers(app)

    # Health check
    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({
            "status": "ok",
            "service": "MINDH Laboratory Backend",
            "runtime": "Python Flask",
            "version": "1.0.0"
        })

    # SPA and static frontend handling
    dist_dir = Path(app.config["FRONTEND_DIST_DIR"])

    @app.route("/assets/<path:filename>")
    def serve_dist_assets(filename):
        assets_dir = dist_dir / "assets"
        return send_from_directory(assets_dir, filename)

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend_spa(path):
        # Do not catch API routes or uploads
        if path.startswith("api/") or path.startswith("uploads/"):
            return jsonify({"success": False, "message": f"Resource /{path} not found"}), 404

        target_file = dist_dir / path
        if path and target_file.exists() and target_file.is_file():
            return send_from_directory(dist_dir, path)

        # Fallback to SPA index.html
        index_file = dist_dir / "index.html"
        if index_file.exists():
            return send_from_directory(dist_dir, "index.html")

        return """
        <!DOCTYPE html>
        <html>
        <head><title>MINDH Lab</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h2>MINDH Lab Backend Active</h2>
            <p>Building frontend assets... please refresh momentarily.</p>
        </body>
        </html>
        """

    return app
