import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),
  
  signup: (name, email, password) => 
    api.post('/auth/signup', { name, email, password }),
  
  loginWithPhoenix: () => 
    api.post('/auth/phoenix-sso'),
  
  loginWithPhoenixCredentials: (email, password) => 
    api.post('/auth/phoenix-credentials', { email, password }),
  
  logout: () => 
    api.post('/auth/logout'),
  
  refreshToken: () => 
    api.post('/auth/refresh'),
  
  getProfile: () => 
    api.get('/auth/profile'),
};

// Job Skills API
export const jobSkillsAPI = {
  // Get job title skills analysis
  getJobTitleSkills: () => api.post('/job-title-skills'),
  
  // AI-powered skill inference
  getSkillInference: (jobDescription) => 
    api.post('/skill-inference', { text: jobDescription, threshold: 0.8 }),
  
  // AI job description generator
  generateJobDescription: (jobTitle, industry, company, experienceLevel) =>
    api.post('/job-description', {
      jobTitle,
      industry,
      company,
      experienceLevel
    }),

  // AI chat assistant
  chatWithAI: (message) =>
    api.post('/ai-chat', { message }),
  
  predictSkills: (jobTitle) => 
    api.post('/predict-skills', { job_title: jobTitle }),
  
  analyzeSkillGaps: (currentSkills, targetRole) => 
    api.post('/analyze-skill-gaps', { current_skills: currentSkills, target_role: targetRole }),
  
  getMarketTrends: () => 
    api.get('/market-trends'),
  
  getJobMatches: (userProfile) => 
    api.post('/job-matches', userProfile),
};

// AI API
export const aiAPI = {
  chat: (message) => 
    api.post('/ai-chat', { message }),
  
  skillPredictor: (query) => 
    api.post('/ai/skill-predictor', { query }),
  
  jobMatcher: (query) => 
    api.post('/ai/job-matcher', { query }),
  
  careerAdvisor: (query) => 
    api.post('/ai/career-advisor', { query }),
  
  marketAnalyzer: (query) => 
    api.post('/ai/market-analyzer', { query }),
};

// User Profile API
export const userAPI = {
  updateProfile: (profileData) => 
    api.put('/user/profile', profileData),
  
  getSkills: () => 
    api.get('/user/skills'),
  
  addSkill: (skill) => 
    api.post('/user/skills', { skill }),
  
  removeSkill: (skillId) => 
    api.delete(`/user/skills/${skillId}`),
  
  updatePreferences: (preferences) => 
    api.put('/user/preferences', preferences),
  
  getActivityHistory: () => 
    api.get('/user/activity'),
};

// Analytics API
export const analyticsAPI = {
  getDashboardStats: () => 
      console.log('getDashboardStats'),
   //  api.get('/analytics/dashboard'),
  
  getSkillTrends: () => 
      console.log('getSkillTrends'),
   // api.get('/analytics/skill-trends'),
  
  getJobMarketData: () => 
      console.log('getJobMarketData'),
   // api.get('/analytics/job-market'),
  
  getCareerInsights: () => 
      console.log('getCareerInsights'),
   // api.get('/analytics/career-insights'),
};

