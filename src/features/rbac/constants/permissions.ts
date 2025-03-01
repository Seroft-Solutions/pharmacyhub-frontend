/**
 * Permission and role constants for the RBAC system
 */

/**
 * System Roles
 */
export enum Role {
  // System roles
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
  USER = 'USER',
  GUEST = 'GUEST',
  
  // Pharmacy specific roles
  PHARMACIST = 'PHARMACIST',
  PHARMACY_MANAGER = 'PHARMACY_MANAGER',
  PROPRIETOR = 'PROPRIETOR',
  SALESMAN = 'SALESMAN',
  
  // Other application roles
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR'
}

/**
 * Permission constants
 * 
 * These are used throughout the application to check for specific permissions
 */
export type Permission = 
  // User management
  | 'manage_users'
  | 'view_users'
  
  // Role management
  | 'manage_roles'
  | 'view_roles'
  
  // Permission management
  | 'manage_permissions'
  | 'view_permissions'
  
  // Feature flags
  | 'manage_features'
  | 'view_features'
  
  // Pharmacy specific permissions
  | 'manage_pharmacists'
  | 'view_pharmacists'
  | 'manage_pharmacy_managers'
  | 'view_pharmacy_managers'
  | 'manage_proprietors'
  | 'view_proprietors'
  | 'manage_salesmen'
  | 'view_salesmen'
  
  // Inventory permissions
  | 'manage_inventory'
  | 'view_inventory'
  | 'manage_products'
  | 'view_products'
  
  // System permissions
  | 'manage_system'
  | 'view_system'
  | 'manage_settings'
  | 'view_settings'
  
  // Exam permissions
  | 'manage_exams'
  | 'view_exams'
  | 'create_exams'
  | 'edit_exams'
  | 'delete_exams'
  | 'grade_exams'
  | 'attempt_exams'
  
  // Report permissions
  | 'manage_reports'
  | 'view_reports'
  | 'create_reports'
  | 'export_reports'
  
  // Analytics permissions
  | 'view_analytics'
  | 'export_analytics'
  
  // Other permissions
  | string;

/**
 * Default permission sets for specific roles
 */
export const DEFAULT_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: [
    'manage_users',
    'view_users',
    'manage_roles',
    'view_roles',
    'manage_permissions',
    'view_permissions',
    'manage_features',
    'view_features',
    'manage_system',
    'view_system',
    'manage_settings',
    'view_settings',
    'manage_reports',
    'view_reports',
    'create_reports',
    'export_reports',
    'view_analytics',
    'export_analytics'
  ],
  
  [Role.ADMIN]: [
    'manage_users',
    'view_users',
    'view_roles',
    'view_permissions',
    'manage_features',
    'view_features',
    'view_system',
    'manage_settings',
    'view_settings',
    'manage_reports',
    'view_reports',
    'create_reports',
    'view_analytics',
    'export_analytics'
  ],
  
  [Role.USER]: [
    'view_products'
  ],
  
  [Role.GUEST]: [],
  
  [Role.PHARMACIST]: [
    'view_products',
    'view_inventory',
    'attempt_exams',
    'view_exams'
  ],
  
  [Role.PHARMACY_MANAGER]: [
    'manage_inventory',
    'view_inventory',
    'manage_products',
    'view_products',
    'view_reports',
    'view_analytics'
  ],
  
  [Role.PROPRIETOR]: [
    'view_products',
    'view_inventory',
    'view_reports',
    'view_analytics'
  ],
  
  [Role.SALESMAN]: [
    'view_products'
  ],
  
  [Role.STUDENT]: [
    'attempt_exams',
    'view_exams'
  ],
  
  [Role.INSTRUCTOR]: [
    'manage_exams',
    'view_exams',
    'create_exams',
    'edit_exams',
    'grade_exams'
  ]
};

export default {
  Role,
  DEFAULT_PERMISSIONS
};
