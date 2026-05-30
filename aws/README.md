# AWS Directory - Infrastructure Reference

This directory contains essential AWS infrastructure files for reference.

## Files Kept

### `cloudformation-template.yaml`
- **Purpose**: CloudFormation template for initial AWS infrastructure setup
- **Contains**: VPC, ECS cluster, security groups, and other AWS resources
- **Usage**: Reference for infrastructure setup (not needed for regular deployments)

## Deployment Scripts

The main deployment scripts are located in the **root directory**:

- `quick-deploy.sh` - Simple deployment for both services
- `deploy-both-services.sh` - Advanced deployment with options
- `DEPLOYMENT_SCRIPTS_README.md` - Complete documentation

## What Was Removed

All temporary and redundant files have been cleaned up:
- Individual service deployment scripts
- Debug and troubleshooting scripts
- Duplicate task definitions
- Temporary fix scripts
- Status checking scripts

## For Future Deployments

Use the scripts in the root directory:
```bash
# Quick deployment
./quick-deploy.sh

# Advanced deployment
./deploy-both-services.sh --help
```

The infrastructure is already set up and running, so you only need the deployment scripts for future updates. 