#!/bin/bash

# Deploy Both Services Script
# This script builds and deploys both Go and Python backend services to AWS ECS

set -e  # Exit on any error

# Configuration
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID="153961762827"
ECR_REPO_GO="skillmore-programs-skills"
ECR_REPO_PYTHON="skillmore-backend"
CLUSTER_NAME="SkillmoreCluster"
SERVICE_GO="skillmore-programs-skills"
SERVICE_PYTHON="skillmore-backend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    # Check if AWS CLI is configured
    if ! aws sts get-caller-identity > /dev/null 2>&1; then
        log_error "AWS CLI is not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    # Check if buildx is available
    if ! docker buildx version > /dev/null 2>&1; then
        log_error "Docker buildx is not available. Please install Docker buildx."
        exit 1
    fi
    
    log_success "Prerequisites check passed"
}

# Login to ECR
login_to_ecr() {
    log_info "Logging in to ECR..."
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
    log_success "ECR login successful"
}

# Build and push Go service
deploy_go_service() {
    log_info "Building and pushing Go service..."
    
    # Build multi-architecture image for Go service
    docker buildx build --platform linux/amd64,linux/arm64 \
        -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_GO:latest \
        ./programs_skills --push
    
    log_success "Go service image built and pushed successfully"
}

# Build and push Python service
deploy_python_service() {
    log_info "Building and pushing Python service..."
    
    # Build multi-architecture image for Python service
    docker buildx build --platform linux/amd64,linux/arm64 \
        -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_PYTHON:latest \
        ./backend --push
    
    log_success "Python service image built and pushed successfully"
}

# Deploy services to ECS
deploy_to_ecs() {
    log_info "Deploying services to ECS..."
    
    # Force new deployment for Go service
    log_info "Deploying Go service..."
    aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_GO --force-new-deployment
    
    # Force new deployment for Python service
    log_info "Deploying Python service..."
    aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_PYTHON --force-new-deployment
    
    log_success "Services deployment initiated"
}

# Wait for services to be stable
wait_for_services() {
    log_info "Waiting for services to be stable..."
    
    # Wait for Go service
    log_info "Waiting for Go service to be stable..."
    aws ecs wait services-stable --cluster $CLUSTER_NAME --services $SERVICE_GO
    
    # Wait for Python service
    log_info "Waiting for Python service to be stable..."
    aws ecs wait services-stable --cluster $CLUSTER_NAME --services $SERVICE_PYTHON
    
    log_success "All services are stable"
}

# Get service endpoints
get_endpoints() {
    log_info "Getting service endpoints..."
    
    # Get Go service endpoint
    GO_TASK_ARN=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name $SERVICE_GO --query 'taskArns[0]' --output text)
    if [ "$GO_TASK_ARN" != "None" ]; then
        GO_ENI_ID=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $GO_TASK_ARN --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' --output text)
        GO_PUBLIC_IP=$(aws ec2 describe-network-interfaces --network-interface-ids $GO_ENI_ID --query 'NetworkInterfaces[0].Association.PublicIp' --output text)
        log_success "Go service endpoint: http://$GO_PUBLIC_IP:8009"
        log_info "Go service Swagger docs: http://$GO_PUBLIC_IP:8009/swagger/index.html"
    fi
    
    # Get Python service endpoint
    PYTHON_TASK_ARN=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name $SERVICE_PYTHON --query 'taskArns[0]' --output text)
    if [ "$PYTHON_TASK_ARN" != "None" ]; then
        PYTHON_ENI_ID=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $PYTHON_TASK_ARN --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' --output text)
        PYTHON_PUBLIC_IP=$(aws ec2 describe-network-interfaces --network-interface-ids $PYTHON_ENI_ID --query 'NetworkInterfaces[0].Association.PublicIp' --output text)
        log_success "Python service endpoint: http://$PYTHON_PUBLIC_IP:8000"
        log_info "Python service API docs: http://$PYTHON_PUBLIC_IP:8000/docs"
    fi
}

# Check service health
check_health() {
    log_info "Checking service health..."
    
    # Check Go service
    GO_TASK_ARN=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name $SERVICE_GO --query 'taskArns[0]' --output text)
    if [ "$GO_TASK_ARN" != "None" ]; then
        GO_STATUS=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $GO_TASK_ARN --query 'tasks[0].lastStatus' --output text)
        log_info "Go service status: $GO_STATUS"
    fi
    
    # Check Python service
    PYTHON_TASK_ARN=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name $SERVICE_PYTHON --query 'taskArns[0]' --output text)
    if [ "$PYTHON_TASK_ARN" != "None" ]; then
        PYTHON_STATUS=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $PYTHON_TASK_ARN --query 'tasks[0].lastStatus' --output text)
        log_info "Python service status: $PYTHON_STATUS"
    fi
}

