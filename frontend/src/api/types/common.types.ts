// General API Type Definitions

// Base API Response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp?: string;
  status?: number;
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token?: string;
  expires_in: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  department?: string;
  company?: Company;
  companyId?: string;
  companySelected?: boolean;
  needsCompanySelection?: boolean;
  authProvider?: 'phoenix' | 'local';
  studentId?: string;
  employeeId?: string;
  profile?: UserProfile;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  experience?: WorkExperience[];
  education?: Education[];
  preferences?: UserPreferences;
}

export interface WorkExperience {
  id: string;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description: string;
  skills: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  gpa?: number;
  description?: string;
}

export interface UserPreferences {
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  jobAlerts: JobAlertPreferences;
}

export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  jobMatches: boolean;
  companyUpdates: boolean;
}

export interface PrivacyPreferences {
  profileVisible: boolean;
  contactInfoVisible: boolean;
  skillsVisible: boolean;
}

export interface JobAlertPreferences {
  frequency: 'daily' | 'weekly' | 'immediate';
  keywords: string[];
  locations: string[];
  salaryRange: SalaryRange;
}

export interface SalaryRange {
  min: number;
  max: number;
  currency: string;
}

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  RECRUITER = 'recruiter',
  EMPLOYER = 'employer',
  STUDENT = 'student',
  EMPLOYEE = 'employee'
}

// Company types
export interface Company {
  id: string;
  name: string;
  domain: string;
  industry: string;
  size: CompanySize;
  description?: string;
  logo_url?: string;
  website?: string;
  headquarters?: Location;
  founded_year?: number;
  employees_count?: number;
  revenue?: string;
  benefits?: string[];
  culture?: string[];
  tech_stack?: string[];
  created_at: string;
  updated_at: string;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export enum CompanySize {
  STARTUP = 'startup',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  ENTERPRISE = 'enterprise'
}

// Job Application types
export interface JobApplication {
  id: string;
  job_id: string;
  user_id: string;
  status: ApplicationStatus;
  applied_at: string;
  updated_at: string;
  cover_letter?: string;
  resume_url?: string;
  additional_documents?: Document[];
  interview_scheduled?: Interview;
  feedback?: ApplicationFeedback;
}

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  uploaded_at: string;
}

export interface Interview {
  id: string;
  type: InterviewType;
  scheduled_at: string;
  duration: number;
  location?: string;
  meeting_link?: string;
  interviewer: string;
  notes?: string;
}

export interface ApplicationFeedback {
  rating: number;
  comments: string;
  strengths: string[];
  areas_for_improvement: string[];
  next_steps: string;
}

export enum ApplicationStatus {
  PENDING = 'pending',
  REVIEWING = 'reviewing',
  SHORTLISTED = 'shortlisted',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  REJECTED = 'rejected',
  ACCEPTED = 'accepted',
  WITHDRAWN = 'withdrawn'
}

export enum DocumentType {
  RESUME = 'resume',
  COVER_LETTER = 'cover_letter',
  PORTFOLIO = 'portfolio',
  CERTIFICATION = 'certification',
  TRANSCRIPT = 'transcript'
}

export enum InterviewType {
  PHONE = 'phone',
  VIDEO = 'video',
  IN_PERSON = 'in_person',
  TECHNICAL = 'technical',
  BEHAVIORAL = 'behavioral'
}

// Job Alert types
export interface JobAlert {
  id: string;
  user_id: string;
  title: string;
  keywords: string[];
  locations: string[];
  job_types: string[];
  salary_range?: SalaryRange;
  experience_level?: string;
  company_size?: CompanySize;
  industries?: string[];
  skills?: string[];
  frequency: AlertFrequency;
  active: boolean;
  created_at: string;
  updated_at: string;
  last_sent_at?: string;
}

export enum AlertFrequency {
  IMMEDIATE = 'immediate',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly'
}

