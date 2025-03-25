'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    Trophy,
    Clock,
    BarChart,
    ArrowLeft,
    RefreshCw,
    BookOpen,
    Flag,
    BookmarkIcon,
    PencilIcon
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMcqExamStore } from '../../store/mcqExamStore';
import { Loader2 } from 'lucide-react';
import { examService } from '../../api/core/examService';
import { FlaggedQuestion } from '../../model/mcqTypes';
import { Badge } from '@/components/ui/badge';

export const McqExamResults: React.FC = () => {
    const router = useRouter();
    const { examResult, currentExam, currentAttempt, flaggedQuestions, resetExam, isLoading, error } = useMcqExamStore();
    const [reviewMode, setReviewMode] = useState<'all' | 'incorrect' | 'flagged' | 'unanswered'>('all');
    const [loadingFlagged, setLoadingFlagged] = useState(false);
    const [serverFlaggedQuestions, setServerFlaggedQuestions] = useState<FlaggedQuestion[]>([]);

    // Load flagged questions from server if needed
    useEffect(() => {
        const loadFlaggedQuestions = async () => {
            if (!currentAttempt) return;
            
            try {
                setLoadingFlagged(true);
                const flagged = await examService.getFlaggedQuestions(currentAttempt.id);
                setServerFlaggedQuestions(flagged);
            } catch (err) {
                console.error('Error loading flagged questions:', err);
            } finally {
                setLoadingFlagged(false);
            }
        };
        
        loadFlaggedQuestions();
    }, [currentAttempt]);

    if (isLoading || loadingFlagged) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Loading results...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg max-w-lg text-center">
                    <h2 className="text-xl font-bold mb-2">Error</h2>
                    <p>{error}</p>
                    <Button className="mt-4" onClick={() => router.push('/exam-practice')}>
                        Return to Exams
                    </Button>
                </div>
            </div>
        );
    }

    if (!examResult || !currentExam) {
        return (
            <div className="container py-8">
                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>No Results Available</CardTitle>
                        <CardDescription>
                            You haven't completed an exam recently or the results have been reset.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={() => router.push('/exam-practice')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Return to Exams
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const handleTryAgain = () => {
        resetExam();
        router.push(`/exam/${currentExam.id}`);
    };

    // Determine if questions were answered or not
    const questionStatuses = new Map();
    
    // If we have questionResults with userAnswerId, we can determine unanswered questions
    if (examResult.questionResults) {
        examResult.questionResults.forEach(qr => {
            if (qr.userAnswerId) {
                questionStatuses.set(qr.questionId, { 
                    status: qr.isCorrect ? 'correct' : 'incorrect',
                    userAnswerId: qr.userAnswerId
                });
            } else {
                questionStatuses.set(qr.questionId, { status: 'unanswered' });
            }
        });
    }
    
    // Count questions by status
    const correctCount = examResult.correctAnswers || 0;
    const incorrectCount = examResult.incorrectAnswers || 0;
    const unansweredCount = examResult.unanswered || 0;
    
    // Validate the counts
    const totalQuestions = currentExam.questions?.length || 0;
    
    // Filter questions based on the selected review mode
    let filteredQuestionResults = examResult.questionResults || [];
    
    if (reviewMode === 'incorrect') {
        filteredQuestionResults = filteredQuestionResults.filter(qr => 
            !qr.isCorrect && qr.userAnswerId // Only truly incorrect (selected wrong answer)
        );
    } else if (reviewMode === 'unanswered') {
        filteredQuestionResults = filteredQuestionResults.filter(qr => 
            !qr.userAnswerId // No answer selected
        );
    } else if (reviewMode === 'flagged') {
        // Check if this question was flagged
        const questionIds = serverFlaggedQuestions.map(fq => fq.questionId);
        filteredQuestionResults = filteredQuestionResults.filter(qr => 
            questionIds.includes(qr.questionId)
        );
    }

    // Function to calculate penalty for incorrect answers
    const calculatePenalty = (count) => {
        return (count * -0.25).toFixed(1);
    };
    
    return (
        <div className="container py-8">
            <div className="max-w-4xl mx-auto">
                {/* Results Summary */}
                <Card className="mb-8">
                    <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-2xl">{currentExam.title} - Results</CardTitle>
                                <CardDescription>Completed on {new Date().toLocaleString()}</CardDescription>
                            </div>
                            <div className="flex items-center">
                                {examResult.isPassed ? (
                                    <div className="flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                                        <Trophy className="h-5 w-5 mr-1" />
                                        <span className="font-medium">Passed</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full">
                                        <XCircle className="h-5 w-5 mr-1" />
                                        <span className="font-medium">Failed</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <Card className="bg-blue-50 border-blue-200">
                                <CardContent className="flex items-center p-4">
                                    <div className="mr-4 rounded-lg bg-blue-100 p-2">
                                        <CheckCircle className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-blue-700">Correct Answers</p>
                                        <p className="text-xl font-bold text-blue-800">
                                            {correctCount} ({Math.round((correctCount / totalQuestions) * 100)}%)
                                        </p>
                                        <p className="text-xs text-blue-600">+{correctCount} marks</p>
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Card className="bg-red-50 border-red-200">
                                <CardContent className="flex items-center p-4">
                                    <div className="mr-4 rounded-lg bg-red-100 p-2">
                                        <XCircle className="h-5 w-5 text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-red-700">Incorrect Answers</p>
                                        <p className="text-xl font-bold text-red-800">
                                            {incorrectCount} ({Math.round((incorrectCount / totalQuestions) * 100)}%)
                                        </p>
                                        <p className="text-xs text-red-600">{calculatePenalty(incorrectCount)} mark penalty</p>
                                    </div>
                                </CardContent>
                            </Card>
                            
                            <Card className="bg-yellow-50 border-yellow-200">
                                <CardContent className="flex items-center p-4">
                                    <div className="mr-4 rounded-lg bg-yellow-100 p-2">
                                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-yellow-700">Unanswered</p>
                                        <p className="text-xl font-bold text-yellow-800">
                                            {unansweredCount} ({Math.round((unansweredCount / totalQuestions) * 100)}%)
                                        </p>
                                        <p className="text-xs text-yellow-600">0 marks (no penalty)</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        
                        {/* Score Breakdown */}
                        <Card className="bg-slate-50 rounded-lg p-4 mb-6">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm uppercase text-gray-500">Score Breakdown</h3>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 px-2">
                              Negative marking applied
                            </Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Correct Answers ({correctCount} × 1.0):</span>
                              <span className="font-semibold text-green-600">+{correctCount.toFixed(1)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Incorrect Answers ({incorrectCount} × -0.25):</span>
                              <span className="font-semibold text-red-600">{calculatePenalty(incorrectCount)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Unanswered Questions ({unansweredCount} × 0):</span>
                              <span className="font-semibold">0.0</span>
                            </div>
                            <div className="border-t pt-2 mt-2 flex justify-between">
                              <span className="font-semibold">Final Score (out of {totalQuestions}):</span>
                              <span className="font-semibold">{(correctCount - (incorrectCount * 0.25)).toFixed(1)}</span>
                            </div>
                            <div className="mt-2 text-xs text-gray-500 italic">
                              <p>• Correct answers earn 1 mark each</p>
                              <p>• Incorrect selections deduct 0.25 marks each</p>
                              <p>• Unanswered questions receive 0 marks (no penalty)</p>
                              <p>• Passing mark: {examResult.passingMarks}%</p>
                            </div>
                          </div>
                        </Card>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">Score</span>
                                    <span className="text-sm font-medium">{examResult.score.toFixed(1)}%</span>
                                </div>
                                <Progress 
                                    value={examResult.score} 
                                    className="h-3"
                                    indicatorClassName={examResult.isPassed ? 'bg-green-600' : 'bg-red-600'}
                                />
                                <div className="mt-1">
                                    <span className="text-xs text-muted-foreground">
                                        Passing score: {examResult.passingMarks}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => router.push('/exam-practice')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to All Exams
                        </Button>
                        <Button onClick={handleTryAgain}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Try Again
                        </Button>
                    </CardFooter>
                </Card>

                {/* Detailed Question Review */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold tracking-tight">Detailed Review</h2>
                        <Tabs defaultValue="all" className="w-full max-w-md" onValueChange={(value) => setReviewMode(value as any)}>
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="all" className="flex items-center justify-center gap-1">
                                    <PencilIcon className="h-4 w-4" />
                                    <span>All</span>
                                </TabsTrigger>
                                <TabsTrigger value="incorrect" className="flex items-center justify-center gap-1">
                                    <XCircle className="h-4 w-4" />
                                    <span>Incorrect</span>
                                </TabsTrigger>
                                <TabsTrigger value="unanswered" className="flex items-center justify-center gap-1">
                                    <AlertCircle className="h-4 w-4" />
                                    <span>Unanswered</span>
                                </TabsTrigger>
                                <TabsTrigger value="flagged" className="flex items-center justify-center gap-1">
                                    <Flag className="h-4 w-4" />
                                    <span>Flagged</span>
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                    
                    {filteredQuestionResults.length === 0 ? (
                        <Card>
                            <CardContent className="py-6 flex flex-col items-center justify-center">
                                <div className="p-3 rounded-full bg-muted mb-3">
                                    {reviewMode === 'incorrect' ? (
                                        <CheckCircle className="h-6 w-6 text-green-500" />
                                    ) : reviewMode === 'unanswered' ? (
                                        <AlertCircle className="h-6 w-6 text-yellow-500" />
                                    ) : (
                                        <BookmarkIcon className="h-6 w-6 text-blue-500" />
                                    )}
                                </div>
                                <h3 className="text-lg font-medium mb-1">
                                    {reviewMode === 'incorrect' 
                                        ? 'All questions answered correctly!' 
                                        : reviewMode === 'unanswered'
                                        ? 'All questions were answered'
                                        : reviewMode === 'flagged' 
                                            ? 'No questions were flagged for review' 
                                            : 'No questions found'}
                                </h3>
                                <p className="text-muted-foreground text-center max-w-md">
                                    {reviewMode === 'incorrect' 
                                        ? 'Great job! You didn&apos;t miss any questions on this exam.' 
                                        : reviewMode === 'unanswered'
                                        ? 'You answered all questions in this exam, even if some were incorrect.'
                                        : reviewMode === 'flagged' 
                                            ? 'You can flag questions during the exam for later review' 
                                            : 'Try selecting a different filter option'}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredQuestionResults.map((questionResult, index) => {
                            // Determine the card border color
                            let borderColor = 'border-l-blue-500'; // default
                            if (!questionResult.userAnswerId) {
                                // Unanswered
                                borderColor = 'border-l-yellow-500';
                            } else if (questionResult.isCorrect) {
                                // Correct
                                borderColor = 'border-l-green-500';
                            } else {
                                // Incorrect
                                borderColor = 'border-l-red-500';
                            }
                            
                            // If flagged, override with amber
                            if (serverFlaggedQuestions.some(fq => fq.questionId === questionResult.questionId)) {
                                borderColor = 'border-l-amber-500';
                            }
                            
                            return (
                                <Card 
                                    key={questionResult.questionId} 
                                    className={`border-l-4 ${borderColor}`}
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                                                {serverFlaggedQuestions.some(fq => fq.questionId === questionResult.questionId) && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                        <Flag className="h-3 w-3 mr-1" />
                                                        Flagged
                                                    </span>
                                                )}
                                            </div>
                                            {!questionResult.userAnswerId ? (
                                                <div className="flex items-center text-yellow-600">
                                                    <AlertCircle className="h-5 w-5 mr-1" />
                                                    <span>Unanswered</span>
                                                </div>
                                            ) : questionResult.isCorrect ? (
                                                <div className="flex items-center text-green-600">
                                                    <CheckCircle className="h-5 w-5 mr-1" />
                                                    <span>Correct</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-red-600">
                                                    <XCircle className="h-5 w-5 mr-1" />
                                                    <span>Incorrect</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-base font-medium mt-1">{questionResult.questionText}</p>
                                    </CardHeader>
                                    <CardContent className="pb-2">
                                        <div className="space-y-2">
                                            {questionResult.userAnswerId && (
                                                <div className="border p-3 rounded-md">
                                                    <p className="text-sm font-medium text-muted-foreground mb-1">Your Answer:</p>
                                                    <p className={`${questionResult.isCorrect ? 'text-green-600' : 'text-red-600'} font-medium`}>
                                                        {currentExam.questions?.find(q => q.id === questionResult.questionId)?.options.find(o => o.id === questionResult.userAnswerId)?.text || 'Unknown option'}
                                                    </p>
                                                </div>
                                            )}
                                            
                                            {(!questionResult.isCorrect || !questionResult.userAnswerId) && (
                                                <div className="border p-3 rounded-md border-green-200 bg-green-50">
                                                    <p className="text-sm font-medium text-muted-foreground mb-1">Correct Answer:</p>
                                                    <p className="text-green-600 font-medium">
                                                        {currentExam.questions?.find(q => q.id === questionResult.questionId)?.options.find(o => o.id === questionResult.correctAnswerId)?.text || 'Unknown option'}
                                                    </p>
                                                </div>
                                            )}
                                            
                                            <div className="border p-3 rounded-md mt-2">
                                                <p className="text-sm font-medium text-muted-foreground mb-1">Explanation:</p>
                                                <p className="text-sm">{questionResult.explanation}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="text-sm text-muted-foreground">
                                            Points: {questionResult.earnedPoints} / {questionResult.points}
                                        </div>
                                    </CardFooter>
                                </Card>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};
