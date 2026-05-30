// Component Constants
export const COMPONENT_NAMES = Object.freeze({
  NAVBAR: 'Navbar',
  SIDEBAR: 'Sidebar',
  JOB_LIST: 'JobList',
  SKILL_CARD: 'SkillCard',
  COMPANY_DROPDOWN: 'CompanySelectionDropdown',
  AUTH_FORM: 'AuthForm',
  NOTIFICATION_MANAGER: 'NotificationManager',
  SKILL_PROFILE_FORM: 'SkillProfileForm',
  JOB_SEARCH_RESULTS: 'JobSearchResults',
  API_TESTER: 'ApiTester',
  AI_ENDPOINTS: 'AiEndpoints',
  LOADING: 'Loading',
  DASHBOARD: 'Dashboard',
  SKILLS: 'Skills',
  JOBS: 'Jobs',
  LOGIN: 'Login',
  AI: 'AI',
  COMPANY_SELECTION: 'CompanySelection',
});

// API Endpoints
export const API_ENDPOINTS = Object.freeze({
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  JOB_POSTINGS: '/job-postings',
  SKILLS: '/skills',
  COMPANIES: '/companies',
  AUTH: Object.freeze({
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VALIDATE: '/auth/validate',
  }),
  LIGHTCAST: Object.freeze({
    SKILLS: '/lightcast/skills',
    JOBS: '/lightcast/jobs',
    COMPANIES: '/lightcast/companies',
  }),
});

// HTTP Methods
export const HTTP_METHODS = Object.freeze({
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
});

// HTTP Status Codes
export const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
});

// Local Storage Keys
export const STORAGE_KEYS = Object.freeze({
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PROFILE: 'user_profile',
  SELECTED_COMPANY: 'selected_company',
  THEME_PREFERENCE: 'theme_preference',
  LANGUAGE_PREFERENCE: 'language_preference',
});

// Redux Action Types
export const ACTION_TYPES = Object.freeze({
  AUTH: Object.freeze({
    LOGIN_REQUEST: 'auth/loginRequest',
    LOGIN_SUCCESS: 'auth/loginSuccess',
    LOGIN_FAILURE: 'auth/loginFailure',
    LOGOUT: 'auth/logout',
    REFRESH_TOKEN: 'auth/refreshToken',
    SET_USER: 'auth/setUser',
    CLEAR_USER: 'auth/clearUser',
  }),
  UI: Object.freeze({
    SET_LOADING: 'ui/setLoading',
    SET_ERROR: 'ui/setError',
    CLEAR_ERROR: 'ui/clearError',
    SET_SELECTED_COMPANY: 'ui/setSelectedCompany',
    SET_THEME: 'ui/setTheme',
    TOGGLE_SIDEBAR: 'ui/toggleSidebar',
    SET_NOTIFICATION: 'ui/setNotification',
    CLEAR_NOTIFICATION: 'ui/clearNotification',
  }),
  JOBS: Object.freeze({
    FETCH_JOBS_REQUEST: 'jobs/fetchJobsRequest',
    FETCH_JOBS_SUCCESS: 'jobs/fetchJobsSuccess',
    FETCH_JOBS_FAILURE: 'jobs/fetchJobsFailure',
    SET_SELECTED_JOB: 'jobs/setSelectedJob',
    CLEAR_JOBS: 'jobs/clearJobs',
  }),
  SKILLS: Object.freeze({
    FETCH_SKILLS_REQUEST: 'skills/fetchSkillsRequest',
    FETCH_SKILLS_SUCCESS: 'skills/fetchSkillsSuccess',
    FETCH_SKILLS_FAILURE: 'skills/fetchSkillsFailure',
    ADD_SKILL: 'skills/addSkill',
    UPDATE_SKILL: 'skills/updateSkill',
    DELETE_SKILL: 'skills/deleteSkill',
  }),
});

// Notification Types
export const NOTIFICATION_TYPES = Object.freeze({
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
});

