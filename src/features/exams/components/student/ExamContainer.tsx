'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import logger from '@/shared/lib/logger';
import { 
  CheckCircleIcon, 
  ClipboardListIcon, 
  Loader2Icon,
  AlertTriangleIcon,
  ChevronLeft,
  ChevronRight,
  Clock8Icon,
  Play as PlayIcon,
  LifeBuoy as LifeBuoyIcon,
  Map as MapIcon
} from 'lucide-react';

// Import hooks and components
import { useExamSession } from '../../hooks/useExamSession';
import { useExamStore } from '../../store/examStore';
import { useExamAnalytics } from '../../hooks/useExamAnalytics';
import { NetworkStatusIndicator } from '../common/NetworkStatusIndicator';
import { ExamErrorBoundary } from '../common/ExamErrorBoundary';
import { QuestionDisplay } from './QuestionDisplay';
import { QuestionNavigation } from './QuestionNavigation';
import { ExamProgress } from './ExamProgress';
import { ExamTimer } from '../common/ExamTimer';
import { ExamSummary } from './ExamSummary';
import { ExamResults } from '../results/ExamResults';

interface ExamContainerProps {
  examId: number;
  userId: string;
  onExit?: () => void;
  showTimer?: boolean;
}

/**
 * ExamContainer Component
 * 
 * The main container for the exam feature that orchestrates the exam-taking experience.
 * It manages the flow between different stages of an exam:
 * - Start screen
 * - Question navigation
 * - Summary/review
 * - Results
 */
