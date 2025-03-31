/**
 * ExamQuestionCard component
 * Displays a question with its options and navigation controls
 */
"use client";

import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ExamQuestion } from './ExamQuestion';
import { ExamQuestionNavigation } from '../molecules/ExamQuestionNavigation';

interface ExamQuestionCardProps {
  /** Unique identifier for the question */
  questionId: string;
  /** Question number (1-based index) */
  questionNumber: number;
  /** Question text */
  questionText: string;
  /** Available options for the question */
  options: Array<{
    id: string;
    text: string;
    isCorrect?: boolean;
  }>;
  /** Currently selected option ID */
  selectedOption?: string;
  /** Handler for selecting an option */
  onSelectOption: (questionId: string, optionId: string) => void;
  /** Whether this is the first question */
  isFirstQuestion: boolean;
  /** Whether this is the last question */
  isLastQuestion: boolean;
  /** Handler for navigating to the previous question */
  onPrevQuestion: () => void;
  /** Handler for navigating to the next question */
  onNextQuestion: () => void;
  /** Handler for finishing the exam */
  onFinishClick: () => void;
  /** Optional handler for direct submission without review */
  onDirectSubmit?: () => void;
  /** Optional custom class name */
  className?: string;
}

/**
 * Card component displaying a single exam question with navigation
 */
export const ExamQuestionCard: React.FC<ExamQuestionCardProps> = ({
  questionId,
  questionNumber,
  questionText,
  options,
  selectedOption,
  onSelectOption,
  isFirstQuestion,
  isLastQuestion,
  onPrevQuestion,
  onNextQuestion,
  onFinishClick,
  onDirectSubmit,
  className = '',
}) => {
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <ExamQuestion
          id={questionId}
          number={questionNumber}
          text={questionText}
          options={options}
          selectedOption={selectedOption}
          onSelectOption={onSelectOption}
        />
      </CardContent>
      <CardFooter>
        <ExamQuestionNavigation
          isFirstQuestion={isFirstQuestion}
          isLastQuestion={isLastQuestion}
          onPrevQuestion={onPrevQuestion}
          onNextQuestion={onNextQuestion}
          onFinishClick={onFinishClick}
          onDirectSubmit={onDirectSubmit}
        />
      </CardFooter>
    </Card>
  );
};

export default ExamQuestionCard;
