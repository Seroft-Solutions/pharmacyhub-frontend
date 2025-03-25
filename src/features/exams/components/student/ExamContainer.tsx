'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
  Map as MapIcon,
  LockIcon,
  DollarSignIcon,
  Menu
} from 'lucide-react';

// Import hooks and components
import { useExamSession } from '../../hooks/useExamSession';
import { useExamStore } from '../../store/examStore';
import { useMcqExamStore } from '../../store/mcqExamStore';
import { useExamAnalytics } from '../../hooks/useExamAnalytics';
import { NetworkStatusIndicator } from '../common/NetworkStatusIndicator';
import { ExamErrorBoundary } from '../common/ExamErrorBoundary';
import { QuestionDisplay } from './QuestionDisplay';
import { QuestionNavigation } from './QuestionNavigation';
import { ExamProgress } from './ExamProgress';
import { ExamTimer } from '../common/ExamTimer';
import { ExamTimerCard } from '../common/ExamTimerCard';
import { HeaderTimeRemaining } from '../common/HeaderTimeRemaining';
import { ExamSummary } from './ExamSummary';
import { ExamResults } from '../results/ExamResults';
import { ExamHeader } from './ExamHeader';
import { ExamNavigationBar } from './ExamNavigationBar';

// Import premium provider
import { PremiumExamInfoProvider, usePremiumExamInfo } from '@/features/payments/premium/components/PremiumExamInfoProvider';

// Import mobile support
import { 
  useMobileStore, 
  selectIsMobile, 
  MobileOnly, 
  DesktopOnly,
  ResponsiveContainer
} from '@/features/core/mobile-support';

