import React, { useState } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Alert,
  CircularProgress,
  Divider
} from '@mui/material';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  GraduationCap,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { validatePhoenixEmail } from '../utils/phoenixAuth';
import { PhoenixLoader } from './Loading';

function PhoenixLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const { loginWithPhoenixCredentials } = useAuth();
  const navigate = useNavigate();

  // Show Phoenix loader while authenticating
  if (authenticating) {
    return (
      <PhoenixLoader 
        message="Authenticating with Phoenix.edu..."
        submessage="Verifying your credentials, please wait..."
      />
    );
  }

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
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailValidation = validatePhoenixEmail(formData.email);
      if (!emailValidation.isValid) {
        newErrors.email = emailValidation.error;
      }
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setAuthenticating(true);
    
    try {
      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await loginWithPhoenixCredentials(formData.email, formData.password);
      
      // Commented out company selection requirement
      // Check if user needs company selection
      // if (result.user.needsCompanySelection) {
      //   navigate('/company-selection');
      // } else {
      //   navigate('/dashboard');
      // }
      navigate('/dashboard');
    } catch (error) {
      setErrors({ submit: error.message || 'Login failed' });
      setAuthenticating(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/login');
  };

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgb(237, 130, 53)',
        p: 3
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card 
          sx={{ 
            width: '100%',
            maxWidth: 450,
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            borderRadius: '16px',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ p: 4, textAlign: 'center', backgroundColor: 'rgb(237, 130, 53)', color: 'white' }}>
            <GraduationCap size={48} style={{ marginBottom: '16px' }} />
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              University of Phoenix
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Student and Faculty Portal
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b', mb: 1 }}>
                Sign In
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748b' }}>
                Enter your phoenix.edu credentials
              </Typography>
            </Box>

            {errors.submit && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {errors.submit}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                name="email"
                label="Phoenix.edu Email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                placeholder="username@phoenix.edu"
                InputProps={{
                  startAdornment: <Mail size={20} style={{ marginRight: 8 }} />
                }}
                sx={{ mb: 3 }}
              />

              <TextField
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  startAdornment: <Lock size={20} style={{ marginRight: 8 }} />,
                  endAdornment: (
                    <Button
                      onClick={() => setShowPassword(!showPassword)}
                      sx={{ minWidth: 'auto', p: 0 }}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </Button>
                  )
                }}
                sx={{ mb: 3 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                endIcon={loading ? <CircularProgress size={20} /> : <ArrowRight size={20} />}
                sx={{ 
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '12px',
                  mb: 3,
                  backgroundColor: 'rgb(237, 130, 53)',
                  '&:hover': {
                    backgroundColor: 'rgb(237, 130, 53)'
                  }
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={loading}
                sx={{ 
                  flex: 1,
                  py: 1.5,
                  fontSize: '1rem',
                  borderRadius: '12px',
                  borderColor: 'rgb(237, 130, 53)',
                  color: 'rgb(237, 130, 53)',
                  '&:hover': {
                    borderColor: 'rgb(237, 130, 53)',
                    backgroundColor: 'rgba(237, 130, 53, 0.05)'
                  }
                }}
              >
                Cancel
              </Button>
              <Button
                variant="text"
                href="#"
                sx={{ 
                  flex: 1,
                  py: 1.5,
                  fontSize: '1rem',
                  borderRadius: '12px',
                  color: 'rgb(237, 130, 53)',
                  '&:hover': {
                    backgroundColor: 'rgba(237, 130, 53, 0.05)'
                  }
                }}
              >
                Forgot Password?
              </Button>
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Need help? Contact{' '}
                <Button
                  variant="text"
                  sx={{ 
                    fontWeight: 600, 
                    color: 'rgb(237, 130, 53)',
                    textTransform: 'none',
                    p: 0,
                    minWidth: 'auto'
                  }}
                >
                  IT Support
                </Button>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}

export default PhoenixLogin;
