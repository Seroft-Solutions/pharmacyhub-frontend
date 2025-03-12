'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { CheckCircleIcon, ClipboardListIcon, Loader2Icon } from 'lucide-react';

import { useExamSession } from '@/features/exams/hooks/useExamSession';
import { useExamStore } from '../store/examStore';
import { NetworkStatusIndicator } from './components/NetworkStatusIndicator';
import { ExamErrorBoundary } from './components/ExamErrorBoundary';
import { useExamAnalytics } from '../hooks/useExamAnalytics';
import { QuestionDisplay } from './components/QuestionDisplay';
import { QuestionNavigation } from './components/QuestionNavigation';
import { ExamProgress } from './components/ExamProgress';
import { ExamTimer } from './components/ExamTimer';
import { ExamSummary } from './components/ExamSummary';
import { ExamResults } from './components/ExamResults';

interface ExamContainerProps {
  examId: number;
  userId: string;
  onExit?: () => void;
}

export function ExamContainer({ 
  examId, 
  userId,
  onExit 
}: ExamContainerProps) {
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  // Setup analytics tracking
  const analytics = useExamAnalytics(examId, userId);
  
  const {
    // Data
    exam,
    questions,
    currentQuestionIndex,
    answers,
    flaggedQuestions,
    timeRemaining,
    isCompleted,
    showSummary,
    
    // Loading states
    isLoading,
    error,
    isStarting,
    isSubmitting,
    isSaving,
    isFlagging,
    startError,
    submitError,
    
    // Actions
    startExam,
    answerQuestion,
    toggleFlagQuestion,
    navigateToQuestion,
    nextQuestion,
    previousQuestion,
    toggleSummary,
    submitExam,
    handleTimeExpired,
    
    // Helpers
    hasAnswer,
    isFlagged,
    getAnsweredQuestionsCount,
    getFlaggedQuestionsCount,
    getCompletionPercentage
  } = useExamSession(examId);
  
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
          toast.error('Failed to start exam: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
      }
    );
  };
  
  // Handle exam submission
  const handleSubmitExam = () => {
    submitExam(
      undefined,
      {
        onSuccess: (data) => {
          setShowResults(true);
          toast.success('Exam submitted successfully!');
        },
        onError: (error) => {
          toast.error('Failed to submit exam: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
      }
    );
  };
  
  // Return to dashboard
  const handleReturnToDashboard = () => {
    if (onExit) {
      onExit();
    } else {
      // Fallback navigation if onExit isn't provided
      window.location.href = '/dashboard';
    }
  };
  
  // Handle timer expiration
  useEffect(() => {
    if (timeRemaining === 0 && !isCompleted && attemptId) {
      toast.warning('Time is up! Your exam will be submitted automatically.');
      submitExam();
    }
  }, [timeRemaining, isCompleted, attemptId, submitExam]);
  
  // Save exam state to store when attempt is created
  useEffect(() => {
    if (attemptId && exam && questions.length > 0) {
      useExamStore.getState().startExam(exam.id, questions, exam.duration);
      useExamStore.getState().setAttemptId(attemptId);
    }
  }, [attemptId, exam, questions]);
  
  // Loading state
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
  
  // Error state
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
  
  // If no exam data is available
  if (!exam || !questions || questions.length === 0) {
    return (
      <Alert>
        <AlertTitle>No exam found</AlertTitle>
        <AlertDescription>
          We couldn&apos;t find the requested exam. Please check the exam ID and try again.
        </AlertDescription>
      </Alert>
    );
  }
  
  // Current question
  const currentQuestion = questions[currentQuestionIndex];
  const answeredQuestionsSet = new Set(
    Object.values(answers).map(answer => answer.questionId)
  );
  
  // Show exam results
  if (showResults) {
    return (
      <ExamResults
        result={{
          attemptId: attemptId as number,
          examId: exam.id,
          examTitle: exam.title,
          score: Math.round((getAnsweredQuestionsCount() / questions.length) * 100),
          totalMarks: exam.totalMarks,
          passingMarks: exam.passingMarks,
          isPassed: (getAnsweredQuestionsCount() / questions.length) * 100 >= (exam.passingMarks / exam.totalMarks) * 100,
          timeSpent: exam.duration * 60 - timeRemaining,
          totalQuestions: questions.length,
          correctAnswers: getAnsweredQuestionsCount(), // Will be updated with actual data when API is connected
          incorrectAnswers: questions.length - getAnsweredQuestionsCount(), // Will be updated with actual data
          unanswered: questions.length - getAnsweredQuestionsCount(),
          completedAt: new Date().toISOString(),
          questionResults: Object.values(answers).map(answer => ({
            questionId: answer.questionId,
            userAnswer: answer.selectedOption,
            correctAnswer: 0, // Will be updated with actual data
            isCorrect: false, // Will be updated with actual data
            points: 1, // Will be updated with actual data
            explanation: ""
          }))
        }}
        questions={questions}
        userAnswers={answers}
        onReturnToDashboard={handleReturnToDashboard}
      />
    );
  }
  
  // Show exam summary
  if (showSummary) {
    return (
      <ExamSummary
        questions={questions}
        answeredQuestionIds={answeredQuestionsSet}
        flaggedQuestionIds={flaggedQuestions}
        onNavigateToQuestion={(index) => {
          toggleSummary();
          navigateToQuestion(index);
        }}
        onSubmitExam={handleSubmitExam}
      />
    );
  }
  
  // Display exam start screen if not started
  if (!attemptId && !isStarting) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{exam.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <p className="text-gray-600">{exam.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Duration</h3>
                <p className="text-lg">{exam.duration} minutes</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Total Questions</h3>
                <p className="text-lg">{questions.length}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Total Marks</h3>
                <p className="text-lg">{exam.totalMarks}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-500">Passing Marks</h3>
                <p className="text-lg">{exam.passingMarks}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-md">
              <h3 className="text-blue-800 font-medium">Instructions:</h3>
              <ul className="list-disc list-inside text-blue-700 mt-2 space-y-1">
                <li>Read each question carefully before answering.</li>
                <li>You can flag questions to review later.</li>
                <li>Once the time is up, the exam will be submitted automatically.</li>
                <li>You can review all your answers before final submission.</li>
              </ul>
            </div>
            
            <Button 
              onClick={handleStartExam} 
              disabled={isStarting}
              className="w-full"
              size="lg"
            >
              {isStarting ? 'Starting...' : 'Start Exam'}
            </Button>
            
            {startError && (
              <Alert variant="destructive">
                <AlertDescription>
                  {startError instanceof Error ? startError.message : 'Failed to start exam'}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Main exam interface
  return (
    <div className="space-y-4">
      <Card className="shadow-md border border-gray-100">
        <CardHeader className="pb-3 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl font-bold">{exam.title}</CardTitle>
              <p className="text-sm text-gray-500 mt-1">{exam.description}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleSummary}
                className="flex items-center"
              >
                <ClipboardListIcon className="h-4 w-4 mr-1.5" />
                Review Answers
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="h-4 w-4 mr-1.5 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                    Submit Exam
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="md:col-span-3">
              <ExamProgress 
                currentQuestion={currentQuestionIndex}
                totalQuestions={questions.length}
                answeredQuestions={answeredQuestionsSet.size}
                flaggedQuestionsCount={flaggedQuestions.size}
                timePercentage={Math.round((timeRemaining / (exam.duration * 60)) * 100)}
              />
            </div>
            <div>
              <ExamTimer 
                durationInMinutes={exam.duration}
                onTimeExpired={handleTimeExpired}
                isCompleted={isCompleted}
              />
            </div>
          </div>
          
          <Separator className="my-4" />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-3">
          {currentQuestion && (
            <QuestionDisplay
              question={currentQuestion}
              userAnswer={answers[currentQuestion.id]?.selectedOption}
              isFlagged={isFlagged(currentQuestion.id)}
              onAnswerSelect={answerQuestion}
              onFlagQuestion={toggleFlagQuestion}
            />
          )}
        </div>
        
        <div>
          <Card className="shadow-sm border border-gray-100">
            <CardContent className="py-4">
              <QuestionNavigation
                currentIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                answeredQuestions={answeredQuestionsSet}
                flaggedQuestions={flaggedQuestions}
                onNavigate={navigateToQuestion}
                onFinishExam={toggleSummary}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      
      {submitError && (
        <Alert variant="destructive">
          <AlertTitle>Submission Failed</AlertTitle>
          <AlertDescription>
            {submitError instanceof Error ? submitError.message : 'Failed to submit exam. Please try again.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
