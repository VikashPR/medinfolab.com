import time
from pathlib import Path
from datetime import datetime
from flask import Blueprint, request, jsonify, current_app
from backend.app.extensions import db
from backend.app.models.content import Publication
from backend.app.services.auth_service import extract_token, get_session_from_token, require_admin_auth
from backend.app.services.seed_service import load_json

publications_bp = Blueprint("publications", __name__)

def sort_publications(items):
    # Sort by year descending, then order_index
    return sorted(items, key=lambda p: (-(p.year or 0), p.order_index if p.order_index is not None else 999))

@publications_bp.route("/api/publications", methods=["GET"])
def get_publications():
    token = extract_token()
    session = get_session_from_token(token)
    is_admin = bool(session)

    query = Publication.query
    if not is_admin:
        query = query.filter((Publication.published == True) | (Publication.published == None))

    items = sort_publications(query.all())
    return jsonify({
        "success": True,
        "publications": [p.to_dict() for p in items]
    })

@publications_bp.route("/api/publications", methods=["POST"])
@require_admin_auth
def create_publication():
    data = request.get_json() or {}
    title = data.get("title", "").strip()
    authors = data.get("authors", "").strip()
    journal = data.get("journal", "").strip()
    year = data.get("year")
    topic = data.get("topic", "").strip()
    abstract = data.get("abstract", "").strip()

    if not title or not authors or not journal or not year or not topic or not abstract:
        return jsonify({
            "success": False,
            "message": "Title, authors, journal, year, topic, and abstract are required."
        }), 400

    new_id = f"pub-{int(time.time() * 1000)}"
    pub = Publication(
        id=new_id,
        title=title,
        authors=authors,
        journal=journal,
        year=int(year),
        topic=topic,
        doi_url=data.get("doiUrl", "#").strip() or "#",
        pdf_url=data.get("pdfUrl", "#").strip() or "#",
        code_url=data.get("codeUrl", "").strip() or None,
        abstract=abstract,
        highlight=data.get("highlight", "").strip() or None,
        bibtex=data.get("bibtex", "").strip() or f"@article{{mindh{int(time.time())},\n  title={{{title}}},\n  author={{{authors}}},\n  journal={{{journal}}},\n  year={{{year}}}\n}}",
        published=data.get("published", True),
        order_index=0,
        created_at=datetime.utcnow().isoformat(),
    )
    db.session.add(pub)
    db.session.commit()

    all_pubs = sort_publications(Publication.query.all())
    return jsonify({
        "success": True,
        "message": "Publication added successfully",
        "publication": pub.to_dict(),
        "publications": [p.to_dict() for p in all_pubs]
    }), 201

@publications_bp.route("/api/publications/<string:pub_id>", methods=["PUT"])
@require_admin_auth
def update_publication(pub_id):
    pub = Publication.query.filter_by(id=pub_id).first()
    if not pub:
        return jsonify({"success": False, "message": f"Publication with ID {pub_id} not found."}), 404

    data = request.get_json() or {}
    if "title" in data:
        pub.title = data["title"].strip()
    if "authors" in data:
        pub.authors = data["authors"].strip()
    if "journal" in data:
        pub.journal = data["journal"].strip()
    if "year" in data:
        pub.year = int(data["year"])
    if "topic" in data:
        pub.topic = data["topic"].strip()
    if "doiUrl" in data:
        pub.doi_url = data["doiUrl"]
    if "pdfUrl" in data:
        pub.pdf_url = data["pdfUrl"]
    if "codeUrl" in data:
        pub.code_url = data["codeUrl"]
    if "abstract" in data:
        pub.abstract = data["abstract"].strip()
    if "highlight" in data:
        pub.highlight = data["highlight"]
    if "bibtex" in data:
        pub.bibtex = data["bibtex"]
    if "published" in data:
        pub.published = bool(data["published"])
    if "orderIndex" in data:
        pub.order_index = int(data["orderIndex"])

    db.session.commit()
    all_pubs = sort_publications(Publication.query.all())
    return jsonify({
        "success": True,
        "message": "Publication updated successfully",
        "publication": pub.to_dict(),
        "publications": [p.to_dict() for p in all_pubs]
    })

@publications_bp.route("/api/publications/<string:pub_id>", methods=["DELETE"])
@require_admin_auth
def delete_publication(pub_id):
    pub = Publication.query.filter_by(id=pub_id).first()
    if not pub:
        return jsonify({"success": False, "message": f"Publication with ID {pub_id} not found."}), 404

    db.session.delete(pub)
    db.session.commit()

    all_pubs = sort_publications(Publication.query.all())
    return jsonify({
        "success": True,
        "message": "Publication removed successfully",
        "publications": [p.to_dict() for p in all_pubs]
    })

@publications_bp.route("/api/publications-reorder", methods=["PUT"])
@require_admin_auth
def reorder_publications():
    data = request.get_json() or {}
    ordered_ids = data.get("orderedIds", [])
    if not isinstance(ordered_ids, list):
        return jsonify({"success": False, "message": "orderedIds must be an array of IDs"}), 400

    items = {p.id: p for p in Publication.query.all()}
    for idx, pid in enumerate(ordered_ids):
        if pid in items:
            items[pid].order_index = idx + 1

    db.session.commit()
    all_pubs = sort_publications(Publication.query.all())
    return jsonify({
        "success": True,
        "message": "Publications reordered successfully.",
        "publications": [p.to_dict() for p in all_pubs]
    })

@publications_bp.route("/api/publications/reset", methods=["POST"])
@require_admin_auth
def reset_publications():
    Publication.query.delete()
    data_dir = Path(current_app.config["DATA_DIR"])
    pubs = load_json(data_dir / "publications.json", [])
    for it in pubs:
        db.session.add(Publication(
            id=it["id"],
            title=it["title"],
            authors=it["authors"],
            journal=it["journal"],
            year=int(it["year"]),
            topic=it.get("topic", "Physiological Monitoring"),
            doi_url=it.get("doiUrl", "#"),
            pdf_url=it.get("pdfUrl", "#"),
            code_url=it.get("codeUrl"),
            abstract=it.get("abstract", ""),
            highlight=it.get("highlight"),
            bibtex=it.get("bibtex", ""),
            published=it.get("published", True),
            order_index=it.get("orderIndex", 0),
            created_at=it.get("createdAt", datetime.utcnow().isoformat()),
        ))
    db.session.commit()
    all_pubs = sort_publications(Publication.query.all())
    return jsonify({
        "success": True,
        "message": "Publications reset to defaults.",
        "publications": [p.to_dict() for p in all_pubs]
    })
