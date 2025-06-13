# Backend

This directory contains a minimal FastAPI backend with PostgreSQL storage.

## Setup

1. Create a Python virtual environment and install dependencies:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

2. Configure the database by setting the `DATABASE_URL` environment variable. Example:

```
export DATABASE_URL=postgresql://user:password@localhost/dbname
```

3. Optionally set `SECRET_KEY` to override the default JWT secret.

## Running

Start the development server with:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000/api`.
