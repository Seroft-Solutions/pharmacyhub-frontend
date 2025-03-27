/**
 * Manual Payment API Hooks
 * 
 * Custom React Query hooks for manual payment operations
 */
import { UseMutationResult, UseQueryResult } from '@tanstack/react-query';
import { useApiMutation, useApiQuery } from '@/features/core/tanstack-query-api';
import { MANUAL_PAYMENT_ENDPOINTS } from '../constants/endpoints';
import { 
  ManualPaymentSubmitRequest, 
  ManualPaymentProcessRequest, 
  ManualPaymentResponseDTO
} from '../../types';

/**
 * Utility function to ensure IDs are properly converted to long integers
 * This is important because the Java backend expects Long type parameters
 */
const toLongId = (id: number | string): string => {
  // Parse the ID to an integer and convert back to string to ensure valid long format
  return String(parseInt(id.toString()));
};

/**
 * Hook for submitting a manual payment request
 */
export const useSubmitManualPayment = (): UseMutationResult<
  ManualPaymentResponseDTO, 
  Error, 
  ManualPaymentSubmitRequest, 
  unknown
> => {
  return useApiMutation<ManualPaymentResponseDTO, ManualPaymentSubmitRequest>(
    MANUAL_PAYMENT_ENDPOINTS.submitRequest,
    {
      onSuccess: (data) => {
        console.log('Payment submitted successfully:', data);
      },
      onError: (error) => {
        console.error('Payment submission failed:', error);
      }
    }
  );
};

/**
 * Hook for getting user's manual payment requests
 */
export const useUserManualRequests = (): UseQueryResult<ManualPaymentResponseDTO[], Error> => {
  return useApiQuery<ManualPaymentResponseDTO[]>(
    ['payment', 'manual', 'requests'],
    MANUAL_PAYMENT_ENDPOINTS.getUserRequests
  );
};

/**
 * Hook for checking manual exam access
 */
export const useCheckManualExamAccess = (examId: number, options = {}): UseQueryResult<{hasAccess: boolean}, Error> => {
  const endpoint = MANUAL_PAYMENT_ENDPOINTS.checkExamAccess.replace(':examId', toLongId(examId));
  
  return useApiQuery<{hasAccess: boolean}>(
    ['payment', 'manual', 'access', examId],
    endpoint,
    {
      staleTime: 60000, // 1 minute
      enabled: !!examId,
      ...options
    }
  );
};

/**
 * Hook for checking pending manual requests
 */
export const useCheckPendingManualRequest = (examId: number, options = {}): UseQueryResult<{hasPending: boolean}, Error> => {
  const endpoint = MANUAL_PAYMENT_ENDPOINTS.checkPendingRequest.replace(':examId', toLongId(examId));
  
  return useApiQuery<{hasPending: boolean}>(
    ['payment', 'manual', 'pending', examId],
    endpoint,
    {
      staleTime: 60000, // 1 minute
      enabled: !!examId,
      ...options
    }
  );
};

/**
 * Hook for getting all manual payment requests (admin)
 */
export const useAllManualRequests = (): UseQueryResult<ManualPaymentResponseDTO[], Error> => {
  return useApiQuery<ManualPaymentResponseDTO[]>(
    ['payment', 'manual', 'admin', 'all'],
    MANUAL_PAYMENT_ENDPOINTS.getAllRequests,
    {
      staleTime: 60000, // 1 minute
      refetchOnWindowFocus: true
    }
  );
};

/**
 * Hook for getting manual payment requests by status (admin)
 */
export const useManualRequestsByStatus = (status: string): UseQueryResult<ManualPaymentResponseDTO[], Error> => {
  const endpoint = MANUAL_PAYMENT_ENDPOINTS.getRequestsByStatus.replace(':status', status);
  
  return useApiQuery<ManualPaymentResponseDTO[]>(
    ['payment', 'manual', 'admin', 'status', status],
    endpoint,
    {
      enabled: !!status
    }
  );
};

/**
 * Hook for approving a manual payment request (admin)
 */
export const useApproveManualRequest = (): UseMutationResult<
  ManualPaymentResponseDTO, 
  Error, 
  { requestId: number, request: ManualPaymentProcessRequest }, 
  unknown
> => {
  return useApiMutation<ManualPaymentResponseDTO, { requestId: number, request: ManualPaymentProcessRequest }>(
    (variables) => MANUAL_PAYMENT_ENDPOINTS.approveRequest.replace(':requestId', toLongId(variables.requestId)),
    {
      onSuccess: (data) => {
        console.log('Payment request approved successfully:', data);
      },
      onError: (error) => {
        console.error('Payment request approval failed:', error);
      }
    }
  );
};

/**
 * Hook for rejecting a manual payment request (admin)
 */
export const useRejectManualRequest = (): UseMutationResult<
  ManualPaymentResponseDTO, 
  Error, 
  { requestId: number, request: ManualPaymentProcessRequest }, 
  unknown
> => {
  return useApiMutation<ManualPaymentResponseDTO, { requestId: number, request: ManualPaymentProcessRequest }>(
    (variables) => MANUAL_PAYMENT_ENDPOINTS.rejectRequest.replace(':requestId', toLongId(variables.requestId)),
    {
      onSuccess: (data) => {
        console.log('Payment request rejected successfully:', data);
      },
      onError: (error) => {
        console.error('Payment request rejection failed:', error);
      }
    }
  );
};

/**
 * Export all hooks together
 */
export const manualPaymentApiHooks = {
  useSubmitManualPayment,
  useUserManualRequests,
  useCheckManualExamAccess,
  useCheckPendingManualRequest,
  useAllManualRequests,
  useManualRequestsByStatus,
  useApproveManualRequest,
  useRejectManualRequest
};

export default manualPaymentApiHooks;