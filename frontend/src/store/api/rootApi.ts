// Root API RTK Query hooks
import { baseApi } from './baseApi';
import {
  User,
  Company,
  HealthCheckResponse,
  ListResponse,
  CreateResponse,
  UpdateResponse,
  DeleteResponse,
  LoginCredentials,
  AuthResponse
} from '../../api/types';

// Root API slice
export const rootApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Health check
    healthCheck: builder.query<HealthCheckResponse, void>({
      query: () => ({
        url: '/health',
        method: 'GET',
      }),
    }),

    // Authentication endpoints
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: '/auth/me',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    // User management endpoints
    getUserProfile: builder.query<User, void>({
      query: () => ({
        url: '/users/profile',
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    updateUserProfile: builder.mutation<UpdateResponse<User>, Partial<User>>({
      query: (userData) => ({
        url: '/users/profile',
        method: 'PUT',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),

    deleteUserProfile: builder.mutation<DeleteResponse, void>({
      query: () => ({
        url: '/users/profile',
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Company management endpoints
    getCompanies: builder.query<ListResponse<Company>, { page?: number; limit?: number; search?: string }>({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            queryParams.append(key, value.toString());
          }
        });

        return {
          url: `/companies${queryParams.toString() ? `?${queryParams.toString()}` : ''}`,
          method: 'GET',
        };
      },
      providesTags: ['Company'],
    }),

    getCompanyById: builder.query<Company, string>({
      query: (companyId) => ({
        url: `/companies/${companyId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Company', id }],
    }),

    createCompany: builder.mutation<CreateResponse<Company>, Partial<Company>>({
      query: (companyData) => ({
        url: '/companies',
        method: 'POST',
        body: companyData,
      }),
      invalidatesTags: ['Company'],
    }),

    updateCompany: builder.mutation<UpdateResponse<Company>, { id: string; data: Partial<Company> }>({
      query: ({ id, data }) => ({
        url: `/companies/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Company', id }],
    }),

    deleteCompany: builder.mutation<DeleteResponse, string>({
      query: (companyId) => ({
        url: `/companies/${companyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Company', id }],
    }),

    // User company selection
    updateUserCompany: builder.mutation<UpdateResponse<User>, string>({
      query: (companyId) => ({
        url: '/users/company',
        method: 'PUT',
        body: { companyId },
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Export hooks
export const {
  useHealthCheckQuery,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useGetCurrentUserQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useDeleteUserProfileMutation,
  useGetCompaniesQuery,
  useLazyGetCompaniesQuery,
  useGetCompanyByIdQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
  useUpdateUserCompanyMutation,
} = rootApi;
