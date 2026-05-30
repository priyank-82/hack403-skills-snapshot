// Root API and Job Postings API Type Definitions
import { 
  ApiResponse, 
  ApiMethod, 
  ApiMethodWithParams, 
  ApiMethodWithId,
  ApiMethodWithData,
  ApiMethodWithIdAndData,
  User,
  Company,
  JobApplication,
  JobAlert,
  JobStatistics,
  HealthCheckResponse,
  ListResponse,
  CreateResponse,
  UpdateResponse,
  DeleteResponse,
  SearchFilters,
  PaginationParams
} from './common.types';

// Root API interface
export interface RootAPI {
  baseURL: string;
  getHeaders: () => Record<string, string>;
  healthCheck: ApiMethod<HealthCheckResponse>;
  request: (endpoint: string, options?: any) => Promise<any>;
  
  auth: {
    login: ApiMethodWithData<any, any>;
    logout: ApiMethod<any>;
    refreshToken: ApiMethod<any>;
    getCurrentUser: ApiMethod<User>;
  };
  
  users: {
    getProfile: ApiMethod<User>;
    updateProfile: ApiMethodWithData<User, any>;
    deleteProfile: ApiMethod<DeleteResponse>;
  };
  
  companies: {
    getAll: ApiMethod<ListResponse<Company>>;
    getById: ApiMethodWithId<Company>;
    create: ApiMethodWithData<CreateResponse<Company>, any>;
    update: ApiMethodWithIdAndData<UpdateResponse<Company>, any>;
    delete: ApiMethodWithId<DeleteResponse>;
  };
}

// Job Postings API interface
export interface JobPostingsAPI {
  baseURL: string;
  getHeaders: () => Record<string, string>;
  request: (endpoint: string, options?: any) => Promise<any>;
  
  jobs: {
    getAll: ApiMethodWithParams<ListResponse<any>, PaginationParams>;
    getById: ApiMethodWithId<any>;
    create: ApiMethodWithData<CreateResponse<any>, any>;
    update: ApiMethodWithIdAndData<UpdateResponse<any>, any>;
    delete: ApiMethodWithId<DeleteResponse>;
    search: ApiMethodWithParams<ListResponse<any>, SearchFilters>;
    getByCompany: ApiMethodWithParams<ListResponse<any>, { companyId: string }>;
    getByLocation: ApiMethodWithParams<ListResponse<any>, { location: string }>;
    getBySkill: ApiMethodWithParams<ListResponse<any>, { skillId: string }>;
    getBySalaryRange: ApiMethodWithParams<ListResponse<any>, { minSalary: number; maxSalary: number }>;
  };
  
  categories: {
    getAll: ApiMethod<ListResponse<any>>;
    getJobsByCategory: ApiMethodWithParams<ListResponse<any>, { categoryId: string }>;
  };
  
  analytics: {
    getStats: ApiMethodWithParams<JobStatistics, any>;
    getTrending: ApiMethodWithParams<ListResponse<any>, any>;
    getMarketInsights: ApiMethodWithParams<any, any>;
    getSkillsDemand: ApiMethodWithParams<any, any>;
  };
  
  alerts: {
    create: ApiMethodWithData<CreateResponse<JobAlert>, any>;
    getUserAlerts: ApiMethod<ListResponse<JobAlert>>;
    update: ApiMethodWithIdAndData<UpdateResponse<JobAlert>, any>;
    delete: ApiMethodWithId<DeleteResponse>;
  };
  
  applications: {
    submit: ApiMethodWithData<CreateResponse<JobApplication>, { jobId: string; applicationData: any }>;
    getUserApplications: ApiMethod<ListResponse<JobApplication>>;
    getById: ApiMethodWithId<JobApplication>;
    updateStatus: ApiMethodWithIdAndData<UpdateResponse<JobApplication>, { status: string }>;
  };
}
