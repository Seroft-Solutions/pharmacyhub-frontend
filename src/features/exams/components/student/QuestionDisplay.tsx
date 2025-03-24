'use client';

import React, { useState, useEffect } from 'react';
import { Question, UserAnswer } from '../../model/mcqTypes';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BookmarkIcon, ChevronLeftIcon, ChevronRightIcon, FlagIcon, CheckCircleIcon, XCircleIcon, InfoIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMobileStore, selectIsMobile } from '@/features/core/mobile-support';

// Break into smaller components for better reusability
const ExplanationBox = ({ explanation, isMobile }) => {
  return (
    <div className={`${isMobile ? 'mt-3 p-2' : 'mt-6 p-4'} border border-blue-200 rounded-lg bg-blue-50 shadow-inner`}>
      <div className="flex items-start">
        <InfoIcon className={`${isMobile ? 'h-4 w-4 mt-0.5' : 'h-5 w-5 mt-0.5'} text-blue-500 mr-2 flex-shrink-0`} />
        <div>
          <h4 className={`font-medium text-blue-800 ${isMobile ? 'text-xs mb-1' : 'mb-1'}`}>Explanation</h4>
          <p className={`text-blue-700 ${isMobile ? 'text-xs' : ''}`}>{explanation}</p>
        </div>
      </div>
    </div>
  );
};

