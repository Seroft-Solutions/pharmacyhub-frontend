'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  BookOpen,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Question as QuestionType } from '../../model/standardTypes';
import { QuestionStatus } from '../../types/QuestionStatus';
import { UserAnswer } from '../../model/standardTypes';

interface QuestionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: QuestionType | null;
  status: QuestionStatus;
  userAnswer?: UserAnswer;
  totalQuestions?: number;
  onNavigate?: (direction: 'prev' | 'next') => void;
}

/**
 * Professional question dialog with optimal mobile compatibility
 * Features a mobile app-like design with clear navigation
 */
export const QuestionDialog: React.FC<QuestionDialogProps> = ({
  open,
  onOpenChange,
  question,
  status,
  userAnswer,
  totalQuestions,
  onNavigate
}) => {
  if (!question) return null;
  
  const getStatusBadge = () => {
    switch (status) {
      case QuestionStatus.ANSWERED_CORRECT:
        return (
          <div className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
            <CheckCircle2 className="h-4 w-4 mr-1.5" />
            Correct
          </div>
        );
      case QuestionStatus.ANSWERED_INCORRECT:
        return (
          <div className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
            <XCircle className="h-4 w-4 mr-1.5" />
            Incorrect
          </div>
        );
      case QuestionStatus.UNANSWERED:
        return (
          <div className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-medium">
            <AlertCircle className="h-4 w-4 mr-1.5" />
            Unanswered
          </div>
        );
      default:
        return null;
    }
  };
  
  const handleNavigate = (direction: 'prev' | 'next') => {
    if (onNavigate) {
      onNavigate(direction);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 border-0 shadow-lg max-w-[95vw] sm:max-w-xl md:max-w-2xl lg:max-w-3xl sm:rounded-lg h-[95vh] sm:h-auto overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center px-3 py-2 border-b bg-white z-10 shadow-sm">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base">Question {question.questionNumber}</h3>
              {totalQuestions && (
                <span className="text-sm text-gray-500">of {totalQuestions}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              <button 
                onClick={handleClose}
                className="ml-1 p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Close dialog"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-4 py-3 sm:px-5 sm:py-4">
              {/* Question Text */}
              <div className="text-sm sm:text-base font-medium mb-4 text-gray-800">
                {question.text}
              </div>
              
              {/* Options */}
              <div className="space-y-2 mb-5">
                {question.options.map((option, index) => {
                  const optionLabel = String.fromCharCode(65 + index); // A, B, C, D...
                  const isCorrect = optionLabel === question.correctAnswer;
                  const isSelected = userAnswer && userAnswer.selectedOption === index;
                  
                  // Determine styles based on answer status
                  let containerClasses = "p-3 rounded-lg border transition-all hover:shadow-sm";
                  let labelClasses = "w-7 h-7 flex-shrink-0 rounded-full flex items-center justify-center mr-3 border text-xs font-medium";
                  
                  if (isCorrect) {
                    containerClasses += " border-green-500 bg-green-50";
                    labelClasses += " bg-green-100 border-green-300 text-green-800";
                  } else if (isSelected) {
                    containerClasses += " border-red-500 bg-red-50";
                    labelClasses += " bg-red-100 border-red-300 text-red-800";
                  } else {
                    containerClasses += " border-gray-200 hover:border-gray-300";
                    labelClasses += " bg-gray-100 border-gray-200 text-gray-700";
                  }
                  
                  return (
                    <div key={optionLabel} className={containerClasses}>
                      <div className="flex items-start">
                        <div className={labelClasses}>
                          {optionLabel}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm text-gray-800">{option.text}</div>
                        </div>
                        {isCorrect && <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 ml-2 flex-shrink-0" />}
                        {!isCorrect && isSelected && <XCircle className="h-5 w-5 text-red-600 mt-1 ml-2 flex-shrink-0" />}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Explanation */}
              {question.explanation && (
                <div className="rounded-lg overflow-hidden border border-blue-200 mb-5 shadow-sm">
                  <div className="bg-blue-100 px-3 py-2 flex items-center">
                    <BookOpen className="h-4 w-4 text-blue-700 mr-2" />
                    <div className="text-xs font-medium text-blue-800">Explanation</div>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-900 text-sm">{question.explanation}</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Footer */}
          <div className="border-t bg-gray-50 px-3 py-2 flex justify-between items-center shadow-inner">
            {onNavigate ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleNavigate('prev')}
                  disabled={question.questionNumber <= 1}
                  className="flex items-center gap-1 h-8 text-xs"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                <Button 
                  onClick={handleClose}
                  variant="outline" 
                  size="sm"
                  className="h-8 text-xs"
                >
                  Close
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleNavigate('next')}
                  disabled={totalQuestions && question.questionNumber >= totalQuestions}
                  className="flex items-center gap-1 h-8 text-xs"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="w-full flex justify-center">
                <Button 
                  onClick={handleClose}
                  className="px-6 bg-blue-600 hover:bg-blue-700 text-white shadow-sm text-sm"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
