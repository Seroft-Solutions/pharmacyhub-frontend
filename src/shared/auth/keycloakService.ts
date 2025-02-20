/**
 * Keycloak Service
 * 
 * This service handles all interactions with the Keycloak server,
 * including authentication, registration, and token management.
 */

import { Permission, Role, UserType, GROUP_PATHS, GroupPath } from './permissions';
import { 
  KEYCLOAK_CONFIG, 
  KEYCLOAK_ENDPOINTS, 
  TOKEN_CONFIG
} from './apiConfig';

// Types
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
  token_type: string;
  id_token?: string;
  session_state?: string;
  scope?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: Role[];
  permissions: Permission[];
  groups: string[];
  userType: UserType;
  attributes?: Record<string, unknown>;
}

export interface RegistrationData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  userType: UserType;
  phoneNumber?: string;
  additionalInfo?: Record<string, unknown>;
}

interface KeycloakGroup {
  id: string;
  path: string;
  subGroups?: KeycloakGroup[];
}

/**
 * Keycloak Service Class
 */
class KeycloakService {
  private adminToken: string | null = null;
  private adminTokenExpiry: number = 0;
  
  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<UserProfile> {
    try {
      console.log('Attempting login with username:', username);
      
      let useProxyApi = true;
      // Always use the proxy for consistent behavior
      let loginUrl = '/api/auth/login';

      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('client_id', KEYCLOAK_CONFIG.CLIENT_ID);
      formData.append('client_secret', KEYCLOAK_CONFIG.CLIENT_SECRET);
      formData.append('username', username);
      formData.append('password', password);
      
      
      let attempts = 0;
      const maxAttempts = 2;
      let response;
      
      while (attempts < maxAttempts) {
        try {
          response = await Promise.race([
            fetch(loginUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json'
              },
              credentials: useProxyApi ? 'include' : 'same-origin',
              body: formData.toString(),
            }),
            new Promise<Response>((_, reject) => 
              setTimeout(() => reject(new Error('Login request timed out')), 10000)
            )
          ]) as Response;
          
          // If successful, break out of retry loop
          if (response.ok) break;
          
          // If we get a CORS error on direct access, switch to proxy
          if (attempts === 0 && !useProxyApi) {
            const corsError = await response.text();
            if (corsError.includes('CORS') || !corsError) {
              console.warn('Possible CORS issue detected during login, switching to proxy API');
              useProxyApi = true;
              loginUrl = '/api/auth/login';
              attempts++;
              await new Promise(resolve => setTimeout(resolve, 500));
              continue;
            }
          }
          
          // Don't retry on authentication errors
          if (response.status === 401 || response.status === 403) {
            break;
          }
          
          // For other errors, try once more
          attempts++;
          if (attempts < maxAttempts) {
            console.warn(`Login failed, retry attempt ${attempts}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error('Login fetch error:', error);
          
          // If we get a network error on direct access, switch to proxy
          if (attempts === 0 && !useProxyApi) {
            console.warn('Network error during login, switching to proxy API');
            useProxyApi = true;
            loginUrl = '/api/auth/login';
          }
          
          attempts++;
          if (attempts >= maxAttempts) {
            throw new Error(error instanceof Error ? 
              `Login failed: ${error.message}` : 
              'Login failed due to network error');
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      if (!response || !response.ok) {
        let errorMessage;
        try {
          const errorData = await response?.json();
          errorMessage = errorData.error_description || 
                        errorData.error || 
                        errorData.message || 
                        'Authentication failed';
        } catch {
          try {
            const errorText = await response?.text();
            errorMessage = errorText || `Authentication failed with status ${response.status}`;
          } catch {
            errorMessage = `Authentication failed with status ${response?.status ?? 'unknown'}`;
          }
        }
        
        throw new Error(errorMessage);
      }
      
      const tokenData: TokenResponse = await response.json();
      this.saveTokens(tokenData);
      
      // Get user profile from the token
      const userProfile = await this.getUserProfile();
      localStorage.setItem(TOKEN_CONFIG.USER_PROFILE_KEY, JSON.stringify(userProfile));
      
      return userProfile;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }
  
  /**
   * Register a new user
   */
  async register(data: RegistrationData): Promise<void> {
    try {
      // Validate required fields
      if (!data.username || !data.email || !data.password || !data.firstName || !data.lastName) {
        throw new Error('Missing required registration fields');
      }

      // Use direct registration - bypass admin token requirements 
      await this.registerDirectly(data);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  /**
   * Register a user via admin API
   */
  private async registerViaAdmin(data: RegistrationData): Promise<void> {
    // Get admin token first
    await this.getAdminToken();
    
    if (!this.adminToken) {
      throw new Error('Failed to obtain admin token');
    }
    
    // Prepare user data
    const userData = {
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      enabled: true,
      emailVerified: true,
      credentials: [
        {
          type: 'password',
          value: data.password,
          temporary: false,
        },
      ],
      attributes: {
        phoneNumber: [data.phoneNumber || ''],
        userType: [data.userType || 'GENERAL_USER'],
        ...data.additionalInfo,
      },
    };
    
    // Determine if we should use proxy
    const isProduction = typeof window !== 'undefined' && 
                        window.location.hostname !== 'localhost' && 
                        window.location.hostname !== '127.0.0.1';
    
    const registerUrl = isProduction ? 
                       '/api/auth/register' : 
                       KEYCLOAK_ENDPOINTS.ADMIN_USERS;
    
    console.log(`Registering user via admin API: ${data.username}`);
    
    // Make request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      // Add auth header for direct requests
      if (!isProduction) {
        headers['Authorization'] = `Bearer ${this.adminToken}`;
      }
      
      const response = await fetch(registerUrl, {
        method: 'POST',
        headers,
        credentials: isProduction ? 'include' : 'same-origin',
        body: JSON.stringify(userData),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // Try to extract error message
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.errorMessage || 
                        `Admin registration failed: ${response.status} ${response.statusText}`;
        } catch {
          errorMessage = `Admin registration failed: ${response.status}`;
        }
        
        throw new Error(errorMessage);
      }

      // Success! Get the user ID from the Location header
      const locationHeader = response.headers.get('Location');
      if (locationHeader) {
        const userId = locationHeader.split('/').pop();
        if (userId) {
          // Assign the user to the appropriate group based on user type
          try {
            const groupPath = data.userType in GROUP_PATHS ? GROUP_PATHS[data.userType as keyof typeof GROUP_PATHS] : GROUP_PATHS.USER;
            await this.assignUserToGroup(userId, groupPath);
          } catch (groupError) {
            console.warn('User was created but could not be assigned to group:', groupError);
            // Continue without throwing - user is created but not in group
          }
        }
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Admin registration error:', error);
      throw error;
    }
  }
  
  /**
   * Register a user directly via direct API proxy
   */
  private async registerDirectly(data: RegistrationData): Promise<void> {
    console.log(`Registering user: ${data.username}`);
    
    // Always use the proxy API for registration - this handles admin token acquisition server-side
    const registerUrl = '/api/auth/direct-register';
    
    // Prepare registration data
    const registrationData = {
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      password: data.password,
      phoneNumber: data.phoneNumber,
      userType: data.userType || 'GENERAL_USER',
      additionalInfo: data.additionalInfo,
    };
    
    // Make request with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    try {
      const response = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(registrationData),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // Try to extract error message
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.errorMessage || 
                       `Registration failed: ${response.status} ${response.statusText}`;
        } catch {
          errorMessage = `Registration failed: ${response.status}`;
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('Registration error:', error);
      throw error;
    }
  }
  
  /**
   * Assign a user to a group
   */
  private async assignUserToGroup(userId: string, groupPath: string): Promise<void> {
    try {
      // First, get the group ID
      const groupId = await this.getGroupId(groupPath);
      
      if (!groupId) {
        console.warn(`Group not found: ${groupPath}`);
        return; // Exit early instead of throwing - less disruptive
      }
      
      console.log(`Assigning user ${userId} to group ${groupPath} (ID: ${groupId})`);
      
      // Assign the user to the group
      const response = await fetch(`${KEYCLOAK_ENDPOINTS.ADMIN_USERS}/${userId}/groups/${groupId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.adminToken}`,
          'Content-Length': '0' // Required for empty PUT requests
        }
      });
      
      if (!response.ok) {
        let errorMessage = `Failed to assign user to group: ${response.status} ${response.statusText}`;
        try {
          const errorText = await response.text();
          if (errorText) {
            errorMessage += ` - ${errorText}`;
          }
        } catch {}
        
        throw new Error(errorMessage);
      }
      
      console.log(`Successfully assigned user ${userId} to group ${groupPath}`);
    } catch (error) {
      console.error('Error assigning user to group:', error);
      throw error;
    }
  }
  
  /**
   * Create a default group in Keycloak
   */
  private async createDefaultGroup(groupPath: string): Promise<string | null> {
    try {
      if (!groupPath.startsWith('/')) {
        groupPath = `/${groupPath}`;
      }
      
      console.log(`Creating default group: ${groupPath}`);
      
      const createGroupResponse = await fetch(KEYCLOAK_ENDPOINTS.ADMIN_GROUPS, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.adminToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: groupPath.split('/').pop(),
          path: groupPath
        })
      });
      
      if (!createGroupResponse.ok) {
        console.error(`Failed to create group: ${createGroupResponse.status} ${createGroupResponse.statusText}`);
        return null;
      }
      
      // Get the location header to extract the group ID
      const locationHeader = createGroupResponse.headers.get('Location');
      if (!locationHeader) {
        console.error('No location header in group creation response');
        return null;
      }
      
      const groupId = locationHeader.split('/').pop();
      console.log(`Successfully created group with ID: ${groupId}`);
      return groupId || null;
    } catch (error) {
      console.error('Error creating default group:', error);
      return null;
    }
  }
  
  /**
   * Get group ID by path
   */
  private async getGroupId(groupPath: string): Promise<string | null> {
    try {
      console.log(`Getting group ID for path: ${groupPath}`);
      const response = await fetch(KEYCLOAK_ENDPOINTS.ADMIN_GROUPS, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.adminToken}`,
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        console.error(`Failed to get groups: ${response.status} ${response.statusText}`);
        return null;
      }
      
      const groups = await response.json();
      console.log(`Retrieved ${groups.length} groups from Keycloak`);
      
      // If groups is empty, create the default group structure
      if (groups.length === 0 && Object.values(GROUP_PATHS).includes(groupPath as GroupPath)) {
        try {
          return await this.createDefaultGroup(groupPath);
        } catch (e) {
          console.error('Failed to create default group:', e);
          return null;
        }
      }
      
      return this.findGroupIdByPath(groups, groupPath);
    } catch (error) {
      console.error('Error getting group ID:', error);
      return null;
    }
  }
  
  /**
   * Find group ID by path recursively
   */
  private findGroupIdByPath(groups: Array<{
    id: string;
    path: string;
    subGroups?: Array<{ id: string; path: string; subGroups?: unknown[] }>;
  }>, path: string): string | null {

    for (const group of groups) {
      if (group.path === path) {
        return group.id;
      }
      
      if (group.subGroups && group.subGroups.length > 0) {
        const id = this.findGroupIdByPath(group.subGroups, path);
        if (id) return id;
      }
    }
    
    return null;
  }
  
  /**
   * Get admin token for Keycloak Admin API using multiple approaches
   */
  private async getAdminToken(): Promise<void> {
    // Check if we already have a valid admin token
    if (this.adminToken && Date.now() < this.adminTokenExpiry) {
      return;
    }
    
    try {
      // Try different authentication approaches in order
      const authSuccess = 
        await this.tryMasterRealmAdminAuth() || 
        await this.tryRealmSpecificAdminAuth() || 
        await this.tryClientCredentialsAuth() || 
        await this.tryServiceAccountAuth();
      
      if (!this.adminToken) {
        throw new Error('All admin authentication methods failed');
      }
      
      console.log('Successfully obtained admin token');
    } catch (error) {
      console.error('Error getting admin token:', error);
      throw error;
    }
  }
  
  /**
   * Try to authenticate with master realm admin credentials
   * @returns boolean True if successful, false otherwise
   */
  private async tryMasterRealmAdminAuth(): Promise<boolean> {
    try {
      console.log('Attempting master realm admin authentication');
      
      const isProduction = typeof window !== 'undefined' && 
                         window.location.hostname !== 'localhost' && 
                         window.location.hostname !== '127.0.0.1';
      
      // In production, try API proxy first to avoid CORS issues
      if (isProduction) {
        const success = await this.tryTokenFromProxy('/api/auth/admin-token');
        if (success) return true;
      }
      
      const masterRealmTokenUrl = `${KEYCLOAK_CONFIG.BASE_URL}/realms/master/protocol/openid-connect/token`;
      
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('client_id', 'admin-cli');
      formData.append('username', KEYCLOAK_CONFIG.ADMIN_USERNAME);
      formData.append('password', KEYCLOAK_CONFIG.ADMIN_PASSWORD);
      
      return await this.fetchTokenWithFormData(masterRealmTokenUrl, formData);
    } catch (error) {
      console.warn('Master realm admin authentication failed:', error);
      return false;
    }
  }
  
  /**
   * Try to authenticate with realm-specific admin credentials
   * @returns boolean True if successful, false otherwise
   */
  private async tryRealmSpecificAdminAuth(): Promise<boolean> {
    try {
      console.log('Attempting realm-specific admin authentication');
      
      const realmTokenUrl = `${KEYCLOAK_CONFIG.BASE_URL}/realms/${KEYCLOAK_CONFIG.REALM}/protocol/openid-connect/token`;
      
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('client_id', KEYCLOAK_CONFIG.CLIENT_ID);
      formData.append('client_secret', KEYCLOAK_CONFIG.CLIENT_SECRET);
      formData.append('username', KEYCLOAK_CONFIG.REALM_ADMIN_USERNAME);
      formData.append('password', KEYCLOAK_CONFIG.REALM_ADMIN_PASSWORD);
      
      return await this.fetchTokenWithFormData(realmTokenUrl, formData);
    } catch (error) {
      console.warn('Realm admin authentication failed:', error);
      return false;
    }
  }
  
  /**
   * Try to authenticate with client credentials
   * @returns boolean True if successful, false otherwise
   */
  private async tryClientCredentialsAuth(): Promise<boolean> {
    try {
      console.log('Attempting client credentials authentication');
      
      // Make sure we use client credentials only when client is confidential (has a secret)
      if (!KEYCLOAK_CONFIG.CLIENT_SECRET || KEYCLOAK_CONFIG.CLIENT_SECRET === 'your-client-secret') {
        console.warn('Client credentials auth skipped: no valid client secret');
        return false;
      }
      
      const tokenUrl = `${KEYCLOAK_CONFIG.BASE_URL}/realms/${KEYCLOAK_CONFIG.REALM}/protocol/openid-connect/token`;
      
      const formData = new URLSearchParams();
      formData.append('grant_type', 'client_credentials');
      formData.append('client_id', KEYCLOAK_CONFIG.CLIENT_ID);
      formData.append('client_secret', KEYCLOAK_CONFIG.CLIENT_SECRET);
      
      return await this.fetchTokenWithFormData(tokenUrl, formData);
    } catch (error) {
      console.warn('Client credentials authentication failed:', error);
      return false;
    }
  }
  
  /**
   * Try to authenticate with service account credentials
   * @returns boolean True if successful, false otherwise
   */
  private async tryServiceAccountAuth(): Promise<boolean> {
    try {
      console.log('Attempting service account authentication');
      
      // Try API proxy first to avoid CORS issues
      const proxySucess = await this.tryTokenFromProxy('/api/auth/service-token');
      if (proxySucess) return true;
      
      // Fallback to direct connection
      const tokenUrl = `${KEYCLOAK_CONFIG.BASE_URL}/realms/${KEYCLOAK_CONFIG.REALM}/protocol/openid-connect/token`;
      
      const formData = new URLSearchParams();
      formData.append('grant_type', 'urn:ietf:params:oauth:grant-type:token-exchange');
      formData.append('client_id', KEYCLOAK_CONFIG.CLIENT_ID);
      formData.append('client_secret', KEYCLOAK_CONFIG.CLIENT_SECRET);
      
      return await this.fetchTokenWithFormData(tokenUrl, formData);
    } catch (error) {
      console.warn('Service account authentication failed:', error);
      return false;
    }
  }
  
  /**
   * Try to get token from proxy API
   * @returns boolean True if successful, false otherwise
   */
  private async tryTokenFromProxy(proxyUrl: string): Promise<boolean> {
    try {
      console.log(`Attempting to get token via proxy: ${proxyUrl}`);
      
      const response = await fetch(proxyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) return false;
      
      const data = await response.json();
      if (!data.access_token) return false;
      
      this.adminToken = data.access_token;
      this.adminTokenExpiry = Date.now() + ((data.expires_in || 300) * 1000) - 60000; // 1-minute buffer
      return true;
    } catch (error) {
      console.warn('Proxy token acquisition failed:', error);
      return false;
    }
  }
  
  /**
   * Fetch token with form data
   * @returns boolean True if successful, false otherwise
   */
  private async fetchTokenWithFormData(url: string, formData: URLSearchParams): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: formData.toString(),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) return false;
      
