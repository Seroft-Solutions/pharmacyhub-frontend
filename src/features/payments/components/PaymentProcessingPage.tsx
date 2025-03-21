'use client';

import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { PaymentInitResponse } from '../types';

interface PaymentProcessingPageProps {
  payment: PaymentInitResponse;
  examName: string;
  amount: number;
}

export const PaymentProcessingPage: React.FC<PaymentProcessingPageProps> = ({
  payment,
  examName,
  amount
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
  
  useEffect(() => {
    // Auto-submit form to redirect to payment gateway
    if (formRef.current) {
      formRef.current.submit();
    }
  }, []);
  
  return (
    <div className="container mx-auto py-10 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>Processing your payment</CardTitle>
          <CardDescription>
            You're being redirected to the payment gateway
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Please do not close this window</AlertTitle>
            <AlertDescription>
              You will be redirected to the payment gateway to complete your purchase. Please do not close this window until the payment is complete.
            </AlertDescription>
          </Alert>
          
          <div className="mt-6 space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment for:</span>
              <span className="font-medium">{examName}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount:</span>
              <span className="font-medium">PKR {amount.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Transaction ID:</span>
              <span className="font-medium">{payment.transactionId}</span>
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
          
          {/* Hidden form for auto-submission to payment gateway */}
          <form
            ref={formRef}
            method="POST"
            action={payment.redirectUrl}
            className="hidden"
          >
            {Object.entries(payment.formParameters).map(([key, value]) => (
              <input key={key} type="hidden" name={key} value={value} />
            ))}
          </form>
        </CardContent>
        
        <CardFooter>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel and go back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};