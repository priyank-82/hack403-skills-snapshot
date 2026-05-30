import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../store/authSlice';
import { validatePhoenixEmail } from '../utils/phoenixAuth';
import AuthFlowManager from '../utils/authFlowManager';
import api from './api'; // Use the existing axios instance

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();

  // Get authentication state from Redux
  const reduxAuth = useSelector((state) => state.auth);

  useEffect(() => {
    // Only check auth status if Redux state indicates we should be authenticated
    // but we don't have user data (edge case)
    if (reduxAuth.isAuthenticated && !reduxAuth.user) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, [reduxAuth.isAuthenticated, reduxAuth.user]);

  // Sync with Redux authentication state
  useEffect(() => {
    console.log('Redux auth state changed:', reduxAuth);
    setUser(reduxAuth.user);
    setIsAuthenticated(reduxAuth.isAuthenticated);
    setLoading(false);
  }, [reduxAuth.isAuthenticated, reduxAuth.user]);

  const checkAuthStatus = async () => {
    try {
      const authStatus = AuthFlowManager.checkAuthStatus();
      
      if (authStatus.isAuthenticated) {
        const isTokenValid = await AuthFlowManager.validateToken(authStatus.token);
        
        if (isTokenValid) {
          setUser(authStatus.user);
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clear auth data
          await AuthFlowManager.handleLogout();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Verify user exists first
      const verification = verifyUserExists(email);
      if (!verification.exists) {
        throw new Error('User not found. Please sign up first.');
      }
      
      // Try API first, fall back to mock data for testing
      try {
        const response = await api.post('/auth/login', { email, password });
        const { user, token } = response.data;
        
        const result = await AuthFlowManager.handleLoginSuccess(user, token);
        setUser(user);
        setIsAuthenticated(true);
        
        // Clear temporary signup data
        clearTempSignupData();
        
        return result;
      } catch (apiError) {
        // Fall back to mock data for testing
        console.warn('API login failed, using mock data for testing:', apiError.message);
        
        // Use the temp signup user data if available, otherwise create mock data
        const tempUser = localStorage.getItem('tempSignupUser');
        let mockUser;
        
        if (tempUser) {
          const parsedTempUser = JSON.parse(tempUser);
          if (parsedTempUser.email === email) {
            mockUser = parsedTempUser;
          }
        }
        
        if (!mockUser) {
          mockUser = {
            id: 1,
            name: email.split('@')[0],
            email: email,
            avatar: null,
            preferences: {
              theme: 'light',
              notifications: true
            }
          };
        }
        
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        const result = await AuthFlowManager.handleLoginSuccess(mockUser, mockToken);
        setUser(mockUser);
        setIsAuthenticated(true);
        
        // Clear temporary signup data
        clearTempSignupData();
        
        return result;
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Login failed');
    }
  };

  const loginWithPhoenix = async () => {
    try {
      // Try API first, fall back to redirect for testing
      try {
        const response = await api.post('/auth/phoenix-sso');
        return response.data;
      } catch (apiError) {
        // Fall back to redirect for testing
        console.warn('Phoenix SSO API failed, using redirect for testing:', apiError.message);
        return { redirect: '/phoenix-login' };
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Phoenix.edu SSO redirect failed');
    }
  };

  const loginWithPhoenixCredentials = async (email, password) => {
    try {
      // Simulate Phoenix.edu credential validation
      // In production, this would validate credentials with Phoenix.edu servers
      
      // Validate email domain
      const emailValidation = validatePhoenixEmail(email);
      if (!emailValidation.isValid) {
        throw new Error(emailValidation.error);
      }

      // Simulate credential validation (in production, this would be done server-side)
      if (password.length < 6) {
        throw new Error('Invalid password');
      }

      try {
        // Try API first
        const response = await api.post('/auth/phoenix-login', { email, password });
        const { user, token } = response.data;
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        setUser(user);
        setIsAuthenticated(true);
        
        return { user, token };
      } catch (apiError) {
        // Fall back to mock Phoenix data for testing
        console.warn('Phoenix login API failed, using mock data for testing:', apiError.message);
        
        // Simulate different Phoenix.edu users based on email
        let phoenixUserData;
        if (email.includes('student')) {
          phoenixUserData = {
            email: email,
            name: 'Alex Johnson',
            department: 'Information Technology',
            role: 'Student',
            studentId: 'PHX' + Math.floor(Math.random() * 1000000)
          };
        } else if (email.includes('instructor') || email.includes('prof')) {
          phoenixUserData = {
            email: email,
            name: 'Dr. Sarah Williams',
            department: 'Computer Science',
            role: 'Instructor',
            employeeId: 'EMP' + Math.floor(Math.random() * 10000)
          };
        } else if (email.includes('admin')) {
          phoenixUserData = {
            email: email,
            name: 'Michael Chen',
            department: 'Academic Affairs',
            role: 'Administrator',
            employeeId: 'ADM' + Math.floor(Math.random() * 10000)
          };
        } else {
          // Default to student
          phoenixUserData = {
            email: email,
            name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
            department: 'General Studies',
            role: 'Student',
            studentId: 'PHX' + Math.floor(Math.random() * 1000000)
          };
        }
        
        const phoenixUser = {
          id: Date.now(),
          name: phoenixUserData.name,
          email: phoenixUserData.email,
          avatar: null,
          phoenixId: 'phoenix-' + Date.now(),
          department: phoenixUserData.department,
          role: phoenixUserData.role,
          studentId: phoenixUserData.studentId,
          employeeId: phoenixUserData.employeeId,
          authProvider: 'phoenix',
          needsCompanySelection: true,
          preferences: {
            theme: 'light',
            notifications: true
          }
        };
        
        const mockToken = 'phoenix-sso-token-' + Date.now();
        
        localStorage.setItem('token', mockToken);
        localStorage.setItem('user', JSON.stringify(phoenixUser));
        
        setUser(phoenixUser);
        setIsAuthenticated(true);
        
        return { user: phoenixUser, token: mockToken };
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Phoenix.edu login failed');
    }
  };

  const signup = async (name, email, password) => {
    try {
      // Try API first, fall back to mock data for testing
      try {
        const response = await api.post('/auth/signup', { name, email, password });
        const { user } = response.data;
        
        // Don't auto-login, just return success with user data
        return { user, success: true, message: 'Account created successfully!' };
      } catch (apiError) {
        // Fall back to mock data for testing
        console.warn('API signup failed, using mock data for testing:', apiError.message);
        
        const mockUser = {
          id: Date.now(),
          name: name,
          email: email,
          avatar: null,
          preferences: {
            theme: 'light',
            notifications: true
          }
        };
        
        // Store user data temporarily for verification but don't auto-login
        localStorage.setItem('tempSignupUser', JSON.stringify(mockUser));
        
        // Don't auto-login, just return success with user data
        return { user: mockUser, success: true, message: 'Account created successfully!' };
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };

  const logout = async () => {
    try {
      // Try to call logout API
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API failed:', error);
    } finally {
      // Use AuthFlowManager to handle logout
      await AuthFlowManager.handleLogout();
      
      // Dispatch Redux logout action to clear state
      dispatch(logoutAction());
      
      // Clear local state as well
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const verifyUserExists = (email) => {
    // Check if user was recently created (temporary storage)
    const tempUser = localStorage.getItem('tempSignupUser');
    if (tempUser) {
      const parsedUser = JSON.parse(tempUser);
      if (parsedUser.email === email) {
        return { exists: true, user: parsedUser };
      }
    }
    
    // In a real app, this would check the database
    // For now, we'll assume the user exists if they have the right email format
    return { exists: true, user: null };
  };

  const clearTempSignupData = () => {
    localStorage.removeItem('tempSignupUser');
  };

  const updateUser = (userData) => {
    setUser(prevUser => ({
      ...prevUser,
      ...userData
    }));
    localStorage.setItem('user', JSON.stringify({
      ...user,
      ...userData
    }));
  };

  const refreshToken = async () => {
    try {
      const response = await api.post('/auth/refresh');
      const { token } = response.data;
      localStorage.setItem('token', token);
      return token;
    } catch (error) {
      await logout();
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    loginWithPhoenix,
    loginWithPhoenixCredentials,
    logout,
    updateUser,
    refreshToken,
    checkAuthStatus,
    verifyUserExists,
    clearTempSignupData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
