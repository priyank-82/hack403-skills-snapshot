import axios from 'axios';
import CognitoAuthService from './cognitoAuth';
import AccessTokenAuthService from './accessTokenAuth';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';
const AUTH_METHOD = process.env.REACT_APP_AUTH_METHOD || 'cognito'; // 'cognito' or 'accessToken'

class ApiService {
  constructor() {
    this.authService = AUTH_METHOD === 'cognito' ? CognitoAuthService : AccessTokenAuthService;
    this.api = this.setupAxiosInstance();
  }

  setupAxiosInstance() {
    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    api.interceptors.request.use(
      async (config) => {
        try {
          let token;
          
          if (AUTH_METHOD === 'cognito') {
            token = await this.authService.getAccessToken();
          } else {
            token = this.authService.getAccessToken();
          }

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error getting auth token:', error);
        }
        
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor to handle auth errors
    api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            if (AUTH_METHOD === 'cognito') {
              await this.authService.refreshSession();
              const newToken = await this.authService.getAccessToken();
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return api(originalRequest);
            } else {
              const newToken = await this.authService.refreshAccessToken();
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            this.authService.logout();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    return api;
  }

  // Companies API
  async getCompanies() {
    try {
      const response = await this.api.get('/api/companies');
      return response.data;
    } catch (error) {
      console.error('Error fetching companies:', error);
      throw error;
    }
  }

  async updateUserCompany(companyId) {
    try {
      const response = await this.api.put('/api/user/company', { companyId });
      return response.data;
    } catch (error) {
      console.error('Error updating user company:', error);
      throw error;
    }
  }

  async getUserProfile() {
    try {
      const response = await this.api.get('/api/user/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  // Job Skills API
  async getJobTitleSkills() {
    try {
      const response = await this.api.post('/api/job-title-skills');
      return response.data;
    } catch (error) {
      console.error('Error fetching job title skills:', error);
      throw error;
    }
  }

  async generateJobDescription(jobTitle, industry, company, experienceLevel) {
    try {
      const response = await this.api.post('/api/job-description', {
        jobTitle,
        industry,
        company,
        experienceLevel
      });
      return response.data;
    } catch (error) {
      console.error('Error generating job description:', error);
      throw error;
    }
  }

  // AI Chat API
  async chatWithAI(message) {
    try {
      const response = await this.api.post('/api/ai-chat', { message });
      return response.data;
    } catch (error) {
      console.error('Error chatting with AI:', error);
      throw error;
    }
  }
}

export default new ApiService();
