'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/page-header';
import { DashboardShell } from '@/components/shells/dashboard-shell';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCheckExamAccessMutation } from '@/features/payments/api/hooks';
import { Loader2Icon, ClockIcon, CheckCircleIcon, XCircleIcon, RefreshCwIcon } from 'lucide-react';

export default function PaymentPendingPage({ params }: { params: { examId: string } }) {
  const router = useRouter();
  const examId = parseInt(params.examId);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [countdown, setCountdown] = useState(30);
  
  // Check if payment has completed
  const { data, isLoading, error, refetch } = useCheckExamAccessMutation(examId);
  
  // Auto refresh every 30 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => prev > 0 ? prev - 1 : 30);
      
      if (countdown <= 0) {
        setRefreshCounter(prev => prev + 1);
        refetch();
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [countdown, refetch]);
  
  // Effect for redirecting when access is granted
  useEffect(() => {
    if (data?.hasAccess) {
      // Redirect to exam page after short delay
      const timer = setTimeout(() => {
        router.push(`/dashboard/exams/${examId}`);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [data, router, examId]);
  
  // Handle manual refresh
  const handleRefresh = () => {
    setCountdown(30);
    refetch();
  };
  
  // Handle return to exam
  const handleReturnToExam = () => {
    router.push(`/dashboard/exams/${examId}`);
  };
  
  // Handle go to history
  const handleGoToHistory = () => {
    router.push('/dashboard/payments/history');
  };

  return (
    <DashboardShell>
      <PageHeader
        heading="Payment Processing"
        description="We're waiting for your payment to be confirmed"
      />
      
      <Card className="max-w-xl mx-auto">
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <div className="flex justify-center py-6">
                <Loader2Icon className="h-12 w-12 animate-spin text-primary" />
              </div>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertDescription>
                {error instanceof Error ? error.message : 'Error checking payment status'}
              </AlertDescription>
            </Alert>
          ) : data?.hasAccess ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircleIcon className="h-16 w-16 mx-auto text-success" />
              <h2 className="text-2xl font-semibold text-success">Payment Complete</h2>
              <p className="text-muted-foreground">
                Your payment has been successfully processed. You now have access to this exam.
              </p>
              <p className="text-sm">
                Redirecting you to the exam page...
              </p>
            </div>
          ) : (
            <div className="space-y-6 py-4">
              <div className="flex items-center justify-center gap-4">
                <ClockIcon className="h-12 w-12 text-amber-500 animate-pulse" />
                <div>
                  <h2 className="text-xl font-semibold">Payment Pending</h2>
                  <p className="text-muted-foreground">
                    We're waiting for your payment to be confirmed.
                  </p>
                </div>
              </div>
              
              <div className="bg-muted/30 p-4 rounded-md">
                <h3 className="font-medium mb-2">What happens next?</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Complete the payment process in the payment gateway window</li>
                  <li>Once payment is confirmed, this page will automatically update</li>
                  <li>You'll be redirected to the exam page to start your exam</li>
                  <li>If you've already completed payment, try refreshing this page</li>
                </ul>
              </div>
              
              <div className="flex justify-center items-center gap-2 text-sm text-muted-foreground">
                <RefreshCwIcon className="h-4 w-4" />
                <span>Refreshing in {countdown} seconds...</span>
              </div>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row gap-2 justify-end">
          {!data?.hasAccess && (
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <RefreshCwIcon className="h-4 w-4" />
              Refresh Now
            </Button>
          )}
          
          <Button 
            onClick={data?.hasAccess ? handleReturnToExam : handleGoToHistory}
            className="flex items-center gap-2"
          >
            {data?.hasAccess ? 'Go to Exam' : 'View Payment History'}
          </Button>
        </CardFooter>
      </Card>
    </DashboardShell>
  );
}
