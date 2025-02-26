"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthState, AuthUser, Permission, Role } from "../types/auth";
import { validateAccessRights } from "../lib/auth";
import { authService } from "../services/authService";
import { toast } from "sonner";
import { USER_TYPES } from "@/shared/auth/apiConfig";

// Valid roles and permissions arrays for runtime checks
const VALID_ROLES = [
  'SUPER_ADMIN', 'ADMIN', 'MANAGER', 'PHARMACY_MANAGER', 'USER', 'PHARMACIST', 'PROPRIETOR', 'SALESMAN'
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

interface RegisterData {
  firstName: string;
  lastName: string;
  emailAddress: string;
  password: string;
  contactNumber?: string;
  userType?: string;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
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
        // Check if we have a token
        const tokenData = authService.getToken();
        
        if (tokenData.access && !authService.isAuthenticated()) {
          await logout();
          return;
        }
        
        if (tokenData.access) {
          // Get user data from localStorage
          const userData = authService.getUserData();
          
          if (userData) {
            updateStateWithToken(tokenData.access, userData);
          } else {
            // Fetch user profile if we have token but no user data
            try {
              const userProfile = await authService.getProfile();
              updateUserProfile(userProfile);
            } catch (error) {
              console.error("Error fetching user profile:", error);
              await logout();
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setState(INITIAL_STATE);
      }
    };
    
    initializeAuth();
  }, []);

  const updateStateWithToken = (accessToken: string, userData: any = null) => {
    try {
      // Extract roles and permissions for a proper auth state
      const roles = validateRoles(userData?.roles || []);
      const permissions = validatePermissions(userData?.permissions || []);
      
      // Create user structure
      const user: AuthUser = {
        id: userData?.id || "",
        email: userData?.emailAddress || "",
        roles,
        permissions,
        name: userData?.firstName ? `${userData.firstName} ${userData.lastName || ''}`.trim() : "",
        firstName: userData?.firstName || "",
        lastName: userData?.lastName || "",
        userType: userData?.userType || null
      };

      // Update state with token and user data
      setState(prev => ({
        ...prev,
        user,
        isAuthenticated: true,
        token: {
          ...prev.token,
          access: accessToken,
          expires: userData?.exp ? userData.exp * 1000 : 0
        }
      }));
    } catch (error) {
      console.error("Error updating state with token:", error);
      logout();
    }
  };
  
  // Validate and filter roles to ensure only valid roles are stored
  const validateRoles = (roles: string[]): Role[] => {
    return roles.filter(role => 
      VALID_ROLES.includes(role as Role)
    ) as Role[];
  };
  
  // Validate and filter permissions to ensure only valid permissions are stored
  const validatePermissions = (permissions: string[]): Permission[] => {
    return permissions.filter(permission => 
      VALID_PERMISSIONS.includes(permission as Permission)
    ) as Permission[];
  };

  const updateUserProfile = (profile: any) => {
    const userData = authService.getUserData() || {};
    const roles = validateRoles(userData?.roles || []);
    const permissions = validatePermissions(userData?.permissions || []);
    
    setState(prev => ({
      ...prev,
      user: {
        ...prev.user,
        id: profile.id || prev.user?.id || "",
        email: profile.emailAddress || prev.user?.email || "",
        firstName: profile.firstName || prev.user?.firstName || "",
        lastName: profile.lastName || prev.user?.lastName || "",
        name: `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || prev.user?.name || "",
        userType: profile.userType || userData?.userType || prev.user?.userType || null,
        roles,
        permissions
      }
    }));
  };

  const login = async (credentials: LoginCredentials): Promise<void> => {
    try {
      const tokenData = await authService.login(credentials);
      
      if (tokenData.access) {
        // Get user data from localStorage after login
        const userData = authService.getUserData();
        
        if (userData) {
          updateStateWithToken(tokenData.access, userData);
        } else {
          // Fetch user profile if no user data in localStorage
          try {
            const profile = await authService.getProfile();
            updateUserProfile(profile);
          } catch (error) {
            console.error("Error fetching user profile after login:", error);
          }
        }

        toast.success("Login successful");
        router.push('/dashboard');
      } else {
        throw new Error("No token received from login");
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error("Login failed. Please check your credentials and try again.");
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<void> => {
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
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
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
    return hasRole('ADMIN') || hasRole('SUPER_ADMIN');
  };
  
  const isPharmacist = (): boolean => {
    return hasRole('PHARMACIST') || getUserType() === USER_TYPES.PHARMACIST;
  };
  
  const isProprietor = (): boolean => {
    return hasRole('PROPRIETOR') || getUserType() === USER_TYPES.PROPRIETOR;
  };
  
  const isPharmacyManager = (): boolean => {
    return hasRole('PHARMACY_MANAGER') || getUserType() === USER_TYPES.PHARMACY_MANAGER;
  };
  
  const isSalesman = (): boolean => {
    return hasRole('SALESMAN') || getUserType() === USER_TYPES.SALESMAN;
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