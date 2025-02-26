/**
 * Permission constants
 * Must be kept in sync with backend PermissionConstants.java
 */
export const PERMISSIONS = {
  // User Management
  MANAGE_USERS: 'manage:users',
  VIEW_USERS: 'view:users',
  
  // Pharmacy Management
  CREATE_PHARMACY: 'create:pharmacy',
  EDIT_PHARMACY: 'edit:pharmacy',
  DELETE_PHARMACY: 'delete:pharmacy',
  VIEW_PHARMACY: 'view:pharmacy',
  
  // Pharmacist Management
  CREATE_PHARMACIST: 'create:pharmacist',
  UPDATE_PHARMACIST: 'update:pharmacist',
  VIEW_PHARMACIST: 'view:pharmacist',
  VIEW_ALL_PHARMACISTS: 'view:all:pharmacists',
  DELETE_PHARMACIST: 'delete:pharmacist',
  
  // Connection Management
  MANAGE_CONNECTIONS: 'manage:connections',
  VIEW_CONNECTIONS: 'view:connections',
  VIEW_ALL_CONNECTIONS: 'view:all:connections',
  APPROVE_CONNECTIONS: 'approve:connections',
  REJECT_CONNECTIONS: 'reject:connections',
  
  // Role Management
  MANAGE_ROLES: 'manage:roles',
  
  // Permission Management
  MANAGE_PERMISSIONS: 'manage:permissions',
  
  // Group Management
  MANAGE_GROUPS: 'manage:groups',
  
  // Exam Management
  MANAGE_EXAMS: 'manage:exams',
  TAKE_EXAMS: 'take:exams',
  GRADE_EXAMS: 'grade:exams',
  
  // System Management
  MANAGE_SYSTEM: 'manage:system',
  MANAGE_SYSTEM_SETTINGS: 'manage:system:settings',
  
  // Audit Management
  VIEW_AUDIT_LOGS: 'view:audit:logs',
  VIEW_OWN_AUDIT_LOGS: 'view:own:audit:logs',
  EXPORT_AUDIT_LOGS: 'export:audit:logs',
  
  // Order Management
  APPROVE_ORDERS: 'approve:orders',
  PLACE_ORDERS: 'place:orders',
  
  // Inventory Management
  MANAGE_INVENTORY: 'manage:inventory',
  VIEW_PRODUCTS: 'view:products',
  
  // Reports
  VIEW_REPORTS: 'view:reports',
  
  // Status Updates
  UPDATE_STATUS: 'update:status',
} as const;

export type Permission = keyof typeof PERMISSIONS;

/**
 * Get all permission values as a list
 */
export const getAllPermissions = (): string[] => {
  return Object.values(PERMISSIONS);
};

/**
 * Group permissions by category for UI display
 */
export const PERMISSION_CATEGORIES = {
  USER_MANAGEMENT: [
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_USERS,
  ],
  PHARMACY_MANAGEMENT: [
    PERMISSIONS.CREATE_PHARMACY,
    PERMISSIONS.EDIT_PHARMACY,
    PERMISSIONS.DELETE_PHARMACY,
    PERMISSIONS.VIEW_PHARMACY,
  ],
  PHARMACIST_MANAGEMENT: [
    PERMISSIONS.CREATE_PHARMACIST,
    PERMISSIONS.UPDATE_PHARMACIST,
    PERMISSIONS.VIEW_PHARMACIST,
    PERMISSIONS.VIEW_ALL_PHARMACISTS,
    PERMISSIONS.DELETE_PHARMACIST,
  ],
  CONNECTION_MANAGEMENT: [
    PERMISSIONS.MANAGE_CONNECTIONS,
    PERMISSIONS.VIEW_CONNECTIONS,
    PERMISSIONS.VIEW_ALL_CONNECTIONS,
    PERMISSIONS.APPROVE_CONNECTIONS,
    PERMISSIONS.REJECT_CONNECTIONS,
  ],
  ROLE_MANAGEMENT: [
    PERMISSIONS.MANAGE_ROLES,
    PERMISSIONS.MANAGE_PERMISSIONS,
    PERMISSIONS.MANAGE_GROUPS,
  ],
  EXAM_MANAGEMENT: [
    PERMISSIONS.MANAGE_EXAMS,
    PERMISSIONS.TAKE_EXAMS,
    PERMISSIONS.GRADE_EXAMS,
  ],
  SYSTEM_MANAGEMENT: [
    PERMISSIONS.MANAGE_SYSTEM,
    PERMISSIONS.MANAGE_SYSTEM_SETTINGS,
  ],
  AUDIT_MANAGEMENT: [
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.VIEW_OWN_AUDIT_LOGS,
    PERMISSIONS.EXPORT_AUDIT_LOGS,
  ],
  ORDER_MANAGEMENT: [
    PERMISSIONS.APPROVE_ORDERS,
    PERMISSIONS.PLACE_ORDERS,
  ],
  INVENTORY_MANAGEMENT: [
    PERMISSIONS.MANAGE_INVENTORY,
    PERMISSIONS.VIEW_PRODUCTS,
  ],
  REPORTING: [
    PERMISSIONS.VIEW_REPORTS,
  ],
  STATUS_MANAGEMENT: [
    PERMISSIONS.UPDATE_STATUS,
  ],
};