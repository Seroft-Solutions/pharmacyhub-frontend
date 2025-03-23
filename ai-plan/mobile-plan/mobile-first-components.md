# PharmacyHub Exams Feature - Mobile-First Component Examples

This document provides examples of how to implement mobile-first components for the PharmacyHub Exams feature. These examples follow a feature-based architecture and focus on small, maintainable components that leverage the existing infrastructure.

## 1. Responsive Exam Container

```tsx
// src/features/exams/components/layout/ResponsiveExamContainer.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { NetworkStatusIndicator } from '../common/NetworkStatusIndicator';

interface ResponsiveExamContainerProps {
  header: React.ReactNode;
  content: React.ReactNode;
  navigation?: React.ReactNode;
  bottomNavigation?: React.ReactNode;
  className?: string;
}

export function ResponsiveExamContainer({
  header,
  content,
  navigation,
  bottomNavigation,
  className
}: ResponsiveExamContainerProps) {
  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      className
    )}>
      {/* Header - fixed at top on mobile, static on desktop */}
      <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
        <div className="p-4">
          {header}
        </div>
      </header>
      
      {/* Main content area - flexible layout based on screen size */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Main content - full width on mobile, partial on desktop */}
        <main className="flex-1 p-4 pb-20 md:pb-4 overflow-y-auto">
          {content}
        </main>
        
        {/* Side navigation - hidden on mobile, visible on desktop */}
        {navigation && (
          <aside className="hidden md:block md:w-64 lg:w-80 border-l bg-gray-50 p-4 overflow-y-auto">
            {navigation}
          </aside>
        )}
      </div>
      
      {/* Bottom navigation - visible on mobile only */}
      {bottomNavigation && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          {bottomNavigation}
        </div>
      )}
      
      {/* Network status indicator - fixed position */}
      <div className="fixed top-4 right-4 z-20">
        <NetworkStatusIndicator />
      </div>
    </div>
  );
}
```

## 2. Touch-Friendly Question Card

```tsx
// src/features/exams/components/quiz/TouchFriendlyQuestionCard.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { FlagIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface TouchFriendlyQuestionCardProps {
  question: {
    id: number;
    text: string;
    options: Array<{
      id: number;
      text: string;
    }>;
    explanation?: string;
  };
  questionNumber: number;
  totalQuestions: number;
  selectedOption?: number;
  isFlagged?: boolean;
  showExplanation?: boolean;
  onSelectOption: (optionId: number) => void;
  onToggleFlag: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  className?: string;
}

export function TouchFriendlyQuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOption,
  isFlagged = false,
  showExplanation = false,
  onSelectOption,
  onToggleFlag,
  onNext,
  onPrevious,
  className
}: TouchFriendlyQuestionCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-2 flex flex-row justify-between items-start">
        <div>
          <div className="text-sm text-gray-500">
            Question {questionNumber} of {totalQuestions}
          </div>
          <CardTitle className="text-base sm:text-lg md:text-xl mt-1">
            {question.text}
          </CardTitle>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "ml-4 h-10 w-10 rounded-full p-0 flex-shrink-0",
            isFlagged && "bg-amber-50 text-amber-600"
          )}
          onClick={onToggleFlag}
          aria-label={isFlagged ? "Unflag question" : "Flag question"}
        >
          <FlagIcon 
            className={cn(
              "h-5 w-5",
              isFlagged && "fill-amber-200 text-amber-600"
            )} 
          />
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2 mt-2">
          {question.options.map((option) => (
            <button
              key={option.id}
              className={cn(
                "w-full text-left p-4 rounded-lg border transition-all",
                selectedOption === option.id
                  ? "bg-blue-50 border-blue-300 shadow-sm"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              )}
              onClick={() => onSelectOption(option.id)}
            >
              <div className="min-h-[44px] flex items-center">
                <div className={cn(
                  "flex-shrink-0 h-6 w-6 mr-3 rounded-full border flex items-center justify-center",
                  selectedOption === option.id
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-gray-300"
                )}>
                  {selectedOption === option.id && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <div>{option.text}</div>
              </div>
            </button>
          ))}
        </div>
        
        {showExplanation && question.explanation && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <h4 className="font-medium text-blue-700 mb-1">Explanation:</h4>
            <p className="text-blue-700">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2 pb-4">
        <Button
          variant="outline"
          size="sm"
          className="h-10 px-4"
          onClick={onPrevious}
          disabled={!onPrevious || questionNumber <= 1}
        >
          <ChevronLeftIcon className="mr-1 h-4 w-4" />
          Previous
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="h-10 px-4"
          onClick={onNext}
          disabled={!onNext || questionNumber >= totalQuestions}
        >
          Next
          <ChevronRightIcon className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
```

