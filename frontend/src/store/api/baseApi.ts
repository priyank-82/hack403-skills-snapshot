// Base API configuration for RTK Query
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { ApiResponse } from '../../api/types';

// Base query with authentication
const baseQuery = fetchBaseQuery({
  baseUrl: (window as any).ENV?.REACT_APP_API_BASE_URL || 'http://localhost:3001',
  prepareHeaders: (headers, { getState }) => {
    // Get token from localStorage or state
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    return headers;
  },
});

// Base query with error handling and token refresh
const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  if (result.error && result.error.status === 401) {
    // Try to refresh token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
    
    if (refreshResult.data) {
      // Store new token
      const { token } = refreshResult.data as { token: string };
      localStorage.setItem('token', token);
      
      // Retry original query
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, logout user
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }
  
  return result;
};

// Create the base API slice
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Company',
    'Job',
    'JobPosting',
    'Skill',
    'Occupation',
    'JobAlert',
    'JobApplication',
    'Analytics',
    'LightcastToken'
  ],
  endpoints: () => ({}),
});

// Export hooks
export const { } = baseApi;

// Utility function to transform API responses
export const transformResponse = <T>(response: ApiResponse<T>): T => {
  if (response.success && response.data) {
    return response.data;
  }
  throw new Error(response.error || 'API request failed');
};

// Utility function to handle query errors
export const handleQueryError = (error: FetchBaseQueryError) => {
  if ('status' in error) {
    const errorData = error.data as any;
    return {
      message: errorData?.message || `Error: ${error.status}`,
      status: error.status
    };
  }
  return {
    message: 'Network error',
    status: 0
  };
};

export default baseApi;
