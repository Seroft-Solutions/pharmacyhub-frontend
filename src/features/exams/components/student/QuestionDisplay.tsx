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
  
  // Debug logging for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && showExplanation) {
      console.log('Question options:', question.options);
      console.log('Question correctAnswer:', question.correctAnswer);
      console.log('Correct option index:', correctOptionIndex);
    }
  }, [question.options, question.correctAnswer, correctOptionIndex, showExplanation]);

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
    setShowExplanation(!showExplanation);
  };

  const [selectedOption, setSelectedOption] = useState<string | undefined>(userAnswer?.toString());
  
  // Update selected option when userAnswer prop changes
  useEffect(() => {
    setSelectedOption(userAnswer?.toString());
  }, [userAnswer]);
  
  // Define a safe handler for when question.options might be undefined
  const renderOptions = () => {
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
        className="space-y-3 mt-4"
      >
        {question.options.map((option, index) => {
          // Determine styling based on explanation visibility and correctness
          const isSelected = selectedOption === index.toString();
          const isCorrect = isOptionCorrect(option, index);
          
          let optionClassName = "flex items-center space-x-2 border p-4 rounded-md transition-colors";
          
          // Apply different styling when explanation is shown
          if (showExplanation && selectedOption) {
            if (isCorrect) {
              // Highlight correct option in green only when explanation is shown and user has selected an answer
              optionClassName = cn(optionClassName, "border-green-500 bg-green-50");
            } else if (isSelected) {
              // Only highlight selected incorrect options in red
              optionClassName = cn(optionClassName, "border-red-500 bg-red-50");
            }
          } else if (isSelected) {
            // Regular selected styling when explanation is hidden
            optionClassName = cn(optionClassName, "border-primary bg-primary/5");
          } else {
            // Default unselected styling
            optionClassName = cn(optionClassName, "hover:border-gray-300 hover:bg-gray-50");
          }
          
          return (
            <div key={index} className={optionClassName}>
              <RadioGroupItem value={index.toString()} id={`option-${question.id}-${index}`} />
              <Label 
                htmlFor={`option-${question.id}-${index}`} 
                className="flex-grow cursor-pointer"
              >
                {option.text}
              </Label>
              
              {showExplanation && selectedOption ? (
                isCorrect ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : isSelected ? (
                  <XCircleIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
                ) : null
              ) : isSelected && (
                <CheckCircleIcon className="h-5 w-5 text-primary flex-shrink-0" />
              )}
            </div>
          );
        })}
      </RadioGroup>
    );
  };

  return (
    <Card className="w-full shadow-md border border-gray-100">
      <CardHeader className="pb-2 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="bg-primary text-white text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center mr-2">
              {question.questionNumber || question.id}
            </span>
            <CardTitle className="text-lg font-semibold">
              Question
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost"
              size="sm"
              className="flex items-center space-x-1"
              onClick={toggleExplanation}
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
            <Button 
              variant={isFlagged ? "secondary" : "ghost"}
              size="sm" 
              onClick={handleFlagToggle}
              className={isFlagged ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-100" : "text-gray-500"}
              aria-label={isFlagged ? "Unflag question" : "Flag question for review"}
            >
              {isFlagged ? (
                <>
                  <FlagIcon className="h-4 w-4 mr-1.5 text-yellow-500" />
                  <span>Flagged</span>
                </>
              ) : (
                <>
                  <FlagIcon className="h-4 w-4 mr-1.5" />
                  <span>Flag</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium leading-7 text-gray-800">
            {question.text}
          </h3>
        </div>

        {renderOptions()}
        
        {showExplanation && selectedOption && question.explanation && (
          <div className="mt-6 p-4 border border-blue-200 rounded-md bg-blue-50">
            <div className="flex items-start">
              <InfoIcon className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800 mb-1">Explanation</h4>
                <p className="text-blue-700">{question.explanation}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}