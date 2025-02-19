"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthState, AuthUser, Permission, Role } from "../types/auth";
import { 
  parseToken, 
  isTokenExpired, 
  shouldRefreshToken, 
  setTokens, 
  clearTokens, 
  createAuthHeaders,
  validateAccessRights
} from "../lib/auth";

interface AuthContextType extends AuthState {
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: Role) => boolean;
  checkAccess: (roles?: Role[], permissions?: Permission[]) => boolean;
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

  useEffect(() => {
    const validateSession = async () => {
      const accessToken = state.token.access;
      
      if (!accessToken) {
        return;
      }

      if (isTokenExpired(accessToken)) {
        try {
          await refreshToken();
        } catch {
          await logout();
        }
        return;
      }

      if (shouldRefreshToken(accessToken)) {
        try {
          await refreshToken();
        } catch (error) {
          console.error("Error refreshing token:", error);
        }
      }
    };

    validateSession();
    // Set up periodic token validation
    const interval = setInterval(validateSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [state.token.access]);

  const updateStateWithToken = (accessToken: string) => {
    const decoded = parseToken(accessToken);
    const user: AuthUser = {
      id: decoded.sub,
      email: decoded.email,
      roles: decoded.roles,
      permissions: decoded.permissions,
      firstName: "", // These will be fetched from user profile API
      lastName: ""
    };

    setState(prev => ({
      ...prev,
      user,
      isAuthenticated: true,
      token: {
        ...prev.token,
        access: accessToken,
        expires: decoded.exp * 1000
      }
    }));
  };

  const login = async (token: string): Promise<void> => {
    try {
      setTokens({
        access: token,
        refresh: null, // Refresh token is handled by HTTP-only cookie
        expires: parseToken(token).exp * 1000
      });
      
      updateStateWithToken(token);

      // Fetch additional user profile data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/users/profile`,
        { headers: createAuthHeaders(token) }
      );

      if (response.ok) {
        const profile = await response.json();
        setState(prev => ({
          ...prev,
          user: prev.user ? {
            ...prev.user,
            firstName: profile.firstName,
            lastName: profile.lastName,
            phoneNumber: profile.phoneNumber
          } : null
        }));
      }

      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Failed to login');
    }
  };

  const refreshToken = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/refresh`,
        {
          method: 'POST',
          credentials: 'include' // Include cookies
        }
      );

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const { token } = await response.json();
      updateStateWithToken(token);
    } catch (error) {
      console.error('Token refresh error:', error);
      await logout();
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/logout`,
        {
          method: 'POST',
          credentials: 'include'
        }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
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

  return (
    <AuthContext.Provider 
      value={{
        ...state,
        login,
        logout,
        refreshToken,
        hasPermission,
        hasRole,
        checkAccess
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