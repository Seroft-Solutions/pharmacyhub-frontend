# Task 07: Update and Optimize Hooks

## Description
Review, update, and optimize the custom React hooks used in the Exams feature, ensuring proper implementation, naming conventions, and adherence to best practices.

## Current State Analysis
The Exams feature uses custom hooks in the `/hooks` directory for various functionality. There may be inconsistencies, deprecated implementations, or opportunities for optimization.

## Implementation Steps

1. **Catalog all custom hooks**
   - Create a complete inventory of hooks
   - Classify hooks by purpose (UI, data, utility, etc.)
   - Identify hooks that might be deprecated or redundant
   - Map hook usage across components

2. **Evaluate hook implementation**
   - Check for performance issues (e.g., unnecessary rerenders)
   - Ensure proper dependency arrays in `useEffect`
   - Check for proper cleanup in `useEffect`
   - Verify proper memoization with `useMemo` and `useCallback`

3. **Standardize hook implementation**
   - Ensure consistent naming conventions (`useNounVerb`)
   - Add proper TypeScript types for parameters and return values
   - Implement error handling where appropriate
   - Add JSDoc comments for all hooks

4. **Extract logic from components**
   - Identify component logic that could be moved to custom hooks
   - Extract complex logic into focused hooks
   - Ensure extracted hooks have a single responsibility

5. **Optimize for performance**
   - Implement memoization for expensive calculations
   - Use callback references for stable event handlers
   - Avoid unnecessary rerenders with proper dependencies
   - Consider using `useReducer` for complex state logic

6. **Create reusable hooks**
   - Identify common patterns that could be abstracted
   - Create generic hooks for common operations
   - Ensure hooks are properly typed for reusability

7. **Document hooks and usage**
   - Add JSDoc comments to all hooks
   - Document parameters and return values
   - Create usage examples for complex hooks

## Hook Implementation Patterns

```typescript
/**
 * Hook for managing the state of an exam attempt
 * 
 * @param examId - The ID of the exam being attempted
 * @returns Object containing exam attempt state and methods
 */
export const useExamAttempt = (examId: string) => {
  // State for the exam attempt
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string[]>>({});
  const [timeSpent, setTimeSpent] = useState(0);
  
  // Fetch exam data using TanStack Query
  const { data: exam, isLoading } = useExamQuery(examId);
  
  // Memoize derived values to prevent unnecessary calculations
  const totalQuestions = useMemo(() => {
    return exam?.questions?.length || 0;
  }, [exam?.questions]);
  
  const currentQuestion = useMemo(() => {
    return exam?.questions?.[currentQuestionIndex] || null;
  }, [exam?.questions, currentQuestionIndex]);
  
  const isLastQuestion = useMemo(() => {
    return currentQuestionIndex === totalQuestions - 1;
  }, [currentQuestionIndex, totalQuestions]);
  
  // Stable callback references
  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, totalQuestions]);
  
  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);
  
  const answerQuestion = useCallback((questionId: string, selectedOptions: string[]) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: selectedOptions,
    }));
  }, []);
  
  // Timer effect
  useEffect(() => {
    // Only start the timer if the exam is loaded
    if (!exam) return;
    
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    // Cleanup interval on unmount
    return () => clearInterval(timer);
  }, [exam]);
  
  // Return all values and methods
  return {
    // Data
    exam,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    userAnswers,
    timeSpent,
    isLastQuestion,
    
    // Loading state
    isLoading,
    
    // Methods
    goToNextQuestion,
    goToPreviousQuestion,
    answerQuestion,
    setCurrentQuestionIndex,
  };
};
```

## Hook Usage Example

```tsx
// Example component using the hook
const ExamAttemptPage = () => {
  const { examId } = useParams();
  
  const {
    exam,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    userAnswers,
    timeSpent,
    isLoading,
    goToNextQuestion,
    goToPreviousQuestion,
    answerQuestion,
  } = useExamAttempt(examId);
  
  if (isLoading) {
    return <Spinner />;
  }
  
  if (!exam) {
    return <NotFound />;
  }
  
  return (
    <div>
      <ExamHeader 
        title={exam.title} 
        currentQuestion={currentQuestionIndex + 1} 
        totalQuestions={totalQuestions} 
      />
      
      <ExamTimer timeSpent={timeSpent} timeLimit={exam.timeLimit} />
      
      <QuestionDisplay
        question={currentQuestion}
        selectedOptions={userAnswers[currentQuestion.id] || []}
        onAnswer={(options) => answerQuestion(currentQuestion.id, options)}
      />
      
      <ExamNavigation
        currentIndex={currentQuestionIndex}
        totalQuestions={totalQuestions}
        onNext={goToNextQuestion}
        onPrevious={goToPreviousQuestion}
      />
    </div>
  );
};
```

## Verification Criteria
- All hooks follow consistent naming conventions
- Proper TypeScript types for parameters and return values
- Performance optimizations for expensive calculations
- Appropriate memoization with `useMemo` and `useCallback`
- Proper cleanup in `useEffect`
- JSDoc comments for all hooks
- No unnecessary rerenders
- Single responsibility for each hook

## Time Estimate
Approximately 8-10 hours

## Dependencies
- Task 01: Document Current Directory Structure and Identify Gaps
- Task 05: Consolidate State Management (partial dependency)
- Task 06: Organize and Document Types and Interfaces (partial dependency)

## Risks
- Changes to hooks could affect multiple components
- Performance optimizations may be difficult to test
- Some hooks may be tightly coupled to specific components