## 3. Mobile Bottom Navigation

```tsx
// src/features/exams/components/navigation/MobileExamNavigation.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  FlagIcon, 
  ListIcon,
  CheckIcon
} from 'lucide-react';

interface MobileExamNavigationProps {
  currentQuestion: number;
  totalQuestions: number;
  isFlagged: boolean;
  isLastQuestion: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToggleFlag: () => void;
  onOpenNavigator: () => void;
  onSubmit: () => void;
  className?: string;
}

export function MobileExamNavigation({
  currentQuestion,
  totalQuestions,
  isFlagged,
  isLastQuestion,
  onPrevious,
  onNext,
  onToggleFlag,
  onOpenNavigator,
  onSubmit,
  className
}: MobileExamNavigationProps) {
  return (
    <div className={cn(
      "h-16 px-2 flex items-center justify-between gap-1",
      className
    )}>
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 rounded-full"
        onClick={onPrevious}
        disabled={currentQuestion <= 1}
        aria-label="Previous question"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        className="h-10 flex items-center gap-1"
        onClick={onOpenNavigator}
        aria-label="Open question navigator"
      >
        <span className="font-medium">
          {currentQuestion} / {totalQuestions}
        </span>
        <ListIcon className="h-4 w-4 ml-1" />
      </Button>
      
      <Button
        variant={isFlagged ? "secondary" : "ghost"}
        size="icon"
        className={cn(
          "h-12 w-12 rounded-full",
          isFlagged && "bg-amber-50 text-amber-600 border border-amber-200"
        )}
        onClick={onToggleFlag}
        aria-label={isFlagged ? "Unflag question" : "Flag question"}
      >
        <FlagIcon 
          className={cn(
            "h-5 w-5",
            isFlagged && "fill-amber-200 text-amber-600"
          )} 
        />
      </Button>
      
      {isLastQuestion ? (
        <Button
          variant="default"
          className="h-12 rounded-full px-5 bg-green-600 hover:bg-green-700"
          onClick={onSubmit}
          aria-label="Submit exam"
        >
          <CheckIcon className="h-5 w-5 mr-1" />
          <span>Finish</span>
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-full"
          onClick={onNext}
          aria-label="Next question"
        >
          <ChevronRightIcon className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
```

## 4. Question Navigator Sheet

