import time
from datetime import datetime
from flask import Blueprint, request, jsonify
from backend.app.extensions import db
from backend.app.models.content import ContactInquiry
from backend.app.services.auth_service import require_admin_auth

contact_bp = Blueprint("contact", __name__)

@contact_bp.route("/api/contact", methods=["GET"])
def get_contact_inquiries():
    inquiries = ContactInquiry.query.order_by(ContactInquiry.created_at.desc()).all()
    return jsonify({
        "success": True,
        "inquiries": [i.to_dict() for i in inquiries]
    })

@contact_bp.route("/api/contact", methods=["POST"])
def submit_contact_inquiry():
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    message = data.get("message", "").strip()

    if not name or not email or not message:
        return jsonify({"success": False, "message": "Name, email, and message are required."}), 400

    new_id = f"inq-{int(time.time() * 1000)}"
    inquiry = ContactInquiry(
        id=new_id,
        name=name,
        email=email,
        affiliation=data.get("affiliation", "").strip() or None,
        role=data.get("role", "").strip() or None,
        interest_type=data.get("interestType", "General Inquiry").strip(),
        message=message,
        created_at=datetime.utcnow().isoformat(),
        status="New",
    )
    db.session.add(inquiry)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Thank you for contacting MINDH Lab! Your inquiry has been securely logged and our team will get in touch shortly.",
        "inquiry": inquiry.to_dict()
    }), 201

# Admin specific endpoints for inquiries
@contact_bp.route("/api/admin/inquiries", methods=["GET"])
@require_admin_auth
def admin_get_inquiries():
    inquiries = ContactInquiry.query.order_by(ContactInquiry.created_at.desc()).all()
    return jsonify({
        "success": True,
        "inquiries": [i.to_dict() for i in inquiries]
    })

@contact_bp.route("/api/admin/inquiries/<string:inq_id>/status", methods=["PATCH", "PUT"])
@require_admin_auth
def admin_update_inquiry_status(inq_id):
    inquiry = ContactInquiry.query.filter_by(id=inq_id).first()
    if not inquiry:
        return jsonify({"success": False, "message": f"Inquiry with ID {inq_id} not found."}), 404

    data = request.get_json() or {}
    status = data.get("status", "").strip()
    if not status:
        return jsonify({"success": False, "message": "Status is required."}), 400

    inquiry.status = status
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Status updated successfully",
        "inquiry": inquiry.to_dict()
    })

@contact_bp.route("/api/admin/inquiries/<string:inq_id>", methods=["DELETE"])
@require_admin_auth
def admin_delete_inquiry(inq_id):
    inquiry = ContactInquiry.query.filter_by(id=inq_id).first()
    if not inquiry:
        return jsonify({"success": False, "message": f"Inquiry with ID {inq_id} not found."}), 404

    db.session.delete(inquiry)
    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Inquiry deleted successfully"
    })
