# Exams Preparation Feature State Management

This module provides state management utilities for the exams-preparation feature, leveraging the core state utilities from `@/core/state`.

## Overview

The state management in this feature follows the "Core as Foundation" principle, which means:

1. All state management is built on core utilities, not reimplementing them
2. Feature-specific factories extend core functionality with feature-specific needs
3. Consistent patterns are used across all stores and contexts
4. Type safety is ensured through TypeScript

## Feature-Specific Store Factory

The feature-specific store factory (`createExamsStore`) enhances the core store factory with feature-specific functionality:

- Enhanced error handling with detailed context
- Debug mode for development
- Performance tracking
- Before and after action hooks
- Custom error handling
- Testing utilities

### Basic Usage

```typescript
import { createExamsStore } from '../state/storeFactory';

// Define your state interface
interface MyState {
  count: number;
  isLoading: boolean;
  error: string | null;
}

// Define your actions interface
interface MyActions {
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

// Create your store
export const useMyStore = createExamsStore<MyState, MyActions>(
  'myStore', // Store name
  // Initial state
  {
    count: 0,
    isLoading: false,
    error: null,
  },
  // Actions creator
  (set, get) => ({
    increment: () => set(state => ({ count: state.count + 1 })),
    decrement: () => set(state => ({ count: state.count - 1 })),
    reset: () => set({ count: 0 }),
    setLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error }),
  })
);
```

### With Persistence

```typescript
export const useMyPersistentStore = createExamsStore<MyState, MyActions>(
  'myPersistentStore',
  // Initial state
  {
    count: 0,
    isLoading: false,
    error: null,
  },
  // Actions creator
  (set, get) => ({
    // Actions implementation
  }),
  // Options
  {
    persist: true,
    storageKey: 'my-custom-storage-key', // Optional
    partialize: (state) => ({
      // Only persist these parts of the state
      count: state.count,
      // Exclude sensitive or transient data
    }),
  }
);
```

### With Optimized Selectors

```typescript
import { createExamsSelectors } from '../state/storeFactory';

// Create your store
export const useMyStore = createExamsStore<MyState, MyActions>(/* ... */);

// Create selectors for optimized rerenders
export const { createSelector } = createExamsSelectors(useMyStore);
export const useCount = createSelector(state => state.count);
export const useIsLoading = createSelector(state => state.isLoading);
export const useError = createSelector(state => state.error);

// Usage in components:
// function MyComponent() {
//   const count = useCount();
//   // Only rerenders when count changes, not when other state changes
// }
```

### Advanced Features

```typescript
export const useAdvancedStore = createExamsStore<MyState, MyActions>(
  'advancedStore',
  // Initial state
  {
    count: 0,
    isLoading: false,
    error: null,
  },
  // Actions creator
  (set, get) => ({
    // Actions implementation
  }),
  // Advanced options
  {
    debug: true, // Enable detailed logging
    trackPerformance: true, // Track action performance
    
    // Custom error handler
    errorHandler: (error, actionName, storeName) => {
      // Custom error handling logic
      customErrorService.report(error);
    },
    
    // Before action hook
    beforeAction: (actionName, args) => {
      analytics.trackAction(`${storeName}.${actionName}`, args);
    },
    
    // After action hook
    afterAction: (actionName, args, result) => {
      console.log(`Action ${actionName} completed`);
    },
  }
);
```

## Feature-Specific Context Factory

The feature-specific context factory (`createExamsContext`) enhances the core context factory with feature-specific functionality:

- Feature-specific naming and error handling
- Performance optimization with memoization
- Error boundary with fallback rendering
- React DevTools integration
- Detailed logging and debugging
- Testing utilities

### Basic Usage

