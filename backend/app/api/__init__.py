from backend.app.api.auth import auth_bp
from backend.app.api.news import news_bp
from backend.app.api.team import team_bp
from backend.app.api.publications import publications_bp
from backend.app.api.facilities import facilities_bp
from backend.app.api.collaborators import collaborators_bp
from backend.app.api.contact import contact_bp
from backend.app.api.site import site_bp
from backend.app.api.upload import upload_bp

all_blueprints = [
    auth_bp,
    news_bp,
    team_bp,
    publications_bp,
    facilities_bp,
    collaborators_bp,
    contact_bp,
    site_bp,
    upload_bp,
]
