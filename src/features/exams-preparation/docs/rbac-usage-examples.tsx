// RBAC Usage Examples
// This file provides examples of how to use the RBAC components in the exams-preparation feature.
// It is not meant to be imported, but rather serves as a reference.

import React from 'react';
import { AuthGuard } from '@/core/auth/components';
import { PermissionGuard, ExamAccessGuard, PremiumContentGuard } from '../components/guards';
import { EXAM_PERMISSIONS } from '../api/constants/permissions';
import { useExamPermissions } from '../rbac';

/**
 * Example: Using AuthGuard for basic authentication protection
 */
export const ProtectedExamComponent = () => {
  return (
    <AuthGuard
      fallbackUrl="/login?redirect=/exams"
    >
      <div>Content only visible to authenticated users</div>
    </AuthGuard>
  );
};

/**
 * Example: Using PermissionGuard for permission-based access control
 */
export const AdminExamComponent = () => {
  return (
    <PermissionGuard
      permission={EXAM_PERMISSIONS.EDIT}
      fallback={<div>You don't have permission to edit exams</div>}
    >
      <div>Exam Editor (Admin Only)</div>
    </PermissionGuard>
  );
};

/**
 * Example: Combining AuthGuard and PermissionGuard
 */
export const SecureAdminComponent = () => {
  return (
    <AuthGuard fallbackUrl="/login">
      <PermissionGuard permission={EXAM_PERMISSIONS.EDIT}>
        <div>Secure Admin Content</div>
      </PermissionGuard>
    </AuthGuard>
  );
};

/**
 * Example: Using ExamAccessGuard for exam-specific access control
 */
export const ExamViewComponent = ({ examId }: { examId: number }) => {
  return (
    <ExamAccessGuard examId={examId}>
      <div>Exam Content</div>
    </ExamAccessGuard>
  );
};

/**
 * Example: Using PremiumContentGuard for premium content access control
 */
export const PremiumExamComponent = ({ examId }: { examId: number }) => {
  return (
    <PremiumContentGuard 
      examId={examId}
      fallback={<div>Upgrade to access premium content</div>}
    >
      <div>Premium Exam Content</div>
    </PremiumContentGuard>
  );
};

/**
 * Example: Using the useExamPermissions hook for fine-grained permission checks
 */
export const ExamDashboard = () => {
  const { 
    canViewExam, 
    canCreateExam, 
    canEditExam,
    canDeleteExam,
    isAdmin,
    isInstructor
  } = useExamPermissions();

  return (
    <div>
      <h1>Exam Dashboard</h1>
      
      {/* Everyone with view permission can see this */}
      {canViewExam() && (
        <div>Exam List</div>
      )}
      
      {/* Only users with create permission can see this */}
      {canCreateExam() && (
        <button>Create New Exam</button>
      )}
      
      {/* Admin-specific controls */}
      {isAdmin() && (
        <div>Admin Controls</div>
      )}
      
      {/* Instructor-specific features */}
      {isInstructor() && (
        <div>Instructor Tools</div>
      )}
      
      {/* Edit/Delete controls */}
      <div className="exam-actions">
        {canEditExam() && (
          <button>Edit</button>
        )}
        {canDeleteExam() && (
          <button>Delete</button>
        )}
      </div>
    </div>
  );
};
