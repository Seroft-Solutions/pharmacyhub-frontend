/**
 * Payments Feature Module
 * 
 * This index file exports all components, hooks, and utilities
 * related to payments functionality.
 */

// Export API hooks
export * from './api/hooks';

// Export premium components
export { default as PremiumExamInfoProvider } from './premium/components/PremiumExamInfoProvider';
export { usePremiumExamInfo } from './premium/components/PremiumExamInfoProvider';

// Export manual payment store
export {
  useManualPaymentStore,
  default as manualPaymentStore
} from './manual/store/manualPaymentStore';

// Export manual payment hooks
export {
  useManualExamAccess,
  useManualPendingRequest,
  useUserManualPaymentRequests,
  usePremiumExamInfo as usePremiumExamInfoHook
} from './manual/hooks/useManualPayment';

// Export storage utilities
export {
  clearManualPaymentStorage,
  resetManualPaymentStore
} from './manual/utils/resetStorage';
