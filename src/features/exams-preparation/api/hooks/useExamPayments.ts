/**
 * Exam Payment Hooks
 * 
 * This module provides hooks for managing payments for premium exams.
 */

import { createQueryHook, createMutationHook } from './hookFactory';
import { paymentService } from '../services';
import { API_ENDPOINTS } from '../constants';
import { apiClient } from '@/core/api';

/**
 * Interface for payment status response
 */
interface PaymentStatus {
  examId: number;
  isPremium: boolean;
  hasAccess: boolean;
  universalAccess: boolean;
  purchaseDate?: string;
  expiryDate?: string;
}

/**
 * Interface for payment checkout response
 */
interface PaymentCheckout {
  paymentId: string;
  checkoutUrl: string;
  amount: number;
  currency: string;
  examId: number;
}

/**
 * Hook for checking payment status for an exam
 */
export const useExamPayments = (examId: number) => {
  const { 
    data, 
    isLoading, 
    error,
    refetch 
  } = createQueryHook<PaymentStatus, number>(
    'paymentStatus',
    async (id) => {
      return paymentService.getPaymentStatus(id);
    }
  )(examId);
  
  return {
    hasAccess: data?.hasAccess || false,
    universalAccess: data?.universalAccess || false,
    isPremiumContent: data?.isPremium || false,
    purchaseDate: data?.purchaseDate,
    expiryDate: data?.expiryDate,
    isLoading,
    error: error?.message,
    refetchStatus: refetch,
  };
};

/**
 * Hook for initiating a payment checkout
 */
export const useInitiateCheckout = createMutationHook<
  PaymentCheckout,
  number
>(
  async (examId) => {
    const { data } = await apiClient.post(API_ENDPOINTS.PAYMENT_CHECKOUT(examId));
    return data;
  }
);

/**
 * Hook for checking if a user has universal access
 */
export const useUniversalAccess = createQueryHook<boolean, void>(
  'universalAccess',
  async () => {
    return paymentService.checkUniversalAccess();
  },
  {
    staleTime: 15 * 60 * 1000, // 15 minutes
  }
);

/**
 * Hook for fetching all purchased exams
 */
export const usePurchasedExams = createQueryHook<number[], void>(
  'purchasedExams',
  async () => {
    return paymentService.getPurchasedExams();
  }
);
