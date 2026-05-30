import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  Typography,
  Alert,
  CircularProgress
} from '@mui/material';
import { jobPostingsAPI } from '../services/api';

function EmsiAPITest() {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testAPI = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await jobPostingsAPI.searchByTitle(searchTerm || 'Software Engineer');
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 600 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        Emsi Services API Test
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          label="Search Job Title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="e.g., Software Engineer"
          sx={{ mb: 2 }}
        />
        <Button 
          variant="contained" 
          onClick={testAPI}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Testing API...' : 'Test API'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Error:</strong> {error}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Make sure you have set the REACT_APP_EMSI_API_KEY in your .env file
          </Typography>
        </Alert>
      )}

      {result && (
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              API Response
            </Typography>
            <Typography variant="body2" component="pre" sx={{ 
              backgroundColor: '#f5f5f5',
              p: 2,
              borderRadius: 1,
              overflow: 'auto',
              fontSize: '0.8rem'
            }}>
              {JSON.stringify(result, null, 2)}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}

export default EmsiAPITest;
