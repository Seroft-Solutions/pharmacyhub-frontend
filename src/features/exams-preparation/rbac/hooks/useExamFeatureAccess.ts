/**
 * useExamFeatureAccess Hook
 * 
 * A convenience hook that provides easy access to common exam feature permissions
 * for UI rendering decisions. This hook provides a higher-level abstraction
 * for checking multiple permissions at once.
 */

import { useState, useEffect } from 'react';
import { useRoles } from '@/core/rbac/hooks';
import { useExamPermission } from './useExamPermission';
import { ExamOperation, ExamPermissionOptions } from '../types';

/**
 * Result interface for useExamFeatureAccess hook
 */
export interface ExamFeatureAccess {
  // Basic flags
  isLoading: boolean;
  hasError: boolean;
  error: Error | null;
  
  // View access
  canViewExams: boolean;
  canViewExamDetails: boolean;
  canViewResults: boolean;
  canViewAllResults: boolean;
  
  // Management access
  canCreateExam: boolean;
  canEditExam: boolean;
  canDeleteExam: boolean;
  canPublishExam: boolean;
  canArchiveExam: boolean;
  
  // Question management
  canManageQuestions: boolean;
  canCreateQuestion: boolean;
  canEditQuestion: boolean;
  canDeleteQuestion: boolean;
  
  // Student operations
  canTakeExam: boolean;
  canSubmitExam: boolean;
  
  // Payment operations
  canManagePayments: boolean;
  
  // Role-based flags
  isAdmin: boolean;
  isInstructor: boolean;
  isStudent: boolean;
}

/**
 * Hook that provides comprehensive feature access information for the exams feature
 * 
 * @param options Permission check options
 * @returns Object with all feature access flags
 */
export function useExamFeatureAccess(options?: ExamPermissionOptions): ExamFeatureAccess {
  // Use individual permission hooks
  const viewExams = useExamPermission(ExamOperation.VIEW_EXAMS, options);
  const viewExamDetails = useExamPermission(ExamOperation.VIEW_EXAM_DETAILS, options);
  const viewResults = useExamPermission(ExamOperation.VIEW_RESULTS, options);
  const viewAllResults = useExamPermission(ExamOperation.VIEW_ALL_RESULTS, options);
  
  const createExam = useExamPermission(ExamOperation.CREATE_EXAM, options);
  const editExam = useExamPermission(ExamOperation.EDIT_EXAM, options);
  const deleteExam = useExamPermission(ExamOperation.DELETE_EXAM, options);
  const publishExam = useExamPermission(ExamOperation.PUBLISH_EXAM, options);
  const archiveExam = useExamPermission(ExamOperation.ARCHIVE_EXAM, options);
  
  const manageQuestions = useExamPermission(ExamOperation.MANAGE_QUESTIONS, options);
  const createQuestion = useExamPermission(ExamOperation.CREATE_QUESTION, options);
  const editQuestion = useExamPermission(ExamOperation.EDIT_QUESTION, options);
  const deleteQuestion = useExamPermission(ExamOperation.DELETE_QUESTION, options);
  
  const takeExam = useExamPermission(ExamOperation.TAKE_EXAM, options);
  const submitExam = useExamPermission(ExamOperation.SUBMIT_EXAM, options);
  
  const managePayments = useExamPermission(ExamOperation.MANAGE_PAYMENTS, options);
  
  // Check roles
  const { hasRole, isLoading: rolesLoading } = useRoles();
  
  // Calculate loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Update loading state when all hooks have loaded
  useEffect(() => {
    const hooksLoading = [
      viewExams.isLoading,
      viewExamDetails.isLoading,
      viewResults.isLoading,
      viewAllResults.isLoading,
      createExam.isLoading,
      editExam.isLoading,
      deleteExam.isLoading,
      publishExam.isLoading,
      archiveExam.isLoading,
      manageQuestions.isLoading,
      createQuestion.isLoading,
      editQuestion.isLoading,
      deleteQuestion.isLoading,
      takeExam.isLoading,
      submitExam.isLoading,
      managePayments.isLoading,
      rolesLoading,
    ];
    
    setIsLoading(hooksLoading.some(loading => loading));
  }, [
    viewExams.isLoading,
    viewExamDetails.isLoading,
    viewResults.isLoading,
    viewAllResults.isLoading,
    createExam.isLoading,
    editExam.isLoading,
    deleteExam.isLoading,
    publishExam.isLoading,
    archiveExam.isLoading,
    manageQuestions.isLoading,
    createQuestion.isLoading,
    editQuestion.isLoading,
    deleteQuestion.isLoading,
    takeExam.isLoading,
    submitExam.isLoading,
    managePayments.isLoading,
    rolesLoading,
  ]);
  
  // Collect any errors
  const errors = [
    viewExams.error,
    viewExamDetails.error,
    viewResults.error,
    viewAllResults.error,
    createExam.error,
    editExam.error,
    deleteExam.error,
    publishExam.error,
    archiveExam.error,
    manageQuestions.error,
    createQuestion.error,
    editQuestion.error,
    deleteQuestion.error,
    takeExam.error,
    submitExam.error,
    managePayments.error,
  ].filter(Boolean);
  
  const hasError = errors.length > 0;
  const error = errors.length > 0 ? errors[0] : null;
  
  return {
    // Basic flags
    isLoading,
    hasError,
    error,
    
    // View access
    canViewExams: viewExams.hasPermission,
    canViewExamDetails: viewExamDetails.hasPermission,
    canViewResults: viewResults.hasPermission,
    canViewAllResults: viewAllResults.hasPermission,
    
    // Management access
    canCreateExam: createExam.hasPermission,
    canEditExam: editExam.hasPermission,
    canDeleteExam: deleteExam.hasPermission,
    canPublishExam: publishExam.hasPermission,
    canArchiveExam: archiveExam.hasPermission,
    
    // Question management
    canManageQuestions: manageQuestions.hasPermission,
    canCreateQuestion: createQuestion.hasPermission,
    canEditQuestion: editQuestion.hasPermission,
    canDeleteQuestion: deleteQuestion.hasPermission,
    
    // Student operations
    canTakeExam: takeExam.hasPermission,
    canSubmitExam: submitExam.hasPermission,
    
    // Payment operations
    canManagePayments: managePayments.hasPermission,
    
    // Role-based flags
    isAdmin: hasRole('admin'),
    isInstructor: hasRole('instructor'),
    isStudent: hasRole('student'),
  };
}

export default useExamFeatureAccess;
