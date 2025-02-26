'use client';

import React from 'react';
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
    Trophy,
    Clock,
    BarChart,
    ArrowLeft,
    RefreshCw,
    BookOpen
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { useMcqExamStore } from '../../store/mcqExamStore';
import { Loader2 } from 'lucide-react';

export const McqExamResults: React.FC = () => {
    const router = useRouter();
    const { examResult, currentExam, resetExam, isLoading, error } = useMcqExamStore();

    if (isLoading) {
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
                    <Button className="mt-4" onClick={() => router.push('/exams')}>
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
                        <Button onClick={() => router.push('/exams')}>
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
        router.push(`/exams/${currentExam.id}`);
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <Card className="bg-muted/10">
                                <CardContent className="flex items-center p-4">
                                    <div className="mr-4 rounded-lg bg-primary/10 p-2">
                                        <BarChart className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Score</p>
                                        <p className="text-xl font-bold">{examResult.score.toFixed(1)}%</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-muted/10">
                                <CardContent className="flex items-center p-4">
                                    <div className="mr-4 rounded-lg bg-primary/10 p-2">
                                        <CheckCircle className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Correct Answers</p>
                                        <p className="text-xl font-bold">
                                            {examResult.questionResults.filter(q => q.isCorrect).length} / {examResult.questionResults.length}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-muted/10">
                                <CardContent className="flex items-center p-4">
                                    <div className="mr-4 rounded-lg bg-primary/10 p-2">
                                        <Clock className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Time Spent</p>
                                        <p className="text-xl font-bold">{formatTime(examResult.timeSpent)}</p>
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="bg-muted/10">
                                <CardContent className="flex items-center p-4">
                                    <div className="mr-4 rounded-lg bg-primary/10 p-2">
                                        <BookOpen className="h-5 w-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground">Passing Score</p>
                                        <p className="text-xl font-bold">{examResult.passingMarks.toFixed(1)}%</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium">Score</span>
                                    <span className="text-sm font-medium">{examResult.score.toFixed(1)}%</span>
                                </div>
                                <Progress 
                                    value={examResult.score} 
                                    className={`h-3 ${examResult.isPassed ? 'bg-green-600' : 'bg-red-600'}`} 
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
                        <Button variant="outline" onClick={() => router.push('/exams')}>
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
                    <h2 className="text-2xl font-bold tracking-tight">Detailed Review</h2>
                    
                    {examResult.questionResults.map((questionResult, index) => (
                        <Card key={questionResult.questionId} className={`border-l-4 ${questionResult.isCorrect ? 'border-l-green-500' : 'border-l-red-500'}`}>
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                                    {questionResult.isCorrect ? (
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
                                    
                                    {!questionResult.isCorrect && (
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
                    ))}
                </div>
            </div>
        </div>
    );
};
