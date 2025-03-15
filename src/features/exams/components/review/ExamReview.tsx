import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Home
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ExamResult, QuestionResult } from '../../model/standardTypes';

interface ExamReviewProps {
  result: ExamResult;
  onBack: () => void;
  onFinish: () => void;
}

export const ExamReview: React.FC<ExamReviewProps> = ({
  result,
  onBack,
  onFinish
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  if (!result || !result.questionResults || result.questionResults.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4 text-center">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">No results available for review</h2>
            <p className="mb-6">There are no question results available to review.</p>
            <Button onClick={onFinish}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const questionResults = result.questionResults;
  const currentQuestion = questionResults[currentQuestionIndex];
  
  const navigateToQuestion = (index: number) => {
    if (index >= 0 && index < questionResults.length) {
      setCurrentQuestionIndex(index);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{result.examTitle}</h1>
          <p className="text-gray-600">Review your answers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Results
          </Button>
          <Button variant="outline" onClick={onFinish}>
            <Home className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Question {currentQuestionIndex + 1} of {questionResults.length}</span>
          <span>{(currentQuestionIndex + 1) / questionResults.length * 100}%</span>
        </div>
        <Progress 
          value={(currentQuestionIndex + 1) / questionResults.length * 100} 
          className="h-2" 
        />
      </div>
      
      {/* Question review card */}
      <Card className="mb-6">
        <CardHeader className="pb-2 flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle className="text-xl">Question {currentQuestionIndex + 1}</CardTitle>
            <CardDescription>
              {currentQuestion.isCorrect 
                ? <span className="text-green-600 font-medium">Correct</span> 
                : <span className="text-red-600 font-medium">Incorrect</span>}
            </CardDescription>
          </div>
          <div className="mt-2 sm:mt-0">
            <Badge className={currentQuestion.isCorrect 
              ? "bg-green-100 text-green-800" 
              : "bg-red-100 text-red-800"}
            >
              {currentQuestion.isCorrect 
                ? `+${currentQuestion.earnedPoints}` 
                : "+0"} / {currentQuestion.points} points
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Question text */}
          <div className="bg-slate-50 p-4 rounded-lg">
            <p className="font-medium">{currentQuestion.questionText}</p>
          </div>
          
          {/* Options */}
          <div className="space-y-2">
            {/* This is a mock implementation. In a real app, you would display all options */}
            {/* Correct answer */}
            <div className={`p-3 rounded-lg border ${
              currentQuestion.correctAnswerId === currentQuestion.userAnswerId
                ? "bg-green-50 border-green-200"
                : "bg-green-50 border-green-200"
            }`}>
              <div className="flex items-start">
                <div className="mr-3 mt-0.5">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Option {currentQuestion.correctAnswerId}</p>
                  <p className="text-sm text-gray-700">This is the correct answer</p>
                </div>
              </div>
            </div>
            
            {/* User's incorrect answer, if applicable */}
            {currentQuestion.userAnswerId !== currentQuestion.correctAnswerId && (
              <div className="p-3 rounded-lg border bg-red-50 border-red-200">
                <div className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    <XCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">Option {currentQuestion.userAnswerId || "None"}</p>
                    <p className="text-sm text-gray-700">
                      {currentQuestion.userAnswerId 
                        ? "Your selected answer" 
                        : "You did not answer this question"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Explanation */}
          {currentQuestion.explanation && (
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="font-medium text-blue-800 mb-1">Explanation</p>
              <p className="text-blue-700">{currentQuestion.explanation}</p>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-between px-6 py-4">
          <Button
            variant="outline"
            onClick={() => navigateToQuestion(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <Button
            onClick={() => navigateToQuestion(currentQuestionIndex + 1)}
            disabled={currentQuestionIndex === questionResults.length - 1}
          >
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      {/* Question navigation */}
      <div className="bg-white p-4 rounded-lg border shadow-sm">
        <h3 className="font-medium mb-3">Question Navigator</h3>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {questionResults.map((q, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-10 w-10 p-0 ${
                index === currentQuestionIndex ? "border-2 border-blue-600" : ""
              } ${
                q.isCorrect 
                  ? "bg-green-50 border-green-200 text-green-800" 
                  : "bg-red-50 border-red-200 text-red-800"
              }`}
              onClick={() => navigateToQuestion(index)}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};