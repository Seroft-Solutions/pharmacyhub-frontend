import { TOKEN_CONFIG, AUTH_ENDPOINTS, AUTH_ROUTES, API_CONFIG } from './apiConfig';
import { formatAuthError, debugJwtToken } from './utils';
import { UserProfile, RegistrationData } from './types';
import { Permission, Role } from './permissions';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

class AuthService {
  private userProfile: UserProfile | null = null;
  private sessionCheckInterval: NodeJS.Timeout | null = null;
  private lastCheck = 0;
  private readonly CHECK_INTERVAL = 60000; // 1 minute

  constructor() {
    if (typeof window !== 'undefined') {
      this.startSessionMonitoring();
    }
  }

  private startSessionMonitoring = () => {
    if (typeof window === 'undefined') return;
    
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }
    
    this.sessionCheckInterval = setInterval(this.checkSession, 5 * 60 * 1000);
  };

  private checkSession = async () => {
    const now = Date.now();
    
    if (now - this.lastCheck < this.CHECK_INTERVAL) return;
    this.lastCheck = now;

    if (!this.isAuthenticated()) return;
    
    const expiry = parseInt(localStorage.getItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY) || '0');
    if (now > expiry - 5 * 60 * 1000) {
      await this.refreshToken();
    }
  };

  login = async (username: string, password: string): Promise<UserProfile> => {
    try {
      console.log('Sending login request to:', `${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.LOGIN}`);
      console.log('With payload:', { emailAddress: username });
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ emailAddress: username, password })
      });

      console.log('Login response status:', response.status);
      console.log('Login response headers:', Object.fromEntries([...response.headers.entries()]));
      
      if (!response.ok) {
        console.error('Login failed with status:', response.status);
        const error = await response.json().catch(e => {
          console.error('Error parsing login error response:', e);
          return { error: 'Unknown login error' };
        });
        console.error('Login error details:', error);
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      console.log('Login successful, response data keys:', Object.keys(data));
      this.saveTokens(data);
      
      // Debug token for troubleshooting
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
      const tokenDebug = debugJwtToken(token);
      console.log('Token debug after login:', tokenDebug);
      
      const userProfile = await this.getUserProfile();
      this.userProfile = userProfile;
      return userProfile;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(formatAuthError(error));
    }
  };

  register = async (data: RegistrationData): Promise<void> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(formatAuthError(error));
    }
  };

  getUserProfile = async (): Promise<UserProfile> => {
    try {
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
      if (!token) {
        throw new Error('No access token available');
      }
      
      // Debug token before making profile request
      const tokenDebug = debugJwtToken(token);
      console.log('Token debug before profile request:', tokenDebug);
      
      console.log('Fetching profile from:', `${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.USER_PROFILE}`);
      
      // Log the exact URL and headers we're using
      console.log('Profile request URL:', `${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.USER_PROFILE}`);
      console.log('Authorization header:', `Bearer ${token.substring(0, 20)}...`);
      
      // Try with standard headers
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };
      
      console.log('Using headers:', headers);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.USER_PROFILE}`, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        console.error('Profile request failed with status:', response.status, response.statusText);
        
        // Try to get more detailed error information
        let errorMessage = 'Failed to fetch user profile';
        try {
          const errorData = await response.json();
          console.error('Error details:', errorData);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
          // Try to get error text if JSON parsing fails
          try {
            const errorText = await response.text();
            if (errorText) {
              console.error('Error response text:', errorText);
              errorMessage = errorText;
            }
          } catch (textError) {
            console.error('Could not get error text either:', textError);
          }
        }
        
        throw new Error(`${errorMessage} (${response.status})`);
      }

      const profile = await response.json();
      this.userProfile = profile;
      return profile;
    } catch (error) {
      console.error('Get user profile error:', error);
      throw error;
    }
  };

  hasPermission = async (permission: Permission): Promise<boolean> => {
    try {
      if (!this.userProfile) {
        await this.getUserProfile();
      }
      return this.userProfile?.permissions.includes(permission) || false;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  };

  hasRole = async (role: Role): Promise<boolean> => {
    try {
      if (!this.userProfile) {
        await this.getUserProfile();
      }
      return this.userProfile?.roles.includes(role) || false;
    } catch (error) {
      console.error('Role check error:', error);
      return false;
    }
  };

  logout = async () => {
    try {
      // Call backend logout endpoint if it exists
      try {
        await fetch(`${API_CONFIG.BASE_URL}${AUTH_ENDPOINTS.LOGOUT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY)}`
          }
        });
      } catch (error) {
        console.warn('Logout endpoint error:', error);
      }

      if (this.sessionCheckInterval) {
        clearInterval(this.sessionCheckInterval);
        this.sessionCheckInterval = null;
      }

      this.clearStorage();
      window.location.href = AUTH_ROUTES.LOGIN;
    } catch (error) {
      console.error('Logout error:', error);
      this.clearStorage();
      window.location.href = AUTH_ROUTES.LOGIN;
    }
  };

  isAuthenticated = () => {
    const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
    
    if (!token || !expiry) return false;
    return Date.now() < parseInt(expiry);
  };

  refreshToken = async () => {
    const refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
    if (!refreshToken) return false;

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/token/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken })
      });

      if (!response.ok) throw new Error('Token refresh failed');

      const data = await response.json();
      this.saveTokens(data);
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  };

  private saveTokens = (data: any) => {
    // Handle different API response formats
    if (data.jwtToken) {
      // Direct login response format
      // Check if the token is inside a jwtToken property or is directly the response
      const token = typeof data === 'string' ? data : data.jwtToken;
      
      console.log('Login response data structure:', JSON.stringify(data, null, 2));
      console.log('Token value type:', typeof token);
      
      if (!token) {
        console.error('No token found in response data:', data);
        throw new Error('No token found in response');
      }
      
      localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, token);
      // No refresh token in this format
      localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, '');
      // Default to 8 hours expiry if not provided
      const expiryTime = Date.now() + (8 * 60 * 60 * 1000);
      localStorage.setItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY, expiryTime.toString());
      console.log('Saved token from login response', token.substring(0, 20) + '...');
    } else if (data.access_token) {
      // Token refresh response format
      localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, data.access_token);
      localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, data.refresh_token || '');
      localStorage.setItem(
        TOKEN_CONFIG.TOKEN_EXPIRY_KEY, 
        (Date.now() + (data.expires_in * 1000)).toString()
      );
    } else {
      console.error('Unexpected token response format', data);
      throw new Error('Unexpected token format received');
    }
  };

  private clearStorage = () => {
    localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
    localStorage.removeItem(TOKEN_CONFIG.USER_PROFILE_KEY);
    document.cookie.split(';').forEach(cookie => 
      document.cookie = cookie.split('=')[0] + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/');
  };

  resetPassword = async (token: string, newPassword: string): Promise<void> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          newPassword
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(formatAuthError(error));
      }
    } catch (error) {
      console.error('Password reset error:', error);
      throw new Error(formatAuthError(error));
    }
  };

  destroy = () => {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  };
}

const authService = new AuthService();
export { authService };
export default authService;