```tsx
// src/features/exams/components/navigation/QuestionNavigatorSheet.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter
} from '@/components/ui/sheet';
import { CheckCircleIcon, FlagIcon, HelpCircleIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuestionNavigatorSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: Set<number>;
  flaggedQuestions: Set<number>;
  onNavigate: (questionNumber: number) => void;
  onSubmit: () => void;
  className?: string;
}

export function QuestionNavigatorSheet({
  isOpen,
  onClose,
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  flaggedQuestions,
  onNavigate,
  onSubmit,
  className
}: QuestionNavigatorSheetProps) {
  // Calculate completion statistics
  const answeredCount = answeredQuestions.size;
  const flaggedCount = flaggedQuestions.size;
  const unansweredCount = totalQuestions - answeredCount;
  const completionPercentage = (answeredCount / totalQuestions) * 100;
  
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="bottom" className={cn("h-[80vh] sm:h-[70vh] p-0", className)}>
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Question Navigator</SheetTitle>
        </SheetHeader>
        
        <div className="p-4">
          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="flex flex-col items-center justify-center p-2 bg-green-50 border border-green-100 rounded-lg">
              <div className="flex items-center gap-1">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span className="text-green-700 font-medium">{answeredCount}</span>
              </div>
              <div className="text-xs text-green-600">Answered</div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-2 bg-amber-50 border border-amber-100 rounded-lg">
              <div className="flex items-center gap-1">
                <FlagIcon className="h-4 w-4 text-amber-500" />
                <span className="text-amber-700 font-medium">{flaggedCount}</span>
              </div>
              <div className="text-xs text-amber-600">Flagged</div>
            </div>
            
            <div className="flex flex-col items-center justify-center p-2 bg-gray-50 border border-gray-100 rounded-lg">
              <div className="flex items-center gap-1">
                <HelpCircleIcon className="h-4 w-4 text-gray-500" />
                <span className="text-gray-700 font-medium">{unansweredCount}</span>
              </div>
              <div className="text-xs text-gray-600">Unanswered</div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mb-4">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
            <div className="mt-1 text-xs text-gray-500 text-right">
              {completionPercentage.toFixed(0)}% Complete
            </div>
          </div>
        </div>
        
        {/* Question grid */}
        <ScrollArea className="p-4 h-[calc(80vh-220px)] sm:h-[calc(70vh-220px)]">
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 gap-2">
            {Array.from({ length: totalQuestions }).map((_, index) => {
              const questionNumber = index + 1;
              const isAnswered = answeredQuestions.has(questionNumber);
              const isFlagged = flaggedQuestions.has(questionNumber);
              const isCurrent = currentQuestion === questionNumber;
              
              return (
                <Button
                  key={index}
                  variant={isCurrent ? "default" : "outline"}
                  className={cn(
                    "h-12 w-full p-0 relative",
                    isAnswered && "border-green-300 bg-green-50 text-green-700",
                    isFlagged && !isAnswered && "border-amber-300 bg-amber-50 text-amber-700",
                    isAnswered && isFlagged && "border-amber-400 bg-green-50 text-green-700",
                    isCurrent && !isAnswered && !isFlagged && "bg-blue-600 text-white",
                    isCurrent && isAnswered && "bg-green-600 text-white border-green-600",
                    isCurrent && isFlagged && !isAnswered && "bg-amber-600 text-white border-amber-600",
                    isCurrent && isAnswered && isFlagged && "bg-green-600 text-white border-amber-400"
                  )}
                  onClick={() => {
                    onNavigate(questionNumber);
                    onClose();
                  }}
                >
                  {questionNumber}
                  
                  {/* Status indicators */}
                  {!isCurrent && (
                    <>
                      {isAnswered && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full"></span>
                      )}
                      {isFlagged && (
                        <span className={cn(
                          "absolute -bottom-1 -right-1 w-3 h-3 rounded-full",
                          isAnswered ? "bg-amber-500" : "bg-amber-500"
                        )}></span>
                      )}
                    </>
                  )}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
        
        <SheetFooter className="p-4 border-t">
          <Button 
            className="w-full"
            onClick={() => {
              onSubmit();
              onClose();
            }}
          >
            Finish Exam
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
```

## 5. Compact Exam Timer

