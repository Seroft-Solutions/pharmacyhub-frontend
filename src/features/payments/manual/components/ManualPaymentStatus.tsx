'use client';

import React, { useEffect } from 'react';
import { useUserManualRequests } from '../api/hooks/useManualPaymentApiHooks';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { ArrowRightIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';

interface ManualPaymentStatusProps {
  examId: number;
  onApproved?: () => void;
}

export const ManualPaymentStatus: React.FC<ManualPaymentStatusProps> = ({ examId, onApproved }) => {
  const router = useRouter();
  const { data: requests, isLoading, refetch } = useUserManualRequests();
  
  // Find request for this exam
  const request = requests?.find(req => Number(req.examId) === examId);
  
  useEffect(() => {
    // Refetch on mount
    refetch();
    
    // Set up polling for status updates
    const interval = setInterval(() => {
      refetch();
    }, 30000); // Poll every 30 seconds
    
    return () => clearInterval(interval);
  }, [refetch]);
  
  // Check if request is approved and call onApproved
  useEffect(() => {
    if (request?.status === 'APPROVED' && onApproved) {
      onApproved();
    }
  }, [request, onApproved]);
  
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case 'PENDING': return 'outline';
      case 'APPROVED': return 'success';
      case 'REJECTED': return 'destructive';
      default: return 'secondary';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <ClockIcon className="h-5 w-5" />;
      case 'APPROVED': return <CheckCircleIcon className="h-5 w-5" />;
      case 'REJECTED': return <XCircleIcon className="h-5 w-5" />;
      default: return null;
    }
  };
  
  const handleStartExam = () => {
    router.push(`/exam/${examId}`);
  };
  
  const handleSubmitAgain = () => {
    router.push(`/payments/manual/${examId}`);
  };
  
  if (isLoading) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="py-10 flex justify-center">
          <Spinner size="lg" />
        </CardContent>
      </Card>
    );
  }
  
  if (!request) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader>
          <CardTitle>No Payment Request Found</CardTitle>
          <CardDescription>
            You haven't submitted payment details for this exam yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSubmitAgain} className="w-full">
            Submit Payment Details
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold">Payment Status</CardTitle>
          <Badge variant={getBadgeVariant(request.status)} className="flex items-center gap-1">
            {getStatusIcon(request.status)}
            {request.status}
          </Badge>
        </div>
        <CardDescription>
          {request.examTitle}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="font-medium">{request.transactionId}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sender Number</span>
            <span className="font-medium">{request.senderNumber}</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-muted-foreground">Submitted</span>
            <span className="font-medium">{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
          </div>
          
          {request.processedAt && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Processed</span>
              <span className="font-medium">{formatDistanceToNow(new Date(request.processedAt), { addSuffix: true })}</span>
            </div>
          )}
          
          {request.adminNotes && (
            <div className="mt-4 p-3 bg-muted/40 rounded-lg">
              <span className="block text-sm font-medium mb-1">Admin Notes:</span>
              <span className="text-sm text-muted-foreground">{request.adminNotes}</span>
            </div>
          )}
        </div>
        
        {request.status === 'APPROVED' && (
          <Button onClick={handleStartExam} className="w-full flex items-center gap-2">
            Start Exam <ArrowRightIcon className="h-4 w-4" />
          </Button>
        )}
        
        {request.status === 'REJECTED' && (
          <Button onClick={handleSubmitAgain} variant="outline" className="w-full">
            Submit New Payment Details
          </Button>
        )}
        
        {request.status === 'PENDING' && (
          <div className="bg-muted/40 p-3 rounded-lg text-sm text-muted-foreground">
            Your payment is under review. This usually takes 1-2 business days.
            You will be notified once your payment is processed.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ManualPaymentStatus;