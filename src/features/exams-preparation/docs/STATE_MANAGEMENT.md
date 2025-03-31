# Exams Preparation Feature - State Management

This document outlines the state management approach for the Exams Preparation feature, focusing on how it leverages core state management utilities to ensure consistency, reduce duplication, and follow the "core as foundation" principle.

## Core as Foundation Principle

The Exams Preparation feature strictly follows the "Core as Foundation" principle by:

1. Using core state management utilities instead of reimplementing patterns
2. Leveraging core factories to create feature-specific state
3. Following established patterns for consistency across the application
4. Building feature-specific functionality on top of core foundations

## State Management Hierarchy

Following the project guidelines, the feature uses:

1. **TanStack Query** (via core API module) for all server state
   - Fetching exams, questions, and results
   - Submitting exam answers and results
   
2. **Zustand Stores** (via core factory) for complex client state
   - Exam taking experience
   - Exam creation and editing
   - User's attempts and progress
   
3. **React Context** (via core factory) for simple UI state
   - Filters for exam listings
   - UI-specific state that doesn't need persistence

## Core State Management Utilities

The feature leverages these core utilities:

### Zustand Store Factory

```tsx
// Core store factory
import { createStoreFactory } from '@/core/state';

// Feature-specific store factory
export const createExamsStore = createStoreFactory('exams-preparation');

// Using the factory to create a store
export const useExamStore = createExamsStore<ExamState, ExamActions>(
  'exam',
  initialState,
  (set, get) => ({
    // Actions implementation...
  }),
  {
    persist: true,
    partialize: (state) => ({
      // Persistence configuration...
    }),
  }
);
```

### Context Provider Factory

```tsx
// Core context factory
import { createContextProvider } from '@/core/state';

// Creating a context provider
export const [ExamFilterProvider, useExamFilter] = createContextProvider<
  ExamFilters, 
  {
    setFilter: <K extends keyof ExamFilters>(key: K, value: ExamFilters[K]) => void;
    clearFilters: () => void;
  }
>(
  'ExamFilter',
  {}, // Initial state
  (setState) => ({
    // Actions implementation...
  }),
  {
    displayName: 'ExamFilterContext',
  }
);
```

### Selector Optimization

```tsx
// Core selector utilities
import { createSelectors } from '@/core/state';

// Creating optimized selectors
export const { createSelector } = createSelectors(useExamStore);

export const useExamProgress = createSelector(state => ({
  current: state.currentQuestionIndex + 1,
  total: state.questions.length,
  percentage: state.getCompletionPercentage(),
  answered: state.getAnsweredQuestionsCount(),
}));
```

## Feature State Overview

### Stores

1. **examStore**: Core exam taking experience
   - Managing questions, answers, and navigation
   - Tracking exam timing
   - Handling exam completion

2. **examEditorStore**: Exam creation and editing
   - Managing question creation
   - Handling form state and validation
   - Supporting exam configuration

3. **examAttemptStore**: User's attempts at exams
   - Tracking attempt progress
   - Managing answers and results
   - Handling submission

4. **examPreparationStore**: Overall state
   - Managing available exams
   - Tracking loading and error states
   - Handling user preferences

### Context Providers

1. **ExamFilterContext**: Filters for exam listings
   - Filter criteria (status, difficulty, etc.)
   - Search functionality
   - Filter clearing

2. **ExamSessionContext**: Current exam session info
   - Session status
   - User progress
   - Temporary session data

3. **QuestionContext**: Question-specific UI state
   - Question interaction state
   - UI feedback for questions
   - Temporary question-related data

4. **TimerContext**: Exam timer functionality
   - Timer display
   - Pause/resume functionality
   - Time warnings

## Best Practices

1. **Use selectors for performance optimization**
   - Create specific selectors for components
   - Avoid unnecessary re-renders
   - Use `createSelector` from core utilities

2. **Minimize global state**
   - Keep state close to where it's used
   - Use React Context for UI-specific state
   - Use Zustand only for complex state that needs to be shared

3. **Follow core patterns**
   - Use core factories and utilities
   - Follow established naming conventions
   - Document any feature-specific patterns

4. **Separate concerns**
   - Keep API state in TanStack Query
   - Use Zustand for complex client state
   - Use Context for simple UI state

## Migration Notes

The state management utilities in this feature were initially developed within the feature and later promoted to core to establish consistent patterns across the application. The feature now leverages these core utilities rather than maintaining its own implementations.

This transition demonstrates how successful patterns can be identified in feature development and then promoted to core for wider use, reflecting the evolutionary nature of our architecture.
