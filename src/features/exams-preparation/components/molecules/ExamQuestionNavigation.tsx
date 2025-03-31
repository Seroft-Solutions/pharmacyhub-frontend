/**
 * ExamQuestionNavigation component
 * Handles navigation between questions with prev/next/finish buttons
 */
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface ExamQuestionNavigationProps {
  /** Whether the current question is the first one */
  isFirstQuestion: boolean;
  /** Whether the current question is the last one */
  isLastQuestion: boolean;
  /** Handler for navigating to the previous question */
  onPrevQuestion: () => void;
  /** Handler for navigating to the next question */
  onNextQuestion: () => void;
  /** Handler for finishing the exam */
  onFinishClick: () => void;
  /** Optional handler for direct submission without review */
  onDirectSubmit?: () => void;
  /** Optional custom class name */
  className?: string;
}

/**
 * Navigation component for exam questions
 * Shows previous/next buttons or finish button based on question position
 */
export const ExamQuestionNavigation: React.FC<ExamQuestionNavigationProps> = ({
  isFirstQuestion,
  isLastQuestion,
  onPrevQuestion,
  onNextQuestion,
  onFinishClick,
  onDirectSubmit,
  className = ''
}) => {
  return (
    <div className={`flex justify-between w-full ${className}`}>
      <Button
        variant="outline"
        onClick={onPrevQuestion}
        disabled={isFirstQuestion}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>
      
      {isLastQuestion ? (
        <Button onClick={onDirectSubmit || onFinishClick}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Review & Finish
        </Button>
      ) : (
        <Button onClick={onNextQuestion}>
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default ExamQuestionNavigation;
