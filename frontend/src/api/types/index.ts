// API Types Index - Central export for all type definitions

// Re-export all types from individual files
export * from './common.types';
export * from './api.types';

// Re-export specific types from lightcast to avoid conflicts
export { 
  RootResponse,
  LightcastTokenResponse,
  JobPosting,
  LightcastCompanyInfo,
  LocationInfo,
  SalaryInfo,
  Skill,
  JobPostingsResponse,
  JobPostingFilters,
  EmploymentType,
  ExperienceLevel,
  SalaryPeriod,
  SkillType,
  SkillLevel,
  SkillImportance,
  EducationLevel,
  SkillsResponse,
  SkillDetail,
  Occupation,
  JobOutlook,
  OccupationsResponse,
  LaborMarketData,
  IndustryData,
  OccupationData,
  SkillDemand,
  EducationProgram,
  EducationResponse,
  SkillsGapAnalysis,
  SkillGap,
  LearningRecommendation,
  RequestConfig,
  LightcastAPI
} from './lightcast.types';

// Type utility functions
export const TypeUtils = {
  // Type guards
  isApiResponse: <T>(obj: any): obj is import('./common.types').ApiResponse<T> => {
    return obj && typeof obj === 'object' && typeof obj.success === 'boolean';
  },

  isApiError: (obj: any): obj is import('./common.types').ApiError => {
    return obj && typeof obj === 'object' && typeof obj.error === 'string';
  },

  isUser: (obj: any): obj is import('./common.types').User => {
    return obj && typeof obj === 'object' && typeof obj.id === 'string' && typeof obj.email === 'string';
  },

  isJobPosting: (obj: any): obj is import('./lightcast.types').JobPosting => {
    return obj && typeof obj === 'object' && typeof obj.id === 'string' && typeof obj.title === 'string';
  },

  isCompany: (obj: any): obj is import('./common.types').Company => {
    return obj && typeof obj === 'object' && typeof obj.id === 'string' && typeof obj.name === 'string';
  },

  // Validation helpers
  validateEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  validateUrl: (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  validateDateString: (date: string): boolean => {
    return !isNaN(Date.parse(date));
  },

  // Data transformation helpers
  formatApiResponse: <T>(data: T, success: boolean = true): import('./common.types').ApiResponse<T> => {
    return {
      success,
      data,
      timestamp: new Date().toISOString()
    };
  },

  formatApiError: (error: string, status: number = 500): import('./common.types').ApiError => {
    return {
      error,
      message: error,
      status_code: status,
      timestamp: new Date().toISOString()
    };
  },

  // Pagination helpers
  createPaginationInfo: (page: number, perPage: number, total: number): import('./common.types').PaginationInfo => {
    const totalPages = Math.ceil(total / perPage);
    return {
      page,
      per_page: perPage,
      total,
      total_pages: totalPages,
      has_next: page < totalPages,
      has_previous: page > 1
    };
  },

  // Sorting helpers
  createSortingInfo: (sortBy: string, sortOrder: 'asc' | 'desc'): import('./common.types').SortingInfo => {
    return {
      sort_by: sortBy,
      sort_order: sortOrder
    };
  }
};

// Default values for common types
export const DefaultValues = {
  apiResponse: <T>(data?: T): import('./common.types').ApiResponse<T> => ({
    success: true,
    data,
    timestamp: new Date().toISOString()
  }),

  paginationInfo: (): import('./common.types').PaginationInfo => ({
    page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
    has_next: false,
    has_previous: false
  }),

  sortingInfo: (): import('./common.types').SortingInfo => ({
    sort_by: 'created_at',
    sort_order: 'desc'
  }),

  searchFilters: (): import('./common.types').SearchFilters => ({}),

  jobPostingFilters: (): import('./lightcast.types').JobPostingFilters => ({}),

  userPreferences: (): import('./common.types').UserPreferences => ({
    notifications: {
      email: true,
      push: false,
      sms: false,
      jobMatches: true,
      companyUpdates: false
    },
    privacy: {
      profileVisible: true,
      contactInfoVisible: false,
      skillsVisible: true
    },
    jobAlerts: {
      frequency: 'weekly',
      keywords: [],
      locations: [],
      salaryRange: {
        min: 0,
        max: 1000000,
        currency: 'USD'
      }
    }
  })
};

// Type constants
export const TypeConstants = {
  USER_ROLES: ['admin', 'user', 'recruiter', 'employer', 'student', 'employee'] as const,
  COMPANY_SIZES: ['startup', 'small', 'medium', 'large', 'enterprise'] as const,
  EMPLOYMENT_TYPES: ['full_time', 'part_time', 'contract', 'temporary', 'internship', 'freelance'] as const,
  EXPERIENCE_LEVELS: ['entry_level', 'junior', 'mid_level', 'senior', 'lead', 'executive'] as const,
  SKILL_TYPES: ['technical', 'soft', 'certification', 'language', 'tool', 'framework'] as const,
  SKILL_LEVELS: ['beginner', 'intermediate', 'advanced', 'expert'] as const,
  APPLICATION_STATUSES: ['pending', 'reviewing', 'shortlisted', 'interview_scheduled', 'rejected', 'accepted', 'withdrawn'] as const,
  ALERT_FREQUENCIES: ['immediate', 'daily', 'weekly', 'monthly'] as const,
  DOCUMENT_TYPES: ['resume', 'cover_letter', 'portfolio', 'certification', 'transcript'] as const,
  INTERVIEW_TYPES: ['phone', 'video', 'in_person', 'technical', 'behavioral'] as const,
  EDUCATION_LEVELS: ['certificate', 'associate', 'bachelor', 'master', 'doctorate', 'professional'] as const
};

// Type predicates for runtime type checking
export const TypePredicates = {
  isUserRole: (value: any): value is import('./common.types').UserRole => {
    return TypeConstants.USER_ROLES.includes(value);
  },

  isCompanySize: (value: any): value is import('./common.types').CompanySize => {
    return TypeConstants.COMPANY_SIZES.includes(value);
  },

  isEmploymentType: (value: any): value is import('./lightcast.types').EmploymentType => {
    return TypeConstants.EMPLOYMENT_TYPES.includes(value);
  },

  isExperienceLevel: (value: any): value is import('./lightcast.types').ExperienceLevel => {
    return TypeConstants.EXPERIENCE_LEVELS.includes(value);
  },

  isSkillType: (value: any): value is import('./lightcast.types').SkillType => {
    return TypeConstants.SKILL_TYPES.includes(value);
  },

  isApplicationStatus: (value: any): value is import('./common.types').ApplicationStatus => {
    return TypeConstants.APPLICATION_STATUSES.includes(value);
  }
};

export default {
  TypeUtils,
  DefaultValues,
  TypeConstants,
  TypePredicates
};
