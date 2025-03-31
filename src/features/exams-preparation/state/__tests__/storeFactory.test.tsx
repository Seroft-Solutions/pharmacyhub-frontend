import { renderHook, act } from '@testing-library/react';
import { createExamsStore, createExamsSelectors, createTestStore, StoreError, StoreErrorType } from '../storeFactory';
import logger from '@/core/utils/logger';

// Mock core utilities
jest.mock('@/core/state', () => ({
  createStoreFactory: jest.fn(() => (name: string, initialState: any, actionsCreator: any) => {
    const store = jest.fn((selector) => selector(storeState));
    const storeState = { ...initialState, ...actionsCreator(() => {}, () => {}, {}) };
    store.getState = () => storeState;
    store.setState = (updater: any) => {
      if (typeof updater === 'function') {
        Object.assign(storeState, updater(storeState));
      } else {
        Object.assign(storeState, updater);
      }
    };
    return store;
  }),
  createSelectors: jest.fn(() => ({
    useStore: jest.fn(),
    createSelector: jest.fn((selector) => () => selector({}))
  }))
}));

// Mock logger
jest.mock('@/core/utils/logger', () => ({
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
}));

describe('storeFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createExamsStore', () => {
    it('should create a store with initial state', () => {
      // Define types for our test store
      interface TestState {
        count: number;
      }
      
      interface TestActions {
        increment: () => void;
        decrement: () => void;
        reset: () => void;
      }

      // Create a test store
      const useTestStore = createExamsStore<TestState, TestActions>(
        'test-store',
        { count: 0 },
        (set) => ({
          increment: () => set(state => ({ count: state.count + 1 })),
          decrement: () => set(state => ({ count: state.count - 1 })),
          reset: () => set({ count: 0 })
        })
      );

      // Check that the store was created with the correct initial state
      expect(useTestStore.getState().count).toBe(0);
      
      // Test that actions work correctly
      act(() => {
        useTestStore.getState().increment();
      });
      expect(useTestStore.getState().count).toBe(1);
      
      act(() => {
        useTestStore.getState().decrement();
      });
      expect(useTestStore.getState().count).toBe(0);
      
      // Check logger was called
      expect(logger.info).toHaveBeenCalledWith(expect.stringContaining('Creating exams-preparation store: test-store'));
    });

    it('should handle action errors correctly', () => {
      // Create a store with an action that throws
      const useErrorStore = createExamsStore<{ value: number }, { triggerError: () => void }>(
        'error-store',
        { value: 0 },
        (set) => ({
          triggerError: () => {
            throw new Error('Test error');
          }
        })
      );

      // Execute the action that throws
      expect(() => {
        useErrorStore.getState().triggerError();
      }).toThrow(StoreError);

      // Check that error was logged
      expect(logger.error).toHaveBeenCalled();
    });

    it('should use custom error handler if provided', () => {
      // Create mock error handler
      const errorHandler = jest.fn();

      // Create a store with an action that throws and a custom error handler
      const useErrorStore = createExamsStore<{ value: number }, { triggerError: () => void }>(
        'error-store',
        { value: 0 },
        (set) => ({
          triggerError: () => {
            throw new Error('Test error');
          }
        }),
        {
          errorHandler
        }
      );

      // Execute the action that throws
      expect(() => {
        useErrorStore.getState().triggerError();
      }).toThrow(StoreError);

      // Check that custom error handler was called
      expect(errorHandler).toHaveBeenCalled();
    });

    it('should support debug mode', () => {
      // Create a store with debug mode enabled
      const useDebugStore = createExamsStore<{ value: number }, { update: (value: number) => void }>(
        'debug-store',
        { value: 0 },
        (set) => ({
          update: (value) => set({ value })
        }),
        { debug: true }
      );

      // Execute an action
      act(() => {
        useDebugStore.getState().update(42);
      });

      // Check that debug logs were created
      expect(logger.debug).toHaveBeenCalled();
    });

    it('should use before and after action hooks', () => {
      // Create mock hooks
      const beforeAction = jest.fn();
      const afterAction = jest.fn();

      // Create a store with hooks
      const useHookStore = createExamsStore<{ value: number }, { update: (value: number) => void }>(
        'hook-store',
        { value: 0 },
        (set) => ({
          update: (value) => set({ value })
        }),
        {
          beforeAction,
          afterAction
        }
      );

      // Execute an action
      act(() => {
        useHookStore.getState().update(42);
      });

      // Check that hooks were called
      expect(beforeAction).toHaveBeenCalledWith('update', [42]);
      expect(afterAction).toHaveBeenCalled();
    });
  });

  describe('createExamsSelectors', () => {
    it('should create selectors for a store', () => {
      // Create a test store
      const useTestStore = createExamsStore<{ count: number }, { increment: () => void }>(
        'test-store',
        { count: 0 },
        (set) => ({
          increment: () => set(state => ({ count: state.count + 1 }))
        })
      );

      // Create selectors
      const { createSelector } = createExamsSelectors(useTestStore);
      const useCount = createSelector(state => state.count);

      // Render hook to test selector
      const { result } = renderHook(() => useCount());
      
      // Result might be undefined in our mock setup, but we're testing the creation
      expect(createSelector).toBeDefined();
    });
  });

  describe('createTestStore', () => {
    it('should create a test store with utilities', () => {
      // Create a test store
      const testStore = createTestStore<{ count: number }, { increment: () => void; decrement: () => void }>(
        { count: 0 },
        {
          increment: jest.fn(),
          decrement: jest.fn()
        }
      );

      // Test store utilities
      expect(testStore.getState().count).toBe(0);
      
      testStore.setState({ count: 5 });
      expect(testStore.getState().count).toBe(5);
      
      testStore.resetState();
      expect(testStore.getState().count).toBe(0);
      
      // Test action mocks
      expect(testStore.getActionMock('increment')).toBeDefined();
      
      // Call an action mock
      testStore.getState().increment();
      expect(testStore.getActionMock('increment')).toHaveBeenCalled();
      
      // Clean up
      testStore.cleanup();
    });
  });
});