```typescript
import { createExamsContext } from '../state/contextFactory';

// Define your state interface
interface MyContextState {
  isOpen: boolean;
  selectedId: string | null;
}

// Define your actions interface
interface MyContextActions {
  open: () => void;
  close: () => void;
  select: (id: string) => void;
  clear: () => void;
}

// Create context provider and hook
export const [MyContextProvider, useMyContext] = createExamsContext<
  MyContextState,
  MyContextActions
>(
  'MyContext', // Context name
  // Initial state
  {
    isOpen: false,
    selectedId: null,
  },
  // Actions creator
  (setState) => ({
    open: () => setState({ isOpen: true }),
    close: () => setState({ isOpen: false }),
    select: (id) => setState({ selectedId: id }),
    clear: () => setState({ selectedId: null }),
  })
);

// Usage in components:
// function App() {
//   return (
//     <MyContextProvider>
//       <MyComponent />
//     </MyContextProvider>
//   );
// }
// 
// function MyComponent() {
//   const { isOpen, open, close } = useMyContext();
//   // ...
// }
```

### With Selectors for Optimized Rendering

```typescript
// Create context with selectors
const [MyProvider, useMyContext, createSelector] = createExamsContext<MyState, MyActions>(
  'MyContext',
  initialState,
  (setState) => ({
    // actions implementation
  })
);

// Create optimized selectors
const useIsOpen = createSelector(state => state.isOpen);
const useSelectedId = createSelector(state => state.selectedId);

// Use in components for optimized renders
function OptimizedComponent() {
  // Only rerenders when isOpen changes, not when selectedId changes
  const isOpen = useIsOpen();
  return <div>{isOpen ? 'Open' : 'Closed'}</div>;
}
```

### With Error Boundary and DevTools

```typescript
// Create context with advanced options
const [MyProvider, useMyContext] = createExamsContext<MyState, MyActions>(
  'MyContext',
  initialState,
  (setState) => ({
    // actions implementation
  }),
  {
    // Enable error boundary for fault tolerance
    errorBoundary: true,
    
    // Enable React DevTools integration
    devTools: true,
    
    // Set logging level
    logLevel: LogLevel.DEBUG,
    
    // Custom error handler
    errorHandler: (error, errorType, contextName, actionName) => {
      // Custom error handling logic
      errorService.report(error);
    },
    
    // Performance tracking
    trackPerformance: true,
    
    // Action hooks
    beforeAction: (actionName, args) => {
      analytics.trackAction(`context.${actionName}`, args);
    },
    
    afterAction: (actionName, args, result) => {
      // Do something after action completes
    }
  }
);
```

### With Higher-Order Component

```typescript
import { withExamsContext } from '../state/contextFactory';

// Create HOC from provider
const withMyContext = withExamsContext(MyContextProvider);

// Use HOC to wrap a component
const EnhancedComponent = withMyContext(MyComponent);

// Usage with custom initial state:
// function App() {
//   return <EnhancedComponent providerProps={{ initialState: { isOpen: true } }} />;
// }
```

### Testing Context Components

```typescript
import { createTestProvider } from '../state/contextFactory';

// In a test file
describe('MyContextComponent', () => {
  // Create a test provider
  const testContext = createTestProvider<MyContextState, MyContextActions>(
    // Initial state for testing
    {
      isOpen: false,
      selectedId: null,
    },
    // Mock actions
    {
      open: jest.fn(),
      close: jest.fn(),
      select: jest.fn(),
      clear: jest.fn(),
    }
  );
  
  afterEach(() => {
    // Reset state between tests
    testContext.resetState();
    jest.clearAllMocks();
  });
  
  it('renders correctly with initial state', () => {
    render(
      <testContext.Provider>
        <MyComponent />
      </testContext.Provider>
    );
    
    expect(screen.getByText('Closed')).toBeInTheDocument();
  });
  
  it('calls open when button is clicked', () => {
    render(
      <testContext.Provider>
        <MyComponent />
      </testContext.Provider>
    );
    
    // Simulate user interaction
    fireEvent.click(screen.getByText('Open'));
    
    // Verify action was called
    expect(testContext.getActionMock('open')).toHaveBeenCalled();
  });
  
  it('updates when state changes', () => {
    render(
      <testContext.Provider>
        <MyComponent />
      </testContext.Provider>
    );
    
    // Update context state programmatically
    testContext.setState({ isOpen: true });
    
    // Verify component updated
    expect(screen.getByText('Open')).toBeInTheDocument();
  });
});
```

