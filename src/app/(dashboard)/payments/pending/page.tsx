'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ManualPaymentStatus } from '@/features/payments/manual/components/ManualPaymentStatus';
import { useUserManualRequests } from '@/features/payments/manual/api/hooks/useManualPaymentApiHooks';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon } from 'lucide-react';

export default function PendingPaymentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examIdParam = searchParams.get('examId');
  
  // Convert examId to number if present
  const examId = examIdParam ? parseInt(examIdParam) : null;
  
  const { data: requests, isLoading } = useUserManualRequests();
  
  // If examId is provided, show status for just that exam
  if (examId) {
    return (
      <div className="container py-8 max-w-4xl">
        <ManualPaymentStatus 
          examId={examId}
          onApproved={() => router.push(`/exam/${examId}`)}
        />
      </div>
    );
  }
  
  // Otherwise, show all user payment requests
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner size="lg" />
      </div>
    );
  }
  
  if (!requests || requests.length === 0) {
    return (
      <div className="container py-8 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Your Payment Requests</h1>
        <div className="text-center py-12 bg-muted/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">No Payment Requests</h2>
          <p className="text-muted-foreground mb-4">
            You haven't submitted any payment requests yet.
          </p>
          <Button onClick={() => router.push('/exams')}>
            Browse Exams
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Your Payment Requests</h1>
      
      <div className="space-y-6">
        {requests.map((request) => (
          <div 
            key={request.id}
            className="border rounded-lg p-4 hover:bg-muted/10 transition-colors cursor-pointer"
            onClick={() => router.push(`/payments/pending?examId=${request.examId}`)}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{request.examTitle}</h3>
                <p className="text-sm text-muted-foreground">Transaction ID: {request.transactionId}</p>
              </div>
              <div>
                {getStatusBadge(request.status)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Helper function to render status badge
function getStatusBadge(status: string) {
  const baseClass = "px-2 py-1 rounded-full text-xs font-medium";
  
  switch (status) {
    case 'PENDING':
      return <span className={`${baseClass} bg-yellow-100 text-yellow-700`}>Pending</span>;
    case 'APPROVED':
      return <span className={`${baseClass} bg-green-100 text-green-700`}>Approved</span>;
    case 'REJECTED':
      return <span className={`${baseClass} bg-red-100 text-red-700`}>Rejected</span>;
    default:
      return <span className={`${baseClass} bg-gray-100 text-gray-700`}>{status}</span>;
  }
}