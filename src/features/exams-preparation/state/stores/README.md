# Exams Preparation Stores

This directory contains Zustand stores for state management in the exams-preparation feature.

## Purpose

- Manage complex state that requires performance or has complex interactions
- Provide a centralized state management solution for the feature
- Handle feature-specific state that doesn't belong in core

## Guidelines

1. Use the core state management utilities and factories for creating stores
2. Keep stores focused on a specific domain of state
3. Create separate files for each store
4. Follow the established patterns for Zustand store design
5. Document the purpose and usage of each store

## When to Use Zustand vs. React Context

- **Use Zustand for**:
  - Complex state with many properties
  - State that updates frequently
  - State that requires performance optimization
  - State with computed values
  - State with complex actions

- **Use Context for**:
  - Simple UI state
  - State that updates infrequently
  - Feature flags or UI preferences

## Example Structure

```
stores/
  examAttemptStore.ts      # Store for exam attempt state
  examEditorStore.ts       # Store for exam editing state
  examListStore.ts         # Store for exam listing and filtering
  index.ts                 # Public exports
```

## Example Store

```ts
// Example store
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ExamAttemptState {
  // State properties
  currentQuestionIndex: number;
  answers: Record<string, string>;
  timeRemaining: number;
  isSubmitted: boolean;
  
  // Actions
  setCurrentQuestion: (index: number) => void;
  saveAnswer: (questionId: string, answer: string) => void;
  decrementTime: () => void;
  submitExam: () => void;
}

export const useExamAttemptStore = create<ExamAttemptState>()(
  devtools(
    (set, get) => ({
      // Initial state
      currentQuestionIndex: 0,
      answers: {},
      timeRemaining: 3600, // 1 hour in seconds
      isSubmitted: false,
      
      // Actions
      setCurrentQuestion: (index) => set({ currentQuestionIndex: index }),
      
      saveAnswer: (questionId, answer) => set((state) => ({
        answers: {
          ...state.answers,
          [questionId]: answer
        }
      })),
      
      decrementTime: () => set((state) => ({
        timeRemaining: Math.max(0, state.timeRemaining - 1)
      })),
      
      submitExam: () => set({ isSubmitted: true })
    }),
    { name: 'exam-attempt-store' }
  )
);
```
