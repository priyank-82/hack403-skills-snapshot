// Job Postings API RTK Query hooks
import { baseApi } from './baseApi';
import {
  JobPosting,
  JobApplication,
  JobAlert,
  JobStatistics,
  ListResponse,
  CreateResponse,
  UpdateResponse,
  DeleteResponse,
  SearchFilters,
  PaginationParams
} from '../../api/types';

// Utility function to build query parameters
const buildQueryParams = (params: Record<string, any>) => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 0) {
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(key, v.toString()));
      } else {
        queryParams.append(key, value.toString());
      }
    }
  });
  
  return queryParams;
};

// Job Postings API slice
export const jobPostingsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all job postings
    getJobs: builder.query<ListResponse<JobPosting>, PaginationParams & SearchFilters>({
      query: (params = {}) => {
        const queryParams = buildQueryParams(params);
        return {
          url: `/job-postings${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Job'],
    }),

    // Get job by ID
    getJobById: builder.query<JobPosting, string>({
      query: (jobId) => ({
        url: `/job-postings/${jobId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Job', id }],
    }),

    // Create job posting
    createJob: builder.mutation<CreateResponse<JobPosting>, Partial<JobPosting>>({
      query: (jobData) => ({
        url: '/job-postings',
        method: 'POST',
        body: jobData,
      }),
      invalidatesTags: ['Job'],
    }),

    // Update job posting
    updateJob: builder.mutation<UpdateResponse<JobPosting>, { id: string; data: Partial<JobPosting> }>({
      query: ({ id, data }) => ({
        url: `/job-postings/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Job', id }],
    }),

    // Delete job posting
    deleteJob: builder.mutation<DeleteResponse, string>({
      query: (jobId) => ({
        url: `/job-postings/${jobId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Job', id }],
    }),

    // Search job postings
    searchJobs: builder.query<ListResponse<JobPosting>, SearchFilters & { query: string }>({
      query: (params) => {
        const queryParams = buildQueryParams(params);
        return {
          url: `/job-postings/search?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Job'],
    }),

    // Get jobs by company
    getJobsByCompany: builder.query<ListResponse<JobPosting>, { companyId: string } & PaginationParams>({
      query: ({ companyId, ...params }) => {
        const queryParams = buildQueryParams(params);
        return {
          url: `/job-postings/company/${companyId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, { companyId }) => [
        { type: 'Job', id: `company-${companyId}` }
      ],
    }),

    // Get jobs by location
    getJobsByLocation: builder.query<ListResponse<JobPosting>, { location: string } & PaginationParams>({
      query: ({ location, ...params }) => {
        const queryParams = buildQueryParams(params);
        return {
          url: `/job-postings/location/${encodeURIComponent(location)}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, { location }) => [
        { type: 'Job', id: `location-${location}` }
      ],
    }),

    // Get jobs by skill
    getJobsBySkill: builder.query<ListResponse<JobPosting>, { skillId: string } & PaginationParams>({
      query: ({ skillId, ...params }) => {
        const queryParams = buildQueryParams(params);
        return {
          url: `/job-postings/skill/${skillId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, { skillId }) => [
        { type: 'Job', id: `skill-${skillId}` }
      ],
    }),

    // Get jobs by salary range
    getJobsBySalaryRange: builder.query<ListResponse<JobPosting>, { 
      minSalary: number; 
      maxSalary: number 
    } & PaginationParams>({
      query: ({ minSalary, maxSalary, ...params }) => {
        const allParams = { min_salary: minSalary, max_salary: maxSalary, ...params };
        const queryParams = buildQueryParams(allParams);
        return {
          url: `/job-postings/salary-range?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, { minSalary, maxSalary }) => [
        { type: 'Job', id: `salary-${minSalary}-${maxSalary}` }
      ],
    }),

    // Get job categories
    getJobCategories: builder.query<ListResponse<any>, void>({
      query: () => ({
        url: '/job-postings/categories',
        method: 'GET',
      }),
      providesTags: ['Analytics'],
    }),

    // Get jobs by category
    getJobsByCategory: builder.query<ListResponse<JobPosting>, { categoryId: string } & PaginationParams>({
      query: ({ categoryId, ...params }) => {
        const queryParams = buildQueryParams(params);
        return {
          url: `/job-postings/categories/${categoryId}/jobs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, { categoryId }) => [
        { type: 'Job', id: `category-${categoryId}` }
      ],
    }),

    // Get job statistics
    getJobStats: builder.query<JobStatistics, any>({
      query: (params = {}) => {
        const queryParams = buildQueryParams(params);
        return {
          url: `/job-postings/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Analytics'],
    }),

    // Get trending jobs
    getTrendingJobs: builder.query<ListResponse<JobPosting>, any>({
      query: (params = {}) => {
        const queryParams = buildQueryParams(params);
        return {
          url: `/job-postings/trending${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Analytics'],
    }),

    // Get market insights
    getMarketInsights: builder.query<any, any>({
      query: (params = {}) => {
        const queryParams = buildQueryParams(params);
        return {
          url: `/job-postings/market-insights${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Analytics'],
    }),

    // Get skills demand
    getSkillsDemand: builder.query<any, any>({
      query: (params = {}) => {
        const queryParams = buildQueryParams(params);
        return {
          url: `/job-postings/skills-demand${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Analytics'],
    }),

    // Job Alerts
    createJobAlert: builder.mutation<CreateResponse<JobAlert>, Partial<JobAlert>>({
      query: (alertData) => ({
        url: '/job-postings/alerts',
        method: 'POST',
        body: alertData,
      }),
      invalidatesTags: ['JobAlert'],
    }),

    getUserJobAlerts: builder.query<ListResponse<JobAlert>, void>({
      query: () => ({
        url: '/job-postings/alerts',
        method: 'GET',
      }),
      providesTags: ['JobAlert'],
    }),

    updateJobAlert: builder.mutation<UpdateResponse<JobAlert>, { id: string; data: Partial<JobAlert> }>({
      query: ({ id, data }) => ({
        url: `/job-postings/alerts/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'JobAlert', id }],
    }),

    deleteJobAlert: builder.mutation<DeleteResponse, string>({
      query: (alertId) => ({
        url: `/job-postings/alerts/${alertId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'JobAlert', id }],
    }),

    // Job Applications
    submitJobApplication: builder.mutation<CreateResponse<JobApplication>, { 
      jobId: string; 
      applicationData: any 
    }>({
      query: ({ jobId, applicationData }) => ({
        url: `/job-postings/${jobId}/apply`,
        method: 'POST',
        body: applicationData,
      }),
      invalidatesTags: ['JobApplication'],
    }),

    getUserJobApplications: builder.query<ListResponse<JobApplication>, void>({
      query: () => ({
        url: '/job-postings/applications',
        method: 'GET',
      }),
      providesTags: ['JobApplication'],
    }),

    getJobApplicationById: builder.query<JobApplication, string>({
      query: (applicationId) => ({
        url: `/job-postings/applications/${applicationId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'JobApplication', id }],
    }),

    updateJobApplicationStatus: builder.mutation<UpdateResponse<JobApplication>, { 
      id: string; 
      status: string 
    }>({
      query: ({ id, status }) => ({
        url: `/job-postings/applications/${id}/status`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'JobApplication', id }],
    }),
  }),
});

// Export hooks
export const {
  useGetJobsQuery,
  useLazyGetJobsQuery,
  useGetJobByIdQuery,
  useCreateJobMutation,
  useUpdateJobMutation,
  useDeleteJobMutation,
  useSearchJobsQuery,
  useLazySearchJobsQuery,
  useGetJobsByCompanyQuery,
  useLazyGetJobsByCompanyQuery,
  useGetJobsByLocationQuery,
  useLazyGetJobsByLocationQuery,
  useGetJobsBySkillQuery,
  useLazyGetJobsBySkillQuery,
  useGetJobsBySalaryRangeQuery,
  useLazyGetJobsBySalaryRangeQuery,
  useGetJobCategoriesQuery,
  useGetJobsByCategoryQuery,
  useLazyGetJobsByCategoryQuery,
  useGetJobStatsQuery,
  useLazyGetJobStatsQuery,
  useGetTrendingJobsQuery,
  useLazyGetTrendingJobsQuery,
  useGetMarketInsightsQuery,
  useLazyGetMarketInsightsQuery,
  useGetSkillsDemandQuery,
  useLazyGetSkillsDemandQuery,
  useCreateJobAlertMutation,
  useGetUserJobAlertsQuery,
  useUpdateJobAlertMutation,
  useDeleteJobAlertMutation,
  useSubmitJobApplicationMutation,
  useGetUserJobApplicationsQuery,
  useGetJobApplicationByIdQuery,
  useUpdateJobApplicationStatusMutation,
} = jobPostingsApi;
