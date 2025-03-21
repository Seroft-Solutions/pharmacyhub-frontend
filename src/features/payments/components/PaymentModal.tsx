'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2Icon, CreditCardIcon, AlertCircleIcon } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { usePremiumExamInfoQuery } from '../api/hooks';
import { useInitiateExamPaymentMutation } from '../api/hooks';
import { PaymentMethod } from '../types';

interface PaymentModalProps {
  examId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (redirectUrl: string) => void;
  examTitle?: string;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  examId,
  isOpen,
  onClose,
  onSuccess,
  examTitle = 'Exam'
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>(PaymentMethod.JAZZCASH);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get premium exam info
  const { data: examInfo, isLoading: isLoadingInfo } = usePremiumExamInfoQuery(examId);
  
  // Initiate payment mutation
  const { mutate: initiatePayment, isLoading: isProcessing } = useInitiateExamPaymentMutation();

  // Handle payment method selection
  const handleMethodChange = (value: string) => {
    setSelectedMethod(value as PaymentMethod);
    setErrorMessage(null);
  };

  // Handle payment submission
  const handleSubmit = () => {
    setErrorMessage(null);
    
    initiatePayment({ examId, method: selectedMethod }, {
      onSuccess: (data) => {
        // If we have a redirect URL, go there
        if (data.redirectUrl) {
          onSuccess(data.redirectUrl);
        } else {
          // If we have form parameters, create a form and submit it
          if (data.formParameters && Object.keys(data.formParameters).length > 0) {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = data.redirectUrl || window.location.href;
            form.target = '_blank';
            
            // Add all parameters as hidden fields
            Object.entries(data.formParameters).forEach(([key, value]) => {
              const input = document.createElement('input');
              input.type = 'hidden';
              input.name = key;
              input.value = value;
              form.appendChild(input);
            });
            
            // Submit the form
            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
          }
          
          // Close the modal
          onClose();
        }
      },
      onError: (error) => {
        setErrorMessage(error.message || 'Payment initiation failed.');
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Premium Access Required</DialogTitle>
          <DialogDescription>
            {examTitle} requires premium access. Choose a payment method to continue.
          </DialogDescription>
        </DialogHeader>
        
        {isLoadingInfo ? (
          <div className="flex items-center justify-center py-6">
            <Loader2Icon className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {examInfo && (
              <div className="flex flex-col space-y-2">
                <div className="text-sm text-muted-foreground">Price</div>
                <div className="text-2xl font-bold text-primary">
                  PKR {examInfo.price.toFixed(2)}
                </div>
              </div>
            )}
            
            <RadioGroup 
              defaultValue={selectedMethod} 
              value={selectedMethod}
              onValueChange={handleMethodChange}
              className="space-y-3 mt-4"
            >
              <div className="flex items-center space-x-2 border p-3 rounded-md transition-colors hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value={PaymentMethod.JAZZCASH} id="jazzcash" />
                <Label htmlFor="jazzcash" className="flex-1 cursor-pointer">
                  <div className="font-medium">JazzCash</div>
                  <div className="text-sm text-muted-foreground">Pay with your JazzCash mobile account</div>
                </Label>
                <div className="h-8 w-12 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  JAZZ
                </div>
              </div>
              
              <div className="flex items-center space-x-2 border p-3 rounded-md transition-colors hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value={PaymentMethod.EASYPAISA} id="easypaisa" />
                <Label htmlFor="easypaisa" className="flex-1 cursor-pointer">
                  <div className="font-medium">Easypaisa</div>
                  <div className="text-sm text-muted-foreground">Pay with your Easypaisa mobile account</div>
                </Label>
                <div className="h-8 w-12 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
                  EASY
                </div>
              </div>
              
              <div className="flex items-center space-x-2 border p-3 rounded-md transition-colors hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value={PaymentMethod.CREDIT_CARD} id="credit-card" />
                <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                  <div className="font-medium">Credit/Debit Card</div>
                  <div className="text-sm text-muted-foreground">Pay with Visa, Mastercard, or other cards</div>
                </Label>
                <CreditCardIcon className="h-5 w-5 text-primary" />
              </div>
              
              <div className="flex items-center space-x-2 border p-3 rounded-md transition-colors hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value={PaymentMethod.BANK_TRANSFER} id="bank-transfer" />
                <Label htmlFor="bank-transfer" className="flex-1 cursor-pointer">
                  <div className="font-medium">Bank Transfer</div>
                  <div className="text-sm text-muted-foreground">Pay via bank transfer or deposit</div>
                </Label>
                <div className="h-8 w-8 rounded-full border-2 border-primary flex items-center justify-center text-primary font-bold text-xs">
                  B
                </div>
              </div>
            </RadioGroup>
            
            {errorMessage && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Payment Error</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
          </div>
        )}
        
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isProcessing}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isProcessing || isLoadingInfo || !selectedMethod}
            className="gap-2"
          >
            {isProcessing && <Loader2Icon className="h-4 w-4 animate-spin" />}
            {isProcessing ? 'Processing...' : 'Proceed to Payment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};