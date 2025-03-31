// ExamResults.tsx
"use client";

import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExamScoreOverview } from '../molecules/ExamScoreOverview';
import { ExamStatistics } from '../molecules/ExamStatistics';
import { ExamResultsTabs } from '../organisms/ExamResultsTabs';

interface QuestionResult {
  id: string;
  text: string;
  options: Array<{
    id: string;
    text: string;
    isCorrect: boolean;
  }>;
  selectedOptionId?: string;
  isCorrect: boolean;
  explanation?: string;
}

interface ExamResultsProps {
  examId: string;
  title: string;
  description?: string;
  questions: QuestionResult[];
  score: number;
  totalScore: number;
  passingScore: number;
  timeSpent: number; // in seconds
  correct: number;
  incorrect: number;
  unanswered: number;
  isPassed: boolean;
  onTryAgain?: () => void;
  className?: string;
}

export const ExamResults: React.FC<ExamResultsProps> = ({
  examId,
  title,
  description,
  questions,
  score,
  totalScore,
  passingScore,
  timeSpent,
  correct,
  incorrect,
  unanswered,
  isPassed,
  onTryAgain,
  className = '',
}) => {
  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      <Card className="mb-6">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Exam Results</CardTitle>
          <div className="text-xl font-medium mt-2">
            {title}
            {isPassed ? (
              <span className="inline-block ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                Passed
              </span>
            ) : (
              <span className="inline-block ml-2 bg-red-100 text-red-800 px-2 py-1 rounded text-sm">
                Failed
              </span>
            )}
          </div>
          {description && <p className="text-gray-600 mt-1">{description}</p>}
        </CardHeader>
        
        <CardContent>
          {/* Score overview and statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ExamScoreOverview
              score={score}
              totalScore={totalScore}
              passingScore={passingScore}
              timeSpent={timeSpent}
            />
            
            <ExamStatistics
              correct={correct}
              incorrect={incorrect}
              unanswered={unanswered}
              totalQuestions={questions.length}
            />
          </div>
          
          {/* Questions review */}
          <ExamResultsTabs
            questions={questions}
            correct={correct}
            incorrect={incorrect}
            unanswered={unanswered}
          />
        </CardContent>
        
        <CardFooter className="flex justify-center">
          {onTryAgain && (
            <Button onClick={onTryAgain} className="min-w-[150px]">
              Try Again
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default ExamResults;
