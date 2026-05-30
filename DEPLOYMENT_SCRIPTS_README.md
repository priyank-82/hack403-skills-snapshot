# Deployment Scripts for Go and Python Services

This directory contains scripts to deploy both the Go and Python backend services to AWS ECS.

## Scripts Overview

### 1. `quick-deploy.sh` - Simple Deployment
A streamlined script for quick deployment of both services.

**Usage:**
```bash
./quick-deploy.sh
```

**What it does:**
- Logs in to ECR
- Builds and pushes multi-architecture Docker images for both services
- Deploys to ECS
- Waits for services to be stable
- Displays the endpoints

### 2. `deploy-both-services.sh` - Advanced Deployment
A comprehensive script with error handling, logging, and options.

**Usage:**
```bash
# Deploy both services
./deploy-both-services.sh

# Deploy only Go service
./deploy-both-services.sh --go-only

# Deploy only Python service
./deploy-both-services.sh --python-only

# Skip building images (use existing)
./deploy-both-services.sh --skip-build

# Show help
./deploy-both-services.sh --help
```

## Prerequisites

Before running the scripts, ensure you have:

1. **Docker Desktop** running
2. **AWS CLI** configured with appropriate credentials
3. **Docker buildx** available
4. **AWS ECS cluster** and services already created

## Service Endpoints

After successful deployment, you'll get access to:

### Go Service (Programs Skills API)
- **Main API**: `http://<GO_IP>:8009`
- **Swagger Documentation**: `http://<GO_IP>:8009/swagger/index.html`
- **Available Endpoints**:
  - `GET /getCompetitorsSkills` - Run with default competitors
  - `POST /getCompetitorsSkills` - Run with custom competitor list

### Python Service (Backend API)
- **Main API**: `http://<PYTHON_IP>:8000`
- **API Documentation**: `http://<PYTHON_IP>:8000/docs`
- **Available Endpoints**:
  - Various job posting and skills endpoints

## Architecture

Both services are deployed as:
- **Multi-architecture Docker images** (linux/amd64, linux/arm64)
- **AWS ECS Fargate** tasks
- **Public IP addresses** for external access
- **Auto-scaling** enabled

## Troubleshooting

### Common Issues

1. **Docker not running**
   ```
   Error: Docker is not running
   ```
   **Solution**: Start Docker Desktop

2. **AWS credentials not configured**
   ```
   Error: AWS CLI is not configured
   ```
   **Solution**: Run `aws configure`

3. **Buildx not available**
   ```
   Error: Docker buildx is not available
   ```
   **Solution**: Install Docker buildx or update Docker Desktop

4. **Services not getting public IPs**
   - Check that subnets have `MapPublicIpOnLaunch: true`
   - Verify Internet Gateway is attached to VPC
   - Ensure route table has route to Internet Gateway

### Checking Service Status

```bash
# Check service status
aws ecs describe-services --cluster SkillmoreCluster --services skillmore-programs-skills skillmore-backend

# Check task status
aws ecs list-tasks --cluster SkillmoreCluster

# Check logs
aws logs describe-log-groups --log-group-name-prefix "/ecs/"
```

## Manual Deployment Steps

If you prefer to deploy manually:

1. **Login to ECR:**
   ```bash
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 153961762827.dkr.ecr.us-east-1.amazonaws.com
   ```

2. **Build and push Go service:**
   ```bash
   docker buildx build --platform linux/amd64,linux/arm64 \
       -t 153961762827.dkr.ecr.us-east-1.amazonaws.com/skillmore-programs-skills:latest \
       ./programs_skills --push
   ```

3. **Build and push Python service:**
   ```bash
   docker buildx build --platform linux/amd64,linux/arm64 \
       -t 153961762827.dkr.ecr.us-east-1.amazonaws.com/skillmore-backend:latest \
       ./backend --push
   ```

4. **Deploy to ECS:**
   ```bash
   aws ecs update-service --cluster SkillmoreCluster --service skillmore-programs-skills --force-new-deployment
   aws ecs update-service --cluster SkillmoreCluster --service skillmore-backend --force-new-deployment
   ```

## Security Notes

- Both services are deployed with public IPs for easy access
- Consider using Application Load Balancer for production
- Implement proper security groups and IAM roles
- Use HTTPS in production environments

## Cost Optimization

- Services use Fargate Spot for cost savings
- Consider setting up auto-scaling based on demand
- Monitor CloudWatch metrics for resource usage 