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
import { useMobileStore, selectIsMobile } from '@/features/core/mobile-support';

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
  const isMobile = useMobileStore(selectIsMobile);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${isMobile ? 'w-[95%] p-4' : 'sm:max-w-md'}`}>
        <DialogHeader className={isMobile ? 'gap-1 pb-2' : ''}>
          <DialogTitle className={isMobile ? 'text-lg' : ''}>Select Payment Method</DialogTitle>
          <DialogDescription className={isMobile ? 'text-xs' : ''}>
            Choose how you would like to pay for {examTitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className={`grid gap-3 ${isMobile ? 'py-2' : 'gap-4 py-4'}`}>
          <div className="grid grid-cols-2 gap-3">
            <PaymentMethodCard 
              title="Credit Card"
              icon={<CreditCard className={`${isMobile ? 'h-7 w-7 mb-1' : 'h-10 w-10 mb-2'} text-primary`} />}
              onClick={() => onSelectMethod(PaymentMethod.CREDIT_CARD)}
              isMobile={isMobile}
            />
            
            <PaymentMethodCard 
              title="JazzCash"
              icon={<Smartphone className={`${isMobile ? 'h-7 w-7 mb-1' : 'h-10 w-10 mb-2'} text-primary`} />}
              onClick={() => onSelectMethod(PaymentMethod.JAZZCASH)}
              isMobile={isMobile}
            />
            
            <PaymentMethodCard 
              title="Easypaisa"
              icon={<Smartphone className={`${isMobile ? 'h-7 w-7 mb-1' : 'h-10 w-10 mb-2'} text-primary`} />}
              onClick={() => onSelectMethod(PaymentMethod.EASYPAISA)}
              isMobile={isMobile}
            />
            
            <PaymentMethodCard 
              title="Bank Transfer"
              icon={<Building className={`${isMobile ? 'h-7 w-7 mb-1' : 'h-10 w-10 mb-2'} text-primary`} />}
              onClick={() => onSelectMethod(PaymentMethod.BANK_TRANSFER)}
              isMobile={isMobile}
            />
          </div>
        </div>
        
        <DialogFooter className={`flex ${isMobile ? 'flex-col gap-3 items-start' : 'justify-between sm:justify-between'}`}>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading} className={isMobile ? 'w-full' : ''}>
            Cancel
          </Button>
          <div className={`flex items-center ${isMobile ? 'w-full justify-center' : ''}`}>
            <span className={`${isMobile ? 'text-base' : 'text-lg'} font-bold`}>
              Total: PKR 2,000
            </span>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Extract PaymentMethodCard to a reusable component
interface PaymentMethodCardProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  isMobile: boolean;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  title,
  icon,
  onClick,
  isMobile
}) => {
  return (
    <Card 
      className="cursor-pointer hover:border-primary transition-colors" 
      onClick={onClick}
    >
      <CardContent className={`flex flex-col items-center justify-center ${isMobile ? 'pt-3 pb-2' : 'pt-6 pb-4'}`}>
        {icon}
        <span className={isMobile ? 'text-xs' : ''}>{title}</span>
      </CardContent>
    </Card>
  );
};