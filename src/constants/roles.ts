/**
 * Role constants
 * Must be kept in sync with backend RoleConstants.java
 */
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  PHARMACY_MANAGER: 'PHARMACY_MANAGER',
  USER: 'USER',
  PHARMACIST: 'PHARMACIST',
  PROPRIETOR: 'PROPRIETOR',
  SALESMAN: 'SALESMAN',
  INSTRUCTOR: 'INSTRUCTOR',
} as const;

export type Role = keyof typeof ROLES;

/**
 * Get all role values as a list
 */
export const getAllRoles = (): string[] => {
  return Object.values(ROLES);
};

/**
 * Role hierarchy - used for UI display and checking if a role includes others
 */
export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: [ROLES.ADMIN, ROLES.MANAGER, ROLES.PHARMACY_MANAGER, ROLES.USER, ROLES.PHARMACIST, ROLES.PROPRIETOR, ROLES.SALESMAN, ROLES.INSTRUCTOR],
  [ROLES.ADMIN]: [ROLES.MANAGER, ROLES.PHARMACY_MANAGER, ROLES.USER, ROLES.PHARMACIST, ROLES.PROPRIETOR, ROLES.SALESMAN, ROLES.INSTRUCTOR],
  [ROLES.MANAGER]: [ROLES.PHARMACY_MANAGER, ROLES.USER, ROLES.PHARMACIST, ROLES.PROPRIETOR, ROLES.SALESMAN],
  [ROLES.PHARMACY_MANAGER]: [ROLES.USER, ROLES.PHARMACIST, ROLES.SALESMAN],
  [ROLES.PROPRIETOR]: [ROLES.USER],
  [ROLES.INSTRUCTOR]: [ROLES.USER],
  [ROLES.PHARMACIST]: [ROLES.USER],
  [ROLES.SALESMAN]: [ROLES.USER],
  [ROLES.USER]: [],
};

/**
 * Check if a role includes another role based on hierarchy
 */
export const roleIncludes = (userRole: string, requiredRole: string): boolean => {
  if (userRole === requiredRole) return true;
  
  const hierarchy = ROLE_HIERARCHY[userRole as Role];
  if (!hierarchy) return false;
  
  return hierarchy.includes(requiredRole as Role);
};

/**
 * Role descriptions for UI display
 */
export const ROLE_DESCRIPTIONS = {
  [ROLES.SUPER_ADMIN]: 'Full system access with ability to manage all aspects of the system',
  [ROLES.ADMIN]: 'Administrative access to manage users, roles, and system settings',
  [ROLES.MANAGER]: 'Managerial access to oversee staff and operations',
  [ROLES.PHARMACY_MANAGER]: 'Manage pharmacy operations and staff',
  [ROLES.PROPRIETOR]: 'Pharmacy owner with access to business operations',
  [ROLES.PHARMACIST]: 'Registered pharmacist with professional capabilities',
  [ROLES.SALESMAN]: 'Sales staff with limited access to customer-facing features',
  [ROLES.INSTRUCTOR]: 'Training instructor with access to educational content',
  [ROLES.USER]: 'Basic user with limited access',
};