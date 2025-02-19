export interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  avatar?: string;
  phoneNumber?: string;
  address?: string;
}

export type UserRole = 'admin' | 'pharmacist' | 'pharmacy-manager' | 'proprietor' | 'salesman';

export const USER_ROLES: Record<UserRole, string> = {
  admin: 'Administrator',
  pharmacist: 'Pharmacist',
  'pharmacy-manager': 'Pharmacy Manager',
  proprietor: 'Proprietor',
  salesman: 'Salesman'
};