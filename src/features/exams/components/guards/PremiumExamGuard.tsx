import React, { ReactNode } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { usePremiumExam } from '../../hooks/usePremiumExam';

interface PremiumExamGuardProps {
  examId: number;
  children: ReactNode;
  redirectIfNotPaid?: boolean;
  fallback?: ReactNode;
}

/**
 * Guard component that ensures user has access to premium exam
 */
export const PremiumExamGuard: React.FC<PremiumExamGuardProps> = ({
  examId,
  children,
  redirectIfNotPaid = true,
  fallback
}) => {
  const { hasAccess, isLoading } = usePremiumExam(examId, redirectIfNotPaid);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-2">Access Restricted</h2>
        <p className="text-muted-foreground">
          This is a premium exam that requires payment to access.
        </p>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default PremiumExamGuard;