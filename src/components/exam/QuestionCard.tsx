import React from 'react';
import { Question, QuestionAnswer } from '@/types/exam';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface QuestionCardProps {
  question: Question;
  answer?: QuestionAnswer;
  onAnswer: (answer: string) => void;
}

export const QuestionCard = ({ question, answer, onAnswer }: QuestionCardProps) => {
  if (!question) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          Question {question.questionNumber}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          <p className="text-lg mb-6">{question.content.question}</p>

          <RadioGroup
            value={answer?.selectedAnswer}
            onValueChange={onAnswer}
            className="space-y-4"
          >
            {Object.entries(question.content.options).map(([key, text]) => (
              <div key={key} className="flex items-center space-x-2">
                <RadioGroupItem value={key} id={`option-${key}`} />
                <Label htmlFor={`option-${key}`} className="text 
-md">
                  {text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};