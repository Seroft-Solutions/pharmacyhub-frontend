import React, { useMemo } from 'react';
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
  Award,
  Clock,
  BarChart,
  ArrowRight,
  Printer
} from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Question, ExamResult, QuestionResult, UserAnswer } from '../../model/standardTypes';
import { formatTimeVerbose } from '../../utils/formatTime';
import { useExamScoreCalculation } from './useExamScoreCalculation';
import { ScoreBreakdown } from './ScoreBreakdown';
import { StatisticsDisplay } from './StatisticsDisplay';
import { ScoreOverview } from './ScoreOverview';
import { QuestionFilter } from './QuestionFilter';
import { createQuestionStatusMap } from '../../types/QuestionStatus';
import { calculateExamStatistics } from '../../utils/examStatisticsCalculator';

interface ExamResultsProps {
  result: ExamResult;
  questions?: Question[];
  userAnswers?: Record<number, UserAnswer>;
  onReview?: () => void;
  onTryAgain?: () => void;
  onBackToDashboard?: () => void;
  onReturnToDashboard?: () => void; // For backward compatibility
  showPerformanceInsights?: boolean; // Option to hide performance insights
  onReviewQuestion?: (questionId: number) => void; // For reviewing specific questions
}

/**
 * Enhanced ExamResults component with improved statistics display and question filtering
 */
export const ExamResults: React.FC<ExamResultsProps> = ({
  result,
  questions,
  userAnswers,
  onReview,
  onTryAgain,
  onBackToDashboard,
  onReturnToDashboard,
  showPerformanceInsights = false,
  onReviewQuestion
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
  
  // Use the custom hook for consistent score calculation and formatting
  // Pass questions and userAnswers for accurate calculation
  const scoreInfo = useExamScoreCalculation(result, questions, userAnswers);
  
  // Calculate accurate statistics using the examStatisticsCalculator
  const calculatedStats = useMemo(() => {
    if (!questions || !userAnswers) {
      return {
        questionStatusMap: {},
        correctAnswers: result.correctAnswers,
        incorrectAnswers: result.incorrectAnswers,
        unanswered: result.unanswered,
        totalQuestions: result.totalQuestions
      };
    }
    
    // Use our fixed calculator to get accurate statistics
    const stats = calculateExamStatistics(questions, userAnswers);
    
    return {
      questionStatusMap: stats.questionStatusMap,
      correctAnswers: stats.correctAnswers,
      incorrectAnswers: stats.incorrectAnswers,
      unanswered: stats.unanswered,
      totalQuestions: stats.totalQuestions
    };
  }, [questions, userAnswers, result]);
  
  // Handler for question selection from the filter
  const handleSelectQuestion = (questionId: number) => {
    if (onReviewQuestion) {
      onReviewQuestion(questionId);
    } else if (onReview) {
      // If no specific handler, just go to review mode
      onReview();
    }
  };

  const formatTimeStr = (seconds: number) => {
    return formatTimeVerbose(seconds);
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
          {/* Score Overview Component */}
          <ScoreOverview 
            scoreInfo={scoreInfo}
            isPassed={result.isPassed}
            passingMarks={result.passingMarks}
            totalMarks={result.totalMarks}
          />
          
          <Separator />
          
          {/* Statistics Component with accurate statistics */}
          <StatisticsDisplay 
            correctAnswers={calculatedStats.correctAnswers}
            incorrectAnswers={calculatedStats.incorrectAnswers}
            unanswered={calculatedStats.unanswered}
            totalQuestions={calculatedStats.totalQuestions}
            questionStatusMap={calculatedStats.questionStatusMap}
          />
          
          {/* Score Breakdown Component with accurate statistics */}
          <ScoreBreakdown 
            correctAnswers={calculatedStats.correctAnswers}
            incorrectAnswers={calculatedStats.incorrectAnswers}
            unanswered={calculatedStats.unanswered}
            totalMarks={result.totalMarks}
            scoreInfo={scoreInfo}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
          
          {/* Question Filter Component - New addition for filtering questions by status */}
          {questions && userAnswers && questions.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm uppercase text-gray-500 mb-3">Question Review</h3>
              <QuestionFilter 
                questions={questions}
                questionStatusMap={calculatedStats.questionStatusMap}
                onSelectQuestion={handleSelectQuestion}
              />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row justify-between gap-4 bg-gray-50 px-6 py-4">
          <Button 
            variant="outline" 
            onClick={onBackToDashboard || onReturnToDashboard}
            className="w-full sm:w-auto"
          >
            Back to Dashboard
          </Button>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {onTryAgain && (
              <Button 
                variant="outline" 
                onClick={onTryAgain}
                className="w-full sm:w-auto"
              >
                Try Again
              </Button>
            )}
            
            {onReview && (
              <Button 
                onClick={onReview}
                className="w-full sm:w-auto"
              >
                Review Answers <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
      
      {/* Section for top mistakes or performance insights - only shown if explicitly requested */}
      {showPerformanceInsights && result.questionResults && result.questionResults.length > 0 && (
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
                  {/* Using a basic div for progress since we don't have access to the Progress component */}
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        topic.score > 70 
                          ? "bg-green-500" 
                          : topic.score > 40 
                            ? "bg-yellow-500" 
                            : "bg-red-500"
                      }`}
                      style={{ width: `${topic.score}%` }}
                    />
                  </div>
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
