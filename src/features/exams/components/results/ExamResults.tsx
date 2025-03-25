import React, { useMemo, useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  CheckCircle2,
  XCircle,
  Award,
  Clock,
  BarChart,
  Printer,
  HelpCircle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Question, ExamResult, QuestionResult, UserAnswer } from '../../model/standardTypes';
import { formatTimeVerbose } from '../../utils/formatTime';
import { useExamScoreCalculation } from './useExamScoreCalculation';
import { QuestionDialog } from './QuestionDialog';
import { createQuestionStatusMap, QuestionStatus } from '../../types/QuestionStatus';
import { calculateExamStatistics } from '../../utils/examStatisticsCalculator';
import { create } from 'zustand';

// Define Zustand store for exam results state
interface ExamResultsState {
  selectedQuestionId: number | null;
  isDialogOpen: boolean;
  activeTab: string;
  isBreakdownExpanded: boolean;
  setSelectedQuestionId: (id: number | null) => void;
  setDialogOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  toggleBreakdown: () => void;
}

const useExamResultsStore = create<ExamResultsState>((set) => ({
  selectedQuestionId: null,
  isDialogOpen: false,
  activeTab: 'all',
  isBreakdownExpanded: false,
  setSelectedQuestionId: (id) => set({ selectedQuestionId: id }),
  setDialogOpen: (open) => set({ isDialogOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  toggleBreakdown: () => set((state) => ({ isBreakdownExpanded: !state.isBreakdownExpanded })),
}));

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
 * Exam results component with statistics and question filtering
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
  // Use Zustand store for state management
  const { 
    selectedQuestionId, 
    isDialogOpen, 
    activeTab,
    isBreakdownExpanded,
    setSelectedQuestionId, 
    setDialogOpen, 
    setActiveTab,
    toggleBreakdown
  } = useExamResultsStore();
  
  // Calculate exam statistics
  const stats = useMemo(() => {
    if (!questions || !userAnswers) {
      return {
        questionStatusMap: {},
        correctAnswers: result.correctAnswers || 0,
        incorrectAnswers: result.incorrectAnswers || 0,
        unanswered: result.unanswered || 0,
        totalQuestions: result.totalQuestions || 7 // Fallback to 7 questions as seen in UI
      };
    }
    
    return calculateExamStatistics(questions, userAnswers);
  }, [questions, userAnswers, result]);
  
  // Use exam score calculation hook
  const scoreInfo = useExamScoreCalculation(result, questions, userAnswers);
  
  // Get selected question for the dialog
  const selectedQuestion = useMemo(() => {
    if (!selectedQuestionId || !questions) return null;
    return questions.find(q => q.id === selectedQuestionId) || null;
  }, [selectedQuestionId, questions]);
  
  // Selected question status
  const selectedQuestionStatus = useMemo(() => {
    if (!selectedQuestionId || !stats.questionStatusMap) return QuestionStatus.UNANSWERED;
    return stats.questionStatusMap[selectedQuestionId] || QuestionStatus.UNANSWERED;
  }, [selectedQuestionId, stats.questionStatusMap]);
  
  // Handle selecting a question
  const handleSelectQuestion = (questionId: number) => {
    setSelectedQuestionId(questionId);
    setDialogOpen(true);
  };
  
  // Format time string
  const formatTimeStr = (seconds: number) => {
    return formatTimeVerbose(seconds);
  };
  
  // Filter questions based on active tab
  const filteredQuestions = useMemo(() => {
    if (!questions) return [];
    
    switch (activeTab) {
      case 'correct':
        return questions.filter(q => stats.questionStatusMap[q.id] === QuestionStatus.ANSWERED_CORRECT);
      case 'incorrect':
        return questions.filter(q => stats.questionStatusMap[q.id] === QuestionStatus.ANSWERED_INCORRECT);
      case 'unanswered':
        return questions.filter(q => stats.questionStatusMap[q.id] === QuestionStatus.UNANSWERED);
      default:
        return questions;
    }
  }, [questions, activeTab, stats.questionStatusMap]);
  
  // Calculate pass percentage
  const passPercentage = (result.passingMarks / result.totalMarks) * 100;
  
  return (
    <div className="max-w-3xl mx-auto px-2">
      <Card className="border shadow-sm">
        {/* Header with result title and pass/fail status */}
        <CardHeader className="pb-2 space-y-0">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              {result.isPassed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
              )}
              <CardTitle className="text-lg">{result.examTitle}</CardTitle>
            </div>
            <Badge 
              className={`${result.isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {result.isPassed ? 'Passed' : 'Not Passed'}
            </Badge>
          </div>
          <CardDescription className="text-sm">
            You {result.isPassed ? 'have met' : 'did not meet'} the passing criteria.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 pb-2">
          {/* Score and Progress Section */}
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-600">Your Score</div>
              <div className="text-sm text-gray-600">Passing: {result.passingMarks}</div>
            </div>
            
            <div className="flex items-baseline justify-between mb-2">
              <div className={`text-2xl font-bold ${result.isPassed ? 'text-green-600' : 'text-red-600'}`}>
                {Math.max(0, stats.correctAnswers - (stats.incorrectAnswers * 0.25))}
              </div>
              <div className="text-sm">
                marks
              </div>
            </div>
            
            <Progress
              value={(Math.max(0, stats.correctAnswers - (stats.incorrectAnswers * 0.25)) / stats.totalQuestions) * 100}
              className="h-2"
            />
          </div>
          
          {/* Statistics Section - Simple row with colored pills */}
          <div className="flex justify-between gap-2">
            <div className="flex-1 p-2 bg-green-50 rounded-lg text-center border border-green-100">
              <div className="text-lg font-semibold text-green-700">{stats.correctAnswers}</div>
              <div className="text-xs text-green-600">Correct</div>
            </div>
            <div className="flex-1 p-2 bg-red-50 rounded-lg text-center border border-red-100">
              <div className="text-lg font-semibold text-red-700">{stats.incorrectAnswers}</div>
              <div className="text-xs text-red-600">Incorrect</div>
            </div>
            <div className="flex-1 p-2 bg-amber-50 rounded-lg text-center border border-amber-100">
              <div className="text-lg font-semibold text-amber-700">{stats.unanswered}</div>
              <div className="text-xs text-amber-600">Unanswered</div>
            </div>
          </div>
          
          {/* Time and Breakdown Section */}
          <div className="grid grid-cols-3 gap-2">
            {/* Time Spent */}
            <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-blue-500 mr-1.5" />
                <div className="text-xs text-blue-600">Time Spent</div>
              </div>
              <div className="text-sm font-medium mt-1 truncate">{formatTimeStr(result.timeSpent)}</div>
            </div>
            
            {/* Score Details - First Column */}
            <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex items-center">
                <BarChart className="h-4 w-4 text-indigo-500 mr-1.5" />
                <div className="text-xs text-indigo-600">Correct</div>
              </div>
              <div className="text-xs space-y-1 mt-1">
                <div className="flex justify-between">
                  <span>Value:</span>
                  <span className="text-green-600">+{stats.correctAnswers}</span>
                </div>
              </div>
            </div>
            
            {/* Score Details - Second Column */}
            <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex items-center">
                <BarChart className="h-4 w-4 text-indigo-500 mr-1.5" />
                <div className="text-xs text-indigo-600">Negative</div>
              </div>
              <div className="text-xs space-y-1 mt-1">
                <div className="flex justify-between">
                  <span>Penalty:</span>
                  <span className="text-red-600">-{(stats.incorrectAnswers * 0.25).toFixed(1)}</span>
                </div>
              </div>
            </div>
            
            {/* Questions attempted */}
            <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex items-center">
                <BarChart className="h-4 w-4 text-indigo-500 mr-1.5" />
                <div className="text-xs text-indigo-600">Attempted</div>
              </div>
              <div className="text-xs space-y-1 mt-1">
                <div className="flex justify-between">
                  <span>Count:</span>
                  <span>{stats.correctAnswers + stats.incorrectAnswers}</span>
                </div>
              </div>
            </div>
            
            {/* Final Score */}
            <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
              <div className="flex items-center">
                <BarChart className="h-4 w-4 text-indigo-500 mr-1.5" />
                <div className="text-xs text-indigo-600">Final Score</div>
              </div>
              <div className="text-xs space-y-1 mt-1">
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>{Math.max(0, stats.correctAnswers - (stats.incorrectAnswers * 0.25))}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Question Review Section */}
          {questions && questions.length > 0 && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-medium">Question Review</div>
                <Badge variant="outline" className="h-5 px-2 font-normal">
                  {result.totalQuestions} questions
                </Badge>
              </div>
              
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 mb-2 h-8">
                  <TabsTrigger value="all" className="text-xs py-0">All</TabsTrigger>
                  <TabsTrigger value="correct" className="text-xs py-0">Correct</TabsTrigger>
                  <TabsTrigger value="incorrect" className="text-xs py-0">Incorrect</TabsTrigger>
                  <TabsTrigger value="unanswered" className="text-xs py-0">Unanswered</TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-0">
                  <div className="max-h-64 overflow-y-auto pr-1">
                    {filteredQuestions.length === 0 ? (
                      <div className="text-center py-4 text-sm text-gray-500">
                        No questions in this category
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        {filteredQuestions.map(question => (
                          <QuestionItem 
                            key={question.id}
                            question={question}
                            status={stats.questionStatusMap[question.id] || QuestionStatus.UNANSWERED}
                            onClick={() => handleSelectQuestion(question.id)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          {/* Question Dialog */}
          <QuestionDialog 
            open={isDialogOpen}
            onOpenChange={setDialogOpen}
            question={selectedQuestion}
            status={selectedQuestionStatus}
            userAnswer={userAnswers?.[selectedQuestionId || 0]}
          />
        </CardContent>
        
        <CardFooter className="flex justify-between pt-3 pb-3 border-t">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onBackToDashboard || onReturnToDashboard}
          >
            Back to Dashboard
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.print()}
              className="flex items-center gap-1.5"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Print</span>
            </Button>
            
            {onTryAgain && (
              <Button 
                size="sm"
                onClick={onTryAgain}
              >
                Try Again
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

// Question item component
interface QuestionItemProps {
  question: Question;
  status: QuestionStatus;
  onClick: () => void;
}

const QuestionItem: React.FC<QuestionItemProps> = ({
  question,
  status,
  onClick
}) => {
  const getStatusColor = () => {
    switch (status) {
      case QuestionStatus.ANSWERED_CORRECT:
        return "bg-green-50 border-green-200 hover:bg-green-100";
      case QuestionStatus.ANSWERED_INCORRECT:
        return "bg-red-50 border-red-200 hover:bg-red-100";
      case QuestionStatus.UNANSWERED:
        return "bg-amber-50 border-amber-200 hover:bg-amber-100";
      default:
        return "bg-gray-50 border-gray-200 hover:bg-gray-100";
    }
  };
  
  const getStatusIcon = () => {
    switch (status) {
      case QuestionStatus.ANSWERED_CORRECT:
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case QuestionStatus.ANSWERED_INCORRECT:
        return <XCircle className="h-4 w-4 text-red-600" />;
      case QuestionStatus.UNANSWERED:
        return <AlertCircle className="h-4 w-4 text-amber-600" />;
      default:
        return <HelpCircle className="h-4 w-4 text-gray-600" />;
    }
  };
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full p-2 rounded-md border text-left text-sm transition-colors ${getStatusColor()}`}
    >
      <div className="mr-2 bg-white h-6 w-6 rounded-full flex items-center justify-center text-xs border">
        {question.questionNumber}
      </div>
      <div className="flex-1 truncate text-xs mr-1.5">
        {question.text.length > 30 ? question.text.substring(0, 30) + "..." : question.text}
      </div>
      {getStatusIcon()}
    </button>
  );
};
