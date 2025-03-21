'use client';

import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { CreditCard, Smartphone, Building } from 'lucide-react';
import { PaymentMethod } from '../types';

interface PaymentMethodDialogProps {
  examId: number;
  examTitle: string;
  price: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectMethod: (method: PaymentMethod) => void;
  isLoading: boolean;
}

export const PaymentMethodDialog: React.FC<PaymentMethodDialogProps> = ({
  examId,
  examTitle,
  price,
  open,
  onOpenChange,
  onSelectMethod,
  isLoading
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Payment Method</DialogTitle>
          <DialogDescription>
            Choose how you would like to pay for {examTitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <Card 
              className="cursor-pointer hover:border-primary transition-colors" 
              onClick={() => onSelectMethod(PaymentMethod.CREDIT_CARD)}
            >
              <CardContent className="flex flex-col items-center justify-center pt-6 pb-4">
                <CreditCard className="h-10 w-10 mb-2 text-primary" />
                <span>Credit Card</span>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:border-primary transition-colors" 
              onClick={() => onSelectMethod(PaymentMethod.JAZZCASH)}
            >
              <CardContent className="flex flex-col items-center justify-center pt-6 pb-4">
                <Smartphone className="h-10 w-10 mb-2 text-primary" />
                <span>JazzCash</span>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:border-primary transition-colors" 
              onClick={() => onSelectMethod(PaymentMethod.EASYPAISA)}
            >
              <CardContent className="flex flex-col items-center justify-center pt-6 pb-4">
                <Smartphone className="h-10 w-10 mb-2 text-primary" />
                <span>Easypaisa</span>
              </CardContent>
            </Card>
            
            <Card 
              className="cursor-pointer hover:border-primary transition-colors" 
              onClick={() => onSelectMethod(PaymentMethod.BANK_TRANSFER)}
            >
              <CardContent className="flex flex-col items-center justify-center pt-6 pb-4">
                <Building className="h-10 w-10 mb-2 text-primary" />
                <span>Bank Transfer</span>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <div className="flex items-center">
            <span className="mr-2 text-lg font-bold">
              Total: PKR 2,000
            </span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};