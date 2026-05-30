// Utility for testing authentication flow
export const testAuthFlow = () => {
  console.log('Testing authentication flow...');
  
  // Check if user is stored in localStorage
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('Token:', token);
  console.log('User:', user);
  
  if (token && user) {
    console.log('User is authenticated');
    try {
      const parsedUser = JSON.parse(user);
      console.log('Parsed user:', parsedUser);
      return { isAuthenticated: true, user: parsedUser, token };
    } catch (error) {
      console.error('Error parsing user data:', error);
      return { isAuthenticated: false, user: null, token: null };
    }
  } else {
    console.log('User is not authenticated');
    return { isAuthenticated: false, user: null, token: null };
  }
};

export const clearAuthData = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('Auth data cleared');
};

export const simulateSignup = async (name, email, password) => {
  console.log('Simulating signup for:', { name, email });
  
  const mockUser = {
    id: Date.now(),
    name: name,
    email: email,
    avatar: null,
    createdAt: new Date().toISOString(),
    preferences: {
      theme: 'light',
      notifications: true
    }
  };
  
  const mockToken = 'mock-jwt-token-' + Date.now();
  
  localStorage.setItem('token', mockToken);
  localStorage.setItem('user', JSON.stringify(mockUser));
  
  console.log('Signup successful:', { user: mockUser, token: mockToken });
  return { user: mockUser, token: mockToken, success: true };
};

export const simulateLogin = async (email, password) => {
  console.log('Simulating login for:', email);
  
  const mockUser = {
    id: 1,
    name: email.split('@')[0],
    email: email,
    avatar: null,
    lastLogin: new Date().toISOString(),
    preferences: {
      theme: 'light',
      notifications: true
    }
  };
  
  const mockToken = 'mock-jwt-token-' + Date.now();
  
  localStorage.setItem('token', mockToken);
  localStorage.setItem('user', JSON.stringify(mockUser));
  
  console.log('Login successful:', { user: mockUser, token: mockToken });
  return { user: mockUser, token: mockToken, success: true };
};
