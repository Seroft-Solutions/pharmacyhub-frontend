# Component Breakdown Guide

This guide provides detailed instructions for breaking down large components into smaller, more focused ones (Phase 4 of the exams feature refactoring).

## Principles of Component Decomposition

When breaking down components, follow these principles:

1. **Single Responsibility**: Each component should have a single responsibility
2. **Focused Props**: Props should be minimal and focused
3. **Separation of Concerns**: UI, data loading, and business logic should be separated
4. **Reusability**: Look for opportunities to create reusable components
5. **Component Hierarchy**: Create logical parent-child relationships
6. **Consistent Naming**: Use consistent naming patterns
7. **Proper Documentation**: Document the purpose of each component

## Example: Breaking Down ExamContainer

The `ExamContainer` component is currently large (~500 lines) and handles multiple responsibilities. Here's how to break it down:

### Step 1: Identify Responsibilities

Current responsibilities of `ExamContainer`:
- Orchestrating the exam flow (start, questions, summary, results)
- Loading exam data
- Managing state (answers, flags, timer)
- Displaying the start screen
- Displaying questions
- Handling navigation
- Displaying summary
- Showing results
- Error handling

### Step 2: Design Component Hierarchy

```
ExamSession (orchestrator)
├── ExamStart (starting screen)
├── ExamQuestions (questions view)
│   ├── QuestionDisplay
│   │   ├── QuestionText
│   │   ├── OptionsList
│   │   │   └── OptionItem
│   │   └── QuestionControls
│   ├── QuestionNavigation
│   │   └── NavigationButton
│   ├── ExamProgress
│   └── ExamTimer
├── ExamSummary (summary view)
│   ├── AnswersList
│   └── SummaryActions
└── ExamResults (results view)
    ├── ResultsSummary
    ├── PerformanceMetrics
    └── ResultsActions
```

### Step 3: Implement New Components

#### 1. ExamSession (Container Component)

```tsx
// src/features/exams/taking/components/ExamSession.tsx
"use client";

import React, { useEffect } from 'react';
import { useExamTakingStore } from '../store/examTakingStore';
import { ExamStart } from './ExamStart';
import { ExamQuestions } from './ExamQuestions';
import { ExamSummary } from './ExamSummary';
import { ExamResults } from '../../review/components/ExamResults';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';

interface ExamSessionProps {
  examId: number;
  userId: string;
  onExit?: () => void;
}

export const ExamSession: React.FC<ExamSessionProps> = ({ 
  examId, 
  userId, 
  onExit 
}) => {
  // Get state from store
  const {
    currentExam,
    attemptId,
    isLoading,
    error,
    isCompleted,
    showSummary,
    examResult,
    startExam,
    resetExam,
    decrementTimer
  } = useExamTakingStore();

  // Setup timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      decrementTimer();
    }, 1000);
    
    return () => clearInterval(timer);
  }, [decrementTimer]);
  
  // Reset exam on unmount
  useEffect(() => {
    return () => {
      resetExam();
    };
  }, [resetExam]);

  // Handle exam start
  const handleStartExam = () => {
    startExam(examId, userId);
  };

  // Handle return to dashboard
  const handleReturnToDashboard = () => {
    resetExam();
    
    if (onExit) {
      onExit();
    } else {
      // Fallback navigation if onExit isn't provided
      window.location.href = '/dashboard';
    }
  };

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState error={error} />;
  }

  // If exam completed, show results
  if (isCompleted && examResult) {
    return (
      <ExamResults 
        result={examResult}
        onBackToDashboard={handleReturnToDashboard}
      />
    );
  }

  // Show exam summary
  if (showSummary) {
    return <ExamSummary />;
  }

  // Not started - show start screen
  if (!attemptId) {
    return (
      <ExamStart 
        exam={currentExam}
        onStartExam={handleStartExam}
      />
    );
  }

  // Main exam questions view
  return <ExamQuestions onExit={onExit} />;
};

export default ExamSession;
```

#### 2. ExamStart (Start Screen Component)

