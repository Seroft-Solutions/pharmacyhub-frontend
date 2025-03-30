// ExamContainer.tsx
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { ExamLayout } from './ExamLayout';
import { ExamQuestion } from '../organisms/ExamQuestion';
import { ExamTimer } from '../molecules/ExamTimer';
import { ExamMetadata } from '../molecules/ExamMetadata';
import { ExamAlertDialog } from '../molecules/ExamAlertDialog';
import { Button } from '@/features/core/ui/atoms/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/features/core/ui/atoms/card';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useExamStore } from '@/features/exams-preparation/state/stores';

interface ExamContainerProps {
  examId: string;
  className?: string;
}

export const ExamContainer: React.FC<ExamContainerProps> = ({
  examId,
  className = '',
}) => {
  // Integration with exam store
  const { 
    exam, 
    currentQuestionIndex, 
    userAnswers,
    isLoading,
    error,
    loadExam,
    selectQuestion,
    answerQuestion,
    finishExam,
    submitExam,
    resetExam
  } = useExamStore();

  // Local state for UI
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [showTimesUpDialog, setShowTimesUpDialog] = useState(false);

  // Load exam on mount
  useEffect(() => {
    loadExam(examId);
  }, [examId, loadExam]);

  // Callbacks
  const handlePrevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      selectQuestion(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex, selectQuestion]);

  const handleNextQuestion = useCallback(() => {
    if (exam && currentQuestionIndex < exam.questions.length - 1) {
      selectQuestion(currentQuestionIndex + 1);
    }
  }, [exam, currentQuestionIndex, selectQuestion]);

  const handleSelectOption = useCallback((questionId: string, optionId: string) => {
    answerQuestion(questionId, optionId);
  }, [answerQuestion]);

  const handleFinishClick = useCallback(() => {
    setShowFinishDialog(true);
  }, []);

  const handleSubmitExam = useCallback(() => {
    setShowFinishDialog(false);
    submitExam();
  }, [submitExam]);

  const handleTimeUp = useCallback(() => {
    setShowTimesUpDialog(true);
  }, []);

  // Current question
  const currentQuestion = exam?.questions[currentQuestionIndex];

  // Navigation state
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = exam ? currentQuestionIndex === exam.questions.length - 1 : false;

  return (
    <ExamLayout
      isLoading={isLoading}
      error={error}
      onRetry={() => loadExam(examId)}
      title={exam?.title}
      className={className}
      header={
        exam && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">{exam.title}</h1>
              {exam.description && (
                <p className="text-gray-600">{exam.description}</p>
              )}
            </div>
            <div className="mt-4 md:mt-0 w-full md:w-auto">
              <ExamTimer
                duration={exam.durationMinutes * 60}
                onTimeUp={handleTimeUp}
              />
            </div>
          </div>
        )
      }
      sidebar={
        exam && (
          <div className="p-4">
            <h3 className="font-medium mb-4">Exam Progress</h3>
            <ExamMetadata
              questionsCount={exam.questions.length}
              durationMinutes={exam.durationMinutes}
              variant="compact"
              className="mb-4"
            />
            
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2">Questions</h4>
              <div className="grid grid-cols-5 gap-2">
                {exam.questions.map((question, index) => (
                  <Button
                    key={question.id}
                    variant={index === currentQuestionIndex ? "default" : userAnswers[question.id] ? "outline" : "ghost"}
                    size="sm"
                    className={`h-8 w-8 p-0 ${userAnswers[question.id] ? "border-green-500" : ""}`}
                    onClick={() => selectQuestion(index)}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </div>
            
            <Button 
              className="w-full mt-4" 
              onClick={handleFinishClick}
            >
              Review & Finish
            </Button>
          </div>
        )
      }
    >
      {currentQuestion && (
        <Card>
          <CardContent className="p-6">
            <ExamQuestion
              id={currentQuestion.id}
              number={currentQuestionIndex + 1}
              text={currentQuestion.text}
              options={currentQuestion.options}
              selectedOption={userAnswers[currentQuestion.id]}
              onSelectOption={handleSelectOption}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={isFirstQuestion}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>
            
            {isLastQuestion ? (
              <Button onClick={handleFinishClick}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Review & Finish
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
      
      {/* Finish Confirmation Dialog */}
      <ExamAlertDialog
        open={showFinishDialog}
        onOpenChange={setShowFinishDialog}
        title="Submit Exam"
        description="Are you sure you want to submit your exam? You won't be able to make changes after submission."
        confirmText="Submit Exam"
        onConfirm={handleSubmitExam}
      />
      
      {/* Time's Up Dialog */}
      <ExamAlertDialog
        open={showTimesUpDialog}
        onOpenChange={setShowTimesUpDialog}
        title="Time's Up!"
        description="Your exam time has expired. Your answers will be submitted automatically."
        confirmText="View Results"
        onConfirm={handleSubmitExam}
        cancelText="Close"
      />
    </ExamLayout>
  );
};

export default ExamContainer;
