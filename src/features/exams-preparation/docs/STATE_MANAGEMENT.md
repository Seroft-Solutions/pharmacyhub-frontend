# State Management Integration Guide

This guide explains how to properly integrate with the core state management module in the exams-preparation feature.

## Migration to Core Store Factory

The exams-preparation feature previously used a custom store factory implementation. This has now been promoted to the core module for wider use across features.

### Updating Imports

Update imports in all files that use the store factory:

```typescript
// Before
import { createStore } from '../storeFactory';

// After
import { createStore } from '@/core/state';
```

## Using Core State Factory

### Creating a Feature-Specific Store Factory

For most cases, it's recommended to create a feature-specific store factory using `createStoreFactory`:

```typescript
// src/features/exams-preparation/state/stores/index.ts
import { createStoreFactory } from '@/core/state';

// Create a store factory specifically for exams feature
export const createExamsStore = createStoreFactory('exams-preparation');

// Example usage
export const useMyStore = createExamsStore(
  'my-store',
  { count: 0 },
  (set, get) => ({
    increment: () => set(state => ({ count: state.count + 1 })),
    decrement: () => set(state => ({ count: state.count - 1 })),
  })
);
```

### Creating Individual Stores

If you prefer creating individual stores directly:

```typescript
import { createStore } from '@/core/state';

export const useExamStore = createStore(
  'exams-preparation-exam',
  { /* initial state */ },
  (set, get) => ({
    // actions
  }),
  { 
    persist: true,
    storageKey: 'exams-prep-exam'
  }
);
```

## Creating Optimized Selectors

Use the `createSelectors` utility to optimize component rendering:

```typescript
import { createStore, createSelectors } from '@/core/state';

const useMyStore = createStore(
  'my-store',
  { count: 0, name: 'test' },
  (set) => ({
    increment: () => set(state => ({ count: state.count + 1 })),
  })
);

// Create selectors for optimized rendering
const { createSelector } = createSelectors(useMyStore);

// Create hooks that only cause re-renders when the selected data changes
export const useCount = createSelector(state => state.count);
export const useName = createSelector(state => state.name);
```

## Persisting State

To persist state to localStorage:

```typescript
import { createStore } from '@/core/state';

export const usePersistentStore = createStore(
  'persistent-store',
  { data: null },
  (set, get) => ({
    setData: (data) => set({ data }),
    clearData: () => set({ data: null }),
  }),
  {
    persist: true, // Enable persistence
    storageKey: 'my-feature-data', // Custom storage key
    
    // Only persist specific parts of state
    partialize: (state) => ({
      data: state.data,
      // Exclude other fields from persistence
    }),
    
    // Handle rehydration
    onRehydrateStorage: () => (state) => {
      if (state) {
        console.log('State rehydrated successfully');
      } else {
        console.error('Failed to rehydrate state');
      }
    },
  }
);
```

## Best Practices

1. **Single Responsibility**: Each store should manage a specific domain of state
2. **Minimal State**: Only store what's necessary in global state
3. **Use Selectors**: Create selectors for optimized component rendering
4. **Descriptive Names**: Use clear, descriptive names for stores and actions
5. **Appropriate Persistence**: Only persist data that needs to survive page reloads
6. **Type Safety**: Always use TypeScript types for store state and actions

## Migration Guide for Existing Stores

For existing stores in the exams-preparation feature:

1. Update the import to use the core state module
2. Consider using `createStoreFactory` for feature-specific stores
3. Review the persistence configuration
4. Ensure proper type safety

No changes to store implementation should be needed as the core module follows the same patterns.
