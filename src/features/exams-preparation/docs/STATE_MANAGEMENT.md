# Exams Preparation Feature - State Management

This document provides comprehensive documentation for the state management system in the Exams Preparation feature. It follows the feature-specific state pattern, leveraging core state management utilities while adding feature-specific enhancements.

## Table of Contents

- [Architecture](#architecture)
  - [Core as Foundation Principle](#core-as-foundation-principle)
  - [State Management Hierarchy](#state-management-hierarchy)
  - [Feature-Specific Factories](#feature-specific-factories)
- [State Categories](#state-categories)
  - [Stores](#stores)
  - [Contexts](#contexts)
- [Implementation Guide](#implementation-guide)
  - [Store Implementation](#store-implementation)
  - [Context Implementation](#context-implementation)
  - [Selector Optimization](#selector-optimization)
- [Public API](#public-api)
  - [Factory Exports](#factory-exports)
  - [Store Exports](#store-exports)
  - [Context Exports](#context-exports)
- [Usage Guide](#usage-guide)
  - [Basic Usage](#basic-usage)
  - [Advanced Usage](#advanced-usage)
  - [Testing](#testing)
- [Best Practices](#best-practices)
  - [Performance Optimization](#performance-optimization)
  - [State Organization](#state-organization)
  - [Error Handling](#error-handling)
- [Migration Guide](#migration-guide)
- [Common Patterns](#common-patterns)
- [FAQ](#faq)

## Architecture

### Core as Foundation Principle

The Exams Preparation feature strictly follows the "Core as Foundation" principle by:

1. **Using core state management utilities**:
   - Leverages `createStore` and `createContextProvider` from `@/core/state`
   - Uses `createSelectors` for performance optimization
   - Uses core logging and utility functions

2. **Building feature-specific extensions**:
   - Extends core factories with feature-specific enhancements
   - Adds error handling and recovery specific to exams feature
   - Provides consistent patterns for exam-related state

3. **Avoiding duplication of core functionality**:
   - No reimplementation of state management patterns
   - No custom store or context implementation
   - Extensions are strictly additive to core capabilities

### State Management Hierarchy

Following the project guidelines, the feature uses a clear hierarchy for state management:

1. **TanStack Query** (via core API module) for all server state
   - Fetching exams, questions, and results
   - Submitting exam answers and results
   - Handling pagination, caching, and refetching
   
2. **Zustand Stores** (via core factory) for complex client state
   - Exam taking experience (`examStore`)
   - Exam creation and editing (`examEditorStore`)
   - User's attempts and progress (`examAttemptStore`)
   - Overall exam state (`examPreparationStore`)
   
3. **React Context** (via core factory) for simple UI state
   - Filters for exam listings (`ExamFilterContext`)
   - Session management (`ExamSessionContext`)
   - Question-specific UI state (`QuestionContext`)
   - Timer functionality (`TimerContext`)

### Feature-Specific Factories

The feature defines two factory functions that extend core capabilities:

1. **`createExamsStore`**: A factory for creating feature-specific Zustand stores
   - Enhanced error handling and logging
   - Performance tracking in development
   - Testing utilities for easier unit testing

2. **`createExamsContext`**: A factory for creating feature-specific React contexts
   - Memoization for optimal performance
   - Error boundaries for fault tolerance
   - DevTools integration for debugging
   - Selector pattern for fine-grained updates

## State Categories

### Stores

1. **`examStore`**: Core exam taking experience
   - **Purpose**: Manage the state for taking an exam
   - **Key Features**:
     - Question navigation and tracking
     - Answer submission and validation
     - Timing and progress tracking
     - Exam completion handling

   ```typescript
   // Example usage
   import { useExamStore, useCurrentQuestion } from '@/features/exams-preparation/state';
   
   function ExamQuestion() {
     // Direct store access
     const { submitAnswer, nextQuestion } = useExamStore();
     
     // Optimized selector
     const currentQuestion = useCurrentQuestion();
     
     // Component implementation...
   }
   ```

2. **`examEditorStore`**: Exam creation and editing
   - **Purpose**: Manage the state for creating and editing exams
   - **Key Features**:
     - Question creation and editing
     - Form validation
     - Drag-and-drop reordering
     - Undo/redo functionality

   ```typescript
   // Example usage
   import { 
     useExamEditorStore, 
     useQuestions, 
     useValidation 
   } from '@/features/exams-preparation/state';
   
   function ExamEditor() {
     // Direct store access
     const { addQuestion, updateQuestion } = useExamEditorStore();
     
     // Optimized selectors
     const questions = useQuestions();
     const validation = useValidation();
     
     // Component implementation...
   }
   ```

3. **`examAttemptStore`**: User's attempts at exams
   - **Purpose**: Track user's attempt progress and submission
   - **Key Features**:
     - Answer tracking
     - Progress persistence
     - Submission management
     - Result handling

4. **`examPreparationStore`**: Overall preparation state
   - **Purpose**: Manage overall exam preparation state
   - **Key Features**:
     - Available exams listing
     - Loading and error states
     - User preferences
     - Study statistics

### Contexts

1. **`ExamFilterContext`**: Filters for exam listings
   - **Purpose**: Manage filter state for exam listings
   - **Key Features**:
     - Status, difficulty, and search filters
     - Filter persistence
     - Clear filters functionality

   ```typescript
   // Example usage
   import { 
     useExamFilter, 
     useHasActiveFilters 
   } from '@/features/exams-preparation/state';
   
   function ExamFilters() {
     // Get filter state and actions
     const { status, difficulty, setFilter, clearFilters } = useExamFilter();
     
     // Optimized selector
     const hasFilters = useHasActiveFilters();
     
     // Component implementation...
   }
   ```

2. **`ExamSessionContext`**: Current exam session info
   - **Purpose**: Manage session state for current exam
   - **Key Features**:
     - Session status (active, paused, etc.)
     - Session metadata
     - User progress in session

3. **`QuestionContext`**: Question-specific UI state
   - **Purpose**: Manage UI state for individual questions
   - **Key Features**:
     - Interaction state (expanded, answered, etc.)
     - UI feedback (correct, incorrect, etc.)
     - Animation state

4. **`TimerContext`**: Exam timer functionality
   - **Purpose**: Manage timer state for exams
   - **Key Features**:
     - Time tracking
     - Pause/resume functionality
     - Time warnings
     - Auto-submission on time expiry

## Implementation Guide

### Store Implementation

To create a new store in the exams-preparation feature:

1. Create a new file in the `state/stores` directory
2. Import the feature-specific factory
3. Define your state and actions interfaces
4. Create the store using the factory
5. Export the store and selectors

```typescript
// state/stores/myStore.ts
import { createExamsStore, createExamsSelectors } from '../storeFactory';

// Define your state interface
interface MyState {
  value: string;
  count: number;
}

// Define your actions interface
interface MyActions {
  setValue: (value: string) => void;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

// Create the store
export const myStore = createExamsStore<MyState, MyActions>(
  'myStore', // Store name
  // Initial state
  {
    value: '',
    count: 0,
  },
  // Actions creator
  (set, get) => ({
    setValue: (value) => set({ value }),
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
    reset: () => set({ value: '', count: 0 }),
  }),
  // Options
  {
    persist: true, // Enable persistence
    partialize: (state) => ({
      // Only persist certain properties
      count: state.count,
    }),
    debug: process.env.NODE_ENV === 'development',
  }
);

// Create selectors
export const { useStore: useMyStore, createSelector } = createExamsSelectors(myStore);

// Export optimized selectors
export const useValue = createSelector((state) => state.value);
export const useCount = createSelector((state) => state.count);
export const useIsEmpty = createSelector((state) => state.value === '');
```

### Context Implementation

To create a new context in the exams-preparation feature:

1. Create a new file in the `state/contexts` directory
2. Import the feature-specific factory
3. Define your state and actions interfaces
4. Create the context using the factory
5. Export the provider, hook, and higher-order component

```typescript
// state/contexts/MyContext.tsx
import { ReactNode } from 'react';
import { createExamsContext, withExamsContext, ExamsContextOptions } from '../contextFactory';

// Define your state interface
interface MyState {
  isOpen: boolean;
  theme: 'light' | 'dark';
}

// Define your actions interface
interface MyActions {
  toggleOpen: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

// Configuration options
const contextOptions: ExamsContextOptions = {
  displayName: 'MyContext',
  debug: process.env.NODE_ENV === 'development',
  memoize: true,
  errorBoundary: true,
};

// Create the context
export const [MyProvider, useMyContext, createMySelector] = createExamsContext<
  MyState,
  MyActions
>(
  'My', // Context name
  // Initial state
  {
    isOpen: false,
    theme: 'light',
  },
  // Actions creator
  (setState) => ({
    toggleOpen: () => setState((prev) => ({ isOpen: !prev.isOpen })),
    setTheme: (theme) => setState({ theme }),
  }),
  contextOptions
);

// Create HOC for easy usage
export const withMyContext = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P & { initialState?: Partial<MyState> }> => {
  const Enhanced = withExamsContext<P, MyState>(MyProvider)(Component);
  
  // Return component with initialState handling
  return ({ initialState, ...props }) => (
    <MyProvider initialState={initialState}>
      <Component {...props as P} />
    </MyProvider>
  );
};

// Create selectors for optimized rendering
export const useIsOpen = createMySelector((state) => state.isOpen);
export const useTheme = createMySelector((state) => state.theme);
```

### Selector Optimization

Selectors are used to optimize component rendering by only re-rendering when the selected values change:

1. **Store Selectors**:

```typescript
// Create selectors using the factory
export const { createSelector } = createExamsSelectors(useExamStore);

// Create optimized selectors
export const useExamProgress = createSelector((state) => ({
  current: state.currentQuestionIndex + 1,
  total: state.questions.length,
  percentage: Math.round((state.currentQuestionIndex + 1) / state.questions.length * 100),
}));

export const useCurrentQuestion = createSelector(
  (state) => state.questions[state.currentQuestionIndex]
);
```

2. **Context Selectors**:

```typescript
// Create selectors using the factory
export const [MyProvider, useMyContext, createMySelector] = createExamsContext(...);

// Create optimized selectors
export const useIsOpen = createMySelector((state) => state.isOpen);
export const useTheme = createMySelector((state) => state.theme);
```

## Public API

The state module provides a clean, well-documented public API organized into categories:

### Factory Exports

```typescript
import { 
  // Store factory
  createExamsStore,
  createExamsSelectors,
  createTestStore,
  
  // Context factory
  createExamsContext,
  withExamsContext,
  createTestProvider,
} from '@/features/exams-preparation/state';
```

### Store Exports

```typescript
import {
  // Stores
  useExamStore,
  useExamEditorStore,
  useExamAttemptStore,
  useExamPreparationStore,
  
  // Selectors
  useCurrentQuestion,
  useExamProgress,
  useQuestions,
  useIsDirty,
  // ... and many more
} from '@/features/exams-preparation/state';
```

### Context Exports

```typescript
import {
  // Providers
  ExamFilterProvider,
  ExamSessionProvider,
  QuestionProvider,
  TimerProvider,
  
  // Hooks
  useExamFilter,
  useExamSession,
  useQuestion,
  useTimer,
  
  // Selectors
  useHasActiveFilters,
  useFilterValues,
  
  // HOCs
  withExamFilters,
} from '@/features/exams-preparation/state';
```

## Usage Guide

### Basic Usage

1. **Using a Store**:

```typescript
import { useExamStore, useCurrentQuestion } from '@/features/exams-preparation/state';

function ExamQuestion() {
  // Get actions from the store
  const { submitAnswer, nextQuestion } = useExamStore();
  
  // Use an optimized selector for data
  const currentQuestion = useCurrentQuestion();
  
  const handleAnswer = (answerId: string) => {
    submitAnswer(currentQuestion.id, answerId);
    nextQuestion();
  };
  
  return (
    <div>
      <h2>{currentQuestion.text}</h2>
      <div className="options">
        {currentQuestion.options.map((option) => (
          <button key={option.id} onClick={() => handleAnswer(option.id)}>
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
}
```

2. **Using a Context**:

```typescript
import { 
  useExamFilter, 
  useHasActiveFilters 
} from '@/features/exams-preparation/state';

function ExamFilters() {
  // Get state and actions from context
  const { status, difficulty, setFilter, clearFilters } = useExamFilter();
  
  // Use an optimized selector
  const hasFilters = useHasActiveFilters();
  
  return (
    <div className="filters">
      <select
        value={status || ''}
        onChange={(e) => setFilter('status', e.target.value || undefined)}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
      
      {hasFilters && (
        <button onClick={clearFilters}>Clear Filters</button>
      )}
    </div>
  );
}
```

3. **Using a Provider**:

```typescript
import { ExamFilterProvider } from '@/features/exams-preparation/state';

function ExamListPage() {
  return (
    <ExamFilterProvider>
      <ExamFilters />
      <ExamsList />
    </ExamFilterProvider>
  );
}
```

### Advanced Usage

1. **Creating a Custom Store**:

```typescript
import { createExamsStore } from '@/features/exams-preparation/state';

// Create a custom store
const useCustomStore = createExamsStore<CustomState, CustomActions>(
  'customStore',
  initialState,
  (set, get) => ({
    // Actions implementation
  }),
  {
    persist: true,
    debug: true,
  }
);
```

2. **Creating a Custom Context**:

```typescript
import { createExamsContext } from '@/features/exams-preparation/state';

// Create a custom context
const [CustomProvider, useCustomContext, createCustomSelector] = createExamsContext<
  CustomState,
  CustomActions
>(
  'Custom',
  initialState,
  (setState) => ({
    // Actions implementation
  }),
  {
    memoize: true,
    errorBoundary: true,
  }
);
```

3. **Composing Multiple Providers**:

```typescript
import {
  ExamFilterProvider,
  ExamSessionProvider,
  QuestionProvider,
  TimerProvider,
} from '@/features/exams-preparation/state';

function ExamApp() {
  return (
    <ExamFilterProvider>
      <ExamSessionProvider>
        <QuestionProvider>
          <TimerProvider>
            <ExamContent />
          </TimerProvider>
        </QuestionProvider>
      </ExamSessionProvider>
    </ExamFilterProvider>
  );
}
```

### Testing

1. **Testing a Store**:

```typescript
import { createTestStore } from '@/features/exams-preparation/state';

it('should handle actions correctly', () => {
  // Create a test store
  const testStore = createTestStore<MyState, MyActions>(
    { count: 0 },
    {
      increment: jest.fn(),
      decrement: jest.fn(),
    }
  );
  
  // Render component
  render(<MyComponent />);
  
  // Trigger action
  fireEvent.click(screen.getByText('Increment'));
  
  // Verify action was called
  expect(testStore.getActionMock('increment')).toHaveBeenCalled();
  
  // Update state directly for testing
  testStore.setState({ count: 5 });
  
  // Verify component updated
  expect(screen.getByText('Count: 5')).toBeInTheDocument();
});
```

2. **Testing a Context**:

```typescript
import { createTestProvider } from '@/features/exams-preparation/state';

it('should handle context actions correctly', () => {
  // Create a test provider
  const testContext = createTestProvider<MyState, MyActions>(
    { isOpen: false },
    {
      toggleOpen: jest.fn(() => {
        // Update state for testing
        testContext.setState({ isOpen: true });
      }),
    }
  );
  
  // Render component with test provider
  render(
    <testContext.Provider>
      <MyComponent />
    </testContext.Provider>
  );
  
  // Trigger action
  fireEvent.click(screen.getByText('Toggle'));
  
  // Verify action was called
  expect(testContext.getActionMock('toggleOpen')).toHaveBeenCalled();
  
  // Verify component updated
  expect(screen.getByText('Status: Open')).toBeInTheDocument();
});
```

## Best Practices

### Performance Optimization

1. **Use Selectors for Optimized Renders**:
   ```typescript
   // Instead of:
   const { questions, currentIndex } = useExamStore();
   
   // Use:
   const questions = useQuestions();
   const currentIndex = useCurrentQuestionIndex();
   ```

2. **Memoize Components When Appropriate**:
   ```typescript
   // Memoize components that use selectors
   const QuestionView = React.memo(function QuestionView() {
     const question = useCurrentQuestion();
     return <div>{question.text}</div>;
   });
   ```

3. **Use Batch Updates**:
   ```typescript
   // Instead of multiple sets:
   set({ loading: true });
   set({ data: result });
   set({ loading: false });
   
   // Use batch update:
   set({
     loading: true,
     data: result,
     loading: false,
   });
   ```

### State Organization

1. **Keep State Close to Where It's Used**:
   - Use context for component-specific state
   - Use Zustand only for state that needs to be shared widely

2. **Split Large Stores**:
   - Break down large stores into smaller, focused stores
   - Use composition to combine stores when needed

3. **Use Clear Interfaces**:
   - Define proper TypeScript interfaces for state and actions
   - Document the purpose and usage of each state property

### Error Handling

1. **Use Error Boundaries for Contexts**:
   ```typescript
   // Enable error boundary in context options
   const contextOptions = {
     errorBoundary: true,
   };
   ```

2. **Handle Errors in Actions**:
   ```typescript
   // Handle errors in actions
   const actions = {
     fetchData: async () => {
       try {
         set({ loading: true });
         const result = await api.getData();
         set({ data: result, loading: false });
       } catch (error) {
         set({ error, loading: false });
         logger.error('Failed to fetch data:', error);
       }
     },
   };
   ```

3. **Use Custom Error Handlers**:
   ```typescript
   // Define custom error handler
   const errorHandler = (error, actionName, storeName) => {
     // Custom error handling logic
     errorReportingService.report(error);
   };
   
   // Use in store options
   const storeOptions = {
     errorHandler,
   };
   ```

## Migration Guide

The state management utilities in this feature were initially developed within the feature and later promoted to core to establish consistent patterns across the application. If you're migrating from old state patterns to the new ones:

1. **From Direct Zustand**:

```typescript
// Old approach
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
}));

// New approach
import { createExamsStore } from '@/features/exams-preparation/state';

const useStore = createExamsStore(
  'myStore',
  { count: 0 },
  (set) => ({
    increment: () => set((state) => ({ count: state.count + 1 })),
  })
);
```

2. **From Direct Context**:

```typescript
// Old approach
import { createContext, useContext, useState } from 'react';

const MyContext = createContext(null);

const MyProvider = ({ children }) => {
  const [state, setState] = useState({ value: '' });
  return <MyContext.Provider value={state}>{children}</MyContext.Provider>;
};

const useMyContext = () => useContext(MyContext);

// New approach
import { createExamsContext } from '@/features/exams-preparation/state';

const [MyProvider, useMyContext] = createExamsContext(
  'My',
  { value: '' },
  (setState) => ({
    setValue: (value) => setState({ value }),
  })
);
```

## Common Patterns

1. **Form State Management**:

```typescript
const useFormStore = createExamsStore(
  'form',
  { 
    values: {},
    errors: {},
    touched: {},
    isSubmitting: false,
  },
  (set, get) => ({
    setValue: (field, value) => set((state) => ({
      values: { ...state.values, [field]: value },
      touched: { ...state.touched, [field]: true },
    })),
    
    validate: () => {
      const { values } = get();
      const errors = {};
      
      // Validation logic
      if (!values.name) errors.name = 'Name is required';
      if (!values.email) errors.email = 'Email is required';
      
      set({ errors });
      return Object.keys(errors).length === 0;
    },
    
    submit: async () => {
      if (!get().validate()) return;
      
      set({ isSubmitting: true });
      try {
        // Submit logic
        await api.submit(get().values);
        set({ isSubmitting: false });
      } catch (error) {
        set({ isSubmitting: false, error });
      }
    },
  })
);
```

2. **List Filter Pattern**:

```typescript
const [FilterProvider, useFilter, createFilterSelector] = createExamsContext(
  'Filter',
  {
    search: '',
    status: undefined,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  },
  (setState) => ({
    setSearch: (search) => setState({ search }),
    setStatus: (status) => setState({ status }),
    setSort: (sortBy, sortOrder) => setState({ sortBy, sortOrder }),
    clearFilters: () => setState({
      search: '',
      status: undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }),
  })
);

// Create optimized selectors
const useFilterParams = createFilterSelector((state) => ({
  search: state.search,
  status: state.status,
  sort: `${state.sortBy}:${state.sortOrder}`,
}));
```

## FAQ

### When should I use a Store vs. Context?

- **Use Store** for:
  - Complex state with many properties
  - State that needs persistence
  - State that's accessed by many components
  - State with complex updates and actions

- **Use Context** for:
  - Simple UI state
  - State tied to a specific component tree
  - Theme, localization, or preferences
  - Infrequently updating state

### How do I optimize performance?

1. Use selectors to prevent unnecessary re-renders
2. Memoize components when appropriate
3. Use context selectors for fine-grained updates
4. Split large stores into smaller, focused stores

### How do I test components that use state?

1. Use `createTestStore` for testing stores
2. Use `createTestProvider` for testing contexts
3. Mock actions as needed for unit tests
4. Use setState directly for testing state changes

### Can I create my own state management pattern?

No, you should use the provided utilities to ensure consistency across the application. If you need functionality that isn't provided, consider extending the core utilities or proposing enhancements to the core state management system.
