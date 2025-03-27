"use client"
import React, { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Printer,
  AlertCircle,
  ChevronLeft,
  RefreshCw,
  Award,
  Target,
  CheckSquare,
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Question, ExamResult, UserAnswer } from '../../model/standardTypes';
import { formatTimeVerbose } from '../../utils/formatTime';
import { useExamScoreCalculation } from './useExamScoreCalculation';
import { QuestionDialog } from './QuestionDialog';
import { QuestionStatus } from '../../types/QuestionStatus';
import { calculateExamStatistics } from '../../utils/examStatisticsCalculator';
import { create } from 'zustand';
import { motion } from 'framer-motion';

// Define Zustand store for exam results state
interface ExamResultsState {
  selectedQuestionId: number | null;
  isDialogOpen: boolean;
  activeTab: string;
  setSelectedQuestionId: (id: number | null) => void;
  setDialogOpen: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
}

const useExamResultsStore = create<ExamResultsState>((set) => ({
  selectedQuestionId: null,
  isDialogOpen: false,
  activeTab: 'all',
  setSelectedQuestionId: (id) => set({ selectedQuestionId: id }),
  setDialogOpen: (open) => set({ isDialogOpen: open }),
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

interface ExamResultsProps {
  result: ExamResult;
  questions?: Question[];
  userAnswers?: Record<number, UserAnswer>;
  onReview?: () => void;
  onTryAgain?: () => void;
  onBackToDashboard?: () => void;
  onReturnToDashboard?: () => void;
  showPerformanceInsights?: boolean;
  onReviewQuestion?: (questionId: number) => void;
}

/**
 * Enhanced exam results component with modern UI and animations
 */
export const ExamResults: React.FC<ExamResultsProps> = ({
  result,
  questions,
  userAnswers,
  onTryAgain,
  onBackToDashboard,
  onReturnToDashboard
}) => {
  // Track active animations
  const [scoreAnimated, setScoreAnimated] = useState(false);
  
  // Use Zustand store for state management
  const { 
    selectedQuestionId, 
    isDialogOpen, 
    activeTab,
    setSelectedQuestionId, 
    setDialogOpen, 
    setActiveTab
  } = useExamResultsStore();
  
  // Calculate exam statistics
  const stats = useMemo(() => {
    if (!questions || !userAnswers) {
      return {
        questionStatusMap: {},
        correctAnswers: result.correctAnswers || 0,
        incorrectAnswers: result.incorrectAnswers || 0,
        unanswered: result.unanswered || 0,
        totalQuestions: result.totalQuestions || 7
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

  // Calculate final score
  const finalScore = Math.max(0, stats.correctAnswers - (stats.incorrectAnswers * 0.25));

  // After component mounts, animate the score
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setScoreAnimated(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Get result status badge style
  const getStatusBadgeStyle = () => {
    return result.isPassed 
      ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800" 
      : "bg-gradient-to-r from-red-100 to-red-200 text-red-800";
  };
  
  return (
    <div className="max-w-3xl mx-auto">
      <Card className="border shadow-md overflow-hidden">
        {/* Paper Header - With Gradient Background */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {result.isPassed ? (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mr-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center mr-3">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
              )}
              <div>
                <h2 className="text-lg font-medium">{result.examTitle}</h2>
                <p className="text-sm text-gray-600">You did not meet the passing criteria.</p>
              </div>
            </div>
            <Badge className={`ml-2 py-1 px-3 ${getStatusBadgeStyle()}`}>
              {result.isPassed ? 'Passed' : 'Not Passed'}
            </Badge>
          </div>
        </div>
        
        <CardContent className="p-0">
          {/* Score and Passing Mark - With Animation */}
          <div className="grid grid-cols-2 p-4 bg-gradient-to-r from-slate-50 to-blue-50">
            <div>
              <p className="text-sm text-gray-600 mb-1">Your Score</p>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`text-3xl font-bold ${result.isPassed ? 'text-green-600' : 'text-red-600'}`}
              >
                {finalScore}
              </motion.div>
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: scoreAnimated ? `${(finalScore / result.totalMarks) * 100}%` : "0%" }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                className="h-2 bg-blue-500 rounded-full mt-2"
                style={{ maxWidth: "120px" }}
              />
            </div>
            <div className="text-right">
              <div className="flex items-center justify-end mb-1">
                <Target className="h-4 w-4 text-blue-500 mr-1.5" />
                <p className="text-sm text-gray-600">Passing: <span className="font-medium">{result.passingMarks} marks</span></p>
              </div>
            </div>
          </div>
          
          {/* Score Details - 2 Column Grid */}
          <div className="grid grid-cols-2 gap-3 p-4 pt-0">
            <div className="flex items-center p-2 bg-white rounded-lg border border-blue-100 shadow-sm hover:bg-blue-50 transition-colors">
              <Clock className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm text-gray-600">Time:</span>
              <span className="ml-auto text-sm font-medium">{formatTimeVerbose(result.timeSpent)}</span>
            </div>
            <div className="flex items-center p-2 bg-white rounded-lg border border-green-100 shadow-sm hover:bg-green-50 transition-colors">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-sm text-gray-600">Correct:</span>
              <span className="ml-auto text-sm font-medium text-green-600">+{stats.correctAnswers}</span>
            </div>
            <div className="flex items-center p-2 bg-white rounded-lg border border-blue-100 shadow-sm hover:bg-blue-50 transition-colors">
              <CheckSquare className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-sm text-gray-600">Attempted:</span>
              <span className="ml-auto text-sm font-medium">{Object.keys(userAnswers || {}).length}</span>
            </div>
            <div className="flex items-center p-2 bg-white rounded-lg border border-red-100 shadow-sm hover:bg-red-50 transition-colors">
              <XCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-sm text-gray-600">Penalty:</span>
              <span className="ml-auto text-sm font-medium text-red-600">-{(stats.incorrectAnswers * 0.25).toFixed(1)}</span>
            </div>
          </div>
          
          {/* Statistics Section - Animated Cards */}
          <div className="grid grid-cols-3 gap-3 p-4 pt-0">
            <motion.div 
              whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
              className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200 text-center"
            >
              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white mb-1">
                <span className="text-green-700 font-medium">{stats.correctAnswers}</span>
              </div>
              <p className="text-xs text-green-700">Correct</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
              className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg border border-red-200 text-center"
            >
              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white mb-1">
                <span className="text-red-700 font-medium">{stats.incorrectAnswers}</span>
              </div>
              <p className="text-xs text-red-700">Incorrect</p>
            </motion.div>
            <motion.div 
              whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
              className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-lg border border-amber-200 text-center"
            >
              <div className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white mb-1">
                <span className="text-amber-700 font-medium">{stats.unanswered}</span>
              </div>
              <p className="text-xs text-amber-700">Unanswered</p>
            </motion.div>
          </div>
          
          {/* Question Review Section - Enhanced Tabs */}
          {questions && questions.length > 0 && (
            <div className="p-4 pt-0">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <BarChart3 className="h-4 w-4 text-blue-500 mr-1.5" />
                  <h3 className="text-sm font-medium">Question Review</h3>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {result.totalQuestions} questions
                </Badge>
              </div>
              
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mt-2">
                <TabsList className="grid grid-cols-4 h-9 bg-slate-100 p-1 rounded-lg">
                  <TabsTrigger 
                    value="all" 
                    className="text-xs rounded data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="correct" 
                    className="text-xs rounded data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm"
                  >
                    Correct
                  </TabsTrigger>
                  <TabsTrigger 
                    value="incorrect" 
                    className="text-xs rounded data-[state=active]:bg-white data-[state=active]:text-red-700 data-[state=active]:shadow-sm"
                  >
                    Incorrect
                  </TabsTrigger>
                  <TabsTrigger 
                    value="unanswered" 
                    className="text-xs rounded data-[state=active]:bg-white data-[state=active]:text-amber-700 data-[state=active]:shadow-sm"
                  >
                    Unanswered
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value={activeTab} className="mt-2">
                  <div className="max-h-[280px] overflow-y-auto rounded-lg border border-slate-100 divide-y divide-slate-100">
                    {filteredQuestions.length === 0 ? (
                      <div className="text-center py-6 text-sm text-gray-500">
                        No questions in this category
                      </div>
                    ) : (
                      filteredQuestions.map((question) => (
                        <QuestionItemEnhanced 
                          key={question.id}
                          question={question}
                          status={stats.questionStatusMap[question.id] || QuestionStatus.UNANSWERED}
                          onClick={() => handleSelectQuestion(question.id)}
                        />
                      ))
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
        
        <CardFooter className="flex justify-between p-4 border-t bg-gradient-to-r from-slate-50 to-blue-50">
          <Button 
            variant="outline" 
            onClick={onBackToDashboard || onReturnToDashboard}
            className="bg-white hover:bg-blue-50 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Button>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 bg-white hover:bg-blue-50 transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>Print</span>
            </Button>
            
            {onTryAgain && (
              <Button 
                onClick={onTryAgain}
                className="bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-1.5" /> Try Again
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

// Enhanced question item component with better visuals
interface QuestionItemProps {
  question: Question;
  status: QuestionStatus;
  onClick: () => void;
}

const QuestionItemEnhanced: React.FC<QuestionItemProps> = ({
  question,
  status,
  onClick
}) => {
  const getLeftBorderColor = () => {
    switch (status) {
      case QuestionStatus.ANSWERED_CORRECT:
        return "border-l-4 border-l-green-500";
      case QuestionStatus.ANSWERED_INCORRECT:
        return "border-l-4 border-l-red-500";
      case QuestionStatus.UNANSWERED:
        return "border-l-4 border-l-amber-500";
      default:
        return "border-l-4 border-l-gray-300";
    }
  };
  
  const getStatusIcon = () => {
    switch (status) {
      case QuestionStatus.ANSWERED_CORRECT:
        return (
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </div>
        );
      case QuestionStatus.ANSWERED_INCORRECT:
        return (
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="h-4 w-4 text-red-600" />
          </div>
        );
      case QuestionStatus.UNANSWERED:
        return (
          <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center">
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </div>
        );
      default:
        return null;
    }
  };
  
  return (
    <motion.button
      whileHover={{ backgroundColor: "#f9fafb" }}
      onClick={onClick}
      className={`flex items-center w-full p-3 text-left ${getLeftBorderColor()}`}
    >
      <div className="w-6 h-6 flex items-center justify-center mr-3 text-sm font-medium rounded-full bg-slate-100">
        {question.questionNumber}
      </div>
      <div className="flex-1 text-sm mr-2 line-clamp-1">
        {question.text}
      </div>
      {getStatusIcon()}
    </motion.button>
  );
};
