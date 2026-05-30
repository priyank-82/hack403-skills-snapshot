// Job Postings API endpoints
const JOB_POSTINGS_API_BASE_URL = process.env.REACT_APP_JOB_POSTINGS_API_URL || 'http://localhost:3001/api/job-postings';

export const jobPostingsAPI = {
  // Base configuration
  baseURL: JOB_POSTINGS_API_BASE_URL,
  
  // Common headers
  getHeaders: () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Add authentication headers if needed
    ...(localStorage.getItem('token') && {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })
  }),

  // Generic job postings API request handler
  request: async (endpoint, options = {}) => {
    const url = `${JOB_POSTINGS_API_BASE_URL}${endpoint}`;
    const config = {
      headers: jobPostingsAPI.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`Job Postings API error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Job Postings API request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  // Job postings CRUD operations
  jobs: {
    // Get all job postings
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/?${queryString}` : '/';
      return await jobPostingsAPI.request(endpoint, {
        method: 'GET'
      });
    },

    // Get job posting by ID
    getById: async (jobId) => {
      return await jobPostingsAPI.request(`/${jobId}`, {
        method: 'GET'
      });
    },

    // Create new job posting
    create: async (jobData) => {
      return await jobPostingsAPI.request('/', {
        method: 'POST',
        body: JSON.stringify(jobData)
      });
    },

    // Update job posting
    update: async (jobId, jobData) => {
      return await jobPostingsAPI.request(`/${jobId}`, {
        method: 'PUT',
        body: JSON.stringify(jobData)
      });
    },

    // Delete job posting
    delete: async (jobId) => {
      return await jobPostingsAPI.request(`/${jobId}`, {
        method: 'DELETE'
      });
    },

    // Search job postings
    search: async (query, filters = {}) => {
      const searchParams = { q: query, ...filters };
      const queryString = new URLSearchParams(searchParams).toString();
      return await jobPostingsAPI.request(`/search?${queryString}`, {
        method: 'GET'
      });
    },

    // Get job postings by company
    getByCompany: async (companyId, params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/company/${companyId}?${queryString}` : `/company/${companyId}`;
      return await jobPostingsAPI.request(endpoint, {
        method: 'GET'
      });
    },

    // Get job postings by location
    getByLocation: async (location, params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/location/${encodeURIComponent(location)}?${queryString}` : `/location/${encodeURIComponent(location)}`;
      return await jobPostingsAPI.request(endpoint, {
        method: 'GET'
      });
    },

    // Get job postings by skill
    getBySkill: async (skillId, params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/skill/${skillId}?${queryString}` : `/skill/${skillId}`;
      return await jobPostingsAPI.request(endpoint, {
        method: 'GET'
      });
    },

    // Get job postings by salary range
    getBySalaryRange: async (minSalary, maxSalary, params = {}) => {
      const salaryParams = { min_salary: minSalary, max_salary: maxSalary, ...params };
      const queryString = new URLSearchParams(salaryParams).toString();
      return await jobPostingsAPI.request(`/salary-range?${queryString}`, {
        method: 'GET'
      });
    }
  },

  // Job categories and filters
  categories: {
    // Get all job categories
    getAll: async () => {
      return await jobPostingsAPI.request('/categories', {
        method: 'GET'
      });
    },

    // Get jobs by category
    getJobsByCategory: async (categoryId, params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/categories/${categoryId}/jobs?${queryString}` : `/categories/${categoryId}/jobs`;
      return await jobPostingsAPI.request(endpoint, {
        method: 'GET'
      });
    }
  },

  // Job statistics and analytics
  analytics: {
    // Get job posting statistics
    getStats: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/stats?${queryString}` : '/stats';
      return await jobPostingsAPI.request(endpoint, {
        method: 'GET'
      });
    },

    // Get trending jobs
    getTrending: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/trending?${queryString}` : '/trending';
      return await jobPostingsAPI.request(endpoint, {
        method: 'GET'
      });
    },

    // Get job market insights
    getMarketInsights: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/market-insights?${queryString}` : '/market-insights';
      return await jobPostingsAPI.request(endpoint, {
        method: 'GET'
      });
    },

    // Get skills demand
    getSkillsDemand: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/skills-demand?${queryString}` : '/skills-demand';
      return await jobPostingsAPI.request(endpoint, {
        method: 'GET'
      });
    }
  },

  // Job alerts and notifications
  alerts: {
    // Create job alert
    create: async (alertData) => {
      return await jobPostingsAPI.request('/alerts', {
        method: 'POST',
        body: JSON.stringify(alertData)
      });
    },

    // Get user's job alerts
    getUserAlerts: async () => {
      return await jobPostingsAPI.request('/alerts', {
        method: 'GET'
      });
    },

    // Update job alert
    update: async (alertId, alertData) => {
      return await jobPostingsAPI.request(`/alerts/${alertId}`, {
        method: 'PUT',
        body: JSON.stringify(alertData)
      });
    },

    // Delete job alert
    delete: async (alertId) => {
      return await jobPostingsAPI.request(`/alerts/${alertId}`, {
        method: 'DELETE'
      });
    }
  },

  // Job applications
  applications: {
    // Submit job application
    submit: async (jobId, applicationData) => {
      return await jobPostingsAPI.request(`/${jobId}/apply`, {
        method: 'POST',
        body: JSON.stringify(applicationData)
      });
    },

    // Get user's applications
    getUserApplications: async () => {
      return await jobPostingsAPI.request('/applications', {
        method: 'GET'
      });
    },

    // Get application by ID
    getById: async (applicationId) => {
      return await jobPostingsAPI.request(`/applications/${applicationId}`, {
        method: 'GET'
      });
    },

    // Update application status
    updateStatus: async (applicationId, status) => {
      return await jobPostingsAPI.request(`/applications/${applicationId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
    }
  }
};

export default jobPostingsAPI;
