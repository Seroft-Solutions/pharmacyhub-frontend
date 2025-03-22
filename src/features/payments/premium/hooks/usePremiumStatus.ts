/**
 * Premium Status Hook
 * 
 * This hook provides a unified way to check if a user has premium access.
 * It implements the "pay once, access all" feature by checking:
 * 1. Local storage for premium status
 * 2. Manual payment access
 * 3. Online payment access
 */
import { useState, useEffect } from 'react';
import { usePaymentHistory } from '../../api/hooks/usePaymentApiHooks';
import { useUserManualRequests } from '../../manual/api/hooks/useManualPaymentApiHooks';

// LocalStorage key
const PREMIUM_STATUS_KEY = 'pharmacyhub_premium_status';

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
 * Hook to check and manage premium status
 * Implements the "pay once, access all" feature
 */
const usePremiumStatus = (options: UsePremiumStatusOptions = {}) => {
  const { persist = true, forceCheck = false } = options;
  
  // State
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [lastChecked, setLastChecked] = useState<number>(0);
  
  // API hooks with optimized fetching
  const { 
    data: paymentHistory, 
    isLoading: isLoadingPayments,
    refetch: refetchPayments
  } = usePaymentHistory({
    // Don't fetch if we already know user has premium from localStorage
    enabled: forceCheck || localStorage.getItem(PREMIUM_STATUS_KEY) !== 'true',
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000
  });
  
  const { 
    data: manualRequests, 
    isLoading: isLoadingManual,
    refetch: refetchManual
  } = useUserManualRequests({
    // Don't fetch if we already know user has premium from localStorage
    enabled: forceCheck || localStorage.getItem(PREMIUM_STATUS_KEY) !== 'true',
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000
  });
  
  // Method to manually refresh premium status
  const refreshPremiumStatus = async () => {
    try {
      await Promise.all([
        refetchPayments(),
        refetchManual()
      ]);
      // Force a re-check
      setLastChecked(Date.now());
    } catch (err) {
      console.error('Error refreshing premium status:', err);
      setError(err instanceof Error ? err : new Error('Failed to refresh premium status'));
    }
  };
  
  // Effect to check premium status
  useEffect(() => {
    const checkPremiumStatus = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First, check localStorage if not forcing check
        if (!forceCheck) {
          const storedStatus = localStorage.getItem(PREMIUM_STATUS_KEY);
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
          localStorage.setItem(PREMIUM_STATUS_KEY, 'true');
          
          // Log for tracking
          console.log('Premium access granted and persisted to localStorage - Pay once, access all feature active');
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
    forceCheck,
    lastChecked
  ]);
  
  // Method to clear premium status (useful for testing)
  const clearPremiumStatus = () => {
    localStorage.removeItem(PREMIUM_STATUS_KEY);
    setIsPremium(false);
    setLastChecked(Date.now());
  };
  
  return {
    isPremium,
    isLoading,
    error,
    clearPremiumStatus,
    refreshPremiumStatus
  };
};

export default usePremiumStatus;