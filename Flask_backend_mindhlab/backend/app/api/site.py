import time
from flask import Blueprint, request, jsonify
from backend.app.extensions import db
from backend.app.models.site import (
    HomepageConfig,
    AboutConfig,
    ResearchPillar,
    GalleryItem,
    SiteSettings,
)
from backend.app.services.auth_service import extract_token, get_session_from_token, require_admin_auth

site_bp = Blueprint("site", __name__)

# --- Homepage Config ---
@site_bp.route("/api/homepage-config", methods=["GET"])
def get_homepage_config():
    cfg = HomepageConfig.query.filter_by(id="default").first()
    if not cfg:
        return jsonify({"success": True, "config": {}})
    return jsonify({"success": True, "config": cfg.to_dict()})

@site_bp.route("/api/homepage-config", methods=["PUT"])
@require_admin_auth
def update_homepage_config():
    data = request.get_json() or {}
    cfg = HomepageConfig.query.filter_by(id="default").first()
    if not cfg:
        cfg = HomepageConfig(id="default")
        db.session.add(cfg)

    if "heroBadge" in data:
        cfg.hero_badge = data["heroBadge"]
    if "heroTitle" in data:
        cfg.hero_title = data["heroTitle"]
    if "heroHighlight" in data:
        cfg.hero_highlight = data["heroHighlight"]
    if "heroSubtitle" in data:
        cfg.hero_subtitle = data["heroSubtitle"]
    if "stats" in data:
        cfg.stats = data["stats"]
    if "calloutTitle" in data:
        cfg.callout_title = data["calloutTitle"]
    if "calloutSubtitle" in data:
        cfg.callout_subtitle = data["calloutSubtitle"]
    if "calloutButtonText" in data:
        cfg.callout_button_text = data["calloutButtonText"]
    if "calloutButtonLink" in data:
        cfg.callout_button_link = data["calloutButtonLink"]

    db.session.commit()
    return jsonify({"success": True, "message": "Homepage configuration updated", "config": cfg.to_dict()})

# --- About Config ---
@site_bp.route("/api/about-config", methods=["GET"])
def get_about_config():
    cfg = AboutConfig.query.filter_by(id="default").first()
    if not cfg:
        return jsonify({"success": True, "config": {}})
    return jsonify({"success": True, "config": cfg.to_dict()})

@site_bp.route("/api/about-config", methods=["PUT"])
@require_admin_auth
def update_about_config():
    data = request.get_json() or {}
    cfg = AboutConfig.query.filter_by(id="default").first()
    if not cfg:
        cfg = AboutConfig(id="default")
        db.session.add(cfg)

    if "missionTitle" in data:
        cfg.mission_title = data["missionTitle"]
    if "missionDescription" in data:
        cfg.mission_description = data["missionDescription"]
    if "translationPhilosophy" in data:
        cfg.translation_philosophy = data["translationPhilosophy"]
    if "directorName" in data:
        cfg.director_name = data["directorName"]
    if "directorRole" in data:
        cfg.director_role = data["directorRole"]
    if "directorBio" in data:
        cfg.director_bio = data["directorBio"]
    if "directorImage" in data:
        cfg.director_image = data["directorImage"]
    if "milestones" in data:
        cfg.milestones = data["milestones"]

    db.session.commit()
    return jsonify({"success": True, "message": "About configuration updated", "config": cfg.to_dict()})

# --- Research Pillars ---
@site_bp.route("/api/research", methods=["GET"])
def get_research():
    token = extract_token()
    session = get_session_from_token(token)
    is_admin = bool(session)

    query = ResearchPillar.query
    if not is_admin:
        query = query.filter((ResearchPillar.published == True) | (ResearchPillar.published == None))

    items = query.order_by(ResearchPillar.order_index).all()
    return jsonify({"success": True, "pillars": [p.to_dict() for p in items]})

@site_bp.route("/api/research", methods=["POST"])
@require_admin_auth
def create_research():
    data = request.get_json() or {}
    title = data.get("title", "").strip()
    if not title:
        return jsonify({"success": False, "message": "Title is required"}), 400

    pillar = ResearchPillar(
        id=f"research-{int(time.time() * 1000)}",
        title=title,
        subtitle=data.get("subtitle", ""),
        description=data.get("description", ""),
        technologies=data.get("technologies", []),
        metrics=data.get("metrics", []),
        icon=data.get("icon", "Activity"),
        grant_number=data.get("grantNumber"),
        status=data.get("status", "Active"),
        published=data.get("published", True),
        order_index=ResearchPillar.query.count(),
    )
    db.session.add(pillar)
    db.session.commit()
    return jsonify({"success": True, "message": "Research pillar created", "pillar": pillar.to_dict()}), 201

