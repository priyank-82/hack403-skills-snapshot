// Root API endpoints
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

export const rootAPI = {
  // Base configuration
  baseURL: API_BASE_URL,
  
  // Common headers
  getHeaders: () => ({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    // Add authentication headers if needed
    ...(localStorage.getItem('token') && {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    })
  }),

  // Health check endpoint
  healthCheck: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: rootAPI.getHeaders()
      });
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Generic API request handler
  request: async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: rootAPI.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  // Authentication endpoints
  auth: {
    login: async (credentials) => {
      return await rootAPI.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      });
    },

    logout: async () => {
      return await rootAPI.request('/auth/logout', {
        method: 'POST'
      });
    },

    refreshToken: async () => {
      return await rootAPI.request('/auth/refresh', {
        method: 'POST'
      });
    },

    getCurrentUser: async () => {
      return await rootAPI.request('/auth/me', {
        method: 'GET'
      });
    }
  },

  // User management endpoints
  users: {
    getProfile: async () => {
      return await rootAPI.request('/users/profile', {
        method: 'GET'
      });
    },

    updateProfile: async (userData) => {
      return await rootAPI.request('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(userData)
      });
    },

    deleteProfile: async () => {
      return await rootAPI.request('/users/profile', {
        method: 'DELETE'
      });
    }
  },

  // Company endpoints
  companies: {
    getAll: async () => {
      return await rootAPI.request('/companies', {
        method: 'GET'
      });
    },

    getById: async (id) => {
      return await rootAPI.request(`/companies/${id}`, {
        method: 'GET'
      });
    },

    create: async (companyData) => {
      return await rootAPI.request('/companies', {
        method: 'POST',
        body: JSON.stringify(companyData)
      });
    },

    update: async (id, companyData) => {
      return await rootAPI.request(`/companies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(companyData)
      });
    },

    delete: async (id) => {
      return await rootAPI.request(`/companies/${id}`, {
        method: 'DELETE'
      });
    }
  }
};

export default rootAPI;
