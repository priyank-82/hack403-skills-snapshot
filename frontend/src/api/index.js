// API Index - Central export for all API modules
export { default as rootAPI } from './root';
export { default as lightcastAPI } from './lightcast';
export { default as jobPostingsAPI } from './job_postings';

// Combined API object for convenience
export const API = {
  root: require('./root').default,
  lightcast: require('./lightcast').default,
  jobPostings: require('./job_postings').default
};

// API utility functions
export const apiUtils = {
  // Handle API errors consistently
  handleError: (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      return {
        success: false,
        error: error.response.data?.message || 'Server error occurred',
        status: error.response.status
      };
    } else if (error.request) {
      // Request was made but no response
      return {
        success: false,
        error: 'No response from server',
        status: 0
      };
    } else {
      // Something else happened
      return {
        success: false,
        error: error.message || 'Unknown error occurred',
        status: 0
      };
    }
  },

  // Format API response consistently
  formatResponse: (data, success = true) => {
    return {
      success,
      data,
      timestamp: new Date().toISOString()
    };
  },

  // Build query string from parameters
  buildQueryString: (params) => {
    const filtered = Object.entries(params)
      .filter(([key, value]) => value !== undefined && value !== null && value !== '')
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    
    return new URLSearchParams(filtered).toString();
  },

  // Validate API response
  validateResponse: (response) => {
    if (!response) {
      throw new Error('No response received');
    }
    
    if (response.error) {
      throw new Error(response.error);
    }
    
    return response;
  }
};

export default API;
