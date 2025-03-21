/**
 * Payment API Service
 * 
 * This service provides methods for interacting with the payment API.
 */
import { 
  createExtendedApiService, 
  apiClient, 
  ApiResponse 
} from '@/features/core/tanstack-query-api';
import { PAYMENT_ENDPOINTS } from '../constants/endpoints';
import { 
  PaymentInitRequest, 
  PaymentInitResponse, 
  PaymentDTO,
  PremiumExamInfoDTO,
  PaymentMethod,
  PaymentDetails
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
 * Extended API service for payments
 * This provides a consistent API interface for payment operations
 */
export const paymentApiService = createExtendedApiService<PaymentDTO, {
  // Payment operations
  initiateExamPayment: (examId: number, method: PaymentMethod) => Promise<ApiResponse<PaymentInitResponse>>;
  checkExamAccess: (examId: number) => Promise<ApiResponse<{hasAccess: boolean}>>;
  getPaymentHistory: () => Promise<ApiResponse<PaymentDTO[]>>;
  getPaymentDetails: (transactionId: string) => Promise<ApiResponse<PaymentDetails>>;
  
  // Premium exam operations
  getPremiumExamInfo: (examId: number) => Promise<ApiResponse<PremiumExamInfoDTO>>;
}>(
  PAYMENT_ENDPOINTS.paymentHistory,
  {
    initiateExamPayment: async (examId, method) => {
      const request: PaymentInitRequest = {
        paymentMethod: method
      };
      
      return await apiClient.post<PaymentInitResponse>(
        PAYMENT_ENDPOINTS.initiateExamPayment.replace(':examId', toLongId(examId)),
        request
      );
    },
    
    checkExamAccess: async (examId) => {
      return await apiClient.get<{hasAccess: boolean}>(
        PAYMENT_ENDPOINTS.checkExamAccess.replace(':examId', toLongId(examId))
      );
    },
    
    getPaymentHistory: async () => {
      return await apiClient.get<PaymentDTO[]>(PAYMENT_ENDPOINTS.paymentHistory);
    },
    
    getPaymentDetails: async (transactionId) => {
      return await apiClient.get<PaymentDetails>(
        PAYMENT_ENDPOINTS.paymentDetails.replace(':transactionId', transactionId)
      );
    },
    
    getPremiumExamInfo: async (examId) => {
      return await apiClient.get<PremiumExamInfoDTO>(
        PAYMENT_ENDPOINTS.getPremiumExamInfo.replace(':examId', toLongId(examId))
      );
    }
  }
);

export default paymentApiService;