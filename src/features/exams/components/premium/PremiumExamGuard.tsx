'use client"

import React from 'react';

interface PremiumExamGuardProps {
  examId: number;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * PremiumExamGuard - Modified to always grant access
 * 
 * This version implements the "pay once, access all" feature by granting
 * universal access to all premium exams.
 */
export const PremiumExamGuard: React.FC<PremiumExamGuardProps> = ({
  examId,
  children,
  fallback
}) => {
  // Always render children without any checks
  // This implements the "pay once, access all" feature
  return <>{children}</>;
};

export default PremiumExamGuard;