/**
 * useExamSubmission Hook
 * 
 * A custom hook that manages exam submission logic and state.
 */

import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import logger from '@/shared/lib/logger';
import { useExamAnalytics } from '../useExamAnalytics';
import { calculateExamResults } from '../../utils/examUtils';

interface UseExamSubmissionProps {
  examId: number;
  userId: string;
  submitExam: (params?: any, options?: any) => void;
  questions: any[];
  answers: Record<number, any>;
  getAnsweredQuestionsCount: () => number;
  getCompletionPercentage: () => number;
  timeRemaining: number;
  exam: any;
}

/**
 * Hook for managing exam submission
 */
export function useExamSubmission({
  examId,
  userId,
  submitExam,
  questions,
  answers,
  getAnsweredQuestionsCount,
  getCompletionPercentage,
  timeRemaining,
  exam
}: UseExamSubmissionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [examResults, setExamResults] = useState<any>(null);
  const [submitError, setSubmitError] = useState<Error | null>(null);
  const isSubmittingRef = useRef(false);
  
  // Setup analytics tracking
  const analytics = useExamAnalytics(examId, userId);
  
  /**
   * Handle exam submission
   */
  const handleSubmitExam = useCallback(async (attemptId: number | null) => {
    // Prevent multiple submissions
    if (isSubmittingRef.current) {
      logger.info('Submission already in progress, ignoring duplicate request');
      return;
    }
    
    // Set submitting flags
    isSubmittingRef.current = true;
    setIsSubmitting(true);
    
    analytics.trackEvent('exam_submit', { 
      answeredCount: getAnsweredQuestionsCount(),
      totalQuestions: questions.length,
      timeRemaining,
      completionPercentage: getCompletionPercentage()
    });
    
    try {
      submitExam(
        undefined,
        {
          onSuccess: (data: any) => {
            setIsSubmitting(false);
            setShowResults(true);
            
            // Calculate and store exam results
            if (attemptId && questions && answers && exam) {
              const results = calculateExamResults(
                questions,
                answers,
                exam,
                attemptId,
                timeRemaining
              );
              setExamResults(results);
            }
            
            toast.success('Exam submitted successfully!');
            analytics.trackEvent('exam_submit_success', { examId, score: data?.score });
            // Keep isSubmittingRef.current as true since submission was successful
            // and we don't want to allow further submissions
          },
          onError: (error: Error) => {
            // Reset submitting flags on error to allow retrying
            isSubmittingRef.current = false;
            setIsSubmitting(false);
            setSubmitError(error);
            
            analytics.trackEvent('exam_submit_error', { error: error.message });
            const errorMessage = error.message;
            
            // Check if it's an authentication or permission error
            if (errorMessage.includes('403') || errorMessage.includes('401') || errorMessage.includes('Authentication')) {
              toast.error('Authentication error. Please refresh the page and try again.');
            } else {
              toast.error(`Failed to submit exam: ${errorMessage}`);
            }
          }
        }
      );
    } catch (error) {
      // Reset submitting flags on error to allow retrying
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      
      const typedError = error instanceof Error ? error : new Error('Unknown error');
      setSubmitError(typedError);
      
      console.error('Error submitting exam:', error);
      analytics.trackEvent('exam_submit_error', { error: typedError.message });
      
      // Check if it's an authentication or permission error
      if (typedError.message.includes('403') || typedError.message.includes('401') || typedError.message.includes('Authentication')) {
        toast.error('Authentication error. Please refresh the page and try again.');
      } else {
        toast.error(`Failed to submit exam: ${typedError.message}`);
      }
    }
  }, [examId, userId, submitExam, questions, answers, getAnsweredQuestionsCount, getCompletionPercentage, timeRemaining, analytics, exam]);
  
  /**
   * Handle timer expiration
   */
  const handleExamTimeExpired = useCallback((attemptId: number | null) => {
    // Prevent duplicate submissions
    if (isSubmittingRef.current) {
      logger.info('Submission already in progress, ignoring timer expiration submission');
      return;
    }
    
    analytics.trackEvent('exam_time_expired', {
      answeredCount: getAnsweredQuestionsCount(),
      totalQuestions: questions.length,
      completionPercentage: getCompletionPercentage()
    });
    
    toast.warning('Time is up! Your exam will be submitted automatically.');
    handleSubmitExam(attemptId);
  }, [handleSubmitExam, analytics, getAnsweredQuestionsCount, questions, getCompletionPercentage]);
  
  /**
   * Reset submission state (for retrying an exam)
   */
  const resetSubmissionState = useCallback(() => {
    isSubmittingRef.current = false;
    setIsSubmitting(false);
    setShowResults(false);
    setExamResults(null);
    setSubmitError(null);
  }, []);

  return {
    isSubmitting,
    submitError,
    showResults,
    examResults,
    handleSubmitExam,
    handleExamTimeExpired,
    resetSubmissionState
  };
}
