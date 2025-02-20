/**
 * Keycloak Service
 * 
 * This service handles all interactions with the Keycloak server,
 * including authentication, registration, and token management.
 */

import { Permission, Role, UserType, GROUP_PATHS } from './permissions';
import { 
  KEYCLOAK_CONFIG, 
  KEYCLOAK_ENDPOINTS, 
  TOKEN_CONFIG,
  SESSION_CONFIG
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
  attributes?: Record<string, any>;
}

export interface RegistrationData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  userType: UserType;
  phoneNumber?: string;
  additionalInfo?: Record<string, any>;
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
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('client_id', KEYCLOAK_CONFIG.CLIENT_ID);
      formData.append('client_secret', KEYCLOAK_CONFIG.CLIENT_SECRET);
      formData.append('username', username);
      formData.append('password', password);
      
      const loginUrl = KEYCLOAK_ENDPOINTS.TOKEN;
      console.log('Attempting login at:', loginUrl);
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        body: formData.toString(),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error_description || 'Failed to authenticate');
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
      // First, we need an admin token to create users
      await this.getAdminToken();
      
      if (!this.adminToken) {
        throw new Error('Failed to obtain admin token');
      }
      
      // Create the user
      const userData = {
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        enabled: true,
        emailVerified: false,
        credentials: [
          {
            type: 'password',
            value: data.password,
            temporary: false,
          },
        ],
        attributes: {
          phoneNumber: [data.phoneNumber || ''],
          userType: [data.userType],
          ...data.additionalInfo,
        },
      };
      
      const registerUrl = KEYCLOAK_ENDPOINTS.ADMIN_USERS;
      console.log(`Registering user: ${data.username} to endpoint: ${registerUrl}`);
      
      // Make request to create user
      const userResponse = await fetch(registerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.adminToken}`
        },
        body: JSON.stringify(userData),
      });
      
      if (!userResponse.ok) {
        let errorMessage;
        try {
          // Try to parse error as JSON
          const errorJson = await userResponse.json();
          errorMessage = errorJson.errorMessage || `Failed to register user: ${userResponse.status} ${userResponse.statusText}`;
        } catch (e) {
          // If error isn't JSON, get as text
          const errorText = await userResponse.text();
          errorMessage = errorText || `Failed to register user: ${userResponse.status} ${userResponse.statusText}`;
        }
        
        // Check for common error cases
        if (errorMessage.includes('already exists')) {
          throw new Error('User with this username or email already exists');
        }
        
        throw new Error(errorMessage);
      }
      
      // Success! Get the user ID from the Location header
      const locationHeader = userResponse.headers.get('Location');
      console.log('User created successfully, location:', locationHeader);
      
      // Only try to assign to group if we got a location header with user ID
      if (locationHeader) {
        const userId = locationHeader.split('/').pop();
        if (userId) {
          // Assign the user to the appropriate group based on user type
          try {
            const groupPath = GROUP_PATHS[data.userType] || GROUP_PATHS.USER;
            await this.assignUserToGroup(userId, groupPath);
          } catch (groupError) {
            console.warn('User was created but could not be assigned to group:', groupError);
            // Continue without throwing - user is created but not in group
          }
        }
      }
    } catch (error) {
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
      if (groups.length === 0 && Object.values(GROUP_PATHS).includes(groupPath)) {
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
  private findGroupIdByPath(groups: any[], path: string): string | null {
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
   * Get admin token for Keycloak Admin API using master realm
   */
  private async getAdminToken(): Promise<void> {
    // Check if we already have a valid admin token
    if (this.adminToken && Date.now() < this.adminTokenExpiry) {
      return;
    }
    
    try {
      // Important: For admin access, need to use master realm
      console.log('Attempting master realm admin authentication');
      
      const masterRealmTokenUrl = `${KEYCLOAK_CONFIG.BASE_URL}/realms/master/protocol/openid-connect/token`;
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('client_id', 'admin-cli');
      formData.append('username', KEYCLOAK_CONFIG.ADMIN_USERNAME);
      formData.append('password', KEYCLOAK_CONFIG.ADMIN_PASSWORD);
      
      const response = await fetch(masterRealmTokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Admin authentication failed:', {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        throw new Error(`Failed to get admin token: ${response.status} ${response.statusText}`);
      }
      
      const tokenData: TokenResponse = await response.json();
      this.adminToken = tokenData.access_token;
      this.adminTokenExpiry = Date.now() + (tokenData.expires_in * 1000) - 60000; // 1-minute buffer
      console.log('Successfully obtained admin token from master realm');
    } catch (error) {
      console.error('Error getting admin token:', error);
      throw error;
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
    
    // Optional: Redirect to Keycloak logout if needed
    // window.location.href = `${KEYCLOAK_ENDPOINTS.LOGOUT}?redirect_uri=${encodeURIComponent(window.location.origin)}`;
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
  private parseToken(token: string): any {
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
    
    return {
      id: tokenData.sub,
      username: tokenData.preferred_username,
      email: tokenData.email,
      firstName: tokenData.given_name,
      lastName: tokenData.family_name,
      roles: tokenData.roles || [],
      permissions: tokenData.permissions || [],
      groups: tokenData.groups || [],
      userType: tokenData.userType || 'USER',
      attributes: tokenData.attributes,
    };
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
