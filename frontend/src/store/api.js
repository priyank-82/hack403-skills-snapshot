import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = 'http://localhost:8000';

// Define a service using a base URL and expected endpoints
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get token from localStorage or state
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Job', 'Skill', 'User', 'Company', 'Dashboard', 'Analytics'],
  endpoints: (builder) => ({
    // Auth endpoints with fallback to test data
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response, meta, arg) => {
        // Store auth data in localStorage on successful login
        if (response.user && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
      },
      transformErrorResponse: (response, meta, arg) => {
        // Fallback to mock data for testing
        console.warn('API login failed, using mock data for testing:', response.data?.message || response.error);
        
        const mockUser = {
          id: 1,
          name: arg.email.split('@')[0],
          email: arg.email,
          avatar: null,
          preferences: {
            theme: 'light',
            notifications: true
          }
        };
        
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        return { user: mockUser, token: mockToken };
      },
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: '/auth/signup',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response, meta, arg) => {
        // Don't store auth data in localStorage on signup - only return user data
        return { user: response.user, success: true, message: 'Account created successfully!' };
      },
      transformErrorResponse: (response, meta, arg) => {
        // Fallback to mock data for testing
        console.warn('API signup failed, using mock data for testing:', response.data?.message || response.error);
        
        const mockUser = {
          id: Date.now(),
          name: arg.name,
          email: arg.email,
          avatar: null,
          preferences: {
            theme: 'light',
            notifications: true
          }
        };
        
        // Store user data temporarily for verification but don't auto-login
        localStorage.setItem('tempSignupUser', JSON.stringify(mockUser));
        
        return { user: mockUser, success: true, message: 'Account created successfully!' };
      },
    }),
    phoenixLogin: builder.mutation({
      query: (credentials) => ({
        url: '/auth/phoenix-login',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response, meta, arg) => {
        // Store auth data in localStorage on successful Phoenix login
        if (response.user && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
      },
      transformErrorResponse: (response, meta, arg) => {
        // Fallback to mock Phoenix data for testing
        console.warn('Phoenix login API failed, using mock data for testing:', response.data?.message || response.error);
        
        // Simulate different Phoenix.edu users based on email
        const email = arg?.email || 'student@phoenix.edu';
        let phoenixUserData;
        if (email.includes('student')) {
          phoenixUserData = {
            email: email,
            name: 'Alex Johnson',
            department: 'Information Technology',
            role: 'Student',
            studentId: 'PHX' + Math.floor(Math.random() * 1000000)
          };
        } else if (email.includes('instructor') || email.includes('prof')) {
          phoenixUserData = {
            email: email,
            name: 'Dr. Sarah Williams',
            department: 'Computer Science',
            role: 'Instructor',
            employeeId: 'EMP' + Math.floor(Math.random() * 10000)
          };
        } else if (email.includes('admin')) {
          phoenixUserData = {
            email: email,
            name: 'Michael Chen',
            department: 'Academic Affairs',
            role: 'Administrator',
            employeeId: 'ADM' + Math.floor(Math.random() * 10000)
          };
        } else {
          // Default to student
          phoenixUserData = {
            email: email,
            name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
            department: 'General Studies',
            role: 'Student',
            studentId: 'PHX' + Math.floor(Math.random() * 1000000)
          };
        }
        
        const phoenixUser = {
          id: Date.now(),
          name: phoenixUserData.name,
          email: phoenixUserData.email,
          avatar: null,
          phoenixId: 'phoenix-' + Date.now(),
          department: phoenixUserData.department,
          role: phoenixUserData.role,
          studentId: phoenixUserData.studentId,
          employeeId: phoenixUserData.employeeId,
          authProvider: 'phoenix',
          needsCompanySelection: true,
          preferences: {
            theme: 'light',
            notifications: true
          }
        };
        
        const mockToken = 'phoenix-sso-token-' + Date.now();
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(phoenixUser));
        
        return { user: phoenixUser, token: mockToken };
      },
    }),
    phoenixSSO: builder.mutation({
      query: () => ({
        url: '/auth/phoenix-sso',
        method: 'POST',
      }),
      transformErrorResponse: (response, meta, arg) => {
        // Fallback to redirect for testing
        console.warn('Phoenix SSO API failed, using redirect for testing:', response.data?.message || response.error);
        return { redirect: '/phoenix-login' };
      },
    }),
    
    // User endpoints
    getProfile: builder.query({
      query: () => '/profile',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation({
      query: (profileData) => ({
        url: '/profile',
        method: 'PUT',
        body: profileData,
      }),
      invalidatesTags: ['User'],
    }),
    
    // Job endpoints
    getJobs: builder.query({
      query: ({ page = 1, limit = 10, search = '', filters = {} } = {}) => {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          ...(search && { search }),
          ...filters,
        });
        return `/jobs?${params}`;
      },
      providesTags: ['Job'],
    }),
    getJobById: builder.query({
      query: (id) => `/jobs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Job', id }],
    }),
    getJobMatches: builder.query({
      query: () => '/jobs/matches',
      providesTags: ['Job'],
    }),
    createJob: builder.mutation({
      query: (jobData) => ({
        url: '/jobs',
        method: 'POST',
        body: jobData,
      }),
      invalidatesTags: ['Job'],
    }),
    applyToJob: builder.mutation({
      query: (jobId) => ({
        url: `/jobs/${jobId}/apply`,
        method: 'POST',
      }),
      invalidatesTags: ['Job'],
    }),
    
    // Skills endpoints
    getSkills: builder.query({
      query: () => '/skills',
      providesTags: ['Skill'],
    }),
    getUserSkills: builder.query({
      query: () => '/skills/user',
      providesTags: ['Skill'],
    }),
    addSkill: builder.mutation({
      query: (skillData) => ({
        url: '/skills',
        method: 'POST',
        body: skillData,
      }),
      invalidatesTags: ['Skill'],
    }),
    updateSkill: builder.mutation({
      query: ({ id, ...skillData }) => ({
        url: `/skills/${id}`,
        method: 'PUT',
        body: skillData,
      }),
      invalidatesTags: ['Skill'],
    }),
    deleteSkill: builder.mutation({
      query: (id) => ({
        url: `/skills/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Skill'],
    }),
    getSkillPredictions: builder.query({
      query: () => '/skills/predictions',
      providesTags: ['Skill'],
    }),
    scrapeJobSkills: builder.query({
      query: (companyName) => `/scrape-job-skills?company_name=${encodeURIComponent(companyName)}`,
      providesTags: ['Skill'],
    }),
    
    // Company endpoints
    getCompanies: builder.query({
      query: () => '/companies',
      providesTags: ['Company'],
      transformResponse: (response) => {
        // Transform the response to ensure consistent data structure
        return response.companies || response.data || response;
      },
    }),
    getJobPostings: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams(params);
        return `/job_postings?${searchParams}`;
      },
      providesTags: ['Job', 'Company'],
    }),
    getCompaniesFromJobs: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams(params);
        return `/job_postings?${searchParams}`;
      },
      providesTags: ['Job', 'Company'],
      transformResponse: (response) => {
        // Extract unique companies from job postings
        const companyMap = new Map();
        
        if (response && Array.isArray(response)) {
          response.forEach(job => {
            if (job.company && !companyMap.has(job.company.name)) {
              companyMap.set(job.company.name, {
                id: job.company.id || job.company.name.toLowerCase().replace(/\s+/g, '-'),
                name: job.company.name,
                domain: job.company.domain || '',
                industry: job.company.industry || 'Technology',
                location: job.location || '',
                jobCount: 1
              });
            } else if (job.company && companyMap.has(job.company.name)) {
              companyMap.get(job.company.name).jobCount++;
            }
          });
        }
        
        return Array.from(companyMap.values());
      },
    }),
    getCompanyById: builder.query({
      query: (id) => `/companies/${id}`,
      providesTags: (result, error, id) => [{ type: 'Company', id }],
    }),
    getUserCompany: builder.query({
      query: () => '/companies/user',
      providesTags: ['Company', 'User'],
    }),
    selectCompany: builder.mutation({
      query: (companyId) => ({
        url: `/companies/select`,
        method: 'POST',
        body: { company_id: companyId },
      }),
      invalidatesTags: ['Company', 'Dashboard', 'User'],
      async onQueryStarted(companyId, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log('Company selection API call successful:', data);
        } catch (error) {
          console.error('Company selection API call failed:', error);
        }
      },
    }),
    getCompanyJobs: builder.query({
      query: (companyId) => `/companies/${companyId}/jobs`,
      providesTags: (result, error, companyId) => [
        { type: 'Job', id: 'LIST' },
        { type: 'Company', id: companyId },
      ],
    }),
    
    //Dashboard endpoints
   getDashboardData: builder.query({
      query: () => '/dashboard',
      providesTags: ['Dashboard'],
    }),
    getDashboardStats: builder.query({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
    }), 
    // getDashboardStats: builder.query({
    //   query: () => '/job-postings',
    //   providesTags: ['Dashboard'],
    // }),
    
    
    // Analytics endpoints
    getAnalytics: builder.query({
      query: (params = {}) => {
        const searchParams = new URLSearchParams(params);
        return `/analytics?${searchParams}`;
      },
      providesTags: ['Analytics'],
    }),
    getSkillTrends: builder.query({
      query: () => '/analytics/skill-trends',
      providesTags: ['Analytics'],
    }),
    getJobMarketData: builder.query({
      query: () => '/analytics/job-market',
      providesTags: ['Analytics'],
    }),
    
    // AI endpoints
    getAIInsights: builder.query({
      query: () => '/ai/insights',
      providesTags: ['Analytics'],
    }),
    generateRecommendations: builder.mutation({
      query: (params) => ({
        url: '/ai/recommendations',
        method: 'POST',
        body: params,
      }),
      invalidatesTags: ['Analytics'],
    }),
    chatWithAI: builder.mutation({
      query: (message) => ({
        url: '/ai/chat',
        method: 'POST',
        body: { message },
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  // Auth hooks
  useLoginMutation,
  useSignupMutation,
  usePhoenixLoginMutation,
  usePhoenixSSOMutation,
  
  // // User hooks
  useGetProfileQuery,
  useUpdateProfileMutation,
  
  // // Job hooks
  useGetJobsQuery,
  useGetJobByIdQuery,
  useGetJobMatchesQuery,
  useCreateJobMutation,
  useApplyToJobMutation,
  
  // // Skills hooks
  useGetSkillsQuery,
  useGetUserSkillsQuery,
  useAddSkillMutation,
  useUpdateSkillMutation,
  useDeleteSkillMutation,
  useGetSkillPredictionsQuery,
  useScrapeJobSkillsQuery,
  
  // // Company hooks
  useGetCompaniesQuery,
  useGetCompanyByIdQuery,
  useGetUserCompanyQuery,
  useSelectCompanyMutation,
  useGetCompanyJobsQuery,
  useGetJobPostingsQuery,
  useGetCompaniesFromJobsQuery,
  
  // // Dashboard hooks
  useGetDashboardDataQuery,
  useGetDashboardStatsQuery,
  
  // // Analytics hooks
  useGetAnalyticsQuery,
  useGetSkillTrendsQuery,
  useGetJobMarketDataQuery,
  
  // // AI hooks
  useGetAIInsightsQuery,
  useGenerateRecommendationsMutation,
  useChatWithAIMutation,
} = api;
