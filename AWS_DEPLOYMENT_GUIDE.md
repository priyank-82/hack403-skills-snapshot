# AWS Deployment Guide for Skillmore

This guide covers deploying your Skillmore application (Go programs_skills server + Python backend) to AWS using ECS Fargate, Application Load Balancer, and CloudFormation.

## 🚀 Quick Start

### Prerequisites

1. **AWS CLI installed and configured**
   ```bash
   # Install AWS CLI
   curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
   sudo installer -pkg AWSCLIV2.pkg -target /
   
   # Configure AWS credentials
   aws configure
   ```

2. **Docker installed and running**
   ```bash
   # Install Docker Desktop or Docker Engine
   # Ensure Docker is running
   docker --version
   ```

3. **jq installed (for JSON parsing)**
   ```bash
   # macOS
   brew install jq
   
   # Ubuntu/Debian
   sudo apt-get install jq
   ```

### One-Command Deployment

```bash
# Make the deployment script executable
chmod +x aws/deploy-aws.sh

# Run the complete deployment
./aws/deploy-aws.sh
```

## 📋 What Gets Deployed

### Infrastructure Components

1. **VPC with Public Subnets**
   - 2 public subnets across different availability zones
   - Internet Gateway for external access
   - Route tables for internet connectivity

2. **Security Groups**
   - ALB Security Group (ports 80, 443)
   - ECS Security Group (ports 8000, 8009)

3. **Application Load Balancer**
   - Routes traffic to both services
   - Health checks for service monitoring
   - Path-based routing (`/go/*` → Go server)

4. **ECS Fargate Cluster**
   - Serverless container orchestration
   - Auto-scaling capabilities
   - No server management required

5. **CloudWatch Logs**
   - Centralized logging for both services
   - 7-day log retention

### Services

1. **Go programs_skills Server**
   - Port: 8009
   - Endpoint: `/go/*`
   - Health check: `/getCompetitorsSkills`

2. **Python Backend**
   - Port: 8000
   - Endpoint: `/` (default)
   - Health check: `/`

## 🔧 Manual Deployment Steps

### Step 1: Build and Push Docker Images

```bash
# Set variables
AWS_REGION="us-east-1"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Login to ECR
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

# Create ECR repositories
aws ecr create-repository --repository-name skillmore-programs-skills --region $AWS_REGION
aws ecr create-repository --repository-name skillmore-backend --region $AWS_REGION

# Build and push Go image
cd programs_skills
docker build -t skillmore-programs-skills .
docker tag skillmore-programs-skills:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/skillmore-programs-skills:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/skillmore-programs-skills:latest
cd ..

# Build and push Python image
cd backend
docker build -t skillmore-backend .
docker tag skillmore-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/skillmore-backend:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/skillmore-backend:latest
cd ..
```

### Step 2: Deploy Infrastructure

```bash
# Deploy CloudFormation stack
aws cloudformation create-stack \
    --stack-name skillmore-stack \
    --template-body file://aws/cloudformation-template.yaml \
    --capabilities CAPABILITY_NAMED_IAM \
    --region us-east-1

# Wait for deployment
aws cloudformation wait stack-create-complete --stack-name skillmore-stack --region us-east-1
```

### Step 3: Verify Deployment

```bash
# Get stack outputs
aws cloudformation describe-stacks \
    --stack-name skillmore-stack \
    --region us-east-1 \
    --query 'Stacks[0].Outputs'

# Test services
LOAD_BALANCER_DNS=$(aws cloudformation describe-stacks --stack-name skillmore-stack --region us-east-1 --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNS`].OutputValue' --output text)

curl http://$LOAD_BALANCER_DNS
curl http://$LOAD_BALANCER_DNS/go/getCompetitorsSkills
```

## 🧪 Testing Your Deployment

### Test Backend Service
```bash
curl http://your-load-balancer-dns/
```

### Test Go Server
```bash
curl http://your-load-balancer-dns/go/getCompetitorsSkills
```

### Test Full Integration
```bash
curl -X POST http://your-load-balancer-dns/getCompetitionListSkill \
  -H "Content-Type: application/json" \
  -d '{
    "current_company": "Amazon",
    "competition_list": ["Meta", "Google", "Microsoft"]
  }'
