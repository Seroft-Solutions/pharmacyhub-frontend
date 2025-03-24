/**
 * Payment API Hooks
 * 
 * This file exports all payment-related hooks from various modules
 * to provide a clean API for components.
 */
import { usePremiumExamInfo } from '../manual/hooks/useManualPayment';

// Export the hook with the name that's used in the ExamContainer
export const usePremiumExamInfoQuery = usePremiumExamInfo;

// Export all manual payment hooks
export * from '../manual/hooks/useManualPayment';

// Default export
export default {
  usePremiumExamInfoQuery
};