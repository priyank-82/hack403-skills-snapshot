import { createSlice } from '@reduxjs/toolkit';
import { api } from './api';

const getInitialState = () => {
  try {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    return {
      user: userData ? JSON.parse(userData) : null,
      token: token,
      isAuthenticated: !!(token && userData),
      loading: false,
      error: null,
    };
  } catch (error) {
    // If there's an error parsing localStorage, clear it and return default state
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return {
      user: null,
      token: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    };
  }
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      if (action.payload) {
        localStorage.setItem('user', JSON.stringify(action.payload));
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addMatcher(api.endpoints.login.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(api.endpoints.login.matchFulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addMatcher(api.endpoints.login.matchRejected, (state, action) => {
        state.loading = false;
        console.log('Login rejected action:', action);
        // Check if this is a mock response (has user and token)
        if (action.payload && action.payload.user && action.payload.token) {
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.user = action.payload.user;
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
          state.error = null;
        } else {
          state.error = action.error.message || 'Login failed';
        }
      });
    
    // Signup
    builder
      .addMatcher(api.endpoints.signup.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(api.endpoints.signup.matchFulfilled, (state, action) => {
        state.loading = false;
        // Don't auto-login after signup, just clear any errors
        state.error = null;
      })
      .addMatcher(api.endpoints.signup.matchRejected, (state, action) => {
        state.loading = false;
        console.log('Signup rejected action:', action);
        // Don't auto-login, just handle the error
        state.error = action.error.message || 'Signup failed';
      });
    
    // Phoenix Login
    builder
      .addMatcher(api.endpoints.phoenixLogin.matchPending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(api.endpoints.phoenixLogin.matchFulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addMatcher(api.endpoints.phoenixLogin.matchRejected, (state, action) => {
        state.loading = false;
        // Check if this is a mock response (has user and token)
        if (action.payload && action.payload.user && action.payload.token) {
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.user = action.payload.user;
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem('user', JSON.stringify(action.payload.user));
          state.error = null;
        } else {
          state.error = action.error.message || 'Phoenix login failed';
        }
      });
    
    // Get Profile
    builder
      .addMatcher(api.endpoints.getProfile.matchFulfilled, (state, action) => {
        state.user = action.payload;
        localStorage.setItem('user', JSON.stringify(action.payload));
      });
  },
});

export const { logout, clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