```tsx
// src/features/exams/components/common/CompactExamTimer.tsx
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Clock, MinusCircle, PauseCircle, PlayCircle } from 'lucide-react';

interface CompactExamTimerProps {
  totalTimeInSeconds: number;
  onTimeUp: () => void;
  isCompleted?: boolean;
  isPaused?: boolean;
  onPause?: () => void;
  onResume?: () => void;
  className?: string;
}

export function CompactExamTimer({
  totalTimeInSeconds,
  onTimeUp,
  isCompleted = false,
  isPaused = false,
  onPause,
  onResume,
  className
}: CompactExamTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(totalTimeInSeconds);
  const [isMinimized, setIsMinimized] = useState(false);
  
  // Calculate time values
  const hours = Math.floor(timeRemaining / 3600);
  const minutes = Math.floor((timeRemaining % 3600) / 60);
  const seconds = timeRemaining % 60;
  
  // Format time display
  const timeDisplay = `${hours > 0 ? `${hours}:` : ''}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  
  // Timer state (color coding)
  const timerState = 
    timeRemaining === 0 ? 'expired' :
    timeRemaining < totalTimeInSeconds * 0.1 ? 'critical' :
    timeRemaining < totalTimeInSeconds * 0.25 ? 'warning' :
    'normal';
  
  // Setup timer effect
  useEffect(() => {
    if (isCompleted || isPaused || timeRemaining <= 0) return;
    
    const timerId = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timerId);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [timeRemaining, isCompleted, isPaused, onTimeUp]);
  
  // Minimized view
  if (isMinimized) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "p-2 h-8 flex items-center gap-1",
          timerState === 'critical' && "border-red-300 bg-red-50 text-red-700",
          timerState === 'warning' && "border-amber-300 bg-amber-50 text-amber-700",
          timerState === 'normal' && "border-blue-300 bg-blue-50 text-blue-700",
          className
        )}
        onClick={() => setIsMinimized(false)}
      >
        <Clock className="h-3 w-3" />
        <span className="text-xs font-mono">{timeDisplay}</span>
      </Button>
    );
  }
  
  // Full view
  return (
    <div className={cn(
      "flex items-center justify-between px-3 py-2 rounded-lg",
      timerState === 'critical' && "border border-red-300 bg-red-50 text-red-700",
      timerState === 'warning' && "border border-amber-300 bg-amber-50 text-amber-700",
      timerState === 'normal' && "border border-blue-200 bg-blue-50 text-blue-700",
      className
    )}>
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span className="font-mono font-medium">
          {timeDisplay}
        </span>
      </div>
      
      <div className="flex gap-1">
        {onPause && onResume && (
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={isPaused ? onResume : onPause}
          >
            {isPaused ? (
              <PlayCircle className="h-4 w-4" />
            ) : (
              <PauseCircle className="h-4 w-4" />
            )}
          </Button>
        )}
        
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={() => setIsMinimized(true)}
        >
          <MinusCircle className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
```

## 6. Mobile Exam Results

```tsx
// src/features/exams/components/results/MobileExamResults.tsx
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer 
} from 'recharts';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  RotateCcwIcon, 
  HomeIcon, 
  ClipboardListIcon 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface MobileExamResultsProps {
  result: {
    examId: number;
    examTitle: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    unanswered: number;
    timeSpent: number;
    isPassed: boolean;
  };
  onReview: () => void;
  onRetry: () => void;
  onDashboard: () => void;
  className?: string;
}

