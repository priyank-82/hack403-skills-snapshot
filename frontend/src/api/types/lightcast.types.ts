// Lightcast API Type Definitions
import { 
  ApiResponse, 
  ApiMethod, 
  ApiMethodWithParams, 
  ApiMethodWithId, 
  CompanySize,
  ApiError
} from './common.types';

// Root endpoint response
export interface RootResponse {
  message: string;
  version?: string;
  status: string;
  timestamp: string;
}

// Lightcast Token response
export interface LightcastTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope?: string;
}

// Job Posting interfaces
export interface JobPosting {
  id: string;
  title: string;
  company: LightcastCompanyInfo;
  location: LocationInfo;
  description: string;
  requirements: string[];
  skills: Skill[];
  salary?: SalaryInfo;
  employment_type: EmploymentType;
  experience_level: ExperienceLevel;
  posted_date: string;
  expires_date?: string;
  url?: string;
  source?: string;
  category?: string;
  industry?: string;
}

export interface LightcastCompanyInfo {
  id?: string;
  name: string;
  domain?: string;
  size?: CompanySize;
  industry?: string;
  description?: string;
  logo_url?: string;
  website?: string;
}

export interface LocationInfo {
  city: string;
  state?: string;
  country: string;
  postal_code?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  remote?: boolean;
  hybrid?: boolean;
}

export interface SalaryInfo {
  min?: number;
  max?: number;
  currency: string;
  period: SalaryPeriod;
  negotiable?: boolean;
}

export interface Skill {
  id: string;
  name: string;
  type: SkillType;
  level?: SkillLevel;
  importance?: SkillImportance;
  category?: string;
  description?: string;
}

// Job Postings response
export interface JobPostingsResponse {
  jobs: JobPosting[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
  filters_applied?: JobPostingFilters;
}

// Job Posting filters/parameters
export interface JobPostingFilters {
  location?: string;
  company?: string;
  title?: string;
  skills?: string[];
  salary_min?: number;
  salary_max?: number;
  employment_type?: EmploymentType;
  experience_level?: ExperienceLevel;
  posted_since?: string;
  industry?: string;
  remote?: boolean;
  limit?: number;
  offset?: number;
}

// Enums specific to Lightcast
export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  TEMPORARY = 'temporary',
  INTERNSHIP = 'internship',
  FREELANCE = 'freelance'
}

export enum ExperienceLevel {
  ENTRY_LEVEL = 'entry_level',
  JUNIOR = 'junior',
  MID_LEVEL = 'mid_level',
  SENIOR = 'senior',
  LEAD = 'lead',
  EXECUTIVE = 'executive'
}

export enum SalaryPeriod {
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

export enum SkillType {
  TECHNICAL = 'technical',
  SOFT = 'soft',
  CERTIFICATION = 'certification',
  LANGUAGE = 'language',
  TOOL = 'tool',
  FRAMEWORK = 'framework'
}

export enum SkillLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

export enum SkillImportance {
  REQUIRED = 'required',
  PREFERRED = 'preferred',
  NICE_TO_HAVE = 'nice_to_have'
}

export enum EducationLevel {
  CERTIFICATE = 'certificate',
  ASSOCIATE = 'associate',
  BACHELOR = 'bachelor',
  MASTER = 'master',
  DOCTORATE = 'doctorate',
  PROFESSIONAL = 'professional'
}

// Skills data interfaces
export interface SkillsResponse {
  skills: Skill[];
  total: number;
  page?: number;
  per_page?: number;
}

export interface SkillDetail extends Skill {
  aliases?: string[];
  related_skills?: string[];
  job_postings_count?: number;
  trending_score?: number;
  salary_impact?: number;
  growth_rate?: number;
}

// Occupations interfaces
export interface Occupation {
  id: string;
  title: string;
  code?: string;
  description: string;
  typical_education?: string;
  median_salary?: number;
  job_outlook?: JobOutlook;
  required_skills?: Skill[];
  related_occupations?: string[];
  industries?: string[];
}

export interface JobOutlook {
  growth_rate: number;
  growth_description: string;
  job_openings: number;
  outlook_period: string;
}

export interface OccupationsResponse {
  occupations: Occupation[];
  total: number;
  page?: number;
  per_page?: number;
}

// Labor Market interfaces
export interface LaborMarketData {
  region: string;
  unemployment_rate: number;
  employment_growth: number;
  average_salary: number;
  job_openings: number;
  top_industries: IndustryData[];
  top_occupations: OccupationData[];
  skills_demand: SkillDemand[];
}

export interface IndustryData {
  name: string;
  employment_count: number;
  growth_rate: number;
  average_salary: number;
}

export interface OccupationData {
  title: string;
  employment_count: number;
  median_salary: number;
  job_openings: number;
}

export interface SkillDemand {
  skill: string;
  demand_score: number;
  job_postings_count: number;
  growth_rate: number;
}

// Education interfaces
export interface EducationProgram {
  id: string;
  title: string;
  institution: string;
  level: EducationLevel;
  duration: string;
  description: string;
  skills_covered: Skill[];
  career_paths: string[];
  cost?: number;
  accreditation?: string;
}

export interface EducationResponse {
  programs: EducationProgram[];
  total: number;
  page?: number;
  per_page?: number;
}

// Skills Gap Analysis
export interface SkillsGapAnalysis {
  current_skills: Skill[];
  target_role: string;
  required_skills: Skill[];
  skill_gaps: SkillGap[];
  recommendations: LearningRecommendation[];
  gap_score: number;
}

export interface SkillGap {
  skill: Skill;
  current_level: SkillLevel;
  required_level: SkillLevel;
  gap_severity: 'low' | 'medium' | 'high';
  learning_resources?: string[];
}

export interface LearningRecommendation {
  type: 'course' | 'certification' | 'experience' | 'bootcamp';
  title: string;
  provider: string;
  duration: string;
  cost?: number;
  skills_covered: string[];
  url?: string;
}

// API Error types
export interface ApiError {
  error: string;
  message: string;
  status_code: number;
  details?: any;
}

// Request configuration
export interface RequestConfig {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: string;
  params?: Record<string, any>;
}

// Lightcast API interface
export interface LightcastAPI {
  root: {
    get: ApiMethod<RootResponse>;
  };
  token: {
    get: ApiMethod<LightcastTokenResponse>;
  };
  jobPostings: {
    get: ApiMethodWithParams<JobPostingsResponse, JobPostingFilters>;
  };
}
