import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  Divider,
  Stack
} from '@mui/material';
import { useAuth } from '../services/auth';
import { useNotifications } from '../hooks';
import AuthFlowManager from '../utils/authFlowManager';

function AuthTester() {
  const [testCredentials, setTestCredentials] = useState({
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  });
  
  const { user, isAuthenticated, login, signup, logout } = useAuth();
  const { showSuccess, showError, showInfo } = useNotifications();
  
  const handleTestSignup = async () => {
    try {
      showInfo('Testing signup flow...');
      const result = await signup(testCredentials.name, testCredentials.email, testCredentials.password);
      if (result.success) {
        showSuccess('Signup test successful! User created but not logged in. Please test login now.');
      }
    } catch (error) {
      showError('Signup test failed: ' + error.message);
    }
  };
  
  const handleTestLogin = async () => {
    try {
      showInfo('Testing login flow...');
      const result = await login(testCredentials.email, testCredentials.password);
      if (result.success) {
        showSuccess('Login test successful!');
      }
    } catch (error) {
      showError('Login test failed: ' + error.message);
    }
  };
  
  const handleTestLogout = async () => {
    try {
      showInfo('Testing logout flow...');
      await logout();
      showSuccess('Logout test successful!');
    } catch (error) {
      showError('Logout test failed: ' + error.message);
    }
  };
  
  const handleCheckAuthStatus = () => {
    const authStatus = AuthFlowManager.checkAuthStatus();
    showInfo(`Auth Status: ${authStatus.isAuthenticated ? 'Authenticated' : 'Not Authenticated'}`);
    console.log('Auth Status:', authStatus);
  };
  
  const handleCheckTempSignup = () => {
    const tempUser = localStorage.getItem('tempSignupUser');
    if (tempUser) {
      const parsedUser = JSON.parse(tempUser);
      showInfo(`Temp signup user found: ${parsedUser.name} (${parsedUser.email})`);
    } else {
      showInfo('No temp signup user found');
    }
  };
  
  const handleClearTempSignup = () => {
    localStorage.removeItem('tempSignupUser');
    showInfo('Temp signup data cleared');
  };
  const handleClearAuth = async () => {
    await AuthFlowManager.handleLogout();
    showInfo('Authentication data cleared');
  };
  
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Authentication Flow Tester
          </Typography>
          
          <Alert severity={isAuthenticated ? 'success' : 'info'} sx={{ mb: 2 }}>
            <Typography>
              <strong>Status:</strong> {isAuthenticated ? 'Logged In' : 'Not Logged In'}
            </Typography>
            {user && (
              <Typography>
                <strong>User:</strong> {user.name} ({user.email})
              </Typography>
            )}
          </Alert>
          
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={testCredentials.name}
              onChange={(e) => setTestCredentials(prev => ({ ...prev, name: e.target.value }))}
              fullWidth
            />
            
            <TextField
              label="Email"
              value={testCredentials.email}
              onChange={(e) => setTestCredentials(prev => ({ ...prev, email: e.target.value }))}
              fullWidth
            />
            
            <TextField
              label="Password"
              type="password"
              value={testCredentials.password}
              onChange={(e) => setTestCredentials(prev => ({ ...prev, password: e.target.value }))}
              fullWidth
            />
            
            <Divider />
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                onClick={handleTestSignup}
                disabled={isAuthenticated}
              >
                Test Signup
              </Button>
              
              <Button 
                variant="contained" 
                onClick={handleTestLogin}
                disabled={isAuthenticated}
              >
                Test Login
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={handleTestLogout}
                disabled={!isAuthenticated}
              >
                Test Logout
              </Button>
            </Box>
            
            <Divider />
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Button 
                variant="outlined" 
                onClick={handleCheckAuthStatus}
                size="small"
              >
                Check Auth Status
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={handleCheckTempSignup}
                size="small"
              >
                Check Temp Signup
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={handleClearTempSignup}
                size="small"
                color="warning"
              >
                Clear Temp Signup
              </Button>
              
              <Button 
                variant="outlined" 
                onClick={handleClearAuth}
                size="small"
                color="warning"
              >
                Clear Auth Data
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default AuthTester;
