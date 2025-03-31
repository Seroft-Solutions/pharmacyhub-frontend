// ExamSidebar.tsx
"use client";

import React from 'react';
import { ExamMetadata } from '../molecules/ExamMetadata';
import { ExamQuestionNavigation } from '../molecules/ExamQuestionNavigation';
import { Button } from '@/components/ui/button';

interface ExamSidebarProps {
  questions: Array<{ id: string }>;
  questionsCount: number;
  durationMinutes: number;
  currentQuestionIndex: number;
  userAnswers: Record<string, string>;
  onSelectQuestion: (index: number) => void;
  onFinishClick: () => void;
}

export const ExamSidebar: React.FC<ExamSidebarProps> = ({
  questions,
  questionsCount,
  durationMinutes,
  currentQuestionIndex,
  userAnswers,
  onSelectQuestion,
  onFinishClick,
}) => {
  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">Exam Progress</h3>
      <ExamMetadata
        questionsCount={questionsCount}
        durationMinutes={durationMinutes}
        variant="compact"
        className="mb-4"
      />
      
      <ExamQuestionNavigation
        questions={questions}
        currentIndex={currentQuestionIndex}
        userAnswers={userAnswers}
        onSelectQuestion={onSelectQuestion}
      />
      
      <Button 
        className="w-full mt-4" 
        onClick={onFinishClick}
      >
        Review & Finish
      </Button>
    </div>
  );
};

export default ExamSidebar;
