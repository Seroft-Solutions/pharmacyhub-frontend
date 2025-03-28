import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Flag, Bookmark, HelpCircle, AlertCircle } from 'lucide-react';
import { Question, UserAnswer } from '../../model/standardTypes';
import { useMobileStore, selectIsMobile } from '../../../core/app-mobile-handler';
import { useMcqExamStore } from '../../store/mcqExamStore';
import logger from '@/shared/lib/logger';

/**
 * Enum to track the status of a question
 */
export enum QuestionStatus {
  UNANSWERED = 'unanswered',   // No selection made
  ANSWERED_CORRECT = 'correct', // Answered correctly
  ANSWERED_INCORRECT = 'incorrect', // Answered incorrectly
  ANSWERED_PENDING = 'pending'  // Answered but correctness not yet evaluated
}

interface McqQuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  currentAnswer?: string;
  isFlagged: boolean;
  onAnswer: (optionId: string) => void;
  onFlag: () => void;
  isReview?: boolean;
  correctAnswer?: string;
  onNext?: () => void;
  showExplanationButton?: boolean;
}

export const McqQuestionCard = React.forwardRef<{resetUI: () => void}, McqQuestionCardProps>(({
  question,
  questionNumber,
  totalQuestions,
  currentAnswer,
  isFlagged,
  onAnswer,
  onFlag,
  isReview = false,
  correctAnswer,
  onNext,
  showExplanationButton = true
}) => {
  // Refs to track question changes more reliably
  const previousQuestionIdRef = useRef<number | null>(null);
  
  const [selectedOption, setSelectedOption] = useState<string | undefined>(currentAnswer);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  
  // Track the status of the question clearly
  const [questionStatus, setQuestionStatus] = useState<QuestionStatus>(() => {
    if (!currentAnswer) {
      return QuestionStatus.UNANSWERED;
    }
    
    if (isReview) {
      return currentAnswer === correctAnswer 
        ? QuestionStatus.ANSWERED_CORRECT 
        : QuestionStatus.ANSWERED_INCORRECT;
    }
    
    return QuestionStatus.ANSWERED_PENDING;
  });
  
  // Use the mobile support feature to detect mobile viewport
  const isMobile = useMobileStore(selectIsMobile);
  
  // Get state from mcqExamStore
  const showExplanation = useMcqExamStore(state => state.showExplanation);
  const highlightedAnswerId = useMcqExamStore(state => state.highlightedAnswerId);
  const toggleExplanation = useMcqExamStore(state => state.toggleExplanation);
  const answerQuestionStore = useMcqExamStore(state => state.answerQuestion);
  const resetQuestionUI = useMcqExamStore(state => state.resetQuestionUI);
  
  // CRITICAL FIX: Reset UI when the question changes by watching the question ID
  useEffect(() => {
    // Only reset if the question ID is different from the previous one
    if (previousQuestionIdRef.current !== question.id) {
      logger.debug('McqQuestionCard: Question changed - resetting UI', {
        from: previousQuestionIdRef.current,
        to: question.id
      });
      
      // Reset UI state in the store
      resetQuestionUI();
      
      // Reset local component state
      setStartTime(Date.now());
      setSelectedOption(currentAnswer);
      
      // Update question status based on current answer and review mode
      if (!currentAnswer) {
        setQuestionStatus(QuestionStatus.UNANSWERED);
      } else if (isReview) {
        setQuestionStatus(
          currentAnswer === correctAnswer 
            ? QuestionStatus.ANSWERED_CORRECT 
            : QuestionStatus.ANSWERED_INCORRECT
        );
      } else {
        setQuestionStatus(QuestionStatus.ANSWERED_PENDING);
      }
      
      // Update the ref to the current question ID
      previousQuestionIdRef.current = question.id;
    }
  }, [question.id, currentAnswer, correctAnswer, isReview, resetQuestionUI]);
  
  // Double-safety: Watch for question number changes as well
  useEffect(() => {
    logger.debug('McqQuestionCard: Question number changed - resetting UI', {
      questionNumber
    });
    resetQuestionUI();
  }, [questionNumber, resetQuestionUI]);
  
  // Update the time spent on this question
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime]);
  
  // Cleanup on unmount - ensure everything is reset
  useEffect(() => {
    return () => {
      resetQuestionUI();
    };
  }, [resetQuestionUI]);
  
  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    
    // Update question status
    setQuestionStatus(QuestionStatus.ANSWERED_PENDING);
    
    // Call local onAnswer prop for backwards compatibility
    onAnswer(value);
    
    // Also update store state with the answer
    if (question && question.id) {
      answerQuestionStore({
        questionId: question.id,
        answerId: value,
        status: QuestionStatus.ANSWERED_PENDING, // Store the status in the answer
        timestamp: new Date().toISOString()
      });
    }
    
    // Auto-navigate to next question after 1 second delay
    if (onNext && !isReview) {
      setTimeout(() => {
        onNext();
      }, 1000);
    }
  };
  
  // Handle explanation toggle with proper logging
  const handleToggleExplanation = () => {
    // Don't allow showing explanation if unanswered
    if (!selectedOption && !showExplanation) {
      logger.debug('McqQuestionCard: Cannot show explanation for unanswered question', {
        questionId: question.id
      });
      return;
    }
    
    logger.debug('McqQuestionCard: Toggling explanation', {
      questionId: question.id,
      currentState: showExplanation
    });
    toggleExplanation();
  };
  
  return (
    <Card className={isMobile ? "shadow-sm border-gray-200" : ""}>
      <CardHeader className={isMobile ? "pb-1.5 px-3 pt-2.5" : "pb-3"}>
        <div className="flex justify-between items-start">
          <div>
            <div className={`text-gray-500 mb-1 ${isMobile ? "text-xs" : "text-sm"}`}>
              Question {questionNumber} of {totalQuestions}
            </div>
            <CardTitle className={isMobile ? "text-base" : "text-xl"}>
              {question.text}
            </CardTitle>
          </div>
          <div className="flex space-x-2">
            {showExplanationButton && question.explanation && (
              <Button
                variant="outline"
                size={isMobile ? "xs" : "sm"}
                className={`flex items-center gap-1 ${
                  showExplanation ? 'bg-blue-100 border-blue-300 text-blue-800 hover:bg-blue-200' : ''
                } ${isMobile ? 'h-8 px-2' : ''}`}
                onClick={handleToggleExplanation}
                disabled={!selectedOption && !showExplanation} // Disable if no selection and explanation is hidden
              >
                <HelpCircle className={isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
                <span className="hidden sm:inline">
                  {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                </span>
              </Button>
            )}
            <Button
              variant="outline"
              size={isMobile ? "xs" : "sm"}
              className={`flex items-center gap-1 ${
                isFlagged ? 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200' : ''
              } ${isMobile ? 'h-8 px-2' : ''}`}
              onClick={onFlag}
            >
              {isFlagged ? (
                <>
                  <Bookmark className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} fill-yellow-500 text-yellow-500`} />
                  <span className="hidden sm:inline">Flagged</span>
                </>
              ) : (
                <>
                  <Flag className={isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
                  <span className="hidden sm:inline">Flag</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className={isMobile ? "px-3 py-2" : ""}>
        {/* Unanswered question prompt - visible until user selects an option */}
        {questionStatus === QuestionStatus.UNANSWERED && !selectedOption && !isReview && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-2 mb-3 flex items-start">
            <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-xs text-yellow-700">
              Please select an answer to this question. If you don't know, you can flag it and come back later.
            </div>
          </div>
        )}
        
        <RadioGroup
          value={selectedOption}
          onValueChange={handleOptionChange}
          className={isMobile ? "space-y-1.5" : "space-y-3"}
          disabled={isReview}
        >
          {question.options.map((option) => {
            // Determine if this option is correct in review mode
            const isCorrectInReview = isReview && option.id.toString() === correctAnswer;
            // Determine if this is an incorrect selection in review mode
            const isIncorrectSelection = isReview && selectedOption === option.id.toString() && option.id.toString() !== correctAnswer;
            
            return (
              <div 
                key={option.id}
                className={`flex items-center space-x-2 ${isMobile ? 'p-1.5 text-sm' : 'p-3'} rounded-md border ${
                  isCorrectInReview 
                    ? 'bg-green-50 border-green-300' 
                    : isIncorrectSelection 
                    ? 'bg-red-50 border-red-300' 
                    : selectedOption === option.id.toString() || highlightedAnswerId === option.id
                    ? 'bg-blue-50 border-blue-300' 
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                <RadioGroupItem 
                  value={option.id.toString()} 
                  id={`option-${option.id}`}
                  className={`${isMobile ? 'h-4 w-4' : ''} ${
                    isCorrectInReview 
                      ? 'text-green-600 border-green-600' 
                      : isIncorrectSelection 
                      ? 'text-red-600 border-red-600' 
                      : ''
                  }`}
                />
                <Label 
                  htmlFor={`option-${option.id}`} 
                  className={`flex-grow cursor-pointer ${isMobile ? 'text-xs leading-tight' : ''} ${
                    isCorrectInReview 
                      ? 'text-green-800' 
                      : isIncorrectSelection 
                      ? 'text-red-800' 
                      : ''
                  }`}
                >
                  {option.label && (
                    <span className="font-medium mr-2">{option.label}.</span>
                  )}
                  {option.text}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
        
        {/* Only show explanation conditionally based on showExplanation state */}
        {(isReview || showExplanation) && question.explanation && (
          <div className={`${isMobile ? "mt-3 p-2 text-xs" : "mt-6 p-4"} bg-blue-50 border border-blue-200 rounded-lg`}>
            <h3 className={`font-medium text-blue-800 ${isMobile ? 'text-xs mb-1' : 'mb-2'}`}>Explanation</h3>
            <p className={`text-blue-700 ${isMobile ? 'text-xs' : ''}`}>{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className={`pt-1 text-xs text-gray-500 justify-between ${isMobile ? "px-3 pb-2" : ""}`}>
        <div className={isMobile ? "text-xs" : ""}>Points: {question.marks}</div>
        {!isReview && <div className={isMobile ? "text-xs" : ""}>Time spent: {timeSpent} seconds</div>}
      </CardFooter>
    </Card>
  );
}, (ref) => {
  return {
    resetUI: () => {
      // This will be exposed to parent components to reset this component's UI state
      useMcqExamStore.getState().resetQuestionUI();
    }
  };
});

// Export with displayName for better debugging
McqQuestionCard.displayName = 'McqQuestionCard';