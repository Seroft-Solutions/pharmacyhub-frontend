'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { PaymentProcessingPage } from '@/features/payments/components/PaymentProcessingPage';
import { examApiService } from '@/features/exams/api/services/examApiService';
import { paymentApiService } from '@/features/payments/api/services/paymentApiService';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

export default function PaymentProcessPage() {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('transactionId');
  const examId = searchParams.get('examId');
  
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [examData, setExamData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!transactionId || !examId) {
        setError('Missing transaction ID or exam ID');
        setLoading(false);
        return;
      }
      
      try {
        // In a real implementation, we'd need an endpoint to get payment details by transaction ID
        // For now, let's simulate this with a mock response
        const mockPaymentResponse = {
          paymentId: 123,
          transactionId,
          redirectUrl: 'https://sandbox.jazzcash.com.pk/CustomerPortal/transactionstatus.jsf',
          formParameters: {
            pp_MerchantID: '123456',
            pp_TxnRefNo: transactionId,
            // Other parameters would be here
          }
        };
        
        // Get exam data
        const examResponse = await examApiService.getExamById(parseInt(examId));
        
        setPaymentData(mockPaymentResponse);
        setExamData(examResponse.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load payment data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [transactionId, examId]);
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !paymentData || !examData) {
    return (
      <div className="container mx-auto py-10 max-w-lg">
        <Card className="p-6">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {error || 'Failed to load payment data'}
            </AlertDescription>
          </Alert>
        </Card>
      </div>
    );
  }
  
  return (
    <PaymentProcessingPage
      payment={paymentData}
      examName={examData.title}
      amount={examData.price}
    />
  );
}