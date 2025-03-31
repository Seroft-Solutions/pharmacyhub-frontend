/**
 * useExamRoleUI Hook
 * 
 * A custom hook that provides UI flags and settings based on user roles and permissions.
 * This hook simplifies creating role-specific UIs by providing boolean flags for
 * common UI decisions.
 */
import { useMemo } from 'react';
import { useAuth } from '@/core/auth';
import { useRoles } from '@/core/rbac/hooks';
import { useExamFeatureAccess } from './useExamFeatureAccess';

/**
 * Result interface for useExamRoleUI hook
 */
export interface ExamRoleUIOptions {
  /** Whether to show admin navigation section */
  showAdminNav: boolean;
  
  /** Whether to show the "all results" section */
  showAllResults: boolean;
  
  /** Whether to show the payment settings section */
  showPaymentSection: boolean;
  
  /** Whether to show instructor-specific features */
  showInstructorFeatures: boolean;
  
  /** Whether to show student-specific features */
  showStudentFeatures: boolean;
  
  /** Whether to show exam creation features */
  showCreateExam: boolean;
  
  /** Whether to show exam management features */
  showManageExams: boolean;
  
  /** Whether to show question management features */
  showManageQuestions: boolean;
  
  /** Whether to show analytics features */
  showAnalytics: boolean;
  
  /** Whether the user is an admin */
  isAdmin: boolean;
  
  /** Whether the user is an instructor */
  isInstructor: boolean;
  
  /** Whether the user is a student */
  isStudent: boolean;
  
  /** Whether UI data is still loading */
  isLoading: boolean;
}

/**
 * Hook that provides role-based UI flags and settings.
a * 
 * @returns Object with UI flags based on user's roles and permissions
 * 
 * @example
 * // Basic usage
 * const {
 *   showAdminNav,
 *   showCreateExam,
 *   isAdmin,
 *   isLoading
 * } = useExamRoleUI();
 * 
 * if (isLoading) return <Loading />;
 * 
 * return (
 *   <div>
 *     {showAdminNav && <AdminNavigation />}
 *     {showCreateExam && <CreateExamButton />}
 *     {isAdmin && <AdminPanel />}
 *   </div>
 * );
 */
export function useExamRoleUI(): ExamRoleUIOptions {
  // Get auth state
  const { user, isLoading: authLoading } = useAuth();
  
  // Get roles
  const { hasRole, isLoading: rolesLoading } = useRoles();
  
  // Get feature access
  const { 
    canCreateExam,
    canEditExam,
    canDeleteExam,
    canManageQuestions,
    canViewResults,
    canViewAllResults,
    canManagePayments,
    canViewAnalytics,
    isLoading: permissionsLoading 
  } = useExamFeatureAccess();
  
  // Determine roles based on auth and roles system
  const isAdmin = useMemo(() => hasRole('admin'), [hasRole]);
  const isInstructor = useMemo(() => hasRole('instructor'), [hasRole]);
  const isStudent = useMemo(() => hasRole('student'), [hasRole]);
  
  // Determine if any data is still loading
  const isLoading = authLoading || rolesLoading || permissionsLoading;
  
  // Compute UI flags based on roles and permissions
  const uiFlags = useMemo(() => ({
    // Navigation
    showAdminNav: isAdmin || canCreateExam || canEditExam || canManageQuestions,
    
    // Results
    showAllResults: isAdmin || canViewAllResults,
    
    // Payments
    showPaymentSection: isAdmin || canManagePayments,
    
    // Role-based features
    showInstructorFeatures: isInstructor || isAdmin,
    showStudentFeatures: true, // All users can see student features
    
    // Exam management
    showCreateExam: isAdmin || canCreateExam,
    showManageExams: isAdmin || canEditExam || canDeleteExam,
    showManageQuestions: isAdmin || canManageQuestions,
    
    // Analytics
    showAnalytics: isAdmin || canViewAnalytics,
    
    // Roles
    isAdmin,
    isInstructor,
    isStudent,
    
    // Loading state
    isLoading,
  }), [
    isAdmin, 
    isInstructor, 
    isStudent,
    canCreateExam,
    canEditExam,
    canDeleteExam,
    canManageQuestions,
    canViewAllResults,
    canManagePayments,
    canViewAnalytics,
    isLoading
  ]);
  
  return uiFlags;
}

export default useExamRoleUI;
