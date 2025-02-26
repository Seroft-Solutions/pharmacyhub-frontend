import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { AUTH_ENDPOINTS, TOKEN_CONFIG, USER_TYPES } from '@/shared/auth/apiConfig';

// Interface for token data
interface TokenData {
  access: string | null;
  refresh: string | null;
  expires: number;
}

// Interface for login credentials
interface LoginCredentials {
  emailAddress: string;
  password: string;
}

// Interface for registration data
interface RegistrationData {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  contactNumber?: string;
  userType?: string;
}

// Interface for logged in user response
interface LoggedInUserResponse {
  jwtToken: string;
  openToConnect: boolean;
  registered: boolean;
  userType: string;
}

// Interface for decoded JWT
interface DecodedToken {
  sub: string;
  exp: number;
  iat: number;
  roles?: string[];
  authorities?: string[];
  scope?: string;
}

// Interface for user profile
interface UserProfile {
  id: number;
  emailAddress: string;
  firstName: string;
  lastName: string;
  contactNumber?: string;
  openToConnect: boolean;
  registered: boolean;
  userType?: string;
}

// Interface for roles and permissions
interface RbacData {
  roles: string[];
  permissions: string[];
}

class AuthService {
  private static instance: AuthService;
  private apiBaseUrl: string;

