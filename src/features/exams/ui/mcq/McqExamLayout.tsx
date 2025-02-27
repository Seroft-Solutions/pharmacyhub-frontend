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
import { Loader2 } from 'lucide-react';

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
        isPaused,
        isLoading,
        error,
        startExam,
        answerQuestion,
        nextQuestion,
        previousQuestion,
        pauseExam,
        resumeExam,
        completeExam,
        updateTimeRemaining
    } = useMcqExamStore();

    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

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

    // Timer effect
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!isPaused && timeRemaining > 0) {
            timer = setInterval(() => {
                if (timeRemaining <= 1) {
                    handleTimeUp();
                } else {
                    updateTimeRemaining(timeRemaining - 1);
                }
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [timeRemaining, isPaused, updateTimeRemaining]);

    const handleAnswer = (answer: string, timeSpent: number) => {
        if (!currentExam?.questions) return;

        const question = currentExam.questions[currentQuestionIndex];
        answerQuestion({
            questionId: question.id,
            selectedOptionId: answer,
            timeSpent: timeSpent
        });

        // Auto-advance to next question after a brief delay
        setTimeout(() => {
            if (currentQuestionIndex < (currentExam.questions?.length || 0) - 1) {
                nextQuestion();
            }
        }, 1000);
    };

    const handleFlag = () => {
        setFlaggedQuestions(prev => {
            const newFlags = new Set(prev);
            if (newFlags.has(currentQuestionIndex)) {
                newFlags.delete(currentQuestionIndex);
            } else {
                newFlags.add(currentQuestionIndex);
            }
            return newFlags;
        });
    };

    const handleTimeUp = () => {
        pauseExam();
        setShowTimeUpDialog(true);
    };

    const handleSubmit = async () => {
        try {
            if (!currentExam) return;

            const answeredCount = Object.keys(userAnswers).length;
            // Check if the user has answered enough questions based on exam requirements
            // This is just a placeholder. You should define your own criteria
            const minimumRequired = Math.ceil((currentExam.questions?.length || 0) * 0.5) || 1;
            
            if (answeredCount < minimumRequired) {
                setSubmitError(`Please attempt at least ${minimumRequired} questions`);
                return;
            }

            await completeExam();
            router.push('/exam/results');
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'Failed to submit exam');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading exam...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-lg text-center shadow-md">
                    <h2 className="text-xl font-bold mb-4">Error</h2>
                    <p className="mb-4">{error}</p>
                    <Button 
                        className="mt-4 bg-red-600 hover:bg-red-700 text-white" 
                        onClick={() => router.push('/exam-practice')}
                    >
                        Return to Exams
                    </Button>
                </div>
            </div>
        );
    }

    if (!currentExam || !currentExam.questions) {
        return <div>No exam data available</div>;
    }

    const currentQuestion = currentExam.questions[currentQuestionIndex];

    return (
        <div className="flex h-screen">
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-bold">{currentExam.title}</h1>
                        <Button 
                            variant="destructive"
                            onClick={() => setShowSubmitDialog(true)}
                        >
                            Submit Exam
                        </Button>
                    </div>
                    <ExamTimer
                        totalTime={currentExam.duration * 60}
                        remainingTime={timeRemaining}
                        isPaused={isPaused}
                        onPause={pauseExam}
                        onResume={resumeExam}
                        onTimeUp={handleTimeUp}
                    />
                </div>

                {/* Question Area */}
                <div className="flex-1 overflow-auto p-4">
                    <McqQuestionCard
                        question={currentQuestion}
                        currentAnswer={userAnswers[currentQuestion.id]}
                        onAnswer={handleAnswer}
                        onFlag={handleFlag}
                        isFlagged={flaggedQuestions.has(currentQuestionIndex)}
                    />
                </div>

                {/* Navigation Controls */}
                <div className="p-4 border-t">
                    <div className="flex justify-between">
                        <Button
                            onClick={previousQuestion}
                            disabled={currentQuestionIndex === 0}
                        >
                            Previous
                        </Button>
                        <Button
                            onClick={nextQuestion}
                            disabled={currentQuestionIndex === currentExam.questions.length - 1}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            {/* Question Navigation Sidebar */}
            <McqQuestionNavigation
                totalQuestions={currentExam.questions.length}
                currentQuestion={currentQuestionIndex}
                answers={userAnswers}
                flaggedQuestions={flaggedQuestions}
                onQuestionSelect={(index) => useMcqExamStore.setState({ currentQuestionIndex: index })}
                minimumRequired={Math.ceil(currentExam.questions.length * 0.5)} // Placeholder, define your criteria
            />

            {/* Submit Confirmation Dialog */}
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
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSubmit}>
                            Submit
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Time Up Dialog */}
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
