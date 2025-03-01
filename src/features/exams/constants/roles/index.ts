/**
 * Exams Feature Role Requirements
 * 
 * Defines which roles have access to the exams feature.
 */
import { Role } from '@/features/rbac/constants/roles';

/**
 * Roles that have access to the exams feature by default
 */
export const EXAMS_REQUIRED_ROLES = [
  Role.USER,
  Role.PHARMACIST,
  Role.PHARMACY_MANAGER,
  Role.TECHNICIAN,
  Role.ADMIN,
  Role.SUPER_ADMIN
];

/**
 * Roles that have admin privileges for exams
 */
export const EXAMS_ADMIN_ROLES = [
  Role.ADMIN,
  Role.SUPER_ADMIN,
  Role.PHARMACY_MANAGER
];
