/**
 * Exam Payments Query Hooks
 * 
 * This module provides hooks for handling exam payment operations
 * using the core API hooks factory.
 */
import { useApiQuery, useApiMutation } from '@/core/api/hooks';
import { examsApiHooks } from '../services/apiHooksFactory';

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
    PAYMENT_ENDPOINTS.INTENT
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
        context?.queryClient.invalidateQueries({
          queryKey: examsApiHooks.queryKeys.detail(variables.examId)
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
    [...examsApiHooks.queryKeys.detail(examId), 'access'],
    `/api/v1/exams-preparation/${examId}/access`,
    options
  );
};
