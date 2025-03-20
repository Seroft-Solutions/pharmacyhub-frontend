"use client"

import { useCallback, useEffect } from 'react';
import { useExamStore } from '../store/examStore';

/**
 * Hook for tracking exam analytics
 * 
 * This hook tracks various metrics related to exam taking behavior
 * and can be used for analytics or to improve the exam experience.
 */
export const useExamAnalytics = (examId: number, userId: string) => {
  // Track time spent per question
  useEffect(() => {
    const examStore = useExamStore.getState();
    let questionStartTime = Date.now();
    let currentQuestionId = 0;
    
    if (examStore.questions.length > 0 && examStore.currentQuestionIndex >= 0) {
      currentQuestionId = examStore.questions[examStore.currentQuestionIndex].id;
    }
    
    const unsubscribe = useExamStore.subscribe((state) => {
      // If the question changed, record time spent on previous question
      if (state.questions.length > 0 && 
          state.currentQuestionIndex >= 0 && 
          state.questions[state.currentQuestionIndex].id !== currentQuestionId) {
        
        const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000); // in seconds
        
        // Track time spent (in a real implementation, send to an analytics service)
        console.log(`User ${userId} spent ${timeSpent}s on question ${currentQuestionId} in exam ${examId}`);
        
        // Reset timer for new question
        questionStartTime = Date.now();
        currentQuestionId = state.questions[state.currentQuestionIndex].id;
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [examId, userId]);
  
  // Track answer changes
  useEffect(() => {
    const unsubscribe = useExamStore.subscribe((state, prevState) => {
      // If answers changed
      if (Object.keys(state.answers).length !== Object.keys(prevState.answers).length) {
        const newAnswerKeys = Object.keys(state.answers).filter(
          key => !prevState.answers[parseInt(key)]
        );
        
        newAnswerKeys.forEach(key => {
          const answer = state.answers[parseInt(key)];
          
          // Track new answer (in a real implementation, send to an analytics service)
          console.log(`User ${userId} answered question ${answer.questionId} with option ${answer.selectedOption} in exam ${examId}`);
        });
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [examId, userId]);
  
  // Track exam completion
  useEffect(() => {
    const unsubscribe = useExamStore.subscribe((state, prevState) => {
      // If exam was completed
      if (!prevState.isCompleted && state.isCompleted) {
        const totalTimeSpent = state.endTime 
          ? Math.floor((new Date(state.endTime).getTime() - new Date(state.startTime || Date.now()).getTime()) / 1000)
          : 0;
          
        const answeredCount = Object.keys(state.answers).length;
        const totalQuestions = state.questions.length;
        const completionPercentage = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0;
        
        // Track exam completion (in a real implementation, send to an analytics service)
        console.log(`User ${userId} completed exam ${examId} in ${totalTimeSpent}s with ${completionPercentage}% completion rate`);
      }
    });
    
    return () => {
      unsubscribe();
    };
  }, [examId, userId]);
  
  // Expose analytics helper functions
  const trackEvent = useCallback((eventName: string, data: Record<string, any> = {}) => {
    // In a real implementation, send to an analytics service
    console.log(`[Analytics] ${eventName}`, { userId, examId, ...data });
  }, [examId, userId]);
  
  return {
    trackEvent
  };
};

export default useExamAnalytics;