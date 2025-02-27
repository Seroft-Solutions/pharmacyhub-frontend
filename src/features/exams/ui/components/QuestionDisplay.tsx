'use client';

import React from 'react';
import { Question, UserAnswer } from '../../model/mcqTypes';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { BookmarkIcon } from 'lucide-react';

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

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-medium leading-6">
            {question.text}
          </h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleFlagToggle}
            aria-label={isFlagged ? "Unflag question" : "Flag question for review"}
          >
            <BookmarkIcon className={`h-5 w-5 ${isFlagged ? "fill-yellow-400 text-yellow-400" : ""}`} />
          </Button>
        </div>

        <RadioGroup
          value={userAnswer?.toString() || ''}
          onValueChange={handleAnswerSelect}
          className="space-y-3 mt-4"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 border p-3 rounded-md">
              <RadioGroupItem value={index.toString()} id={`option-${question.id}-${index}`} />
              <Label htmlFor={`option-${question.id}-${index}`} className="flex-grow cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
