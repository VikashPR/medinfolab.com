from datetime import datetime
from flask import Blueprint, request, jsonify, g, make_response
from backend.app.extensions import db
from backend.app.models.auth import AdminUser, AdminSession
from backend.app.services.auth_service import extract_token, get_session_from_token, require_admin_auth

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username or not password:
        return jsonify({"success": False, "message": "Username and password are required."}), 400

    user = AdminUser.query.filter((AdminUser.username == username) | (AdminUser.email == username)).first()
    if not user or not user.check_password(password):
        return jsonify({"success": False, "message": "Invalid username or password. Please verify credentials."}), 401

    user.last_login = datetime.utcnow()
    session = AdminSession.create_session(user)

    resp = make_response(jsonify({
        "success": True,
        "message": "Authentication successful. Welcome to MINDH Lab Admin.",
        "token": session.token,
        "user": user.to_dict(),
    }), 200)

    # Set cookie for browser sessions
    resp.set_cookie(
        "mindh_admin_token",
        session.token,
        max_age=24 * 60 * 60,
        httponly=False,
        samesite="Lax",
        path="/"
    )
    return resp

@auth_bp.route("/api/auth/logout", methods=["POST"])
def logout():
    token = extract_token()
    if token:
        AdminSession.query.filter_by(token=token).delete()
        db.session.commit()

    resp = make_response(jsonify({"success": True, "message": "Logged out successfully"}), 200)
    resp.delete_cookie("mindh_admin_token", path="/")
    return resp

@auth_bp.route("/api/auth/me", methods=["GET"])
@require_admin_auth
def get_current_user():
    return jsonify({
        "success": True,
        "user": g.current_user.to_dict() if g.current_user else {
            "id": g.admin_session.user_id,
            "username": g.admin_session.username,
            "role": g.admin_session.role,
        }
    })

@auth_bp.route("/api/auth/change-password", methods=["POST"])
@require_admin_auth
def change_password():
    data = request.get_json() or {}
    current_pwd = data.get("currentPassword", "")
    new_pwd = data.get("newPassword", "")

    if not current_pwd or not new_pwd:
        return jsonify({"success": False, "message": "Current password and new password are required."}), 400

    if len(new_pwd) < 8:
        return jsonify({"success": False, "message": "New password must be at least 8 characters long."}), 400

    user = g.current_user
    if not user:
        return jsonify({"success": False, "message": "User not found."}), 404

    if not user.check_password(current_pwd):
        return jsonify({"success": False, "message": "Incorrect current password."}), 400

    user.set_password(new_pwd)
    db.session.commit()

    return jsonify({"success": True, "message": "Password updated successfully."})