  private constructor() {
    this.apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Authenticate user with email and password
   * @param credentials User credentials
   * @returns User token data
   */
  public async login(credentials: LoginCredentials): Promise<TokenData> {
    try {
      // Direct backend call instead of using proxy route
      const response = await axios.post<LoggedInUserResponse>(
        `${this.apiBaseUrl}${AUTH_ENDPOINTS.LOGIN}`,
        credentials
      );

      const { jwtToken } = response.data;
      
      // Save token to localStorage
      const tokenData = this.saveToken(jwtToken);
      
      // Save user data
      this.saveUserData({
        ...response.data,
        emailAddress: credentials.emailAddress,
        // Extract roles and permissions from JWT
        ...this.extractRbacFromToken(jwtToken)
      });
      
      return tokenData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param userData User registration data
   * @returns Registration response
   */
  public async register(userData: RegistrationData): Promise<any> {
    try {
      // Direct backend call instead of using proxy route
      const response = await axios.post(
        `${this.apiBaseUrl}${AUTH_ENDPOINTS.REGISTER}`,
        userData
      );
      
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Log out current user
   */
  public async logout(): Promise<void> {
    // Clear token on client side
    this.clearToken();
  }

  /**
   * Check if user is authenticated
   * @returns Authentication status
   */
  public isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token.access && !this.isTokenExpired(token.access);
  }

  /**
   * Get current user profile
   * @returns User profile
   */
  public async getProfile(): Promise<UserProfile> {
    try {
      const token = this.getToken();
      
      if (!token.access) {
        throw new Error('No access token available');
      }
      
      // Direct backend call to get user profile
      const response = await axios.get<UserProfile>(
        `${this.apiBaseUrl}${AUTH_ENDPOINTS.USER_PROFILE}`,
        {
          headers: this.getAuthHeaders()
        }
      );
      
      // Merge with the role information from token and save
      const userData = this.getUserData() || {};
      const updatedUserData = {
        ...userData,
        ...response.data
      };
      
      this.saveUserData(updatedUserData);
      
      return updatedUserData;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Extract roles and permissions from token
   * @param token JWT token
   * @returns Roles and permissions
   */
  private extractRbacFromToken(token: string): RbacData {
    try {
      const decoded = this.parseToken(token);
      const rbacData: RbacData = {
        roles: [],
        permissions: []
      };
      
      // Extract roles from authorities or roles claim
      if (decoded.authorities) {
        // Spring Security typically adds authorities as ROLE_XXX
        rbacData.roles = decoded.authorities
          .filter(auth => auth.startsWith('ROLE_'))
          .map(role => role.replace('ROLE_', ''));
        
        // Permissions are non-ROLE_ authorities
        rbacData.permissions = decoded.authorities
          .filter(auth => !auth.startsWith('ROLE_'));
      } else if (decoded.roles) {
        rbacData.roles = decoded.roles;
      }
      
      // Sometimes permissions are in scope as space-separated strings
      if (decoded.scope && typeof decoded.scope === 'string') {
        rbacData.permissions = [
          ...rbacData.permissions,
          ...decoded.scope.split(' ')
        ];
      }
      
      // Handle case where userType comes from login response but no roles in token
      const userData = this.getUserData();
      if (rbacData.roles.length === 0 && userData?.userType) {
        rbacData.roles = [userData.userType];
      }
      
      return rbacData;
    } catch (error) {
      console.error('Failed to extract RBAC data from token:', error);
      return { roles: [], permissions: [] };
    }
  }

  /**
   * Map userType to appropriate role if needed
   */
  private mapUserTypeToRole(userType: string): string {
    // Handle any mapping needed between userType and role names
    switch (userType) {
      case USER_TYPES.PHARMACIST:
        return 'PHARMACIST';
      case USER_TYPES.PHARMACY_MANAGER:
        return 'PHARMACY_MANAGER';
      case USER_TYPES.PROPRIETOR:
        return 'PROPRIETOR';
      case USER_TYPES.SALESMAN:
        return 'SALESMAN';
      case USER_TYPES.ADMIN:
        return 'ADMIN';
      default:
        return 'USER';
    }
  }

  /**
   * Check if token is expired
   * @param token Access token
   * @returns Is token expired
   */
  private isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<{ exp: number }>(token);
      const currentTime = Date.now() / 1000;
      
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  /**
   * Get stored token data
   * @returns Token data
   */
  public getToken(): TokenData {
    if (typeof window === 'undefined') {
      return { access: null, refresh: null, expires: 0 };
    }
    
    const tokenData = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    
    if (!tokenData) {
      return { access: null, refresh: null, expires: 0 };
    }
    
    try {
      return JSON.parse(tokenData) as TokenData;
    } catch {
      return { access: null, refresh: null, expires: 0 };
    }
  }

  /**
   * Parse JWT token
   * @param token Access token
   * @returns Decoded token data
   */
  public parseToken(token: string): DecodedToken {
    try {
      return jwtDecode<DecodedToken>(token);
    } catch (error) {
      console.error('Token parsing error:', error);
      throw new Error('Invalid token format');
    }
  }

  /**
   * Save token to storage
   * @param token Access token
   * @returns Token data
   */
  private saveToken(token: string): TokenData {
    try {
      const decoded = this.parseToken(token);
      
      const tokenData: TokenData = {
        access: token,
        refresh: null, // Your backend doesn't use refresh tokens based on the code
        expires: decoded.exp * 1000
      };
      
      if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, JSON.stringify(tokenData));
      }
      
      return tokenData;
    } catch (error) {
      console.error('Save token error:', error);
      throw error;
    }
  }

  /**
   * Save user data
   * @param userData User data to save
   */
  private saveUserData(userData: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_CONFIG.USER_DATA_KEY, JSON.stringify(userData));
    }
  }

  /**
   * Clear token and user data from storage
   */
  private clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
      localStorage.removeItem(TOKEN_CONFIG.USER_DATA_KEY);
    }
  }

  /**
   * Get auth headers for API requests
   * @returns Authorization headers
   */
  public getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    
    if (!token.access) {
      return {};
    }
    
    return {
      Authorization: `Bearer ${token.access}`
    };
  }

  /**
   * Get user data from localStorage
   */
  public getUserData(): any {
    if (typeof window === 'undefined') {
      return null;
    }
    
    const userData = localStorage.getItem(TOKEN_CONFIG.USER_DATA_KEY);
    
    if (!userData) {
      return null;
    }
    
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  }
}

export const authService = AuthService.getInstance();