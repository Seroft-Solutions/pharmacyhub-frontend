import React from 'react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAnswer } from '../../model/standardTypes';
import { CheckCircle2, Flag, HelpCircle } from 'lucide-react';
import { useMcqExamStore } from '../../store/mcqExamStore';
import logger from '@/shared/lib/logger';

interface McqQuestionNavigationProps {
  totalQuestions: number;
  currentQuestion: number;
  answers: Record<number, UserAnswer>;
  flaggedQuestions: Set<number>;
  onQuestionSelect: (index: number) => void;
  minimumRequired?: number;
}

export const McqQuestionNavigation: React.FC<McqQuestionNavigationProps> = ({
  totalQuestions,
  currentQuestion,
  answers,
  flaggedQuestions,
  onQuestionSelect,
  minimumRequired = 0
}) => {
  // Get resetQuestionUI function from the store
  const resetQuestionUI = useMcqExamStore(state => state.resetQuestionUI);
  
  // Create a wrapper for onQuestionSelect that resets UI state first
  const handleQuestionSelect = (index: number) => {
    // First reset the UI state
    resetQuestionUI();
    // Log the navigation action
    logger.debug('McqQuestionNavigation: Navigating to question', {
      from: currentQuestion,
      to: index
    });
    // Then navigate to the selected question
    onQuestionSelect(index);
  };
  const questionNumbers = Array.from({ length: totalQuestions }, (_, i) => i);
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = flaggedQuestions.size;
  
  // Calculate completion percentage
  const completionPercentage = (answeredCount / totalQuestions) * 100;
  
  // Calculate if the minimum requirement is met
  const isMinimumMet = answeredCount >= minimumRequired;
  
  // Helper function to get button variant based on question state
  const getButtonVariant = (index: number) => {
    // Actual question ID (not the index)
    const questionId = index + 1;
    
    if (index === currentQuestion) {
      return "default"; // Currently selected question
    }
    
    // Question has been answered
    if (answers[questionId]) {
      return "outline";
    }
    
    // Question is flagged but not answered
    if (flaggedQuestions.has(questionId)) {
      return "outline";
    }
    
    // Default: Not answered, not flagged, not current
    return "ghost";
  };
  
  // Helper function to get button color styles based on question state
  const getButtonStyles = (index: number) => {
    // Actual question ID (not the index)
    const questionId = index + 1;
    
    // Calculate base styles
    let styles = "";
    
    // Add answered styles (even for current question)
    if (answers[questionId]) {
      styles = "border-green-300 text-green-700 bg-green-50 hover:bg-green-100 hover:text-green-800";
    }
    
    // Add flagged styles (if not answered)
    if (!answers[questionId] && flaggedQuestions.has(questionId)) {
      styles = "border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 hover:text-yellow-800";
    }
    
    // Add current question styles (takes precedence)
    if (index === currentQuestion) {
      // Keep the answer color indication but use default button styling
      return "";
    }
    
    return styles;
  };
  
  return (
    <div className="w-72 border-l bg-gray-50 flex flex-col h-full p-4">
      <div className="mb-4">
        <h2 className="font-semibold mb-2">Question Navigator</h2>
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Completion</span>
            <span className={isMinimumMet ? 'text-green-600' : 'text-gray-600'}>
              {answeredCount}/{totalQuestions} 
              {minimumRequired > 0 && ` (min: ${minimumRequired})`}
            </span>
          </div>
          <Progress 
            value={completionPercentage} 
            className="h-2"
            indicatorClassName={isMinimumMet ? 'bg-green-600' : undefined}
          />
        </div>
        
        <div className="flex gap-3 mb-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>
            <span>Answered</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1.5"></div>
            <span>Flagged</span>
          </div>
        </div>
      </div>
      
      <Separator className="mb-4" />
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm">Questions</h3>
          <div className="text-xs text-gray-500">
            {currentQuestion + 1} of {totalQuestions}
          </div>
        </div>
        
        <ScrollArea className="h-[300px] pr-4">
          <div className="grid grid-cols-4 gap-2">
            {questionNumbers.map((index) => {
              const questionId = index + 1; // Assuming question IDs start from 1
              
              return (
                <Button
                  key={index}
                  size="sm"
                  variant={getButtonVariant(index)}
                  className={`h-10 w-10 p-0 relative ${getButtonStyles(index)}`}
                  onClick={() => handleQuestionSelect(index)}
                >
                  {index + 1}
                  {flaggedQuestions.has(questionId) && (
                    <div className="absolute -top-1 -right-1">
                      <Flag className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
      
      <Separator className="mb-4" />
      
      <div className="space-y-2 mt-auto">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle2 className="h-4 w-4 text-green-500" />
          <span>{answeredCount} questions answered</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Flag className="h-4 w-4 text-yellow-500" />
          <span>{flaggedCount} questions flagged</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <HelpCircle className="h-4 w-4 text-gray-500" />
          <span>{totalQuestions - answeredCount} questions unanswered</span>
        </div>
      </div>
    </div>
  );
};