function ExamContainerInternal({ 
  examId, 
  userId,
  onExit,
  showTimer = true
}: ExamContainerProps) {
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  // Track submission state across different callbacks with useRef
  const isSubmittingRef = useRef(false);
  
  // Setup analytics tracking
  const analytics = useExamAnalytics(examId, userId);
  
  // Get exam session data from hook
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
  
  // Check online status
  useEffect(() => {
    setIsOnline(navigator.onLine);
    
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  // Debug logging
  useEffect(() => {
    if (exam && process.env.NODE_ENV === 'development') {
      console.log('Exam data structure:', {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        duration: exam.duration,
        durationMinutes: exam.durationMinutes,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        hasQuestions: !!exam.questions,
        questionsLength: exam.questions?.length,
        questionCount: exam.questionCount,
        allKeys: Object.keys(exam)
      });
      
      if (questions && questions.length > 0) {
        console.log('First question structure:', {
          id: questions[0].id,
          text: questions[0].text,
          questionNumber: questions[0].questionNumber,
          numOptions: questions[0].options?.length,
          allKeys: Object.keys(questions[0])
        });
      }
    }
  }, [exam, questions]);
  
  // Handle exam start with analytics
  const handleStartExam = () => {
    analytics.trackEvent('exam_start', { examId, userId });
    
    startExam(
      { userId },
      {
        onSuccess: (data) => {
          setAttemptId(data.id);
          toast.success('Exam started successfully!');
        },
        onError: (error) => {
          analytics.trackEvent('exam_start_error', { error: error instanceof Error ? error.message : 'Unknown error' });
          toast.error('Failed to start exam: ' + (error instanceof Error ? error.message : 'Unknown error'));
        }
      }
    );
  };
  
  // Track question navigation
  const handleNavigateToQuestion = (index: number) => {
    analytics.trackEvent('question_navigate', { from: currentQuestionIndex, to: index });
    navigateToQuestion(index);
  };
  
  // Track answer selection
  const handleAnswerQuestion = (questionId: number, selectedOption: number) => {
    analytics.trackEvent('question_answer', { questionId, selectedOption });
    try {
      answerQuestion(questionId, selectedOption);
    } catch (error) {
      console.error('Error answering question:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check if it's an authentication or permission error
      if (errorMessage.includes('403') || errorMessage.includes('401') || errorMessage.includes('Authentication')) {
        toast.error('Authentication error. Please refresh the page and try again.');
      } else {
        toast.error(`Failed to save answer: ${errorMessage}`);
      }
      
      // Try to recover by refreshing the attempt data
      if (attemptId) {
        // This is a stub - in a real implementation, you would refresh the attempt data
        toast.info('Attempting to recover your session...');
      }
    }
  };
  
  // Track question flagging
  const handleToggleFlag = (questionId: number) => {
    const isCurrentlyFlagged = isFlagged(questionId);
    analytics.trackEvent(isCurrentlyFlagged ? 'question_unflag' : 'question_flag', { questionId });
    
    try {
      toggleFlagQuestion(questionId);
    } catch (error) {
      console.error('Error toggling flag:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check if it's an authentication or permission error
      if (errorMessage.includes('403') || errorMessage.includes('401') || errorMessage.includes('Authentication')) {
        toast.error('Authentication error. Please refresh the page and try again.');
      } else {
        toast.error(`Failed to ${isCurrentlyFlagged ? 'unflag' : 'flag'} question: ${errorMessage}`);
      }
    }
  };
  
  // Handle exam submission with analytics
  const handleSubmitExam = () => {
    // Prevent multiple submissions
    if (isSubmittingRef.current) {
      logger.info('Submission already in progress, ignoring duplicate request');
      return;
    }
    
    // Set submitting flag
    isSubmittingRef.current = true;
    
    analytics.trackEvent('exam_submit', { 
      answeredCount: getAnsweredQuestionsCount(),
      totalQuestions: questions.length,
      timeRemaining,
      completionPercentage: getCompletionPercentage()
    });
    
    try {
      submitExam(
        undefined,
        {
          onSuccess: (data) => {
            setShowResults(true);
            toast.success('Exam submitted successfully!');
            analytics.trackEvent('exam_submit_success', { examId, score: data?.score });
            // Keep isSubmittingRef.current as true since submission was successful
            // and we don't want to allow further submissions
          },
          onError: (error) => {
            // Reset submitting flag on error to allow retrying
            isSubmittingRef.current = false;
            
            analytics.trackEvent('exam_submit_error', { error: error instanceof Error ? error.message : 'Unknown error' });
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            
            // Check if it's an authentication or permission error
            if (errorMessage.includes('403') || errorMessage.includes('401') || errorMessage.includes('Authentication')) {
              toast.error('Authentication error. Please refresh the page and try again.');
            } else {
              toast.error(`Failed to submit exam: ${errorMessage}`);
            }
          }
        }
      );
    } catch (error) {
      // Reset submitting flag on error to allow retrying
      isSubmittingRef.current = false;
      
      console.error('Error submitting exam:', error);
      analytics.trackEvent('exam_submit_error', { error: error instanceof Error ? error.message : 'Unknown error' });
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Check if it's an authentication or permission error
      if (errorMessage.includes('403') || errorMessage.includes('401') || errorMessage.includes('Authentication')) {
        toast.error('Authentication error. Please refresh the page and try again.');
      } else {
        toast.error(`Failed to submit exam: ${errorMessage}`);
      }
    }
  };
  
  // Return to dashboard
  const handleReturnToDashboard = () => {
    analytics.trackEvent('exam_exit');
    
    if (onExit) {
      onExit();
    } else {
      // Fallback navigation if onExit isn't provided
      window.location.href = '/dashboard';
    }
  };
  
  // Handle review answers action
  const handleReviewAnswers = () => {
    analytics.trackEvent('exam_review_answers');
    // Reset showResults but keep isCompleted state
    setShowResults(false);
    // Show the summary view for review
    toggleSummary();
  };
  
  // Handle try again action
  const handleTryAgain = () => {
    analytics.trackEvent('exam_try_again');
    // Reset all states for a fresh start
    setAttemptId(null);
    setShowResults(false);
    useExamStore.getState().resetExam();
    // Start a new attempt immediately
    handleStartExam();
  };
  
  // Handle timer expiration with analytics
  const handleExamTimeExpired = () => {
    // Prevent duplicate submissions
    if (isSubmittingRef.current) {
      logger.info('Submission already in progress, ignoring timer expiration submission');
      return;
    }
    
    // Set submitting flag
    isSubmittingRef.current = true;
    
    analytics.trackEvent('exam_time_expired', {
      answeredCount: getAnsweredQuestionsCount(),
      totalQuestions: questions.length,
      completionPercentage: getCompletionPercentage()
    });
    
    toast.warning('Time is up! Your exam will be submitted automatically.');
    submitExam();
  };
  
  // Create a set of answered question IDs for easier access
  const answeredQuestionsSet = new Set(
    Object.values(answers).map(answer => answer.questionId)
  );
  
  // Debug logging for answers and flagged questions
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Answered questions:', {
        answersObj: answers,
        answersArray: Object.values(answers).map(a => a.questionId),
        answeredQuestionsSet: Array.from(answeredQuestionsSet),
        flaggedQuestions: Array.from(flaggedQuestions)
      });
    }
  }, [answers, flaggedQuestions, answeredQuestionsSet]);
  
  // Handle timer expiration
  useEffect(() => {
    if (timeRemaining === 0 && !isCompleted && attemptId) {
      handleExamTimeExpired();
    }
  }, [timeRemaining, isCompleted, attemptId]);
  
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
        onReview={handleReviewAnswers}
        onTryAgain={handleTryAgain}
        onBackToDashboard={handleReturnToDashboard}
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
        onNavigateToQuestion={handleNavigateToQuestion}
        onSubmitExam={handleSubmitExam}
      />
    );
  }
  
  // Display exam start screen if not started
  if (!attemptId && !isStarting) {
    return (
      <Card className="w-full shadow-lg border-t-4 border-t-blue-500 rounded-xl overflow-hidden">
        <CardHeader className="pb-3 border-b bg-gradient-to-r from-blue-50 to-white">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold text-blue-700">{exam.title}</CardTitle>
            <NetworkStatusIndicator />
          </div>
        </CardHeader>
        <CardContent className="py-8">
          <div className="space-y-8">
            <div className="max-w-3xl">
              <p className="text-gray-600 text-lg">{exam.description}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl shadow-sm border border-blue-100">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <Clock8Icon className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Duration</h3>
                  <p className="text-xl font-medium">{exam.duration || exam.durationMinutes || 0} minutes</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <ClipboardListIcon className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Questions</h3>
                  <p className="text-xl font-medium">{questions.length || exam.questionCount || 0}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <CheckCircleIcon className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Total Marks</h3>
                  <p className="text-xl font-medium">{exam.totalMarks}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="bg-amber-100 p-3 rounded-full">
                  <AlertTriangleIcon className="h-8 w-8 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-500">Passing Marks</h3>
                  <p className="text-xl font-medium">{exam.passingMarks}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg shadow-sm">
              <h3 className="text-blue-800 font-medium text-lg mb-4">Instructions:</h3>
              <ul className="list-disc list-inside text-blue-700 space-y-2">
                <li>Read each question carefully before answering.</li>
                <li>You can flag questions to review later.</li>
                <li>Once the time is up, the exam will be submitted automatically.</li>
                <li>You can review all your answers before final submission.</li>
                <li>You must click the "Start Exam" button to begin.</li>
              </ul>
            </div>
            
            {!isOnline && (
              <Alert variant="warning" className="bg-amber-50 border-amber-200">
                <AlertTriangleIcon className="h-4 w-4" />
                <AlertTitle>Limited connectivity</AlertTitle>
                <AlertDescription>
                  You are currently offline. Your progress will be saved locally, but you need an internet connection to submit the exam.
                </AlertDescription>
              </Alert>
            )}
            
            <Button 
              onClick={handleStartExam} 
              disabled={isStarting || !isOnline}
              className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 rounded-lg"
              size="lg"
            >
              {isStarting ? (
                <span className="flex items-center justify-center">
                  <Loader2Icon className="h-5 w-5 mr-2 animate-spin" /> 
                  Starting...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Start Exam
                </span>
              )}
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
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {/* Main question area - takes up more space */}
      <div className="md:col-span-2 lg:col-span-3 space-y-4">
        <Card className="shadow-md border border-gray-100 overflow-hidden">
          <CardHeader className="pb-3 border-b bg-gradient-to-r from-blue-50 to-white">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl font-bold text-blue-700">{exam.title}</CardTitle>
                <p className="text-sm text-gray-500 mt-1">{exam.description}</p>
              </div>
              {showTimer && (
                <div className="md:hidden w-24">
                  <ExamTimer
                    durationInMinutes={exam.duration || exam.durationMinutes || 60}
                    onTimeExpired={handleExamTimeExpired}
                    isCompleted={isCompleted}
                  />
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 gap-4 mb-4">
              <ExamProgress 
                currentQuestion={currentQuestionIndex}
                totalQuestions={questions.length}
                answeredQuestions={answeredQuestionsSet.size}
                flaggedQuestionsCount={flaggedQuestions.size}
                hideTimer={true} /* Hide the timer in ExamProgress */
              />
            </div>
            
            <Separator className="my-4" />
          </CardContent>
        </Card>

        <div>
          {currentQuestion && (
            <QuestionDisplay
              question={currentQuestion}
              userAnswer={answers[currentQuestion.id]?.selectedOption}
              isFlagged={isFlagged(currentQuestion.id)}
              onAnswerSelect={handleAnswerQuestion}
              onFlagQuestion={handleToggleFlag}
            />
          )}
        </div>
        
        <div className="flex justify-between gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateToQuestion(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 rounded-lg"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateToQuestion(Math.min(questions.length - 1, currentQuestionIndex + 1))}
            disabled={currentQuestionIndex === questions.length - 1}
            className="px-4 py-2 rounded-lg"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>
      
      {/* Side panel with timer and navigation */}
      <div className="space-y-4">
        {showTimer && (
          <div className="hidden md:block">
            <ExamTimer
              durationInMinutes={exam.duration || exam.durationMinutes || 60}
              onTimeExpired={handleExamTimeExpired}
              isCompleted={isCompleted}
            />
          </div>
        )}
        
        <Card className="shadow-md border border-gray-100 overflow-hidden">
          <CardHeader className="pb-2 pt-3 border-b bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center gap-1.5">
              <MapIcon className="h-4 w-4 text-blue-600" />
              <CardTitle className="text-sm font-medium text-blue-700">Questions Navigator</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <QuestionNavigation
              currentIndex={currentQuestionIndex}
              totalQuestions={questions.length}
              answeredQuestions={answeredQuestionsSet}
              flaggedQuestions={flaggedQuestions}
              onNavigate={handleNavigateToQuestion}
              onFinishExam={() => toggleSummary()}
              questions={questions}
            />
          </CardContent>
        </Card>
      </div>
      
      {!isOnline && (
        <Alert variant="warning" className="bg-amber-50 border-amber-200 md:col-span-3 lg:col-span-4">
          <AlertTriangleIcon className="h-4 w-4" />
          <AlertTitle>You are offline</AlertTitle>
          <AlertDescription>
            Your progress is being saved locally. Please reconnect to the internet to submit your exam.
          </AlertDescription>
        </Alert>
      )}
      
      {submitError && (
        <Alert variant="destructive" className="md:col-span-3 lg:col-span-4">
          <AlertTitle>Submission Failed</AlertTitle>
          <AlertDescription>
            {submitError instanceof Error ? submitError.message : 'Failed to submit exam. Please try again.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

/**
 * ExamContainer with Error Boundary
 * 
 * Wraps the ExamContainer component with an error boundary to
 * gracefully handle errors during exam taking.
 */
export function ExamContainer(props: ExamContainerProps) {
  return (
    <ExamErrorBoundary onExit={props.onExit}>
      <ExamContainerInternal {...props} />
    </ExamErrorBoundary>
  );
}

export default ExamContainer;