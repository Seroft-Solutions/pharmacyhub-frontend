'use client';

import React, { FC } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircleIcon } from 'lucide-react';
import { useExamStore } from '../../store/exam-store';

// Define the props interface
interface ExamQuestionProps {
  question: {
    id: number;
    text: string;
    options: { id: number; text: string }[];
    explanation?: string;
  };
  userAnswer?: number;
  isFlagged: boolean;
  onAnswerSelect: (questionId: number, selectedOption: number) => void;
  onFlagQuestion: (questionId: number) => void;
}

/**
 * ExamQuestion Component
 * 
 * Displays an individual exam question with options and allows the user to select an answer.
 */
export const ExamQuestion: FC<ExamQuestionProps> = ({
  question,
  userAnswer,
  isFlagged,
  onAnswerSelect,
  onFlagQuestion,
}) => {
  // Get UI state from store
  const { 
    showExplanation, 
    setShowExplanation,
    highlightedAnswerId,
    setHighlightedAnswerId
  } = useExamStore();
  
  // Handle option click
  const handleOptionClick = (optionId: number) => {
    onAnswerSelect(question.id, optionId);
    setHighlightedAnswerId(optionId);
  };
  
  // Toggle explanation visibility
  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };
  
  return (
    <Card className="shadow-md border border-gray-100 overflow-hidden">
      <CardHeader className="pb-2 border-b bg-gradient-to-r from-gray-50 to-white">
        <div className="flex justify-between items-center">
          <CardTitle className="text-md font-medium">
            Question
          </CardTitle>
          <Badge 
            variant={isFlagged ? "secondary" : "outline"}
            className="cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() => onFlagQuestion(question.id)}
          >
            {isFlagged ? 'Flagged' : 'Flag'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: question.text }} />
        </div>
        
        <div className="mt-6 space-y-2">
          {question.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option.id)}
              className={`w-full text-left p-4 rounded-lg border transition-colors ${
                userAnswer === option.id
                  ? 'bg-blue-50 border-blue-300'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              } ${
                highlightedAnswerId === option.id
                  ? 'ring-2 ring-blue-400'
                  : ''
              }`}
            >
              <div dangerouslySetInnerHTML={{ __html: option.text }} />
            </button>
          ))}
        </div>
        
        {question.explanation && (
          <div className="mt-6">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleExplanation}
              className="w-full justify-between"
            >
              <span>Show Explanation</span>
              <AlertCircleIcon className="h-4 w-4" />
            </Button>
            
            {showExplanation && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="prose max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: question.explanation }} />
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExamQuestion;