import time
from pathlib import Path
from flask import Blueprint, request, jsonify, current_app
from backend.app.extensions import db
from backend.app.models.content import TeamMember
from backend.app.services.auth_service import extract_token, get_session_from_token, require_admin_auth
from backend.app.services.seed_service import load_json

team_bp = Blueprint("team", __name__)

def sort_team(items):
    return sorted(items, key=lambda x: (x.order_index if x.order_index is not None else 999))

@team_bp.route("/api/team", methods=["GET"])
def get_team():
    token = extract_token()
    session = get_session_from_token(token)
    is_admin = bool(session)

    query = TeamMember.query
    if not is_admin:
        query = query.filter(
            (TeamMember.published == True) | (TeamMember.published == None),
            (TeamMember.is_public == True) | (TeamMember.is_public == None)
        )

    items = sort_team(query.all())
    return jsonify({
        "success": True,
        "members": [m.to_dict() for m in items]
    })

@team_bp.route("/api/team", methods=["POST"])
@require_admin_auth
def create_team_member():
    data = request.get_json() or {}
    name = data.get("name", "").strip()
    role = data.get("role", "").strip()
    category = data.get("category", "").strip()

    if not name or not role or not category:
        return jsonify({"success": False, "message": "Name, role, and category are required."}), 400

    new_id = f"team-{int(time.time() * 1000)}"
    member = TeamMember(
        id=new_id,
        name=name,
        role=role,
        category=category,
        credentials=data.get("credentials", ""),
        bio=data.get("bio", ""),
        detailed_bio=data.get("detailedBio", ""),
        lab_role_detail=data.get("labRoleDetail", ""),
        focus=data.get("focus", []),
        skills=data.get("skills", []),
        contributions=data.get("contributions", []),
        projects=data.get("projects", []),
        publications=data.get("publications", []),
        awards=data.get("awards", []),
        avatar_url=data.get("avatarUrl", ""),
        email=data.get("email"),
        scholar_url=data.get("scholarUrl"),
        orcid_url=data.get("orcidUrl"),
        research_gate_url=data.get("researchGateUrl"),
        website_url=data.get("websiteUrl"),
        linkedin_url=data.get("linkedinUrl"),
        github_url=data.get("githubUrl"),
        twitter_url=data.get("twitterUrl"),
        instagram_url=data.get("instagramUrl"),
        show_email=data.get("showEmail", True),
        show_social_links=data.get("showSocialLinks", True),
        show_publications=data.get("showPublications", True),
        show_projects=data.get("showProjects", True),
        is_public=data.get("isPublic", True),
        published=data.get("published", True),
        order_index=data.get("orderIndex", TeamMember.query.count() + 1),
    )
    db.session.add(member)
    db.session.commit()

    all_members = sort_team(TeamMember.query.all())
    return jsonify({
        "success": True,
        "message": "Team member added successfully",
        "member": member.to_dict(),
        "members": [m.to_dict() for m in all_members]
    }), 201

@team_bp.route("/api/team/<string:member_id>", methods=["PUT"])
@require_admin_auth
def update_team_member(member_id):
    member = TeamMember.query.filter_by(id=member_id).first()
    if not member:
        return jsonify({"success": False, "message": f"Team member with ID {member_id} not found."}), 404

    data = request.get_json() or {}
    fields = [
        ("name", "name"), ("role", "role"), ("category", "category"),
        ("credentials", "credentials"), ("bio", "bio"), ("detailedBio", "detailed_bio"),
        ("labRoleDetail", "lab_role_detail"), ("focus", "focus"), ("skills", "skills"),
        ("contributions", "contributions"), ("projects", "projects"), ("publications", "publications"),
        ("awards", "awards"), ("avatarUrl", "avatar_url"), ("email", "email"),
        ("scholarUrl", "scholar_url"), ("orcidUrl", "orcid_url"), ("researchGateUrl", "research_gate_url"),
        ("websiteUrl", "website_url"), ("linkedinUrl", "linkedin_url"), ("githubUrl", "github_url"),
        ("twitterUrl", "twitter_url"), ("instagramUrl", "instagram_url"), ("showEmail", "show_email"),
        ("showSocialLinks", "show_social_links"), ("showPublications", "show_publications"),
        ("showProjects", "show_projects"), ("isPublic", "is_public"), ("published", "published"),
        ("orderIndex", "order_index")
    ]

    for req_field, model_field in fields:
        if req_field in data:
            setattr(member, model_field, data[req_field])

    db.session.commit()
    all_members = sort_team(TeamMember.query.all())
    return jsonify({
        "success": True,
        "message": "Team member updated successfully",
        "member": member.to_dict(),
        "members": [m.to_dict() for m in all_members]
    })

