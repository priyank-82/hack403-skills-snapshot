// Lightcast API endpoints
// Lightcast (formerly Emsi Burning Glass) provides labor market data and insights
const LIGHTCAST_API_BASE_URL = process.env.REACT_APP_LIGHTCAST_API_URL || 'http://0.0.0.0:8000';
const LIGHTCAST_API_KEY = process.env.REACT_APP_LIGHTCAST_API_KEY;

export const lightcastAPI = {
  // Base configuration
  baseURL: LIGHTCAST_API_BASE_URL,
  
  // Authentication headers for Lightcast API
  getHeaders: () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(LIGHTCAST_API_KEY && {
      'Authorization': `Bearer ${LIGHTCAST_API_KEY}`
    })
  }),

  // Generic Lightcast API request handler
  request: async (endpoint, options = {}) => {
    const url = `${LIGHTCAST_API_BASE_URL}${endpoint}`;
    const config = {
      headers: lightcastAPI.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`Lightcast API error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Lightcast API request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  // Root endpoint
  root: {
    // GET / - Read root endpoint
    get: async () => {
      return await lightcastAPI.request('/', {
        method: 'GET'
      });
    }
  },

  // Lightcast token endpoint
  token: {
    // GET /lightcast/token - Fetch Lightcast token
    get: async () => {
      return await lightcastAPI.request('/lightcast/token', {
        method: 'GET'
      });
    }
  },

  // Job postings endpoint
  jobPostings: {
    // GET /job/postings - Fetch job postings
    get: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      const endpoint = queryString ? `/job/postings?${queryString}` : '/job/postings';
      return await lightcastAPI.request(endpoint, {
        method: 'GET'
      });
    }
  },

  // Skills data endpoints
  skills: {
    // Get all skills
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return await lightcastAPI.request(`skills?${queryString}`, {
        method: 'GET'
      });
    },

    // Get skill by ID
    getById: async (skillId) => {
      return await lightcastAPI.request(`skills/${skillId}`, {
        method: 'GET'
      });
    },

    // Search skills
    search: async (query, params = {}) => {
      const searchParams = { q: query, ...params };
      const queryString = new URLSearchParams(searchParams).toString();
      return await lightcastAPI.request(`skills/search?${queryString}`, {
        method: 'GET'
      });
    },

    // Get skills by occupation
    getByOccupation: async (occupationId) => {
      return await lightcastAPI.request(`occupations/${occupationId}/skills`, {
        method: 'GET'
      });
    },

    // Get trending skills
    getTrending: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return await lightcastAPI.request(`skills/trending?${queryString}`, {
        method: 'GET'
      });
    }
  },

  // Occupations data endpoints
  occupations: {
    // Get all occupations
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return await lightcastAPI.request(`occupations?${queryString}`, {
        method: 'GET'
      });
    },

    // Get occupation by ID
    getById: async (occupationId) => {
      return await lightcastAPI.request(`occupations/${occupationId}`, {
        method: 'GET'
      });
    },

    // Search occupations
    search: async (query, params = {}) => {
      const searchParams = { q: query, ...params };
      const queryString = new URLSearchParams(searchParams).toString();
      return await lightcastAPI.request(`occupations/search?${queryString}`, {
        method: 'GET'
      });
    },

    // Get occupation outlook
    getOutlook: async (occupationId, params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return await lightcastAPI.request(`occupations/${occupationId}/outlook?${queryString}`, {
        method: 'GET'
      });
    }
  },

  // Job postings data endpoints
  jobPostings: {
    // Get job postings
    getAll: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return await lightcastAPI.request(`jpa/postings?${queryString}`, {
        method: 'GET'
      });
    },

    // Search job postings
    search: async (query, params = {}) => {
      const searchParams = { q: query, ...params };
      const queryString = new URLSearchParams(searchParams).toString();
      return await lightcastAPI.request(`jpa/postings/search?${queryString}`, {
        method: 'GET'
      });
    },

    // Get job posting by ID
    getById: async (postingId) => {
      return await lightcastAPI.request(`jpa/postings/${postingId}`, {
        method: 'GET'
      });
    },

    // Get job posting metrics
    getMetrics: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return await lightcastAPI.request(`jpa/postings/metrics?${queryString}`, {
        method: 'GET'
      });
    }
  },

  // Labor market data endpoints
  laborMarket: {
    // Get regional data
    getRegionalData: async (region, params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return await lightcastAPI.request(`regional/${region}?${queryString}`, {
        method: 'GET'
      });
    },

    // Get industry data
    getIndustryData: async (industry, params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return await lightcastAPI.request(`industries/${industry}?${queryString}`, {
        method: 'GET'
      });
    },

    // Get salary data
    getSalaryData: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return await lightcastAPI.request(`salaries?${queryString}`, {
        method: 'GET'
      });
    }
  },

  // Education and training endpoints
  education: {
    // Get programs
    getPrograms: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return await lightcastAPI.request(`programs?${queryString}`, {
        method: 'GET'
      });
    },

    // Get program by ID
    getProgramById: async (programId) => {
      return await lightcastAPI.request(`programs/${programId}`, {
        method: 'GET'
      });
    },

    // Get skills gap analysis
    getSkillsGap: async (params = {}) => {
      const queryString = new URLSearchParams(params).toString();
      return await lightcastAPI.request(`skills-gap?${queryString}`, {
        method: 'GET'
      });
    }
  }
};

export default lightcastAPI;
