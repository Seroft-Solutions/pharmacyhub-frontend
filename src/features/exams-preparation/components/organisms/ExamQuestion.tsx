// ExamQuestion.tsx
"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/features/core/ui/atoms/card';
import { RadioGroup, RadioGroupItem } from '@/features/core/ui/atoms/radio-group';
import { Label } from '@/features/core/ui/atoms/label';
import { Button } from '@/features/core/ui/atoms/button';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface Option {
  id: string;
  text: string;
  isCorrect?: boolean;
}

interface ExamQuestionProps {
  id: string;
  number: number;
  text: string;
  options: Option[];
  selectedOption?: string;
  onSelectOption: (questionId: string, optionId: string) => void;
  showCorrectAnswer?: boolean;
  explanation?: string;
  isReview?: boolean;
  className?: string;
}

export const ExamQuestion: React.FC<ExamQuestionProps> = ({
  id,
  number,
  text,
  options,
  selectedOption,
  onSelectOption,
  showCorrectAnswer = false,
  explanation,
  isReview = false,
  className = '',
}) => {
  const [showExplanation, setShowExplanation] = useState(false);

  const correctOptionId = useMemo(() => {
    if (!showCorrectAnswer) return null;
    return options.find(option => option.isCorrect)?.id;
  }, [options, showCorrectAnswer]);

  const isAnsweredCorrectly = useMemo(() => {
    if (!showCorrectAnswer || !selectedOption) return false;
    return selectedOption === correctOptionId;
  }, [showCorrectAnswer, selectedOption, correctOptionId]);

  const getOptionClassName = (optionId: string) => {
    if (!showCorrectAnswer) return '';
    
    if (optionId === correctOptionId) {
      return 'bg-green-50 border-green-200';
    }
    
    if (optionId === selectedOption && optionId !== correctOptionId) {
      return 'bg-red-50 border-red-200';
    }
    
    return '';
  };

  return (
    <Card className={`shadow-sm ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-start">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm mr-2">
            {number}
          </span>
          <span className="flex-1">{text}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedOption} 
          onValueChange={(value) => {
            if (!isReview) {
              onSelectOption(id, value);
            }
          }}
          className="space-y-3"
        >
          {options.map((option) => (
            <div
              key={option.id}
              className={`flex items-start space-x-2 rounded-md border p-3 ${getOptionClassName(option.id)}`}
            >
              <RadioGroupItem
                value={option.id}
                id={`option-${id}-${option.id}`}
                disabled={isReview}
              />
              <Label
                htmlFor={`option-${id}-${option.id}`}
                className="flex-1 cursor-pointer"
              >
                {option.text}
              </Label>
              {showCorrectAnswer && option.id === correctOptionId && (
                <CheckCircle className="h-5 w-5 text-green-500" />
              )}
              {showCorrectAnswer && option.id === selectedOption && option.id !== correctOptionId && (
                <AlertCircle className="h-5 w-5 text-red-500" />
              )}
            </div>
          ))}
        </RadioGroup>
      </CardContent>
      
      {explanation && showCorrectAnswer && (
        <CardFooter className="flex flex-col items-start">
          <Button
            variant="link"
            onClick={() => setShowExplanation(!showExplanation)}
            className="px-0 mb-2"
          >
            {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
          </Button>
          
          {showExplanation && (
            <div className="text-sm p-3 bg-gray-50 rounded-md w-full">
              <div className="font-medium mb-1">Explanation:</div>
              <div>{explanation}</div>
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default ExamQuestion;
