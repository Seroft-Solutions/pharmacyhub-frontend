/**
 * Premium Access API Hooks
 *
 * Hooks for checking premium access status, implementing the "pay once, access all" feature
 */
import { useApiQuery } from '../../../core/app-api-handler';

// API endpoints for premium access
const PREMIUM_ACCESS_ENDPOINTS = {
  checkUniversalAccess: '/api/v1/payments/premium/access',
  checkExamAccess: '/api/v1/payments/exams/:examId/access'
};

/**
 * Check if user has universal premium access (pay once, access all)
 */
export const useUniversalAccessCheck = (options = {}) => {
  return useApiQuery<{ hasUniversalAccess: boolean }>(
    ['premium', 'universalAccess'],
    PREMIUM_ACCESS_ENDPOINTS.checkUniversalAccess,
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      retryDelay: 1000,
      ...options
    }
  );
};

/**
 * Check if user has access to a specific exam
 * This checks both direct access and universal access
 */
export const useExamAccessCheck = (examId: number, options = {}) => {
  return useApiQuery<{ 
    hasAccess: boolean, 
    hasDirectAccess: boolean, 
    hasUniversalAccess: boolean 
  }>(
    ['premium', 'examAccess', examId],
    PREMIUM_ACCESS_ENDPOINTS.checkExamAccess.replace(':examId', examId.toString()),
    {
      enabled: !!examId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 2,
      retryDelay: 1000,
      ...options
    }
  );
};

// Export all hooks
export const premiumAccessHooks = {
  useUniversalAccessCheck,
  useExamAccessCheck
};

export default premiumAccessHooks;