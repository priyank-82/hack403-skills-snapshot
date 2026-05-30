import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Tab,
  Tabs,
  Divider,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton
} from '@mui/material';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  GraduationCap 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLoginMutation, useSignupMutation, usePhoenixLoginMutation } from '../store/api';
import { useNotifications } from '../hooks';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


function AuthForm() {
  const [tab, setTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});

  // RTK Query hooks
  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [signup, { isLoading: isSignupLoading }] = useSignupMutation();
  const [phoenixLogin, { isLoading: isPhoenixLoading }] = usePhoenixLoginMutation();
  
  // Redux state
  const { isAuthenticated, user, error } = useSelector(state => state.auth);
  
  const { showSuccess, showError } = useNotifications();
  const navigate = useNavigate();

  // Effect to handle successful authentication
  useEffect(() => {
    if (isAuthenticated && user) {
      showSuccess('Authentication successful!');
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate, showSuccess]);

  // Effect to handle authentication errors
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  const loading = isLoginLoading || isSignupLoading || isPhoenixLoading;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (tab === 1 && !formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (tab === 1 && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (tab === 0) {
        // Login
        const result = await login({
          email: formData.email,
          password: formData.password
        });
        
        if (result.data?.success) {
          showSuccess('Login successful! Redirecting to dashboard...');
        }
      } else {
        // Signup
        const result = await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        if (result.data?.success) {
          showSuccess('Account created successfully! Please log in with your credentials.');
          // Switch to login tab after successful signup
          setTab(0);
          setJustSignedUp(true);
          // Clear form but keep email for convenience
          setFormData({
            name: '',
            email: formData.email,
            password: '',
            confirmPassword: ''
          });
        }
      }
    } catch (error) {
      // This should only happen if there's a network error or other unexpected issue
      console.error('Authentication error:', error);
      showError(error.message || 'Authentication failed. Please try again.');
    }
  };

  const handlePhoenixLogin = async () => {
    try {
      await phoenixLogin();
      // Success will be handled by the useEffect above watching isAuthenticated
    } catch (error) {
      // This should only happen if there's a network error or other unexpected issue
      console.error('Phoenix login error:', error);
      showError('Phoenix login failed. Please try again.');
    }
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setErrors({});
    setJustSignedUp(false);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' }, // stack on mobile, side-by-side on desktop
        background: 'white', // Ensure white background
        overflow: 'hidden', // Prevent any scrolling issues
      }}
    >
      {/* Left: Image */}
      <Box
        sx={{
          flex: 1.3,
          backgroundImage: "url('https://www.azcentral.com/gcdn/-mm-/d1ffe588616200145fcfc2d9ce707c1c2b6cbad6/c=433-0-2786-2353/local/-/media/2017/02/06/Phoenix/Phoenix/636219989149309406-PNIBrd2-05-07-2016-Republic-1-A015--2016-05-06-IMG-University-of-Phoeni-1-1-BRE9V6I2-L807270456-IMG-University-of-Phoeni-1-1-BRE9V6I2.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: { xs: 200, md: '100vh' },
        }}
      />

      {/* Right: Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'white', // Ensure white background
          p: 4,
        }}
      >
        {/* Your login form goes here */}
        <Card sx={{ width: '100%', maxWidth: 400, p: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                <img
                  src="https://scontent-phx1-1.xx.fbcdn.net/v/t39.30808-6/386600476_701081228712929_5334494126465680921_n.png?_nc_cat=110&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=gMOTgwsHHfYQ7kNvwGjuNPy&_nc_oc=AdnFLGj9kf4GwwYu2TczrXkKfLHESY1rmEtZf443FVKhYWpKHr1BbkHXOgClZ2hbgShXbV2EtmPDI0VAFk6o1aO6&_nc_zt=23&_nc_ht=scontent-phx1-1.xx&_nc_gid=7dC5Hg6hRY5b4B83j2R87A&oh=00_AfQhiJR1FgMR2XyqzYCvYaVA1ettTBTpaUqGDI7B20BVhQ&oe=687D1B73"
                  alt="Logo"
                  style={{ width: 70, height: 70, borderRadius: '60%', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                />
              </Box>
              <Typography variant="body1" color="text.secondary">
                {tab === 0 ? 'Sign in to your account' : 'Create your account'}
              </Typography>
            </Box>

            <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="Sign In" />
              <Tab label="Sign Up" />
            </Tabs>

            {justSignedUp && tab === 0 && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Account created successfully! Please log in with your credentials.
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              {tab === 1 && (
                <TextField
                  fullWidth
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <User size={20} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              )}

              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Mail size={20} />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock size={20} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              {tab === 1 && (
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={!!errors.confirmPassword}
                  helperText={errors.confirmPassword}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock size={20} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} /> : <ArrowRight size={20} />}
                sx={{ 
                  mb: 2, 
                  py: 1.5,
                  backgroundColor: '#2563eb',
                  '&:hover': {
                    backgroundColor: '#1d4ed8',
                  }
                }}
              >
                {loading ? 'Processing...' : (tab === 0 ? 'Sign In' : 'Sign Up')}
              </Button>

              <Divider sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>

              <Button
                fullWidth
                variant="outlined"
                onClick={handlePhoenixLogin}
                disabled={loading}
                startIcon={<GraduationCap size={20} />}
                sx={{ mb: 2 }}
              >
                {isPhoenixLoading ? 'Connecting...' : 'Login with Phoenix'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {tab === 0 ? "Don't have an account? " : "Already have an account? "}
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => setTab(tab === 0 ? 1 : 0)}
                    sx={{ fontWeight: 600 }}
                  >
                    {tab === 0 ? 'Sign up' : 'Sign in'}
                  </Link>
                </Typography>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default AuthForm;
