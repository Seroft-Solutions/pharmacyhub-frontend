'use client';

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMcqExamStore } from '../../store/mcqExamStore';
import { ExamTimer } from '../quiz/ExamTimer';
import { McqQuestionNavigation } from './McqQuestionNavigation';
import { McqQuestionCard } from './McqQuestionCard';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent } from '@/components/ui/card';
import { Exam } from '../../model/standardTypes';

interface McqExamLayoutProps {
    examId: number;
}

export const McqExamLayout: React.FC<McqExamLayoutProps> = ({ examId }) => {
    const router = useRouter();
    const {
        currentExam,
        currentQuestionIndex,
        timeRemaining,
        userAnswers,
        flaggedQuestions,
        isPaused,
        isLoading,
        error,
        startExam,
        answerQuestion,
        flagQuestion,
        unflagQuestion,
        nextQuestion,
        previousQuestion,
        navigateToQuestion,
        pauseExam,
        resumeExam,
        completeExam,
        updateTimeRemaining
    } = useMcqExamStore();

    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [showSummary, setShowSummary] = useState(false);

    // Start the exam when the component mounts
    useEffect(() => {
        const loadExam = async () => {
            try {
                await startExam(examId);
            } catch (err) {
                console.error('Failed to start exam:', err);
            }
        };
        
        loadExam();
        
        // Cleanup when unmounting
        return () => {
            // Reset exam state when leaving the page
            useMcqExamStore.getState().resetExam();
        };
    }, [examId, startExam]);

    // Handle answer selection
    const handleAnswer = (optionId: string) => {
        if (!currentExam?.questions) return;

        const question = currentExam.questions[currentQuestionIndex];
        answerQuestion({
            questionId: question.id,
            selectedOptionId: optionId,
            timeSpent: 0 // We could track time per question if needed
        });
    };

    // Handle flagging/unflagging a question
    const handleFlag = async () => {
        if (!currentExam?.questions) return;
        
        const question = currentExam.questions[currentQuestionIndex];
        const questionId = question.id;
        
        try {
            if (flaggedQuestions.has(questionId)) {
                await unflagQuestion(questionId);
            } else {
                await flagQuestion(questionId);
            }
        } catch (err) {
            console.error('Error toggling flag:', err);
        }
    };

    // Handle time expiration
    const handleTimeUp = () => {
        pauseExam();
        setShowTimeUpDialog(true);
    };

    // Handle exam submission
    const handleSubmit = async () => {
        try {
            if (!currentExam) return;

            const answeredCount = Object.keys(userAnswers).length;
            const minimumRequired = Math.ceil((currentExam.questions?.length || 0) * 0.5);
            
            if (answeredCount < minimumRequired) {
                setSubmitError(`Please attempt at least ${minimumRequired} questions`);
                return;
            }

            await completeExam();
            
            // Get the attempt ID from the store
            const attemptId = useMcqExamStore.getState().currentAttempt?.id;
            
            if (attemptId) {
                router.push(`/exam/results/${attemptId}`);
            } else {
                // Fallback to dashboard if we don't have an attempt ID
                router.push('/exam/dashboard');
            }
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Failed to submit exam');
        }
    };

    // Handle navigation between questions
    const handleNavigateToQuestion = (index: number) => {
        navigateToQuestion(index);
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Spinner className="w-12 h-12 mb-4" />
                    <p className="text-lg">Loading exam...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <Card className="max-w-lg w-full">
                    <CardContent className="pt-6">
                        <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center">
                            <h2 className="text-xl font-bold mb-4">Error</h2>
                            <p className="mb-4">{error}</p>
                            <Button 
                                className="mt-4 bg-red-600 hover:bg-red-700 text-white" 
                                onClick={() => router.push('/exam/dashboard')}
                            >
                                Return to Dashboard
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // No exam data
    if (!currentExam || !currentExam.questions || currentExam.questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <Card className="max-w-lg w-full">
                    <CardContent className="pt-6 text-center">
                        <h2 className="text-xl font-bold mb-4">No Exam Data Available</h2>
                        <p className="mb-4">The exam could not be loaded or contains no questions.</p>
                        <Button onClick={() => router.push('/exam/dashboard')}>
                            Return to Dashboard
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Get the current question
    const currentQuestion = currentExam.questions[currentQuestionIndex];
    const questionId = currentQuestion?.id;
    
    // Check if the current question is flagged
    const isCurrentQuestionFlagged = flaggedQuestions.has(questionId);
    
    // Get the user's answer for the current question
    const currentQuestionAnswer = userAnswers[questionId]?.selectedOptionId;

    return (
        <div className="flex h-screen">
            {/* Main content area */}
            <div className="flex-1 flex flex-col">
                {/* Header with timer and exam info */}
                <div className="p-4 border-b bg-white">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
                        <div>
                            <h1 className="text-xl font-bold">{currentExam.title}</h1>
                            <p className="text-sm text-gray-600">{currentExam.description}</p>
                        </div>
                        <Button 
                            variant="destructive"
                            onClick={() => setShowSubmitDialog(true)}
                        >
                            Submit Exam
                        </Button>
                    </div>
                    
                    {/* Timer */}
                    <ExamTimer
                        totalTime={currentExam.duration * 60}
                        remainingTime={timeRemaining}
                        isPaused={isPaused}
                        onPause={pauseExam}
                        onResume={resumeExam}
                        onTimeUp={handleTimeUp}
                    />
                </div>

                {/* Question display area */}
                <div className="flex-1 overflow-auto p-4 bg-gray-50">
                    {currentQuestion && (
                        <McqQuestionCard
                            question={currentQuestion}
                            questionNumber={currentQuestionIndex + 1}
                            totalQuestions={currentExam.questions.length}
                            currentAnswer={currentQuestionAnswer}
                            isFlagged={isCurrentQuestionFlagged}
                            onAnswer={handleAnswer}
                            onFlag={handleFlag}
                        />
                    )}
                </div>

                {/* Navigation controls */}
                <div className="p-4 border-t bg-white">
                    <div className="flex justify-between">
                        <Button
                            variant="outline"
                            onClick={previousQuestion}
                            disabled={currentQuestionIndex === 0}
                        >
                            Previous
                        </Button>
                        
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => router.push('/exam/dashboard')}
                            >
                                Exit Exam
                            </Button>
                            <Button
                                onClick={() => setShowSubmitDialog(true)}
                            >
                                Submit Exam
                            </Button>
                        </div>
                        
                        <Button
                            onClick={nextQuestion}
                            disabled={currentQuestionIndex === currentExam.questions.length - 1}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            {/* Question navigation sidebar */}
            <McqQuestionNavigation
                totalQuestions={currentExam.questions.length}
                currentQuestion={currentQuestionIndex}
                answers={userAnswers}
                flaggedQuestions={flaggedQuestions}
                onQuestionSelect={handleNavigateToQuestion}
                minimumRequired={Math.ceil(currentExam.questions.length * 0.5)}
            />

            {/* Submit confirmation dialog */}
            <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have answered {Object.keys(userAnswers).length} out of {currentExam.questions.length} questions.
                            {submitError && (
                                <span className="text-red-500 block mt-2">{submitError}</span>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSubmitError(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit}>
                            Submit
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Time up dialog */}
            <AlertDialog 
                open={showTimeUpDialog} 
                onOpenChange={setShowTimeUpDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Time&apos;s Up!</AlertDialogTitle>
                        <AlertDialogDescription>
                            Your exam time has ended. Your answers will be submitted automatically.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={handleSubmit}>
                            View Results
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};