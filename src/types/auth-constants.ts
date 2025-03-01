import type { Permission, Role } from './auth-types';

export const DEFAULT_PERMISSIONS: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    'manage_system',
    'manage_users',
    'manage_staff',
    'view_reports',
    'approve_orders',
    'manage_inventory',
    'view_products',
    'place_orders',
    'create:pharmacy',
    'edit:pharmacy',
    'delete:pharmacy',
    'view:pharmacy',
    'manage:users',
    'view:users',
    'manage:roles',
    'manage:exams',
    'grade:exams'
  ],
  ADMIN: [
    'manage:users',
    'manage:roles',
    'manage:exams',
    'create:pharmacy',
    'edit:pharmacy',
    'delete:pharmacy',
    'view:pharmacy',
    'view:users',
    'grade:exams',
    'manage_staff',
    'view_reports',
    'approve_orders',
    'manage_inventory'
  ],
  MANAGER: [
    'view:pharmacy',
    'view:users',
    'manage_inventory',
    'view_products',
    'approve_orders',
    'view_reports',
    'manage_staff'
  ],
  PHARMACIST: [
    'create:pharmacy',
    'edit:pharmacy',
    'view:pharmacy',
    'take:exams',
    'view_products',
    'place_orders'
  ],
  USER: [
    'view:pharmacy',
    'take:exams',
    'view_products'
  ],
  INSTRUCTOR: [
    'manage:exams',
    'grade:exams',
    'view:users',
    'view_reports'
  ]
} as const;