```

## 📊 Monitoring and Logs

### View CloudWatch Logs
```bash
# Backend logs
aws logs tail /ecs/skillmore-backend --follow --region us-east-1

# Go server logs
aws logs tail /ecs/skillmore-programs-skills --follow --region us-east-1
```

### Check ECS Service Status
```bash
# List services
aws ecs list-services --cluster SkillmoreCluster --region us-east-1

# Describe services
aws ecs describe-services \
    --cluster SkillmoreCluster \
    --services skillmore-backend skillmore-programs-skills \
    --region us-east-1
```

## 🔄 Updating Your Application

### Update Images
```bash
# Build new images
cd programs_skills && docker build -t skillmore-programs-skills . && cd ..
cd backend && docker build -t skillmore-backend . && cd ..

# Push to ECR
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
docker tag skillmore-programs-skills:latest $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/skillmore-programs-skills:latest
docker tag skillmore-backend:latest $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/skillmore-backend:latest

docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/skillmore-programs-skills:latest
docker push $AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/skillmore-backend:latest

# Force new deployment
aws ecs update-service \
    --cluster SkillmoreCluster \
    --service skillmore-programs-skills \
    --force-new-deployment \
    --region us-east-1

aws ecs update-service \
    --cluster SkillmoreCluster \
    --service skillmore-backend \
    --force-new-deployment \
    --region us-east-1
```

## 🧹 Cleanup

### Delete Everything
```bash
# Delete CloudFormation stack (deletes all resources)
aws cloudformation delete-stack --stack-name skillmore-stack --region us-east-1

# Wait for deletion
aws cloudformation wait stack-delete-complete --stack-name skillmore-stack --region us-east-1

# Delete ECR repositories
aws ecr delete-repository --repository-name skillmore-programs-skills --force --region us-east-1
aws ecr delete-repository --repository-name skillmore-backend --force --region us-east-1
```

## 💰 Cost Estimation

### Monthly Costs (us-east-1)
- **ECS Fargate**: ~$30-50 (2 services, 512 CPU units each)
- **Application Load Balancer**: ~$20
- **CloudWatch Logs**: ~$5-10
- **Data Transfer**: ~$5-15
- **Total Estimated**: ~$60-95/month

### Cost Optimization Tips
1. Use Spot instances for non-production
2. Set up auto-scaling based on demand
3. Use CloudWatch alarms to monitor costs
4. Consider using AWS Free Tier for development

## 🔒 Security Best Practices

1. **Use HTTPS**: Set up SSL/TLS certificates
2. **IAM Roles**: Use least privilege access
3. **Security Groups**: Restrict access to necessary ports
4. **Secrets Management**: Use AWS Secrets Manager for sensitive data
5. **VPC**: Use private subnets for databases

## 🆘 Troubleshooting

### Common Issues

1. **Service not starting**
   ```bash
   # Check ECS service events
   aws ecs describe-services --cluster SkillmoreCluster --services skillmore-backend
   ```

2. **Health check failures**
   ```bash
   # Check target group health
   aws elbv2 describe-target-health --target-group-arn your-target-group-arn
   ```

3. **Image pull errors**
   ```bash
   # Verify ECR login
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin your-account.dkr.ecr.us-east-1.amazonaws.com
   ```

### Getting Help
- Check CloudWatch logs for detailed error messages
- Verify security group rules
- Ensure ECR repositories exist and are accessible
- Check IAM roles and permissions

## 📞 Support

For issues with this deployment:
1. Check the troubleshooting section above
2. Review CloudWatch logs for error details
3. Verify AWS service limits and quotas
4. Contact AWS support if needed 