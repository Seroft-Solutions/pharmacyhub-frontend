import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Flag, Bookmark } from 'lucide-react';
import { Question, UserAnswer } from '../../model/standardTypes';

interface McqQuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  currentAnswer?: string;
  isFlagged: boolean;
  onAnswer: (optionId: string) => void;
  onFlag: () => void;
  isReview?: boolean;
  correctAnswer?: string;
}

export const McqQuestionCard: React.FC<McqQuestionCardProps> = ({
  question,
  questionNumber,
  totalQuestions,
  currentAnswer,
  isFlagged,
  onAnswer,
  onFlag,
  isReview = false,
  correctAnswer
}) => {
  const [selectedOption, setSelectedOption] = useState<string | undefined>(currentAnswer);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  
  // Reset the start time when the question changes
  useEffect(() => {
    setStartTime(Date.now());
    setSelectedOption(currentAnswer);
  }, [question.id, currentAnswer]);
  
  // Update the time spent on this question
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    
    return () => clearInterval(timer);
  }, [startTime]);
  
  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    onAnswer(value);
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-500 mb-1">
              Question {questionNumber} of {totalQuestions}
            </div>
            <CardTitle className="text-xl">
              {question.text}
            </CardTitle>
          </div>
          <Button
            variant="outline"
            size="sm"
            className={`flex items-center gap-1 ${
              isFlagged ? 'bg-yellow-100 border-yellow-300 text-yellow-800 hover:bg-yellow-200' : ''
            }`}
            onClick={onFlag}
          >
            {isFlagged ? (
              <>
                <Bookmark className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="hidden sm:inline">Flagged</span>
              </>
            ) : (
              <>
                <Flag className="h-4 w-4" />
                <span className="hidden sm:inline">Flag</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedOption}
          onValueChange={handleOptionChange}
          className="space-y-3"
          disabled={isReview}
        >
          {question.options.map((option) => {
            const isCorrectInReview = isReview && option.id.toString() === correctAnswer;
            const isIncorrectSelection = isReview && selectedOption === option.id.toString() && option.id.toString() !== correctAnswer;
            
            return (
              <div 
                key={option.id}
                className={`flex items-center space-x-2 p-3 rounded-md border ${
                  isCorrectInReview 
                    ? 'bg-green-50 border-green-300' 
                    : isIncorrectSelection 
                    ? 'bg-red-50 border-red-300' 
                    : selectedOption === option.id.toString() 
                    ? 'bg-blue-50 border-blue-300' 
                    : 'bg-white hover:bg-slate-50'
                }`}
              >
                <RadioGroupItem 
                  value={option.id.toString()} 
                  id={`option-${option.id}`}
                  className={
                    isCorrectInReview 
                      ? 'text-green-600 border-green-600' 
                      : isIncorrectSelection 
                      ? 'text-red-600 border-red-600' 
                      : ''
                  }
                />
                <Label 
                  htmlFor={`option-${option.id}`} 
                  className={`flex-grow cursor-pointer ${
                    isCorrectInReview 
                      ? 'text-green-800' 
                      : isIncorrectSelection 
                      ? 'text-red-800' 
                      : ''
                  }`}
                >
                  {option.label && (
                    <span className="font-medium mr-2">{option.label}.</span>
                  )}
                  {option.text}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
        
        {isReview && question.explanation && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-800 mb-2">Explanation</h3>
            <p className="text-blue-700">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 text-xs text-gray-500 justify-between">
        <div>Points: {question.marks}</div>
        {!isReview && <div>Time spent: {timeSpent} seconds</div>}
      </CardFooter>
    </Card>
  );
};