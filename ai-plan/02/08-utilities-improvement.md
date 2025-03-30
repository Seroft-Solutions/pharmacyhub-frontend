# Task 08: Improve Utility Functions

## Description
Review, organize, and improve the utility functions used in the Exams feature, ensuring proper implementation, naming conventions, and adherence to best practices.

## Current State Analysis
The Exams feature has utility functions in the `/utils` directory and possibly in other locations. There may be inconsistencies, duplication, or opportunities for better organization and implementation.

## Implementation Steps

1. **Catalog all utility functions**
   - Create a complete inventory of utility functions
   - Classify by purpose (formatting, calculation, validation, etc.)
   - Identify any duplicated or redundant utilities
   - Check for overlaps with core utility functions

2. **Organize utilities by domain**
   - Group related utilities together
   - Create subdirectories for major domains if needed
   - Consider organization patterns such as:
     ```
     /utils
     ├── format.ts         # Formatting utilities
     ├── calculation.ts    # Calculation utilities
     ├── validation.ts     # Validation utilities
     ├── time.ts           # Time-related utilities
     ├── transform.ts      # Data transformation utilities
     └── index.ts          # Export everything
     ```

3. **Improve implementation**
   - Ensure all functions are pure (no side effects)
   - Add proper error handling
   - Implement proper parameter validation
   - Add TypeScript types for parameters and return values

4. **Enhance reusability**
   - Make functions more generic where appropriate
   - Add optional parameters with sensible defaults
   - Consider implementing function composition patterns
   - Extract common patterns into shared utilities

5. **Optimize performance**
   - Identify and optimize expensive calculations
   - Implement memoization for pure functions
   - Consider lazy evaluation techniques
   - Add performance notes in documentation

6. **Add testing**
   - Ensure all utilities have unit tests
   - Add test cases for edge cases
   - Implement property-based testing for complex functions
   - Document testing strategies

7. **Document utilities**
   - Add JSDoc comments to all functions
   - Document parameters, return values, and exceptions
   - Add examples for complex utilities
   - Create a utilities reference guide

## Utility Implementation Patterns

```typescript
/**
 * Formats a time duration in seconds to a human-readable string
 * 
 * @param seconds - The time in seconds to format
 * @param options - Formatting options
 * @returns Formatted time string
 * 
 * @example
 * formatTime(65) => "1:05"
 * formatTime(3661) => "1:01:01"
 * formatTime(65, { includeSeconds: false }) => "1m"
 */
export const formatTime = (
  seconds: number,
  options: {
    includeSeconds?: boolean;
    shortFormat?: boolean;
  } = {}
): string => {
  // Default options
  const { includeSeconds = true, shortFormat = false } = options;
  
  // Parameter validation
  if (seconds < 0) {
    throw new Error('Seconds must be a non-negative number');
  }
  
  // Calculate hours, minutes, seconds
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  // Format based on options
  if (shortFormat) {
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (includeSeconds && remainingSeconds > 0) parts.push(`${remainingSeconds}s`);
    return parts.join(' ');
  } else {
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  }
};

/**
 * Calculates the score for an exam attempt
 * 
 * @param questions - Array of questions with correct answers
 * @param userAnswers - User's answers, keyed by question ID
 * @returns Object with score information
 */
export const calculateExamScore = (
  questions: Question[],
  userAnswers: Record<string, string[]>
): {
  score: number;
  maxScore: number;
  percentage: number;
  answeredQuestions: number;
  correctQuestions: number;
} => {
  // Parameter validation
  if (!questions || !Array.isArray(questions)) {
    throw new Error('Questions must be an array');
  }
  
  if (!userAnswers || typeof userAnswers !== 'object') {
    throw new Error('User answers must be an object');
  }
  
  // Initialize counters
  let score = 0;
  let maxScore = 0;
  let answeredQuestions = 0;
  let correctQuestions = 0;
  
  // Calculate scores
  for (const question of questions) {
    // Add to max possible score
    maxScore += question.points;
    
    // Skip if question not answered
    if (!userAnswers[question.id] || userAnswers[question.id].length === 0) {
      continue;
    }
    
    answeredQuestions++;
    
    // Check if the answer is correct
    const isCorrect = isAnswerCorrect(question, userAnswers[question.id]);
    
    if (isCorrect) {
      score += question.points;
      correctQuestions++;
    }
  }
  
  // Calculate percentage (avoid division by zero)
  const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
  
  return {
    score,
    maxScore,
    percentage,
    answeredQuestions,
    correctQuestions,
  };
};

/**
 * Checks if an answer is correct based on the question type
 * 
 * @param question - The question to check
 * @param selectedOptions - The user's selected options
 * @returns True if the answer is correct
 */
const isAnswerCorrect = (
  question: Question,
  selectedOptions: string[]
): boolean => {
  switch (question.type) {
    case QuestionType.MULTIPLE_CHOICE: {
      const mcqQuestion = question as MultipleChoiceQuestion;
      
      // For multiple choice, check if selected options match correct options
      if (mcqQuestion.correctOptionIds.length !== selectedOptions.length) {
        return false;
      }
      
      return mcqQuestion.correctOptionIds.every(id => selectedOptions.includes(id));
    }
    
    case QuestionType.TRUE_FALSE: {
      // For true/false, just check the single selected option
      return question.correctOptionIds[0] === selectedOptions[0];
    }
    
    // Add cases for other question types
    
    default:
      return false;
  }
};

// With memoization for expensive calculations
export const memoizedCalculateScore = memoize(calculateExamScore);

/**
 * Simple memoization helper for expensive functions
 */
function memoize<Args extends any[], Result>(
  fn: (...args: Args) => Result
): (...args: Args) => Result {
  const cache = new Map<string, Result>();
  
  return (...args: Args): Result => {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key)!;
    }
    
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
```

## Utility Usage Example

```tsx
// Example component using utilities
import { formatTime, calculateExamScore } from '@/features/exams/utils';

const ExamResultSummary = ({ exam, userAnswers }) => {
  // Calculate the score
  const { score, maxScore, percentage, answeredQuestions, correctQuestions } = 
    calculateExamScore(exam.questions, userAnswers);
  
  // Format the time spent
  const formattedTime = formatTime(exam.timeSpent);
  
  return (
    <div>
      <h2>Exam Results</h2>
      <div>Score: {score} / {maxScore} ({percentage.toFixed(1)}%)</div>
      <div>Questions Answered: {answeredQuestions} / {exam.questions.length}</div>
      <div>Correct Answers: {correctQuestions}</div>
      <div>Time Spent: {formattedTime}</div>
    </div>
  );
};
```

## Verification Criteria
- All utilities follow consistent naming conventions
- Proper TypeScript types for parameters and return values
- Pure functions with no side effects
- Proper error handling and parameter validation
- Well-organized by domain and purpose
- JSDoc comments with examples
- Unit tests for all utilities
- Performance optimizations where appropriate

## Time Estimate
Approximately 6-8 hours

## Dependencies
- Task 01: Document Current Directory Structure and Identify Gaps
- Task 06: Organize and Document Types and Interfaces (partial dependency)

## Risks
- Changing utility functions could affect multiple components
- Performance optimizations may require extensive testing
- Some utilities may be tightly coupled to specific data structures
