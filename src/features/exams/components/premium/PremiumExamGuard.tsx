"use client"

import React, { useState, useEffect } from 'react';
import { LockIcon, UnlockIcon, DollarSignIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { PaymentFlow } from './PaymentFlow';
import { usePremiumExamInfoQuery, useCheckExamAccessMutation } from '@/features/payments/api/hooks';

interface PremiumExamGuardProps {
  examId: number;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * PremiumExamGuard
 * 
 * Component that protects premium exam content and shows a payment option
 * if the user hasn't purchased the exam
 */
export const PremiumExamGuard: React.FC<PremiumExamGuardProps> = ({
  examId,
  children,
  fallback
}) => {
  const [showPaymentFlow, setShowPaymentFlow] = useState(false);
  
  // Get premium exam info
  const { 
    data: premiumInfo,
    isLoading: isLoadingPremiumInfo,
    isError: isPremiumInfoError
  } = usePremiumExamInfoQuery(examId);
  
  // Only check access if the exam is premium
  const {
    data: accessData,
    isLoading: isLoadingAccess,
    isError: isAccessError,
    refetch: refetchAccess
  } = useCheckExamAccessMutation(
    premiumInfo?.premium ? examId : null
  );
  
  // Determine if the exam is premium and if the user has access
  const isPremium = premiumInfo?.premium || false;
  const hasAccess = accessData?.hasAccess || premiumInfo?.purchased || false;
  const isLoading = isLoadingPremiumInfo || (isPremium && isLoadingAccess);
  const isError = isPremiumInfoError || (isPremium && isAccessError);
  
  // Effect to hide payment flow when access is granted
  useEffect(() => {
    if (hasAccess && showPaymentFlow) {
      setShowPaymentFlow(false);
      toast.success('Payment Successful', {
        description: 'You now have access to this exam'
      });
    }
  }, [hasAccess, showPaymentFlow]);
  
  // Handle payment complete
  const handlePaymentComplete = () => {
    refetchAccess();
  };
  
  // If loading, show spinner
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  // If there was an error fetching premium info or access status
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          There was an error checking premium access status. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }
  
  // If exam is not premium or user has access, render children
  if (!isPremium || hasAccess) {
    return <>{children}</>;
  }
  
  // If payment flow is active, show the payment component
  if (showPaymentFlow) {
    return (
      <PaymentFlow 
        examId={examId} 
        price={2000} // Fixed price of PKR 2000
        onComplete={handlePaymentComplete}
        onCancel={() => setShowPaymentFlow(false)}
      />
    );
  }
  
  // Otherwise, show premium content paywall
  return fallback || (
    <Card className="shadow-lg border-primary/20">
      <CardHeader className="bg-primary-50 dark:bg-primary-950/50">
        <CardTitle className="flex items-center gap-2">
          <LockIcon className="h-5 w-5 text-primary" />
          Premium Content
        </CardTitle>
        <CardDescription>
          This exam requires a purchase to access
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <DollarSignIcon className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Premium Exam</h3>
          <p className="text-muted-foreground text-center max-w-md">
            This premium exam contains high-quality content to help you prepare effectively.
          </p>
          <div className="mt-2 text-2xl font-bold">
            PKR 2,000
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-center pb-6">
        <Button 
          size="lg"
          onClick={() => setShowPaymentFlow(true)}
          className="gap-2"
        >
          <UnlockIcon className="h-4 w-4" />
          Purchase Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PremiumExamGuard;
