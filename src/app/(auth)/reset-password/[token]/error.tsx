"use client";
 
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Reset password error:", error);
  }, [error]);
 
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="size-16 rounded-full bg-red-100 flex items-center justify-center p-4">
              <AlertCircle className="text-red-600 h-8 w-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Error</CardTitle>
          <CardDescription className="text-center">
            Something went wrong while resetting your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-red-50 border border-red-100 rounded-md">
            <p className="text-sm text-red-800">
              {error?.message || "An unexpected error occurred"}
            </p>
            {error?.digest && (
              <p className="text-xs text-red-600 mt-2">
                Error reference: {error.digest}
              </p>
            )}
          </div>
          <div className="mt-6 space-y-4">
            <Button 
              onClick={reset}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Try again
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center justify-center p-6 border-t bg-gray-50">
          <p className="text-sm text-gray-600">
            <Link 
              href="/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              Request a new password reset link
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
