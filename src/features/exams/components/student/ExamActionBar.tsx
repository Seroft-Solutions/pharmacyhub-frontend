'use client';

import React, { FC, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, LifeBuoy } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2Icon } from 'lucide-react';


interface ExamActionBarProps {
  currentIndex: number;
  totalQuestions: number;
  navigatePrev: () => void;
  navigateNext: () => void;
  onFinishExam: () => void;
  onDirectSubmit: () => void;
  isSubmitting: boolean;
  answeredCount: number;
}

/**
 * ExamActionBar Component
 * 
 * Provides navigation buttons and finish/submit actions for the exam interface.
 */
export const ExamActionBar: FC<ExamActionBarProps> = ({
  currentIndex,
  totalQuestions,
  navigatePrev,
  navigateNext,
  onFinishExam,
  onDirectSubmit,
  isSubmitting,
  answeredCount,
}) => {
  // This component provides navigation and submission controls
  
  return (
    <div className="flex justify-between items-center gap-4 mt-4">
      {/* Previous button */}
      <Button
        variant="outline"
        size="sm"
        onClick={navigatePrev}
        disabled={currentIndex === 0}
        className="px-4 py-2 rounded-lg"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Previous
      </Button>
      
      {/* Finish/Submit button */}
      {isSubmitting ? (
        <Button 
          disabled
          className="bg-blue-600 hover:bg-blue-700"
          variant="default"
        >
          <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
          Submitting...
        </Button>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              variant="default"
            >
              <LifeBuoy className="h-4 w-4 mr-2" />
              Review & Finish
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
              <AlertDialogDescription>
                {totalQuestions - answeredCount > 0 
                  ? `You still have ${totalQuestions - answeredCount} unanswered questions. Once submitted, you cannot change your answers.`
                  : `Are you sure you want to submit your exam? Once submitted, you cannot change your answers.`
                }
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDirectSubmit}>
                Submit Exam
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      
      {/* Next button */}
      <Button
        variant="outline"
        size="sm"
        onClick={navigateNext}
        disabled={currentIndex === totalQuestions - 1}
        className="px-4 py-2 rounded-lg"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};

export default ExamActionBar;