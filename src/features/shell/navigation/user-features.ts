/**
 * User navigation features
 * These are the navigation items displayed in the user sidebar
 */
export const USER_FEATURES = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard'
  },
  {
    title: 'Exams',
    icon: 'exam',
    items: [
      {
        title: 'All Exams',
        href: '/exams',
      },
      {
        title: 'My Attempts',
        href: '/exams/attempts',
      },
      {
        title: 'Saved Exams',
        href: '/exams/saved',
      }
    ]
  },
  {
    title: 'Payments',
    icon: 'payment',
    items: [
      {
        title: 'Payment History',
        href: '/payments',
      },
      {
        title: 'Pending Payments',
        href: '/payments/pending',
      }
    ]
  },
  {
    title: 'Profile',
    icon: 'user',
    href: '/profile',
  },
  {
    title: 'Settings',
    icon: 'settings',
    href: '/settings',
  }
];

export default USER_FEATURES;