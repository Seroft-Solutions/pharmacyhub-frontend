'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ManualPaymentForm } from '@/features/payments/manual/components/ManualPaymentForm';
import { useExamById } from '@/features/exams/api/hooks/useExamHooks';
import { useCheckPendingManualRequest } from '@/features/payments/manual/api/hooks/useManualPaymentApiHooks';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';

export default function ManualPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const examId = parseInt(params.examId as string);
  
  const { data: exam, isLoading: isLoadingExam } = useExamById(examId);
  const { data: pendingData, isLoading: isCheckingPending } = useCheckPendingManualRequest(examId);
  
  const isLoading = isLoadingExam || isCheckingPending;
  const hasPendingRequest = pendingData?.hasPending;
  
  // Add debugging info - only in development environment
  const isDevEnvironment = process.env.NODE_ENV === 'development';
  
  // Try to load exam details from sessionStorage as fallback
  let sessionExamId, sessionExamTitle, sessionExamPrice;
  if (typeof window !== 'undefined') {
    sessionExamId = sessionStorage.getItem('paymentExamId');
    sessionExamTitle = sessionStorage.getItem('paymentExamTitle');
    sessionExamPrice = sessionStorage.getItem('paymentExamPrice');
  }
  
  // Fallback exam data from session or default values
  const sessionExam = sessionExamId ? {
    id: parseInt(sessionExamId),
    title: sessionExamTitle || `Paper ${examId}`,
    description: 'Premium paper for exam preparation',
    price: sessionExamPrice ? parseInt(sessionExamPrice) : 2000,
    paperType: 'PREMIUM',
    premium: true,
    purchased: false,
    numQuestions: 100,
    timeInMinutes: 60
  } : null;
  
  // Fallback exam data for development/testing environments
  const mockExam = process.env.NODE_ENV === 'development' ? {
    id: examId,
    title: `Paper ${examId}`,
    description: 'Premium paper for exam preparation',
    price: 2000,
    paperType: 'PREMIUM',
    premium: true,
    purchased: false,
    numQuestions: 100,
    timeInMinutes: 60
  } : null;
  
  // Use real exam data or fallback to session data or mock in development
  const displayExam = exam || sessionExam || mockExam;
  
  // If user already has a pending request, redirect to status page
  if (hasPendingRequest) {
    router.push(`/payments/pending?examId=${examId}`);
    return null;
  }
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!displayExam) {
    return (
      <div className="container py-8 max-w-4xl">
        <div className="text-center py-12 space-y-4">
          <h1 className="text-xl font-semibold">Exam Information Unavailable</h1>
          <p className="text-muted-foreground">
            We're having trouble retrieving the exam details. This might be a temporary issue.
          </p>
          
          <div className="flex flex-col space-y-3 items-center justify-center">
            <Button 
              onClick={() => router.push('/model-papers')} 
              variant="default"
              className="w-48"
            >
              View Model Papers
            </Button>
            
            <Button 
              onClick={() => router.back()}
              variant="outline"
              className="w-48"
            >
              Go Back
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8 max-w-4xl">
      <ManualPaymentForm 
        exam={displayExam}
        onSuccess={() => router.push(`/payments/pending?examId=${examId}`)} 
      />
    </div>
  );
}