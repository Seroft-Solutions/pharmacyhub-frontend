/**
 * Exam Payments Hooks
 * 
 * This module provides hooks for handling exam payment operations
 * leveraging the core API module for data fetching and mutations.
 */
import { createQuery } from '@/core/api/hooks/query/useApiQuery';
import { createMutation } from '@/core/api/hooks/mutation/useApiMutation';
import { apiClient } from '@/core/api/core/apiClient';
import { handleApiError } from '@/core/api/core/error';
import { queryKeys } from '../utils';

/**
 * Payment status type
 */
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

/**
 * Payment method type
 */
export type PaymentMethod = 'credit_card' | 'bank_transfer' | 'cash' | 'voucher';

/**
 * Exam payment record
 */
export interface ExamPayment {
  id: number;
  examId: number;
  userId: number;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

/**
 * Payment creation params
 */
export interface CreatePaymentParams {
  examId: number;
  paymentMethod: PaymentMethod;
  amount?: number;
  currency?: string;
  metadata?: Record<string, any>;
}

/**
 * Payment verification params
 */
export interface VerifyPaymentParams {
  paymentId: number;
  transactionId: string;
  receiptUrl?: string;
  metadata?: Record<string, any>;
}

/**
 * Options for useExamPayments hook
 */
export interface UseExamPaymentsOptions {
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
  staleTime?: number;
}

/**
 * Hook for fetching payments for a specific exam
 */
export const useExamPayments = (examId: number | undefined, options: UseExamPaymentsOptions = {}) => {
  return createQuery<ExamPayment[]>({
    queryKey: ['exams-preparation', 'payments', 'byExam', examId],
    queryFn: async () => {
      try {
        if (!examId) throw new Error('Exam ID is required');
        const { data } = await apiClient.get(`/v1/exams-preparation/${examId}/payments`);
        return data;
      } catch (error) {
        throw handleApiError(error, {
          context: {
            feature: 'exams-preparation',
            action: 'getExamPayments',
            examId
          }
        });
      }
    },
    enabled: !!examId && (options.enabled !== false),
    ...options
  });
};

/**
 * Hook for fetching a specific payment
 */
export const usePayment = (paymentId: number | undefined, options: UseExamPaymentsOptions = {}) => {
  return createQuery<ExamPayment>({
    queryKey: ['exams-preparation', 'payments', 'detail', paymentId],
    queryFn: async () => {
      try {
        if (!paymentId) throw new Error('Payment ID is required');
        const { data } = await apiClient.get(`/v1/exams-preparation/payments/${paymentId}`);
        return data;
      } catch (error) {
        throw handleApiError(error, {
          context: {
            feature: 'exams-preparation',
            action: 'getPayment',
            paymentId
          }
        });
      }
    },
    enabled: !!paymentId && (options.enabled !== false),
    ...options
  });
};

/**
 * Hook for creating a new payment
 */
export const useCreatePayment = () => {
  return createMutation<ExamPayment, CreatePaymentParams>({
    mutationFn: async (params) => {
      try {
        const { data } = await apiClient.post('/v1/exams-preparation/payments', params);
        return data;
      } catch (error) {
        throw handleApiError(error, {
          context: {
            feature: 'exams-preparation',
            action: 'createPayment',
            examId: params.examId
          }
        });
      }
    },
    onSuccess: (_, variables, context) => {
      // Invalidate payments list for this exam
      context?.queryClient.invalidateQueries({
        queryKey: ['exams-preparation', 'payments', 'byExam', variables.examId]
      });
    }
  });
};

/**
 * Hook for verifying a payment
 */
export const useVerifyPayment = () => {
  return createMutation<ExamPayment, VerifyPaymentParams>({
    mutationFn: async (params) => {
      try {
        const { data } = await apiClient.post(
          `/v1/exams-preparation/payments/${params.paymentId}/verify`,
          params
        );
        return data;
      } catch (error) {
        throw handleApiError(error, {
          context: {
            feature: 'exams-preparation',
            action: 'verifyPayment',
            paymentId: params.paymentId
          }
        });
      }
    },
    onSuccess: (data, variables, context) => {
      // Invalidate the specific payment
      context?.queryClient.invalidateQueries({
        queryKey: ['exams-preparation', 'payments', 'detail', variables.paymentId]
      });
      
      // If we know the exam ID, invalidate its payments list
      if (data?.examId) {
        context?.queryClient.invalidateQueries({
          queryKey: ['exams-preparation', 'payments', 'byExam', data.examId]
        });
      }
    }
  });
};
