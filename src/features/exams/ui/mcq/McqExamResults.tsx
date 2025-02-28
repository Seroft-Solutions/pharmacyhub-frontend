'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMcqExamStore } from '../../store/mcqExamStore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ExamResult, QuestionResult } from '../../model/mcqTypes';
import { Loader2, CheckCircle, XCircle, HelpCircle, Clock, Award, BarChart } from 'lucide-react';
import { format } from 'date-fns';

export default function McqExamResults() {
  const router = useRouter();
  const { examResult, currentExam, isLoading, error } = useMcqExamStore();
  const [selectedTab, setSelectedTab] = useState('summary');

  // Redirect if there's no result or exam data
  useEffect(() => {
    if (!isLoading && !examResult && !error) {
      router.push('/exams');
    }
  }, [examResult, isLoading, error, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Loading results...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 text-red-600 p-6 rounded-lg max-w-lg text-center shadow-md">
          <h2 className="text-xl font-bold mb-4">Error</h2>
          <p className="mb-4">{error}</p>
          <Button 
            className="mt-4 bg-red-600 hover:bg-red-700 text-white" 
            onClick={() => router.push('/exams')}
          >
            Return to Exams
          </Button>
        </div>
      </div>
    );
  }

  if (!examResult) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-yellow-50 text-yellow-600 p-6 rounded-lg max-w-lg text-center shadow-md">
          <h2 className="text-xl font-bold mb-4">No Results Available</h2>
          <p className="mb-4">No exam results are available to display.</p>
          <Button 
            className="mt-4" 
            onClick={() => router.push('/exams')}
          >
            Return to Exams
          </Button>
        </div>
      </div>
    );
  }

  // Format time spent from seconds to readable format
  const formatTimeSpent = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Calculate percentage score
  const scorePercentage = (examResult.score / examResult.totalMarks) * 100;

  // Prepare data for Questions tab
  const questionResults = examResult.questionResults;
  
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{examResult.examTitle} - Results</h1>
        <p className="text-muted-foreground mt-2">
          Completed on {examResult.completedAt 
            ? format(new Date(examResult.completedAt), 'PPP \'at\' p') 
            : 'Unknown date'}
        </p>
      </div>

      <Tabs defaultValue="summary" value={selectedTab} onValueChange={setSelectedTab} className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        {/* Summary Tab */}
        <TabsContent value="summary" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Exam Summary</CardTitle>
              <CardDescription>
                Overview of your exam performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Score Card */}
                <Card className="flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Final Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="relative pt-1 mb-4">
                        <Progress 
                          value={scorePercentage} 
                          className="h-4" 
                        />
                        <p className="mt-2 text-sm text-muted-foreground">
                          {scorePercentage.toFixed(1)}% (Passing: {(examResult.passingMarks / examResult.totalMarks * 100).toFixed(0)}%)
                        </p>
                      </div>
                      <div className="text-4xl font-bold mt-4">
                        {examResult.score} / {examResult.totalMarks}
                      </div>
                      <div className={`mt-4 font-semibold ${
                        examResult.isPassed ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {examResult.isPassed ? (
                          <div className="flex items-center justify-center">
                            <CheckCircle className="mr-2 h-5 w-5" />
                            Passed
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <XCircle className="mr-2 h-5 w-5" />
                            Failed
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Statistics Card */}
                <Card className="flex-1">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium">Correct Answers</p>
                          <p className="text-sm text-muted-foreground">
                            {examResult.correctAnswers} of {examResult.totalQuestions} ({
                              ((examResult.correctAnswers / examResult.totalQuestions) * 100).toFixed(1)
                            }%)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <XCircle className="mr-2 h-5 w-5 text-red-600" />
                        <div>
                          <p className="font-medium">Incorrect Answers</p>
                          <p className="text-sm text-muted-foreground">
                            {examResult.incorrectAnswers} of {examResult.totalQuestions} ({
                              ((examResult.incorrectAnswers / examResult.totalQuestions) * 100).toFixed(1)
                            }%)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <HelpCircle className="mr-2 h-5 w-5 text-yellow-600" />
                        <div>
                          <p className="font-medium">Unanswered</p>
                          <p className="text-sm text-muted-foreground">
                            {examResult.unanswered} of {examResult.totalQuestions} ({
                              ((examResult.unanswered / examResult.totalQuestions) * 100).toFixed(1)
                            }%)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">Time Spent</p>
                          <p className="text-sm text-muted-foreground">
                            {formatTimeSpent(examResult.timeSpent)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => router.push('/exams')}>
                Back to Exams
              </Button>
              <Button onClick={() => setSelectedTab('questions')}>
                Review Questions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Questions Tab */}
        <TabsContent value="questions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Question Review</CardTitle>
              <CardDescription>
                Review your answers and see explanations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {questionResults.map((result, index) => (
                  <Card key={result.questionId} className="border">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          result.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {result.isCorrect ? 'Correct' : 'Incorrect'}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{result.questionText}</p>
                      <div className="space-y-2 mb-4">
                        <div className={`p-3 rounded-md ${
                          result.userAnswerId === result.correctAnswerId 
                            ? 'bg-green-50 border border-green-300' 
                            : result.userAnswerId 
                              ? 'bg-red-50 border border-red-300'
                              : 'bg-yellow-50 border border-yellow-300'
                        }`}>
                          {result.userAnswerId ? (
                            <>
                              <p className="font-medium">Your Answer:</p>
                              <p className="text-sm">Option {result.userAnswerId}</p>
                            </>
                          ) : (
                            <p className="font-medium">You did not answer this question</p>
                          )}
                        </div>
                        
                        {!result.isCorrect && (
                          <div className="p-3 rounded-md bg-green-50 border border-green-300">
                            <p className="font-medium">Correct Answer:</p>
                            <p className="text-sm">Option {result.correctAnswerId}</p>
                          </div>
                        )}
                      </div>
                      
                      {result.explanation && (
                        <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                          <p className="font-medium flex items-center">
                            <HelpCircle className="h-4 w-4 mr-1 text-blue-500" />
                            Explanation:
                          </p>
                          <p className="text-sm mt-1">{result.explanation}</p>
                        </div>
                      )}
                      
                      <div className="mt-4 text-right text-sm text-muted-foreground">
                        {result.earnedPoints} / {result.points} points
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedTab('summary')}>
                Back to Summary
              </Button>
              <Button onClick={() => router.push('/exams')}>
                Finish Review
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Performance Analytics</CardTitle>
              <CardDescription>
                Detailed analysis of your exam performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Time Distribution */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Score Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Correct Answers</span>
                      <span className="text-sm font-medium">{examResult.correctAnswers * 100 / examResult.totalQuestions}%</span>
                    </div>
                    <Progress value={examResult.correctAnswers * 100 / examResult.totalQuestions} className="h-2" />
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm font-medium">Incorrect Answers</span>
                      <span className="text-sm font-medium">{examResult.incorrectAnswers * 100 / examResult.totalQuestions}%</span>
                    </div>
                    <Progress value={examResult.incorrectAnswers * 100 / examResult.totalQuestions} className="h-2" />
                    
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-sm font-medium">Unanswered</span>
                      <span className="text-sm font-medium">{examResult.unanswered * 100 / examResult.totalQuestions}%</span>
                    </div>
                    <Progress value={examResult.unanswered * 100 / examResult.totalQuestions} className="h-2" />
                  </CardContent>
                </Card>
                
                {/* Performance Insights */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Performance Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <Award className="h-5 w-5 mr-2 mt-0.5 text-yellow-500" />
                        <div>
                          <p className="font-medium">Strengths</p>
                          <p className="text-sm text-muted-foreground">
                            {examResult.correctAnswers > examResult.incorrectAnswers 
                              ? "You performed well overall, with more correct answers than incorrect ones." 
                              : "You need to improve your understanding of the subject matter."}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <BarChart className="h-5 w-5 mr-2 mt-0.5 text-blue-500" />
                        <div>
                          <p className="font-medium">Comparison to Passing Score</p>
                          <p className="text-sm text-muted-foreground">
                            {examResult.isPassed 
                              ? `Your score is ${(scorePercentage - (examResult.passingMarks / examResult.totalMarks * 100)).toFixed(1)}% above the minimum passing requirement.` 
                              : `Your score is ${((examResult.passingMarks / examResult.totalMarks * 100) - scorePercentage).toFixed(1)}% below the minimum passing requirement.`}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 mr-2 mt-0.5 text-purple-500" />
                        <div>
                          <p className="font-medium">Time Management</p>
                          <p className="text-sm text-muted-foreground">
                            {examResult.unanswered === 0
                              ? "Great job managing your time! You answered all questions."
                              : `You left ${examResult.unanswered} question${examResult.unanswered > 1 ? 's' : ''} unanswered. Try to manage your time better in future exams.`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => setSelectedTab('summary')}>
                Back to Summary
              </Button>
              <Button onClick={() => router.push('/exams')}>
                Finish
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
