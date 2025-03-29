/**
 * useRBAC Hook
 * 
 * Custom hook for using the RBAC context in components
 */
import { useContext } from 'react';
import RBACContext, { RBACContextType } from '../contexts/RBACContext';

/**
 * Hook for using the RBAC context
 * @returns RBAC context methods and state
 * @throws Error if used outside of an RBACProvider
 */
export const useRBAC = (): RBACContextType => {
  const context = useContext(RBACContext);
  
  if (context === undefined) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  
  return context;
};

export default useRBAC;