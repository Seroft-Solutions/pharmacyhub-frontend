"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthState, AuthUser, Permission, Role } from "../types/auth";
import { validateAccessRights } from "../lib/auth";
import { authService } from "@/shared/auth/authService";
import { UserProfile, RegistrationData } from "@/shared/auth/types";
import { toast } from "sonner";
import { USER_TYPES } from "@/shared/auth/apiConfig";
import { tokenManager } from "@/shared/api/tokenManager";
import { TOKEN_CONFIG } from "@/shared/auth/apiConfig";

// Valid roles and permissions arrays for runtime checks
const VALID_ROLES = [
  'SUPER_ADMIN', 'ADMIN', 'MANAGER', 'PHARMACY_MANAGER', 'USER', 'PHARMACIST', 'PROPRIETOR', 'SALESMAN',
  'INSTRUCTOR' // Adding missing role
] as const;

const VALID_PERMISSIONS = [
  'manage_system', 'manage_users', 'manage_staff', 'view_reports', 
  'approve_orders', 'manage_inventory', 'view_products', 'place_orders',
  'create:pharmacy', 'edit:pharmacy', 'delete:pharmacy', 'view:pharmacy',
  'manage:users', 'view:users', 'manage:roles', 'manage:exams', 'UPDATE_STATUS',
  'take:exams', 'grade:exams'
] as const;

interface LoginCredentials {
  emailAddress: string;
  password: string;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegistrationData) => Promise<void>;
  logout: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: Role) => boolean;
  checkAccess: (roles?: Role[], permissions?: Permission[]) => boolean;
  getUserType: () => string | null;
  isAdmin: () => boolean;
  isPharmacist: () => boolean;
  isProprietor: () => boolean;
  isPharmacyManager: () => boolean;
  isSalesman: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const INITIAL_STATE: AuthState = {
  user: null,
  isAuthenticated: false,
  token: {
    access: null,
    refresh: null,
    expires: 0
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(INITIAL_STATE);
  const router = useRouter();

  // Initialize auth state from local storage on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          try {
            const userProfile = await authService.getUserProfile();
            updateUserState(userProfile);
          } catch (error) {
            console.error("Error fetching user profile:", error);
            await logout();
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setState(INITIAL_STATE);
      }
    };
    
    initializeAuth();
  }, []);

  const updateUserState = (profile: UserProfile) => {
    try {
      // Extract roles and permissions for a proper auth state
      const roles = validateRoles(profile.roles || []);
      const permissions = validatePermissions(profile.permissions || []);
      
      // Create user structure
      const user: AuthUser = {
        id: profile.id || "",
        email: profile.email || "",
        roles,
        permissions,
        name: profile.firstName ? `${profile.firstName} ${profile.lastName || ''}`.trim() : "",
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        userType: profile.userType || null
      };

      // Get token info from localStorage since that's where authService stores it
      const accessToken = localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
      const expiry = localStorage.getItem(TOKEN_CONFIG.TOKEN_EXPIRY_KEY);

      // Sync with tokenManager
      if (accessToken) {
        tokenManager.setToken(accessToken);
      }
      if (expiry) {
        tokenManager.setTokenExpiry(parseInt(expiry));
      }

      // Update state with user data and token info
      setState({
        user,
        isAuthenticated: true,
        token: {
          access: accessToken,
          refresh: localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY),
          expires: expiry ? parseInt(expiry) : 0
        }
      });
    } catch (error) {
      console.error("Error updating user state:", error);
      logout();
    }
  };
  
  // Validate and filter roles to ensure only valid roles are stored
  const validateRoles = (roles: string[]): Role[] => {
    return roles.filter((role): role is Role => 
      VALID_ROLES.includes(role as Role)
    );
  };
  
  // Validate and filter permissions to ensure only valid permissions are stored
  const validatePermissions = (permissions: string[]): Permission[] => {
    return permissions.filter((permission): permission is Permission => 
      VALID_PERMISSIONS.includes(permission as Permission)
    );
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      // Use authService login which returns UserProfile
      const profile = await authService.login(credentials.emailAddress, credentials.password);
      updateUserState(profile);
      
      toast.success("Login successful");
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed. Please check your credentials and try again.");
      throw error;
    }
  };

  const register = async (userData: RegistrationData): Promise<void> => {
    try {
      await authService.register(userData);
      toast.success("Registration successful! Please check your email for verification.");
      router.push('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Registration failed. Please try again.");
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
      // Clean up tokenManager
      tokenManager.removeToken();
      setState(INITIAL_STATE);
    } catch (error) {
      console.error('Logout error:', error);
      setState(INITIAL_STATE);
      router.push('/login');
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    return state.user?.permissions.includes(permission) ?? false;
  };

  const hasRole = (role: Role): boolean => {
    return validateAccessRights(
      state.user?.roles ?? [], 
      [], 
      [role],
      []
    );
  };

  const checkAccess = (roles?: Role[], permissions?: Permission[]): boolean => {
    return validateAccessRights(
      state.user?.roles ?? [],
      state.user?.permissions ?? [],
      roles,
      permissions
    );
  };
  
  // Get the user type (from the token or user data)
  const getUserType = (): string | null => {
    return state.user?.userType || null;
  };
  
  // Convenience methods for common role checks
  const isAdmin = (): boolean => {
    return hasRole('ADMIN' as Role) || hasRole('SUPER_ADMIN' as Role);
  };
  
  const isPharmacist = (): boolean => {
    return hasRole('PHARMACIST' as Role) || getUserType() === USER_TYPES.PHARMACIST;
  };
  
  const isProprietor = (): boolean => {
    return hasRole('PROPRIETOR' as Role) || getUserType() === USER_TYPES.PROPRIETOR;
  };
  
  const isPharmacyManager = (): boolean => {
    return hasRole('PHARMACY_MANAGER' as Role) || getUserType() === USER_TYPES.PHARMACY_MANAGER;
  };
  
  const isSalesman = (): boolean => {
    return hasRole('SALESMAN' as Role) || getUserType() === USER_TYPES.SALESMAN;
  };

  return (
    <AuthContext.Provider 
      value={{
        ...state,
        login,
        register,
        logout,
        hasPermission,
        hasRole,
        checkAccess,
        getUserType,
        isAdmin,
        isPharmacist,
        isProprietor,
        isPharmacyManager,
        isSalesman
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
