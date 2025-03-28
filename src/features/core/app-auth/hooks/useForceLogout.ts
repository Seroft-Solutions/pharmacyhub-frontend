"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sessionService } from '../api/services/sessionService';
import { useAntiSharingStore } from '../anti-sharing/store';

/**
 * Hook for managing the force logout functionality
 * Used when a user is already logged in on another device
 */
export const useForceLogout = (redirectPath = '/dashboard') => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  // Get the session ID from the anti-sharing store
  const sessionId = useAntiSharingStore(state => state.sessionId);

  /**
   * Force logout from all other devices, keeping the current session active
   * @returns Promise<boolean> - true if successful, false otherwise
   */
  const forceLogout = async (): Promise<boolean> => {
    if (!sessionId) {
      setError('No session ID available');
      return false;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the session service to force logout from other devices
      const success = await sessionService.forceLogout(sessionId);
      
      if (success) {
        // If successful, redirect to the specified path
        router.push(redirectPath);
        return true;
      } else {
        setError('Failed to log out from other devices');
        return false;
      }
    } catch (err) {
      console.error('Force logout error:', err);
      setError(err instanceof Error ? err.message : 'Failed to log out from other devices');
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    forceLogout,
    isLoading,
    error,
  };
};

export default useForceLogout;