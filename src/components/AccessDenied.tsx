'use client';

import React from 'react';
import { AlertTriangleIcon, HomeIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface AccessDeniedProps {
  message?: string;
  redirectPath?: string;
  redirectText?: string;
}

/**
 * AccessDenied component
 * Displays a standardized access denied message when a user doesn't have permission
 */
export const AccessDenied: React.FC<AccessDeniedProps> = ({
  message = "You don't have permission to access this page.",
  redirectPath = '/dashboard',
  redirectText = 'Go to Dashboard',
}) => {
  const router = useRouter();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-amber-100 p-3 rounded-full">
            <AlertTriangleIcon className="h-8 w-8 text-amber-600" />
          </div>
        </div>
        <CardTitle className="text-xl">Access Denied</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      
      <CardContent className="text-center text-muted-foreground">
        <p>Please contact an administrator if you believe this is an error.</p>
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Button
          onClick={() => router.push(redirectPath)}
          className="gap-2"
        >
          <HomeIcon className="h-4 w-4" />
          {redirectText}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccessDenied;