/**
 * Payment Hooks
 * 
 * This module provides hooks for managing payments for premium exams.
 * It leverages the core API module for data fetching and mutations.
 */
import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';
import { useApiMutation } from '@/core/api/hooks/mutation/useApiMutation';
import { PAYMENT_ENDPOINTS } from '../constants/endpoints';
import { examsQueryKeys } from '../utils/queryKeys';
import { AccessCheckResponse } from '../../types';

/**
 * Response interface for payment intent creation
 */
export interface PaymentIntentResponse {
  clientSecret: string;
  amount: number;
  currency: string;
  examId: number;
}

/**
 * Payload for creating a payment intent
 */
export interface CreatePaymentIntentPayload {
  examId: number;
}

/**
 * Payload for confirming a payment
 */
export interface ConfirmPaymentPayload {
  examId: number;
  paymentIntentId: string;
}

/**
 * Hook for checking if a user has access to a premium exam
 * 
 * @param examId ID of the exam to check access for
 * @param options Query options
 * @returns TanStack Query result with access information
 */
export function useExamAccessQuery(examId: number | undefined, options = {}) {
  return useApiQuery<AccessCheckResponse>(
    [...examsQueryKeys.detail(examId as number), 'access'],
    examId ? `${PAYMENT_ENDPOINTS.CREATE_INTENT(examId)}/access` : '',
    {
      enabled: !!examId,
      ...options
    }
  );
}

/**
 * Hook for creating a payment intent for a premium exam
 * 
 * @returns TanStack Mutation hook for creating payment intents
 */
export function useCreatePaymentIntentMutation() {
  return useApiMutation<PaymentIntentResponse, CreatePaymentIntentPayload>(
    ({ examId }) => PAYMENT_ENDPOINTS.CREATE_INTENT(examId),
    {
      method: 'POST'
    }
  );
}

/**
 * Hook for confirming a payment
 * 
 * @returns TanStack Mutation hook for confirming payments
 */
export function useConfirmPaymentMutation() {
  return useApiMutation<void, ConfirmPaymentPayload>(
    ({ examId }) => PAYMENT_ENDPOINTS.CONFIRM(examId),
    {
      method: 'POST',
      onSuccess: (_, variables, context) => {
        // Invalidate the access check query
        context?.queryClient.invalidateQueries({
          queryKey: [...examsQueryKeys.detail(variables.examId), 'access'],
        });
      }
    }
  );
}
