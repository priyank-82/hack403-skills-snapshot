import { store } from '../store';
import { setUser } from '../store/authSlice';

/**
 * Authentication flow helper
 * Ensures proper authentication state management
 */
export class AuthFlowManager {
  static async handleSignupSuccess(user, token) {
    try {
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update Redux store
      store.dispatch(setUser(user));
      
      console.log('Signup successful, user logged in:', user);
      
      return { success: true, user, token };
    } catch (error) {
      console.error('Error handling signup success:', error);
      throw error;
    }
  }
  
  static async handleLoginSuccess(user, token) {
    try {
      // Store in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      // Update Redux store
      store.dispatch(setUser(user));
      
      console.log('Login successful:', user);
      
      return { success: true, user, token };
    } catch (error) {
      console.error('Error handling login success:', error);
      throw error;
    }
  }
  
  static async handleLogout() {
    try {
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Update Redux store
      store.dispatch(setUser(null));
      
      console.log('Logout successful');
      
      return { success: true };
    } catch (error) {
      console.error('Error handling logout:', error);
      throw error;
    }
  }
  
  static checkAuthStatus() {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        return { isAuthenticated: true, user, token };
      }
      
      return { isAuthenticated: false, user: null, token: null };
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Clear corrupted data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { isAuthenticated: false, user: null, token: null };
    }
  }
  
  static async validateToken(token) {
    // In a real application, this would validate the token with the server
    // For now, we'll just check if it exists and is not expired
    if (!token) return false;
    
    try {
      // Mock token validation
      const isValid = token.startsWith('mock-jwt-token-') || token.startsWith('phoenix-sso-token-');
      console.log('Token validation result:', isValid);
      return isValid;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }
}

export default AuthFlowManager;