@team_bp.route("/api/team/<string:member_id>", methods=["DELETE"])
@require_admin_auth
def delete_team_member(member_id):
    member = TeamMember.query.filter_by(id=member_id).first()
    if not member:
        return jsonify({"success": False, "message": f"Team member with ID {member_id} not found."}), 404

    db.session.delete(member)
    db.session.commit()

    all_members = sort_team(TeamMember.query.all())
    return jsonify({
        "success": True,
        "message": "Team member removed successfully",
        "members": [m.to_dict() for m in all_members]
    })

@team_bp.route("/api/team-reorder", methods=["PUT"])
@require_admin_auth
def reorder_team():
    data = request.get_json() or {}
    ordered_ids = data.get("orderedIds", [])
    if not isinstance(ordered_ids, list):
        return jsonify({"success": False, "message": "orderedIds must be an array of IDs"}), 400

    items = {m.id: m for m in TeamMember.query.all()}
    for idx, mid in enumerate(ordered_ids):
        if mid in items:
            items[mid].order_index = idx + 1

    db.session.commit()
    all_members = sort_team(TeamMember.query.all())
    return jsonify({
        "success": True,
        "message": "Team members reordered successfully.",
        "members": [m.to_dict() for m in all_members]
    })

@team_bp.route("/api/team/reset", methods=["POST"])
@require_admin_auth
def reset_team():
    TeamMember.query.delete()
    data_dir = Path(current_app.config["DATA_DIR"])
    members = load_json(data_dir / "team.json", [])
    for it in members:
        db.session.add(TeamMember(
            id=it["id"],
            name=it["name"],
            role=it["role"],
            category=it.get("category", "Researchers"),
            credentials=it.get("credentials", ""),
            bio=it.get("bio", ""),
            detailed_bio=it.get("detailedBio", ""),
            lab_role_detail=it.get("labRoleDetail", ""),
            focus=it.get("focus", []),
            skills=it.get("skills", []),
            contributions=it.get("contributions", []),
            projects=it.get("projects", []),
            publications=it.get("publications", []),
            awards=it.get("awards", []),
            avatar_url=it.get("avatarUrl", ""),
            email=it.get("email"),
            scholar_url=it.get("scholarUrl"),
            orcid_url=it.get("orcidUrl"),
            research_gate_url=it.get("researchGateUrl"),
            website_url=it.get("websiteUrl"),
            linkedin_url=it.get("linkedinUrl"),
            github_url=it.get("githubUrl"),
            twitter_url=it.get("twitterUrl"),
            instagram_url=it.get("instagramUrl"),
            show_email=it.get("showEmail", True),
            show_social_links=it.get("showSocialLinks", True),
            show_publications=it.get("showPublications", True),
            show_projects=it.get("showProjects", True),
            is_public=it.get("isPublic", True),
            published=it.get("published", True),
            order_index=it.get("orderIndex", 0),
        ))
    db.session.commit()
    all_members = sort_team(TeamMember.query.all())
    return jsonify({
        "success": True,
        "message": "Team members reset to defaults.",
        "members": [m.to_dict() for m in all_members]
    })
