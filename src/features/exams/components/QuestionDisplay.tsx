'use client';

import React, { useState, useEffect } from 'react';
import { Question, UserAnswer } from '../types';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BookmarkIcon, ChevronLeftIcon, ChevronRightIcon, FlagIcon, CheckCircleIcon } from 'lucide-react';
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
  const handleAnswerSelect = (optionIndex: string) => {
    onAnswerSelect(question.id, parseInt(optionIndex));
  };

  const handleFlagToggle = () => {
    onFlagQuestion(question.id);
  };

  const [selectedOption, setSelectedOption] = useState<string | undefined>(userAnswer?.toString());
  
  // Update selected option when userAnswer prop changes
  useEffect(() => {
    setSelectedOption(userAnswer?.toString());
  }, [userAnswer]);

  return (
    <Card className="w-full shadow-md border border-gray-100">
      <CardHeader className="pb-2 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="bg-primary text-white text-sm font-medium rounded-full w-6 h-6 flex items-center justify-center mr-2">
              {question.id}
            </span>
            <CardTitle className="text-lg font-semibold">
              Question
            </CardTitle>
          </div>
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
      </CardHeader>
      <CardContent className="pt-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium leading-7 text-gray-800">
            {question.text}
          </h3>
        </div>

        <RadioGroup
          value={selectedOption || ''}
          onValueChange={(value) => {
            setSelectedOption(value);
            handleAnswerSelect(value);
          }}
          className="space-y-3 mt-4"
        >
          {question.options.map((option, index) => (
            <div 
              key={index} 
              className={cn(
                "flex items-center space-x-2 border p-4 rounded-md transition-colors",
                selectedOption === index.toString() 
                  ? "border-primary bg-primary/5" 
                  : "hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              <RadioGroupItem value={index.toString()} id={`option-${question.id}-${index}`} />
              <Label 
                htmlFor={`option-${question.id}-${index}`} 
                className="flex-grow cursor-pointer"
              >
                {option.text}
              </Label>
              {selectedOption === index.toString() && (
                <CheckCircleIcon className="h-5 w-5 text-primary flex-shrink-0" />
              )}
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}