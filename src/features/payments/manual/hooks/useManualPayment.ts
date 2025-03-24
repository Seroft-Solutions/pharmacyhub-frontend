/**
 * Manual Payment Hooks
 * 
 * Custom hooks for using the manual payment store.
 * These hooks replace direct API calls with store-based state management
 * to prevent request loops and improve performance.
 */
import { useEffect, useRef } from 'react';
import { useManualPaymentStore, 
  selectExamAccess, 
  selectIsLoadingExamAccess,
  selectPendingRequest,
  selectIsLoadingPendingRequest
} from '../store/manualPaymentStore';

/**
 * Hook for checking if a user has access to a premium exam
 * Replaces direct API calls with cached store data
 */
export const useManualExamAccess = (examId: number) => {
  const store = useManualPaymentStore();
  const hasAccess = useManualPaymentStore(selectExamAccess(examId));
  const isLoading = useManualPaymentStore(selectIsLoadingExamAccess(examId));
  const hasFetched = useRef(false);
  
  // Effect for initial data loading - with fetch tracking to prevent loops
  useEffect(() => {
    // Only fetch if we don't have a cached value and haven't tried fetching yet
    if (!(examId in store.examAccessMap) && !hasFetched.current) {
      hasFetched.current = true;
      store.checkManualExamAccess(examId);
    }
  }, [examId, store]);
  
  return {
    hasAccess,
    isLoading,
    refetch: () => {
      hasFetched.current = true;
      return store.checkManualExamAccess(examId);
    }
  };
};

/**
 * Hook for checking if a user has a pending payment request for an exam
 * Replaces direct API calls with cached store data
 */
export const useManualPendingRequest = (examId: number) => {
  const store = useManualPaymentStore();
  const hasPending = useManualPaymentStore(selectPendingRequest(examId));
  const isLoading = useManualPaymentStore(selectIsLoadingPendingRequest(examId));
  const hasFetched = useRef(false);
  
  // Effect for initial data loading - with fetch tracking to prevent loops
  useEffect(() => {
    // Only fetch if we don't have a cached value and haven't tried fetching yet
    if (!(examId in store.pendingRequestMap) && !hasFetched.current) {
      hasFetched.current = true;
      store.checkPendingManualRequest(examId);
    }
  }, [examId, store]);
  
  return {
    hasPending,
    isLoading,
    refetch: () => {
      hasFetched.current = true;
      return store.checkPendingManualRequest(examId);
    }
  };
};

/**
 * Hook for accessing user's manual payment requests
 */
export const useUserManualPaymentRequests = () => {
  const store = useManualPaymentStore();
  const requests = store.userRequests;
  const isLoading = store.isLoadingUserRequests;
  const error = store.userRequestsError;
  const hasFetched = useRef(false);
  
  // Effect for initial data loading - with fetch tracking to prevent loops
  useEffect(() => {
    if (requests.length === 0 && !hasFetched.current) {
      hasFetched.current = true;
      store.fetchUserManualRequests();
    }
  }, [store, requests.length]);
  
  return {
    requests,
    isLoading,
    error,
    refetch: () => {
      hasFetched.current = true;
      return store.fetchUserManualRequests();
    }
  };
};

/**
 * Comprehensive hook for premium exam information
 * Combines access and pending request status
 */
export const usePremiumExamInfo = (examId: number) => {
  const { hasAccess, isLoading: isLoadingAccess, refetch: refetchAccess } = useManualExamAccess(examId);
  const { hasPending, isLoading: isLoadingPending, refetch: refetchPending } = useManualPendingRequest(examId);
  
  return {
    data: {
      premium: true, // Assume all exams using this hook are premium
      hasAccess,
      hasPending
    },
    isLoading: isLoadingAccess || isLoadingPending,
    refetch: () => {
      refetchAccess();
      refetchPending();
    }
  };
};

export default {
  useManualExamAccess,
  useManualPendingRequest,
  useUserManualPaymentRequests,
  usePremiumExamInfo
};