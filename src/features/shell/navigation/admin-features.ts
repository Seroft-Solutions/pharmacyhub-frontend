import { PERMISSIONS } from '@/features/core/rbac/permissions';

/**
 * Admin navigation features
 * These are the navigation items displayed in the admin sidebar
 */
export const ADMIN_FEATURES = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: 'dashboard'
  },
  {
    title: 'Exam Management',
    icon: 'exam',
    items: [
      {
        title: 'All Exams',
        href: '/admin/exams',
        permission: PERMISSIONS.EXAMS.VIEW_EXAMS
      },
      {
        title: 'Create Exam',
        href: '/admin/exams/create',
        permission: PERMISSIONS.EXAMS.CREATE_EXAMS
      },
      {
        title: 'Questions Bank',
        href: '/admin/questions',
        permission: PERMISSIONS.EXAMS.MANAGE_QUESTIONS
      }
    ]
  },
  {
    title: 'User Management',
    icon: 'users',
    items: [
      {
        title: 'All Users',
        href: '/admin/users',
        permission: PERMISSIONS.AUTH.VIEW_USERS
      },
      {
        title: 'User Roles',
        href: '/admin/users/roles',
        permission: PERMISSIONS.AUTH.MANAGE_USERS
      }
    ]
  },
  {
    title: 'Payments',
    icon: 'payment',
    items: [
      {
        title: 'Payment History',
        href: '/admin/payments',
        permission: PERMISSIONS.PAYMENTS.VIEW_PAYMENTS
      },
      {
        title: 'Manual Payments',
        href: '/admin/payments/manual',
        permission: PERMISSIONS.PAYMENTS.MANAGE_MANUAL_PAYMENTS
      }
    ]
  },
  {
    title: 'Reports',
    icon: 'chart',
    href: '/admin/reports',
  },
  {
    title: 'Settings',
    icon: 'settings',
    href: '/admin/settings'
  }
];

export default ADMIN_FEATURES;