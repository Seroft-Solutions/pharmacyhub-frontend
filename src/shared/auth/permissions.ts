/**
 * Centralized permissions constants for PharmacyHub application
 * 
 * This file serves as the single source of truth for all permission constants
 * used throughout the application. All permission checks should reference
 * these constants instead of using string literals.
 */

export const PERMISSIONS = {
  // System-level permissions
  SYSTEM: {
    MANAGE: 'manage:system',
    AUDIT: 'audit:system',
    SECURITY: 'manage:security',
  },
  
  // User management permissions
  USER: {
    MANAGE: 'manage:users',
    VIEW: 'view:users',
    PROFILE: 'manage:profile',
  },
  
  // Role management permissions
  ROLE: {
    MANAGE: 'manage:roles',
  },
  
  // Pharmacy-related permissions
  PHARMACY: {
    CREATE: 'create:pharmacy',
    EDIT: 'edit:pharmacy',
    DELETE: 'delete:pharmacy',
    VIEW: 'view:pharmacy',
    APPROVE: 'approve:pharmacy',
    OWN: 'own:pharmacy',
    MANAGE: 'manage:pharmacy',
  },
  
  // Staff management permissions
  STAFF: {
    MANAGE: 'manage:staff',
    APPROVE: 'approve:staff',
  },
  
  // Inventory-related permissions
  INVENTORY: {
    MANAGE: 'manage:inventory',
    VIEW: 'view:inventory',
  },
  
  // Sales-related permissions
  SALES: {
    PROCESS: 'process:sales',
    PRODUCTS: 'sell:products',
  },
  
  // Exam-related permissions
  EXAM: {
    MANAGE: 'manage:exams',
    TAKE: 'take:exams',
    GRADE: 'grade:exams',
  },
  
  // Reports permissions
  REPORTS: {
    VIEW: 'view:reports',
  },
  
  // Course-related permissions
  COURSE: {
    CREATE: 'create:courses',
    VIEW: 'view:courses',
  },
  
  // Certification permissions
  CERTIFICATION: {
    VIEW: 'view:certification',
  },
} as const;

/**
 * Permission groups mapped to roles
 * This mapping allows for easy role-based permission checks
 */
export const ROLE_PERMISSIONS = {
  SUPER_ADMIN: [
    ...Object.values(PERMISSIONS.SYSTEM),
    ...Object.values(PERMISSIONS.USER),
    ...Object.values(PERMISSIONS.ROLE),
    ...Object.values(PERMISSIONS.PHARMACY),
    ...Object.values(PERMISSIONS.STAFF),
    ...Object.values(PERMISSIONS.INVENTORY),
    ...Object.values(PERMISSIONS.EXAM),
    ...Object.values(PERMISSIONS.REPORTS),
  ],
  
  ADMIN: [
    PERMISSIONS.USER.MANAGE,
    PERMISSIONS.USER.VIEW,
    PERMISSIONS.ROLE.MANAGE,
    PERMISSIONS.PHARMACY.CREATE,
    PERMISSIONS.PHARMACY.EDIT,
    PERMISSIONS.PHARMACY.DELETE,
    PERMISSIONS.PHARMACY.VIEW,
    PERMISSIONS.STAFF.MANAGE,
    PERMISSIONS.EXAM.MANAGE,
    PERMISSIONS.EXAM.GRADE,
    PERMISSIONS.REPORTS.VIEW,
  ],
  
  MANAGER: [
    PERMISSIONS.PHARMACY.APPROVE,
    PERMISSIONS.PHARMACY.EDIT,
    PERMISSIONS.PHARMACY.VIEW,
    PERMISSIONS.USER.VIEW,
    PERMISSIONS.INVENTORY.MANAGE,
    PERMISSIONS.STAFF.APPROVE,
  ],
  
  PHARMACIST: [
    PERMISSIONS.PHARMACY.CREATE,
    PERMISSIONS.PHARMACY.EDIT,
    PERMISSIONS.PHARMACY.VIEW,
    PERMISSIONS.INVENTORY.MANAGE,
    PERMISSIONS.EXAM.TAKE,
    PERMISSIONS.CERTIFICATION.VIEW,
  ],
  
  PROPRIETOR: [
    PERMISSIONS.PHARMACY.OWN,
    PERMISSIONS.PHARMACY.MANAGE,
    PERMISSIONS.PHARMACY.VIEW,
    PERMISSIONS.REPORTS.VIEW,
    PERMISSIONS.STAFF.MANAGE,
  ],
  
  SALESMAN: [
    PERMISSIONS.SALES.PRODUCTS,
    PERMISSIONS.INVENTORY.VIEW,
    PERMISSIONS.SALES.PROCESS,
    PERMISSIONS.PHARMACY.VIEW,
  ],
  
  INSTRUCTOR: [
    PERMISSIONS.EXAM.MANAGE,
    PERMISSIONS.EXAM.GRADE,
    PERMISSIONS.USER.VIEW,
    PERMISSIONS.COURSE.CREATE,
  ],
  
  USER: [
    PERMISSIONS.PHARMACY.VIEW,
    PERMISSIONS.EXAM.TAKE,
    PERMISSIONS.USER.PROFILE,
  ],
} as const;

/**
 * Permission groups mapped to user types
 * This is used during registration to assign appropriate permissions
 */
export const USER_TYPE_PERMISSIONS = {
  PHARMACIST: ROLE_PERMISSIONS.PHARMACIST,
  PROPRIETOR: ROLE_PERMISSIONS.PROPRIETOR,
  MANAGER: ROLE_PERMISSIONS.MANAGER,
  SALESMAN: ROLE_PERMISSIONS.SALESMAN,
  INSTRUCTOR: ROLE_PERMISSIONS.INSTRUCTOR,
  STUDENT: [PERMISSIONS.EXAM.TAKE, PERMISSIONS.COURSE.VIEW],
  GENERAL_USER: ROLE_PERMISSIONS.USER,
} as const;

/**
 * Group paths in Keycloak
 * Used for assigning users to groups during registration
 */
export const GROUP_PATHS = {
  SUPER_ADMIN: '/System Administration/Super Administrators',
  ADMIN: '/System Administration/Administrators',
  MANAGER: '/Pharmacy Staff/Managers',
  PHARMACIST: '/Pharmacy Staff/Pharmacists',
  PROPRIETOR: '/Pharmacy Staff/Proprietors',
  SALESMAN: '/Pharmacy Staff/Salespeople',
  INSTRUCTOR: '/Education/Instructors',
  STUDENT: '/Education/Students',
  USER: '/General Users',
} as const;

/**
 * Helper type for type-safe permission checking
 */
export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS][keyof typeof PERMISSIONS[keyof typeof PERMISSIONS]];

/**
 * Helper type for type-safe role checking
 */
export type Role = keyof typeof ROLE_PERMISSIONS;

/**
 * Helper type for type-safe user type checking
 */
export type UserType = keyof typeof USER_TYPE_PERMISSIONS;

/**
 * Helper type for type-safe group path checking
 */
export type GroupPath = typeof GROUP_PATHS[keyof typeof GROUP_PATHS];
