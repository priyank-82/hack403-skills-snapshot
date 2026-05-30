import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';

// Configure your Cognito User Pool
const poolData = {
  UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID, // Your User Pool ID
  ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID, // Your Client ID
};

const userPool = new CognitoUserPool(poolData);

class CognitoAuthService {
  // Get current user
  getCurrentUser() {
    return userPool.getCurrentUser();
  }

  // Get current session
  getCurrentSession() {
    return new Promise((resolve, reject) => {
      const user = this.getCurrentUser();
      if (user) {
        user.getSession((err, session) => {
          if (err) {
            reject(err);
          } else {
            resolve(session);
          }
        });
      } else {
        reject(new Error('No current user'));
      }
    });
  }

  // Get access token
  async getAccessToken() {
    try {
      const session = await this.getCurrentSession();
      return session.getAccessToken().getJwtToken();
    } catch (error) {
      throw new Error('Failed to get access token');
    }
  }

  // Get ID token (contains user info)
  async getIdToken() {
    try {
      const session = await this.getCurrentSession();
      return session.getIdToken().getJwtToken();
    } catch (error) {
      throw new Error('Failed to get ID token');
    }
  }

  // Login with username and password
  login(username, password) {
    return new Promise((resolve, reject) => {
      const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      });

      const cognitoUser = new CognitoUser({
        Username: username,
        Pool: userPool,
      });

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          const accessToken = result.getAccessToken().getJwtToken();
          const idToken = result.getIdToken().getJwtToken();
          const refreshToken = result.getRefreshToken().getToken();
          
          resolve({
            accessToken,
            idToken,
            refreshToken,
            user: result.getIdToken().payload
          });
        },
        onFailure: (err) => {
          reject(err);
        },
      });
    });
  }

  // Logout
  logout() {
    const user = this.getCurrentUser();
    if (user) {
      user.signOut();
    }
  }

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const session = await this.getCurrentSession();
      return session.isValid();
    } catch (error) {
      return false;
    }
  }

  // Refresh tokens
  refreshSession() {
    return new Promise((resolve, reject) => {
      const user = this.getCurrentUser();
      if (user) {
        user.getSession((err, session) => {
          if (err) {
            reject(err);
          } else {
            resolve(session);
          }
        });
      } else {
        reject(new Error('No current user'));
      }
    });
  }
}

export default new CognitoAuthService();