// Skill Levels
export const SKILL_LEVELS = Object.freeze({
  BEGINNER: 1,
  NOVICE: 2,
  INTERMEDIATE: 3,
  ADVANCED: 4,
  EXPERT: 5,
});

export const SKILL_LEVEL_LABELS = Object.freeze({
  [SKILL_LEVELS.BEGINNER]: 'Beginner',
  [SKILL_LEVELS.NOVICE]: 'Novice',
  [SKILL_LEVELS.INTERMEDIATE]: 'Intermediate',
  [SKILL_LEVELS.ADVANCED]: 'Advanced',
  [SKILL_LEVELS.EXPERT]: 'Expert',
});

// Job Status
export const JOB_STATUS = Object.freeze({
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  DRAFT: 'draft',
  EXPIRED: 'expired',
});

// User Roles
export const USER_ROLES = Object.freeze({
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
});

// Form Validation
export const VALIDATION_RULES = Object.freeze({
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  SKILL_NAME_MAX_LENGTH: 50,
  COMPANY_NAME_MAX_LENGTH: 100,
});

// Error Messages
export const ERROR_MESSAGES = Object.freeze({
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters long`,
  USERNAME_TOO_SHORT: `Username must be at least ${VALIDATION_RULES.USERNAME_MIN_LENGTH} characters long`,
  USERNAME_TOO_LONG: `Username must be no more than ${VALIDATION_RULES.USERNAME_MAX_LENGTH} characters long`,
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  FORBIDDEN: 'Access denied',
  NOT_FOUND: 'The requested resource was not found',
  INTERNAL_SERVER_ERROR: 'An internal server error occurred. Please try again later.',
  INVALID_CREDENTIALS: 'Invalid email or password',
  SESSION_EXPIRED: 'Your session has expired. Please login again.',
});

// Success Messages
export const SUCCESS_MESSAGES = Object.freeze({
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  SKILL_ADDED: 'Skill added successfully',
  SKILL_UPDATED: 'Skill updated successfully',
  SKILL_DELETED: 'Skill deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  DATA_SAVED: 'Data saved successfully',
  EMAIL_SENT: 'Email sent successfully',
});

// Date Formats
export const DATE_FORMATS = Object.freeze({
  FULL: 'MMMM dd, yyyy',
  SHORT: 'MM/dd/yyyy',
  ISO: 'yyyy-MM-dd',
  TIME: 'HH:mm:ss',
  DATETIME: 'MMMM dd, yyyy HH:mm:ss',
});

// Pagination
export const PAGINATION = Object.freeze({
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE: 1,
});

// File Upload
export const FILE_UPLOAD = Object.freeze({
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
});

// Animation Durations (in milliseconds)
export const ANIMATION_DURATIONS = Object.freeze({
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
});

// Z-Index Layers
export const Z_INDEX = Object.freeze({
  DROPDOWN: 1000,
  STICKY: 1020,
  FIXED: 1030,
  MODAL_BACKDROP: 1040,
  MODAL: 1050,
  POPOVER: 1060,
  TOOLTIP: 1070,
  NOTIFICATION: 1080,
});

// Keyboard Keys
export const KEYBOARD_KEYS = Object.freeze({
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: ' ',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  BACKSPACE: 'Backspace',
  DELETE: 'Delete',
});

// Environment Variables
export const ENV_VARIABLES = Object.freeze({
  NODE_ENV: process.env.NODE_ENV,
  REACT_APP_API_URL: process.env.REACT_APP_API_URL,
  REACT_APP_VERSION: process.env.REACT_APP_VERSION,
  REACT_APP_ENVIRONMENT: process.env.REACT_APP_ENVIRONMENT,
});

// Regular Expressions
export const REGEX_PATTERNS = Object.freeze({
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[1-9][\d]{0,15}$/,
  URL: /^https?:\/\/.+/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
  NUMERIC: /^[0-9]+$/,
  ALPHA: /^[a-zA-Z]+$/,
});
