# Context State Management

This directory contains React Context-based state management for the Exams Preparation feature. All contexts follow the feature-specific context factory pattern to ensure consistency and leverage core state management utilities.

## Contexts Overview

| Context | Description | Use Case |
|---------|-------------|----------|
| [ExamFilterContext](#examfiltercontext) | Manages filtering state for exam listings | Filtering UI components, exam lists |
| ExamSessionContext | Manages active exam session state | Exam taking flow |
| QuestionContext | Manages state for individual questions | Question rendering and interaction |
| TimerContext | Manages exam timer state | Exam timer display and logic |

## Context Implementation Pattern

All contexts in this feature follow a consistent implementation pattern:

1. Use the feature-specific `createExamsContext` factory to create the context
2. Define proper TypeScript interfaces for state and actions
3. Leverage performance optimization through memoization
4. Include comprehensive error handling and recovery
5. Export selectors for optimized rerenders
6. Include comprehensive documentation
7. Include tests

## ExamFilterContext

The ExamFilterContext manages filtering state for exam listings, providing a type-safe way to filter exams by various criteria.

### Features

- Type-safe filter management
- Memoized context value for optimal renders
- Comprehensive error handling and recovery
- Performance monitoring (in development)
- DevTools integration for easy debugging

### Usage

```tsx
// Basic usage
import { useExamFilter } from '@/features/exams-preparation/state';

function ExamFilters() {
  const { status, search, difficulty, setFilter, clearFilters } = useExamFilter();
  
  return (
    <div className="filters">
      <input
        value={search || ''}
        onChange={(e) => setFilter('search', e.target.value)}
        placeholder="Search exams..."
      />
      
      <select 
        value={status || ''} 
        onChange={(e) => setFilter('status', e.target.value)}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="completed">Completed</option>
      </select>
      
      <button onClick={clearFilters}>Clear Filters</button>
    </div>
  );
}
```

### Optimized Usage with Selectors

```tsx
// Optimized usage with selectors
import { 
  useExamFilter, 
  useFilterValues, 
  useHasActiveFilters 
} from '@/features/exams-preparation/state';

// This component only rerenders when filter values change
function FilterValues() {
  const values = useFilterValues();
  return <div>Active filters: {JSON.stringify(values)}</div>;
}

// This component only rerenders when the boolean state changes
function FilterIndicator() {
  const hasFilters = useHasActiveFilters();
  return hasFilters ? <Badge>Filtered</Badge> : null;
}

// This component only rerenders when actions are called
function FilterActions() {
  const { setFilter, clearFilters } = useExamFilter();
  
  return (
    <div>
      <button onClick={() => setFilter('status', 'active')}>Set Active</button>
      <button onClick={clearFilters}>Clear All</button>
    </div>
  );
}
```

### Higher-Order Component

```tsx
// Using the HOC
import { withExamFilters } from '@/features/exams-preparation/state';

function ExamList({ status, data }) {
  // Component implementation
}

// Wrap with HOC
const ExamListWithFilters = withExamFilters(ExamList);

// Use with initial filters
<ExamListWithFilters initialFilters={{ status: 'active' }} />
```

## Technical Details

The ExamFilterContext implementation leverages the feature-specific `createExamsContext` factory which builds on the core context factory. This provides:

1. **Enhanced Error Handling**:
   - Custom error boundaries to prevent UI crashes
   - Detailed error logging with contextual information
   - Error recovery mechanisms

2. **Performance Optimization**:
   - Memoized context values to prevent unnecessary rerenders
   - Selectors for fine-grained control over render behavior
   - Optimized higher-order components

3. **Developer Experience**:
   - React DevTools integration for easier debugging
   - Performance tracking for action execution
   - Detailed logging in development mode

4. **Testing Utilities**:
   - Created `createTestProvider` for easier testing
   - Mock action implementation for assertions
   - State manipulation utilities for test verification

## Integration with Core

The implementation follows the "Core as Foundation" principle by:

1. Using core state management patterns through the feature-specific context factory
2. Following consistent patterns for context creation and usage
3. Properly leveraging TypeScript for type safety
4. Providing a clean, well-documented API for consumption

This implementation ensures consistency with core modules while adding feature-specific enhancements for better developer experience, reliability, and maintainability.
