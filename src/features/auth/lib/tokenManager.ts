import { jwtDecode } from 'jwt-decode';
import { AuthError, Permission, Role } from '../model/types';

// Default configuration
const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: 'access_token',
  REFRESH_TOKEN_KEY: 'refresh_token',
  TOKEN_EXPIRY_KEY: 'token_expiry',
  USER_PROFILE_KEY: 'user_profile',
};

const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds

interface JWTPayload {
  sub: string;
  email: string;
  roles?: string[];
  authorities?: string[];
  scope?: string;
  permissions?: string[];
  exp: number;
}

/**
 * TokenManager class for centralized token management
 */
class TokenManager {
  private token: string | null = null;
  private refreshToken: string | null = null;
  private tokenExpiry: number | null = null;

  constructor() {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
      this.refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
      const expiry = localStorage.getItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
      this.tokenExpiry = expiry ? parseInt(expiry) : null;
    }
  }

  hasToken(): boolean {
    return !!(this.token && this.tokenExpiry && Date.now() < this.tokenExpiry);
  }

  getToken(): string | null {
    return this.hasToken() ? this.token : null;
  }

  setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, token);
    }
  }

  getRefreshToken(): string | null {
    return this.refreshToken;
  }

  setRefreshToken(token: string): void {
    this.refreshToken = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, token);
    }
  }

  getTokenExpiry(): number | null {
    return this.tokenExpiry;
  }

  setTokenExpiry(expiry: number): void {
    this.tokenExpiry = expiry;
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY, expiry.toString());
    }
  }

  removeToken(): void {
    this.token = null;
    this.refreshToken = null;
    this.tokenExpiry = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
      localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
      localStorage.removeItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
    }
  }

  createAuthorizationHeader(): string | null {
    const token = this.getToken();
    return token ? `Bearer ${token}` : null;
  }
}

export const tokenManager = new TokenManager();
export default tokenManager;