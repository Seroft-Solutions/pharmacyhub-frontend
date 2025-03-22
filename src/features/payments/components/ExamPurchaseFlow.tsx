'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { ExamPaper } from '@/features/exams/types/StandardTypes';

interface ExamPurchaseFlowProps {
  exam: ExamPaper;
  onStart?: (examId: number) => void;
}

/**
 * ExamPurchaseFlow - Simplified for "pay once, access all" feature
 * 
 * This component always displays a "Start Exam" button and never shows
 * any payment-related UI, implementing the "pay once, access all" concept.
 */
export const ExamPurchaseFlow: React.FC<ExamPurchaseFlowProps> = ({ 
  exam, 
  onStart 
}) => {
  const handleStart = () => {
    if (onStart) {
      onStart(exam.id as number);
    }
  };

  return (
    <Button 
      onClick={handleStart} 
      className="gap-1" 
      variant="default"
    >
      Start Paper
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
};