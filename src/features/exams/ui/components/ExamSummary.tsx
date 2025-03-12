import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { CheckIcon, AlertCircleIcon, ClipboardListIcon, ArrowLeftIcon } from 'lucide-react';
import { Question } from '../../model/mcqTypes';
import { cn } from '@/lib/utils';

interface ExamSummaryProps {
  questions: Question[];
  answeredQuestionIds: Set<number>;
  flaggedQuestionIds: Set<number>;
  onNavigateToQuestion: (index: number) => void;
  onSubmitExam: () => void;
}

export function ExamSummary({
  questions,
  answeredQuestionIds,
  flaggedQuestionIds,
  onNavigateToQuestion,
  onSubmitExam
}: ExamSummaryProps) {
  const totalQuestions = questions.length;
  const answeredQuestions = answeredQuestionIds.size;
  const flaggedQuestions = flaggedQuestionIds.size;
  const unansweredQuestions = totalQuestions - answeredQuestions;
  
  const completionPercentage = (answeredQuestions / totalQuestions) * 100;
  
  const getSectionClassName = (index: number) => {
    const chunkSize = Math.ceil(totalQuestions / 4); // Split into 4 sections
    const sectionIndex = Math.floor(index / chunkSize);
    
    const colors = [
      'border-l-blue-400 bg-blue-50',
      'border-l-green-400 bg-green-50',
      'border-l-purple-400 bg-purple-50',
      'border-l-amber-400 bg-amber-50'
    ];
    
    return colors[sectionIndex % colors.length];
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3 border-b">
        <CardTitle className="flex items-center text-xl font-semibold">
          <ClipboardListIcon className="mr-2 h-5 w-5" />
          Exam Summary
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-3 gap-5 mb-6">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="flex justify-center mb-1">
              <CheckIcon className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-green-700">{answeredQuestions}</div>
            <div className="text-sm text-green-600">Answered Questions</div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="flex justify-center mb-1">
              <AlertCircleIcon className="h-6 w-6 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-yellow-700">{flaggedQuestions}</div>
            <div className="text-sm text-yellow-600">Flagged Questions</div>
          </div>
          
          <div className={cn(
            "rounded-lg p-4 text-center",
            unansweredQuestions > 0 ? "bg-red-50" : "bg-gray-50"
          )}>
            <div className="flex justify-center mb-1">
              <span className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">?</span>
            </div>
            <div className={cn(
              "text-2xl font-bold",
              unansweredQuestions > 0 ? "text-red-700" : "text-gray-700"
            )}>
              {unansweredQuestions}
            </div>
            <div className={cn(
              "text-sm",
              unansweredQuestions > 0 ? "text-red-600" : "text-gray-600"
            )}>
              Unanswered Questions
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden mb-6">
          <div className="bg-gray-50 px-4 py-2 font-medium border-b">
            Question Status
          </div>
          <div className="max-h-[400px] overflow-y-auto p-1">
            {questions.map((question, index) => {
              const isAnswered = answeredQuestionIds.has(question.id);
              const isFlagged = flaggedQuestionIds.has(question.id);
              
              return (
                <div 
                  key={question.id}
                  className={cn(
                    "border-l-4 p-3 mb-2 rounded flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer",
                    getSectionClassName(index),
                    isAnswered ? "opacity-100" : "opacity-80"
                  )}
                  onClick={() => onNavigateToQuestion(index)}
                >
                  <div className="flex items-center">
                    <span className="font-medium mr-3">Q{index + 1}.</span>
                    <span className="text-sm">{question.text.substring(0, 60)}{question.text.length > 60 ? '...' : ''}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {isAnswered && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <CheckIcon className="h-3 w-3 mr-1" />
                        Answered
                      </span>
                    )}
                    {isFlagged && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <AlertCircleIcon className="h-3 w-3 mr-1" />
                        Flagged
                      </span>
                    )}
                    {!isAnswered && !isFlagged && (
                      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        Unanswered
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex flex-col gap-2">
        <div className="text-center mb-2">
          <p className="text-sm text-gray-500">
            You have answered <span className="font-medium text-primary">{answeredQuestions} out of {totalQuestions}</span> questions ({Math.round(completionPercentage)}% complete)
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 w-full">
          <Button
            variant="outline"
            onClick={() => onNavigateToQuestion(0)}
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Return to Exam
          </Button>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant={unansweredQuestions > 0 ? "secondary" : "default"}
              >
                {unansweredQuestions > 0 ? "Submit Anyway" : "Submit Exam"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
                <AlertDialogDescription>
                  {unansweredQuestions > 0 
                    ? `You still have ${unansweredQuestions} unanswered questions. Once submitted, you cannot change your answers.`
                    : `Are you sure you want to submit your exam? Once submitted, you cannot change your answers.`
                  }
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={onSubmitExam}>
                  Submit Exam
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}