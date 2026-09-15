from functools import wraps
from flask import request, jsonify, g
from datetime import datetime
from backend.app.models.auth import AdminSession, AdminUser

def extract_token() -> str | None:
    """Extracts session token from Authorization header or cookie."""
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        return auth_header[7:].strip()

    cookie_token = request.cookies.get("mindh_admin_token")
    if cookie_token:
        return cookie_token.strip()

    return None

def get_session_from_token(token: str | None) -> AdminSession | None:
    if not token:
        return None
    session = AdminSession.query.filter_by(token=token).first()
    if not session or not session.is_valid():
        return None
    return session

def require_admin_auth(f):
    """Decorator to enforce administrator authentication on protected endpoints."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = extract_token()
        session = get_session_from_token(token)
        if not session:
            return jsonify({
                "success": False,
                "message": "Unauthorized: Administrator authentication required to perform this action."
            }), 401
        
        user = AdminUser.query.filter_by(id=session.user_id).first()
        g.admin_session = session
        g.current_user = user
        return f(*args, **kwargs)
    return decorated_function
