import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { usePremiumExamInfoQuery, useCheckExamAccessMutation, useInitiateExamPaymentMutation } from '../api/hooks';
import { PaymentMethod } from '../types';

interface PremiumExamInfoDTO {
  examId: number;
  premium: boolean;
  price: number;
  customPrice: boolean;
  purchased: boolean;
}

interface PaymentInitResponse {
  paymentId: number;
  transactionId: string;
  redirectUrl: string;
  formParameters: Record<string, string>;
}

interface PremiumExamHookResult {
  isPremium: boolean;
  isPurchased: boolean;
  price: number;
  isCustomPrice: boolean;
  isLoading: boolean;
  isProcessingPayment: boolean;
  error: Error | null;
  accessError: Error | null;
  hasAccess: boolean;
  openPaymentModal: () => void;
  closePaymentModal: () => void;
  isPaymentModalOpen: boolean;
  initiatePayment: (paymentMethod: PaymentMethod) => void;
  paymentRedirectUrl: string | null;
}

export const usePremiumExam = (examId: number): PremiumExamHookResult => {
  const router = useRouter();
  
  // State for payment modal
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [paymentRedirectUrl, setPaymentRedirectUrl] = useState<string | null>(null);

  // Get premium exam info
  const { 
    data: examInfo, 
    isLoading: isLoadingInfo, 
    error: examError 
  } = usePremiumExamInfoQuery(examId);
  
  // Check exam access
  const {
    data: accessData,
    isLoading: isLoadingAccess,
    error: accessError
  } = useCheckExamAccessMutation(examId);
  
  // Initiate payment mutation
  const { 
    mutate: initiatePaymentMutation,
    isLoading: isProcessingPayment 
  } = useInitiateExamPaymentMutation();
  
  // Helper to open payment modal
  const openPaymentModal = useCallback(() => {
    setIsPaymentModalOpen(true);
  }, []);
  
  // Helper to close payment modal
  const closePaymentModal = useCallback(() => {
    setIsPaymentModalOpen(false);
  }, []);
  
  // Helper to initiate payment
  const initiatePayment = useCallback((paymentMethod: PaymentMethod) => {
    initiatePaymentMutation({ examId, method: paymentMethod }, {
      onSuccess: (data) => {
        // Store the redirect URL
        setPaymentRedirectUrl(data.redirectUrl);
        
        // Close the modal
        closePaymentModal();
        
        // If we have a redirect URL, open it in a new tab
        if (data.redirectUrl) {
          window.open(data.redirectUrl, '_blank');
          
          // Show a toast to the user
          toast.success('Please complete the payment in the new tab.');
          
          // Redirect to a payment pending page if available
          router.push(`/dashboard/payments/pending/${examId}`);
        } 
        // If we have form parameters, create a form and submit it
        else if (data.formParameters && Object.keys(data.formParameters).length > 0) {
          const form = document.createElement('form');
          form.method = 'POST';
          form.action = data.redirectUrl || window.location.href;
          form.target = '_blank';
          
          // Add all parameters as hidden fields
          Object.entries(data.formParameters).forEach(([key, value]) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            form.appendChild(input);
          });
          
          // Submit the form
          document.body.appendChild(form);
          form.submit();
          document.body.removeChild(form);
          
          // Show a toast to the user
          toast.success('Please complete the payment in the new window.');
        }
      },
      onError: (error) => {
        toast.error(`Payment initiation failed: ${error.message}`);
      }
    });
  }, [examId, initiatePaymentMutation, closePaymentModal, router]);
  
  return {
    isPremium: examInfo?.premium || false,
    isPurchased: examInfo?.purchased || false,
    price: examInfo?.price || 0,
    isCustomPrice: examInfo?.customPrice || false,
    isLoading: isLoadingInfo || isLoadingAccess,
    isProcessingPayment,
    error: examError,
    accessError,
    hasAccess: accessData?.hasAccess || false,
    openPaymentModal,
    closePaymentModal,
    isPaymentModalOpen,
    initiatePayment,
    paymentRedirectUrl
  };
};