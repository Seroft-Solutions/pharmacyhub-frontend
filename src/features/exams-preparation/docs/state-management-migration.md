# State Management Migration Plan

## Overview

This document outlines the plan for migrating the exams-preparation feature's state management from the deprecated local store factory to the core state module. The migration will ensure alignment with the Core as Foundation principle.

## Current Implementation

The feature currently uses a custom store factory implementation in `storeFactory.ts`, which is explicitly marked as deprecated:

```typescript
/**
 * DEPRECATED: This store factory has been promoted to core.
 * 
 * Use the core state module instead:
 * import { createStore, createStoreFactory, createSelectors } from '@/core/state';
 * 
 * See docs/STATE_MANAGEMENT.md for migration details.
 */
```

This local implementation includes:
- A `createStore` function for creating Zustand stores
- Persistence options for state management
- Selectors for optimized component renders

## Target Implementation

The feature should use the core state module for all state management:

```typescript
import { createStore, createStoreFactory, createSelectors } from '@/core/state';
```

## Migration Steps

### 1. Understand Core State Module

Before starting the migration, we need to understand the core state module's API and any differences from the local implementation:

1. Review `@/core/state` API documentation
2. Examine the implementation of `createStore`, `createStoreFactory`, and `createSelectors`
3. Identify any differences in parameters, options, or behavior

### 2. Update Store Files

Update all store files to use the core state module:

#### Example for examStore.ts:

```typescript
// Before
import { createStore } from '../storeFactory';

// After
import { createStore } from '@/core/state';
```

### 3. Handle Persistence Options

The core state module likely has a different approach to persistence options:

```typescript
// Current
export const useExamStore = createStore<ExamState, ExamActions>(
  'exam',
  initialState,
  (set, get) => ({
    // Actions...
  }),
  {
    persist: true,
    storageKey: 'exams-prep-exam',
    partialize: (state) => ({
      // Partialize options...
    }),
    onRehydrateStorage: () => {
      // Rehydration logic...
    },
  }
);

// Target (may need adaptation based on core state module API)
export const useExamStore = createStore<ExamState, ExamActions>({
  name: 'exam',
  initialState,
  actions: (set, get) => ({
    // Actions...
  }),
  options: {
    persist: {
      enabled: true,
      key: 'exams-prep-exam',
      partialize: (state) => ({
        // Partialize options...
      }),
      onRehydrateStorage: () => {
        // Rehydration logic...
      }),
    },
  },
});
```

### 4. Update Selectors

If the core state module has a different approach to selectors, update them accordingly:

```typescript
// Current
export const useExamId = () => useExamStore(state => state.examId);
export const useAttemptId = () => useExamStore(state => state.attemptId);

// Target (may need adaptation based on core state module API)
const { createSelector } = createSelectors(useExamStore);
export const useExamId = createSelector(state => state.examId);
export const useAttemptId = createSelector(state => state.attemptId);
```

### 5. Remove Deprecated Files

Once all stores have been updated:

1. Remove the deprecated `storeFactory.ts` file
2. Remove any other related deprecated utilities

### 6. Update Context Factories

If the feature uses context factories built on top of the store factory, update them to use the core state module's context utilities.

## Testing Strategy

1. **Unit Tests**: Update and run unit tests for each store
2. **Integration Tests**: Test feature integration with stores
3. **Persistence Tests**: Verify state persistence works correctly
4. **Performance Tests**: Check for any performance regressions

## Migration Verification

After migration, verify:

1. All stores work correctly with the core state module
2. Persistence behaves as expected
3. Selectors optimize component renders appropriately
4. No duplicated state management code exists
5. Type safety is maintained

## Rollback Plan

If issues are encountered:

1. Keep the deprecated `storeFactory.ts` temporarily
2. Address issues in the migration
3. Re-attempt the migration once issues are resolved

## Timeline

- Estimated time for analysis of core state module: 1-2 hours
- Estimated time for updating store files: 2-4 hours
- Estimated time for testing and verification: 2-3 hours
- Total estimated time: 5-9 hours
