'use client';

import React, { createContext, useContext, useMemo, useRef } from 'react';
import { usePremiumExamInfoQuery } from '../../api/hooks';

// Define the context type
interface PremiumExamInfoContextType {
  isPremium: boolean;
  hasAccess: boolean;
  hasPending: boolean;
  isLoading: boolean;
  refetch: () => void;
}

// Create context with default values
const PremiumExamInfoContext = createContext<PremiumExamInfoContextType>({
  isPremium: false,
  hasAccess: false,
  hasPending: false,
  isLoading: false,
  refetch: () => {}
});

// Provider props type
interface PremiumExamInfoProviderProps {
  examId: number;
  children: React.ReactNode;
}

/**
 * Premium Exam Info Provider Component
 * 
 * This component provides premium exam information (isPremium, hasAccess, etc.)
 * to all child components through context, eliminating the need for multiple
 * hooks and API calls in different components.
 * 
 * Fixed to prevent excessive rerenders and API calls.
 */
export const PremiumExamInfoProvider: React.FC<PremiumExamInfoProviderProps> = ({ 
  examId,
  children 
}) => {
  // Keep track of whether we've already fetched the data
  const hasFetchedRef = useRef(false);
  
  // Get premium status from localStorage first
  const cachedPremium = useMemo(() => {
    try {
      return localStorage.getItem('pharmacyhub_premium_status') === 'true';
    } catch (e) {
      return false;
    }
  }, []);
  
  // Use our optimized hook from the Zustand store
  // Skip the API call if we already know the user has premium access
  const { data, isLoading, refetch } = usePremiumExamInfoQuery(examId, {
    enabled: !cachedPremium && !hasFetchedRef.current
  });
  
  // Mark as fetched after the first API call
  if (!hasFetchedRef.current && !isLoading) {
    hasFetchedRef.current = true;
  }
  
  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => {
    // If we have cached premium status, use that
    if (cachedPremium) {
      return {
        isPremium: true,
        hasAccess: true,
        hasPending: false,
        isLoading: false,
        refetch
      };
    }
    
    // Otherwise use API data
    return {
      isPremium: !!data?.premium,
      hasAccess: !!data?.hasAccess,
      hasPending: !!data?.hasPending,
      isLoading,
      refetch
    };
  }, [data, isLoading, refetch, cachedPremium]);
  
  return (
    <PremiumExamInfoContext.Provider value={contextValue}>
      {children}
    </PremiumExamInfoContext.Provider>
  );
};

/**
 * Hook to use premium exam information from context
 */
export const usePremiumExamInfo = () => useContext(PremiumExamInfoContext);

export default PremiumExamInfoProvider;