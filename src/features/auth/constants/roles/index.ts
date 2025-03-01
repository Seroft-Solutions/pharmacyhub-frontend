/**
 * Auth Feature Role Requirements
 * 
 * Defines which roles have access to the auth feature.
 */
import { Role } from '@/features/rbac/constants/roles';

/**
 * Roles that have access to the auth feature by default
 * (basically all roles since auth is a core feature)
 */
export const AUTH_REQUIRED_ROLES = [
  Role.USER,
  Role.PHARMACIST,
  Role.PHARMACY_MANAGER,
  Role.TECHNICIAN,
  Role.PROPRIETOR,
  Role.ADMIN,
  Role.SUPER_ADMIN
];

/**
 * Roles that have user management privileges
 */
export const AUTH_ADMIN_ROLES = [
  Role.ADMIN,
  Role.SUPER_ADMIN
];