const QuestionOption = ({ index, option, isSelected, isCorrect, showExplanation, questionId, onClick, isMobile, hasUserSelection }) => {
  // Determine styling based on explanation visibility and correctness
  let optionClassName = `flex items-center space-x-3 border ${isMobile ? 'p-2' : 'p-3'} rounded-lg transition-all duration-200`;
  
  // Apply different styling when explanation is shown AND user has made a selection
  if (showExplanation && hasUserSelection) {
    if (isCorrect) {
      // Highlight correct option in green when explanation is shown and user has made any selection
      optionClassName = cn(optionClassName, "border-green-500 bg-green-50 shadow-md");
    } else if (isSelected) {
      // Only highlight selected incorrect options in red
      optionClassName = cn(optionClassName, "border-red-500 bg-red-50 shadow-md");
    }
  } else if (isSelected) {
    // Regular selected styling when explanation is hidden
    optionClassName = cn(optionClassName, "border-blue-500 bg-blue-50/50 shadow-md");
  } else {
    // Default unselected styling
    optionClassName = cn(optionClassName, "hover:border-blue-300 hover:bg-blue-50/30 hover:shadow-sm");
  }
  
  // Label option with A, B, C, D etc
  const optionLetter = String.fromCharCode(65 + index); // A, B, C, D...
  
  return (
    <div className={optionClassName}>
      <div className="flex items-center space-x-3 w-full">
        <div className={cn(
          `flex-shrink-0 ${isMobile ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'} rounded-full flex items-center justify-center font-semibold`,
          isSelected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"
        )}>
          {optionLetter}
        </div>
        <div className="flex-grow flex items-center">
          <RadioGroupItem 
            value={index.toString()} 
            id={`option-${questionId}-${index}`}
            className={`${isMobile ? 'h-4 w-4' : ''} mr-3`}
          />
          <Label 
            htmlFor={`option-${questionId}-${index}`} 
            className={`flex-grow cursor-pointer ${isMobile ? 'text-xs leading-tight' : 'text-base'}`}
          >
            {option.text}
          </Label>
        </div>
          
        {showExplanation && hasUserSelection ? (
          isCorrect ? (
            <CheckCircleIcon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-green-500 flex-shrink-0`} />
          ) : isSelected ? (
            <XCircleIcon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-red-500 flex-shrink-0`} />
          ) : null
        ) : isSelected && (
          <CheckCircleIcon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-blue-500 flex-shrink-0`} />
        )}
      </div>
    </div>
  );
};

interface QuestionDisplayProps {
  question: Question;
  userAnswer?: number;
  isFlagged?: boolean;
  onAnswerSelect: (questionId: number, optionIndex: number) => void;
  onFlagQuestion: (questionId: number) => void;
}

export function QuestionDisplay({
  question,
  userAnswer,
  isFlagged = false,
  onAnswerSelect,
  onFlagQuestion,
}: QuestionDisplayProps) {
  // Get mobile state
  const isMobile = useMobileStore(selectIsMobile);
  
  // State for showing/hiding explanation
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Find the correct option index using either isCorrect property or correctAnswer field
  const getCorrectOptionIndex = () => {
    // First try to find by isCorrect property
    const indexByProperty = question.options?.findIndex(opt => opt.isCorrect === true);
    
    // If found by isCorrect property, return it
    if (indexByProperty !== undefined && indexByProperty >= 0) {
      return indexByProperty;
    }
    
    // Otherwise, try to find by correctAnswer field matching option label
    if (question.correctAnswer && question.options) {
      const indexByLabel = question.options.findIndex(
        opt => opt.label?.toUpperCase() === question.correctAnswer?.toUpperCase()
      );
      
      if (indexByLabel >= 0) {
        return indexByLabel;
      }
    }
    
    // If no correct answer is found, return -1
    return -1;
  };
  
  const correctOptionIndex = getCorrectOptionIndex();
  
  // Check if an option is correct
  const isOptionCorrect = (option: any, index: number) => {
    // Check by index
    if (index === correctOptionIndex) {
      return true;
    }
    
    // Check by isCorrect property
    if (option.isCorrect === true) {
      return true;
    }
    
    // Check by label matching correctAnswer
    if (question.correctAnswer && 
        option.label?.toUpperCase() === question.correctAnswer?.toUpperCase()) {
      return true;
    }
    
    return false;
  };

  const handleAnswerSelect = (optionIndex: string) => {
    try {
      // Update the selected option immediately for UI feedback
      setSelectedOption(optionIndex);
      
      // Call the parent handler to save the answer
      onAnswerSelect(question.id, parseInt(optionIndex));
    } catch (error) {
      console.error('Error selecting answer option:', error);
    }
  };

  const handleFlagToggle = () => {
    onFlagQuestion(question.id);
  };

  const toggleExplanation = () => {
    // If there's no selection and explanation is hidden, show a message
    if (selectedOption === undefined && !showExplanation) {
      // Could show a toast message here instead
      alert("Please select an answer first before viewing the explanation.");
      return;
    }
    setShowExplanation(!showExplanation);
  };

  const [selectedOption, setSelectedOption] = useState<string | undefined>(userAnswer?.toString());
  
  // Update selected option when userAnswer prop changes
  useEffect(() => {
    setSelectedOption(userAnswer?.toString());
  }, [userAnswer]);
  
  // Define a safe handler for when question.options might be undefined
  const renderOptions = () => {
    const hasUserSelection = selectedOption !== undefined;
    
    if (!question.options || !Array.isArray(question.options)) {
      return (
        <div className="text-red-500 p-4 border border-red-200 rounded-md bg-red-50">
          No options available for this question
        </div>
      );
    }

    return (
      <RadioGroup
        value={selectedOption || ''}
        onValueChange={handleAnswerSelect}
        className={`space-y-${isMobile ? '1.5' : '3'} ${isMobile ? 'mt-3' : 'mt-4'}`}
      >
        {question.options.map((option, index) => (
          <QuestionOption 
            key={index}
            index={index}
            option={option}
            isSelected={selectedOption === index.toString()}
            isCorrect={isOptionCorrect(option, index)}
            showExplanation={showExplanation}
            questionId={question.id}
            onClick={() => handleAnswerSelect(index.toString())}
            isMobile={isMobile}
            hasUserSelection={hasUserSelection}
          />
        ))}
      </RadioGroup>
    );
  };

  return (
    <Card className={`w-full ${isMobile ? 'shadow-sm' : 'shadow-lg'} border ${isMobile ? 'border-gray-200' : 'border-gray-100'} rounded-xl overflow-hidden`}>
      <CardHeader className={`${isMobile ? 'pb-1.5 px-3 pt-2' : 'pb-2'} border-b bg-gradient-to-r from-blue-50 to-white`}>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className={`bg-blue-600 text-white ${isMobile ? 'text-xs w-6 h-6' : 'text-sm w-8 h-8'} font-medium rounded-full flex items-center justify-center ${isMobile ? 'mr-2' : 'mr-3'} shadow-sm`}>
              {question.questionNumber || question.id}
            </span>
            <CardTitle className={`${isMobile ? 'text-sm' : 'text-lg'} font-semibold text-blue-700`}>
              Question
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {!isMobile && (
              <Button 
                variant="ghost"
                size="sm"
                className="flex items-center space-x-1 rounded-lg"
                onClick={toggleExplanation}
                title={selectedOption === undefined ? "Please select an option first" : ""}
              >
                {showExplanation ? (
                  <>
                    <EyeOffIcon className="h-4 w-4" />
                    <span>Hide Explanation</span>
                  </>
                ) : (
                  <>
                    <EyeIcon className="h-4 w-4" />
                    <span>Show Explanation</span>
                  </>
                )}
              </Button>
            )}
            <Button 
              variant={isFlagged ? "secondary" : "ghost"}
              size={isMobile ? "xs" : "sm"}
              onClick={handleFlagToggle}
              className={cn(
                "rounded-lg",
                isMobile ? "h-7 px-2" : "",
                isFlagged 
                  ? "bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-200" 
                  : "text-gray-500"
              )}
              aria-label={isFlagged ? "Unflag question" : "Flag question for review"}
            >
              {isFlagged ? (
                <>
                  <FlagIcon className={`${isMobile ? 'h-3 w-3 mr-1' : 'h-4 w-4 mr-1.5'} text-amber-500`} />
                  {!isMobile && <span>Flagged</span>}
                </>
              ) : (
                <>
                  <FlagIcon className={isMobile ? 'h-3 w-3' : 'h-4 w-4 mr-1.5'} />
                  {!isMobile && <span>Flag</span>}
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className={`${isMobile ? 'pt-2 px-3 pb-3' : 'pt-6'}`}>
        <div className={isMobile ? "mb-3" : "mb-4"}>
          <h3 className={`${isMobile ? 'text-sm leading-normal' : 'text-lg leading-7'} font-medium text-gray-800`}>
            {question.text}
          </h3>
        </div>

        {renderOptions()}
        
        {isMobile && (
          <div className="mt-3 flex justify-end">
            <Button 
              variant="outline"
              size="xs"
              className="text-xs h-7 px-2"
              onClick={toggleExplanation}
              title={selectedOption === undefined ? "Please select an option first" : ""}
            >
              {showExplanation ? (
                <>
                  <EyeOffIcon className="h-3 w-3 mr-1" />
                  Hide Answer
                </>
              ) : (
                <>
                  <EyeIcon className="h-3 w-3 mr-1" />
                  Show Answer
                </>
              )}
            </Button>
          </div>
        )}
        
        {showExplanation && selectedOption !== undefined && question.explanation && (
          <ExplanationBox explanation={question.explanation} isMobile={isMobile} />
        )}
      </CardContent>
    </Card>
  );
}