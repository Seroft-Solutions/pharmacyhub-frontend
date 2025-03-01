/**
 * User roles in the system
 */
export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  PHARMACIST = 'PHARMACIST',
  PHARMACY_MANAGER = 'PHARMACY_MANAGER',
  PROPRIETOR = 'PROPRIETOR',
  SALESMAN = 'SALESMAN'
}

/**
 * Fine-grained permissions for access control
 */
export enum Permission {
  // Exam permissions
  VIEW_EXAMS = 'VIEW_EXAMS',
  CREATE_EXAM = 'CREATE_EXAM',
  EDIT_EXAM = 'EDIT_EXAM',
  DELETE_EXAM = 'DELETE_EXAM',
  TAKE_EXAM = 'TAKE_EXAM',
  GRADE_EXAM = 'GRADE_EXAM',
  
  // User management permissions
  MANAGE_USERS = 'MANAGE_USERS',
  VIEW_USERS = 'VIEW_USERS',
  EDIT_USERS = 'EDIT_USERS',
  DELETE_USERS = 'DELETE_USERS',
  
  // Role management
  MANAGE_ROLES = 'MANAGE_ROLES',
  ASSIGN_ROLES = 'ASSIGN_ROLES',
  
  // Profile permissions
  EDIT_PROFILE = 'EDIT_PROFILE',
  VIEW_PROFILE = 'VIEW_PROFILE',
  
  // Content management
  MANAGE_CONTENT = 'MANAGE_CONTENT',
  PUBLISH_CONTENT = 'PUBLISH_CONTENT',
  
  // System settings
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
  VIEW_SETTINGS = 'VIEW_SETTINGS'
}
