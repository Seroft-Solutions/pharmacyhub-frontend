'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

interface PaymentResultPageProps {
  success: boolean;
  message: string;
  examId: number;
  examName: string;
}

export const PaymentResultPage: React.FC<PaymentResultPageProps> = ({
  success,
  message,
  examId,
  examName
}) => {
  const router = useRouter();
  
  const handleContinue = () => {
    if (success) {
      // Redirect to exam page
      router.push(`/exam/${examId}`);
    } else {
      // Go back to exam list
      router.push('/exam');
    }
  };
  
  return (
    <div className="container mx-auto py-10 max-w-lg">
      <Card>
        <CardHeader>
          <CardTitle>
            {success ? 'Payment Successful' : 'Payment Failed'}
          </CardTitle>
          <CardDescription>
            {success 
              ? `Your payment for ${examName} has been processed successfully.` 
              : 'There was an issue processing your payment.'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Alert variant={success ? "default" : "destructive"}>
            {success 
              ? <CheckCircle2 className="h-4 w-4" /> 
              : <XCircle className="h-4 w-4" />}
            <AlertTitle>
              {success ? 'Thank you for your purchase' : 'Payment not completed'}
            </AlertTitle>
            <AlertDescription>
              {message}
            </AlertDescription>
          </Alert>
          
          {success && (
            <div className="mt-6">
              <p className="text-center">
                You now have access to the premium exam content. You can start the exam immediately or access it later from your exams dashboard.
              </p>
            </div>
          )}
          
          {!success && (
            <div className="mt-6">
              <p className="text-center">
                You can try again or choose a different payment method.
              </p>
            </div>
          )}
        </CardContent>
        
        <CardFooter>
          <Button 
            variant="default" 
            className="w-full" 
            onClick={handleContinue}
          >
            {success 
              ? 'Continue to Exam' 
              : 'Return to Exams'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};