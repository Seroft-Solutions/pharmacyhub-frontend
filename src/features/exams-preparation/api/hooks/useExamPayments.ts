/**
 * Exam Payments Query Hooks
 * 
 * This module provides hooks for handling exam payment operations
 * using the core API module.
 */
import { useApiQuery, useApiMutation } from '@/core/api/hooks';
import { examsQueryKeys } from '../utils/queryKeys';
import { API_ENDPOINTS } from '../constants';

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

/**
 * Hook for creating a payment intent for premium exams
 */
export const useCreatePaymentIntent = () => {
  return useApiMutation<
    PaymentIntent,
    { examId: number; amount: number }
  >(
    // Assuming there's a payment endpoint
    '/api/v1/payments/intent',
    {
      onSuccess: (_, variables, context) => {
        // After payment intent creation, no need to invalidate any queries
        // as this doesn't modify any cached data
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
    // Assuming there's a payment confirmation endpoint
    '/api/v1/payments/confirm',
    {
      onSuccess: (_, variables, context) => {
        // After payment is confirmed, invalidate the exam to refresh its access status
        context?.queryClient?.invalidateQueries({
          queryKey: examsQueryKeys.detail(variables.examId)
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
    `/api/v1/exams-preparation/${examId}/access`,
    options
  );
};
