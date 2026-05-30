// Lightcast API RTK Query hooks
import { baseApi } from './baseApi';
import {
  RootResponse,
  LightcastTokenResponse,
  JobPostingsResponse,
  JobPostingFilters,
  SkillsResponse,
  SkillDetail,
  Occupation,
  OccupationsResponse,
  LaborMarketData,
  EducationResponse,
  SkillsGapAnalysis
} from '../../api/types';

// Lightcast API base URL
const LIGHTCAST_BASE_URL = (window as any).ENV?.REACT_APP_LIGHTCAST_API_URL || 'http://0.0.0.0:8000';

// Create Lightcast API slice
export const lightcastApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Root endpoint
    getLightcastRoot: builder.query<RootResponse, void>({
      query: () => ({
        url: `${LIGHTCAST_BASE_URL}/`,
        method: 'GET',
      }),
      providesTags: ['LightcastToken'],
    }),

    // Get Lightcast token
    getLightcastToken: builder.query<LightcastTokenResponse, void>({
      query: () => ({
        url: `${LIGHTCAST_BASE_URL}/lightcast/token`,
        method: 'GET',
      }),
      providesTags: ['LightcastToken'],
    }),

    // Get job postings
    getJobPostings: builder.query<JobPostingsResponse, JobPostingFilters | void>({
      query: (filters = {}) => {
        const params = new URLSearchParams();
        
        // Add filters to query params
        if (filters && typeof filters === 'object') {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              if (Array.isArray(value)) {
                value.forEach(v => params.append(key, v.toString()));
              } else {
                params.append(key, value.toString());
              }
            }
          });
        }

        return {
          url: `${LIGHTCAST_BASE_URL}/job/postings${params.toString() ? `?${params.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['JobPosting'],
    }),

    // Get skills
    getSkills: builder.query<SkillsResponse, { query?: string; limit?: number; offset?: number }>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.query) queryParams.append('q', params.query);
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.offset) queryParams.append('offset', params.offset.toString());

        return {
          url: `${LIGHTCAST_BASE_URL}/skills${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Skill'],
    }),

    // Get skill by ID
    getSkillById: builder.query<SkillDetail, string>({
      query: (skillId) => ({
        url: `${LIGHTCAST_BASE_URL}/skills/${skillId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Skill', id }],
    }),

    // Search skills
    searchSkills: builder.query<SkillsResponse, { query: string; limit?: number; offset?: number }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        queryParams.append('q', params.query);
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.offset) queryParams.append('offset', params.offset.toString());

        return {
          url: `${LIGHTCAST_BASE_URL}/skills/search?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Skill'],
    }),

    // Get trending skills
    getTrendingSkills: builder.query<SkillsResponse, { location?: string; industry?: string; limit?: number }>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.location) queryParams.append('location', params.location);
        if (params.industry) queryParams.append('industry', params.industry);
        if (params.limit) queryParams.append('limit', params.limit.toString());

        return {
          url: `${LIGHTCAST_BASE_URL}/skills/trending${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Skill'],
    }),

    // Get occupations
    getOccupations: builder.query<OccupationsResponse, { query?: string; limit?: number; offset?: number }>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.query) queryParams.append('q', params.query);
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.offset) queryParams.append('offset', params.offset.toString());

        return {
          url: `${LIGHTCAST_BASE_URL}/occupations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Occupation'],
    }),

    // Get occupation by ID
    getOccupationById: builder.query<Occupation, string>({
      query: (occupationId) => ({
        url: `${LIGHTCAST_BASE_URL}/occupations/${occupationId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Occupation', id }],
    }),

    // Search occupations
    searchOccupations: builder.query<OccupationsResponse, { query: string; limit?: number; offset?: number }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        queryParams.append('q', params.query);
        if (params.limit) queryParams.append('limit', params.limit.toString());
        if (params.offset) queryParams.append('offset', params.offset.toString());

        return {
          url: `${LIGHTCAST_BASE_URL}/occupations/search?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Occupation'],
    }),

    // Get skills by occupation
    getSkillsByOccupation: builder.query<SkillsResponse, string>({
      query: (occupationId) => ({
        url: `${LIGHTCAST_BASE_URL}/occupations/${occupationId}/skills`,
        method: 'GET',
      }),
      providesTags: (result, error, occupationId) => [
        { type: 'Skill', id: `occupation-${occupationId}` },
        { type: 'Occupation', id: occupationId }
      ],
    }),

    // Get labor market data
    getLaborMarketData: builder.query<LaborMarketData, { region: string; [key: string]: any }>({
      query: ({ region, ...params }) => {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });

        return {
          url: `${LIGHTCAST_BASE_URL}/regional/${region}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: (result, error, { region }) => [{ type: 'Analytics', id: `region-${region}` }],
    }),

    // Get education programs
    getEducationPrograms: builder.query<EducationResponse, { query?: string; level?: string; limit?: number }>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.query) queryParams.append('q', params.query);
        if (params.level) queryParams.append('level', params.level);
        if (params.limit) queryParams.append('limit', params.limit.toString());

        return {
          url: `${LIGHTCAST_BASE_URL}/programs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Analytics'],
    }),

    // Get skills gap analysis
    getSkillsGapAnalysis: builder.query<SkillsGapAnalysis, { 
      currentSkills: string[]; 
      targetRole: string; 
      location?: string 
    }>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        
        params.currentSkills.forEach(skill => queryParams.append('current_skills', skill));
        queryParams.append('target_role', params.targetRole);
        if (params.location) queryParams.append('location', params.location);

        return {
          url: `${LIGHTCAST_BASE_URL}/skills-gap?${queryParams.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Analytics'],
    }),
  }),
});

// Export hooks
export const {
  useGetLightcastRootQuery,
  useGetLightcastTokenQuery,
  useGetJobPostingsQuery,
  useLazyGetJobPostingsQuery,
  useGetSkillsQuery,
  useLazyGetSkillsQuery,
  useGetSkillByIdQuery,
  useSearchSkillsQuery,
  useLazySearchSkillsQuery,
  useGetTrendingSkillsQuery,
  useGetOccupationsQuery,
  useLazyGetOccupationsQuery,
  useGetOccupationByIdQuery,
  useSearchOccupationsQuery,
  useLazySearchOccupationsQuery,
  useGetSkillsByOccupationQuery,
  useGetLaborMarketDataQuery,
  useLazyGetLaborMarketDataQuery,
  useGetEducationProgramsQuery,
  useLazyGetEducationProgramsQuery,
  useGetSkillsGapAnalysisQuery,
  useLazyGetSkillsGapAnalysisQuery,
} = lightcastApi;
