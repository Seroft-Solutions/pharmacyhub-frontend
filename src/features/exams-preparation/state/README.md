# Exams Preparation State Management

This directory contains state management code for the exams-preparation feature.

## Structure

- **stores/** - Zustand stores for complex state management
- **context/** - React Context for simple UI state
- **index.ts** - Public API exports
- **storeFactory.ts** - Factory functions for creating consistent stores
- **contextFactory.ts** - Factory functions for creating consistent contexts

## State Management Hierarchy

The exams-preparation feature follows the established state management hierarchy:

1. **Zustand Stores** - For feature-specific state that requires performance or has complex interactions
2. **TanStack Query** - For all server state management (implemented through the API module)
3. **React Context** - For simple, infrequently updating feature state

## Guidelines

1. Keep global state minimal and focused only on true cross-cutting concerns
2. Use the appropriate state management solution based on the requirements
3. Follow established patterns for state management
4. Leverage core utilities for creating stores and contexts
5. Document the purpose and usage of each state module

## Integration with Core

The state management in this feature should leverage core utilities:

- Use core state management factories to create consistent stores and contexts
- Follow established patterns for state organization
- Use the core API module for server state management with TanStack Query

## Example Usage

```tsx
// Example component using state management
import { useExamAttemptStore } from '../state/stores';
import { useExamFilter } from '../state/context';
import { useExamQuery } from '../api/hooks';

function ExamComponent() {
  // Server state from TanStack Query
  const { data: exam, isLoading } = useExamQuery(examId);
  
  // Client state from Zustand
  const { currentQuestionIndex, saveAnswer } = useExamAttemptStore();
  
  // UI state from Context
  const { filter, setFilter } = useExamFilter();
  
  // Component logic...
}
```
