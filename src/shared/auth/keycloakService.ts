import { Permission, Role, UserType, GROUP_PATHS, GroupPath } from './permissions';
import { 
  KEYCLOAK_CONFIG, 
  KEYCLOAK_ENDPOINTS, 
  TOKEN_CONFIG
} from './apiConfig';

// Class definition
class KeycloakService {
  private adminToken: string | null = null;
  private adminTokenExpiry: number = 0;
  private lastTokenRefresh: number = 0;
  private refreshInProgress: boolean = false;
  private refreshPromise: Promise<boolean> | null = null;
  private sessionCheckInterval: NodeJS.Timeout | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.startSessionMonitoring();
    }
  }

  /**
   * Start session monitoring
   */
  private startSessionMonitoring = () => {
    if (typeof window === 'undefined') return;
    
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }
    
    this.sessionCheckInterval = setInterval(() => {
      if (this.isAuthenticated()) {
        this.checkSession().catch(console.error);
      }
    }, 2 * 60 * 1000);
  };

  /**
   * Check session status
   */
  private checkSession = async () => {
    try {
      const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
      if (!token) return;
      
      const expiryStr = localStorage.getItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
      if (!expiryStr) return;
      
      const expiry = parseInt(expiryStr);
      const currentTime = Date.now();
      
      if (currentTime > expiry - 5 * 60 * 1000) {
        await this.refreshToken();
      }
    } catch (error) {
      console.error('Session check error:', error);
    }
  };

  /**
   * Perform login
   */
  login = async (username: string, password: string): Promise<any> => {
    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('client_id', KEYCLOAK_CONFIG.CLIENT_ID);
      formData.append('client_secret', KEYCLOAK_CONFIG.CLIENT_SECRET);
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(KEYCLOAK_ENDPOINTS.TOKEN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
      });

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      this.saveTokens(data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  /**
   * Perform logout
   */
  logout = async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
      if (refreshToken) {
        try {
          const formData = new URLSearchParams();
          formData.append('client_id', KEYCLOAK_CONFIG.CLIENT_ID);
          formData.append('refresh_token', refreshToken);

          await fetch(`${KEYCLOAK_CONFIG.BASE_URL}/protocol/openid-connect/logout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData.toString()
          });
        } catch (error) {
          console.warn('Token revocation failed:', error);
        }
      }

      if (this.sessionCheckInterval) {
        clearInterval(this.sessionCheckInterval);
        this.sessionCheckInterval = null;
      }

      localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
      localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
      localStorage.removeItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
      localStorage.removeItem(TOKEN_CONFIG.USER_PROFILE_KEY);

      const cookies = document.cookie.split(';');
      for (let cookie of cookies) {
        document.cookie = cookie.trim().split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
      }
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  /**
   * Check authentication status
   */
  isAuthenticated = (): boolean => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
    
    if (!token || !expiry) return false;
    
    return Date.now() < parseInt(expiry);
  };

  /**
   * Refresh token
   */
  refreshToken = async (): Promise<boolean> => {
    const refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
    if (!refreshToken) return false;

    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'refresh_token');
      formData.append('client_id', KEYCLOAK_CONFIG.CLIENT_ID);
      formData.append('refresh_token', refreshToken);

      const response = await fetch(KEYCLOAK_ENDPOINTS.TOKEN, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
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

  /**
   * Save tokens to storage
   */
  private saveTokens = (data: any) => {
    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, data.access_token);
    localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, data.refresh_token);
    localStorage.setItem(
      TOKEN_CONFIG.TOKEN_EXPIRY_KEY, 
      (Date.now() + data.expires_in * 1000).toString()
    );
  };

  /**
   * Clean up resources
   */
  destroy = () => {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
      this.sessionCheckInterval = null;
    }
  };
}

// Create and export singleton instance
const keycloakService = new KeycloakService();
export { keycloakService };
export default keycloakService;