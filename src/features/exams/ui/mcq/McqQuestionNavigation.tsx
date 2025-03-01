import React from 'react';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Flag, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { UserAnswer } from '../../model/mcqTypes';

interface McqQuestionNavigationProps {
    totalQuestions: number;
    currentQuestion: number;
    answers: { [questionId: number]: UserAnswer };
    flaggedQuestions: Set<number>;
    onQuestionSelect: (index: number) => void;
    minimumRequired: number;
}

export const McqQuestionNavigation: React.FC<McqQuestionNavigationProps> = ({
    totalQuestions,
    currentQuestion,
    answers,
    flaggedQuestions,
    onQuestionSelect,
    minimumRequired
}) => {
    // Create an array of question indexes
    const questionIndexes = Array.from({ length: totalQuestions }, (_, i) => i);
    
    // Count answered questions
    const answeredCount = Object.keys(answers).length;
    const progressPercentage = (answeredCount / totalQuestions) * 100;
    
    return (
        <div className="w-64 border-l bg-muted/10 p-4 flex flex-col">
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Progress</h2>
                <Progress value={progressPercentage} className="h-2 mb-2" />
                <div className="text-sm text-muted-foreground">
                    {answeredCount} of {totalQuestions} answered
                    {minimumRequired > 0 && (
                        <div className={answeredCount >= minimumRequired ? "text-green-600" : "text-amber-600"}>
                            Minimum required: {minimumRequired}
                        </div>
                    )}
                </div>
            </div>
            
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Questions</h2>
                <div className="grid grid-cols-4 gap-2">
                    {questionIndexes.map((index) => {
                        const questionId = index + 1; // Adjust if your question IDs start from a different number
                        const isAnswered = !!answers[questionId];
                        const isFlagged = flaggedQuestions.has(index);
                        const isCurrent = currentQuestion === index;
                        
                        let className = "flex items-center justify-center w-full h-10 text-sm";
                        let variant: "default" | "outline" | "secondary" | "ghost" = "outline";
                        
                        if (isCurrent) {
                            variant = "default";
                        } else if (isAnswered) {
                            variant = "secondary";
                        }
                        
                        return (
                            <Button
                                key={index}
                                variant={variant}
                                className={className}
                                onClick={() => onQuestionSelect(index)}
                            >
                                {isAnswered ? (
                                    <CheckCircle className="h-4 w-4" />
                                ) : isFlagged ? (
                                    <div className="flex flex-col items-center">
                                        <Flag className="h-3 w-3 text-destructive" />
                                        <span className="text-[10px]">{index + 1}</span>
                                    </div>
                                ) : (
                                    <span>{index + 1}</span>
                                )}
                            </Button>
                        );
                    })}
                </div>
            </div>
            
            <div className="mt-auto">
                <div className="bg-muted/20 p-3 rounded-lg">
                    <h3 className="font-medium mb-2">Legend</h3>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center">
                            <Circle className="h-4 w-4 mr-2" />
                            <span>Not Answered</span>
                        </div>
                        <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 mr-2 text-primary" />
                            <span>Answered</span>
                        </div>
                        <div className="flex items-center">
                            <Flag className="h-4 w-4 mr-2 text-destructive" />
                            <span>Flagged for Review</span>
                        </div>
                        <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 mr-2 text-blue-500" />
                            <span>Current Question</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
