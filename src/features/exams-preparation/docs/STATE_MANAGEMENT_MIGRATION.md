# State Management Migration Plan

This document outlines the step-by-step plan for migrating the exams-preparation feature's state management to fully align with the Core as Foundation principle.

## Current Status

- The `storeFactory.ts` has been promoted to core but is still being used locally in the feature
- The `contextFactory.ts` remains only in the feature and should be considered for promotion
- Several stores and contexts exist with varying degrees of adherence to best practices
- Some stores are too large and violate the single responsibility principle

## Migration Steps

### Phase 1: Update Imports (Immediate)

1. Find all imports of the local `storeFactory.ts` and update them to use core:

   ```typescript
   // Before
   import { createStore, createSelectors } from '../storeFactory';
   // or
   import { createStore, createSelectors } from '@/features/exams-preparation/state/storeFactory';

   // After
   import { createStore, createSelectors } from '@/core/state';
   ```

2. Add deprecation notes to any remaining local factory files:

   ```typescript
   /**
    * @deprecated Use the core implementation instead:
    * import { createStore, createSelectors } from '@/core/state';
    */
   ```

### Phase 2: Factory Promotion (Short-term)

1. Evaluate `contextFactory.ts` for promotion to core
2. Create a core PR for adding contextFactory to core
3. Once approved, migrate all contexts to use the core version

### Phase 3: Store Refactoring (Medium-term)

1. Break down `examStore` into more focused stores:
   - `examSessionStore`: Manages active exam session state
   - `examNavigationStore`: Manages question navigation
   - `examAnswersStore`: Manages user answers

2. Apply consistent patterns across all stores:
   - Use selectors consistently
   - Apply proper persistence strategy
   - Maintain clean separation of concerns

3. Merge overlapping stores where appropriate

### Phase 4: Context Optimization (Medium-term)

1. Evaluate each Context for appropriate usage
2. Convert TimerContext to a Zustand store for better performance
3. Ensure contexts are provided at the correct level in the component tree

### Phase 5: Testing & Documentation (Ongoing)

1. Add comprehensive tests for all state management
2. Update documentation to reflect the new structure
3. Create usage examples for new patterns

## Code Templates

### Core Store Usage Template

```typescript
// src/features/exams-preparation/state/stores/examNavigationStore.ts
import { createStore, createSelectors } from '@/core/state';
import { ExamNavigation } from '../../types';

// State interface
interface ExamNavigationState {
  currentQuestionIndex: number;
  visitedQuestions: Set<number>;
  totalQuestions: number;
}

// Actions interface
interface ExamNavigationActions {
  navigateToQuestion: (index: number) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  markVisited: (index: number) => void;
  setTotalQuestions: (count: number) => void;
  resetNavigation: () => void;
}

// Initial state
const initialState: ExamNavigationState = {
  currentQuestionIndex: 0,
  visitedQuestions: new Set<number>(),
  totalQuestions: 0,
};

// Create store
export const useExamNavigationStore = createStore<ExamNavigationState, ExamNavigationActions>(
  'exams-preparation-navigation',
  initialState,
  (set, get) => ({
    navigateToQuestion: (index) => {
      set((state) => {
        // Boundary check
        if (index < 0 || index >= state.totalQuestions) {
          return state;
        }
        
        // Create new visited set with this index
        const newVisited = new Set(state.visitedQuestions);
        newVisited.add(index);
        
        return {
          currentQuestionIndex: index,
          visitedQuestions: newVisited,
        };
      });
    },
    
    nextQuestion: () => {
      const { currentQuestionIndex, totalQuestions } = get();
      if (currentQuestionIndex < totalQuestions - 1) {
        get().navigateToQuestion(currentQuestionIndex + 1);
      }
    },
    
    previousQuestion: () => {
      const { currentQuestionIndex } = get();
      if (currentQuestionIndex > 0) {
        get().navigateToQuestion(currentQuestionIndex - 1);
      }
    },
    
    markVisited: (index) => {
      set((state) => {
        const newVisited = new Set(state.visitedQuestions);
        newVisited.add(index);
        return { visitedQuestions: newVisited };
      });
    },
    
    setTotalQuestions: (count) => {
      set({ totalQuestions: count });
    },
    
    resetNavigation: () => {
      set({
        currentQuestionIndex: 0,
        visitedQuestions: new Set<number>(),
      });
    },
  }),
  {
    persist: true,
    storageKey: 'exams-preparation-navigation',
    partialize: (state) => ({
      currentQuestionIndex: state.currentQuestionIndex,
      visitedQuestions: Array.from(state.visitedQuestions),
      totalQuestions: state.totalQuestions,
    }),
    onRehydrateStorage: (state) => {
      return (rehydratedState) => {
        if (rehydratedState) {
          // Convert arrays back to Sets after rehydration
          rehydratedState.visitedQuestions = new Set(
            rehydratedState.visitedQuestions || []
          );
        }
      };
    },
  }
);

// Create selectors
export const { createSelector } = createSelectors(useExamNavigationStore);

export const useCurrentQuestionIndex = createSelector(state => state.currentQuestionIndex);
export const useVisitedQuestions = createSelector(state => state.visitedQuestions);
export const useTotalQuestions = createSelector(state => state.totalQuestions);
export const useNavigationActions = createSelector(state => ({
  navigateToQuestion: state.navigateToQuestion,
  nextQuestion: state.nextQuestion,
  previousQuestion: state.previousQuestion,
}));
```

## Benefits of Migration

1. **Consistency**: All state management follows core patterns
2. **Maintainability**: Smaller, focused stores are easier to understand and maintain
3. **Performance**: Proper use of selectors and smaller contexts improve rendering performance
4. **Reusability**: Core utilities can be reused across other features
5. **Scalability**: Pattern can scale to handle new requirements

This migration plan provides a clear path forward for bringing the exams-preparation feature's state management in line with architecture principles while ensuring minimal disruption to existing functionality.