```tsx
// src/features/exams/taking/components/ExamStart.tsx
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2Icon, PlayIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { NetworkStatusIndicator } from '../../core/components/NetworkStatusIndicator';
import { ExamInfoDisplay } from './ExamInfoDisplay';
import { InstructionsList } from './InstructionsList';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { Exam } from '../../core/types';
import { EXAM_TEXT } from '../../core/constants/uiConstants';
import { useExamTakingStore } from '../store/examTakingStore';

interface ExamStartProps {
  exam: Exam | null;
  onStartExam: () => void;
}

export const ExamStart: React.FC<ExamStartProps> = ({ exam, onStartExam }) => {
  const { isStarting, startError } = useExamTakingStore();
  const isOnline = useOnlineStatus();
  
  if (!exam) {
    return (
      <Alert>
        <AlertDescription>
          No exam found. Please check the exam ID and try again.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Card className="w-full shadow-lg border-t-4 border-t-blue-500 rounded-xl overflow-hidden">
      <CardHeader className="pb-3 border-b bg-gradient-to-r from-blue-50 to-white">
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-blue-700">
            {exam.title}
          </CardTitle>
          <NetworkStatusIndicator />
        </div>
      </CardHeader>
      <CardContent className="py-8">
        <div className="space-y-8">
          <ExamInfoDisplay exam={exam} />
          
          <InstructionsList />
          
          {!isOnline && (
            <Alert variant="warning">
              <AlertDescription>
                Limited connectivity. Your progress will be saved locally, but you need an internet connection to submit the exam.
              </AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={onStartExam} 
            disabled={isStarting || !isOnline}
            className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1 rounded-lg"
            size="lg"
          >
            {isStarting ? (
              <span className="flex items-center justify-center">
                <Loader2Icon className="h-5 w-5 mr-2 animate-spin" /> 
                Starting...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <PlayIcon className="h-5 w-5 mr-2" />
                {EXAM_TEXT.LABELS.START_EXAM}
              </span>
            )}
          </Button>
          
          {startError && (
            <Alert variant="destructive">
              <AlertDescription>
                {startError instanceof Error ? startError.message : 'Failed to start exam'}
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExamStart;
```

#### 3. ExamInfoDisplay (Reusable Component)

```tsx
// src/features/exams/taking/components/ExamInfoDisplay.tsx
import React from 'react';
import { Clock8Icon, ClipboardListIcon, CheckCircleIcon, AlertTriangleIcon } from 'lucide-react';
import { Exam } from '../../core/types';
import { EXAM_TEXT } from '../../core/constants/uiConstants';

interface ExamInfoDisplayProps {
  exam: Exam;
}

export const ExamInfoDisplay: React.FC<ExamInfoDisplayProps> = ({ exam }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6 bg-gradient-to-r from-blue-50 to-white p-6 rounded-xl shadow-sm border border-blue-100">
      <div className="flex items-center space-x-4">
        <div className="bg-blue-100 p-3 rounded-full">
          <Clock8Icon className="h-8 w-8 text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-500">Duration</h3>
          <p className="text-xl font-medium">{exam.duration || 0} minutes</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="bg-green-100 p-3 rounded-full">
          <ClipboardListIcon className="h-8 w-8 text-green-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-500">Questions</h3>
          <p className="text-xl font-medium">{exam.questionCount || 0}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="bg-indigo-100 p-3 rounded-full">
          <CheckCircleIcon className="h-8 w-8 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-500">Total Marks</h3>
          <p className="text-xl font-medium">{exam.totalMarks}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="bg-amber-100 p-3 rounded-full">
          <AlertTriangleIcon className="h-8 w-8 text-amber-600" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-500">Passing Marks</h3>
          <p className="text-xl font-medium">{exam.passingMarks}</p>
        </div>
      </div>
    </div>
  );
};

export default ExamInfoDisplay;
```

### Step 4: Update Imports and Exports

Make sure to update the imports and exports in the index.ts files:

```tsx
// src/features/exams/taking/components/index.ts
export * from './ExamSession';
export * from './ExamStart';
export * from './ExamQuestions';
export * from './ExamInfoDisplay';
export * from './InstructionsList';
export * from './QuestionDisplay';
export * from './QuestionText';
export * from './OptionsList';
export * from './OptionItem';
// ... etc.
```

## Benefits of Component Decomposition

Breaking down components this way provides several benefits:

