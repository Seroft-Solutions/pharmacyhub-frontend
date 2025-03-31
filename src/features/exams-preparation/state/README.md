# Exams Preparation State Management

This module provides a comprehensive state management system for the Exams Preparation feature. It follows the feature-specific state pattern, leveraging core state management utilities while adding feature-specific enhancements.

## Table of Contents

- [Architecture](#architecture)
- [Core Integration](#core-integration)
- [Public API](#public-api)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [Testing](#testing)

## Architecture

The state management architecture follows the Feature-First Organization and Core as Foundation principles:

1. **Feature-Specific Factories**: Extends core factories with feature-specific enhancements
2. **Categorized State Management**:
   - **Stores**: For complex state with persistence (using Zustand)
   - **Contexts**: For UI state and component-specific state
3. **Clear Public API**: Organized exports for better developer experience
4. **Performance Optimization**: Using selectors and memoization
5. **Comprehensive Error Handling**: Detailed error reporting and recovery
6. **Testing Utilities**: Tools for easy testing of state management

## Core Integration

The state management system integrates with core modules in the following ways:

1. **Core Store Factory**: Uses `createStore` from `@/core/state`
2. **Core Context Factory**: Uses `createContextProvider` from `@/core/state`
3. **Core Logging**: Uses `logger` from `@/core/utils/logger`
4. **Core Types**: Extends types from core modules

## Public API

The public API is organized into categories:

### Context Utilities

Tools for creating and managing React Contexts:

```typescript
import { 
  createExamsContext, 
  withExamsContext, 
  createTestProvider
} from '@/features/exams-preparation/state';

// Create a new context
const [MyProvider, useMyContext, createMySelector] = createExamsContext<MyState, MyActions>(
  'MyContext',
  initialState,
  actionsCreator,
  options
);

// Create a HOC
const withMyContext = withExamsContext(MyProvider);

// For testing
const testContext = createTestProvider(initialState, mockActions);
```

### Store Utilities

Tools for creating and managing Zustand stores:

```typescript
import { 
  createExamsStore, 
  createExamsSelectors, 
  createTestStore
} from '@/features/exams-preparation/state';

// Create a new store
const useMyStore = createExamsStore<MyState, MyActions>(
  'myStore',
  initialState,
  actionsCreator,
  options
);

// Create optimized selectors
const { createSelector } = createExamsSelectors(useMyStore);
const useMyValue = createSelector(state => state.value);

// For testing
const testStore = createTestStore(initialState, mockActions);
```

### Context Providers & Hooks

Ready-to-use contexts for the exams-preparation feature:

```typescript
import { 
  ExamFilterProvider, 
  useExamFilter,
  useHasActiveFilters,
  withExamFilters
} from '@/features/exams-preparation/state';

// Use context in components
function MyComponent() {
  const { status, setFilter } = useExamFilter();
  const hasFilters = useHasActiveFilters();
  // ...
}

// Wrap component with HOC
const EnhancedComponent = withExamFilters(MyComponent);
```

### Store Hooks & Selectors

Ready-to-use stores for the exams-preparation feature:

```typescript
import { 
  useExamStore, 
  useCurrentQuestion,
  useExamEditorStore,
  useQuestions
} from '@/features/exams-preparation/state';

// Use store directly
function MyComponent() {
  const exam = useExamStore(state => state.exam);
  
  // Or use selectors for optimized renders
  const currentQuestion = useCurrentQuestion();
  const questions = useQuestions();
  // ...
}
```

## Usage Examples

### Basic Component with Context

```tsx
import { useExamFilter } from '@/features/exams-preparation/state';

function ExamFilters() {
  const { status, difficulty, search, setFilter, clearFilters } = useExamFilter();
  
  return (
    <div className="filters">
      <input
        value={search || ''}
        onChange={(e) => setFilter('search', e.target.value)}
        placeholder="Search exams..."
      />
      
      <select 
        value={difficulty || ''} 
        onChange={(e) => setFilter('difficulty', e.target.value)}
      >
        <option value="">All Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      
      <button onClick={clearFilters}>Clear Filters</button>
    </div>
  );
}
```

### Component with Store and Selectors

```tsx
import { 
  useExamEditorStore, 
  useCurrentQuestionIndex, 
  useQuestions 
} from '@/features/exams-preparation/state';

function ExamEditor() {
  // Get actions from store
  const { addQuestion, updateQuestion, removeQuestion } = useExamEditorStore();
  
  // Use optimized selectors for values (only rerenders when values change)
  const currentIndex = useCurrentQuestionIndex();
  const questions = useQuestions();
  
  const handleAddQuestion = () => {
    addQuestion({ text: 'New Question', type: 'multipleChoice' });
  };
  
  return (
    <div>
      <button onClick={handleAddQuestion}>Add Question</button>
      <QuestionsList 
        questions={questions} 
        currentIndex={currentIndex}
        onUpdate={updateQuestion}
        onRemove={removeQuestion}
      />
    </div>
  );
}
```

### Provider Composition

```tsx
import { 
  ExamFilterProvider, 
  ExamSessionProvider 
} from '@/features/exams-preparation/state';

function ExamApp() {
  return (
    <ExamFilterProvider>
      <ExamSessionProvider>
        <ExamList />
        <ExamDetails />
      </ExamSessionProvider>
    </ExamFilterProvider>
  );
}
```

## Best Practices

1. **Use Selectors for Optimized Renders**:
   ```tsx
   // Instead of:
   const { questions, currentIndex } = useExamEditorStore();
   
   // Use:
   const questions = useQuestions();
   const currentIndex = useCurrentQuestionIndex();
   ```

2. **Separate Actions and State**:
   ```tsx
   // Get actions from store
   const { addQuestion, updateQuestion } = useExamEditorStore();
   
   // Get state from selectors
   const questions = useQuestions();
   ```

3. **Use Higher-Order Components for Composition**:
   ```tsx
   // Create enhanced component
   const ExamListWithFilters = withExamFilters(ExamList);
   
   // Use with initial state
   <ExamListWithFilters initialFilters={{ status: 'active' }} />
   ```

4. **Prefer Feature-Specific Factories over Core Factories**:
   ```tsx
   // Instead of:
   import { createContextProvider } from '@/core/state';
   
   // Use:
   import { createExamsContext } from '@/features/exams-preparation/state';
   ```

5. **Use Testing Utilities for Unit Tests**:
   ```tsx
   // Create test provider
   const testContext = createTestProvider(initialState, {
     setFilter: jest.fn(),
     clearFilters: jest.fn(),
   });
   
   // Use in tests
   render(
     <testContext.Provider>
       <MyComponent />
     </testContext.Provider>
   );
   ```

## Testing

The state module provides dedicated testing utilities for both stores and contexts:

### Testing Stores

```tsx
import { createTestStore } from '@/features/exams-preparation/state';

it('should handle actions correctly', () => {
  // Create test store
  const testStore = createTestStore<MyState, MyActions>(
    { count: 0 },
    {
      increment: jest.fn(),
      decrement: jest.fn(),
    }
  );
  
  // Render component with store
  render(<MyComponent />);
  
  // Trigger action
  fireEvent.click(screen.getByText('Increment'));
  
  // Check if action was called
  expect(testStore.getActionMock('increment')).toHaveBeenCalled();
  
  // Update state directly
  testStore.setState({ count: 5 });
  
  // Check if component updated
  expect(screen.getByText('Count: 5')).toBeInTheDocument();
});
```

### Testing Contexts

```tsx
import { createTestProvider } from '@/features/exams-preparation/state';

it('should handle context actions correctly', () => {
  // Create test provider
  const testContext = createTestProvider<MyState, MyActions>(
    { value: 'initial' },
    {
      setValue: jest.fn((value) => {
        testContext.setState({ value });
      }),
    }
  );
  
  // Render component with context
  render(
    <testContext.Provider>
      <MyComponent />
    </testContext.Provider>
  );
  
  // Trigger action
  fireEvent.change(screen.getByRole('textbox'), {
    target: { value: 'updated' },
  });
  
  // Check if action was called
  expect(testContext.getActionMock('setValue')).toHaveBeenCalledWith('updated');
  
  // Check if state updated
  expect(screen.getByText('Value: updated')).toBeInTheDocument();
});
```

## Additional Documentation

- [Stores README](./stores/README.md)
- [Contexts README](./contexts/README.md)
- [State Management Tutorial](../docs/state-management.md)
