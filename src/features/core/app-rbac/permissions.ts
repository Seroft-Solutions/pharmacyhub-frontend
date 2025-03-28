/**
 * Application Permissions
 * 
 * This file defines all permissions used throughout the application.
 * Using constants prevents typos and makes permission changes easier to manage.
 */

export const PERMISSIONS = {
  // Auth permissions
  AUTH: {
    MANAGE_USERS: 'auth:manage-users',
    VIEW_USERS: 'auth:view-users'
  },
  
  // Exam permissions
  EXAMS: {
    MANAGE_EXAMS: 'exams:manage',
    VIEW_EXAMS: 'exams:view',
    CREATE_EXAMS: 'exams:create',
    EDIT_EXAMS: 'exams:edit',
    DELETE_EXAMS: 'exams:delete',
    MANAGE_QUESTIONS: 'exams:manage-questions'
  },
  
  // Payment permissions
  PAYMENTS: {
    VIEW_PAYMENTS: 'payments:view',
    MANAGE_PAYMENTS: 'payments:manage',
    MANAGE_MANUAL_PAYMENTS: 'payments:manage-manual'
  }
};

export default PERMISSIONS;