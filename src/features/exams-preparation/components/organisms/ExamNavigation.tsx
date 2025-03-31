/**
 * ExamNavigation Component
 * 
 * A navigation component that adapts based on user's roles and permissions.
 * Shows different navigation options depending on the user's role.
 */
"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Clipboard, 
  BookOpen, 
  Settings, 
  Edit, 
  BarChart, 
  CreditCard, 
  Users 
} from 'lucide-react';
import { useExamRoleUI } from '@/features/exams-preparation/rbac';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ElementType;
}

/**
 * Role-based Exam navigation component
 * Shows different navigation options based on the user's role and permissions
 */
export const ExamNavigation: React.FC = () => {
  const pathname = usePathname();
  
  // Get role-based UI flags
  const { 
    showAdminNav,
    showCreateExam,
    showManageExams,
    showManageQuestions,
    showAllResults,
    showAnalytics,
    showPaymentSection,
    isAdmin,
    isLoading,
  } = useExamRoleUI();
  
  // Skip rendering during loading to prevent flashing
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="h-8 bg-gray-200 animate-pulse rounded-md"></div>
        <div className="h-8 bg-gray-200 animate-pulse rounded-md"></div>
        <div className="h-8 bg-gray-200 animate-pulse rounded-md"></div>
      </div>
    );
  }
  
  // Base navigation items that everyone sees
  const navItems: NavigationItem[] = [
    {
      name: 'Available Exams',
      href: '/exams',
      icon: Clipboard,
    },
    {
      name: 'My Results',
      href: '/exams/my-results',
      icon: BookOpen,
    },
  ];
  
  // Add instructor/admin items
  if (showCreateExam) {
    navItems.push({
      name: 'Create Exam',
      href: '/admin/exams/create',
      icon: Edit,
    });
  }
  
  if (showManageExams) {
    navItems.push({
      name: 'Manage Exams',
      href: '/admin/exams',
      icon: Settings,
    });
  }
  
  // Admin items
  if (showAnalytics) {
    navItems.push({
      name: 'Analytics',
      href: '/admin/exams/analytics',
      icon: BarChart,
    });
  }
  
  if (showAllResults) {
    navItems.push({
      name: 'All Results',
      href: '/admin/exams/results',
      icon: Users,
    });
  }
  
  if (showPaymentSection) {
    navItems.push({
      name: 'Payment Settings',
      href: '/admin/exams/pricing',
      icon: CreditCard,
    });
  }
  
  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`
              flex items-center px-4 py-2 text-sm font-medium rounded-md
              ${isActive
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }
            `}
          >
            <item.icon
              className={`mr-3 flex-shrink-0 h-5 w-5 ${
                isActive ? 'text-blue-500' : 'text-gray-400'
              }`}
              aria-hidden="true"
            />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default ExamNavigation;
