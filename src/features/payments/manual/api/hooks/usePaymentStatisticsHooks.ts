/**
 * Payment Statistics API Hooks
 * 
 * Custom React Query hooks for payment statistics and analytics
 */
import { UseQueryResult } from '@tanstack/react-query';
import { useApiQuery } from '../../../../core/app-api-handler';
import { MANUAL_PAYMENT_ENDPOINTS } from '../constants/endpoints';

export interface PaymentStatistics {
  totalUsers: number;
  paidUsers: number;
  totalAmountCollected: number;
  recentPayments: number;
  approvalRate: number;
}

export interface PaymentHistorySummary {
  approved: number;
  rejected: number;
  pending: number;
  totalAmount: number;
}

/**
 * Hook for getting payment statistics
 */
export const usePaymentStatistics = (): UseQueryResult<PaymentStatistics, Error> => {
  return useApiQuery<PaymentStatistics>(
    ['payment', 'statistics'],
    MANUAL_PAYMENT_ENDPOINTS.getStatistics,
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
      // Fallback data for development
      placeholderData: {
        totalUsers: 567,
        paidUsers: 231,
        totalAmountCollected: 45678,
        recentPayments: 43,
        approvalRate: 92
      }
    }
  );
};

/**
 * Hook for getting payment history summary
 */
export const usePaymentHistorySummary = (): UseQueryResult<PaymentHistorySummary, Error> => {
  return useApiQuery<PaymentHistorySummary>(
    ['payment', 'history', 'summary'],
    MANUAL_PAYMENT_ENDPOINTS.getHistorySummary,
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true,
      // Fallback data for development
      placeholderData: {
        approved: 143,
        rejected: 27,
        pending: 12,
        totalAmount: 67890
      }
    }
  );
};

/**
 * Export all hooks together
 */
export const paymentStatisticsHooks = {
  usePaymentStatistics,
  usePaymentHistorySummary
};

export default paymentStatisticsHooks;