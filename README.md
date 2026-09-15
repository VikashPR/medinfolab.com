# MINDH Laboratory — Web Platform

Translational clinical informatics, physiological monitoring, and clinical AI laboratory website with a private administrative dashboard.

The website backend is built entirely with **Python Flask** and **SQLAlchemy**, replacing the legacy Node.js backend.

---

## Architecture Overview

```
├── backend/                  # Python Flask backend
│   ├── app/                  # Application package
│   │   ├── __init__.py       # Application factory (create_app)
│   │   ├── extensions.py     # SQLAlchemy, Migrate, CORS
│   │   ├── api/              # Flask Blueprints (auth, news, team, publications, facilities, etc.)
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── services/         # Auth, upload, and data seeding services
│   │   └── errors/           # Error handlers
│   ├── tests/                # Pytest test suite
│   ├── config.py             # Environment configurations
│   ├── requirements.txt      # Python dependencies
│   ├── run.py                # Development server runner (0.0.0.0:3000)
│   └── wsgi.py               # Production WSGI entry point
├── src/                      # React frontend
│   ├── admin/                # Private administrator interface
│   ├── components/           # Public website UI components
│   ├── pages/                # Public website pages
│   └── types.ts              # TypeScript interface definitions
├── data/                     # Persistent database (mindh.db) & initial seed JSONs
├── public/uploads/           # Media & document uploads storage
└── dist/                     # Built static production frontend assets
```

---

## Quick Start & Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ (only for building frontend static assets)

### 2. Python Virtual Environment Setup
```bash
# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python backend dependencies
pip install -r backend/requirements.txt
```

### 3. Frontend Build Setup
```bash
# Install frontend dependencies (only if building from source)
npm install

# Build static frontend bundle to dist/
npm run build
```

### 4. Database Setup & Migrations
The app uses SQLite (`data/mindh.db`) with Alembic/Flask-Migrate.
```bash
# Run database migrations
flask --app backend.run:app db upgrade

# Seed database with initial data and create default admin
python3 -c "from backend.run import initialize_database; initialize_database()"
```

### 5. Running the Application

#### Development Mode
```bash
python3 backend/run.py
```
The server will start on `http://0.0.0.0:3000`.

#### Production Mode
Using Gunicorn or any WSGI server:
```bash
pip install gunicorn
gunicorn --bind 0.0.0.0:3000 backend.wsgi:app
```

---

## Default Administrator Credentials

- **Username**: `admin`
- **Email**: `admin@mindh-lab.org`
- **Password**: `Admin@MINDH2024!`
- **Role**: `Super Admin`

Admins can log in at `/admin` to manage news, publications, team members, facilities, collaborators, inquiries, and site configuration.

---

## Running Backend Tests

```bash
pytest backend/tests/
```
All 14 integration and unit tests cover authentication, authorization, CRUD operations, and file uploads.
