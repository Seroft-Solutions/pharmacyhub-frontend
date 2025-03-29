/**
 * RBAC Provider
 * 
 * This component provides RBAC functionality to the application,
 * wrapping all other providers and exposing RBAC methods.
 */
import React, { ReactNode, useEffect } from 'react';
import { FeatureProvider } from './FeatureContext';
import { UserPermissions } from '../types';
import RBACContext from './RBACContext';
import { useRBACState } from '../hooks/useRBACState';
import { useRbacStore } from '../state';

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
 * Provides RBAC functionality to the application.
 * This component now uses the Zustand store internally for state management.
 */
export const RBACProvider: React.FC<RBACProviderProps> = ({ 
  initialPermissions,
  initializeImmediately = true,
  children 
}) => {
  // Get initialize action from the Zustand store
  const initialize = useRbacStore(state => state.initialize);

  // Initialize the store with the provided permissions
  useEffect(() => {
    if (initializeImmediately && initialPermissions) {
      initialize(initialPermissions);
    }
  }, [initialize, initializeImmediately, initialPermissions]);
  
  // Use the RBAC state hook to maintain backward compatibility
  const rbacState = useRBACState({
    initialPermissions,
    initializeImmediately: false // We initialize via the store now
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