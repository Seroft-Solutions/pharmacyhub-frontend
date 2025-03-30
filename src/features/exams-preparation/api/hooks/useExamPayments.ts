/**
 * Exam Payments Query Hooks
 * 
 * This module provides hooks for handling exam payment operations
 * using the core API module with proper error handling.
 */
import { useApiQuery, useApiMutation } from '@/core/api/hooks';
import { examsQueryKeys } from '../utils/queryKeys';
import { ENDPOINTS } from '../constants';
import { handleExamError } from '../utils/errorHandler';

interface Payment {
  id: number;
  examId: number;
  userId: number;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  transactionId: string;
  createdAt: string;
}

interface PaymentIntent {
  clientSecret: string;
  amount: number;
}

// Payment endpoint constants
const PAYMENT_BASE = '/api/v1/payments';
const PAYMENT_ENDPOINTS = {
  INTENT: `${PAYMENT_BASE}/intent`,
  CONFIRM: `${PAYMENT_BASE}/confirm`,
};

/**
 * Hook for creating a payment intent for premium exams
 */
export const useCreatePaymentIntent = () => {
  return useApiMutation<
    PaymentIntent,
    { examId: number; amount: number }
  >(
    PAYMENT_ENDPOINTS.INTENT,
    {
      onSuccess: (_, variables, context) => {
        // After payment intent creation, no need to invalidate any queries
        // as this doesn't modify any cached data
      },
      onError: (error, variables) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          examId: variables.examId,
          action: 'create-payment-intent',
          endpoint: PAYMENT_ENDPOINTS.INTENT
        });
      }
    }
  );
};

/**
 * Hook for confirming a payment
 */
export const useConfirmPayment = () => {
  return useApiMutation<
    Payment,
    { examId: number; paymentIntentId: string }
  >(
    PAYMENT_ENDPOINTS.CONFIRM,
    {
      onSuccess: (_, variables, context) => {
        // After payment is confirmed, invalidate the exam to refresh its access status
        context?.queryClient?.invalidateQueries({
          queryKey: examsQueryKeys.detail(variables.examId)
        });
      },
      onError: (error, variables) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          examId: variables.examId,
          action: 'confirm-payment',
          endpoint: PAYMENT_ENDPOINTS.CONFIRM
        });
      }
    }
  );
};

/**
 * Hook for checking if user has access to a premium exam
 */
export const useExamAccess = (examId: number, options = {}) => {
  return useApiQuery<{ hasAccess: boolean }>(
    [...examsQueryKeys.detail(examId), 'access'],
    `${ENDPOINTS.BASE}/${examId}/access`,
    {
      onError: (error) => {
        // Use core error handling with exam-specific context
        handleExamError(error, { 
          examId,
          action: 'check-access',
          endpoint: `${ENDPOINTS.BASE}/${examId}/access`
        });
      },
      ...options
    }
  );
};
