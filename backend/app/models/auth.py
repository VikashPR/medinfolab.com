import secrets
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
from backend.app.extensions import db

class AdminUser(db.Model):
    __tablename__ = "admin_users"

    id = db.Column(db.String(64), primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(32), nullable=False, default="Super Admin")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)

    sessions = db.relationship("AdminSession", backref="user", cascade="all, delete-orphan", lazy=True)

    def set_password(self, password: str):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "lastLogin": self.last_login.isoformat() if self.last_login else None,
        }

class AdminSession(db.Model):
    __tablename__ = "admin_sessions"

    token = db.Column(db.String(64), primary_key=True)
    user_id = db.Column(db.String(64), db.ForeignKey("admin_users.id"), nullable=False)
    username = db.Column(db.String(64), nullable=False)
    role = db.Column(db.String(32), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expires_at = db.Column(db.DateTime, nullable=False)

    @classmethod
    def create_session(cls, user: AdminUser, duration_hours: int = 24) -> "AdminSession":
        token = secrets.token_hex(32)
        now = datetime.utcnow()
        session = cls(
            token=token,
            user_id=user.id,
            username=user.username,
            role=user.role,
            created_at=now,
            expires_at=now + timedelta(hours=duration_hours),
        )
        db.session.add(session)
        db.session.commit()
        return session

    def is_valid(self) -> bool:
        return datetime.utcnow() < self.expires_at

    def to_dict(self):
        return {
            "token": self.token,
            "userId": self.user_id,
            "username": self.username,
            "role": self.role,
            "createdAt": int(self.created_at.timestamp() * 1000) if self.created_at else None,
            "expiresAt": int(self.expires_at.timestamp() * 1000) if self.expires_at else None,
        }