### Type Utilities for Context

```typescript
import { ExtractContextState, ExtractContextValue } from '../state/contextFactory';

// Create context
const [MyProvider, useMyContext] = createExamsContext<MyContextState, MyContextActions>(/* ... */);

// Extract state type
type ContextState = ExtractContextState<typeof MyProvider>;
// Result: MyContextState

// Extract context value type (state + actions)
type ContextValue = ExtractContextValue<typeof useMyContext>;
// Result: MyContextState & MyContextActions
```

## Testing

The state module includes utilities for testing stores and components that use stores:

```typescript
import { createTestStore } from '../state/storeFactory';

// In a test file
describe('MyComponent', () => {
  // Create a test store
  const testStore = createTestStore<MyState, MyActions>(
    // Initial state for testing
    {
      count: 0,
      isLoading: false,
      error: null,
    },
    // Mock actions as needed
    {
      increment: jest.fn(),
      decrement: jest.fn(),
      // Other actions can use default mocks
    }
  );
  
  afterEach(() => {
    // Clean up after each test
    testStore.cleanup();
    jest.clearAllMocks();
  });
  
  it('renders correctly with initial state', () => {
    render(<MyComponent />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });
  
  it('updates when state changes', () => {
    render(<MyComponent />);
    
    // Simulate state change
    testStore.setState({ count: 5 });
    
    expect(screen.getByText('Count: 5')).toBeInTheDocument();
  });
  
  it('calls increment when button is clicked', () => {
    render(<MyComponent />);
    
    // Simulate user interaction
    fireEvent.click(screen.getByText('Increment'));
    
    // Verify action was called
    expect(testStore.getActionMock('increment')).toHaveBeenCalled();
  });
});
```

## Type Utilities

The state module includes several type utilities:

```typescript
import { ExtractState, ExtractStateOnly, ExtractActions } from '../state/storeFactory';
import { ExtractContextState, ExtractContextValue } from '../state/contextFactory';

// Store type utilities
type MyStoreState = ExtractState<typeof useMyStore>;
type MyStateOnly = ExtractStateOnly<typeof useMyStore, MyState>;
type MyActionsOnly = ExtractActions<typeof useMyStore, MyActions>;

// Context type utilities
type ContextState = ExtractContextState<typeof MyProvider>;
type ContextValue = ExtractContextValue<typeof useMyContext>;
```

## Public API

All state management utilities are exported through `index.ts` for a clean public API:

```typescript
// Import from the feature index
import {
  createExamsStore,
  createExamsContext,
  withExamsContext,
  useMyStore,
  useCount,
  useIsLoading,
  MyContextProvider,
  useMyContext,
} from '@/features/exams-preparation/state';
```

## Best Practices

1. **Follow the "Core as Foundation" principle**
   - Always use feature-specific factories, not core factories directly
   - Don't reimplement patterns that exist in core

2. **Use TypeScript for type safety**
   - Define interfaces for state and actions
   - Use type utilities for type inference

3. **Create optimized selectors**
   - Use selectors to prevent unnecessary rerenders
   - Keep selectors focused on specific pieces of state

4. **Document your stores and contexts**
   - Add JSDoc comments for state and actions
   - Include usage examples for complex patterns

5. **Handle errors properly**
   - Use the built-in error handling
   - Consider adding custom error handlers for specific needs

6. **Test your stores and contexts**
   - Use the testing utilities
   - Test state changes and action calls

7. **Performance optimization**
   - Use memoization for context values
   - Use selectors for optimized rendering
   - Consider using React.memo for component optimization

8. **DevTools Integration**
   - Enable devTools option for better debugging
   - Use descriptive names for stores and contexts
