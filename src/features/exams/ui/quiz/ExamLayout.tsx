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
import { useExamStore } from '../../store/examStore';
import { ExamTimer } from './ExamTimer';
import { QuestionNavigation } from './QuestionNavigation';
import { QuestionCard } from './QuestionCard';
import { useRouter } from 'next/navigation';

export const ExamLayout = () => {
    const router = useRouter();
    const {
        currentPaper,
        currentQuestionIndex,
        timeRemaining,
        answers,
        isPaused,
        startExam,
        answerQuestion,
        nextQuestion,
        previousQuestion,
        pauseExam,
        resumeExam,
        completeExam,
    } = useExamStore();

    const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [showTimeUpDialog, setShowTimeUpDialog] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (!isPaused && timeRemaining > 0) {
            timer = setInterval(() => {
                if (timeRemaining <= 1) {
                    handleTimeUp();
                } else {
                    useExamStore.setState({ timeRemaining: timeRemaining - 1 });
                }
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [timeRemaining, isPaused]);

    const handleAnswer = (answer: string) => {
        if (!currentPaper) return;

        const question = currentPaper.sections[0].questions[currentQuestionIndex];
        answerQuestion({
            questionId: question.id,
            selectedOption: answer,
            timeSpent: 0, // Calculate time spent from question start
        });

        // Auto-advance to next question after a brief delay
        setTimeout(() => {
            if (currentQuestionIndex < currentPaper.totalQuestions - 1) {
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

    const handleSubmit = () => {
        try {
            if (!currentPaper) return;

            const answeredCount = Object.keys(answers).length;
            if (answeredCount < currentPaper.passingCriteria.minimumQuestions) {
                setError(`Please attempt at least ${currentPaper.passingCriteria.minimumQuestions} questions`);
                return;
            }

            completeExam();
            router.push('/exam/results');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit exam');
        }
    };

    if (!currentPaper) {
        return <div>No exam in progress</div>;
    }

    const currentQuestion = currentPaper.sections[0].questions[currentQuestionIndex];

    return (
        <div className="flex h-screen">
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <div className="p-4 border-b">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl font-bold">{currentPaper.title}</h1>
                        <Button 
                            variant="destructive"
                            onClick={() => setShowSubmitDialog(true)}
                        >
                            Submit Exam
                        </Button>
                    </div>
                    <ExamTimer
                        totalTime={currentPaper.timeLimit * 60}
                        remainingTime={timeRemaining}
                        isPaused={isPaused}
                        onPause={pauseExam}
                        onResume={resumeExam}
                        onTimeUp={handleTimeUp}
                    />
                </div>

                {/* Question Area */}
                <div className="flex-1 overflow-auto p-4">
                    <QuestionCard
                        question={currentQuestion}
                        currentAnswer={answers[currentQuestion.id]}
                        timeSpent={0} // Calculate from question start time
                        onAnswer={handleAnswer}
                        onFlag={handleFlag}
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
                            disabled={currentQuestionIndex === currentPaper.totalQuestions - 1}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            {/* Question Navigation Sidebar */}
            <QuestionNavigation
                totalQuestions={currentPaper.totalQuestions}
                currentQuestion={currentQuestionIndex}
                answers={answers}
                flaggedQuestions={flaggedQuestions}
                onQuestionSelect={(index) => useExamStore.setState({ currentQuestionIndex: index })}
                minimumRequired={currentPaper.passingCriteria.minimumQuestions}
            />

            {/* Submit Confirmation Dialog */}
            <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have answered {Object.keys(answers).length} out of {currentPaper.totalQuestions} questions.
                            {error && (
                                <span className="text-red-500 block mt-2">{error}</span>
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
                        <AlertDialogTitle>Time's Up!</AlertDialogTitle>
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