import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Skeleton,
  Typography
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Clock,
  DollarSign,
  ExternalLink,
  MapPin,
  TrendingUp
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { jobPostingsAPI } from '../services/api';

function JobSearchResults({ searchQuery, location, skills }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [marketData, setMarketData] = useState(null);

  useEffect(() => {
    if (searchQuery || skills?.length > 0) {
      searchJobs();
      fetchMarketData();
    }
  }, [searchQuery, location, skills]);

  const searchJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response;
      
      if (skills?.length > 0) {
        response = await jobPostingsAPI.searchBySkills(skills, location);
      } else if (searchQuery) {
        response = await jobPostingsAPI.searchByTitle(searchQuery, location);
      }
      
      if (response?.data) {
        const transformedJobs = response.data.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company,
          location: `${job.city || ''}, ${job.state || ''}`.trim(),
          salary: job.salary ? `$${job.salary.min} - $${job.salary.max}` : 'Not specified',
          posted: job.date_posted,
          description: job.description,
          skills: job.skills || [],
          type: job.type || 'Full-time',
          trending: job.trending || false
        }));
        setJobs(transformedJobs);
      }
    } catch (err) {
      setError('Failed to fetch job postings. Please try again.');
      console.error('Job search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketData = async () => {
    try {
      const response = await jobPostingsAPI.getTrendingJobTitles();
      setMarketData(response);
    } catch (err) {
      console.error('Market data error:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {[...Array(3)].map((_, index) => (
            <Grid item xs={12} key={index}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" width="60%" height={32} />
                  <Skeleton variant="text" width="40%" height={24} />
                  <Skeleton variant="rectangular" width="100%" height={100} sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    {[...Array(3)].map((_, i) => (
                      <Skeleton key={i} variant="rectangular" width={60} height={24} />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Results Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
          Job Search Results
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Found {jobs.length} jobs matching your criteria
        </Typography>
      </Box>

      {/* Job Results */}
      <Grid container spacing={3}>
        {jobs.map((job, index) => (
          <Grid item xs={12} key={job.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card 
                sx={{ 
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Job Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {job.title}
                        {job.trending && (
                          <Chip 
                            label="Trending" 
                            size="small" 
                            icon={<TrendingUp size={16} />}
                            sx={{ ml: 1 }}
                            color="warning"
                          />
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {job.company}
                      </Typography>
                    </Box>
                    <Chip 
                      label={job.type} 
                      variant="outlined" 
                      size="small"
                      color="primary"
                    />
                  </Box>

                  {/* Job Details */}
                  <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <MapPin size={16} color="#64748b" />
                      <Typography variant="body2" color="text.secondary">
                        {job.location}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <DollarSign size={16} color="#64748b" />
                      <Typography variant="body2" color="text.secondary">
                        {job.salary}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Clock size={16} color="#64748b" />
                      <Typography variant="body2" color="text.secondary">
                        {job.posted}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Skills */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {job.skills.slice(0, 5).map((skill, idx) => (
                      <Chip
                        key={idx}
                        label={skill}
                        size="small"
                        variant="outlined"
                        sx={{ 
                          backgroundColor: 'rgba(25, 118, 210, 0.04)',
                          borderColor: 'rgba(25, 118, 210, 0.2)',
                          color: 'primary.main'
                        }}
                      />
                    ))}
                    {job.skills.length > 5 && (
                      <Chip
                        label={`+${job.skills.length - 5} more`}
                        size="small"
                        variant="outlined"
                        sx={{ opacity: 0.7 }}
                      />
                    )}
                  </Box>

                  {/* Description */}
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {job.description}
                  </Typography>

                  {/* Actions */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ borderRadius: '8px' }}
                    >
                      View Details
                    </Button>
                    <Button 
                      variant="contained"
                      size="small"
                      endIcon={<ExternalLink size={16} />}
                      sx={{ borderRadius: '8px' }}
                    >
                      Apply Now
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Market Data */}
      {marketData && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Market Insights
          </Typography>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                Based on current market trends and job postings data
              </Typography>
              {/* Add market insights here */}
            </CardContent>
          </Card>
        </Box>
      )}
    </Box>
  );
}

export default JobSearchResults;