      const tokenData = await response.json();
      if (!tokenData.access_token) return false;
      
      this.adminToken = tokenData.access_token;
      this.adminTokenExpiry = Date.now() + ((tokenData.expires_in || 300) * 1000) - 60000; // 1-minute buffer
      return true;
    } catch (error) {
      console.warn('Token fetch failed:', error);
      return false;
    }
  }
  
  /**
   * Logout the current user
   */
  logout(): void {
    localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
    localStorage.removeItem(TOKEN_CONFIG.USER_PROFILE_KEY);
  }
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
    const expiry = localStorage.getItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);
    
    if (!token || !expiry) {
      return false;
    }
    
    // Check if token is expired (with 1-minute buffer)
    return Date.now() < parseInt(expiry) - 60000;
  }
  
  /**
   * Get current access token
   */
  async getAccessToken(): Promise<string | null> {
    if (!this.isAuthenticated()) {
      // Try to refresh the token
      const refreshed = await this.refreshToken();
      if (!refreshed) {
        return null;
      }
    }
    
    return localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
  }
  
  /**
   * Refresh the access token
   */
  async refreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
    
    if (!refreshToken) {
      return false;
    }
    
    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'refresh_token');
      formData.append('client_id', KEYCLOAK_CONFIG.CLIENT_ID);
      formData.append('client_secret', KEYCLOAK_CONFIG.CLIENT_SECRET);
      formData.append('refresh_token', refreshToken);
      
      const response = await fetch(KEYCLOAK_ENDPOINTS.TOKEN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      const tokenData: TokenResponse = await response.json();
      this.saveTokens(tokenData);
      
      return true;
    } catch (error) {
      console.error('Token refresh error:', error);
      this.logout();
      return false;
    }
  }
  
  /**
   * Save tokens to local storage
   */
  private saveTokens(tokenData: TokenResponse): void {
    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, tokenData.access_token);
    localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, tokenData.refresh_token);
    
    // Calculate token expiry time
    const expiryTime = Date.now() + (tokenData.expires_in * 1000);
    localStorage.setItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY, expiryTime.toString());
  }
  
  /**
   * Parse JWT token
   */
  private parseToken(token: string): {
    sub: string;
    preferred_username: string;
    email: string;
    given_name: string;
    family_name: string;
    roles: Role[];
    permissions: Permission[];
    groups: string[];
    userType: UserType;
    attributes?: Record<string, unknown>;
    [key: string]: unknown;
  } | null {

    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }
  
  /**
   * Get user profile from token
   */
  async getUserProfile(): Promise<UserProfile> {
    const token = await this.getAccessToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    const tokenData = this.parseToken(token);
    
    if (!tokenData) {
      throw new Error('Invalid token');
    }
  

    const userProfile: UserProfile = {
      id: tokenData.sub,
      username: tokenData.preferred_username as string,
      email: tokenData.email as string,
      firstName: tokenData.given_name as string,
      lastName: tokenData.family_name as string,
      roles: (tokenData.roles as Role[]) || [],
      permissions: (tokenData.permissions as Permission[]) || [],
      groups: (tokenData.groups as string[]) || [],
      userType: (tokenData.userType as UserType) || 'GENERAL_USER',
      attributes: tokenData.attributes as Record<string, unknown> | undefined,
    };
    return userProfile;
  }
  /**
   * Check if user has a specific permission
   */
  async hasPermission(permission: Permission): Promise<boolean> {
    try {
      const userProfile = await this.getUserProfile();
      return userProfile.permissions.includes(permission);
    } catch (error) {
      console.error('Error checking permission:', error);
      return false;
    }
  }
  
  /**
   * Check if user has a specific role
   */
  async hasRole(role: Role): Promise<boolean> {
    try {
      const userProfile = await this.getUserProfile();
      return userProfile.roles.includes(role);
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  }
  
  /**
   * Check if user belongs to a specific group
   */
  async isInGroup(groupPath: string): Promise<boolean> {
    try {
      const userProfile = await this.getUserProfile();
      return userProfile.groups.includes(groupPath);
    } catch (error) {
      console.error('Error checking group:', error);
      return false;
    }
  }
}

// Export a singleton instance
export const keycloakService = new KeycloakService();
export default keycloakService;
