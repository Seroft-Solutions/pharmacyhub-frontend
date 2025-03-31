/**
 * AccessDeniedPage
 * 
 * A consistent page to show when a user doesn't have permission to access a route.
 * Provides clear feedback and navigation options.
 */
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExamOperation } from '../types';
import { OPERATION_DESCRIPTIONS } from '../constants';

interface AccessDeniedPageProps {
  operation: ExamOperation;
  message?: string;
  redirectUrl?: string;
  redirectLabel?: string;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({
  operation,
  message,
  redirectUrl = '/',
  redirectLabel = 'Go to Home',
}) => {
  const router = useRouter();
  const operationDescription = OPERATION_DESCRIPTIONS[operation] || operation.toString();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <div className="flex items-center mb-6">
          <AlertCircle className="h-8 w-8 text-red-500 mr-4" />
          <h1 className="text-xl font-bold text-gray-900">Access Denied</h1>
        </div>
        
        <p className="mb-4 text-gray-700">
          {message || `You don't have permission to ${operationDescription}.`}
        </p>
        
        <p className="mb-6 text-sm text-gray-500">
          If you believe you should have access to this page, please contact your administrator.
        </p>
        
        <Button onClick={() => router.push(redirectUrl)} className="w-full">
          {redirectLabel}
        </Button>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
