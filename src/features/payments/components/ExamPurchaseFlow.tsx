'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PaymentMethodDialog } from './PaymentMethodDialog';
import { PaymentMethod } from '../types';
import { ExamPaper } from '@/features/exams/types/StandardTypes';
import { useInitiateExamPayment } from '../api/hooks/usePaymentApiHooks';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';


interface ExamPurchaseFlowProps {
  exam: ExamPaper;
  onStart?: (examId: number) => void;
}

export const ExamPurchaseFlow: React.FC<ExamPurchaseFlowProps> = ({ exam, onStart }) => {
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const router = useRouter();
  
  const { mutate: initiatePayment, isLoading } = useInitiateExamPayment(exam.id as number);
  
  const handlePurchase = () => {
    setPaymentDialogOpen(true);
  };
  
  const handleSelectPaymentMethod = (method: PaymentMethod) => {
    initiatePayment(method, {
      onSuccess: (data) => {
        // Redirect to processing page
        router.push(`/payment/process?transactionId=${data.transactionId}&examId=${exam.id}`);
      },
      onError: (error) => {
        toast.error('Payment Initialization Failed', {
          description: error.message || 'Failed to initialize payment. Please try again.'
        });
        setPaymentDialogOpen(false);
      }
    });
  };
  
  const handleStart = () => {
    if (onStart) {
      onStart(exam.id as number);
    } else {
      router.push(`/exam/${exam.id}`);
    }
  };
  
  if (exam.purchased) {
    return (
      <Button onClick={handleStart} className="w-full" variant="default">
        Start Exam
      </Button>
    );
  }
  
  return (
    <>
      <Button onClick={handlePurchase} className="w-full" variant="default">
        Purchase Access
      </Button>
      
      <PaymentMethodDialog
        examId={exam.id as number}
        examTitle={exam.title}
        price={exam.price}
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        onSelectMethod={handleSelectPaymentMethod}
        isLoading={isLoading}
      />
    </>
  );
};