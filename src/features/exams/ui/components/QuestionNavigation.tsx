'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  BookmarkIcon as Bookmark,
  Circle
} from 'lucide-react';

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
  onFinishExam,
}: QuestionNavigationProps) {
  // Create array of question numbers from 0 to totalQuestions - 1
  const questionIndices = Array.from({ length: totalQuestions }, (_, i) => i);
  
  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onNavigate(currentIndex - 1)}
          disabled={currentIndex === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
        {currentIndex < totalQuestions - 1 ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate(currentIndex + 1)}
            disabled={currentIndex === totalQuestions - 1}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={onFinishExam}
          >
            Finish Exam
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 mt-6">
        {questionIndices.map((index) => {
          const isAnswered = answeredQuestions.has(index);
          const isFlagged = flaggedQuestions.has(index);
          const isCurrent = index === currentIndex;
          
          return (
            <Button
              key={index}
              variant={isCurrent ? "default" : "outline"}
              size="sm"
              className={`relative w-10 h-10 p-0 ${
                isFlagged ? "border-yellow-500" : ""
              }`}
              onClick={() => onNavigate(index)}
            >
              <span>{index + 1}</span>
              
              {isAnswered && (
                <CheckCircle 
                  className="absolute -top-1 -right-1 h-3 w-3 text-green-500"
                />
              )}
              
              {isFlagged && (
                <Bookmark 
                  className="absolute -bottom-1 -right-1 h-3 w-3 text-yellow-500"
                />
              )}
            </Button>
          );
        })}
      </div>
      
      <div className="flex justify-between text-sm text-muted-foreground mt-4">
        <div className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3 text-green-500" />
          <span>Answered ({answeredQuestions.size})</span>
        </div>
        <div className="flex items-center gap-1">
          <Bookmark className="h-3 w-3 text-yellow-500" />
          <span>Flagged ({flaggedQuestions.size})</span>
        </div>
        <div className="flex items-center gap-1">
          <Circle className="h-3 w-3 text-gray-300" />
          <span>Unanswered ({totalQuestions - answeredQuestions.size})</span>
        </div>
      </div>
    </div>
  );
}