export function MobileExamResults({
  result,
  onReview,
  onRetry,
  onDashboard,
  className
}: MobileExamResultsProps) {
  // Format time spent
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    return `${hours > 0 ? `${hours}h ` : ''}${minutes}m ${remainingSeconds}s`;
  };
  
  // Chart data
  const chartData = [
    { name: 'Correct', value: result.correctAnswers, color: '#22c55e' },
    { name: 'Incorrect', value: result.incorrectAnswers, color: '#ef4444' },
    { name: 'Unanswered', value: result.unanswered, color: '#94a3b8' }
  ];
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{result.examTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-3xl font-bold">
                {result.score}%
              </div>
              <div className={cn(
                "text-sm font-medium",
                result.isPassed ? "text-green-600" : "text-red-600"
              )}>
                {result.isPassed ? 'PASSED' : 'FAILED'}
              </div>
            </div>
            
            <div className={cn(
              "h-16 w-16 rounded-full flex items-center justify-center text-white",
              result.isPassed ? "bg-green-500" : "bg-red-500"
            )}>
              {result.isPassed ? (
                <CheckCircleIcon className="h-8 w-8" />
              ) : (
                <XCircleIcon className="h-8 w-8" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabbed content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>
        
        {/* Overview tab */}
        <TabsContent value="overview" className="p-0 border-0">
          <Card>
            <CardContent className="p-4">
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-2">
                {chartData.map((entry) => (
                  <div
                    key={entry.name}
                    className="flex flex-col items-center p-2 rounded-lg text-center"
                    style={{ 
                      backgroundColor: `${entry.color}15`,
                      borderColor: entry.color,
                      color: entry.color
                    }}
                  >
                    <div className="font-medium text-sm">{entry.name}</div>
                    <div className="text-lg font-bold">{entry.value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Stats tab */}
        <TabsContent value="stats" className="p-0 border-0">
          <Card>
            <CardContent className="p-4">
              <ul className="space-y-2">
                <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Total Questions</span>
                  <span className="font-medium">{result.totalQuestions}</span>
                </li>
                
                <li className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600">Correct Answers</span>
                  <span className="font-medium text-green-700">{result.correctAnswers}</span>
                </li>
                
                <li className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-red-600">Incorrect Answers</span>
                  <span className="font-medium text-red-700">{result.incorrectAnswers}</span>
                </li>
                
                <li className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Unanswered</span>
                  <span className="font-medium">{result.unanswered}</span>
                </li>
                
                <li className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600">Time Spent</span>
                  <span className="font-medium text-blue-700">{formatTime(result.timeSpent)}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Actions */}
      <div className="grid grid-cols-3 gap-2">
        <Button 
          variant="outline"
          className="flex flex-col items-center justify-center h-16 p-1"
          onClick={onDashboard}
        >
          <HomeIcon className="h-5 w-5 mb-1" />
          <span className="text-xs">Dashboard</span>
        </Button>
        
        <Button 
          variant="outline"
          className="flex flex-col items-center justify-center h-16 p-1"
          onClick={onReview}
        >
          <ClipboardListIcon className="h-5 w-5 mb-1" />
          <span className="text-xs">Review</span>
        </Button>
        
        <Button 
          variant="outline"
          className="flex flex-col items-center justify-center h-16 p-1"
          onClick={onRetry}
        >
          <RotateCcwIcon className="h-5 w-5 mb-1" />
          <span className="text-xs">Try Again</span>
        </Button>
      </div>
    </div>
  );
}
```

## 7. Mobile Exam Page

```tsx
// src/features/exams/pages/ExamPage.tsx
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useExamSession } from '../hooks/useExamSession';
import { ResponsiveExamContainer } from '../components/layout/ResponsiveExamContainer';
import { TouchFriendlyQuestionCard } from '../components/quiz/TouchFriendlyQuestionCard';
import { MobileExamNavigation } from '../components/navigation/MobileExamNavigation';
import { QuestionNavigatorSheet } from '../components/navigation/QuestionNavigatorSheet';
import { CompactExamTimer } from '../components/common/CompactExamTimer';
import { MobileExamResults } from '../components/results/MobileExamResults';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Spinner } from '@/components/ui/spinner';

export default function ExamPage() {
  const { examId } = useParams() as { examId: string };
  const [navSheetOpen, setNavSheetOpen] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  
  // Use the exam session hook
  const {
    exam,
    questions,
    currentQuestionIndex,
    answers,
    flaggedQuestions,
    timeRemaining,
    isCompleted,
    showSummary,
    isOnline,
    
    isLoading,
    error,
    isStarting,
    
    startExam,
    answerQuestion,
    toggleFlagQuestion,
    navigateToQuestion,
    nextQuestion,
    previousQuestion,
    toggleSummary,
    submitExam,
    
    hasAnswer,
    isFlagged,
    getAnsweredQuestionsCount
  } = useExamSession(parseInt(examId));
  
  // Check if exam is not started yet
  const isExamNotStarted = !isLoading && !error && !isStarting && !questions.length;
  
  // Loading state
  if (isLoading || isStarting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Spinner className="w-12 h-12 mb-4" />
          <p className="text-lg">Loading exam...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-center">
          <h2 className="text-lg font-medium mb-2">Error</h2>
          <p>{error.message || 'An error occurred while loading the exam'}</p>
          <Button 
            variant="secondary"
            className="mt-4"
            onClick={() => window.location.href = '/dashboard'}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  // Start exam screen
  if (isExamNotStarted) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <h1 className="text-xl font-bold text-blue-800">
              {exam?.title || 'Exam'}
            </h1>
            {exam?.description && (
              <p className="mt-1 text-blue-700">{exam.description}</p>
            )}
          </div>
          
          <div className="p-4">
            <h2 className="text-lg font-medium mb-4">Exam Information</h2>
            
            <ul className="space-y-2 mb-6">
              <li className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{exam?.duration || 0} minutes</span>
              </li>
              <li className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">Questions:</span>
                <span className="font-medium">{exam?.questionCount || 0}</span>
              </li>
              <li className="flex justify-between p-2 bg-gray-50 rounded">
                <span className="text-gray-600">Passing Score:</span>
                <span className="font-medium">{exam?.passingMarks || 0} / {exam?.totalMarks || 0}</span>
              </li>
            </ul>
            
            <Button
              className="w-full h-12"
              onClick={() => startExam({ userId: 'current-user-id' })}
            >
              Start Exam
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Show results if completed
  if (isCompleted) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <MobileExamResults
          result={{
            examId: parseInt(examId),
            examTitle: exam?.title || 'Exam',
            score: Math.round((getAnsweredQuestionsCount() / questions.length) * 100),
            totalQuestions: questions.length,
            correctAnswers: getAnsweredQuestionsCount(), // Placeholder, would come from API
            incorrectAnswers: questions.length - getAnsweredQuestionsCount(), // Placeholder
            unanswered: questions.length - getAnsweredQuestionsCount(),
            timeSpent: (exam?.duration || 60) * 60 - timeRemaining,
            isPassed: true // Placeholder, would be calculated based on score
          }}
          onReview={() => toggleSummary()}
          onRetry={() => window.location.reload()}
          onDashboard={() => window.location.href = '/dashboard'}
        />
      </div>
    );
  }
  
  // Current question data
  const currentQuestion = questions[currentQuestionIndex];
  
  // Show summary view
  if (showSummary) {
    // Placeholder for summary view
    return (
      <div className="p-4">
        <h1 className="text-xl font-medium mb-4">Exam Summary</h1>
        <p>Summary content would go here...</p>
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button className="w-full" onClick={() => setShowSubmitDialog(true)}>
            Submit Exam
          </Button>
        </div>
        
        {/* Submit confirmation dialog */}
        <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
              <AlertDialogDescription>
                You have answered {getAnsweredQuestionsCount()} out of {questions.length} questions.
                Are you sure you want to submit?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => {
                  submitExam();
                  setShowSubmitDialog(false);
                }}
              >
                Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }
  
  // Main exam taking view
  return (
    <ResponsiveExamContainer
      header={
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-medium truncate">
            {exam?.title || 'Exam'}
          </h1>
          <CompactExamTimer
            totalTimeInSeconds={timeRemaining}
            onTimeUp={() => submitExam()}
            isCompleted={isCompleted}
          />
        </div>
      }
      content={
        currentQuestion ? (
          <TouchFriendlyQuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            selectedOption={answers[currentQuestion.id]}
            isFlagged={isFlagged(currentQuestion.id)}
            onSelectOption={(optionId) => answerQuestion(currentQuestion.id, optionId)}
            onToggleFlag={() => toggleFlagQuestion(currentQuestion.id)}
            onNext={nextQuestion}
            onPrevious={previousQuestion}
          />
        ) : (
          <div className="text-center p-4">
            <p>No questions available</p>
          </div>
        )
      }
      bottomNavigation={
        <MobileExamNavigation
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          isFlagged={currentQuestion ? isFlagged(currentQuestion.id) : false}
          isLastQuestion={currentQuestionIndex === questions.length - 1}
          onPrevious={previousQuestion}
          onNext={nextQuestion}
          onToggleFlag={() => currentQuestion && toggleFlagQuestion(currentQuestion.id)}
          onOpenNavigator={() => setNavSheetOpen(true)}
          onSubmit={() => setShowSubmitDialog(true)}
        />
      }
    />
  );
}
```

These components follow a mobile-first approach, focusing on small, maintainable pieces that work together to create a responsive experience. They're designed to integrate with the existing feature-based architecture and leverage the centralized TanStack Query API for data management.
