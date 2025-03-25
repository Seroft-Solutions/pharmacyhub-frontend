import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  BookOpen
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
}

/**
 * Component for displaying a question's details in a dialog
 */
export const QuestionDialog: React.FC<QuestionDialogProps> = ({
  open,
  onOpenChange,
  question,
  status,
  userAnswer
}) => {
  if (!question) return null;
  
  const getStatusLabel = () => {
    switch (status) {
      case QuestionStatus.ANSWERED_CORRECT:
        return (
          <div className="flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full">
            <CheckCircle2 className="h-4 w-4 mr-1.5" />
            Correct
          </div>
        );
      case QuestionStatus.ANSWERED_INCORRECT:
        return (
          <div className="flex items-center px-3 py-1 bg-red-100 text-red-800 rounded-full">
            <XCircle className="h-4 w-4 mr-1.5" />
            Incorrect
          </div>
        );
      case QuestionStatus.UNANSWERED:
        return (
          <div className="flex items-center px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full">
            <AlertCircle className="h-4 w-4 mr-1.5" />
            Unanswered
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg">Question {question.questionNumber}</DialogTitle>
            {getStatusLabel()}
          </div>
        </DialogHeader>
        
        <div className="py-4">
          {/* Question Text */}
          <div className="text-base font-medium mb-6">{question.text}</div>
          
          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => {
              const optionLabel = String.fromCharCode(65 + index); // A, B, C, D...
              const isCorrect = optionLabel === question.correctAnswer;
              const isSelected = userAnswer && userAnswer.selectedOption === index;
              
              let optionClass = "p-3 rounded-lg border ";
              if (isCorrect) {
                optionClass += "border-green-500 bg-green-50";
              } else if (isSelected) {
                optionClass += "border-red-500 bg-red-50";
              } else {
                optionClass += "border-gray-200";
              }
              
              return (
                <div key={optionLabel} className={optionClass}>
                  <div className="flex items-start">
                    <div className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center mr-3 bg-white border border-gray-200">
                      {optionLabel}
                    </div>
                    <div className="flex-1">{option.text}</div>
                    {isCorrect && <CheckCircle2 className="h-5 w-5 text-green-600 mt-1 ml-2" />}
                    {!isCorrect && isSelected && <XCircle className="h-5 w-5 text-red-600 mt-1 ml-2" />}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Explanation */}
          {question.explanation && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="flex items-center text-lg font-medium mb-2 text-blue-800">
                <BookOpen className="h-5 w-5 mr-2" />
                Explanation
              </h3>
              <div className="text-blue-900">{question.explanation}</div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
