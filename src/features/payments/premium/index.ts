/**
 * Premium Access Feature
 * 
 * This feature implements the "pay once, access all" functionality
 * for premium exams in the PharmacyHub application.
 */

// Export hooks
export { default as usePremiumStatus } from './hooks/usePremiumStatus';

// Export related API hooks
export { 
  useUniversalAccessCheck, 
  useExamAccessCheck,
  premiumAccessHooks 
} from '../api/hooks/usePremiumAccessHooks';

// Export types
export interface PremiumStatusOptions {
  persist?: boolean;
  forceCheck?: boolean;
}

export interface PremiumStatusResult {
  isPremium: boolean;
  isLoading: boolean;
  error: Error | null;
  clearPremiumStatus: () => void;
  refreshPremiumStatus: () => Promise<void>;
}