import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCheckExamAccess } from '@/features/payments/api/hooks/usePaymentApiHooks';
import { useCheckManualExamAccess } from '@/features/payments/manual/api/hooks/useManualPaymentApiHooks';
import { usePremiumExamInfo } from '@/features/payments/api/hooks/usePaymentApiHooks';

/**
 * Custom hook to check if a user has access to a premium exam
 * and redirect them to payment page if not
 * 
 * @param examId The ID of the exam to check
 * @param redirectIfNotPaid Whether to redirect to payment page if not paid (default: true)
 * @returns Object with hasAccess and isLoading states
 */
export const usePremiumExam = (examId: number, redirectIfNotPaid = true) => {
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // API Hooks
  const { data: examAccessData, isLoading: isLoadingAccess } = useCheckExamAccess(examId);
  const { data: manualAccessData, isLoading: isLoadingManualAccess } = useCheckManualExamAccess(examId);
  const { data: examInfoData, isLoading: isLoadingExamInfo } = usePremiumExamInfo(examId);
  
  useEffect(() => {
    const checkAccess = async () => {
      // Wait for all access checks to complete
      if (isLoadingAccess || isLoadingManualAccess || isLoadingExamInfo) {
        return;
      }
      
      // If this is not a premium exam, always allow access
      if (examInfoData && !examInfoData.premium) {
        setHasAccess(true);
        setIsLoading(false);
        return;
      }
      
      // Check if user has access through any payment method
      const hasOnlineAccess = examAccessData?.hasAccess || false;
      const hasManualAccess = manualAccessData?.hasAccess || false;
      const accessGranted = hasOnlineAccess || hasManualAccess;
      
      setHasAccess(accessGranted);
      setIsLoading(false);
      
      // Redirect to payment page if not paid and redirectIfNotPaid is true
      if (!accessGranted && redirectIfNotPaid) {
        router.push(`/payments/pending?examId=${examId}`);
      }
    };
    
    checkAccess();
  }, [
    examId, 
    router, 
    redirectIfNotPaid, 
    examAccessData, 
    manualAccessData, 
    examInfoData,
    isLoadingAccess,
    isLoadingManualAccess,
    isLoadingExamInfo
  ]);
  
  return { hasAccess, isLoading };
};

export default usePremiumExam;