"use client"

import React, { useState, useEffect } from 'react';
import { CreditCardIcon, ChevronsLeftIcon, CheckIcon, ArrowRightIcon, BanknoteIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { useInitiateExamPaymentMutation } from '@/features/payments/api/hooks';
import { PaymentMethod } from '@/features/payments/types';

interface PaymentFlowProps {
  examId: number;
  price: number;
  onComplete: () => void;
  onCancel: () => void;
}

/**
 * PaymentFlow
 * 
 * Component that handles the payment process for a premium exam
 */
export const PaymentFlow: React.FC<PaymentFlowProps> = ({
  examId,
  price,
  onComplete,
  onCancel
}) => {
  const [step, setStep] = useState<'method' | 'processing' | 'complete' | 'error'>('method');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.JAZZCASH);
  const [error, setError] = useState<string | null>(null);
  
  // Get initiate payment mutation
  const { 
    mutateAsync: initiatePayment,
    isLoading: isInitiating,
    isError: isInitiateError,
    error: initiateError,
  } = useInitiateExamPaymentMutation();
  
  // Handle payment method change
  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setError(null);
  };
  
  // Handle payment initiation
  const handleContinue = async () => {
    try {
      setError(null);
      setStep('processing');
      
      // Initiate payment
      const response = await initiatePayment({
        examId,
        method: paymentMethod
      });
      
      // Check if we have a redirect URL
      if (response.redirectUrl) {
        // Redirect to payment gateway
        window.location.href = response.redirectUrl;
      } else if (response.formParameters) {
        // For form-based payment methods, create and submit a form
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = response.gatewayUrl || '';
        form.style.display = 'none';
        
        // Add parameters as hidden inputs
        Object.entries(response.formParameters).forEach(([key, value]) => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = String(value);
          form.appendChild(input);
        });
        
        // Add form to document and submit
        document.body.appendChild(form);
        form.submit();
      } else {
        // No redirect or form, this is unusual
        setStep('error');
        setError('Invalid payment response. Please try again.');
      }
    } catch (err) {
      console.error('Payment initiation error:', err);
      setStep('error');
      setError(`Payment initiation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };
  
  // Render different steps of the payment flow
  const renderStep = () => {
    switch (step) {
      case 'method':
        return (
          <>
            <CardHeader>
              <CardTitle>Choose Payment Method</CardTitle>
              <CardDescription>
                Select how you would like to make your payment
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(value) => handlePaymentMethodChange(value as PaymentMethod)}
                className="space-y-4"
              >
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value={PaymentMethod.JAZZCASH} id="jazzcash" />
                  <Label htmlFor="jazzcash" className="flex flex-1 items-center gap-3 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                      <BanknoteIcon className="h-4 w-4 text-red-600" />
                    </div>
                    <div>JazzCash</div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value={PaymentMethod.EASYPAISA} id="easypaisa" />
                  <Label htmlFor="easypaisa" className="flex flex-1 items-center gap-3 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <BanknoteIcon className="h-4 w-4 text-green-600" />
                    </div>
                    <div>Easypaisa</div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value={PaymentMethod.CREDIT_CARD} id="creditcard" />
                  <Label htmlFor="creditcard" className="flex flex-1 items-center gap-3 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <CreditCardIcon className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>Credit/Debit Card</div>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value={PaymentMethod.BANK_TRANSFER} id="banktransfer" />
                  <Label htmlFor="banktransfer" className="flex flex-1 items-center gap-3 cursor-pointer">
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                      <BanknoteIcon className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>Bank Transfer</div>
                  </Label>
                </div>
              </RadioGroup>
              
              <Separator className="my-6" />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Exam Price</span>
                  <span>PKR 2,000</span>
                </div>
                <div className="flex justify-between items-center font-medium text-lg">
                  <span>Total</span>
                  <span>PKR 2,000</span>
                </div>
              </div>
              
              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={onCancel}
                className="gap-2"
              >
                <ChevronsLeftIcon className="h-4 w-4" />
                Back
              </Button>
              <Button 
                onClick={handleContinue}
                disabled={isInitiating}
                className="gap-2"
              >
                {isInitiating ? <Spinner size="sm" /> : <ArrowRightIcon className="h-4 w-4" />}
                Continue
              </Button>
            </CardFooter>
          </>
        );
        
      case 'processing':
        return (
          <>
            <CardHeader>
              <CardTitle>Processing Payment</CardTitle>
              <CardDescription>
                Please wait while we process your payment
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Spinner size="xl" className="mb-6" />
              <p className="text-center text-muted-foreground">
                You will be redirected to the payment gateway shortly...
              </p>
            </CardContent>
          </>
        );
        
      case 'complete':
        return (
          <>
            <CardHeader>
              <CardTitle>Payment Successful!</CardTitle>
              <CardDescription>
                Your payment has been processed successfully
              </CardDescription>
            </CardHeader>
            
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-center font-medium text-lg mb-2">
                Thank you for your purchase
              </p>
              <p className="text-center text-muted-foreground">
                You now have access to this exam
              </p>
            </CardContent>
            
            <CardFooter>
              <Button 
                onClick={onComplete}
                className="w-full gap-2"
              >
                <ArrowRightIcon className="h-4 w-4" />
                Continue to Exam
              </Button>
            </CardFooter>
          </>
        );
        
      case 'error':
        return (
          <>
            <CardHeader>
              <CardTitle>Payment Error</CardTitle>
              <CardDescription>
                There was an error processing your payment
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <Alert variant="destructive" className="mb-6">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error || 'An unknown error occurred'}</AlertDescription>
              </Alert>
              
              <p className="text-center text-muted-foreground">
                Please try again or choose a different payment method
              </p>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button 
                onClick={() => setStep('method')}
              >
                Try Again
              </Button>
            </CardFooter>
          </>
        );
    }
  };
  
  return (
    <Card className="shadow-lg max-w-lg mx-auto">
      {renderStep()}
    </Card>
  );
};

export default PaymentFlow;
