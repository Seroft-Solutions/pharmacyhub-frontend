'use client';

import React from 'react';
import { Spinner } from '@/components/ui/spinner';
import usePremiumStatus from '../hooks/usePremiumStatus';

interface PremiumAccessGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  renderWithAccessState?: boolean;
}

/**
 * PremiumAccessGuard - Universal premium access guard for the whole application
 * 
 * This component provides the "pay once, access all" functionality by checking if
 * the user has a premium subscription and passing this information to its children.
 * 
 * Key features:
 * - Checks localStorage first for fast rendering
 * - Falls back to API checks for payment history and manual payment approvals
 * - Persists premium status to localStorage for future visits
 * - Passes isPremium and isLoading states to children when renderWithAccessState is true
 */
export const PremiumAccessGuard: React.FC<PremiumAccessGuardProps> = ({
  children,
  fallback,
  renderWithAccessState = false
}) => {
  // Use the central premium status hook
  const { isPremium, isLoading, error } = usePremiumStatus();
  
  // Debug logging
  if (process.env.NODE_ENV === 'development') {
    console.log('PremiumAccessGuard status:', { isPremium, isLoading, error });
  }
  
  // If we're just passing the premium status to children without filtering
  if (renderWithAccessState) {
    // Clone the children and add the premium status props
    return (
      <>
        {React.Children.map(children, child => {
          // Only add props to valid React elements
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { 
              isPremium, 
              isCheckingPremium: isLoading,
              ...child.props 
            });
          }
          return child;
        })}
      </>
    );
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <Spinner size="md" />
        <span className="ml-2 text-sm">Checking access...</span>
      </div>
    );
  }
  
  // Just render children normally - no access restriction needed
  // This is different from PremiumExamGuard which restricts access to specific content
  return <>{children}</>;
};

export default PremiumAccessGuard;