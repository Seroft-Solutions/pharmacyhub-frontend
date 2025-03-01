import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Timer, Flag, CheckCircle, HelpCircle } from 'lucide-react';
import { ExamQuestion, UserAnswer } from '../../model/mcqTypes';

interface McqQuestionCardProps {
    question: ExamQuestion;
    currentAnswer?: UserAnswer;
    onAnswer: (optionId: string, timeSpent: number) => void;
    onFlag?: () => void;
    isFlagged?: boolean;
    showAnswer?: boolean;
}

export const McqQuestionCard: React.FC<McqQuestionCardProps> = ({
    question,
    currentAnswer,
    onAnswer,
    onFlag,
    isFlagged = false,
    showAnswer = false,
}) => {
    const [timeSpent, setTimeSpent] = useState(0);
    const [startTime] = useState(Date.now());

    // Track time spent on this question
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        
        return () => clearInterval(timer);
    }, [startTime]);

    const handleOptionSelect = (optionId: string) => {
        onAnswer(optionId, timeSpent);
    };

    const getOptionClassName = (option: { id: string; isCorrect: boolean; }) => {
        let className = "w-full justify-start p-4 mb-2";
        
        if (!showAnswer && !currentAnswer) {
            return className;
        }

        if (showAnswer) {
            if (option.isCorrect) {
                className += " bg-green-50 border-green-500 text-green-700";
            } else if (currentAnswer?.selectedOptionId === option.id) {
                className += " bg-red-50 border-red-500 text-red-700";
            }
        } else if (currentAnswer?.selectedOptionId === option.id) {
            className += " bg-blue-50 border-blue-500";
        }
        
        return className;
    };

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader className="space-y-2">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold">
                                Question {question.id}
                            </span>
                            <Badge variant={isFlagged ? "destructive" : "outline"} className="font-normal cursor-pointer" onClick={onFlag}>
                                {isFlagged ? "Flagged" : "Flag for review"}
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
                                variant={isFlagged ? "destructive" : "ghost"}
                                size="icon"
                                onClick={onFlag}
                                className="h-8 w-8"
                            >
                                <Flag className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
                <p className="text-lg">{question.text}</p>
            </CardHeader>

            <CardContent className="space-y-4">
                {question.options.map((option) => (
                    <Button
                        key={option.id}
                        variant="outline"
                        className={getOptionClassName(option)}
                        onClick={() => handleOptionSelect(option.id)}
                        disabled={showAnswer || !!currentAnswer}
                    >
                        <span className="font-bold mr-2">{option.id}.</span>
                        {option.text}
                        {showAnswer && option.isCorrect && (
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
