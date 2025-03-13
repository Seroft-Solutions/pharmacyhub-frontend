"use client";

import { useState, useEffect, createContext, useContext } from 'react';

type Role = 'user' | 'admin';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  isAdmin: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
  children: React.ReactNode;
}

export function RoleProvider({ children }: RoleProviderProps) {
  const [role, setRoleState] = useState<Role>('user');
  
  useEffect(() => {
    // Load the role from localStorage on initial mount
    const savedRole = localStorage.getItem('userRole') as Role;
    if (savedRole && (savedRole === 'user' || savedRole === 'admin')) {
      setRoleState(savedRole);
    }
  }, []);
  
  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    localStorage.setItem('userRole', newRole);
  };
  
  return (
    <RoleContext.Provider value={{ 
      role, 
      setRole, 
      isAdmin: role === 'admin' 
    }}>
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
