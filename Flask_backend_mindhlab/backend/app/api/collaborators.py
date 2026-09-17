import time
from flask import Blueprint, request, jsonify
from backend.app.extensions import db
from backend.app.models.content import Collaborator
from backend.app.services.auth_service import extract_token, get_session_from_token, require_admin_auth

collaborators_bp = Blueprint("collaborators", __name__)

def sort_collaborators(items):
    return sorted(items, key=lambda c: (c.order_index if c.order_index is not None else 999))

@collaborators_bp.route("/api/collaborators", methods=["GET"])
def get_collaborators():
    token = extract_token()
    session = get_session_from_token(token)
    is_admin = bool(session)

    query = Collaborator.query
    if not is_admin:
        query = query.filter((Collaborator.published == True) | (Collaborator.published == None))

    items = sort_collaborators(query.all())
    return jsonify({
        "success": True,
        "collaborators": [c.to_dict() for c in items]
    })

@collaborators_bp.route("/api/collaborators", methods=["POST"])
@require_admin_auth
def create_collaborator():
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    category = data.get("category", "").strip()
    location = data.get("location", "").strip()
    description = data.get("description", "").strip()

    if not name or not category or not location or not description:
        return jsonify({
            "success": False,
            "message": "Name, category, location, and description are required."
        }), 400

    new_id = f"collab-{int(time.time() * 1000)}"
    collab = Collaborator(
        id=new_id,
        name=name,
        short_name=data.get("shortName", "").strip() or None,
        category=category,
        location=location,
        logo_url=data.get("logoUrl", "").strip() or "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400",
        description=description,
        joint_focus=data.get("jointFocus", []),
        key_contacts=data.get("keyContacts", []),
        active_trials=data.get("activeTrials", []),
        website_url=data.get("websiteUrl", "").strip() or None,
        is_featured=data.get("isFeatured", True),
        published=data.get("published", True),
        order_index=Collaborator.query.count() + 1,
    )
    db.session.add(collab)
    db.session.commit()

    all_collabs = sort_collaborators(Collaborator.query.all())
    return jsonify({
        "success": True,
        "message": "Collaborator created successfully",
        "collaborator": collab.to_dict(),
        "collaborators": [c.to_dict() for c in all_collabs]
    }), 201

@collaborators_bp.route("/api/collaborators/<string:collab_id>", methods=["PUT"])
@require_admin_auth
def update_collaborator(collab_id):
    collab = Collaborator.query.filter_by(id=collab_id).first()
    if not collab:
        return jsonify({"success": False, "message": f"Collaborator with ID {collab_id} not found."}), 404

    data = request.get_json() or {}
    if "name" in data:
        collab.name = data["name"].strip()
    if "shortName" in data:
        collab.short_name = data["shortName"].strip() or None
    if "category" in data:
        collab.category = data["category"].strip()
    if "location" in data:
        collab.location = data["location"].strip()
    if "logoUrl" in data:
        collab.logo_url = data["logoUrl"].strip()
    if "description" in data:
        collab.description = data["description"].strip()
    if "jointFocus" in data:
        collab.joint_focus = data["jointFocus"]
    if "keyContacts" in data:
        collab.key_contacts = data["keyContacts"]
    if "activeTrials" in data:
        collab.active_trials = data["activeTrials"]
    if "websiteUrl" in data:
        collab.website_url = data["websiteUrl"].strip() or None
    if "isFeatured" in data:
        collab.is_featured = bool(data["isFeatured"])
    if "published" in data:
        collab.published = bool(data["published"])
    if "orderIndex" in data:
        collab.order_index = int(data["orderIndex"])

    db.session.commit()
    all_collabs = sort_collaborators(Collaborator.query.all())
    return jsonify({
        "success": True,
        "message": "Collaborator updated successfully",
        "collaborator": collab.to_dict(),
        "collaborators": [c.to_dict() for c in all_collabs]
    })

@collaborators_bp.route("/api/collaborators/<string:collab_id>", methods=["DELETE"])
@require_admin_auth
def delete_collaborator(collab_id):
    collab = Collaborator.query.filter_by(id=collab_id).first()
    if not collab:
        return jsonify({"success": False, "message": f"Collaborator with ID {collab_id} not found."}), 404

    db.session.delete(collab)
    db.session.commit()

    all_collabs = sort_collaborators(Collaborator.query.all())
    return jsonify({
        "success": True,
        "message": "Collaborator removed successfully",
        "collaborators": [c.to_dict() for c in all_collabs]
    })

@collaborators_bp.route("/api/collaborators-reorder", methods=["PUT"])
@require_admin_auth
def reorder_collaborators():
    data = request.get_json() or {}
    ordered_ids = data.get("orderedIds", [])
    if not isinstance(ordered_ids, list):
        return jsonify({"success": False, "message": "orderedIds must be an array of IDs"}), 400

    items = {c.id: c for c in Collaborator.query.all()}
    for idx, cid in enumerate(ordered_ids):
        if cid in items:
            items[cid].order_index = idx + 1

    db.session.commit()
    all_collabs = sort_collaborators(Collaborator.query.all())
    return jsonify({
        "success": True,
        "message": "Collaborators reordered successfully.",
        "collaborators": [c.to_dict() for c in all_collabs]
    })

@collaborators_bp.route("/api/collaborators/reset", methods=["POST"])
@require_admin_auth
def reset_collaborators():
    from backend.app.services.seed_service import seed_database
    Collaborator.query.delete()
    db.session.commit()
    seed_database()
    all_collabs = sort_collaborators(Collaborator.query.all())
    return jsonify({
        "success": True,
        "message": "Collaborators reset to default initial consortium.",
        "collaborators": [c.to_dict() for c in all_collabs]
    })
