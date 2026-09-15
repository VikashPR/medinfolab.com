from backend.app.extensions import db

class HomepageConfig(db.Model):
    __tablename__ = "homepage_config"

    id = db.Column(db.String(32), primary_key=True, default="default")
    hero_badge = db.Column(db.String(255), nullable=False)
    hero_title = db.Column(db.String(255), nullable=False)
    hero_highlight = db.Column(db.String(255), nullable=False)
    hero_subtitle = db.Column(db.Text, nullable=False)
    stats = db.Column(db.JSON, nullable=False, default=list)
    callout_title = db.Column(db.String(255), nullable=False)
    callout_subtitle = db.Column(db.Text, nullable=False)
    callout_button_text = db.Column(db.String(128), nullable=False)
    callout_button_link = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            "heroBadge": self.hero_badge,
            "heroTitle": self.hero_title,
            "heroHighlight": self.hero_highlight,
            "heroSubtitle": self.hero_subtitle,
            "stats": self.stats or [],
            "calloutTitle": self.callout_title,
            "calloutSubtitle": self.callout_subtitle,
            "calloutButtonText": self.callout_button_text,
            "calloutButtonLink": self.callout_button_link,
        }

class AboutConfig(db.Model):
    __tablename__ = "about_config"

    id = db.Column(db.String(32), primary_key=True, default="default")
    mission_title = db.Column(db.String(255), nullable=False)
    mission_description = db.Column(db.Text, nullable=False)
    translation_philosophy = db.Column(db.Text, nullable=False)
    director_name = db.Column(db.String(128), nullable=False)
    director_role = db.Column(db.String(255), nullable=False)
    director_bio = db.Column(db.Text, nullable=False)
    director_image = db.Column(db.String(512), nullable=False)
    milestones = db.Column(db.JSON, nullable=False, default=list)

    def to_dict(self):
        return {
            "missionTitle": self.mission_title,
            "missionDescription": self.mission_description,
            "translationPhilosophy": self.translation_philosophy,
            "directorName": self.director_name,
            "directorRole": self.director_role,
            "directorBio": self.director_bio,
            "directorImage": self.director_image,
            "milestones": self.milestones or [],
        }

class ResearchPillar(db.Model):
    __tablename__ = "research_pillars"

    id = db.Column(db.String(64), primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    subtitle = db.Column(db.String(255), nullable=True)
    description = db.Column(db.Text, nullable=False)
    technologies = db.Column(db.JSON, nullable=True, default=list)
    metrics = db.Column(db.JSON, nullable=True, default=list)
    icon = db.Column(db.String(64), nullable=True, default="Activity")
    grant_number = db.Column(db.String(128), nullable=True)
    status = db.Column(db.String(64), nullable=True, default="Active")
    published = db.Column(db.Boolean, default=True)
    order_index = db.Column(db.Integer, nullable=True, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "subtitle": self.subtitle,
            "description": self.description,
            "technologies": self.technologies or [],
            "metrics": self.metrics or [],
            "icon": self.icon,
            "grantNumber": self.grant_number,
            "status": self.status,
            "published": self.published if self.published is not None else True,
            "orderIndex": self.order_index,
        }

class GalleryItem(db.Model):
    __tablename__ = "gallery_items"

    id = db.Column(db.String(64), primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    caption = db.Column(db.Text, nullable=True)
    category = db.Column(db.String(64), nullable=True, default="Experimental Setup")
    image_url = db.Column(db.String(512), nullable=False)
    date = db.Column(db.String(32), nullable=True)
    published = db.Column(db.Boolean, default=True)
    order_index = db.Column(db.Integer, nullable=True, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "caption": self.caption,
            "category": self.category,
            "imageUrl": self.image_url,
            "date": self.date,
            "published": self.published if self.published is not None else True,
            "orderIndex": self.order_index,
        }

class SiteSettings(db.Model):
    __tablename__ = "site_settings"

    id = db.Column(db.String(32), primary_key=True, default="default")
    lab_name = db.Column(db.String(128), nullable=False)
    tagline = db.Column(db.String(255), nullable=False)
    contact_email = db.Column(db.String(128), nullable=False)
    contact_phone = db.Column(db.String(64), nullable=False)
    address = db.Column(db.Text, nullable=False)
    room_location = db.Column(db.String(255), nullable=False)
    visiting_hours = db.Column(db.String(255), nullable=False)
    social_links = db.Column(db.JSON, nullable=False, default=dict)

    def to_dict(self):
        return {
            "labName": self.lab_name,
            "tagline": self.tagline,
            "contactEmail": self.contact_email,
            "contactPhone": self.contact_phone,
            "address": self.address,
            "roomLocation": self.room_location,
            "visitingHours": self.visiting_hours,
            "socialLinks": self.social_links or {},
        }
