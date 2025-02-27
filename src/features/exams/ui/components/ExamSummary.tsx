'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, BookmarkIcon, Circle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Question } from '../../model/mcqTypes';

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
  onSubmitExam,
}: ExamSummaryProps) {
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  
  const totalQuestions = questions.length;
  const answeredCount = answeredQuestionIds.size;
  const unansweredCount = totalQuestions - answeredCount;
  const flaggedCount = flaggedQuestionIds.size;
  
  const handleSubmitClick = () => {
    if (unansweredCount > 0) {
      setShowConfirmDialog(true);
    } else {
      onSubmitExam();
    }
  };
  
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Exam Summary</CardTitle>
          <CardDescription>
            Review your progress before submitting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Total Questions</div>
              <div className="text-2xl font-bold">{totalQuestions}</div>
            </div>
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">Completion</div>
              <div className="text-2xl font-bold">{Math.round((answeredCount / totalQuestions) * 100)}%</div>
            </div>
            <div className="space-y-1 flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <div>
                <div className="text-sm text-muted-foreground">Answered</div>
                <div className="text-xl font-semibold">{answeredCount}</div>
              </div>
            </div>
            <div className="space-y-1 flex items-center">
              <Circle className="h-4 w-4 text-gray-300 mr-2" />
              <div>
                <div className="text-sm text-muted-foreground">Unanswered</div>
                <div className="text-xl font-semibold">{unansweredCount}</div>
              </div>
            </div>
            <div className="space-y-1 flex items-center">
              <BookmarkIcon className="h-4 w-4 text-yellow-500 mr-2" />
              <div>
                <div className="text-sm text-muted-foreground">Flagged</div>
                <div className="text-xl font-semibold">{flaggedCount}</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Question Status</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((question, index) => {
                const isAnswered = answeredQuestionIds.has(question.id);
                const isFlagged = flaggedQuestionIds.has(question.id);
                
                return (
                  <Button
                    key={question.id}
                    variant="outline"
                    size="sm"
                    className={`relative w-10 h-10 p-0 ${
                      isFlagged ? "border-yellow-500" : ""
                    } ${
                      isAnswered ? "bg-green-50" : "bg-red-50"
                    }`}
                    onClick={() => onNavigateToQuestion(index)}
                  >
                    <span>{index + 1}</span>
                    
                    {isAnswered ? (
                      <CheckCircle 
                        className="absolute -top-1 -right-1 h-3 w-3 text-green-500"
                      />
                    ) : (
                      <XCircle 
                        className="absolute -top-1 -right-1 h-3 w-3 text-red-500"
                      />
                    )}
                    
                    {isFlagged && (
                      <BookmarkIcon 
                        className="absolute -bottom-1 -right-1 h-3 w-3 text-yellow-500"
                      />
                    )}
                  </Button>
                );
              })}
            </div>
          </div>
          
          <div className="mt-8 space-y-4">
            <Button 
              className="w-full" 
              onClick={handleSubmitClick}
            >
              Submit Exam
            </Button>
            
            {unansweredCount > 0 && (
              <p className="text-sm text-muted-foreground text-center">
                You have {unansweredCount} unanswered {unansweredCount === 1 ? 'question' : 'questions'}.
                Click on any question number to navigate to it.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit with unanswered questions?</DialogTitle>
            <DialogDescription>
              You have {unansweredCount} unanswered {unansweredCount === 1 ? 'question' : 'questions'}.
              Are you sure you want to submit your exam?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
            >
              Continue Exam
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setShowConfirmDialog(false);
                onSubmitExam();
              }}
            >
              Submit Anyway
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
