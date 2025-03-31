'use client';

/**
 * Custom hook for checking exam feature access
 * Uses the new feature-based RBAC system
 */
import { useFeatureAccess } from '@/core/rbac/hooks/useFeatureAccess';
import { FeatureOperation } from '@/core/rbac/types/feature-access';

export enum ExamOperation {
  VIEW = 'VIEW',
  TAKE = 'TAKE',
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  DUPLICATE = 'DUPLICATE',
  MANAGE_QUESTIONS = 'MANAGE_QUESTIONS',
  PUBLISH = 'PUBLISH',
  UNPUBLISH = 'UNPUBLISH',
  ASSIGN = 'ASSIGN',
  GRADE = 'GRADE',
  VIEW_RESULTS = 'VIEW_RESULTS',
  EXPORT_RESULTS = 'EXPORT_RESULTS',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS'
}

const EXAMS_FEATURE = 'exams';

export function useExamFeatureAccess() {
  const { hasFeature, hasOperation } = useFeatureAccess();

  // Check if the user can access the exams feature
  const canAccessExams = hasFeature(EXAMS_FEATURE);

  // Check if the user can view exams
  const canViewExams = hasOperation(EXAMS_FEATURE, ExamOperation.VIEW);
  
  // Check if the user can take exams
  const canTakeExams = hasOperation(EXAMS_FEATURE, ExamOperation.TAKE);
  
  // Check if the user can create exams
  const canCreateExams = hasOperation(EXAMS_FEATURE, ExamOperation.CREATE);
  
  // Check if the user can edit exams
  const canEditExams = hasOperation(EXAMS_FEATURE, ExamOperation.EDIT);
  
  // Check if the user can delete exams
  const canDeleteExams = hasOperation(EXAMS_FEATURE, ExamOperation.DELETE);
  
  // Check if the user can duplicate exams
  const canDuplicateExams = hasOperation(EXAMS_FEATURE, ExamOperation.DUPLICATE);
  
  // Check if the user can manage questions
  const canManageQuestions = hasOperation(EXAMS_FEATURE, ExamOperation.MANAGE_QUESTIONS);
  
  // Check if the user can publish exams
  const canPublishExams = hasOperation(EXAMS_FEATURE, ExamOperation.PUBLISH);
  
  // Check if the user can unpublish exams
  const canUnpublishExams = hasOperation(EXAMS_FEATURE, ExamOperation.UNPUBLISH);
  
  // Check if the user can assign exams
  const canAssignExams = hasOperation(EXAMS_FEATURE, ExamOperation.ASSIGN);
  
  // Check if the user can grade exams
  const canGradeExams = hasOperation(EXAMS_FEATURE, ExamOperation.GRADE);
  
  // Check if the user can view results
  const canViewResults = hasOperation(EXAMS_FEATURE, ExamOperation.VIEW_RESULTS);
  
  // Check if the user can export results
  const canExportResults = hasOperation(EXAMS_FEATURE, ExamOperation.EXPORT_RESULTS);
  
  // Check if the user can view analytics
  const canViewAnalytics = hasOperation(EXAMS_FEATURE, ExamOperation.VIEW_ANALYTICS);

  // Combination checks (for convenience)
  
  // Check if the user can manage exams (create, edit, delete)
  const canManageExams = canCreateExams || canEditExams || canDeleteExams;
  
  // Check if the user can administer exams (publish, unpublish, assign)
  const canAdministerExams = canPublishExams || canUnpublishExams || canAssignExams;
  
  // Check if the user is an exams admin
  const isExamsAdmin = canCreateExams && canEditExams && canPublishExams && canManageQuestions;

  // Function to check any custom operation
  const checkExamOperation = (operation: ExamOperation) => hasOperation(EXAMS_FEATURE, operation);

  return {
    canAccessExams,
    canViewExams,
    canTakeExams,
    canCreateExams,
    canEditExams,
    canDeleteExams,
    canDuplicateExams,
    canManageQuestions,
    canPublishExams,
    canUnpublishExams,
    canAssignExams,
    canGradeExams,
    canViewResults,
    canExportResults,
    canViewAnalytics,
    canManageExams,
    canAdministerExams,
    isExamsAdmin,
    checkExamOperation,
  };
}
