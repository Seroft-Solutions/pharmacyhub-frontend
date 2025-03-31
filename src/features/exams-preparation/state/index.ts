/**
 * Exams Preparation Feature State Management
 * 
 * This module provides a clean public API for all state management utilities in the
 * exams-preparation feature. It leverages core state management utilities to ensure
 * consistent patterns across the application while providing feature-specific implementations.
 * 
 * The public API is organized into categories:
 * 
 * 1. Context Utilities - Tools for creating and managing React Contexts
 * 2. Store Utilities - Tools for creating and managing Zustand stores
 * 3. Context Providers & Hooks - Ready-to-use contexts for exam feature
 * 4. Store Hooks & Selectors - Ready-to-use stores for exam feature
 * 
 * @example Basic import
 * ```tsx
 * // Import specific utilities
 * import { useExamFilter, useExamStore } from '@/features/exams-preparation/state';
 * 
 * // Use in components
 * function MyComponent() {
 *   const { status, setFilter } = useExamFilter();
 *   const examData = useExamStore(state => state.exam);
 *   // ...
 * }
 * ```
 *
 * @example Factory import for custom state
 * ```tsx
 * // Import factories for custom state
 * import { createExamsStore, createExamsContext } from '@/features/exams-preparation/state';
 * 
 * // Create custom state
 * const [MyProvider, useMyContext] = createExamsContext(...);
 * const useMyStore = createExamsStore(...);
 * ```
 */

/**
 * Re-export core state management utilities
 * @internal These are primarily for internal use
 */
export {
  createContextProvider,
  withContextProvider,
} from '@/core/state';

/**
 * Context Utilities
 * Tools for creating and managing feature-specific React Contexts
 */
export {
  // Context factory for creating new contexts
  createExamsContext,
  // HOC utility for wrapping components with context
  withExamsContext,
  // Testing utility for contexts
  createTestProvider,
  // Feature name constant
  FEATURE_NAME as CONTEXT_FEATURE_NAME,
  // Logging utilities
  LogLevel,
  // Error handling
  ContextErrorType,
  ContextError,
  // Type utilities
  type ExamsContextOptions,
  type ContextOptions,
  type ExtractContextState,
  type ExtractContextValue
} from './contextFactory';

/**
 * Store Utilities
 * Tools for creating and managing feature-specific Zustand stores
 */
export { 
  // Store factory for creating new stores
  createExamsStore,
  // Selector factory for optimizing component renders
  createExamsSelectors,
  // Testing utility for stores
  createTestStore,
  // Feature name constant
  FEATURE_NAME as STORE_FEATURE_NAME,
  // Error handling
  StoreErrorType,
  StoreError,
  // Type utilities
  type StoreOptions,
  type ExamsStoreOptions,
  type ExtractState,
  type ExtractStateOnly,
  type ExtractActions
} from './storeFactory';

/**
 * Context Providers & Hooks
 * Ready-to-use contexts for the exams-preparation feature
 */
export * from './contexts';

/**
 * Store Hooks & Selectors
 * Ready-to-use stores for the exams-preparation feature
 */
export * from './stores';

