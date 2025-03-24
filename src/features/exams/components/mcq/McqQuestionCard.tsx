import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Flag, Bookmark, HelpCircle } from 'lucide-react';
import { Question, UserAnswer } from '../../model/standardTypes';
import { useMobileStore, selectIsMobile } from '@/features/core/mobile-support';
import { useMcqExamStore } from '../../store/mcqExamStore';

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

export const McqQuestionCard: React.FC<McqQuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  currentAnswer,
  isFlagged,
  onAnswer,
  onFlag,
  isReview = false,
  correctAnswer,
  showExplanationButton = true
}) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(currentAnswer);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  
  // Use the mobile support feature to detect mobile viewport
  const isMobile = useMobileStore(selectIsMobile);
  
  // Get state from mcqExamStore
  const showExplanation = useMcqExamStore(state => state.showExplanation);
  const toggleExplanation = useMcqExamStore(state => state.toggleExplanation);
  
  // Reset the start time when the question changes
  useEffect(() => {
    setStartTime(Date.now());
    setSelectedOption(currentAnswer);
  }, [question.id, currentAnswer]);
  
  // Update the time spent on this question
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime]);
  
  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    onAnswer(value);
    
    // Auto-navigate to next question after 1 second delay
    if (onNext && !isReview) {
      setTimeout(() => {
        onNext();
      }, 1000);
    }
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
                onClick={toggleExplanation}
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
        <RadioGroup
          value={selectedOption}
          onValueChange={handleOptionChange}
          className={isMobile ? "space-y-1.5" : "space-y-3"}
          disabled={isReview}
        >
          {question.options.map((option) => {
            const isCorrectInReview = isReview && option.id.toString() === correctAnswer;
            const isIncorrectSelection = isReview && selectedOption === option.id.toString() && option.id.toString() !== correctAnswer;
            
            return (
              <div 
                key={option.id}
                className={`flex items-center space-x-2 ${isMobile ? 'p-1.5 text-sm' : 'p-3'} rounded-md border ${
                  isCorrectInReview 
                    ? 'bg-green-50 border-green-300' 
                    : isIncorrectSelection 
                    ? 'bg-red-50 border-red-300' 
                    : selectedOption === option.id.toString() 
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
};