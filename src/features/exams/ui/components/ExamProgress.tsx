'use client';

import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface ExamProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: number;
}

export function ExamProgress({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
}: ExamProgressProps) {
  const progressPercentage = Math.round((answeredQuestions / totalQuestions) * 100);
  const questionProgressPercentage = Math.round(((currentQuestion + 1) / totalQuestions) * 100);
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          Question {currentQuestion + 1} of {totalQuestions}
        </span>
        <Badge variant="outline">
          {answeredQuestions}/{totalQuestions} answered
        </Badge>
      </div>
      
      <div className="space-y-1">
        <Progress 
          value={questionProgressPercentage} 
          className="h-1"
        />
        <Progress 
          value={progressPercentage} 
          className="h-1"
          // The progress color is handled by shadcn's default styling
        />
      </div>
      
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Current progress</span>
        <span>{progressPercentage}% complete</span>
      </div>
    </div>
  );
}
