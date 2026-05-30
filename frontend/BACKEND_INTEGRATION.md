# Backend API Integration Guide

## Overview
This guide explains how to integrate your Skills Snapshot frontend with a backend API using either AWS Cognito or Access Token authentication.

## Prerequisites
- Backend API endpoint
- Authentication credentials (Cognito User Pool or Access Token system)

## Installation

### 1. Install Dependencies

For **AWS Cognito**:
```bash
npm install amazon-cognito-identity-js
```

For **Access Token** (no additional dependencies needed):
```bash
# Uses existing axios
```

### 2. Environment Configuration

Copy the environment example file:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:

#### For AWS Cognito:
```env
REACT_APP_AUTH_METHOD=cognito
REACT_APP_API_BASE_URL=https://your-api-domain.com
REACT_APP_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
REACT_APP_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_COGNITO_REGION=us-east-1
```

#### For Access Token:
```env
REACT_APP_AUTH_METHOD=accessToken
REACT_APP_API_BASE_URL=https://your-api-domain.com
```

## Authentication Method Comparison

### AWS Cognito (Recommended)
**When to use:**
- You have an AWS Cognito User Pool
- Need built-in user management
- Want automatic token refresh
- Require MFA or social login
- Building an enterprise application

**Setup:**
1. Set `REACT_APP_AUTH_METHOD=cognito`
2. Configure Cognito environment variables
3. The system will automatically use Cognito authentication

### Access Token
**When to use:**
- You have a custom authentication system
- Simple token-based authentication
- Want full control over auth flow
- Quick integration with existing backend

**Setup:**
1. Set `REACT_APP_AUTH_METHOD=accessToken`
2. Configure API base URL
3. The system will use Bearer token authentication

## API Endpoints Required

### For Company Selection:
```
GET /api/companies
PUT /api/user/company
GET /api/user/profile
```

### For Job Skills:
```
POST /api/job-title-skills
POST /api/job-description
POST /api/ai-chat
```

## Implementation Steps

### 1. Update Authentication Service

The authentication is automatically handled based on your `REACT_APP_AUTH_METHOD` setting.

### 2. Test Authentication

```javascript
// Test login
const authService = AUTH_METHOD === 'cognito' ? CognitoAuthService : AccessTokenAuthService;
await authService.login('user@example.com', 'password');
```

### 3. Update API Calls

All API calls in the application will automatically use the configured authentication method.

### 4. Handle Authentication Errors

The system automatically:
- Adds auth tokens to requests
- Refreshes tokens when needed
- Redirects to login on auth failure
- Handles token expiration

## Security Considerations

1. **Token Storage**: Tokens are stored in localStorage (consider httpOnly cookies for production)
2. **HTTPS**: Always use HTTPS in production
3. **Token Expiration**: Implement proper token refresh logic
4. **CORS**: Configure CORS on your backend
5. **Rate Limiting**: Implement rate limiting on your API

## Troubleshooting

### Common Issues:

1. **CORS Errors**: Configure CORS on your backend
2. **Token Expiration**: Check token refresh implementation
3. **Invalid Credentials**: Verify Cognito configuration
4. **Network Errors**: Check API endpoint URLs

### Debug Mode:
Add to your `.env.local`:
```env
REACT_APP_DEBUG=true
```

## Testing

### Test Company Selection:
1. Login to the application
2. Check if company dropdown loads
3. Select a company
4. Verify the selection is saved

### Test API Integration:
1. Open browser dev tools
2. Check network tab for API calls
3. Verify auth headers are present
4. Check for successful responses

## Production Deployment

1. Set production environment variables
2. Configure HTTPS
3. Set up proper CORS
4. Configure rate limiting
5. Set up monitoring and logging

## Support

For issues with:
- **Cognito**: Check AWS Cognito documentation
- **Access Token**: Verify your backend auth implementation
- **Company Selection**: Check API endpoint responses
- **General Issues**: Check browser console for errors