// Analytics and Statistics types
export interface JobStatistics {
  total_jobs: number;
  active_jobs: number;
  jobs_by_category: CategoryStats[];
  jobs_by_location: LocationStats[];
  jobs_by_company: CompanyStats[];
  salary_statistics: SalaryStatistics;
  trending_skills: TrendingSkill[];
  market_trends: MarketTrend[];
}

export interface CategoryStats {
  category: string;
  count: number;
  percentage: number;
  growth_rate: number;
}

export interface LocationStats {
  location: string;
  count: number;
  average_salary: number;
  demand_score: number;
}

export interface CompanyStats {
  company: string;
  job_count: number;
  average_salary: number;
  rating: number;
}

export interface SalaryStatistics {
  overall: {
    min: number;
    max: number;
    average: number;
    median: number;
  };
  by_experience: ExperienceSalaryStats[];
  by_location: LocationSalaryStats[];
  by_skill: SkillSalaryStats[];
}

export interface ExperienceSalaryStats {
  level: string;
  average: number;
  median: number;
  count: number;
}

export interface LocationSalaryStats {
  location: string;
  average: number;
  median: number;
  cost_of_living_index: number;
}

export interface SkillSalaryStats {
  skill: string;
  average: number;
  premium: number;
  demand: number;
}

export interface TrendingSkill {
  name: string;
  demand_score: number;
  growth_rate: number;
  job_count: number;
  salary_impact: number;
}

export interface MarketTrend {
  period: string;
  metric: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

// Pagination and Sorting
export interface PaginationInfo {
  page: number;
  per_page: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface SortingInfo {
  sort_by: string;
  sort_order: 'asc' | 'desc';
}

// Search and Filter types
export interface SearchFilters {
  query?: string;
  location?: string;
  salary_min?: number;
  salary_max?: number;
  experience_level?: string;
  job_type?: string;
  company_size?: CompanySize;
  industry?: string;
  skills?: string[];
  posted_within?: string;
  remote?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// API Error types
export interface ApiError {
  error: string;
  message: string;
  status_code: number;
  details?: Record<string, any>;
  timestamp: string;
}

// Health Check types
export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  version: string;
  uptime: number;
  database: {
    status: 'connected' | 'disconnected';
    response_time: number;
  };
  external_services: ExternalServiceStatus[];
}

export interface ExternalServiceStatus {
  name: string;
  status: 'up' | 'down' | 'degraded';
  response_time: number;
  last_checked: string;
}

// Utility types
export type ApiMethod<T> = () => Promise<ApiResponse<T>>;
export type ApiMethodWithParams<T, P = any> = (params?: P) => Promise<ApiResponse<T>>;
export type ApiMethodWithId<T> = (id: string) => Promise<ApiResponse<T>>;
export type ApiMethodWithData<T, D = any> = (data: D) => Promise<ApiResponse<T>>;
export type ApiMethodWithIdAndData<T, D = any> = (id: string, data: D) => Promise<ApiResponse<T>>;

// Date utilities
export type DateString = string; // ISO date string
export type TimestampString = string; // ISO datetime string
export type SortOrder = 'asc' | 'desc';
export type DateRange = {
  start: string;
  end: string;
};

// Pagination and Search parameters
export interface PaginationParams {
  page?: number;
  per_page?: number;
  limit?: number;
  offset?: number;
}

export interface SortingParams {
  sort_by?: string;
  sort_order?: SortOrder;
}

export interface SearchParams extends PaginationParams, SortingParams {
  query?: string;
  filters?: Record<string, any>;
  date_range?: DateRange;
}

// Common response types
export interface ListResponse<T> {
  items: T[];
  pagination: PaginationInfo;
  sorting?: SortingInfo;
  filters?: Record<string, any>;
}

export interface CreateResponse<T> {
  item: T;
  message: string;
}

export interface UpdateResponse<T> {
  item: T;
  message: string;
}

export interface DeleteResponse {
  message: string;
  deleted_id: string;
}
