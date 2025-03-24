/**
 * Premium Status Hook
 * 
 * This hook provides a unified way to check if a user has premium access.
 * It implements the "pay once, access all" feature by checking:
 * 1. Local storage for premium status
 * 2. Manual payment access
 * 3. Online payment access
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { usePaymentHistory } from '../../api/hooks/usePaymentApiHooks';
import { useUserManualRequests } from '../../manual/api/hooks/useManualPaymentApiHooks';

// LocalStorage key
const PREMIUM_STATUS_KEY = 'pharmacyhub_premium_status';

// Cache check timestamps to prevent excessive API calls
let lastPremiumCheckTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface UsePremiumStatusOptions {
  /**
   * If true, will update the premium status in localStorage
   * This ensures future exams can be accessed without API calls
   */
  persist?: boolean;

  /**
   * If true, will skip local storage check and force API check
   */
  forceCheck?: boolean;
}

/**
 * Safe localStorage getter with error handling
 */
const safeGetLocalStorage = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.error(`Error accessing localStorage for key ${key}:`, e);
    return null;
  }
};

/**
 * Safe localStorage setter with error handling
 */
const safeSetLocalStorage = (key: string, value: string): boolean => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (e) {
    console.error(`Error setting localStorage for key ${key}:`, e);
    return false;
  }
};

/**
 * Hook to check and manage premium status
 * Implements the "pay once, access all" feature
 * Fixed to prevent excessive refreshes and localStorage errors
 */
const usePremiumStatus = (options: UsePremiumStatusOptions = {}) => {
  const { persist = true, forceCheck = false } = options;
  
  // State
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    // Initialize from localStorage if possible
    if (!forceCheck) {
      return safeGetLocalStorage(PREMIUM_STATUS_KEY) === 'true';
    }
    return false;
  });
  
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Track refresh status to prevent duplicate calls
  const refreshingRef = useRef(false);
  
  // Check if we already have premium access from localStorage
  const hasCachedPremium = !forceCheck && safeGetLocalStorage(PREMIUM_STATUS_KEY) === 'true';
  
  // API hooks with optimized fetching
  const { 
    data: paymentHistory, 
    isLoading: isLoadingPayments,
    refetch: refetchPayments
  } = usePaymentHistory({
    // Only fetch if we don't already know user has premium from localStorage
    enabled: forceCheck || !hasCachedPremium,
    staleTime: CACHE_TTL, // 5 minutes
    retry: 1,
    retryDelay: 1000
  });
  
  const { 
    data: manualRequests, 
    isLoading: isLoadingManual,
    refetch: refetchManual
  } = useUserManualRequests({
    // Only fetch if we don't already know user has premium from localStorage
    enabled: forceCheck || !hasCachedPremium,
    staleTime: CACHE_TTL, // 5 minutes
    retry: 1,
    retryDelay: 1000
  });
  
  // Method to manually refresh premium status
  const refreshPremiumStatus = useCallback(async () => {
    // Check time since last refresh to prevent excessive calls
    const now = Date.now();
    const timeSinceLastCheck = now - lastPremiumCheckTime;
    
    // If we're currently refreshing or it's been less than 10 seconds since the last refresh,
    // don't refresh again unless forced
    if (refreshingRef.current || (timeSinceLastCheck < 10000 && !forceCheck)) {
      console.log('Skipping premium status refresh (too recent or already in progress)');
      return;
    }
    
    // Set refreshing flag
    refreshingRef.current = true;
    setIsLoading(true);
    
    try {
      // Update last check time
      lastPremiumCheckTime = now;
      
      // Fetch data from API
      const [paymentsResult, manualResult] = await Promise.all([
        refetchPayments(),
        refetchManual()
      ]);
      
      // Check if user has any successful payment
      const hasOnlinePayment = paymentsResult.data && paymentsResult.data.some(
        payment => payment.status === 'COMPLETED'
      );
      
      // Check if user has any approved manual payment
      const hasManualPayment = manualResult.data && manualResult.data.some(
        request => request.status === 'APPROVED'
      );
      
      // Determine premium status - PAY ONCE, ACCESS ALL
      const hasPremiumAccess = hasOnlinePayment || hasManualPayment;
      
      // Update state
      setIsPremium(hasPremiumAccess);
      setError(null);
      
      // Persist to localStorage if needed
      if (persist && hasPremiumAccess) {
        const success = safeSetLocalStorage(PREMIUM_STATUS_KEY, 'true');
        if (success) {
          console.log('Premium access granted and persisted to localStorage - Pay once, access all feature active');
        }
      }
      
      // Return the result
      return hasPremiumAccess;
    } catch (err) {
      console.error('Error refreshing premium status:', err);
      const errorObj = err instanceof Error ? err : new Error('Failed to refresh premium status');
      setError(errorObj);
      return false;
    } finally {
      refreshingRef.current = false;
      setIsLoading(false);
    }
  }, [forceCheck, persist, refetchManual, refetchPayments]);
  
  // Effect to check premium status
  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        // First, check localStorage if not forcing check
        if (!forceCheck) {
          const storedStatus = safeGetLocalStorage(PREMIUM_STATUS_KEY);
          if (storedStatus === 'true') {
            setIsPremium(true);
            setIsLoading(false);
            return;
          }
        }
        
        // Wait for all data to load
        if (isLoadingPayments || isLoadingManual) {
          return;
        }
        
        // Check if user has any successful payment
        const hasOnlinePayment = paymentHistory && paymentHistory.some(
          payment => payment.status === 'COMPLETED'
        );
        
        // Check if user has any approved manual payment
        const hasManualPayment = manualRequests && manualRequests.some(
          request => request.status === 'APPROVED'
        );
        
        // Determine premium status - PAY ONCE, ACCESS ALL
        const hasPremiumAccess = hasOnlinePayment || hasManualPayment;
        
        // Update state
        setIsPremium(hasPremiumAccess);
        
        // Persist to localStorage if needed
        if (persist && hasPremiumAccess) {
          safeSetLocalStorage(PREMIUM_STATUS_KEY, 'true');
        }
      } catch (err) {
        console.error('Error checking premium status:', err);
        setError(err instanceof Error ? err : new Error('Failed to check premium status'));
      } finally {
        setIsLoading(false);
      }
    };
    
    checkPremiumStatus();
  }, [
    isLoadingPayments, 
    isLoadingManual, 
    paymentHistory, 
    manualRequests, 
    persist, 
    forceCheck
  ]);
  
  // Method to clear premium status (useful for testing)
  const clearPremiumStatus = useCallback(() => {
    try {
      localStorage.removeItem(PREMIUM_STATUS_KEY);
      setIsPremium(false);
      lastPremiumCheckTime = 0; // Reset the check time
    } catch (e) {
      console.error('Error clearing premium status:', e);
    }
  }, []);
  
  return {
    isPremium,
    isLoading,
    error,
    clearPremiumStatus,
    refreshPremiumStatus
  };
};

export default usePremiumStatus;