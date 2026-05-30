import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { motion } from 'framer-motion';
import Loading, { 
  LoadingSpinner, 
  LoadingWithText, 
  FullPageLoader, 
  PhoenixLoader, 
  DashboardSkeleton,
  JobSkeleton,
  AIChatLoader,
  CompanySelectionLoader
} from './Loading';

function LoadingDemo() {
  const [selectedVariant, setSelectedVariant] = useState('full');
  const [progress, setProgress] = useState(0);
  const [showDemo, setShowDemo] = useState(false);

  // Simulate progress for demo
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 10;
      });
    }, 500);

    return () => clearInterval(timer);
  }, []);

  const loadingVariants = [
    { value: 'full', label: 'Full Page Loader' },
    { value: 'phoenix', label: 'Phoenix.edu Loader' },
    { value: 'dashboard', label: 'Dashboard Skeleton' },
    { value: 'jobs', label: 'Jobs Skeleton' },
    { value: 'ai', label: 'AI Chat Loader' },
    { value: 'company', label: 'Company Selection Loader' },
    { value: 'spinner', label: 'Simple Spinner' },
    { value: 'text', label: 'Spinner with Text' }
  ];

  const handleShowDemo = () => {
    setShowDemo(true);
    setTimeout(() => setShowDemo(false), 3000);
  };

  if (showDemo) {
    return (
      <Loading 
        variant={selectedVariant}
        message="Demo Loading State"
        submessage="This is a demonstration of the loading component"
        showProgress={selectedVariant === 'full'}
        progress={progress}
      />
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Loading Components Demo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Explore all available loading states and animations
          </Typography>
        </Box>

        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Interactive Demo
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 3 }}>
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Loading Variant</InputLabel>
                <Select
                  value={selectedVariant}
                  onChange={(e) => setSelectedVariant(e.target.value)}
                  label="Loading Variant"
                >
                  {loadingVariants.map((variant) => (
                    <MenuItem key={variant.value} value={variant.value}>
                      {variant.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Button 
                variant="contained" 
                onClick={handleShowDemo}
                sx={{ px: 4 }}
              >
                Show Demo
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary">
              Progress: {progress}% (auto-incrementing for demo)
            </Typography>
          </CardContent>
        </Card>

        <Typography variant="h5" sx={{ mb: 3 }}>
          Available Loading Components
        </Typography>

        <Grid container spacing={3}>
          {/* Simple Spinner */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Simple Spinner
                </Typography>
                <Box sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LoadingSpinner />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Basic circular progress indicator
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Spinner with Text */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Spinner with Text
                </Typography>
                <Box sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <LoadingWithText text="Loading content..." />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Spinner with descriptive text
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* AI Chat Loader */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  AI Chat Loader
                </Typography>
                <Box sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <AIChatLoader message="AI is processing..." />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Animated loader for AI responses
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Dashboard Skeleton Preview */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Dashboard Skeleton
                </Typography>
                <Box sx={{ height: 100, overflow: 'hidden' }}>
                  <Box sx={{ transform: 'scale(0.3)', transformOrigin: 'top left' }}>
                    <DashboardSkeleton />
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Skeleton loading for dashboard
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Job Skeleton Preview */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Job Skeleton
                </Typography>
                <Box sx={{ height: 100, overflow: 'hidden' }}>
                  <Box sx={{ transform: 'scale(0.3)', transformOrigin: 'top left' }}>
                    <JobSkeleton />
                  </Box>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Skeleton loading for job listings
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Full Page Loader Info */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                  Full Page Loader
                </Typography>
                <Box sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(102, 126, 234, 0.1)', borderRadius: 2 }}>
                  <Typography variant="body2" color="primary">
                    Full screen loading experience
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Covers entire viewport with branding
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Usage Examples
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Here's how to use the loading components in your code:
          </Typography>
          
          <Card sx={{ backgroundColor: 'grey.50', p: 2, textAlign: 'left' }}>
            <Typography variant="body2" component="pre" sx={{ fontSize: '0.875rem', fontFamily: 'monospace' }}>
{`// Import the component
import Loading from './pages/Loading';

// Use different variants
<Loading variant="full" message="Loading..." />
<Loading variant="phoenix" />
<Loading variant="dashboard" />
<Loading variant="jobs" />
<Loading variant="ai" message="AI is thinking..." />
<Loading variant="company" />
<Loading variant="spinner" />
<Loading variant="text" message="Loading content..." />`}
            </Typography>
          </Card>
        </Box>
      </motion.div>
    </Container>
  );
}

export default LoadingDemo;
