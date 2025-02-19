/**
 * Authentication Context
 * 
 * This context provides authentication state and methods to all components
 * in the application. It handles user authentication, permissions checking,
 * and profile management.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import keycloakService, { UserProfile, RegistrationData } from './keycloakService';
import { Permission, Role } from './permissions';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<UserProfile>;
  logout: () => void;
  register: (data: RegistrationData) => Promise<void>;
  hasPermission: (permission: Permission) => Promise<boolean>;
  hasRole: (role: Role) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {
    throw new Error('AuthContext not initialized');
  },
  logout: () => {
    throw new Error('AuthContext not initialized');
  },
  register: async () => {
    throw new Error('AuthContext not initialized');
  },
  hasPermission: async () => false,
  hasRole: async () => false,
  refreshUser: async () => {
    throw new Error('AuthContext not initialized');
  },
});

// User profile storage key
const USER_PROFILE_KEY = 'pharmacyhub_user_profile';

/**
 * Auth Provider Component
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  
  // Initialize auth state on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        if (keycloakService.isAuthenticated()) {
          // Try to get user profile from local storage first for faster rendering
          const cachedProfile = localStorage.getItem(USER_PROFILE_KEY);
          
          if (cachedProfile) {
            const parsedProfile = JSON.parse(cachedProfile) as UserProfile;
            setUser(parsedProfile);
            setIsAuthenticated(true);
          }
          
          // Then refresh from the token to ensure it's up to date
          await refreshUser();
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear any invalid auth state
        keycloakService.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  /**
   * Login handler
   */
  const login = async (username: string, password: string): Promise<UserProfile> => {
    setIsLoading(true);
    
    try {
      const userProfile = await keycloakService.login(username, password);
      setUser(userProfile);
      setIsAuthenticated(true);
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
      return userProfile;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Logout handler
   */
  const logout = () => {
    keycloakService.logout();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(USER_PROFILE_KEY);
    router.push('/login');
  };
  
  /**
   * Registration handler
   */
  const register = async (data: RegistrationData): Promise<void> => {
    setIsLoading(true);
    
    try {
      await keycloakService.register(data);
      // Note: We don't automatically log in after registration
      // because email verification might be required
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * Permission check handler
   */
  const hasPermission = async (permission: Permission): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      return false;
    }
    
    // First check the cached user profile for faster response
    if (user.permissions.includes(permission)) {
      return true;
    }
    
    // If not found in cache, check with the service 
    // (this will get fresh data from the token if needed)
    return keycloakService.hasPermission(permission);
  };
  
  /**
   * Role check handler
   */
  const hasRole = async (role: Role): Promise<boolean> => {
    if (!isAuthenticated || !user) {
      return false;
    }
    
    // First check the cached user profile
    if (user.roles.includes(role)) {
      return true;
    }
    
    // If not found in cache, check with the service
    return keycloakService.hasRole(role);
  };
  
  /**
   * Refresh user profile from token
   */
  const refreshUser = async (): Promise<void> => {
    try {
      const userProfile = await keycloakService.getUserProfile();
      setUser(userProfile);
      setIsAuthenticated(true);
      localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
    } catch (error) {
      console.error('Profile refresh error:', error);
      keycloakService.logout();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem(USER_PROFILE_KEY);
    }
  };
  
  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    register,
    hasPermission,
    hasRole,
    refreshUser,
  };
  
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the auth context
 */
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
