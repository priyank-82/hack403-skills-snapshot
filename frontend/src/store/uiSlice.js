import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  selectedCompany: '', // Ensure this is empty by default
  theme: localStorage.getItem('theme') || 'light',
  notifications: [],
  loading: {
    global: false,
    jobs: false,
    skills: false,
    dashboard: false,
  },
  filters: {
    jobs: {
      search: '',
      location: '',
      jobType: '',
      experienceLevel: '',
      salary: '',
    },
    skills: {
      category: '',
      level: '',
    },
  },
  pagination: {
    jobs: {
      page: 1,
      limit: 10,
      total: 0,
    },
    skills: {
      page: 1,
      limit: 20,
      total: 0,
    },
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    setSelectedCompany: (state, action) => {
      state.selectedCompany = action.payload;
      if (action.payload) {
        localStorage.setItem('selectedCompany', action.payload);
      } else {
        localStorage.removeItem('selectedCompany');
      }
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
        timestamp: new Date().toISOString(),
      });
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setGlobalLoading: (state, action) => {
      state.loading.global = action.payload;
    },
    setJobsLoading: (state, action) => {
      state.loading.jobs = action.payload;
    },
    setSkillsLoading: (state, action) => {
      state.loading.skills = action.payload;
    },
    setDashboardLoading: (state, action) => {
      state.loading.dashboard = action.payload;
    },
    setJobFilters: (state, action) => {
      state.filters.jobs = { ...state.filters.jobs, ...action.payload };
    },
    setSkillFilters: (state, action) => {
      state.filters.skills = { ...state.filters.skills, ...action.payload };
    },
    clearJobFilters: (state) => {
      state.filters.jobs = initialState.filters.jobs;
    },
    clearSkillFilters: (state) => {
      state.filters.skills = initialState.filters.skills;
    },
    setJobsPagination: (state, action) => {
      state.pagination.jobs = { ...state.pagination.jobs, ...action.payload };
    },
    setSkillsPagination: (state, action) => {
      state.pagination.skills = { ...state.pagination.skills, ...action.payload };
    },
    resetPagination: (state, action) => {
      const { type } = action.payload;
      if (type === 'jobs') {
        state.pagination.jobs = initialState.pagination.jobs;
      } else if (type === 'skills') {
        state.pagination.skills = initialState.pagination.skills;
      }
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setSelectedCompany,
  setTheme,
  addNotification,
  removeNotification,
  clearNotifications,
  setGlobalLoading,
  setJobsLoading,
  setSkillsLoading,
  setDashboardLoading,
  setJobFilters,
  setSkillFilters,
  clearJobFilters,
  clearSkillFilters,
  setJobsPagination,
  setSkillsPagination,
  resetPagination,
} = uiSlice.actions;

export default uiSlice.reducer;