# Main deployment function
main() {
    log_info "Starting deployment of both services..."

    check_prerequisites
    login_to_ecr

    if [ "$SKIP_BUILD" = false ]; then
        if [ "$DEPLOY_GO" = true ]; then
            deploy_go_service
        fi
        if [ "$DEPLOY_PYTHON" = true ]; then
            deploy_python_service
        fi
    else
        log_info "Skipping build as requested."
    fi

    if [ "$SKIP_DEPLOY" = false ]; then
        if [ "$DEPLOY_GO" = true ]; then
            log_info "Deploying Go service..."
            aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_GO --force-new-deployment
        fi
        if [ "$DEPLOY_PYTHON" = true ]; then
            log_info "Deploying Python service..."
            aws ecs update-service --cluster $CLUSTER_NAME --service $SERVICE_PYTHON --force-new-deployment
        fi
        log_success "Services deployment initiated"
    else
        log_info "Skipping ECS deployment as requested."
    fi

    log_info "Waiting for services to be stable..."
    if [ "$DEPLOY_GO" = true ] && [ "$SKIP_DEPLOY" = false ]; then
        log_info "Waiting for Go service to be stable..."
        aws ecs wait services-stable --cluster $CLUSTER_NAME --services $SERVICE_GO
    fi
    if [ "$DEPLOY_PYTHON" = true ] && [ "$SKIP_DEPLOY" = false ]; then
        log_info "Waiting for Python service to be stable..."
        aws ecs wait services-stable --cluster $CLUSTER_NAME --services $SERVICE_PYTHON
    fi
    log_success "All requested services are stable"

    log_info "Getting service endpoints..."
    if [ "$DEPLOY_GO" = true ]; then
        GO_TASK_ARN=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name $SERVICE_GO --query 'taskArns[0]' --output text)
        if [ "$GO_TASK_ARN" != "None" ]; then
            GO_ENI_ID=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $GO_TASK_ARN --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' --output text)
            GO_PUBLIC_IP=$(aws ec2 describe-network-interfaces --network-interface-ids $GO_ENI_ID --query 'NetworkInterfaces[0].Association.PublicIp' --output text)
            log_success "Go service endpoint: http://$GO_PUBLIC_IP:8009"
            log_info "Go service Swagger docs: http://$GO_PUBLIC_IP:8009/swagger/index.html"
        fi
    fi
    if [ "$DEPLOY_PYTHON" = true ]; then
        PYTHON_TASK_ARN=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name $SERVICE_PYTHON --query 'taskArns[0]' --output text)
        if [ "$PYTHON_TASK_ARN" != "None" ]; then
            PYTHON_ENI_ID=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $PYTHON_TASK_ARN --query 'tasks[0].attachments[0].details[?name==`networkInterfaceId`].value' --output text)
            PYTHON_PUBLIC_IP=$(aws ec2 describe-network-interfaces --network-interface-ids $PYTHON_ENI_ID --query 'NetworkInterfaces[0].Association.PublicIp' --output text)
            log_success "Python service endpoint: http://$PYTHON_PUBLIC_IP:8000"
            log_info "Python service API docs: http://$PYTHON_PUBLIC_IP:8000/docs"
        fi
    fi

    log_info "Checking service health..."
    if [ "$DEPLOY_GO" = true ]; then
        GO_TASK_ARN=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name $SERVICE_GO --query 'taskArns[0]' --output text)
        if [ "$GO_TASK_ARN" != "None" ]; then
            GO_STATUS=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $GO_TASK_ARN --query 'tasks[0].lastStatus' --output text)
            log_info "Go service status: $GO_STATUS"
        fi
    fi
    if [ "$DEPLOY_PYTHON" = true ]; then
        PYTHON_TASK_ARN=$(aws ecs list-tasks --cluster $CLUSTER_NAME --service-name $SERVICE_PYTHON --query 'taskArns[0]' --output text)
        if [ "$PYTHON_TASK_ARN" != "None" ]; then
            PYTHON_STATUS=$(aws ecs describe-tasks --cluster $CLUSTER_NAME --tasks $PYTHON_TASK_ARN --query 'tasks[0].lastStatus' --output text)
            log_info "Python service status: $PYTHON_STATUS"
        fi
    fi

    log_success "Deployment completed successfully!"
    log_info "Requested services are now running and accessible."
}

# Help function
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo "  --go-only      Deploy only the Go service"
    echo "  --python-only  Deploy only the Python service"
    echo "  --skip-build   Skip building images (use existing images)"
    echo "  --skip-deploy  Skip ECS deployment (only build and push images)"
    echo ""
    echo "Examples:"
    echo "  $0                    # Deploy both services"
    echo "  $0 --go-only          # Deploy only Go service"
    echo "  $0 --python-only      # Deploy only Python service"
    echo "  $0 --skip-build       # Deploy using existing images"
}

# Parse command line arguments
SKIP_BUILD=false
SKIP_DEPLOY=false
DEPLOY_GO=true
DEPLOY_PYTHON=true

while [[ $# -gt 0 ]]; do
    case $1 in
        -h|--help)
            show_help
            exit 0
            ;;
        --go-only)
            DEPLOY_GO=true
            DEPLOY_PYTHON=false
            shift
            ;;
        --python-only)
            DEPLOY_GO=false
            DEPLOY_PYTHON=true
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        --skip-deploy)
            SKIP_DEPLOY=true
            shift
            ;;
        *)
            log_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Run main function
main "$@" 