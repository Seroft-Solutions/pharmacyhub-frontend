import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    CheckCircle2,
    XCircle,
    Clock,
    BrainCircuit,
    Target,
    ChevronRight,
} from 'lucide-react';
import { useExamStore } from '../../store/examStore';
import { useRouter } from 'next/navigation';
import { calculateExamScore } from '../../utils/calculateExamScore';

export const ResultsView = () => {
    const router = useRouter();
    const { currentPaper, answers, timeRemaining } = useExamStore();

    if (!currentPaper) {
        router.push('/exam');
        return null;
    }

    const totalQuestions = currentPaper.totalQuestions;
    const totalAttempted = Object.keys(answers).length;
    const correctAnswers = Object.values(answers).filter(a => a.isCorrect).length;
    const incorrectAnswers = totalAttempted - correctAnswers;
    const unansweredQuestions = totalQuestions - totalAttempted;
    
    // Use the standardized score calculation
    const scoreResult = calculateExamScore(
        totalQuestions,
        correctAnswers,
        incorrectAnswers,
        unansweredQuestions
    );
    
    const score = scoreResult.score;
    const percentage = scoreResult.percentage;
    const timeSpent = (currentPaper.timeLimit * 60) - timeRemaining;

    const isPassed = percentage >= currentPaper.passingCriteria.passingScore;

    const topicPerformance = currentPaper.sections[0].questions.reduce((acc, q) => {
        const topic = q.metadata.topic;
        if (!acc[topic]) {
            acc[topic] = { total: 0, correct: 0 };
        }
        acc[topic].total++;
        if (answers[q.id]?.isCorrect) {
            acc[topic].correct++;
        }
        return acc;
    }, {} as Record<string, { total: number; correct: number }>);

    return (
        <div className="container py-8 space-y-6">
            {/* Overall Score Card */}
            <Card className={isPassed ? 'bg-green-50' : 'bg-red-50'}>
                <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                        {isPassed ? (
                            <>
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                                <span>Congratulations!</span>
                            </>
                        ) : (
                            <>
                                <XCircle className="h-6 w-6 text-red-600" />
                                <span>Keep Practicing</span>
                            </>
                        )}
                    </CardTitle>
                    <CardDescription>
                        {isPassed
                            ? "You've successfully completed the exam!"
                            : "Don't worry, keep practicing to improve your score."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold">
                                {score.toFixed(2)} / {totalQuestions}
                            </span>
                            <Badge
                                variant={isPassed ? 'default' : 'destructive'}
                                className="text-lg px-4 py-1"
                            >
                                {percentage.toFixed(1)}%
                            </Badge>
                        </div>
                        <Progress value={percentage} className="h-2" />
                    </div>
                </CardContent>
            </Card>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">
                            Time Spent
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-2xl font-bold">
                                {Math.floor(timeSpent / 60)}m {timeSpent % 60}s
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">
                            Accuracy
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center">
                            <Target className="h-4 w-4 mr-2 text-green-500" />
                            <span className="text-2xl font-bold">
                                {totalAttempted > 0 
                                    ? ((correctAnswers / totalAttempted) * 100).toFixed(1)
                                    : '0'}%
                            </span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-muted-foreground">
                            Questions Attempted
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center">
                            <BrainCircuit className="h-4 w-4 mr-2 text-purple-500" />
                            <span className="text-2xl font-bold">
                                {totalAttempted} / {totalQuestions}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Topic-wise Performance */}
            <Card>
                <CardHeader>
                    <CardTitle>Topic-wise Performance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {Object.entries(topicPerformance).map(([topic, data]) => (
                            <div key={topic}>
                                <div className="flex justify-between mb-1">
                                    <div className="flex items-center">
                                        <span className="font-medium">{topic}</span>
                                        <Badge
                                            variant="outline"
                                            className="ml-2"
                                        >
                                            {((data.correct / data.total) * 100).toFixed(0)}%
                                        </Badge>
                                    </div>
                                    <span className="text-muted-foreground">
                                        {data.correct} / {data.total}
                                    </span>
                                </div>
                                <Progress
                                    value={(data.correct / data.total) * 100}
                                    className="h-2"
                                />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Question-wise Analysis */}
            <Card>
                <CardHeader>
                    <CardTitle>Question Analysis</CardTitle>
                    <CardDescription>
                        Detailed breakdown of your performance on each question
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-20">Q.No</TableHead>
                                    <TableHead>Topic</TableHead>
                                    <TableHead>Your Answer</TableHead>
                                    <TableHead>Correct Answer</TableHead>
                                    <TableHead className="text-center">Result</TableHead>
                                    <TableHead>Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentPaper.sections[0].questions.map((q, index) => {
                                    const answer = answers[q.id];
                                    return (
                                        <TableRow key={q.id}>
                                            <TableCell className="font-medium">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {q.metadata.topic}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {answer?.selectedOption || '—'}
                                            </TableCell>
                                            <TableCell>{q.answer}</TableCell>
                                            <TableCell className="text-center">
                                                {answer ? (
                                                    answer.isCorrect ? (
                                                        <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                                                    ) : (
                                                        <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                                                    )
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {answer?.timeSpent
                                                    ? `${answer.timeSpent}s`
                                                    : '—'}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-between">
                <Button
                    variant="outline"
                    onClick={() => router.push('/exam')}
                >
                    Back to Papers
                </Button>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => useExamStore.getState().resetExam()}
                    >
                        Retake Exam
                    </Button>
                    <Button
                        onClick={() => router.push(`/exam/review/${currentPaper.id}`)}
                    >
                        Review Answers
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
};