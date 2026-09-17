import time
from datetime import datetime
from flask import Blueprint, request, jsonify
from backend.app.extensions import db
from backend.app.models.content import NewsItem
from backend.app.services.auth_service import extract_token, get_session_from_token, require_admin_auth

news_bp = Blueprint("news", __name__)

def sort_news(items):
    # Sort primarily by date descending, or order_index
    return sorted(items, key=lambda x: (x.date or ""), reverse=True)

@news_bp.route("/api/news", methods=["GET"])
def get_news():
    token = extract_token()
    session = get_session_from_token(token)
    is_admin = bool(session)

    query = NewsItem.query
    if not is_admin:
        query = query.filter((NewsItem.published == True) | (NewsItem.published == None))

    items = query.all()
    sorted_items = sort_news(items)
    return jsonify({
        "success": True,
        "news": [it.to_dict() for it in sorted_items]
    })

@news_bp.route("/api/news", methods=["POST"])
@require_admin_auth
def create_news():
    data = request.get_json() or {}
    title = data.get("title", "").strip()
    description = data.get("description", "").strip()

    if not title or not description:
        return jsonify({"success": False, "message": "Title and description are required"}), 400

    now_iso = datetime.utcnow().isoformat()
    new_id = f"news-{int(time.time() * 1000)}"

    item = NewsItem(
        id=new_id,
        title=title,
        description=description,
        summary=data.get("summary") or (description[:160] + "..."),
        image=data.get("image") or "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800",
        date=data.get("date") or datetime.utcnow().strftime("%Y-%m-%d"),
        category=data.get("category", "Lab Update"),
        link_text=data.get("linkText"),
        link_url=data.get("linkUrl"),
        published=data.get("published", True),
        order_index=data.get("orderIndex", 0),
        created_at=now_iso,
        updated_at=now_iso,
    )
    db.session.add(item)
    db.session.commit()

    all_items = sort_news(NewsItem.query.all())
    return jsonify({
        "success": True,
        "message": "News item published successfully",
        "item": item.to_dict(),
        "news": [it.to_dict() for it in all_items]
    }), 201

@news_bp.route("/api/news/<string:item_id>", methods=["PUT"])
@require_admin_auth
def update_news(item_id):
    item = NewsItem.query.filter_by(id=item_id).first()
    if not item:
        return jsonify({"success": False, "message": f"News item with ID {item_id} not found"}), 404

    data = request.get_json() or {}
    if "title" in data:
        item.title = data["title"].strip()
    if "description" in data:
        item.description = data["description"].strip()
    if "summary" in data:
        item.summary = data["summary"]
    if "image" in data:
        item.image = data["image"]
    if "date" in data:
        item.date = data["date"]
    if "category" in data:
        item.category = data["category"]
    if "linkText" in data:
        item.link_text = data["linkText"]
    if "linkUrl" in data:
        item.link_url = data["linkUrl"]
    if "published" in data:
        item.published = bool(data["published"])
    if "orderIndex" in data:
        item.order_index = int(data["orderIndex"])

    item.updated_at = datetime.utcnow().isoformat()
    db.session.commit()

    all_items = sort_news(NewsItem.query.all())
    return jsonify({
        "success": True,
        "message": "News item updated successfully",
        "item": item.to_dict(),
        "news": [it.to_dict() for it in all_items]
    })

@news_bp.route("/api/news/<string:item_id>", methods=["DELETE"])
@require_admin_auth
def delete_news(item_id):
    item = NewsItem.query.filter_by(id=item_id).first()
    if not item:
        return jsonify({"success": False, "message": f"News item with ID {item_id} not found"}), 404

    db.session.delete(item)
    db.session.commit()

    all_items = sort_news(NewsItem.query.all())
    return jsonify({
        "success": True,
        "message": "News item deleted successfully",
        "news": [it.to_dict() for it in all_items]
    })

@news_bp.route("/api/news-reorder", methods=["PUT"])
@require_admin_auth
def reorder_news():
    data = request.get_json() or {}
    ordered_ids = data.get("orderedIds", [])
    if not isinstance(ordered_ids, list):
        return jsonify({"success": False, "message": "orderedIds must be an array of IDs"}), 400

    items = {it.id: it for it in NewsItem.query.all()}
    for idx, item_id in enumerate(ordered_ids):
        if item_id in items:
            items[item_id].order_index = idx + 1

    db.session.commit()
    all_items = NewsItem.query.order_by(NewsItem.order_index).all()
    return jsonify({
        "success": True,
        "message": "News items reordered successfully.",
        "news": [it.to_dict() for it in all_items]
    })

@news_bp.route("/api/news/reset", methods=["POST"])
def reset_news():
    token = extract_token()
    session = get_session_from_token(token)
    # Allow reset from either admin or development reset button
    from backend.app.services.seed_service import load_json
    from pathlib import Path
    from flask import current_app

    NewsItem.query.delete()
    data_dir = Path(current_app.config["DATA_DIR"])
    items = load_json(data_dir / "news.json", [])
    for it in items:
        db.session.add(NewsItem(
            id=it["id"],
            title=it["title"],
            description=it["description"],
            summary=it.get("summary"),
            image=it.get("image"),
            date=it.get("date"),
            category=it.get("category"),
            link_text=it.get("linkText"),
            link_url=it.get("linkUrl"),
            published=it.get("published", True),
            order_index=it.get("orderIndex", 0),
            created_at=it.get("createdAt"),
            updated_at=it.get("updatedAt"),
        ))
    db.session.commit()
    all_items = sort_news(NewsItem.query.all())
    return jsonify({
        "success": True,
        "message": "News data reset to defaults",
        "news": [it.to_dict() for it in all_items]
    })
