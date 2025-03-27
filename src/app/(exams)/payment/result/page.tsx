'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PaymentResultPage } from '@/features/payments/components/PaymentResultPage';
import { examApiService } from '@/features/exams/api/services/examApiService';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

// Loading component for suspense fallback
function PaymentResultLoading() {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <span className="ml-2 text-lg">Loading payment result...</span>
    </div>
  );
}

// Main component with search params
function PaymentResultContent() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('pp_TxnRefNo');
  const responseCode = searchParams.get('pp_ResponseCode');
  const examId = searchParams.get('examId');
  
  const [loading, setLoading] = useState(true);
  const [examData, setExamData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!examId) {
        setError('Missing exam ID');
        setLoading(false);
        return;
      }
      
      try {
        // Get exam data
        const examResponse = await examApiService.getExamById(parseInt(examId));
        
        setExamData(examResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load exam data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [examId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !examData) {
    return (
      <div className="container mx-auto py-10 max-w-lg">
        <Card className="p-6">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error || 'Failed to load exam data'}
            </AlertDescription>
          </Alert>
        </Card>
      </div>
    );
  }
  
  const success = responseCode === '000';
  const message = success 
    ? 'Your payment has been processed successfully. You now have access to the exam.' 
    : 'Your payment could not be processed. Please try again or contact support.';
  
  return (
    <PaymentResultPage
      success={success}
      message={message}
      examId={parseInt(examId)}
      examName={examData.title}
    />
  );
}

// Export the wrapped component
export default function PaymentResultPageContainer() {
  return (
    <Suspense fallback={<PaymentResultLoading />}>
      <PaymentResultContent />
    </Suspense>
  );
}