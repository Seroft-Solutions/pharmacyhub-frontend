# Exam Preparation Component Design Guide

This document outlines the component design patterns for the Exam Preparation feature, with a focus on integration with core UI components following atomic design principles and the "Core as Foundation" approach.

## Table of Contents

1. [Core Principles](#core-principles)
2. [Component Organization](#component-organization)
3. [Core UI Integration](#core-ui-integration)
4. [Component Extension Patterns](#component-extension-patterns)
5. [Usage Examples](#usage-examples)
6. [Testing Guidelines](#testing-guidelines)
7. [Performance Considerations](#performance-considerations)

## Core Principles

The Exam Preparation feature adheres to the following core architectural principles:

1. **Feature-First Organization**: All components are organized by feature, not by technical function
2. **Core as Foundation**: Core modules provide cross-cutting concerns, with features consuming core functionality
3. **Modular Component Design**: Components are broken down into small, focused pieces
4. **Single Responsibility**: Each component does exactly one thing well
5. **Composition over Inheritance**: Components are composed rather than extended
6. **Size Limitations**: No component exceeds 200 lines of code

## Component Organization

Components are organized following atomic design principles:

### Atoms

Atoms are the smallest building blocks of the UI. They are typically simple, focused components that do one thing well.

```
src/features/exams-preparation/components/atoms/
```

Examples:
- `ExamStatusBadge`: Badge showing exam status
- `TimeRemainingComponent`: Shows time remaining in an exam

### Molecules

Molecules are groups of atoms combined to form slightly more complex components.

```
src/features/exams-preparation/components/molecules/
```

Examples:
- `ExamHeader`: Displays exam title, description, and time
- `ExamQuestionNavigation`: Navigation buttons for moving between questions

### Organisms

Organisms are complex UI components composed of molecules and atoms.

```
src/features/exams-preparation/components/organisms/
```

Examples:
- `ExamQuestionCard`: Card containing question and navigation
- `ExamSidebar`: Sidebar for exam navigation and overview

### Templates

Templates define the overall structure of a page or major UI section.

```
src/features/exams-preparation/components/templates/
```

Examples:
- `ExamContainer`: Main container for the exam taking experience
- `ExamLayout`: Overall layout for exam-related pages

## Core UI Integration

### Core UI Component Identification

The project uses a combination of:
1. **Core UI components** (`@/core/ui/*`): Cross-cutting UI components shared across features
2. **Shadcn UI components** (`@/components/ui/*`): Base UI library components

### Usage Guidelines

1. **Direct Usage**: Always use core UI components directly whenever possible
2. **Composition**: Create feature-specific components by composing core components
3. **Wrapping**: Only wrap core components when adding feature-specific behavior
4. **Extension**: Avoid inheritance; prefer composition to extend functionality

### Component Mapping

| Feature Component | Core/UI Component |
|-------------------|-------------------|
| `Card` UI elements | `@/components/ui/card` |
| `Dialog` components | `@/components/ui/alert-dialog` |
| `Button` elements | `@/components/ui/button` |
| `Form` components | `@/components/ui/form` |
| Layout components | `@/components/ui/container`, etc. |
| Feedback elements | `@/core/ui/feedback` components |

## Component Extension Patterns

### 1. Composition Pattern

The preferred way to extend core components is through composition:

```tsx
// GOOD: Composition pattern
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ExamCardProps {
  title: string;
  status: 'draft' | 'published' | 'archived';
}

export function ExamCard({ title, status }: ExamCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <Badge variant={status === 'published' ? 'success' : 'secondary'}>
          {status}
        </Badge>
      </CardHeader>
      <CardContent>
        {/* Feature-specific content */}
      </CardContent>
    </Card>
  );
}
```

### 2. Props Forwarding Pattern

When customizing behavior while preserving the base interface:

```tsx
// GOOD: Props forwarding pattern
import { Button, ButtonProps } from '@/components/ui/button';

interface ExamSubmitButtonProps extends ButtonProps {
  isSubmitting?: boolean;
}

export function ExamSubmitButton({ 
  isSubmitting, 
  children = 'Submit Exam',
  ...buttonProps 
}: ExamSubmitButtonProps) {
  return (
    <Button 
      disabled={isSubmitting} 
      {...buttonProps}
    >
      {isSubmitting ? 'Submitting...' : children}
    </Button>
  );
}
```

### 3. Custom Hook Pattern

Extract complex logic into custom hooks to keep components clean:

```tsx
// GOOD: Custom hook pattern
import { useState, useEffect } from 'react';

export function useExamTimer(durationMinutes: number, onTimeUp: () => void) {
  const [timeRemaining, setTimeRemaining] = useState(durationMinutes * 60);
  
  useEffect(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining, onTimeUp]);
  
  return {
    minutes: Math.floor(timeRemaining / 60),
    seconds: timeRemaining % 60,
    isTimeUp: timeRemaining <= 0,
  };
}
```

### 4. Component Decomposition Pattern

Breaking large components into smaller, composed pieces:

```tsx
// GOOD: Component decomposition
// ExamQuestionCard.tsx
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ExamQuestion } from './ExamQuestion';
import { ExamQuestionNavigation } from '../molecules/ExamQuestionNavigation';

export function ExamQuestionCard({ 
  questionId,
  questionText,
  options,
  // ...other props
}) {
  return (
    <Card>
      <CardContent>
        <ExamQuestion 
          id={questionId}
          text={questionText}
          options={options}
          // ...props
        />
      </CardContent>
      <CardFooter>
        <ExamQuestionNavigation 
          // ...props
        />
      </CardFooter>
    </Card>
  );
}
```

### Anti-Patterns to Avoid

```tsx
// BAD: Direct extension/inheritance
class ExamButton extends Button {
  // ...
}

// BAD: Not using core components
function CustomButton({ children }) {
  return <button className="custom-button">{children}</button>;
}

// BAD: Duplicating core functionality
function ExamCard({ children }) {
  return (
    <div className="border rounded shadow p-4">
      {children}
    </div>
  );
}
```

## Usage Examples

### Atom: ExamStatusBadge

```tsx
// src/features/exams-preparation/components/atoms/ExamStatusBadge.tsx
import { Badge } from '@/components/ui/badge';

type ExamStatus = 'draft' | 'published' | 'archived';

interface ExamStatusBadgeProps {
  status: ExamStatus;
  size?: 'sm' | 'md' | 'lg';
}

export function ExamStatusBadge({ status, size = 'md' }: ExamStatusBadgeProps) {
  const variants = {
    draft: 'secondary',
    published: 'success',
    archived: 'outline'
  };
  
  return (
    <Badge 
      variant={variants[status]} 
      className={size === 'sm' ? 'text-xs px-2' : size === 'lg' ? 'text-md px-4 py-1' : undefined}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
```

### Molecule: ExamQuestionNavigation

```tsx
// src/features/exams-preparation/components/molecules/ExamQuestionNavigation.tsx
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';

interface ExamQuestionNavigationProps {
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  onPrevQuestion: () => void;
  onNextQuestion: () => void;
  onFinishClick: () => void;
  className?: string;
}

export function ExamQuestionNavigation({
  isFirstQuestion,
  isLastQuestion,
  onPrevQuestion,
  onNextQuestion,
  onFinishClick,
  className = ''
}: ExamQuestionNavigationProps) {
  return (
    <div className={`flex justify-between w-full ${className}`}>
      <Button
        variant="outline"
        onClick={onPrevQuestion}
        disabled={isFirstQuestion}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Previous
      </Button>
      
      {isLastQuestion ? (
        <Button onClick={onFinishClick}>
          <CheckCircle className="mr-2 h-4 w-4" />
          Review & Finish
        </Button>
      ) : (
        <Button onClick={onNextQuestion}>
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
```

### Organism: ExamDialogs

```tsx
// src/features/exams-preparation/components/organisms/ExamDialogs.tsx
import { ExamAlertDialog } from '../molecules/ExamAlertDialog';

interface ExamDialogsProps {
  showFinishDialog: boolean;
  showTimesUpDialog: boolean;
  onFinishDialogChange: (open: boolean) => void;
  onTimesUpDialogChange: (open: boolean) => void;
  onSubmitExam: () => void;
}

export function ExamDialogs({
  showFinishDialog,
  showTimesUpDialog,
  onFinishDialogChange,
  onTimesUpDialogChange,
  onSubmitExam,
}: ExamDialogsProps) {
  return (
    <>
      <ExamAlertDialog
        open={showFinishDialog}
        onOpenChange={onFinishDialogChange}
        title="Submit Exam"
        description="Are you sure you want to submit your exam? You won't be able to make changes after submission."
        confirmText="Submit Exam"
        onConfirm={onSubmitExam}
      />
      
      <ExamAlertDialog
        open={showTimesUpDialog}
        onOpenChange={onTimesUpDialogChange}
        title="Time's Up!"
        description="Your exam time has expired. Your answers will be submitted automatically."
        confirmText="View Results"
        onConfirm={onSubmitExam}
        cancelText="Close"
      />
    </>
  );
}
```

### Template: ExamContainer with useExamSession Hook

```tsx
// src/features/exams-preparation/components/templates/ExamContainer.tsx
import { ExamLayout } from './ExamLayout';
import { ExamQuestionCard } from '../organisms/ExamQuestionCard';
import { ExamSidebar } from '../organisms/ExamSidebar';
import { ExamHeader } from '../molecules/ExamHeader';
import { ExamDialogs } from '../organisms/ExamDialogs';
import { useExamSession } from '../../hooks/useExamSession';

interface ExamContainerProps {
  examId: string;
  className?: string;
}

export function ExamContainer({
  examId,
  className = '',
}: ExamContainerProps) {
  // Extract logic into a custom hook
  const {
    exam,
    currentQuestionIndex,
    userAnswers,
    isLoading,
    error,
    currentQuestion,
    isFirstQuestion,
    isLastQuestion,
    showFinishDialog,
    showTimesUpDialog,
    loadExam,
    handlePrevQuestion,
    handleNextQuestion,
    handleSelectOption,
    handleFinishClick,
    handleSubmitExam,
    handleTimeUp,
    setShowFinishDialog,
    setShowTimesUpDialog
  } = useExamSession(examId);

  return (
    <ExamLayout
      isLoading={isLoading}
      error={error}
      onRetry={() => loadExam(examId)}
      title={exam?.title}
      className={className}
      header={
        exam && (
          <ExamHeader
            title={exam.title}
            description={exam.description}
            durationMinutes={exam.durationMinutes}
            onTimeUp={handleTimeUp}
          />
        )
      }
      sidebar={
        exam && (
          <ExamSidebar
            questions={exam.questions}
            questionsCount={exam.questions.length}
            durationMinutes={exam.durationMinutes}
            currentQuestionIndex={currentQuestionIndex}
            userAnswers={userAnswers}
            onSelectQuestion={(index) => currentQuestionIndex !== index && loadExam(examId)}
            onFinishClick={handleFinishClick}
          />
        )
      }
    >
      {currentQuestion && (
        <ExamQuestionCard
          questionId={currentQuestion.id}
          questionNumber={currentQuestionIndex + 1}
          questionText={currentQuestion.text}
          options={currentQuestion.options}
          selectedOption={userAnswers[currentQuestion.id]}
          onSelectOption={handleSelectOption}
          isFirstQuestion={isFirstQuestion}
          isLastQuestion={isLastQuestion}
          onPrevQuestion={handlePrevQuestion}
          onNextQuestion={handleNextQuestion}
          onFinishClick={handleFinishClick}
        />
      )}
      
      <ExamDialogs 
        showFinishDialog={showFinishDialog}
        showTimesUpDialog={showTimesUpDialog}
        onFinishDialogChange={setShowFinishDialog}
        onTimesUpDialogChange={setShowTimesUpDialog}
        onSubmitExam={handleSubmitExam}
      />
    </ExamLayout>
  );
}
```

## Testing Guidelines

### Component Testing

1. Test each component in isolation
2. Mock dependencies and core components
3. Focus on component responsibilities
4. Test prop variations and edge cases

Example:

```tsx
// ExamQuestionNavigation.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ExamQuestionNavigation } from './ExamQuestionNavigation';

describe('ExamQuestionNavigation', () => {
  const mockPrev = jest.fn();
  const mockNext = jest.fn();
  const mockFinish = jest.fn();
  
  it('should disable previous button on first question', () => {
    render(
      <ExamQuestionNavigation
        isFirstQuestion={true}
        isLastQuestion={false}
        onPrevQuestion={mockPrev}
        onNextQuestion={mockNext}
        onFinishClick={mockFinish}
      />
    );
    
    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
  });
  
  it('should show finish button on last question', () => {
    render(
      <ExamQuestionNavigation
        isFirstQuestion={false}
        isLastQuestion={true}
        onPrevQuestion={mockPrev}
        onNextQuestion={mockNext}
        onFinishClick={mockFinish}
      />
    );
    
    expect(screen.getByText('Review & Finish')).toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });
});
```

## Performance Considerations

1. **Memoization**: Use `React.memo` for components that re-render frequently
2. **Callback Stability**: Use `useCallback` for event handlers passed to child components
3. **State Management**: Use appropriate state management based on needs:
   - Local state for simple UI state
   - Zustand for complex feature state
   - TanStack Query for server state
4. **Code Splitting**: Use dynamic imports for large components

Example:

```tsx
// Memoizing component
import { memo } from 'react';

interface ExamQuestionProps {
  // props
}

function ExamQuestionBase(props: ExamQuestionProps) {
  // implementation
}

export const ExamQuestion = memo(ExamQuestionBase);
```

```tsx
// Stable callbacks
import { useCallback } from 'react';

function ExamContainer() {
  const handleSelectOption = useCallback((questionId: string, optionId: string) => {
    // implementation
  }, [/* dependencies */]);
  
  return (
    <ExamQuestion
      // ...
      onSelectOption={handleSelectOption}
    />
  );
}
```
