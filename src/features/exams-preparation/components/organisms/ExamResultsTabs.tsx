// ExamResultsTabs.tsx
"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExamQuestion } from './ExamQuestion';

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

interface ExamResultsTabsProps {
  questions: QuestionResult[];
  correct: number;
  incorrect: number;
  unanswered: number;
}

export const ExamResultsTabs: React.FC<ExamResultsTabsProps> = ({
  questions,
  correct,
  incorrect,
  unanswered,
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
          {displayQuestions.map((question) => (
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
  );
};

export default ExamResultsTabs;
