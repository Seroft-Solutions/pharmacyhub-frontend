import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Check, Clock, Flag, HelpCircle } from 'lucide-react';
import { UserAnswer } from '../../model/types';

interface QuestionNavigationProps {
    totalQuestions: number;
    currentQuestion: number;
    answers: { [key: string]: UserAnswer };
    flaggedQuestions: Set<number>;
    onQuestionSelect: (index: number) => void;
    minimumRequired: number;
}

export const QuestionNavigation = ({
    totalQuestions,
    currentQuestion,
    answers,
    flaggedQuestions,
    onQuestionSelect,
    minimumRequired,
}: QuestionNavigationProps) => {
    const getQuestionStatus = (index: number) => {
        const questionId = `q-${index + 1}`;
        const isAnswered = !!answers[questionId];
        const isFlagged = flaggedQuestions.has(index);
        const isCurrent = currentQuestion === index;

        if (isCurrent) return 'current';
        if (isAnswered) return 'answered';
        if (isFlagged) return 'flagged';
        return 'unanswered';
    };

    const getButtonStyle = (status: string) => {
        switch (status) {
            case 'current':
                return 'bg-blue-100 border-blue-500 text-blue-700';
            case 'answered':
                return 'bg-green-50 border-green-500 text-green-700';
            case 'flagged':
                return 'bg-yellow-50 border-yellow-500 text-yellow-700';
            default:
                return 'bg-gray-50 border-gray-300 text-gray-600';
        }
    };

    return (
        <div className="w-64 h-full bg-white border-l">
            <div className="p-4 border-b">
                <h3 className="font-semibold mb-2">Questions Overview</h3>
                <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-green-500" />
                            <span>Answered</span>
                        </div>
                        <span className="font-mono">
                            {Object.keys(answers).length}/{minimumRequired}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Flag className="h-4 w-4 text-yellow-500" />
                            <span>Flagged</span>
                        </div>
                        <span className="font-mono">{flaggedQuestions.size}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <HelpCircle className="h-4 w-4 text-gray-500" />
                            <span>Unanswered</span>
                        </div>
                        <span className="font-mono">
                            {totalQuestions - Object.keys(answers).length}
                        </span>
                    </div>
                </div>
            </div>

            <ScrollArea className="h-[calc(100vh-12rem)] p-4">
                <div className="grid grid-cols-5 gap-2">
                    {Array.from({ length: totalQuestions }, (_, i) => {
                        const status = getQuestionStatus(i);
                        return (
                            <Button
                                key={i}
                                variant="outline"
                                size="sm"
                                className={`w-full h-8 p-0 font-mono ${getButtonStyle(
                                    status
                                )}`}
                                onClick={() => onQuestionSelect(i)}
                            >
                                {i + 1}
                            </Button>
                        );
                    })}
                </div>
            </ScrollArea>
        </div>
    );
};