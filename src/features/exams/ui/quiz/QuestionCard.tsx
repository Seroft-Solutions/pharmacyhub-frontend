import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Flag, CheckCircle, HelpCircle } from 'lucide-react';
import { MCQuestion, UserAnswer } from '../../model/types';

interface QuestionCardProps {
    question: MCQuestion;
    currentAnswer?: UserAnswer;
    timeSpent: number;
    onAnswer: (answer: string) => void;
    onFlag?: () => void;
    showAnswer?: boolean;
}

export const QuestionCard = ({
    question,
    currentAnswer,
    timeSpent,
    onAnswer,
    onFlag,
    showAnswer = false,
}: QuestionCardProps) => {
    const getOptionStyle = (key: string) => {
        if (!showAnswer && !currentAnswer) {
            return '';
        }

        if (showAnswer) {
            if (key === question.answer) {
                return 'bg-green-50 border-green-500 text-green-700';
            }
            if (currentAnswer?.selectedOption === key && key !== question.answer) {
                return 'bg-red-50 border-red-500 text-red-700';
            }
        }

        if (currentAnswer?.selectedOption === key) {
            return 'bg-blue-50 border-blue-500';
        }

        return '';
    };

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader className="space-y-2">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold">
                                Question {question.questionNumber}
                            </span>
                            <Badge variant="outline" className="font-normal">
                                {question.metadata.topic}
                            </Badge>
                            <Badge
                                variant="outline"
                                className={
                                    question.metadata.difficulty === 'easy'
                                        ? 'bg-green-50'
                                        : question.metadata.difficulty === 'medium'
                                        ? 'bg-yellow-50'
                                        : 'bg-red-50'
                                }
                            >
                                {question.metadata.difficulty}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center text-muted-foreground">
                            <Timer className="h-4 w-4 mr-1" />
                            <span>{timeSpent}s</span>
                        </div>
                        {onFlag && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onFlag}
                                className="h-8 w-8"
                            >
                                <Flag className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
                <p className="text-lg">{question.question}</p>
            </CardHeader>

            <CardContent className="space-y-4">
                {Object.entries(question.options).map(([key, value]) => (
                    <Button
                        key={key}
                        variant="outline"
                        className={`w-full justify-start p-4 ${getOptionStyle(key)}`}
                        onClick={() => onAnswer(key)}
                        disabled={showAnswer || !!currentAnswer}
                    >
                        <span className="font-bold mr-2">{key}.</span>
                        {value}
                        {showAnswer && key === question.answer && (
                            <CheckCircle className="ml-2 h-4 w-4 text-green-500" />
                        )}
                    </Button>
                ))}
            </CardContent>

            {showAnswer && (
                <CardFooter className="flex-col items-start pt-4 border-t">
                    <div className="flex items-start space-x-2">
                        <HelpCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div className="flex-1">
                            <h4 className="font-semibold mb-1">Explanation</h4>
                            <p className="text-muted-foreground">
                                {question.explanation}
                            </p>
                        </div>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
};