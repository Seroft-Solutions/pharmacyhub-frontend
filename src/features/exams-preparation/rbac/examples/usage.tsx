/**
 * Examples of using exams-preparation RBAC for permission checks
 * 
 * This file provides examples of how to use the RBAC system for the exams-preparation feature.
 * It's intended as reference documentation and not for actual use in the application.
 */

import React from 'react';
import { Button } from '@/core/ui/atoms';
import { 
  useExamPermission, 
  useExamFeatureAccess,
  ExamOperationGuard 
} from '@/features/exams-preparation/rbac';
import { ExamOperation } from '@/features/exams-preparation/rbac/types';

/**
 * Example 1: Using hooks for permission checks
 */
export function ExamActionsExample({ examId }: { examId: number }) {
  // Check a specific operation
  const { hasPermission: canEdit } = useExamPermission(ExamOperation.EDIT_EXAM);
  const { hasPermission: canDelete } = useExamPermission(ExamOperation.DELETE_EXAM);
  const { hasPermission: canPublish } = useExamPermission(ExamOperation.PUBLISH_EXAM);
  
  // You can also provide context for more granular permission checks
  const { hasPermission: canManageQuestions } = useExamPermission(
    ExamOperation.MANAGE_QUESTIONS,
    { context: { examId } }
  );
  
  return (
    <div className="exam-actions">
      {canEdit && (
        <Button variant="primary" onClick={() => console.log('Edit exam')}>
          Edit
        </Button>
      )}
      
      {canDelete && (
        <Button variant="danger" onClick={() => console.log('Delete exam')}>
          Delete
        </Button>
      )}
      
      {canPublish && (
        <Button variant="secondary" onClick={() => console.log('Publish exam')}>
          Publish
        </Button>
      )}
      
      {canManageQuestions && (
        <Button variant="secondary" onClick={() => console.log('Manage questions')}>
          Manage Questions
        </Button>
      )}
    </div>
  );
}

/**
 * Example 2: Using the feature access hook for multiple permission checks
 */
export function ExamNavigationExample() {
  // useExamFeatureAccess provides convenient access to common permission combinations
  const { 
    canViewExams,
    canTakeExams,
    canViewResults,
    canCreateExams,
    canManageExams,
    isAdmin,
    isInstructor,
    isStudent
  } = useExamFeatureAccess();
  
  return (
    <nav className="exam-navigation">
      <ul>
        {canViewExams && (
          <li><a href="/exams">View Exams</a></li>
        )}
        
        {canTakeExams && (
          <li><a href="/exams/dashboard">My Dashboard</a></li>
        )}
        
        {canViewResults && (
          <li><a href="/exams/results">My Results</a></li>
        )}
        
        {canCreateExams && (
          <li><a href="/exams/create">Create Exam</a></li>
        )}
        
        {canManageExams && (
          <li><a href="/exams/admin">Manage Exams</a></li>
        )}
        
        {isAdmin && (
          <li><a href="/exams/admin/settings">Admin Settings</a></li>
        )}
        
        {/* You can also combine roles with permissions */}
        {isInstructor && canCreateExams && (
          <li><a href="/exams/templates">Exam Templates</a></li>
        )}
        
        {isStudent && (
          <li><a href="/exams/upcoming">Upcoming Exams</a></li>
        )}
      </ul>
    </nav>
  );
}

/**
 * Example 3: Using guards to protect components or routes
 */
export function ExamDetailsExample({ examId }: { examId: number }) {
  return (
    <div className="exam-details">
      <h1>Exam Details</h1>
      
      {/* Basic usage - only renders children if user has the VIEW_EXAM_DETAILS permission */}
      <ExamOperationGuard 
        operation={ExamOperation.VIEW_EXAM_DETAILS}
      >
        <ExamInfoSection examId={examId} />
      </ExamOperationGuard>
      
      {/* With fallback - provides alternative content when permission is denied */}
      <ExamOperationGuard 
        operation={ExamOperation.TAKE_EXAM}
        fallback={<PremiumExamPromotion examId={examId} />}
      >
        <StartExamButton examId={examId} />
      </ExamOperationGuard>
      
      {/* With context - for more granular permission checks */}
      <ExamOperationGuard 
        operation={ExamOperation.EDIT_EXAM}
        context={{ examId }}
      >
        <ExamEditSection examId={examId} />
      </ExamOperationGuard>
    </div>
  );
}

// Placeholder components for the examples
const ExamInfoSection = ({ examId }: { examId: number }) => <div>Exam Info</div>;
const StartExamButton = ({ examId }: { examId: number }) => <button>Start Exam</button>;
const PremiumExamPromotion = ({ examId }: { examId: number }) => <div>Premium Exam</div>;
const ExamEditSection = ({ examId }: { examId: number }) => <div>Edit Exam</div>;
