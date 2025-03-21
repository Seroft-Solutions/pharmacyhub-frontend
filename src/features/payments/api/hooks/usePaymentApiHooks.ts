/**
 * Payment API Hooks
 * 
 * Custom React Query hooks for payment operations
 */
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useApiMutation, useApiQuery } from '@/features/core/tanstack-query-api';
import { PAYMENT_ENDPOINTS } from '../constants/endpoints';
import { 
  PaymentInitRequest, 
  PaymentInitResponse, 
  PaymentDTO,
  PaymentMethod,
  PaymentDetails,
  PremiumExamInfoDTO
} from '../../types';

/**
 * Utility function to ensure IDs are properly converted to numbers
 * This is important because the Java backend expects Long type parameters
 */
const toLongId = (id: number | string): string => {
  // Parse the ID to an integer and convert back to string to ensure valid long format
  return String(parseInt(id.toString()));
};

/**
 * Hook for initiating exam payment
 */
export const useInitiateExamPayment = (examId: number): UseMutationResult<
  PaymentInitResponse, 
  Error, 
  PaymentMethod, 
  unknown
> => {
  return useApiMutation<PaymentInitResponse, PaymentMethod>(
    ['payment', 'initiate', examId],
    async (method) => {
      const request: PaymentInitRequest = {
        paymentMethod: method
      };
      
      // Ensure examId is properly formatted and URL is a string
      const url = String(PAYMENT_ENDPOINTS.initiateExamPayment).replace(':examId', toLongId(examId));
      return { method: 'POST', url, data: request };
    },
    {
      // Options
      retry: 1,
      onError: (error) => {
        console.error('Payment initiation failed:', error);
      }
    }
  );
};

/**
 * Hook for checking exam access
 */
export const useCheckExamAccess = (examId: number): UseQueryResult<{hasAccess: boolean}, Error> => {
  return useApiQuery<{hasAccess: boolean}>(
    ['payment', 'access', examId],
    {
      url: String(PAYMENT_ENDPOINTS.checkExamAccess).replace(':examId', toLongId(examId)),
      method: 'GET'
    },
    {
      // Options
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true
    }
  );
};

/**
 * Hook for getting payment history
 */
export const usePaymentHistory = (): UseQueryResult<PaymentDTO[], Error> => {
  return useApiQuery<PaymentDTO[]>(
    ['payment', 'history'],
    {
      url: PAYMENT_ENDPOINTS.paymentHistory,
      method: 'GET'
    },
    {
      // Options
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: true
    }
  );
};

/**
 * Hook for getting payment details
 */
export const usePaymentDetails = (transactionId: string): UseQueryResult<PaymentDetails, Error> => {
  return useApiQuery<PaymentDetails>(
    ['payment', 'details', transactionId],
    {
      url: String(PAYMENT_ENDPOINTS.paymentDetails).replace(':transactionId', transactionId),
      method: 'GET'
    },
    {
      // Options
      retry: 2,
      enabled: !!transactionId
    }
  );
};

/**
 * Hook for getting premium exam info
 */
export const usePremiumExamInfo = (examId: number): UseQueryResult<PremiumExamInfoDTO, Error> => {
  return useApiQuery<PremiumExamInfoDTO>(
    ['payment', 'premium-info', examId],
    {
      url: String(PAYMENT_ENDPOINTS.getPremiumExamInfo).replace(':examId', toLongId(examId)),
      method: 'GET'
    },
    {
      // Options
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
      enabled: !!examId
    }
  );
};

/**
 * Export all hooks together for convenience
 */
export const paymentApiHooks = {
  useInitiateExamPayment,
  useCheckExamAccess,
  usePaymentHistory,
  usePaymentDetails,
  usePremiumExamInfo
};

export default paymentApiHooks;