1. **Improved Readability**: Smaller components are easier to understand
2. **Better Maintainability**: Changes are isolated to specific components
3. **Enhanced Reusability**: Components can be reused in different contexts
4. **Optimized Performance**: More targeted re-renders
5. **Easier Testing**: Components are easier to test in isolation
6. **Better Collaboration**: Team members can work on different components
7. **Clearer Responsibilities**: Each component has a well-defined purpose

## Example: Breaking Down QuestionDisplay

The `QuestionDisplay` component can be broken down as follows:

### Step 1: Identify Responsibilities

Current responsibilities of `QuestionDisplay`:
- Displaying question text
- Rendering answer options
- Handling option selection
- Managing flagging
- Displaying question number and metadata

### Step 2: Extract Components

#### 1. QuestionText Component

```tsx
// src/features/exams/taking/components/QuestionText.tsx
import React from 'react';
import { EXAM_CLASSES } from '../constants/takingConstants';

interface QuestionTextProps {
  text: string;
  questionNumber?: number;
}

export const QuestionText: React.FC<QuestionTextProps> = ({ 
  text, 
  questionNumber 
}) => {
  return (
    <div className={EXAM_CLASSES.QUESTION_TEXT}>
      <div className="text-lg font-medium mb-4">
        {questionNumber && (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2">
            Q{questionNumber}.
          </span>
        )}
        <span dangerouslySetInnerHTML={{ __html: text }} />
      </div>
    </div>
  );
};

export default QuestionText;
```

#### 2. OptionsList Component

```tsx
// src/features/exams/taking/components/OptionsList.tsx
import React from 'react';
import { OptionItem } from './OptionItem';
import { Option } from '../../core/types';
import { EXAM_CLASSES } from '../constants/takingConstants';

interface OptionsListProps {
  options: Option[];
  selectedOption?: number;
  onSelectOption: (optionId: number) => void;
}

export const OptionsList: React.FC<OptionsListProps> = ({ 
  options, 
  selectedOption, 
  onSelectOption 
}) => {
  return (
    <div className={EXAM_CLASSES.OPTIONS_LIST}>
      <div className="space-y-3 mt-6">
        {options.map((option) => (
          <OptionItem
            key={option.id}
            option={option}
            isSelected={selectedOption === option.id}
            onSelect={() => onSelectOption(option.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default OptionsList;
```

#### 3. OptionItem Component

