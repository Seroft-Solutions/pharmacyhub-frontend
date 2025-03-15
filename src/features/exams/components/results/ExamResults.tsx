import React from 'react';
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
  AlertCircle,
  Award,
  Clock,
  BarChart,
  ArrowRight,
  Printer
} from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ExamResult, QuestionResult } from '../../model/standardTypes';
import { formatTime } from '../../utils/formatTime';

interface ExamResultsProps {
  result: ExamResult;
  onReview: () => void;
  onTryAgain: () => void;
  onBackToDashboard: () => void;
}

export const ExamResults: React.FC<ExamResultsProps> = ({
  result,
  onReview,
  onTryAgain,
  onBackToDashboard
}) => {
  const getPassFailMessage = () => {
    if (result.isPassed) {
      return {
        icon: <CheckCircle2 className="h-12 w-12 text-green-500" />,
        title: "Congratulations!",
        message: "You have passed the exam.",
        color: "text-green-500"
      };
    } else {
      return {
        icon: <XCircle className="h-12 w-12 text-red-500" />,
        title: "Not Passed",
        message: "You did not meet the passing criteria.",
        color: "text-red-500"
      };
    }
  };

  const passFailInfo = getPassFailMessage();
  const scorePercentage = (result.score / result.totalMarks) * 100;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const formatTimeStr = (seconds: number) => {
    const {hours, minutes, remainingSeconds} = formatTime(seconds);
    let timeStr = "";
    
    if (hours > 0) {
      timeStr += `${hours} hour${hours > 1 ? 's' : ''} `;
    }
    
    if (minutes > 0) {
      timeStr += `${minutes} minute${minutes > 1 ? 's' : ''} `;
    }
    
    if (remainingSeconds > 0 || (hours === 0 && minutes === 0)) {
      timeStr += `${remainingSeconds} second${remainingSeconds !== 1 ? 's' : ''}`;
    }
    
    return timeStr.trim();
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <Card className="border-2 mb-8">
        <CardHeader className="text-center pb-2">
          <div className="flex justify-center mb-4">
            {passFailInfo.icon}
          </div>
          <CardTitle className="text-2xl">{result.examTitle}</CardTitle>
          <CardDescription className="text-lg font-semibold mt-2">
            <span className={passFailInfo.color}>{passFailInfo.title}</span>
            <span className="block text-base font-normal mt-1">
              {passFailInfo.message}
            </span>
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-8">
          {/* Score overview */}
          <div className="text-center">
            <h3 className="text-sm uppercase text-gray-500 mb-2">Your Score</h3>
            <div className={`text-4xl font-bold ${getScoreColor(scorePercentage)}`}>
              {scorePercentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600 mt-1">
              ({result.score} out of {result.totalMarks} marks)
            </div>
            
            <div className="mt-6">
              <Progress
                value={scorePercentage}
                className="h-3"
                indicatorClassName={result.isPassed ? "bg-green-500" : "bg-red-500"}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>{result.passingMarks / result.totalMarks * 100}% (Pass Mark)</span>
                <span>100%</span>
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 flex items-center">
              <div className="bg-blue-100 p-3 mr-4 rounded-full">
                <CheckCircle2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Correct Answers</p>
                <p className="text-lg font-semibold">
                  {result.correctAnswers} ({(result.correctAnswers / result.totalQuestions * 100).toFixed(0)}%)
                </p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 flex items-center">
              <div className="bg-red-100 p-3 mr-4 rounded-full">
                <XCircle className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Incorrect Answers</p>
                <p className="text-lg font-semibold">
                  {result.incorrectAnswers} ({(result.incorrectAnswers / result.totalQuestions * 100).toFixed(0)}%)
                </p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 flex items-center">
              <div className="bg-yellow-100 p-3 mr-4 rounded-full">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unanswered</p>
                <p className="text-lg font-semibold">
                  {result.unanswered} ({(result.unanswered / result.totalQuestions * 100).toFixed(0)}%)
                </p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 rounded-lg p-4 flex items-center">
              <div className="bg-purple-100 p-3 mr-4 rounded-full">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Time Spent</p>
                <p className="text-lg font-semibold">
                  {formatTimeStr(result.timeSpent)}
                </p>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 flex items-center">
              <div className="bg-green-100 p-3 mr-4 rounded-full">
                <Award className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Passing Mark</p>
                <p className="text-lg font-semibold">
                  {result.passingMarks} ({(result.passingMarks / result.totalMarks * 100).toFixed(0)}%)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 bg-gray-50 px-6 py-4">
          <Button 
            variant="outline" 
            onClick={onBackToDashboard}
            className="w-full sm:w-auto"
          >
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button 
              variant="outline" 
              onClick={onTryAgain}
              className="w-full sm:w-auto"
            >
              Try Again
            </Button>
            
            <Button 
              onClick={onReview}
              className="w-full sm:w-auto"
            >
              Review Answers <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Section for top mistakes or performance insights */}
      {result.questionResults && result.questionResults.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className="font-medium mb-4">Areas for Improvement</h3>
            <div className="space-y-4">
              {getTopicPerformance(result.questionResults).map((topic) => (
                <div key={topic.name} className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{topic.name}</span>
                    <Badge 
                      variant={topic.score > 70 ? "success" : topic.score > 40 ? "warning" : "destructive"}
                      className={`px-2 py-1 ${
                        topic.score > 70 
                          ? "bg-green-100 text-green-800" 
                          : topic.score > 40 
                            ? "bg-yellow-100 text-yellow-800" 
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {topic.score.toFixed(0)}%
                    </Badge>
                  </div>
                  <Progress 
                    value={topic.score} 
                    className="h-2"
                    indicatorClassName={
                      topic.score > 70 
                        ? "bg-green-500" 
                        : topic.score > 40 
                          ? "bg-yellow-500" 
                          : "bg-red-500"
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      <div className="flex justify-center mt-6">
        <Button variant="outline" onClick={() => window.print()} className="flex items-center">
          <Printer className="h-4 w-4 mr-2" />
          Print Results
        </Button>
      </div>
    </div>
  );
};

// Helper function to analyze performance by topics
// This is a placeholder - in a real implementation, questions would have topics assigned
function getTopicPerformance(questionResults: QuestionResult[]): { name: string; score: number; }[] {
  // Mock implementation - in reality, this would analyze the question results
  return [
    { name: "Pharmacology", score: 75 },
    { name: "Clinical Practice", score: 45 },
    { name: "Pharmaceutical Calculations", score: 90 },
    { name: "Medicinal Chemistry", score: 30 },
  ];
}