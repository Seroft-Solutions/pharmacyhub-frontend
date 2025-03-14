"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { useAuth } from '@/features/auth/hooks';

type Role = 'user' | 'admin' | 'super_admin';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  isAdmin: boolean;
  isSuperAdmin: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
  children: React.ReactNode;
}

// Safe localStorage access that works with SSR
const getLocalStorageItem = (key: string): string | null => {
  if (typeof window === 'undefined') {
    return null; // Return null during server-side rendering
  }
  return localStorage.getItem(key);
};

// Safe localStorage setter that works with SSR
const setLocalStorageItem = (key: string, value: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value);
  }
};

function getInitialRoleState(roles?: string[]): Role {
  // Default to user role for server-side rendering
  if (typeof window === 'undefined') {
    return 'user';
  }

  // Check for JWT roles first
  if (roles) {
    if (roles.includes('SUPER_ADMIN')) return 'super_admin';
    if (roles.includes('ADMIN')) return 'admin';
    return 'user';
  }
  
  // Otherwise check localStorage
  const savedRole = getLocalStorageItem('userRole') as Role;
  if (savedRole && (savedRole === 'user' || savedRole === 'admin' || savedRole === 'super_admin')) {
    return savedRole;
  }
  
  // Default to user
  return 'user';
}

export function RoleProvider({ children }: RoleProviderProps) {
  const { user } = useAuth();
  const [role, setRoleState] = useState<Role>('user'); // Default to 'user' initially
  const [isClientSide, setIsClientSide] = useState(false);
  
  // Set isClientSide flag after component mounts
  useEffect(() => {
    setIsClientSide(true);
    // Now that we're client-side, update the role based on user roles or localStorage
    setRoleState(getInitialRoleState(user?.roles));
  }, []);

  // Initialize or update role when user changes
  useEffect(() => {
    if (!isClientSide) return; // Skip during SSR
    
    if (user?.roles) {
      // Update role based on JWT token roles
      if (user.roles.includes('SUPER_ADMIN')) {
        setRoleState('super_admin');
        setLocalStorageItem('userRole', 'super_admin');
      } else if (user.roles.includes('ADMIN')) {
        setRoleState('admin');
        setLocalStorageItem('userRole', 'admin');
      } else {
        setRoleState('user');
        setLocalStorageItem('userRole', 'user');
      }
    }
  }, [user?.roles, isClientSide]);
  
  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (typeof window !== 'undefined') {
      setLocalStorageItem('userRole', newRole);
    }
  };
  
  const contextValue = {
    role, 
    setRole, 
    isAdmin: role === 'admin' || role === 'super_admin',
    isSuperAdmin: role === 'super_admin'
  };
  
  return (
    <RoleContext.Provider value={contextValue}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
