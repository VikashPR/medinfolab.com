import time
from pathlib import Path
from flask import Blueprint, request, jsonify, current_app
from backend.app.extensions import db
from backend.app.models.content import Facility
from backend.app.services.auth_service import extract_token, get_session_from_token, require_admin_auth
from backend.app.services.seed_service import load_json

facilities_bp = Blueprint("facilities", __name__)

def sort_facilities(items):
    return sorted(items, key=lambda f: (f.order_index if f.order_index is not None else 999))

@facilities_bp.route("/api/facilities", methods=["GET"])
def get_facilities():
    token = extract_token()
    session = get_session_from_token(token)
    is_admin = bool(session)

    query = Facility.query
    if not is_admin:
        query = query.filter((Facility.published == True) | (Facility.published == None))

    items = sort_facilities(query.all())
    return jsonify({
        "success": True,
        "facilities": [f.to_dict() for f in items]
    })

@facilities_bp.route("/api/facilities", methods=["POST"])
@require_admin_auth
def create_facility():
    data = request.get_json() or {}
    title = data.get("title", "").strip()
    tag = data.get("tag", "").strip()
    desc = data.get("desc", "").strip()

    if not title or not tag or not desc:
        return jsonify({"success": False, "message": "Title, tag, and description are required."}), 400

    new_id = f"fac-{int(time.time() * 1000)}"
    fac = Facility(
        id=new_id,
        title=title,
        tag=tag,
        desc=desc,
        specs=data.get("specs", []),
        status=data.get("status", "Operational"),
        icon_name=data.get("iconName"),
        image_url=data.get("imageUrl"),
        published=data.get("published", True),
        order_index=Facility.query.count() + 1,
    )
    db.session.add(fac)
    db.session.commit()

    all_facs = sort_facilities(Facility.query.all())
    return jsonify({
        "success": True,
        "message": "Facility added successfully",
        "facility": fac.to_dict(),
        "facilities": [f.to_dict() for f in all_facs]
    }), 201

@facilities_bp.route("/api/facilities/<string:fac_id>", methods=["PUT"])
@require_admin_auth
def update_facility(fac_id):
    fac = Facility.query.filter_by(id=fac_id).first()
    if not fac:
        return jsonify({"success": False, "message": f"Facility with ID {fac_id} not found."}), 404

    data = request.get_json() or {}
    if "title" in data:
        fac.title = data["title"].strip()
    if "tag" in data:
        fac.tag = data["tag"].strip()
    if "desc" in data:
        fac.desc = data["desc"].strip()
    if "specs" in data:
        fac.specs = data["specs"]
    if "status" in data:
        fac.status = data["status"]
    if "iconName" in data:
        fac.icon_name = data["iconName"]
    if "imageUrl" in data:
        fac.image_url = data["imageUrl"]
    if "published" in data:
        fac.published = bool(data["published"])
    if "orderIndex" in data:
        fac.order_index = int(data["orderIndex"])

    db.session.commit()
    all_facs = sort_facilities(Facility.query.all())
    return jsonify({
        "success": True,
        "message": "Facility updated successfully",
        "facility": fac.to_dict(),
        "facilities": [f.to_dict() for f in all_facs]
    })

@facilities_bp.route("/api/facilities/<string:fac_id>", methods=["DELETE"])
@require_admin_auth
def delete_facility(fac_id):
    fac = Facility.query.filter_by(id=fac_id).first()
    if not fac:
        return jsonify({"success": False, "message": f"Facility with ID {fac_id} not found."}), 404

    db.session.delete(fac)
    db.session.commit()

    all_facs = sort_facilities(Facility.query.all())
    return jsonify({
        "success": True,
        "message": "Facility removed successfully",
        "facilities": [f.to_dict() for f in all_facs]
    })

@facilities_bp.route("/api/facilities-reorder", methods=["PUT"])
@require_admin_auth
def reorder_facilities():
    data = request.get_json() or {}
    ordered_ids = data.get("orderedIds", [])
    if not isinstance(ordered_ids, list):
        return jsonify({"success": False, "message": "orderedIds must be an array of IDs"}), 400

    items = {f.id: f for f in Facility.query.all()}
    for idx, fid in enumerate(ordered_ids):
        if fid in items:
            items[fid].order_index = idx + 1

    db.session.commit()
    all_facs = sort_facilities(Facility.query.all())
    return jsonify({
        "success": True,
        "message": "Facilities reordered successfully.",
        "facilities": [f.to_dict() for f in all_facs]
    })

@facilities_bp.route("/api/facilities/reset", methods=["POST"])
@require_admin_auth
def reset_facilities():
    Facility.query.delete()
    data_dir = Path(current_app.config["DATA_DIR"])
    facs = load_json(data_dir / "facilities.json", [])
    for it in facs:
        db.session.add(Facility(
            id=it["id"],
            title=it["title"],
            tag=it["tag"],
            desc=it["desc"],
            specs=it.get("specs", []),
            status=it.get("status", "Operational"),
            icon_name=it.get("iconName"),
            image_url=it.get("imageUrl"),
            published=it.get("published", True),
            order_index=it.get("orderIndex", 0),
        ))
    db.session.commit()
    all_facs = sort_facilities(Facility.query.all())
    return jsonify({
        "success": True,
        "message": "Facilities reset to defaults.",
        "facilities": [f.to_dict() for f in all_facs]
    })
