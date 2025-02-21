import React from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    CheckCircle2,
    XCircle,
    ChevronLeft,
    ChevronRight,
    HelpCircle,
    ArrowLeft,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MCQPaper, UserAnswer } from '../../model/types';

interface ReviewModeProps {
    paper: MCQPaper;
    answers: Record<string, UserAnswer>;
}

export const ReviewMode = ({ paper, answers }: ReviewModeProps) => {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);
    const currentQuestion = paper.sections[0].questions[currentQuestionIndex];
    const currentAnswer = answers[currentQuestion.id];

    const getOptionStyle = (optionKey: string) => {
        const isSelected = currentAnswer?.selectedOption === optionKey;
        const isCorrect = optionKey === currentQuestion.answer;

        if (isSelected && isCorrect) {
            return 'bg-green-50 border-green-500 text-green-700';
        }
        if (isSelected && !isCorrect) {
            return 'bg-red-50 border-red-500 text-red-700';
        }
        if (isCorrect) {
            return 'bg-green-50 border-green-500 text-green-700';
        }
        return '';
    };

    return (
        <div className="container py-8 space-y-6">
            {/* Navigation Header */}
            <div className="flex justify-between items-center">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Results
                </Button>
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                        disabled={currentQuestionIndex === 0}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                        disabled={currentQuestionIndex === paper.totalQuestions - 1}
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                </div>
            </div>

            {/* Question Card */}
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <CardTitle>
                                Question {currentQuestionIndex + 1}
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                                <Badge variant="outline">
                                    {currentQuestion.metadata.topic}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={
                                        currentQuestion.metadata.difficulty === 'easy'
                                            ? 'bg-green-50'
                                            : currentQuestion.metadata.difficulty === 'medium'
                                            ? 'bg-yellow-50'
                                            : 'bg-red-50'
                                    }
                                >
                                    {currentQuestion.metadata.difficulty}
                                </Badge>
                            </div>
                        </div>
                        {currentAnswer && (
                            <Badge
                                variant={currentAnswer.isCorrect ? 'default' : 'destructive'}
                                className="ml-2"
                            >
                                {currentAnswer.isCorrect ? '+1' : '-0.25'}
                            </Badge>
                        )}
                    </div>
                    <CardDescription className="text-lg font-medium text-foreground mt-4">
                        {currentQuestion.question}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Options */}
                    <div className="space-y-3">
                        {Object.entries(currentQuestion.options).map(([key, value]) => (
                            <div
                                key={key}
                                className={`p-4 rounded-lg border ${getOptionStyle(key)}`}
                            >
                                <div className="flex items-center">
                                    <span className="font-bold mr-2">{key}.</span>
                                    <span>{value}</span>
                                    {key === currentQuestion.answer && (
                                        <CheckCircle2 className="h-4 w-4 ml-2 text-green-500" />
                                    )}
                                    {key === currentAnswer?.selectedOption && 
                                     key !== currentQuestion.answer && (
                                        <XCircle className="h-4 w-4 ml-2 text-red-500" />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Explanation */}
                    <div className="pt-6 border-t">
                        <div className="flex items-start space-x-2">
                            <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div>
                                <h4 className="font-semibold mb-2">Explanation</h4>
                                <p className="text-muted-foreground">
                                    {currentQuestion.explanation}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Key Points */}
                    {currentQuestion.metadata.keyPoints?.length > 0 && (
                        <div className="pt-4">
                            <h4 className="font-semibold mb-2">Key Points</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                {currentQuestion.metadata.keyPoints.map((point, index) => (
                                    <li key={index} className="text-muted-foreground">
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* References if available */}
                    {currentQuestion.metadata.references?.length > 0 && (
                        <div className="pt-4 border-t">
                            <h4 className="font-semibold mb-2">References</h4>
                            <ul className="list-disc pl-5 space-y-1">
                                {currentQuestion.metadata.references.map((ref, index) => (
                                    <li key={index} className="text-muted-foreground">
                                        {ref}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Question Navigation */}
            <div className="w-full max-w-4xl mx-auto">
                <div className="flex items-center space-x-4">
                    <div className="flex-1">
                        <div className="bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{
                                    width: `${((currentQuestionIndex + 1) / paper.totalQuestions) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                        {currentQuestionIndex + 1} / {paper.totalQuestions}
                    </span>
                </div>
            </div>
        </div>
    );
};