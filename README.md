# Skills Snapshot

A full-stack career planning and skills analysis project with:
- **React frontend** for job and skill dashboards
- **FastAPI backend** for job posting and token retrieval services
- **Go microservice** for competitor skill analysis
- **Docker-based deployment** for local development and production

## Project Overview

This repository contains a modern web application designed to analyze job market data, recommend skills, and provide AI-enhanced career guidance.

### Key Components

- `frontend/` — React app with authentication, job and skill dashboards, AI endpoints, and Phoenix.edu login integration
- `backend/` — FastAPI backend for Lightcast/EMSI integration and job posting APIs
- `programs_skills/` — Go-based service for competitor skill analysis and additional skill intelligence
- `docker-compose.yml` — Compose configuration for running the app and backend together
- `docker-compose.dev.yml` — Development compose file with hot reload support

## Quick Start

### Prerequisites

- Node.js + npm
- Python 3.11+ or compatible
- Go 1.20+ (for `programs_skills` service)
- Docker & Docker Compose (recommended for full stack)

### Run with Docker Compose

From the repository root:

```bash
docker-compose up --build
```

Then open the frontend and API in your browser.

### Run Frontend Only

```bash
cd frontend
npm install
npm start
```

### Run Backend Only

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Run Go Service Only

```bash
cd programs_skills
go run server.go
```

## Available Services

### Frontend

- React-based UI
- Uses environment variables defined in `.env.example` and `.env.local.example`
- Integrates with job market APIs and authentication services

### Backend

- FastAPI application
- Provides endpoints like `/`, `/lightcast/token`, and `/job-postings`
- Documentation available at `/docs` when the app is running

### Go Service

- Competitor skill analysis service in `programs_skills`
- Exposes Go endpoints for AI-driven skills and competitor insights

## Deployment

### Useful scripts

- `deploy-both-services.sh` — deploy both backend and Go service
- `quick-deploy.sh` — quick Docker-based deployment flow
- `check-go-logs.sh` — inspect Go service logs

### Documentation

- `DEPLOYMENT.md` — deployment and architecture overview
- `AWS_DEPLOYMENT_GUIDE.md` — AWS deployment instructions
- `DEPLOYMENT_SCRIPTS_README.md` — script usage and deployment automation details
- `frontend/README.md` — frontend-specific setup and architecture
- `backend/readme.md` — backend setup and API documentation

## Environment & Credentials

This repository includes placeholder environment examples, but no real API keys should be stored here.

Common env references:
- `REACT_APP_EMSI_API_KEY`
- `REACT_APP_LIGHTCAST_API_KEY`
- `LIGHTCAST_CLIENT_ID`
- `LIGHTCAST_CLIENT_SECRET`

## Notes

- The frontend expects a standard React app structure with `src/`, `public/`, and service utilities.
- The backend uses FastAPI and can be run locally or in Docker.
- The Go service is designed to work alongside the backend and is deployable independently.

## Recommended Workflow

1. Start the backend (`backend/`)
2. Start the Go service (`programs_skills/`)
3. Start the frontend (`frontend/`)
4. Use Docker Compose for a unified local environment
