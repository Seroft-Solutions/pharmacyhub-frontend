'use client';

import { useState, useEffect } from 'react';
import { useExamSession } from '../hooks/useExamQueries';
import { useMcqExamStore } from '@/features/exams/store/mcqExamStore';
import { UserAnswer } from '../model/mcqTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

interface ExamContainerProps {
  examId: number;
  userId: number;
}

export function ExamContainer({ examId, userId }: ExamContainerProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, UserAnswer>>({});
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [isExamComplete, setIsExamComplete] = useState(false);
  
  // Get exam session data and mutation functions
  const {
    exam,
    questions,
    isLoading,
    error,
    startExam,
    submitExam,
    isStarting,
    isSubmitting,
    startError,
    submitError
  } = useExamSession(examId);
  
  // Access to Zustand store for any persistent state not handled by React Query
  const examStore = useMcqExamStore();
  
  // Handle exam start
  const handleStartExam = () => {
    startExam(
      { userId },
      {
        onSuccess: (data) => {
          setAttemptId(data.id);
          toast.success('Exam started successfully!');
        },
        onError: (error) => {
          toast.error('Failed to start exam: ' + error.message);
        }
      }
    );
  };
  
  // Handle answer selection
  const handleAnswerSelect = (questionId: number, option: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: { questionId, selectedOption: option }
    }));
  };
  
  // Navigate to next question
  const handleNextQuestion = () => {
    if (questions && currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };
  
  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };
  
  // Submit the exam
  const handleSubmitExam = () => {
    // Convert userAnswers object to array
    const answersArray = Object.values(userAnswers);
    
    // Check if user has answered all questions
    if (questions && answersArray.length < questions.length) {
      toast.warning('Please answer all questions before submitting');
      return;
    }
    
    submitExam(
      { userId, answers: answersArray },
      {
        onSuccess: (data) => {
          setIsExamComplete(true);
          toast.success('Exam submitted successfully!');
        },
        onError: (error) => {
          toast.error('Failed to submit exam: ' + error.message);
        }
      }
    );
  };
  
  // Track progress
  const progress = questions ? (userAnswers ? 
    Math.round((Object.keys(userAnswers).length / questions.length) * 100) : 0) : 0;
  
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-8 w-3/4" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error ? error.message : 'An unknown error occurred'}
        </AlertDescription>
      </Alert>
    );
  }
  
  if (!exam || !questions) {
    return (
      <Alert>
        <AlertTitle>No exam found</AlertTitle>
        <AlertDescription>
          We couldn't find the requested exam. Please check the exam ID and try again.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Display exam completion screen
  if (isExamComplete) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Exam Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <p>You have successfully completed the exam!</p>
          <p>Your answers have been submitted and will be processed.</p>
          <Button className="mt-4" onClick={() => window.location.href = '/exams'}>
            Return to Exams
          </Button>
        </CardContent>
      </Card>
    );
  }
  
  // Display exam start screen if not started
  if (!attemptId) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{exam.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">{exam.description}</p>
          <div className="mb-4">
            <p><strong>Duration:</strong> {exam.duration} minutes</p>
            <p><strong>Total Questions:</strong> {questions.length}</p>
            <p><strong>Passing Score:</strong> {exam.passingScore}</p>
          </div>
          <Button 
            onClick={handleStartExam} 
            disabled={isStarting}
            className="w-full"
          >
            {isStarting ? 'Starting...' : 'Start Exam'}
          </Button>
          {startError && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>
                {startError instanceof Error ? startError.message : 'Failed to start exam'}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    );
  }
  
  // Display the current question
  const currentQuestion = questions[currentQuestionIndex];
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{exam.title} - Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">{currentQuestion.text}</h3>
          <div className="space-y-2">
            {currentQuestion.options.map((option, index) => (
              <div 
                key={index}
                className={`p-3 border rounded cursor-pointer hover:bg-gray-100 ${
                  userAnswers[currentQuestion.id]?.selectedOption === index ? 'bg-blue-100 border-blue-500' : ''
                }`}
                onClick={() => handleAnswerSelect(currentQuestion.id, index)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          
          {currentQuestionIndex < questions.length - 1 ? (
            <Button onClick={handleNextQuestion}>
              Next
            </Button>
          ) : (
            <Button 
              onClick={handleSubmitExam}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Exam'}
            </Button>
          )}
        </div>
        
        {submitError && (
          <Alert variant="destructive" className="mt-4">
            <AlertDescription>
              {submitError instanceof Error ? submitError.message : 'Failed to submit exam'}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}