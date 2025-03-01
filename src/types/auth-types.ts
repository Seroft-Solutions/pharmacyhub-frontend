export type Role = 
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'MANAGER'
  | 'PHARMACY_MANAGER'
  | 'USER'
  | 'PHARMACIST'
  | 'PROPRIETOR'
  | 'SALESMAN'
  | 'INSTRUCTOR';

export type Permission = 
  | 'manage_system'
  | 'manage_users'
  | 'manage_staff'
  | 'view_reports'
  | 'approve_orders'
  | 'manage_inventory'
  | 'view_products'
  | 'place_orders'
  | 'create:pharmacy'
  | 'edit:pharmacy'
  | 'delete:pharmacy'
  | 'view:pharmacy'
  | 'manage:users'
  | 'view:users'
  | 'manage:roles'
  | 'manage:exams'
  | 'take:exams'
  | 'grade:exams'
  | 'UPDATE_STATUS';

export interface TokenUser {
  id: string;
  email: string;
  name: string;
  roles: Role[];
  permissions: Permission[];
  userType?: string | null;
  accessToken?: string;
}

export interface AuthUser extends TokenUser {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
}