// Import the ExamStartScreen component
import { ExamStartScreen } from './ExamStartScreen';

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
  const [showNavSheet, setShowNavSheet] = useState(false);
  // Track submission state across different callbacks with useRef
  const isSubmittingRef = useRef(false);
  
  // Use mobile support to detect viewport size
  const isMobile = useMobileStore(selectIsMobile);
  
  // Get premium info from context
  const { isPremium } = usePremiumExamInfo();
  
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
  
  // Handle exam start with analytics
  const handleStartExam = () => {
    // Track analytics event
    analytics.trackEvent('exam_start', { examId, userId });
    
    // Force a complete reset of the exam state in both stores
    try {
      logger.info('Forcing complete exam state reset before starting');
      
      // First, try to reset through examStore which has our new enhanced method
      if (typeof useExamStore !== 'undefined' && useExamStore.getState().forceResetExamState) {
        useExamStore.getState().forceResetExamState();
        logger.debug('Reset exam state through forceResetExamState');
      } else {
        // Fallback: manually clear localStorage
        if (typeof window !== 'undefined') {
          try {
            // Function to clear pattern matching localStorage keys
            const clearLocalStorageKeys = (pattern) => {
              const keysToRemove = [];
              for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key && key.toLowerCase().includes(pattern)) {
                  keysToRemove.push(key);
                }
              }
              
              keysToRemove.forEach(key => {
                localStorage.removeItem(key);
                logger.debug(`Cleared matching persisted state for key: ${key}`);
              });
            };
            
            // Clear all exam and mcq related keys
            clearLocalStorageKeys('exam');
            clearLocalStorageKeys('mcq');
            
            // Also try specific known keys
            const possibleKeys = [
              'exam-store',
              'mcq-exam-store',
              'zustand-exam-store',
              'zustand-mcq-store'
            ];
            
            for (const key of possibleKeys) {
              try {
                localStorage.removeItem(key);
                logger.debug(`Cleared persisted state for key: ${key}`);
              } catch (e) {
                // Ignore individual key errors
              }
            }
          } catch (err) {
            logger.warn('Failed to clear localStorage:', err);
          }
        }
        
        // Manually reset each store
        if (typeof useExamStore !== 'undefined' && useExamStore.getState().resetExam) {
          useExamStore.getState().resetExam();
          logger.debug('Reset exam state through resetExam');
        }
        
        if (typeof useMcqExamStore !== 'undefined' && useMcqExamStore.getState().resetExam) {
          useMcqExamStore.getState().resetExam();
          logger.debug('Reset exam state through mcqExamStore.resetExam');
        }
        
        if (typeof useMcqExamStore !== 'undefined' && useMcqExamStore.getState().resetExamState) {
          useMcqExamStore.getState().resetExamState();
          logger.debug('Reset exam state through mcqExamStore.resetExamState');
        }
      }
    } catch (error) {
      logger.warn('Error during manual exam state reset:', error);
    }
    
    // Now start the exam with a clean state
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
    // Close the navigation sheet on mobile after selection
    if (isMobile) {
      setShowNavSheet(false);
    }
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
      <ExamStartScreen 
        exam={exam}
        isStarting={isStarting}
        isOnline={isOnline}
        startError={startError}
        handleStartExam={handleStartExam}
      />
    );
  }
  
  // Main exam interface
  return (
    <div className="flex flex-col min-h-full">
      {/* Exam Header */}
      <ExamHeader 
        title={exam.title}
        description={exam.description}
        isPremium={isPremium}
      />
      
      {/* Mobile navigation bar positioned at the top for mobile */}
      <MobileOnly>
        <ExamNavigationBar
          currentIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          answeredQuestions={answeredQuestionsSet}
          flaggedQuestions={flaggedQuestions}
          questions={questions}
          onNavigate={handleNavigateToQuestion}
          onFinishExam={toggleSummary}
          durationInMinutes={exam.duration || exam.durationMinutes || 60}
          onTimeExpired={handleExamTimeExpired}
          isCompleted={isCompleted}
          timeRemaining={timeRemaining}
        />
      </MobileOnly>
      
      {/* Main content area */}
      <div className={`flex-grow ${isMobile ? 'pb-16' : ''}`}>
        <div className={isMobile ? "flex flex-col" : "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4"}>
          {/* Main question area - takes up more space */}
          <div className={isMobile ? "w-full" : "md:col-span-2 lg:col-span-3 space-y-4"}>
            <div className="mt-4">
              {/* Progress bar on mobile */}
              <MobileOnly>
                <ExamProgress 
                  currentQuestion={currentQuestionIndex}
                  totalQuestions={questions.length}
                  answeredQuestions={answeredQuestionsSet.size}
                  flaggedQuestionsCount={flaggedQuestions.size}
                  hideTimer={false}
                  totalTimeInSeconds={exam.duration * 60 || exam.durationMinutes * 60 || 3600}
                  timeRemainingInSeconds={timeRemaining}
                />
              </MobileOnly>
              
              {/* Timer on desktop */}
              <DesktopOnly>
                <Card className="shadow-md border border-gray-100 overflow-hidden">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 gap-4 mb-4">
                      <ExamProgress 
                        currentQuestion={currentQuestionIndex}
                        totalQuestions={questions.length}
                        answeredQuestions={answeredQuestionsSet.size}
                        flaggedQuestionsCount={flaggedQuestions.size}
                        hideTimer={true}
                      />
                    </div>
                    
                    <Separator className="my-4" />
                  </CardContent>
                </Card>
              </DesktopOnly>
            </div>

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
            
            {/* Desktop only navigation buttons */}
            <DesktopOnly>
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
            </DesktopOnly>
          </div>
          
          {/* Side panel with timer and navigation - desktop only */}
          <DesktopOnly>
            <div className="space-y-4">
              {showTimer && (
                <div className="hidden md:block">
                  <ExamTimerCard
                    totalTimeInSeconds={exam.duration * 60 || exam.durationMinutes * 60 || 3600}
                    timeRemainingInSeconds={timeRemaining}
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
                    onDirectSubmit={handleSubmitExam}
                    questions={questions}
                  />
                </CardContent>
              </Card>
            </div>
          </DesktopOnly>
          
          {/* Floating timer for mobile */}
          <MobileOnly>
            <div className="fixed bottom-20 right-4 z-20">
              {showTimer && (
                <Sheet>
                  <SheetTrigger asChild>
                    <Button size="sm" variant="outline" className="shadow-md rounded-full h-12 w-12 bg-white p-0 flex items-center justify-center">
                      <Clock8Icon className="h-6 w-6 text-blue-600" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="h-1/3">
                    <div className="flex items-center justify-center h-full">
                      <ExamTimerCard
                        totalTimeInSeconds={exam.duration * 60 || exam.durationMinutes * 60 || 3600}
                        timeRemainingInSeconds={timeRemaining}
                        onTimeExpired={handleExamTimeExpired}
                        isCompleted={isCompleted}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              )}
            </div>
          </MobileOnly>

          {/* Bottom fixed mobile-only navigation bar */}
          <MobileOnly>
            <div className="fixed bottom-0 left-0 right-0 border-t bg-white shadow-md px-2 py-1.5 z-10">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToQuestion(Math.max(0, currentQuestionIndex - 1))}
                  disabled={currentQuestionIndex === 0}
                  className="px-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                {/* Mobile Review & Finish Button with Direct Submit */}
                {isSubmittingRef.current ? (
                  <Button 
                    disabled
                    className="bg-blue-600 hover:bg-blue-700 text-xs"
                    variant="default"
                  >
                    <Loader2Icon className="h-3 w-3 mr-1 animate-spin" />
                    Submitting...
                  </Button>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        className="bg-blue-600 hover:bg-blue-700 text-xs"
                        variant="default"
                      >
                        <LifeBuoyIcon className="h-3 w-3 mr-1" />
                        Review & Finish
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
                        <AlertDialogDescription>
                          {questions.length - answeredQuestionsSet.size > 0 
                            ? `You still have ${questions.length - answeredQuestionsSet.size} unanswered questions. Once submitted, you cannot change your answers.`
                            : `Are you sure you want to submit your exam? Once submitted, you cannot change your answers.`
                          }
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmitExam}>
                          Submit Exam
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToQuestion(Math.min(questions.length - 1, currentQuestionIndex + 1))}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="px-2"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </MobileOnly>
        </div>
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
 * ExamContainer with Error Boundary and PremiumExamInfoProvider
 * 
 * Wraps the ExamContainer component with a premium info provider and
 * an error boundary to gracefully handle errors during exam taking.
 */
export function ExamContainer(props: ExamContainerProps) {
  return (
    <ExamErrorBoundary onExit={props.onExit}>
      <PremiumExamInfoProvider examId={props.examId}>
        <ExamContainerInternal {...props} />
      </PremiumExamInfoProvider>
    </ExamErrorBoundary>
  );
}

export default ExamContainer;