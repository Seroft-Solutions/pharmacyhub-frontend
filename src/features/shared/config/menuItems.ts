/**
 * Menu Items Configuration
 */

import { MenuItem } from '@/features/shared/types';
import { 
  Home, 
  Settings,
  Users, 
  Package, 
  FileText, 
  GraduationCap,
  Handshake,
  Phone,
  BarChart
} from 'lucide-react';

/**
 * Main menu items configuration
 */
export const menuItems: MenuItem[] = [
  { 
    id: 'dashboard',
    label: 'Dashboard', 
    href: '/dashboard', 
    icon: Home,
    requiresAuthentication: true
  },
  { 
    id: 'exam',
    label: 'Exam Practice', 
    href: '/exam', 
    icon: GraduationCap,
    roles: ['USER', 'STUDENT']
  },
  { 
    id: 'licensing',
    label: 'Licensing', 
    href: '/licensing', 
    icon: Handshake,
    roles: ['ADMIN', 'MANAGER'],
    subItems: [
      { 
        id: 'pharmacists',
        label: 'Pharmacists', 
        href: '/licensing/pharmacist', 
        icon: Users,
        permissions: ['manage_pharmacists']
      },
      { 
        id: 'pharmacy-managers',
        label: 'Pharmacy Managers', 
        href: '/licensing/pharmacy-manager', 
        icon: Phone,
        permissions: ['manage_pharmacy_managers']
      },
      { 
        id: 'proprietors',
        label: 'Proprietors', 
        href: '/licensing/proprietor', 
        icon: Handshake,
        permissions: ['manage_proprietors']
      },
      { 
        id: 'salesmen',
        label: 'Salesmen', 
        href: '/licensing/salesman', 
        icon: Phone,
        permissions: ['manage_salesmen']
      }
    ]
  },
  { 
    id: 'inventory',
    label: 'Inventory', 
    href: '/dashboard/inventory', 
    icon: Package,
    permissions: ['manage_inventory', 'view_products']
  },
  { 
    id: 'reports',
    label: 'Reports', 
    href: '/dashboard/reports', 
    icon: FileText,
    permissions: ['view_reports']
  },
  { 
    id: 'analytics',
    label: 'Analytics', 
    href: '/dashboard/analytics', 
    icon: BarChart,
    roles: ['ADMIN', 'MANAGER'],
    permissions: ['view_analytics']
  },
  { 
    id: 'settings',
    label: 'Settings', 
    href: '/dashboard/settings', 
    icon: Settings,
    roles: ['ADMIN', 'SUPER_ADMIN', 'MANAGER']
  },
];

/**
 * Admin-specific menu items
 */
export const adminMenuItems: MenuItem[] = [
  { 
    id: 'admin-dashboard',
    label: 'Admin Dashboard', 
    href: '/admin', 
    icon: Home,
    roles: ['ADMIN', 'SUPER_ADMIN'],
  },
  { 
    id: 'admin-users',
    label: 'User Management', 
    href: '/admin/users', 
    icon: Users,
    roles: ['ADMIN', 'SUPER_ADMIN'],
    permissions: ['manage_users']
  },
  { 
    id: 'admin-permissions',
    label: 'Permissions & Roles', 
    href: '/admin/permissions', 
    icon: FileText,
    roles: ['SUPER_ADMIN'],
    permissions: ['manage_permissions', 'manage_roles']
  },
];

/**
 * Mobile menu items (simplified for mobile views)
 */
export const mobileMenuItems: MenuItem[] = menuItems.map(item => ({
  ...item,
  subItems: item.subItems ? item.subItems.slice(0, 3) : undefined // Limit deep nesting on mobile
}));

export default menuItems;
