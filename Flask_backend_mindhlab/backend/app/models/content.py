from datetime import datetime
from backend.app.extensions import db

class NewsItem(db.Model):
    __tablename__ = "news_items"

    id = db.Column(db.String(64), primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    summary = db.Column(db.Text, nullable=True)
    image = db.Column(db.String(512), nullable=True)
    date = db.Column(db.String(32), nullable=False)
    category = db.Column(db.String(64), nullable=True, default="Lab Update")
    link_text = db.Column(db.String(128), nullable=True)
    link_url = db.Column(db.String(512), nullable=True)
    published = db.Column(db.Boolean, default=True)
    order_index = db.Column(db.Integer, nullable=True, default=0)
    created_at = db.Column(db.String(64), nullable=True)
    updated_at = db.Column(db.String(64), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "summary": self.summary,
            "image": self.image,
            "date": self.date,
            "category": self.category,
            "linkText": self.link_text,
            "linkUrl": self.link_url,
            "published": self.published if self.published is not None else True,
            "orderIndex": self.order_index,
            "createdAt": self.created_at,
            "updatedAt": self.updated_at,
        }

class TeamMember(db.Model):
    __tablename__ = "team_members"

    id = db.Column(db.String(64), primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(128), nullable=False)
    category = db.Column(db.String(64), nullable=False, default="Researchers")
    credentials = db.Column(db.String(255), nullable=True, default="")
    bio = db.Column(db.Text, nullable=True, default="")
    detailed_bio = db.Column(db.Text, nullable=True, default="")
    lab_role_detail = db.Column(db.Text, nullable=True, default="")
    focus = db.Column(db.JSON, nullable=True, default=list)
    skills = db.Column(db.JSON, nullable=True, default=list)
    contributions = db.Column(db.JSON, nullable=True, default=list)
    projects = db.Column(db.JSON, nullable=True, default=list)
    publications = db.Column(db.JSON, nullable=True, default=list)
    awards = db.Column(db.JSON, nullable=True, default=list)
    avatar_url = db.Column(db.String(512), nullable=True)
    email = db.Column(db.String(128), nullable=True)
    scholar_url = db.Column(db.String(512), nullable=True)
    orcid_url = db.Column(db.String(512), nullable=True)
    research_gate_url = db.Column(db.String(512), nullable=True)
    website_url = db.Column(db.String(512), nullable=True)
    linkedin_url = db.Column(db.String(512), nullable=True)
    github_url = db.Column(db.String(512), nullable=True)
    twitter_url = db.Column(db.String(512), nullable=True)
    instagram_url = db.Column(db.String(512), nullable=True)
    show_email = db.Column(db.Boolean, default=True)
    show_social_links = db.Column(db.Boolean, default=True)
    show_publications = db.Column(db.Boolean, default=True)
    show_projects = db.Column(db.Boolean, default=True)
    is_public = db.Column(db.Boolean, default=True)
    published = db.Column(db.Boolean, default=True)
    order_index = db.Column(db.Integer, nullable=True, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "role": self.role,
            "category": self.category,
            "credentials": self.credentials or "",
            "bio": self.bio or "",
            "detailedBio": self.detailed_bio or "",
            "labRoleDetail": self.lab_role_detail or "",
            "focus": self.focus or [],
            "skills": self.skills or [],
            "contributions": self.contributions or [],
            "projects": self.projects or [],
            "publications": self.publications or [],
            "awards": self.awards or [],
            "avatarUrl": self.avatar_url or "",
            "email": self.email,
            "scholarUrl": self.scholar_url,
            "orcidUrl": self.orcid_url,
            "researchGateUrl": self.research_gate_url,
            "websiteUrl": self.website_url,
            "linkedinUrl": self.linkedin_url,
            "githubUrl": self.github_url,
            "twitterUrl": self.twitter_url,
            "instagramUrl": self.instagram_url,
            "showEmail": self.show_email if self.show_email is not None else True,
            "showSocialLinks": self.show_social_links if self.show_social_links is not None else True,
            "showPublications": self.show_publications if self.show_publications is not None else True,
            "showProjects": self.show_projects if self.show_projects is not None else True,
            "isPublic": self.is_public if self.is_public is not None else True,
            "published": self.published if self.published is not None else True,
            "orderIndex": self.order_index,
        }

class Collaborator(db.Model):
    __tablename__ = "collaborators"

    id = db.Column(db.String(64), primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    short_name = db.Column(db.String(128), nullable=True)
    category = db.Column(db.String(64), nullable=False)
    location = db.Column(db.String(255), nullable=False)
    logo_url = db.Column(db.String(512), nullable=True)
    description = db.Column(db.Text, nullable=False)
    joint_focus = db.Column(db.JSON, nullable=True, default=list)
    key_contacts = db.Column(db.JSON, nullable=True, default=list)
    active_trials = db.Column(db.JSON, nullable=True, default=list)
    website_url = db.Column(db.String(512), nullable=True)
    is_featured = db.Column(db.Boolean, default=True)
    published = db.Column(db.Boolean, default=True)
    order_index = db.Column(db.Integer, nullable=True, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "shortName": self.short_name,
            "category": self.category,
            "location": self.location,
            "logoUrl": self.logo_url,
            "description": self.description,
            "jointFocus": self.joint_focus or [],
            "keyContacts": self.key_contacts or [],
            "activeTrials": self.active_trials or [],
            "websiteUrl": self.website_url,
            "isFeatured": self.is_featured if self.is_featured is not None else True,
            "published": self.published if self.published is not None else True,
            "orderIndex": self.order_index,
        }

class Publication(db.Model):
    __tablename__ = "publications"

    id = db.Column(db.String(64), primary_key=True)
    title = db.Column(db.String(512), nullable=False)
    authors = db.Column(db.Text, nullable=False)
    journal = db.Column(db.String(255), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    topic = db.Column(db.String(64), nullable=False)
    doi_url = db.Column(db.String(512), nullable=True)
    pdf_url = db.Column(db.String(512), nullable=True)
    code_url = db.Column(db.String(512), nullable=True)
    abstract = db.Column(db.Text, nullable=False)
    highlight = db.Column(db.String(255), nullable=True)
    bibtex = db.Column(db.Text, nullable=True)
    published = db.Column(db.Boolean, default=True)
    order_index = db.Column(db.Integer, nullable=True, default=0)
    created_at = db.Column(db.String(64), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "authors": self.authors,
            "journal": self.journal,
            "year": self.year,
            "topic": self.topic,
            "doiUrl": self.doi_url,
            "pdfUrl": self.pdf_url,
            "codeUrl": self.code_url,
            "abstract": self.abstract,
            "highlight": self.highlight,
            "bibtex": self.bibtex,
            "published": self.published if self.published is not None else True,
            "orderIndex": self.order_index,
            "createdAt": self.created_at,
        }

class Facility(db.Model):
    __tablename__ = "facilities"

    id = db.Column(db.String(64), primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    tag = db.Column(db.String(128), nullable=False)
    desc = db.Column(db.Text, nullable=False)
    specs = db.Column(db.JSON, nullable=True, default=list)
    status = db.Column(db.String(64), nullable=False, default="Operational")
    icon_name = db.Column(db.String(64), nullable=True)
    image_url = db.Column(db.String(512), nullable=True)
    published = db.Column(db.Boolean, default=True)
    order_index = db.Column(db.Integer, nullable=True, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "tag": self.tag,
            "desc": self.desc,
            "specs": self.specs or [],
            "status": self.status,
            "iconName": self.icon_name,
            "imageUrl": self.image_url,
            "published": self.published if self.published is not None else True,
            "orderIndex": self.order_index,
        }

class ContactInquiry(db.Model):
    __tablename__ = "contact_inquiries"

    id = db.Column(db.String(64), primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False)
    affiliation = db.Column(db.String(255), nullable=True)
    role = db.Column(db.String(128), nullable=True)
    interest_type = db.Column(db.String(64), nullable=False, default="General Inquiry")
    message = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.String(64), nullable=False)
    status = db.Column(db.String(32), nullable=False, default="New")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "affiliation": self.affiliation,
            "role": self.role,
            "interestType": self.interest_type,
            "message": self.message,
            "createdAt": self.created_at,
            "status": self.status,
        }
