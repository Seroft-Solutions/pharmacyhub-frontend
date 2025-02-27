'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { ExamResult, Question, UserAnswer } from '../../model/mcqTypes';

interface ExamResultsProps {
  result: ExamResult;
  questions: Question[];
  userAnswers: Record<number, UserAnswer>;
  onReturnToDashboard: () => void;
}

export function ExamResults({
  result,
  questions,
  userAnswers,
  onReturnToDashboard,
}: ExamResultsProps) {
  const scorePercentage = result.score;
  const isPassed = result.isPassed;
  
  // Calculate time spent in minutes and seconds
  const totalSeconds = result.timeSpent;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <span>Exam Results: {result.examTitle}</span>
          {isPassed ? (
            <span className="ml-2 text-sm bg-green-100 text-green-800 py-1 px-2 rounded-full">Passed</span>
          ) : (
            <span className="ml-2 text-sm bg-red-100 text-red-800 py-1 px-2 rounded-full">Failed</span>
          )}
        </CardTitle>
        <CardDescription>
          Completed on {new Date(result.completedAt).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">Your Score</div>
              <div className="text-3xl font-bold">
                {scorePercentage.toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">
                Passing score: {result.passingMarks}%
              </div>
            </div>
            
            <Progress 
              value={scorePercentage} 
              className="h-2"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="text-sm">Total Questions</div>
              <div className="font-medium">{result.totalQuestions}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm">Correct Answers</div>
              <div className="font-medium text-green-600">{result.correctAnswers}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm">Incorrect Answers</div>
              <div className="font-medium text-red-600">{result.incorrectAnswers}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm">Unanswered</div>
              <div className="font-medium">{result.unanswered}</div>
            </div>
            <div className="flex justify-between">
              <div className="text-sm">Time Taken</div>
              <div className="font-medium">{minutes}m {seconds}s</div>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Questions</TabsTrigger>
            <TabsTrigger value="correct">Correct</TabsTrigger>
            <TabsTrigger value="incorrect">Incorrect</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-4 space-y-4">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[question.id];
              const questionResult = result.questionResults.find(qr => qr.questionId === question.id);
              const isCorrect = questionResult?.isCorrect || false;
              
              return (
                <div key={question.id} className="border rounded-md p-4">
                  <div className="flex items-start justify-between">
                    <div className="font-medium">Question {index + 1}</div>
                    {isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <p className="mt-2">{question.text}</p>
                  
                  <div className="mt-3 space-y-2">
                    {question.options.map((option, optIndex) => {
                      const isUserSelection = userAnswer?.selectedOption === optIndex;
                      const isCorrectOption = questionResult?.correctAnswerId === option.id;
                      
                      return (
                        <div 
                          key={optIndex}
                          className={`p-2 border rounded-md ${
                            isUserSelection && isCorrectOption
                              ? 'bg-green-50 border-green-300'
                              : isUserSelection && !isCorrectOption
                              ? 'bg-red-50 border-red-300'
                              : isCorrectOption
                              ? 'bg-green-50 border-green-300'
                              : ''
                          }`}
                        >
                          {option}
                          {isUserSelection && isCorrectOption && (
                            <span className="ml-2 text-green-600 text-sm">✓ Your answer (Correct)</span>
                          )}
                          {isUserSelection && !isCorrectOption && (
                            <span className="ml-2 text-red-600 text-sm">✗ Your answer</span>
                          )}
                          {!isUserSelection && isCorrectOption && (
                            <span className="ml-2 text-green-600 text-sm">Correct answer</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  
                  {questionResult?.explanation && (
                    <div className="mt-3 text-sm bg-blue-50 p-3 rounded-md">
                      <strong>Explanation:</strong> {questionResult.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </TabsContent>
          
          <TabsContent value="correct" className="mt-4 space-y-4">
            {questions
              .filter(q => {
                const qResult = result.questionResults.find(r => r.questionId === q.id);
                return qResult?.isCorrect;
              })
              .map((question, index) => {
                const userAnswer = userAnswers[question.id];
                const questionResult = result.questionResults.find(qr => qr.questionId === question.id);
                
                return (
                  <div key={question.id} className="border rounded-md p-4">
                    <div className="flex items-start justify-between">
                      <div className="font-medium">Question {questions.findIndex(q => q.id === question.id) + 1}</div>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <p className="mt-2">{question.text}</p>
                    
                    <div className="mt-3 space-y-2">
                      {question.options.map((option, optIndex) => {
                        const isUserSelection = userAnswer?.selectedOption === optIndex;
                        const isCorrectOption = questionResult?.correctAnswerId === option.id;
                        
                        return (
                          <div 
                            key={optIndex}
                            className={`p-2 border rounded-md ${
                              isUserSelection && isCorrectOption
                                ? 'bg-green-50 border-green-300'
                                : ''
                            }`}
                          >
                            {option}
                            {isUserSelection && isCorrectOption && (
                              <span className="ml-2 text-green-600 text-sm">✓ Your answer (Correct)</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {questionResult?.explanation && (
                      <div className="mt-3 text-sm bg-blue-50 p-3 rounded-md">
                        <strong>Explanation:</strong> {questionResult.explanation}
                      </div>
                    )}
                  </div>
                );
              })
            }
          </TabsContent>
          
          <TabsContent value="incorrect" className="mt-4 space-y-4">
            {questions
              .filter(q => {
                const qResult = result.questionResults.find(r => r.questionId === q.id);
                return !qResult?.isCorrect;
              })
              .map((question, index) => {
                const userAnswer = userAnswers[question.id];
                const questionResult = result.questionResults.find(qr => qr.questionId === question.id);
                
                return (
                  <div key={question.id} className="border rounded-md p-4">
                    <div className="flex items-start justify-between">
                      <div className="font-medium">Question {questions.findIndex(q => q.id === question.id) + 1}</div>
                      <XCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <p className="mt-2">{question.text}</p>
                    
                    <div className="mt-3 space-y-2">
                      {question.options.map((option, optIndex) => {
                        const isUserSelection = userAnswer?.selectedOption === optIndex;
                        const isCorrectOption = questionResult?.correctAnswerId === option.id;
                        
                        return (
                          <div 
                            key={optIndex}
                            className={`p-2 border rounded-md ${
                              isUserSelection && !isCorrectOption
                                ? 'bg-red-50 border-red-300'
                                : isCorrectOption
                                ? 'bg-green-50 border-green-300'
                                : ''
                            }`}
                          >
                            {option}
                            {isUserSelection && !isCorrectOption && (
                              <span className="ml-2 text-red-600 text-sm">✗ Your answer</span>
                            )}
                            {!isUserSelection && isCorrectOption && (
                              <span className="ml-2 text-green-600 text-sm">Correct answer</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    
                    {questionResult?.explanation && (
                      <div className="mt-3 text-sm bg-blue-50 p-3 rounded-md">
                        <strong>Explanation:</strong> {questionResult.explanation}
                      </div>
                    )}
                  </div>
                );
              })
            }
          </TabsContent>
        </Tabs>
        
        <div className="mt-8">
          <Button 
            onClick={onReturnToDashboard}
            className="w-full"
          >
            Return to Dashboard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
