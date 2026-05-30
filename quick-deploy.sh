#!/bin/bash

# Quick Deploy Script for Both Services
# Simple script to deploy both Go and Python services

set -e

echo "🚀 Starting quick deployment of both services..."

# Configuration
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="153961762827"
CLUSTER_NAME="SkillmoreCluster"

# Login to ECR
echo "📦 Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Build and push Go service
echo "🔨 Building and pushing Go service..."
docker buildx build --platform linux/amd64,linux/arm64 \
    -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/skillmore-programs-skills:latest \
    ./programs_skills --push

# Build and push Python service
echo "🐍 Building and pushing Python service..."
docker buildx build --platform linux/amd64,linux/arm64 \
    -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/skillmore-backend:latest \
    ./backend --push

# Deploy to ECS
echo "☁️ Deploying to ECS..."
aws ecs update-service --cluster $CLUSTER_NAME --service skillmore-programs-skills --force-new-deployment
aws ecs update-service --cluster $CLUSTER_NAME --service skillmore-backend --force-new-deployment

echo "⏳ Waiting for services to be stable..."
aws ecs wait services-stable --cluster $CLUSTER_NAME --services skillmore-programs-skills skillmore-backend

# Get endpoints
echo "🌐 Getting service endpoints..."

# Go service endpoint
GO_TASK_ARN=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name skillmore-programs-skills --query 'taskArns[0]' --output text)
if [ "$GO_TASK_ARN" != "None" ]; then
    GO_ENI_ID=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $GO_TASK_ARN --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' --output text)
    GO_PUBLIC_IP=$(aws ec2 describe-network-interfaces --network-interface-ids $GO_ENI_ID --query 'NetworkInterfaces[0].Association.PublicIp' --output text)
    echo "✅ Go service: http://$GO_PUBLIC_IP:8009"
    echo "📚 Go Swagger docs: http://$GO_PUBLIC_IP:8009/swagger/index.html"
fi

# Python service endpoint
PYTHON_TASK_ARN=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name skillmore-backend --query 'taskArns[0]' --output text)
if [ "$PYTHON_TASK_ARN" != "None" ]; then
    PYTHON_ENI_ID=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $PYTHON_TASK_ARN --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' --output text)
    PYTHON_PUBLIC_IP=$(aws ec2 describe-network-interfaces --network-interface-ids $PYTHON_ENI_ID --query 'NetworkInterfaces[0].Association.PublicIp' --output text)
    echo "✅ Python service: http://$PYTHON_PUBLIC_IP:8000"
    echo "📚 Python API docs: http://$PYTHON_PUBLIC_IP:8000/docs"
fi

echo "🎉 Deployment completed successfully!" 