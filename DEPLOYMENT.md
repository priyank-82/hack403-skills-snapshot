# Skillmore Deployment Guide

This guide covers deploying both the Go programs_skills server and Python backend using Docker.

## Prerequisites

- Docker and Docker Compose installed
- Git repository cloned

## Quick Start

### Production Deployment

```bash
# Deploy both services
./deploy.sh
```

### Development Deployment

```bash
# Deploy with hot reload for development
./deploy-dev.sh
```

## Manual Deployment

### 1. Build and Run Go Server

```bash
cd programs_skills
docker build -t programs-skills .
docker run -d -p 8009:8009 --name programs-skills-server programs-skills
```

### 2. Build and Run Python Backend

```bash
cd backend
docker build -t skillmore-backend .
docker run -d -p 8000:8000 --name skillmore-backend skillmore-backend
```

### 3. Using Docker Compose

```bash
# Production
docker-compose up --build -d

# Development
docker-compose -f docker-compose.dev.yml up --build -d
```

## Service Endpoints

### Go programs_skills Server (Port 8009)
- **Health Check**: `GET http://localhost:8009/getCompetitorsSkills`
- **Swagger Docs**: `http://localhost:8009/swagger/index.html`
- **Competitor Skills**: `POST http://localhost:8009/getCompetitorsSkills`

### Python Backend (Port 8000)
- **Health Check**: `GET http://localhost:8000/`
- **Job Postings**: `GET http://localhost:8000/job-postings?company_name=Amazon`
- **Competition Analysis**: `POST http://localhost:8000/getCompetitionListSkill`

## Testing the Deployment

### Test Go Server
```bash
curl -X GET http://localhost:8009/getCompetitorsSkills
```

### Test Python Backend
```bash
curl -X GET http://localhost:8000/
```

### Test Competition Analysis
```bash
curl -X POST http://localhost:8000/getCompetitionListSkill \
  -H "Content-Type: application/json" \
  -d '{
    "current_company": "Amazon",
    "competition_list": ["Meta", "Google", "Microsoft"]
  }'
```

## Troubleshooting

### Check Container Status
```bash
docker-compose ps
# or
docker ps
```

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs programs-skills
docker-compose logs backend
```

### Stop Services
```bash
# Production
docker-compose down

# Development
docker-compose -f docker-compose.dev.yml down
```

### Rebuild Services
```bash
docker-compose down
docker-compose up --build -d
```

## Environment Variables

### Go Server
- `GIN_MODE`: Set to `release` for production, `debug` for development

### Python Backend
- `DEBUGPY`: Set to `0` for production, `1` for development

## Data Persistence

The Python backend data is persisted in `./backend/data/` directory and mounted as a volume in the container.

## Network Configuration

Both services communicate over a Docker network:
- Production: `skillmore-network`
- Development: `skillmore-network-dev`

The Python backend can reach the Go server at `http://programs-skills:8009` within the Docker network. 