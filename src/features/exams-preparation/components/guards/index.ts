/**
 * Exams Preparation Guards
 * 
 * This module exports guard components that control access to exam functionality.
 * Guards handle authentication, permission checks, payment verification, and other access controls.
 * 
 * All guards consistently use core modules (auth, rbac) for access control.
 */

export * from './ExamAccessGuard';
export * from './PremiumContentGuard';
export * from './PermissionGuard';