@site_bp.route("/api/research/<string:pillar_id>", methods=["PUT"])
@require_admin_auth
def update_research(pillar_id):
    pillar = ResearchPillar.query.filter_by(id=pillar_id).first()
    if not pillar:
        return jsonify({"success": False, "message": "Research pillar not found"}), 404

    data = request.get_json() or {}
    for key, attr in [
        ("title", "title"), ("subtitle", "subtitle"), ("description", "description"),
        ("technologies", "technologies"), ("metrics", "metrics"), ("icon", "icon"),
        ("grantNumber", "grant_number"), ("status", "status"), ("published", "published"),
        ("orderIndex", "order_index")
    ]:
        if key in data:
            setattr(pillar, attr, data[key])

    db.session.commit()
    return jsonify({"success": True, "message": "Research pillar updated", "pillar": pillar.to_dict()})

@site_bp.route("/api/research/<string:pillar_id>", methods=["DELETE"])
@require_admin_auth
def delete_research(pillar_id):
    pillar = ResearchPillar.query.filter_by(id=pillar_id).first()
    if not pillar:
        return jsonify({"success": False, "message": "Research pillar not found"}), 404

    db.session.delete(pillar)
    db.session.commit()
    return jsonify({"success": True, "message": "Research pillar deleted"})

# --- Gallery Items ---
@site_bp.route("/api/gallery", methods=["GET"])
def get_gallery():
    token = extract_token()
    session = get_session_from_token(token)
    is_admin = bool(session)

    query = GalleryItem.query
    if not is_admin:
        query = query.filter((GalleryItem.published == True) | (GalleryItem.published == None))

    items = query.order_by(GalleryItem.order_index).all()
    return jsonify({"success": True, "items": [g.to_dict() for g in items]})

@site_bp.route("/api/gallery", methods=["POST"])
@require_admin_auth
def create_gallery_item():
    data = request.get_json() or {}
    title = data.get("title", "").strip()
    image_url = data.get("imageUrl", "").strip()
    if not title or not image_url:
        return jsonify({"success": False, "message": "Title and imageUrl are required"}), 400

    item = GalleryItem(
        id=f"gal-{int(time.time() * 1000)}",
        title=title,
        caption=data.get("caption", ""),
        category=data.get("category", "Experimental Setup"),
        image_url=image_url,
        date=data.get("date"),
        published=data.get("published", True),
        order_index=GalleryItem.query.count(),
    )
    db.session.add(item)
    db.session.commit()
    return jsonify({"success": True, "message": "Gallery item created", "item": item.to_dict()}), 201

@site_bp.route("/api/gallery/<string:item_id>", methods=["PUT"])
@require_admin_auth
def update_gallery_item(item_id):
    item = GalleryItem.query.filter_by(id=item_id).first()
    if not item:
        return jsonify({"success": False, "message": "Gallery item not found"}), 404

    data = request.get_json() or {}
    for key, attr in [
        ("title", "title"), ("caption", "caption"), ("category", "category"),
        ("imageUrl", "image_url"), ("date", "date"), ("published", "published"),
        ("orderIndex", "order_index")
    ]:
        if key in data:
            setattr(item, attr, data[key])

    db.session.commit()
    return jsonify({"success": True, "message": "Gallery item updated", "item": item.to_dict()})

@site_bp.route("/api/gallery/<string:item_id>", methods=["DELETE"])
@require_admin_auth
def delete_gallery_item(item_id):
    item = GalleryItem.query.filter_by(id=item_id).first()
    if not item:
        return jsonify({"success": False, "message": "Gallery item not found"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"success": True, "message": "Gallery item deleted"})

# --- Site Settings ---
@site_bp.route("/api/settings", methods=["GET"])
def get_settings():
    sett = SiteSettings.query.filter_by(id="default").first()
    if not sett:
        return jsonify({"success": True, "settings": {}})
    return jsonify({"success": True, "settings": sett.to_dict()})

@site_bp.route("/api/settings", methods=["PUT"])
@require_admin_auth
def update_settings():
    data = request.get_json() or {}
    sett = SiteSettings.query.filter_by(id="default").first()
    if not sett:
        sett = SiteSettings(id="default")
        db.session.add(sett)

    if "labName" in data:
        sett.lab_name = data["labName"]
    if "tagline" in data:
        sett.tagline = data["tagline"]
    if "contactEmail" in data:
        sett.contact_email = data["contactEmail"]
    if "contactPhone" in data:
        sett.contact_phone = data["contactPhone"]
    if "address" in data:
        sett.address = data["address"]
    if "roomLocation" in data:
        sett.room_location = data["roomLocation"]
    if "visitingHours" in data:
        sett.visiting_hours = data["visitingHours"]
    if "socialLinks" in data:
        sett.social_links = data["socialLinks"]

    db.session.commit()
    return jsonify({"success": True, "message": "Site settings updated successfully", "settings": sett.to_dict()})
