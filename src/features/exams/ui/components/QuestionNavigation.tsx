import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, CheckIcon, LifeBuoyIcon, FlagIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionNavigationProps {
  currentIndex: number;
  totalQuestions: number;
  answeredQuestions: Set<number>;
  flaggedQuestions: Set<number>;
  onNavigate: (index: number) => void;
  onFinishExam: () => void;
}

export function QuestionNavigation({
  currentIndex,
  totalQuestions,
  answeredQuestions,
  flaggedQuestions,
  onNavigate,
  onFinishExam
}: QuestionNavigationProps) {
  const questionsPerRow = 5;
  const rows = Math.ceil(totalQuestions / questionsPerRow);
  
  // Get question number at specific index
  const getQuestionNumber = (index: number) => index + 1;
  
  // Get question status
  const getQuestionStatus = (index: number) => {
    const questionId = index + 1; // Assuming question IDs start at 1
    const isAnswered = Array.from(answeredQuestions).some(id => id === questionId);
    const isFlagged = flaggedQuestions.has(questionId);
    const isCurrent = index === currentIndex;
    
    if (isCurrent) return 'current';
    if (isAnswered && isFlagged) return 'answered-flagged';
    if (isAnswered) return 'answered';
    if (isFlagged) return 'flagged';
    return 'unanswered';
  };
  
  // Get status classes
  const getStatusClasses = (status: string) => {
    switch (status) {
      case 'current':
        return 'bg-primary text-white ring-2 ring-primary ring-offset-2';
      case 'answered':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'flagged':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'answered-flagged':
        return 'bg-gradient-to-br from-green-100 to-yellow-100 text-green-900 border-green-300';
      default:
        return 'bg-gray-100 text-gray-600 hover:bg-gray-200';
    }
  };
  
  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered':
        return <CheckIcon className="h-3 w-3" />;
      case 'flagged':
        return <FlagIcon className="h-3 w-3" />;
      case 'answered-flagged':
        return <CheckIcon className="h-3 w-3" />;
      default:
        return null;
    }
  };
  
  // Generate grid of question buttons
  const renderQuestionGrid = () => {
    const grid = [];
    
    for (let row = 0; row < rows; row++) {
      const rowItems = [];
      
      for (let col = 0; col < questionsPerRow; col++) {
        const index = row * questionsPerRow + col;
        if (index >= totalQuestions) break;
        
        const status = getQuestionStatus(index);
        const statusClasses = getStatusClasses(status);
        const statusIcon = getStatusIcon(status);
        
        rowItems.push(
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onNavigate(index)}
            className={cn(
              "w-10 h-10 p-0 flex items-center justify-center relative font-medium",
              statusClasses
            )}
            aria-label={`Go to question ${getQuestionNumber(index)}`}
          >
            {getQuestionNumber(index)}
            {statusIcon && (
              <span className="absolute -top-1 -right-1 text-xs">
                {statusIcon}
              </span>
            )}
          </Button>
        );
      }
      
      grid.push(
        <div key={row} className="flex gap-2 justify-center">
          {rowItems}
        </div>
      );
    }
    
    return <div className="grid gap-2">{grid}</div>;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between gap-2 mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="px-2.5"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate(Math.min(totalQuestions - 1, currentIndex + 1))}
          disabled={currentIndex === totalQuestions - 1}
          className="px-2.5"
        >
          Next
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      {renderQuestionGrid()}
      
      <div className="pt-4 border-t mt-6">
        <Button 
          onClick={onFinishExam}
          className="w-full"
          variant="default"
        >
          <LifeBuoyIcon className="h-4 w-4 mr-2" />
          Review & Finish
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-100 border border-green-300 mr-1.5"></div>
          <span>Answered</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-yellow-100 border border-yellow-300 mr-1.5"></div>
          <span>Flagged</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-gray-100 border border-gray-300 mr-1.5"></div>
          <span>Unanswered</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-primary mr-1.5"></div>
          <span>Current</span>
        </div>
      </div>
    </div>
  );
}