/**
 * Core roles definition for the application
 */

/**
 * Application Roles
 * Defines all user roles available in the system
 */
export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  PHARMACIST = 'PHARMACIST',
  PHARMACY_MANAGER = 'PHARMACY_MANAGER',
  TECHNICIAN = 'TECHNICIAN',
  PROPRIETOR = 'PROPRIETOR',
  USER = 'USER'
}

/**
 * Role metadata with display names and descriptions
 */
export const ROLE_METADATA: Record<Role, { name: string; description: string }> = {
  [Role.SUPER_ADMIN]: {
    name: 'Super Administrator',
    description: 'Complete access to all system functions and settings'
  },
  [Role.ADMIN]: {
    name: 'Administrator',
    description: 'Manages users, content, and system settings'
  },
  [Role.PHARMACIST]: {
    name: 'Pharmacist',
    description: 'Licensed pharmacy professional with clinical responsibilities'
  },
  [Role.PHARMACY_MANAGER]: {
    name: 'Pharmacy Manager',
    description: 'Manages pharmacy operations and staff'
  },
  [Role.TECHNICIAN]: {
    name: 'Pharmacy Technician',
    description: 'Assists pharmacists with technical tasks and customer service'
  },
  [Role.PROPRIETOR]: {
    name: 'Business Owner',
    description: 'Owns or operates one or more pharmacy locations'
  },
  [Role.USER]: {
    name: 'Standard User',
    description: 'Basic access to non-administrative features'
  }
};

/**
 * Role hierarchy defines which roles implicitly include other roles.
 * The key role automatically includes permissions from all the roles in its value array.
 */
export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  [Role.SUPER_ADMIN]: [Role.ADMIN, Role.PHARMACY_MANAGER, Role.PHARMACIST, Role.TECHNICIAN, Role.PROPRIETOR, Role.USER],
  [Role.ADMIN]: [Role.PHARMACY_MANAGER, Role.USER],
  [Role.PHARMACY_MANAGER]: [Role.PHARMACIST, Role.USER],
  [Role.PHARMACIST]: [Role.USER],
  [Role.TECHNICIAN]: [Role.USER],
  [Role.PROPRIETOR]: [Role.USER],
  [Role.USER]: []
};
