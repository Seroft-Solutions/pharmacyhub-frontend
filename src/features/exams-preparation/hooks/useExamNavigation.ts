/**
 * Exam Navigation Hook
 * 
 * This hook provides navigation capabilities for exams, including routing
 * to exam-related pages and handling navigation events.
 */

import { useRouter } from 'next/router';
import { useState, useCallback } from 'react';

interface ExamNavigation {
  // Navigation to exam-related pages
  goToExamsList: () => void;
  goToExamDetails: (examId: number) => void;
  goToExamAttempt: (examId: number, attemptId?: string) => void;
  goToExamResults: (attemptId: string) => void;
  goToExamPayment: (examId: number) => void;
  
  // Confirmation dialogs
  confirmExitExam: () => Promise<boolean>;
  confirmSubmitExam: () => Promise<boolean>;
  
  // Navigation state
  isNavigating: boolean;
}

/**
 * Hook for exam navigation
 */
export const useExamNavigation = (): ExamNavigation => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  
  const goToExamsList = useCallback(() => {
    setIsNavigating(true);
    router.push('/exams-preparation').finally(() => {
      setIsNavigating(false);
    });
  }, [router]);
  
  const goToExamDetails = useCallback((examId: number) => {
    setIsNavigating(true);
    router.push(`/exams-preparation/${examId}`).finally(() => {
      setIsNavigating(false);
    });
  }, [router]);
  
  const goToExamAttempt = useCallback((examId: number, attemptId?: string) => {
    setIsNavigating(true);
    const url = attemptId
      ? `/exams-preparation/${examId}/attempt/${attemptId}`
      : `/exams-preparation/${examId}/start`;
      
    router.push(url).finally(() => {
      setIsNavigating(false);
    });
  }, [router]);
  
  const goToExamResults = useCallback((attemptId: string) => {
    setIsNavigating(true);
    router.push(`/exams-preparation/results/${attemptId}`).finally(() => {
      setIsNavigating(false);
    });
  }, [router]);
  
  const goToExamPayment = useCallback((examId: number) => {
    setIsNavigating(true);
    router.push(`/exams-preparation/payment/${examId}`).finally(() => {
      setIsNavigating(false);
    });
  }, [router]);
  
  const confirmExitExam = useCallback(async (): Promise<boolean> => {
    return window.confirm(
      'Are you sure you want to exit this exam? Your progress will be saved, but the timer will continue.'
    );
  }, []);
  
  const confirmSubmitExam = useCallback(async (): Promise<boolean> => {
    return window.confirm(
      'Are you sure you want to submit this exam? You will not be able to change your answers after submission.'
    );
  }, []);
  
  return {
    goToExamsList,
    goToExamDetails,
    goToExamAttempt,
    goToExamResults,
    goToExamPayment,
    confirmExitExam,
    confirmSubmitExam,
    isNavigating,
  };
};

export default useExamNavigation;