// Job Postings API - Using Emsi Services
export const jobPostingsAPI = {
  // Base Emsi Services endpoint
  baseURL: 'https://emsiservices.com/jpa/postings',
  
  // Search job postings
  searchPostings: async (params) => {
    try {
      const response = await fetch(`${jobPostingsAPI.baseURL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_EMSI_API_KEY || 'YOUR_EMSI_API_KEY'}`,
        },
        body: JSON.stringify({
          filter: {
            when: {
              start: params.startDate || '2024-01-01',
              end: params.endDate || new Date().toISOString().split('T')[0]
            },
            ...params.filters
          },
          rank: {
            by: params.sortBy || 'relevance',
            limit: params.limit || 100
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching job postings:', error);
      throw error;
    }
  },

  // Get job posting details by ID
  getPostingById: async (postingId) => {
    try {
      const response = await fetch(`${jobPostingsAPI.baseURL}/${postingId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_EMSI_API_KEY || 'YOUR_EMSI_API_KEY'}`,
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching job posting details:', error);
      throw error;
    }
  },

  // Get aggregated job market data
  getAggregatedData: async (params) => {
    try {
      const response = await fetch(`${jobPostingsAPI.baseURL}/aggregate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_EMSI_API_KEY || 'YOUR_EMSI_API_KEY'}`,
        },
        body: JSON.stringify({
          filter: {
            when: {
              start: params.startDate || '2024-01-01',
              end: params.endDate || new Date().toISOString().split('T')[0]
            },
            ...params.filters
          },
          metrics: params.metrics || ['unique_postings', 'median_salary'],
          dimensions: params.dimensions || ['title', 'location']
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching aggregated job data:', error);
      throw error;
    }
  },

  // Search jobs by title
  searchByTitle: (title, location = null, limit = 50) => {
    return jobPostingsAPI.searchPostings({
      filters: {
        title: {
          contains: [title]
        },
        ...(location && {
          location: {
            city: location
          }
        })
      },
      limit,
      sortBy: 'relevance'
    });
  },

  // Search jobs by skills
  searchBySkills: (skills, location = null, limit = 50) => {
    return jobPostingsAPI.searchPostings({
      filters: {
        skills: {
          contains: Array.isArray(skills) ? skills : [skills]
        },
        ...(location && {
          location: {
            city: location
          }
        })
      },
      limit,
      sortBy: 'relevance'
    });
  },

  // Get trending job titles
  getTrendingJobTitles: (timeRange = '30d') => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - (timeRange === '30d' ? 30 : 7));
    
    return jobPostingsAPI.getAggregatedData({
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      metrics: ['unique_postings'],
      dimensions: ['title']
    });
  },

  // Get salary insights
  getSalaryInsights: (jobTitle, location = null) => {
    return jobPostingsAPI.getAggregatedData({
      filters: {
        title: {
          contains: [jobTitle]
        },
        ...(location && {
          location: {
            city: location
          }
        })
      },
      metrics: ['median_salary', 'avg_salary', 'salary_range'],
      dimensions: ['title', 'location']
    });
  }
};

// Companies API
export const companiesAPI = {
  // Get all companies
  getCompanies: async () => {
    try {
      // For now, return mock data
      // In production, this would be: return api.get('/companies');
      const mockCompanies = [
        { id: 1, name: 'Altice USA', domain: 'alticeusa.com', industry: 'Telecommunications' },
        { id: 2, name: 'Amazon', domain: 'amazon.com', industry: 'E-commerce & Cloud Computing' },
        { id: 3, name: 'PepsiCo', domain: 'pepsico.com', industry: 'Food & Beverage' },
        { id: 4, name: 'Health Care Service Corporation', domain: 'hcsc.com', industry: 'Healthcare Insurance' },
        { id: 5, name: 'TechCorp', domain: 'techcorp.com', industry: 'Technology' },
        { id: 6, name: 'InnovateTech', domain: 'innovatetech.com', industry: 'Software' },
        { id: 7, name: 'DataSolutions Inc', domain: 'datasolutions.com', industry: 'Analytics' },
        { id: 8, name: 'CloudWorks', domain: 'cloudworks.com', industry: 'Cloud Computing' },
        { id: 9, name: 'DigitalFirst', domain: 'digitalfirst.com', industry: 'Digital Marketing' },
        { id: 10, name: 'FutureCode', domain: 'futurecode.com', industry: 'Software Development' },
        { id: 11, name: 'SmartSystems', domain: 'smartsystems.com', industry: 'IoT' },
        { id: 12, name: 'AgileWorks', domain: 'agileworks.com', industry: 'Consulting' },
        { id: 13, name: 'NextGen Technologies', domain: 'nextgentech.com', industry: 'AI/ML' },
      ];
      
      return { data: mockCompanies };
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  },

  // Update user's selected company
  updateUserCompany: async (companyId) => {
    try {
      // In production: return api.put('/user/company', { companyId });
      return { data: { success: true } };
    } catch (error) {
      console.error('Error updating user company:', error);
      throw error;
    }
  }
};

export default api;