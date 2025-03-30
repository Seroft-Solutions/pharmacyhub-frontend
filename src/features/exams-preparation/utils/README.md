# Exams Preparation Utilities

This directory contains utility functions specific to the exams-preparation feature.

## Purpose

- Provide reusable pure functions for common operations
- Handle data transformations and calculations
- Support components and hooks with shared functionality

## Guidelines

1. Utilities should be pure functions (same input → same output, no side effects)
2. Group related utilities in separate files
3. Document parameters and return values
4. Write unit tests for utilities
5. Leverage core utilities when possible

## Example Structure

```
utils/
  examScoring.ts          # Functions for calculating exam scores
  formatters.ts           # Functions for formatting exam-related data
  validators.ts           # Functions for validating exam-related data
  examAnalytics.ts        # Functions for analyzing exam performance
  index.ts                # Public exports
```

## Example Usage

```ts
// Example utility
export function calculateExamScore(
  answers: UserAnswer[],
  questions: ExamQuestion[]
): ExamScoreResult {
  const totalQuestions = questions.length;
  const attempted = answers.length;
  
  const correctAnswers = answers.filter(answer => {
    const question = questions.find(q => q.id === answer.questionId);
    return question && question.correctOptionId === answer.selectedOptionId;
  });
  
  const correct = correctAnswers.length;
  const incorrect = attempted - correct;
  const unattempted = totalQuestions - attempted;
  
  const scorePercentage = totalQuestions > 0 
    ? (correct / totalQuestions) * 100 
    : 0;
    
  return {
    totalQuestions,
    attempted,
    correct,
    incorrect,
    unattempted,
    scorePercentage: Math.round(scorePercentage * 10) / 10,
    passed: scorePercentage >= 70, // Pass threshold 70%
  };
}
```
