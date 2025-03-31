/**
 * Exam RBAC Hooks
 * 
 * This module exports all exam-specific RBAC hooks.
 * 
 * These hooks provide a convenient API for checking permissions and controlling
 * access to exam-specific features based on the user's permissions.
 */

export { useExamPermission } from './useExamPermission';
export { useExamFeatureAccess } from './useExamFeatureAccess';
export { useGuardedCallback } from './useGuardedCallback';
export { useExamRoleUI } from './useExamRoleUI';

