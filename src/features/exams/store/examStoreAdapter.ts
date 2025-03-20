/**
 * Exam Store Adapter
 * 
 * This adapter bridges the Zustand store with the TanStack Query API.
 * It provides the store with methods that properly interact with the API
 * while maintaining the store's synchronous interface.
 */

import { examApiHooks, examService } from '../api';
import { useExamResult, useFlaggedQuestions } from '../api/hooks';
import { 
  Exam, 
  ExamAttempt, 
  UserAnswer, 
  ExamResult, 
  FlaggedQuestion 
} from '../types';

/**
 * Adapter for the Zustand store to interact with the API
 * 
 * This adapter exposes methods that can be called from the store
 * and interacts with the API using fetch (since we can't use hooks directly).
 */
export const examStoreAdapter = {
  /**
   * Get all published exams
   */
  async getPublishedExams(): Promise<Exam[]> {
    const response = await fetch('/api/v1/exams/published');
    if (!response.ok) {
      throw new Error('Failed to fetch published exams');
    }
    return await response.json();
  },
  
  /**
   * Get exam by ID
   */
  async getExamById(examId: number): Promise<Exam> {
    const response = await fetch(`/api/v1/exams/${examId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch exam with ID ${examId}`);
    }
    return await response.json();
  },
  
  /**
   * Start a new exam attempt
   */
  async startExam(examId: number): Promise<ExamAttempt> {
    const response = await fetch(`/api/v1/exams/${examId}/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to start exam ${examId}`);
    }
    
    return await response.json();
  },
  
  /**
   * Get flagged questions for an attempt
   */
  async getFlaggedQuestions(attemptId: number): Promise<FlaggedQuestion[]> {
    const response = await fetch(`/api/v1/exams/attempts/${attemptId}/flags`);
    if (!response.ok) {
      throw new Error(`Failed to fetch flagged questions for attempt ${attemptId}`);
    }
    return await response.json();
  },
  
  /**
   * Flag a question in an attempt
   */
  async flagQuestion(attemptId: number, questionId: number): Promise<void> {
    const response = await fetch(`/api/v1/exams/attempts/${attemptId}/flag/${questionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to flag question ${questionId} for attempt ${attemptId}`);
    }
  },
  
  /**
   * Unflag a question in an attempt
   */
  async unflagQuestion(attemptId: number, questionId: number): Promise<void> {
    const response = await fetch(`/api/v1/exams/attempts/${attemptId}/flag/${questionId}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Failed to unflag question ${questionId} for attempt ${attemptId}`);
    }
  },
  
  /**
   * Submit an exam with user answers
   */
  async submitExam(attemptId: number, answers: UserAnswer[]): Promise<ExamResult> {
    const response = await fetch(`/api/v1/exams/attempts/${attemptId}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ answers })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to submit exam for attempt ${attemptId}`);
    }
    
    return await response.json();
  },
  
  /**
   * Answer a question in an attempt
   */
  async answerQuestion(attemptId: number, questionId: number, selectedOption: number, timeSpent: number = 0): Promise<void> {
    const response = await fetch(`/api/v1/exams/attempts/${attemptId}/answer/${questionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        questionId, // Include the questionId in the request body
        selectedOptionId: selectedOption.toString(), // Backend expects selectedOptionId as a string
        timeSpent // Include the timeSpent in the request body
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Failed to answer question ${questionId} for attempt ${attemptId}: ${JSON.stringify(errorData)}`);
    }
  },
  
  /**
   * Delete a question from an exam
   */
  async deleteQuestion(examId: number, questionId: number): Promise<void> {
    const response = await fetch(`/api/v1/exams/${examId}/questions/${questionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to delete question ${questionId} from exam ${examId}`);
    }
  }
};

/**
 * In-component adapter that uses React hooks for components that can use hooks directly
 */
export const useExamStoreAdapter = () => {
  // Return hooks that can be used in components
  return {
    useExamResult,
    useFlaggedQuestions,
    ...examApiHooks
  };
};

export default examStoreAdapter;
