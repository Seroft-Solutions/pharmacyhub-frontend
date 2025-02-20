import { KEYCLOAK_CONFIG, TOKEN_CONFIG, KEYCLOAK_ENDPOINTS } from './apiConfig';
import { formatAuthError } from './utils';

interface KeycloakTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

class KeycloakService {
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

  login = async (username: string, password: string) => {
    try {
      const response = await fetch('/api/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Login failed');
      }

      const data = await response.json();
      this.saveTokens(data);
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  logout = async () => {
    try {
      const refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
      
      if (refreshToken) {
        const logoutUrl = `${KEYCLOAK_CONFIG.BASE_URL}/realms/${KEYCLOAK_CONFIG.REALM}/protocol/openid-connect/logout`;
        await fetch(logoutUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            'client_id': KEYCLOAK_CONFIG.CLIENT_ID,
            'refresh_token': refreshToken
          })
        });
      }

      if (this.sessionCheckInterval) {
        clearInterval(this.sessionCheckInterval);
        this.sessionCheckInterval = null;
      }

      this.clearStorage();
      const finalRedirectUrl = encodeURIComponent(window.location.origin + '/login');
      window.location.href = `${KEYCLOAK_CONFIG.BASE_URL}/realms/${KEYCLOAK_CONFIG.REALM}/protocol/openid-connect/logout?client_id=${KEYCLOAK_CONFIG.CLIENT_ID}&post_logout_redirect_uri=${finalRedirectUrl}`;
    } catch (error) {
      console.error('Logout error:', error);
      this.clearStorage();
      window.location.href = '/login';
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
      const response = await fetch('/api/auth/token/refresh', {
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

  private saveTokens = (data: KeycloakTokenResponse) => {
    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, data.access_token);
    localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, data.refresh_token);
    localStorage.setItem(
      TOKEN_CONFIG.TOKEN_EXPIRY_KEY, 
      (Date.now() + (data.expires_in * 1000)).toString()
    );
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
      const response = await fetch(`${KEYCLOAK_ENDPOINTS.TOKEN}/reset-credentials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: KEYCLOAK_CONFIG.CLIENT_ID,
          token,
          new_password: newPassword
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

const keycloakService = new KeycloakService();
export { keycloakService };
export default keycloakService;