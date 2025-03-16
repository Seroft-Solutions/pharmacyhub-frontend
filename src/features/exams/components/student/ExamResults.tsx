import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { CheckCircleIcon, XCircleIcon, HomeIcon, Clock3Icon, PieChartIcon, BarChart3Icon, BookOpenIcon } from 'lucide-react';
import { Question, UserAnswer, ExamResult } from '../../model/mcqTypes';
import { formatTimeVerbose } from '../../utils/formatTime';
import { cn } from '@/lib/utils';

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
  onReturnToDashboard
}: ExamResultsProps) {
  // Format time spent
  const formatTimeSpent = (seconds: number) => {
    return formatTimeVerbose(seconds);
  };
  
  // Calculate score percentage
  const scorePercentage = (result.score / result.totalMarks) * 100;
  const passingPercentage = (result.passingMarks / result.totalMarks) * 100;
  
  // Generate circular progress indicator
  const circumference = 2 * Math.PI * 40; // circle radius = 40
  const strokeDashoffset = circumference - (scorePercentage / 100) * circumference;
  
  // Determine result color based on pass/fail status
  const resultColor = result.isPassed ? 'text-green-600' : 'text-red-600';
  const resultBgColor = result.isPassed ? 'bg-green-50' : 'bg-red-50';
  const resultBorderColor = result.isPassed ? 'border-green-200' : 'border-red-200';
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-3 border-b">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold mb-1">{result.examTitle}</CardTitle>
            <CardDescription>
              Completed on {new Date(result.completedAt).toLocaleDateString()} • Attempt ID: {result.attemptId}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onReturnToDashboard}
          >
            <HomeIcon className="h-4 w-4 mr-2" />
            Dashboard
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Score Overview */}
          <div className={cn(
            "rounded-lg border p-6 flex items-center justify-between",
            resultBorderColor,
            resultBgColor
          )}>
            <div>
              <h3 className="text-lg font-semibold mb-2">Your Score</h3>
              <div className="flex items-baseline">
                <span className={cn("text-4xl font-bold", resultColor)}>{Math.round(scorePercentage)}%</span>
                <span className="text-gray-500 ml-2">({result.score}/{result.totalMarks})</span>
              </div>
              <div className="mt-1 flex items-center">
                {result.isPassed ? (
                  <>
                    <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1.5" />
                    <span className="text-green-600 font-medium">Passed</span>
                  </>
                ) : (
                  <>
                    <XCircleIcon className="h-4 w-4 text-red-500 mr-1.5" />
                    <span className="text-red-600 font-medium">Failed</span>
                  </>
                )}
                <span className="text-sm text-gray-500 ml-2">
                  (Passing score: {passingPercentage}%)
                </span>
              </div>
            </div>
            
            <div className="relative inline-flex">
              <svg className="w-24 h-24" viewBox="0 0 100 100">
                <circle 
                  className="text-gray-200" 
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50" 
                />
                <circle 
                  className={result.isPassed ? "text-green-500" : "text-red-500"} 
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent" 
                  r="40" 
                  cx="50" 
                  cy="50" 
                />
              </svg>
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <span className="text-2xl font-bold">{Math.round(scorePercentage)}%</span>
              </div>
            </div>
          </div>
          
          {/* Statistics */}
          <div className="rounded-lg border p-6">
            <h3 className="text-lg font-semibold mb-4">Statistics</h3>
            <div className="grid grid-cols-2 gap-y-3">
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Time Spent</div>
                <div className="flex items-center">
                  <Clock3Icon className="h-4 w-4 text-blue-500 mr-1.5" />
                  <span className="font-medium">{formatTimeSpent(result.timeSpent)}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Total Questions</div>
                <div className="flex items-center">
                  <BookOpenIcon className="h-4 w-4 text-blue-500 mr-1.5" />
                  <span className="font-medium">{result.totalQuestions}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Correct Answers</div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1.5" />
                  <span className="font-medium">{result.correctAnswers}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm text-gray-500">Incorrect Answers</div>
                <div className="flex items-center">
                  <XCircleIcon className="h-4 w-4 text-red-500 mr-1.5" />
                  <span className="font-medium">{result.incorrectAnswers}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">All Questions</TabsTrigger>
            <TabsTrigger value="correct">Correct</TabsTrigger>
            <TabsTrigger value="incorrect">Incorrect</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 font-medium border-b flex justify-between">
                <span>Question Details</span>
                <span>Your Answer</span>
              </div>
              <div className="max-h-[500px] overflow-y-auto">
                {questions.map((question, index) => {
                  const userAnswer = userAnswers[question.id];
                  const isCorrect = result.questionResults.find(r => r.questionId === question.id)?.isCorrect || false;
                  
                  return (
                    <div 
                      key={question.id}
                      className={cn(
                        "p-4 border-b last:border-b-0",
                        isCorrect ? "bg-green-50" : "bg-red-50"
                      )}
                    >
                      <div className="flex justify-between">
                        <div className="w-3/4 pr-4">
                          <div className="flex items-center mb-2">
                            <span className="font-medium mr-2">Question {index + 1}</span>
                            {isCorrect ? (
                              <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Correct</span>
                            ) : (
                              <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">Incorrect</span>
                            )}
                          </div>
                          <p className="text-sm mb-3">{question.text}</p>
                          
                          <div className="space-y-2 text-sm">
                            {question.options.map((option, optIndex) => {
                              const isUserSelected = userAnswer?.selectedOption === optIndex;
                              const isCorrectOption = result.questionResults.find(r => r.questionId === question.id)?.correctAnswer === optIndex;
                              
                              return (
                                <div 
                                  key={optIndex}
                                  className={cn(
                                    "p-2 rounded-md flex items-center",
                                    isUserSelected && isCorrectOption ? "bg-green-100 border border-green-200" : 
                                    isUserSelected && !isCorrectOption ? "bg-red-100 border border-red-200" :
                                    isCorrectOption ? "bg-green-50 border border-green-100" :
                                    "bg-gray-50 border border-gray-200"
                                  )}
                                >
                                  <div className="mr-2 flex-shrink-0">
                                    {isUserSelected && isCorrectOption && <CheckCircleIcon className="h-4 w-4 text-green-500" />}
                                    {isUserSelected && !isCorrectOption && <XCircleIcon className="h-4 w-4 text-red-500" />}
                                    {!isUserSelected && isCorrectOption && <CheckCircleIcon className="h-4 w-4 text-green-500" />}
                                  </div>
                                  <span>{option}</span>
                                </div>
                              );
                            })}
                          </div>
                          
                          {result.questionResults.find(r => r.questionId === question.id)?.explanation && (
                            <div className="mt-3 text-sm bg-blue-50 p-3 rounded border border-blue-100">
                              <div className="font-medium text-blue-700 mb-1">Explanation:</div>
                              <div className="text-blue-800">
                                {result.questionResults.find(r => r.questionId === question.id)?.explanation}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div className="w-1/4 border-l pl-4 flex flex-col items-center justify-center">
                          {userAnswer ? (
                            <>
                              <div className="text-center mb-2">
                                <div className="text-sm text-gray-500">Your Answer</div>
                                <div className="text-xl font-bold">
                                  {String.fromCharCode(65 + userAnswer.selectedOption)}
                                </div>
                              </div>
                              
                              {isCorrect ? (
                                <div className="text-green-600 flex items-center">
                                  <CheckCircleIcon className="h-5 w-5 mr-1.5" />
                                  <span className="font-medium">Correct</span>
                                </div>
                              ) : (
                                <div className="text-red-600 flex items-center">
                                  <XCircleIcon className="h-5 w-5 mr-1.5" />
                                  <span className="font-medium">Incorrect</span>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-gray-500 italic">Not answered</div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="correct" className="mt-0">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 font-medium border-b">
                Correct Answers
              </div>
              <div className="p-4">
                {result.correctAnswers === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No correct answers in this attempt.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question, index) => {
                      const isCorrect = result.questionResults.find(r => r.questionId === question.id)?.isCorrect || false;
                      if (!isCorrect) return null;
                      
                      return (
                        <div 
                          key={question.id}
                          className="bg-green-50 border border-green-100 rounded-lg p-4"
                        >
                          <div className="flex items-center mb-2">
                            <span className="font-medium mr-2">Question {index + 1}</span>
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Correct</span>
                          </div>
                          <p className="text-sm mb-2">{question.text}</p>
                          
                          <div className="bg-green-100 border border-green-200 rounded-md p-2 text-sm flex items-center">
                            <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                            <span>Your answer: {question.options[userAnswers[question.id]?.selectedOption || 0]}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="incorrect" className="mt-0">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 font-medium border-b">
                Incorrect Answers
              </div>
              <div className="p-4">
                {result.incorrectAnswers === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No incorrect answers in this attempt. Great job!
                  </div>
                ) : (
                  <div className="space-y-4">
                    {questions.map((question, index) => {
                      const isCorrect = result.questionResults.find(r => r.questionId === question.id)?.isCorrect || false;
                      if (isCorrect) return null;
                      
                      const correctOptionIndex = result.questionResults.find(r => r.questionId === question.id)?.correctAnswer || 0;
                      
                      return (
                        <div 
                          key={question.id}
                          className="bg-red-50 border border-red-100 rounded-lg p-4"
                        >
                          <div className="flex items-center mb-2">
                            <span className="font-medium mr-2">Question {index + 1}</span>
                            <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">Incorrect</span>
                          </div>
                          <p className="text-sm mb-2">{question.text}</p>
                          
                          <div className="space-y-2 text-sm">
                            <div className="bg-red-100 border border-red-200 rounded-md p-2 flex items-center">
                              <XCircleIcon className="h-4 w-4 text-red-500 mr-2" />
                              <span>Your answer: {userAnswers[question.id] ? question.options[userAnswers[question.id].selectedOption] : 'Not answered'}</span>
                            </div>
                            
                            <div className="bg-green-100 border border-green-200 rounded-md p-2 flex items-center">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                              <span>Correct answer: {question.options[correctOptionIndex]}</span>
                            </div>
                          </div>
                          
                          {result.questionResults.find(r => r.questionId === question.id)?.explanation && (
                            <div className="mt-3 text-sm bg-blue-50 p-3 rounded border border-blue-100">
                              <div className="font-medium text-blue-700 mb-1">Explanation:</div>
                              <div className="text-blue-800">
                                {result.questionResults.find(r => r.questionId === question.id)?.explanation}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t pt-4 flex justify-between">
        <Button
          variant="outline"
          onClick={onReturnToDashboard}
        >
          <HomeIcon className="mr-2 h-4 w-4" />
          Return to Dashboard
        </Button>
      </CardFooter>
    </Card>
  );
}