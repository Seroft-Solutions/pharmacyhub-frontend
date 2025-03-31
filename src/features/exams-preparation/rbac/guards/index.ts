/**
 * Exam RBAC Guards
 * 
 * This module exports all exam-specific RBAC guard components.
 * These guards are used to conditionally render content based on permissions.
 */

export { ExamOperationGuard } from './ExamOperationGuard';
export { ExamRoleGuard } from './ExamRoleGuard';
export { ConditionalContent } from './ConditionalContent';
export { AccessDeniedPage } from './AccessDeniedPage';
export { withExamPermission } from './withExamPermission';
