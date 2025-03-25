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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  CheckCircle2,
  XCircle,
  Award,
  Clock,
  BarChart,
  Printer,
  AlertCircle,
  ChevronLeft,
  RefreshCw
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
  onReturnToDashboard?: () => void; // For backward compatibility
  showPerformanceInsights?: boolean; // Option to hide performance insights
  onReviewQuestion?: (questionId: number) => void; // For reviewing specific questions
}

/**
 * Compact exam results component with improved layout and space efficiency
 */
export const ExamResultsCompact: React.FC<ExamResultsProps> = ({
  result,
  questions,
  userAnswers,
  onTryAgain,
  onBackToDashboard,
  onReturnToDashboard,
}) => {
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
  