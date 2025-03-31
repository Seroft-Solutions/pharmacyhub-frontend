# Core UI Integration Examples

This document provides concrete examples of how components in the Exams Preparation feature integrate with and extend the core UI library. These patterns should be followed when creating new components.

## Table of Contents

1. [Basic Component Usage](#basic-component-usage)
2. [Common Extension Patterns](#common-extension-patterns)
3. [Real-World Examples from Exams Feature](#real-world-examples-from-exams-feature)
4. [Do's and Don'ts](#dos-and-donts)

## Basic Component Usage

### Direct Usage of Core Components

The simplest way to use core UI components is to import and use them directly:

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

function BasicExample() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Example Card</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card content goes here</p>
        <Button>Click Me</Button>
      </CardContent>
    </Card>
  );
}
```

### Using Core Hooks

Core hooks should also be used directly:

```tsx
import { useToast } from '@/components/ui/use-toast';

function ToastExample() {
  const { toast } = useToast();
  
  const showSuccess = () => {
    toast({
      title: "Exam Submitted",
      description: "Your exam has been successfully submitted.",
    });
  };
  
  return (
    <Button onClick={showSuccess}>Submit Exam</Button>
  );
}
```

## Common Extension Patterns

### 1. Wrapping Core Components with Feature-Specific Props

```tsx
import { Button, ButtonProps } from '@/components/ui/button';

interface ExamActionButtonProps extends ButtonProps {
  variant?: 'submit' | 'cancel' | 'next';
}

export function ExamActionButton({ 
  variant = 'next', 
  children, 
  ...props 
}: ExamActionButtonProps) {
  // Map our custom variants to the core variants
  const variantMap = {
    submit: 'default',
    cancel: 'outline',
    next: 'secondary',
  };
  
  return (
    <Button 
      variant={variantMap[variant]} 
      {...props}
    >
      {children}
    </Button>
  );
}
```

### 2. Composing Multiple Core Components

```tsx
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ExamProgressCardProps {
  title: string;
  completed: number;
  total: number;
}

export function ExamProgressCard({ title, completed, total }: ExamProgressCardProps) {
  const percentage = Math.round((completed / total) * 100);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Progress value={percentage} />
        <p className="mt-2 text-sm text-gray-500">
          {completed} of {total} questions completed ({percentage}%)
        </p>
        <Separator className="my-4" />
        <p className="text-sm">
          Keep going! You're making great progress.
        </p>
      </CardContent>
    </Card>
  );
}
```

### 3. Creating Specialized Components with Core Foundations

```tsx
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ExamQuestionOptionProps {
  questionId: string;
  options: Array<{
    id: string;
    text: string;
  }>;
  selectedOption?: string;
  onSelectOption: (questionId: string, optionId: string) => void;
}

export function ExamQuestionOptions({ 
  questionId, 
  options, 
  selectedOption,
  onSelectOption 
}: ExamQuestionOptionProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <RadioGroup 
          value={selectedOption} 
          onValueChange={(value) => onSelectOption(questionId, value)}
        >
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                {option.text}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
```

## Real-World Examples from Exams Feature

Here are concrete examples from the Exams Preparation feature that demonstrate effective core UI integration:

### ExamQuestionNavigation Component

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
  onDirectSubmit?: () => void;
  className?: string;
}

export function ExamQuestionNavigation({
  isFirstQuestion,
  isLastQuestion,
  onPrevQuestion,
  onNextQuestion,
  onFinishClick,
  onDirectSubmit,
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
        <Button onClick={onDirectSubmit || onFinishClick}>
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

### ExamDialog Component

```tsx
// src/features/exams-preparation/components/molecules/ExamAlertDialog.tsx
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

interface ExamAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export function ExamAlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: ExamAlertDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### ExamCard Component

```tsx
// src/features/exams-preparation/components/molecules/ExamInfoCard.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExamStatusBadge } from '../atoms/ExamStatusBadge';
import { formatDate } from '@/core/utils/date';

interface ExamInfoCardProps {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  questionsCount: number;
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function ExamInfoCard({
  id,
  title,
  description,
  status,
  createdAt,
  questionsCount,
  onView,
  onEdit,
}: ExamInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>{title}</CardTitle>
          <ExamStatusBadge status={status} />
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Created:</span>
            <span>{formatDate(createdAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Questions:</span>
            <span>{questionsCount}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        {onView && (
          <Button variant="outline" onClick={() => onView(id)}>View</Button>
        )}
        {onEdit && status === 'draft' && (
          <Button onClick={() => onEdit(id)}>Edit</Button>
        )}
      </CardFooter>
    </Card>
  );
}
```

### ExamLayout Component

```tsx
// src/features/exams-preparation/components/templates/ExamLayout.tsx
import { ReactNode } from 'react';
import { Container } from '@/core/ui/layout';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ExamLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  sidebar?: ReactNode;
  isLoading?: boolean;
  error?: Error | null;
  onRetry?: () => void;
  title?: string;
  className?: string;
}

export function ExamLayout({
  children,
  header,
  sidebar,
  isLoading = false,
  error = null,
  onRetry,
  title = 'Exam',
  className = '',
}: ExamLayoutProps) {
  if (isLoading) {
    return (
      <Container className="flex items-center justify-center h-[400px]">
        <Spinner size="lg" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading exam</AlertTitle>
          <AlertDescription>
            {error.message || 'An unexpected error occurred while loading the exam.'}
          </AlertDescription>
          {onRetry && (
            <Button variant="outline" onClick={onRetry} className="mt-4">
              Try Again
            </Button>
          )}
        </Alert>
      </Container>
    );
  }

  return (
    <div className={`flex flex-col min-h-screen ${className}`}>
      {header && <div className="border-b">{header}</div>}
      <div className="flex flex-1">
        {sidebar && (
          <div className="w-64 border-r h-full">
            {sidebar}
          </div>
        )}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
```

## Do's and Don'ts

### Do's

✅ **DO** use core UI components directly whenever possible
```tsx
import { Button } from '@/components/ui/button';

function MyComponent() {
  return <Button>Click Me</Button>;
}
```

✅ **DO** compose components to create specialized UI
```tsx
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

function ExamProgress({ value }) {
  return (
    <Card>
      <CardContent>
        <Progress value={value} />
      </CardContent>
    </Card>
  );
}
```

✅ **DO** use TypeScript interfaces to define component props
```tsx
interface ExamButtonProps {
  examId: string;
  status: 'draft' | 'published';
  onAction: (id: string) => void;
}
```

✅ **DO** extract complex logic to custom hooks
```tsx
// Clean component with logic in hook
function ExamTimer({ duration, onComplete }) {
  const { timeLeft, isRunning } = useCountdown(duration, onComplete);
  
  return <div>{formatTime(timeLeft)}</div>;
}
```

### Don'ts

❌ **DON'T** duplicate functionality available in core UI
```tsx
// DON'T: Creating a custom button instead of using core Button
function CustomButton({ children }) {
  return (
    <button className="px-4 py-2 bg-blue-500 text-white rounded">
      {children}
    </button>
  );
}
```

❌ **DON'T** create unnecessarily complex wrappers
```tsx
// DON'T: Overly complex wrapper with no added value
function ExamButton(props) {
  return <Button {...props} />;
}
```

❌ **DON'T** create monolithic components
```tsx
// DON'T: Component doing too many things
function ExamPage() {
  // 100+ lines of component logic
  // UI for multiple sections all in one component
}
```

❌ **DON'T** mix presentation and business logic
```tsx
// DON'T: Mixing API calls directly in component
function ExamList() {
  useEffect(() => {
    fetch('/api/exams')
      .then(res => res.json())
      .then(data => setExams(data));
  }, []);
  
  // UI rendering
}
```

## Summary

By following these patterns and examples, you'll ensure that your components:

1. Are properly integrated with the core UI
2. Follow consistent design patterns
3. Maintain clean separation of concerns
4. Are easy to test and maintain
5. Provide a consistent user experience

When in doubt, choose composition over custom implementation, and always check if a core component already exists before creating a new one.
