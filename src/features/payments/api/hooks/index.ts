import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PaymentMethod, PremiumExamInfoDTO } from '../../types';
import { paymentApiService } from '../services/paymentApiService';

// Premium Exam Info Query
export const usePremiumExamInfoQuery = (examId: number | null) => {
  return useQuery({
    queryKey: ['premiumExamInfo', examId],
    queryFn: () => {
      if (!examId) {
        throw new Error('Exam ID is required');
      }
      return paymentApiService.getPremiumExamInfo(examId)
        .then(response => response.data);
    },
    enabled: !!examId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Check Exam Access Mutation
export const useCheckExamAccessMutation = (examId: number | null) => {
  return useQuery({
    queryKey: ['examAccess', examId],
    queryFn: () => {
      if (!examId) {
        throw new Error('Exam ID is required');
      }
      return paymentApiService.checkExamAccess(examId)
        .then(response => response.data);
    },
    enabled: !!examId,
    staleTime: 1000 * 60, // 1 minute
  });
};

// Initiate Exam Payment Mutation
export const useInitiateExamPaymentMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ examId, method }: { examId: number, method: PaymentMethod }) => {
      return paymentApiService.initiateExamPayment(examId, method)
        .then(response => response.data);
    },
    onSuccess: (_, variables) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['examAccess', variables.examId] });
      queryClient.invalidateQueries({ queryKey: ['premiumExamInfo', variables.examId] });
    },
  });
};

// Get Payment History Query
export const usePaymentHistoryQuery = () => {
  return useQuery({
    queryKey: ['paymentHistory'],
    queryFn: () => paymentApiService.getPaymentHistory()
      .then(response => response.data),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

// Get Payment Details Query
export const usePaymentDetailsQuery = (transactionId: string | null) => {
  return useQuery({
    queryKey: ['paymentDetails', transactionId],
    queryFn: () => {
      if (!transactionId) {
        throw new Error('Transaction ID is required');
      }
      return paymentApiService.getPaymentDetails(transactionId)
        .then(response => response.data);
    },
    enabled: !!transactionId,
  });
};

export default {
  usePremiumExamInfoQuery,
  useCheckExamAccessMutation,
  useInitiateExamPaymentMutation,
  usePaymentHistoryQuery,
  usePaymentDetailsQuery,
};