```tsx
// src/features/exams/taking/components/OptionItem.tsx
import React from 'react';
import { Option } from '../../core/types';
import { EXAM_CLASSES } from '../constants/takingConstants';

interface OptionItemProps {
  option: Option;
  isSelected: boolean;
  onSelect: () => void;
}

export const OptionItem: React.FC<OptionItemProps> = ({ 
  option, 
  isSelected, 
  onSelect 
}) => {
  const optionText = option.text || option.label || '';
  
  return (
    <div
      className={`${EXAM_CLASSES.OPTION} cursor-pointer p-4 rounded-lg border transition-all ${
        isSelected
          ? 'bg-blue-50 border-blue-300 border-2'
          : 'bg-white border-gray-200 hover:border-blue-200'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 h-5 w-5 mt-0.5 rounded-full border ${
          isSelected
            ? 'bg-blue-500 border-blue-500'
            : 'bg-white border-gray-300'
        }`}>
          {isSelected && (
            <svg 
              className="h-5 w-5 text-white" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 13l4 4L19 7" 
              />
            </svg>
          )}
        </div>
        <div className="ml-3 text-sm" dangerouslySetInnerHTML={{ __html: optionText }} />
      </div>
    </div>
  );
};

export default OptionItem;
```

#### 4. QuestionControls Component

```tsx
// src/features/exams/taking/components/QuestionControls.tsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Flag, CheckCircle } from 'lucide-react';
import { EXAM_TEXT } from '../../core/constants/uiConstants';
import { EXAM_CLASSES } from '../constants/takingConstants';

interface QuestionControlsProps {
  questionId: number;
  hasAnswer: boolean;
  isFlagged: boolean;
  onFlagQuestion: () => void;
}

export const QuestionControls: React.FC<QuestionControlsProps> = ({ 
  questionId, 
  hasAnswer, 
  isFlagged, 
  onFlagQuestion 
}) => {
  return (
    <div className={EXAM_CLASSES.QUESTION_CONTROLS}>
      <div className="flex items-center space-x-2">
        {hasAnswer && (
          <Badge variant="outline" className="bg-green-50 border-green-200 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Answered
          </Badge>
        )}
        <Button
          variant={isFlagged ? "destructive" : "outline"}
          size="sm"
          onClick={onFlagQuestion}
          className="flex items-center"
        >
          <Flag className="h-4 w-4 mr-1" />
          {isFlagged ? 'Flagged' : EXAM_TEXT.LABELS.FLAG_QUESTION}
        </Button>
      </div>
    </div>
  );
};

export default QuestionControls;
```

#### 5. New QuestionDisplay Component

```tsx
// src/features/exams/taking/components/QuestionDisplay.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Question } from '../../core/types';
import { QuestionText } from './QuestionText';
import { OptionsList } from './OptionsList';
import { QuestionControls } from './QuestionControls';
import { EXAM_CLASSES } from '../constants/takingConstants';

interface QuestionDisplayProps {
  question: Question;
  userAnswer?: number;
  isFlagged: boolean;
  onAnswerSelect: (questionId: number, optionId: number) => void;
  onFlagQuestion: (questionId: number) => void;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  userAnswer,
  isFlagged,
  onAnswerSelect,
  onFlagQuestion,
}) => {
  const handleAnswerSelect = (optionId: number) => {
    onAnswerSelect(question.id, optionId);
  };
  
  const handleFlagQuestion = () => {
    onFlagQuestion(question.id);
  };
  
  return (
    <Card className={EXAM_CLASSES.QUESTION_CARD}>
      <CardHeader className="pb-3 border-b bg-gradient-to-r from-blue-50 to-white">
        <div className="flex justify-between">
          <CardTitle className="text-lg font-medium">
            Question {question.questionNumber || 'N/A'}
          </CardTitle>
          <QuestionControls
            questionId={question.id}
            hasAnswer={userAnswer !== undefined}
            isFlagged={isFlagged}
            onFlagQuestion={handleFlagQuestion}
          />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <QuestionText
          text={question.text}
          questionNumber={question.questionNumber}
        />
        <OptionsList
          options={question.options}
          selectedOption={userAnswer}
          onSelectOption={handleAnswerSelect}
        />
      </CardContent>
    </Card>
  );
};

export default QuestionDisplay;
```

## Example: Breaking Down ExamResults

The `ExamResults` component can be broken down as follows:

### Step 1: Extract Components

#### 1. ResultsSummary Component

```tsx
// src/features/exams/review/components/ResultsSummary.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from 'lucide-react';
import { ExamResult } from '../../core/types';
import { formatTime } from '../../core/utils/timeUtils';
import { REVIEW_CLASSES } from '../constants/reviewConstants';

interface ResultsSummaryProps {
  result: ExamResult;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ result }) => {
  const { 
    score, 
    totalMarks, 
    passingMarks,
    isPassed, 
    totalQuestions, 
    correctAnswers, 
    incorrectAnswers,
    unanswered,
    timeSpent
  } = result;
  
  const passingPercentage = (passingMarks / totalMarks) * 100;
  
  return (
    <Card className={REVIEW_CLASSES.SUMMARY_CARD}>
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          Result Summary
          <Badge 
            className={`ml-2 ${isPassed ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {isPassed ? 'Passed' : 'Failed'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="font-medium">Your Score:</span>
              <span className="text-xl font-bold">{score.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="font-medium">Passing Score:</span>
              <span>{passingPercentage.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="font-medium">Time Spent:</span>
              <span className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                {formatTime(timeSpent)}
              </span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="font-medium">Total Questions:</span>
              <span>{totalQuestions}</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="font-medium">Correct Answers:</span>
              <span className="flex items-center text-green-600">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                {correctAnswers}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="font-medium">Incorrect Answers:</span>
              <span className="flex items-center text-red-600">
                <XCircleIcon className="h-4 w-4 mr-1" />
                {incorrectAnswers}
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="font-medium">Unanswered:</span>
              <span>{unanswered}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsSummary;
```

#### 2. PerformanceMetrics Component

```tsx
// src/features/exams/review/components/PerformanceMetrics.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { ExamResult } from '../../core/types';
import { REVIEW_CLASSES } from '../constants/reviewConstants';

interface PerformanceMetricsProps {
  result: ExamResult;
}

export const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({ result }) => {
  const { correctAnswers, incorrectAnswers, unanswered } = result;
  
  const data = [
    { name: 'Correct', value: correctAnswers, color: '#22c55e' },
    { name: 'Incorrect', value: incorrectAnswers, color: '#ef4444' },
    { name: 'Unanswered', value: unanswered, color: '#94a3b8' },
  ].filter(item => item.value > 0);
  
  return (
    <Card className={REVIEW_CLASSES.METRICS_CARD}>
      <CardHeader>
        <CardTitle>Performance Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
```

#### 3. ResultsActions Component

```tsx
// src/features/exams/review/components/ResultsActions.tsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCcwIcon, HomeIcon, SearchIcon } from 'lucide-react';
import { REVIEW_TEXT } from '../constants/reviewConstants';
import { REVIEW_CLASSES } from '../constants/reviewConstants';

interface ResultsActionsProps {
  onReview: () => void;
  onTryAgain: () => void;
  onBackToDashboard: () => void;
}

export const ResultsActions: React.FC<ResultsActionsProps> = ({
  onReview,
  onTryAgain,
  onBackToDashboard,
}) => {
  return (
    <Card className={REVIEW_CLASSES.ACTIONS_CARD}>
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onReview}
            className="flex items-center"
          >
            <SearchIcon className="h-4 w-4 mr-2" />
            {REVIEW_TEXT.LABELS.REVIEW_ANSWERS}
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={onTryAgain}
            className="flex items-center"
          >
            <RefreshCcwIcon className="h-4 w-4 mr-2" />
            {REVIEW_TEXT.LABELS.TRY_AGAIN}
          </Button>
          
          <Button
            variant="default"
            size="lg"
            onClick={onBackToDashboard}
            className="flex items-center"
          >
            <HomeIcon className="h-4 w-4 mr-2" />
            {REVIEW_TEXT.LABELS.BACK_TO_DASHBOARD}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsActions;
```

#### 4. New ExamResults Component

```tsx
// src/features/exams/review/components/ExamResults.tsx
import React from 'react';
import { ExamResult } from '../../core/types';
import { ResultsSummary } from './ResultsSummary';
import { PerformanceMetrics } from './PerformanceMetrics';
import { ResultsActions } from './ResultsActions';
import { AnswersReview } from './AnswersReview';
import { REVIEW_CLASSES } from '../constants/reviewConstants';

interface ExamResultsProps {
  result: ExamResult;
  onReview?: () => void;
  onTryAgain?: () => void;
  onBackToDashboard?: () => void;
}

export const ExamResults: React.FC<ExamResultsProps> = ({
  result,
  onReview = () => {},
  onTryAgain = () => {},
  onBackToDashboard = () => {},
}) => {
  return (
    <div className={REVIEW_CLASSES.RESULTS_CONTAINER}>
      <h1 className="text-2xl font-bold mb-6">
        Exam Results: {result.examTitle}
      </h1>
      
      <div className="space-y-6">
        <ResultsSummary result={result} />
        
        <div className="grid md:grid-cols-2 gap-6">
          <PerformanceMetrics result={result} />
          <ResultsActions
            onReview={onReview}
            onTryAgain={onTryAgain}
            onBackToDashboard={onBackToDashboard}
          />
        </div>
        
        {result.questionResults && result.questionResults.length > 0 && (
          <AnswersReview
            questionResults={result.questionResults}
            examId={result.examId}
          />
        )}
      </div>
    </div>
  );
};

export default ExamResults;
```

## Migrating Existing Components

When migrating existing components, follow this process:

1. **Create New Components**: Implement new component structure
2. **Test New Components**: Ensure they work correctly
3. **Update Imports**: Change imports in consuming components
4. **Move Old Components**: Move the old components to deprecated folder
5. **Update Exports**: Update index.ts files

```tsx
// Example of moving old components to deprecated
// src/features/exams/deprecated/components/ExamContainer.tsx
// Copy the original ExamContainer.tsx here

// src/features/exams/deprecated/components/index.ts
export * from './ExamContainer';
export * from './QuestionDisplay';
export * from './ExamResults';
// ... etc.
```

## Conclusion

Following these principles and examples will help you break down large components into smaller, more focused ones. This will significantly improve the maintainability, readability, and performance of the exams feature.

Remember to test each component as you go and ensure all functionality is preserved. The end result will be a more modular, maintainable codebase that follows best practices for React component design.
