/**
 * RBAC Provider
 * 
 * This component provides RBAC functionality to the application,
 * wrapping all other providers and exposing RBAC methods.
 */
import React, { ReactNode } from 'react';
import { FeatureProvider } from './FeatureContext';
import { UserPermissions } from '../types';
import RBACContext from './RBACContext';
import { useRBACState } from '../hooks/useRBACState';

/**
 * Props for the RBACProvider component
 */
interface RBACProviderProps {
  /**
   * Initial user permissions
   */
  initialPermissions?: UserPermissions;
  
  /**
   * Whether to initialize the RBAC service immediately
   */
  initializeImmediately?: boolean;
  
  /**
   * React nodes to render
   */
  children: ReactNode;
}

/**
 * RBAC Provider Component
 * 
 * Provides RBAC functionality to the application
 */
export const RBACProvider: React.FC<RBACProviderProps> = ({ 
  initialPermissions,
  initializeImmediately = true,
  children 
}) => {
  // Use the RBAC state hook to manage state and get RBAC methods
  const rbacState = useRBACState({
    initialPermissions,
    initializeImmediately
  });
  
  // Wrap with feature provider
  return (
    <RBACContext.Provider value={rbacState}>
      <FeatureProvider>
        {children}
      </FeatureProvider>
    </RBACContext.Provider>
  );
};



export default RBACProvider;