'use client';

import React, { useEffect, useState } from 'react';
import { useUserManualRequests } from '../api/hooks/useManualPaymentApiHooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { ArrowRightIcon, CheckCircleIcon, XCircleIcon, ClockIcon, Send, ImageIcon, ExternalLinkIcon } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface ManualPaymentStatusProps {
  examId: number;
  onApproved?: () => void;
}

export const ManualPaymentStatus: React.FC<ManualPaymentStatusProps> = ({ examId, onApproved }) => {
  const router = useRouter();
  const { data: requests, isLoading, refetch } = useUserManualRequests();
  
  // State for screenshot URLs
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  
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
  
  // Process screenshot data when request changes
  useEffect(() => {
    if (request?.screenshotData) {
      // Create data URL from base64 data
      const dataUrl = `data:image/jpeg;base64,${request.screenshotData}`;
      setScreenshotUrl(dataUrl);
      console.log('Screenshot data found, created URL');
    } else if (request?.attachmentUrl) {
      // Use attachment URL if available
      setScreenshotUrl(request.attachmentUrl);
      console.log('Using attachment URL');
    } else {
      // Reset if no screenshot data
      setScreenshotUrl(null);
      console.log('No screenshot data found');
    }
  }, [request]);
  
  // Debug log for the payment request data
  useEffect(() => {
    if (request) {
      console.log('Payment request data:', {
        id: request.id,
        examId: request.examId,
        attachmentUrl: request.attachmentUrl,
        screenshotData: request.screenshotData ? `${request.screenshotData.substring(0, 20)}... (truncated)` : null,
        status: request.status,
        screenshotUrl
      });
    }
  }, [request, screenshotUrl]);
  
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
  
  // Handle WhatsApp sharing
  const shareToWhatsApp = () => {
    if (!request) return;
    
    // The WhatsApp phone number (include country code)
    const phoneNumber = '923137020758'; // Include country code
    
    // Craft message text
    const messageText = `*Payment Status Request*%0A
- Exam: ${request.examTitle}%0A
- Sender: ${request.senderNumber}%0A
- Transaction ID: ${request.transactionId}%0A
- Request ID: ${request.id}%0A
- Submitted: ${formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}`;
    
    // Open WhatsApp with the message
    window.open(`https://wa.me/${phoneNumber}?text=${messageText}`, '_blank');
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
          <div className="grid grid-cols-2 gap-2">
            <span className="text-muted-foreground">Transaction ID</span>
            <span className="font-medium text-right">{request.transactionId}</span>
            
            <span className="text-muted-foreground">Sender Number</span>
            <span className="font-medium text-right">{request.senderNumber}</span>
            
            <span className="text-muted-foreground">Submitted</span>
            <span className="font-medium text-right">{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</span>
            
            {request.processedAt && (
              <>
                <span className="text-muted-foreground">Processed</span>
                <span className="font-medium text-right">{formatDistanceToNow(new Date(request.processedAt), { addSuffix: true })}</span>
              </>
            )}
          </div>
          
          {/* Screenshot display - always show a placeholder or image */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Payment Screenshot:</span>
              {screenshotUrl && (
                <a 
                  href={screenshotUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 flex items-center gap-1 hover:underline"
                >
                  <ExternalLinkIcon className="h-3 w-3" />
                  View full size
                </a>
              )}
            </div>
            <div className="relative border rounded-lg overflow-hidden">
              <div className="aspect-video bg-muted flex items-center justify-center">
                {screenshotUrl ? (
                  <img 
                    src={screenshotUrl} 
                    alt="Payment Screenshot" 
                    className="max-h-full w-auto object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon className="h-10 w-10 mb-2" />
                    <span className="text-sm">Screenshot submitted</span>
                    <span className="text-xs mt-1">Processing...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
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
          <>
            <div className="bg-muted/40 p-3 rounded-lg text-sm text-muted-foreground mb-4">
              <p>Your payment is under review. This usually takes 1-2 business days.</p>
              <p className="mt-1">You will be notified once your payment is processed.</p>
            </div>
            
            {/* WhatsApp button for status inquiries */}
            <Button 
              variant="outline" 
              className="w-full flex items-center justify-center gap-2 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700"
              onClick={shareToWhatsApp}
            >
              <Send className="h-4 w-4" />
              Check Status on WhatsApp
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ManualPaymentStatus;