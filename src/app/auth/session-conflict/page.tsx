'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAntiSharingStore } from '@/features/core/app-auth/anti-sharing/store';
import { API_BASE_URLS } from '@/features/core/app-auth/api/constants/endpoints';

export default function SessionConflictPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const handleCancel = () => {
    router.push('/login');
  };
  
  const handleForceLogout = async () => {
    try {
      setIsLoading(true);
      
      // Call backend API to force logout other sessions
      const userId = localStorage.getItem('user_id'); // This should be securely stored elsewhere
      
      const response = await fetch(`${API_BASE_URLS.SESSIONS}/users/${userId}/terminate-others`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}` // This should be securely stored elsewhere
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to logout other sessions');
      }
      
      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (err) {
      console.error('Error forcing logout:', err);
      setError(err instanceof Error ? err.message : 'Failed to logout other sessions');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-6 w-6 text-amber-500" />
            <CardTitle>Session Conflict</CardTitle>
          </div>
          <CardDescription>
            You are already logged in on another device
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            Your account is currently active on another device or browser. PharmacyHub only allows one active session per account for security reasons.
          </p>
          
          <p className="text-sm text-gray-600 mb-4">
            You can either:
          </p>
          
          <ul className="list-disc pl-5 text-sm text-gray-600 mb-4 space-y-1">
            <li>Log out from the other device and try again</li>
            <li>Force logout from all other devices and continue</li>
          </ul>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-md text-sm my-4">
              {error}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button 
            onClick={handleForceLogout} 
            disabled={isLoading}
            className="bg-amber-500 hover:bg-amber-600"
          >
            {isLoading ? 'Processing...' : 'Force Logout Other Devices'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
