'use client';

import React, { useState, useEffect } from 'react';
import { ReloadSiteDialog } from '@/core/ui/dialogs';
import { QuestionDisplay } from '../student/QuestionDisplay';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, SaveIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ModelExamQuestionProps {
  questions: any[];
  initialQuestionIndex?: number;
  onExit?: () => void;
}

/**
 * ModelExamQuestion Component
 * 
 * Enhanced version of the exam question interface for model exams.
 * Includes the reload confirmation dialog when navigating away with unsaved changes.
 */
export function ModelExamQuestion({
  questions,
  initialQuestionIndex = 0,
  onExit,
}: ModelExamQuestionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(initialQuestionIndex);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showReloadDialog, setShowReloadDialog] = useState(false);
  
  // Get current question
  const currentQuestion = questions[currentQuestionIndex];
  
  // Effect to handle beforeunload event (browser refresh/close) - DISABLED
  useEffect(() => {
    // Intentionally empty - no beforeunload handler to prevent browser dialog
    return () => {};
  }, []);
  
  // Handle answer selection
  const handleAnswerSelect = (questionId: number, selectedOption: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
    setHasUnsavedChanges(true);
  };
  
  // Handle flagging questions
  const handleFlagQuestion = (questionId: number) => {
    setFlaggedQuestions(prev => {
      const newFlagged = new Set(prev);
      if (newFlagged.has(questionId)) {
        newFlagged.delete(questionId);
      } else {
        newFlagged.add(questionId);
      }
      return newFlagged;
    });
    setHasUnsavedChanges(true);
  };
  
  // Navigation functions
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  // Save changes
  const saveChanges = () => {
    // Simulating save operation
    console.log('Saving answers:', userAnswers);
    console.log('Flagged questions:', Array.from(flaggedQuestions));
    
    // In a real implementation, you would save to the server here
    setTimeout(() => {
      setHasUnsavedChanges(false);
    }, 500);
  };
  
  // Handle exit with unsaved changes
  const handleExit = () => {
    if (hasUnsavedChanges) {
      setShowReloadDialog(true);
    } else if (onExit) {
      onExit();
    }
  };
  
  // Dialog handlers
  const handleReload = () => {
    setShowReloadDialog(false);
    if (onExit) {
      onExit();
    }
  };
  
  const handleCancelReload = () => {
    setShowReloadDialog(false);
  };
  
  // Calculate completion percentage
  const answeredQuestionsCount = Object.keys(userAnswers).length;
  const completionPercentage = Math.round((answeredQuestionsCount / questions.length) * 100);

  return (
    <div className="space-y-4">
      {/* Progress indicator */}
      <Card className="shadow-sm border border-gray-100">
        <CardContent className="pt-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <span>
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span>
                {completionPercentage}% Complete
              </span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
            
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Answered:</span>{' '}
                <span className="text-blue-600">{answeredQuestionsCount}</span> of {questions.length}
              </div>
              <div>
                <span className="font-medium">Flagged:</span>{' '}
                <span className="text-amber-600">{flaggedQuestions.size}</span> of {questions.length}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Question display */}
      {currentQuestion && (
        <QuestionDisplay
          question={currentQuestion}
          userAnswer={userAnswers[currentQuestion.id]}
          isFlagged={flaggedQuestions.has(currentQuestion.id)}
          onAnswerSelect={handleAnswerSelect}
          onFlagQuestion={handleFlagQuestion}
        />
      )}
      
      {/* Navigation buttons */}
      <div className="flex justify-between gap-2 mt-4">
        <Button
          variant="outline"
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className="px-4 py-2 rounded-lg"
        >
          <ChevronLeftIcon className="h-4 w-4 mr-1" />
          Previous
        </Button>
        
        <div className="flex space-x-2">
          <Button
            variant={hasUnsavedChanges ? "default" : "outline"}
            onClick={saveChanges}
            disabled={!hasUnsavedChanges}
            className={`px-4 py-2 rounded-lg ${hasUnsavedChanges ? 'bg-green-600 hover:bg-green-700' : ''}`}
          >
            <SaveIcon className="h-4 w-4 mr-1" />
            Save Progress
          </Button>
          
          <Button
            variant="secondary"
            onClick={handleExit}
            className="px-4 py-2 rounded-lg"
          >
            Exit
          </Button>
        </div>
        
        <Button
          variant="outline"
          onClick={goToNextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          className="px-4 py-2 rounded-lg"
        >
          Next
          <ChevronRightIcon className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      {/* Reload confirmation dialog */}
      <ReloadSiteDialog
        isOpen={showReloadDialog}
        onReload={handleReload}
        onCancel={handleCancelReload}
        message="You have unsaved changes. Navigating away will lose your progress."
      />
    </div>
  );
}

export default ModelExamQuestion;