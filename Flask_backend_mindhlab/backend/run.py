import os
import sys
import subprocess
from pathlib import Path

# Add project root to sys.path so 'backend' package imports work cleanly
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.app import create_app
from backend.app.extensions import db
from backend.app.services.seed_service import seed_database

app = create_app()

def initialize_database():
    with app.app_context():
        db.create_all()
        seed_database()

def ensure_frontend_built():
    dist_index = PROJECT_ROOT / "dist" / "index.html"
    if not dist_index.exists():
        print("[MINDH] dist/index.html not found, building frontend with Vite...")
        try:
            subprocess.run(["npx", "vite", "build"], cwd=str(PROJECT_ROOT), check=True)
            print("[MINDH] Frontend built successfully!")
        except Exception as e:
            print(f"[MINDH] Warning: frontend build failed: {e}")

if __name__ == "__main__":
    print("[MINDH] Initializing Flask Database...")
    initialize_database()
    ensure_frontend_built()

    port = int(os.environ.get("PORT", 3000))
    print(f"[MINDH] Starting Python Flask server on http://0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
