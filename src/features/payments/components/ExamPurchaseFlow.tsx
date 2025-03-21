'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ExamPaper } from '@/features/exams/types/StandardTypes';
import { useInitiateExamPayment } from '../api/hooks/usePaymentApiHooks';
import { useCheckPendingManualRequest, useCheckManualExamAccess } from '../manual/api/hooks/useManualPaymentApiHooks';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { PaymentMethod } from '../types';

interface ExamPurchaseFlowProps {
  exam: ExamPaper;
  onStart?: (examId: number) => void;
}

export const ExamPurchaseFlow: React.FC<ExamPurchaseFlowProps> = ({ exam, onStart }) => {
  const router = useRouter();
  
  const { mutate: initiatePayment, isLoading: isInitiating } = useInitiateExamPayment(exam.id as number);
  const { 
    data: pendingData, 
    isLoading: isCheckingPending, 
    refetch: refetchPendingStatus,
    isError: isPendingError 
  } = useCheckPendingManualRequest(exam.id as number, {
    staleTime: 10 * 1000, // 10 seconds
    retry: 2,
    retryDelay: 1000
  });
  const { 
    data: manualAccessData, 
    isLoading: isCheckingManualAccess, 
    refetch: refetchAccessStatus,
    isError: isAccessError 
  } = useCheckManualExamAccess(exam.id as number, {
    staleTime: 10 * 1000, // 10 seconds
    retry: 2,
    retryDelay: 1000
  });
  
  // Track if initial loading has completed
  const initialLoadRef = useRef(false);
  
  // Force an immediate refresh when component mounts
  useEffect(() => {
    const fetchLatestStatus = async () => {
      try {
        await Promise.all([
          refetchPendingStatus(),
          refetchAccessStatus()
        ]);
        initialLoadRef.current = true;
      } catch (error) {
        console.error('Error refreshing status:', error);
        initialLoadRef.current = true;
      }
    };
    
    if (!initialLoadRef.current) {
      fetchLatestStatus();
    }
  }, [refetchPendingStatus, refetchAccessStatus]);
  
  const hasPendingRequest = pendingData?.hasPending;
  const hasManualAccess = manualAccessData?.hasAccess;
  
  const handlePurchase = () => {
    // Store exam ID in sessionStorage to ensure it's available on the payment page
    if (typeof window !== 'undefined' && exam?.id) {
      sessionStorage.setItem('paymentExamId', String(exam.id));
      sessionStorage.setItem('paymentExamTitle', exam.title || 'Premium Paper');
      sessionStorage.setItem('paymentExamPrice', String(exam.price || 2000));
    }
    
    // Direct to manual payment form
    router.push(`/payments/manual/${exam.id}`);
  };
  
  const handleViewPendingStatus = () => {
    router.push(`/payments/pending?examId=${exam.id}`);
  };
  
  const handleStart = () => {
    if (onStart) {
      onStart(exam.id as number);
    } else {
      router.push(`/exam/${exam.id}`);
    }
  };
  
  // If the exam is purchased or has approved manual payment
  if (exam.purchased || hasManualAccess) {
    return (
      <Button onClick={handleStart} className="w-full" variant="default">
        Start Exam
      </Button>
    );
  }
  
  // If there's a pending manual payment request
  if (hasPendingRequest) {
    return (
      <Button onClick={handleViewPendingStatus} className="w-full" variant="outline">
        View Payment Status
      </Button>
    );
  }
  
  // If still checking status
  if (isCheckingPending || isCheckingManualAccess) {
    return (
      <Button disabled className="w-full">
        <Spinner className="mr-2" size="sm" />
        {isCheckingPending ? "Verifying payment status..." : "Checking access..."}
      </Button>
    );
  }
  
  // Handle errors - show only Purchase Access button
  if (isPendingError || isAccessError) {
    return (
      <Button 
        onClick={handlePurchase} 
        className="w-full" 
        variant="default"
      >
        Purchase Access Now
      </Button>
    );
  }
  
  // Default case: allow purchase
  return (
    <Button 
      onClick={handlePurchase} 
      className="w-full" 
      variant="default"
      disabled={isInitiating}
    >
      {isInitiating ? (
        <>
          <Spinner className="mr-2" size="sm" />
          Processing...
        </>
      ) : (
        "Purchase Access"
      )}
    </Button>
  );
};