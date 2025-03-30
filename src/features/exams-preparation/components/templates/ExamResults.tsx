// ExamResults.tsx
"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/features/core/ui/atoms/card';
import { Button } from '@/features/core/ui/atoms/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/features/core/ui/atoms/tabs';
import { CheckCircle, XCircle, HelpCircle, Clock, Award } from 'lucide-react';
import { ExamQuestion } from '../organisms/ExamQuestion';
import { formatTimeVerbose } from '@/features/exams-preparation/utils';

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
  const [activeTab, setActiveTab] = useState<'all' | 'correct' | 'incorrect' | 'unanswered'>('all');

  // Filter questions based on active tab
  const filteredQuestions = () => {
    switch (activeTab) {
      case 'correct':
        return questions.filter(q => q.isCorrect);
      case 'incorrect':
        return questions.filter(q => !q.isCorrect && q.selectedOptionId);
      case 'unanswered':
        return questions.filter(q => !q.selectedOptionId);
      default:
        return questions;
    }
  };

  const displayQuestions = filteredQuestions();

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
          {/* Score overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Score Overview</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Your Score:</span>
                <span className="font-medium">
                  {score}/{totalScore} ({((score / totalScore) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Passing Score:</span>
                <span className="font-medium">
                  {passingScore}/{totalScore} ({((passingScore / totalScore) * 100).toFixed(1)}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Time Spent:</span>
                <span className="font-medium">{formatTimeVerbose(timeSpent)}</span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-medium mb-4">Question Statistics</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center text-gray-600">
                  <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                  Correct:
                </span>
                <span className="font-medium">
                  {correct} ({questions.length > 0 ? ((correct / questions.length) * 100).toFixed(1) : 0}%)
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center text-gray-600">
                  <XCircle className="h-4 w-4 mr-1 text-red-500" />
                  Incorrect:
                </span>
                <span className="font-medium">
                  {incorrect} ({questions.length > 0 ? ((incorrect / questions.length) * 100).toFixed(1) : 0}%)
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center text-gray-600">
                  <HelpCircle className="h-4 w-4 mr-1 text-gray-500" />
                  Unanswered:
                </span>
                <span className="font-medium">
                  {unanswered} ({questions.length > 0 ? ((unanswered / questions.length) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            </div>
          </div>
          
          {/* Questions review */}
          <div>
            <h3 className="text-lg font-medium mb-4">Questions Review</h3>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">
                  All ({questions.length})
                </TabsTrigger>
                <TabsTrigger value="correct">
                  Correct ({correct})
                </TabsTrigger>
                <TabsTrigger value="incorrect">
                  Incorrect ({incorrect})
                </TabsTrigger>
                <TabsTrigger value="unanswered">
                  Unanswered ({unanswered})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab} className="space-y-4">
                {displayQuestions.map((question, index) => (
                  <ExamQuestion
                    key={question.id}
                    id={question.id}
                    number={questions.findIndex(q => q.id === question.id) + 1}
                    text={question.text}
                    options={question.options}
                    selectedOption={question.selectedOptionId}
                    onSelectOption={() => {}}
                    showCorrectAnswer={true}
                    explanation={question.explanation}
                    isReview={true}
                  />
                ))}
                
                {displayQuestions.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">No questions in this category.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
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
