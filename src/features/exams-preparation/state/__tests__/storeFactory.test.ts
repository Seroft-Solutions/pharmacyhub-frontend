/**
 * Tests for the Exams Preparation store factory
 * 
 * This file tests the feature-specific store factory, ensuring it:
 * - Creates stores correctly
 * - Handles errors properly
 * - Integrates with core store factory
 * - Correctly wraps store actions with error handling and logging
 */

import { createExamsStore, FEATURE_NAME } from '../storeFactory';
import * as coreState from '@/core/state';
import logger from '@/core/utils/logger';

// Mock the core state module
jest.mock('@/core/state', () => {
  const originalModule = jest.requireActual('@/core/state');
  return {
    ...originalModule,
    createStoreFactory: jest.fn(),
  };
});

// Mock the logger
jest.mock('@/core/utils/logger', () => ({
  debug: jest.fn(),
  error: jest.fn(),
}));

describe('storeFactory', () => {
  // Setup test data
  const mockStore = jest.fn();
  const mockStoreFactory = jest.fn(() => mockStore);
  
  beforeEach(() => {
    jest.clearAllMocks();
    (coreState.createStoreFactory as jest.Mock).mockReturnValue(mockStoreFactory);
  });
  
  it('should create a store factory with the correct feature name', () => {
    // Call the function
    createExamsStore('test', {}, () => ({}));
    
    // Verify core factory was called with correct feature name
    expect(coreState.createStoreFactory).toHaveBeenCalledWith(FEATURE_NAME);
  });
  
  it('should create a store with the correct parameters', () => {
    // Setup test data
    const storeName = 'testStore';
    const initialState = { count: 0 };
    const actions = { increment: jest.fn() };
    const actionsCreator = jest.fn(() => actions);
    const options = { persist: true };
    
    // Call the function
    createExamsStore(storeName, initialState, actionsCreator, options);
    
    // Verify store factory was called with correct parameters
    expect(mockStoreFactory).toHaveBeenCalledWith(
      storeName,
      initialState,
      expect.any(Function),
      expect.objectContaining({
        persist: true,
        onRehydrateStorage: expect.any(Function),
      }),
    );
  });
  
  it('should log debugging information when creating a store', () => {
    // Call the function
    createExamsStore('testStore', {}, () => ({}));
    
    // Verify logging
    expect(logger.debug).toHaveBeenCalledWith(
      expect.stringContaining('Creating'),
      expect.stringContaining('testStore'),
    );
  });
  
  it('should wrap actions with error handling and logging', () => {
    // Setup test data
    const mockSet = jest.fn();
    const mockGet = jest.fn();
    const mockApi = {} as any;
    
    const actionsCreator = jest.fn(() => ({
      testAction: jest.fn(() => 'result'),
    }));
    
    // Call the function
    createExamsStore('testStore', {}, actionsCreator);
    
    // Get the wrapped actions creator
    const wrappedActionsCreator = mockStoreFactory.mock.calls[0][2];
    
    // Call the wrapped actions creator
    const wrappedActions = wrappedActionsCreator(mockSet, mockGet, mockApi);
    
    // Call the wrapped action
    wrappedActions.testAction('test');
    
    // Verify original action was called
    expect(actionsCreator).toHaveBeenCalledWith(mockSet, mockGet, mockApi);
    expect(actionsCreator().testAction).toHaveBeenCalledWith('test');
    
    // Verify logging
    expect(logger.debug).toHaveBeenCalledWith(
      expect.stringContaining('testAction'),
      expect.objectContaining({ args: ['test'] }),
    );
  });
  
  it('should handle errors in actions', () => {
    // Setup test data with an action that throws
    const error = new Error('Test error');
    const actionsCreator = jest.fn(() => ({
      testAction: jest.fn(() => {
        throw error;
      }),
    }));
    
    // Call the function
    createExamsStore('testStore', {}, actionsCreator);
    
    // Get the wrapped actions creator
    const wrappedActionsCreator = mockStoreFactory.mock.calls[0][2];
    
    // Call the wrapped actions creator
    const wrappedActions = wrappedActionsCreator(jest.fn(), jest.fn(), {} as any);
    
    // Call the wrapped action (should throw)
    expect(() => wrappedActions.testAction()).toThrow(error);
    
    // Verify error logging
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Error in'),
      error,
    );
  });
  
  it('should handle errors when creating a store', () => {
    // Setup a failure in the core store factory
    const error = new Error('Test error');
    (coreState.createStoreFactory as jest.Mock).mockImplementation(() => {
      throw error;
    });
    
    // Call the function (should throw)
    expect(() => createExamsStore('testStore', {}, () => ({}))).toThrow();
    
    // Verify error logging
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Failed to create'),
      error,
    );
  });
  
  it('should add default onRehydrateStorage if not provided', () => {
    // Call the function
    createExamsStore('testStore', {}, () => ({}));
    
    // Get the options passed to the store factory
    const options = mockStoreFactory.mock.calls[0][3];
    
    // Get the onRehydrateStorage function
    const onRehydrateStorage = options.onRehydrateStorage;
    
    // Call the onRehydrateStorage function
    const handler = onRehydrateStorage({});
    
    // Call the handler with success
    handler({ test: true });
    
    // Verify logging
    expect(logger.debug).toHaveBeenCalledWith(
      expect.stringContaining('rehydrated'),
      expect.objectContaining({ stateKeys: ['test'] }),
    );
    
    // Call the handler with error
    const error = new Error('Rehydration error');
    handler(undefined, error);
    
    // Verify error logging
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining('Error rehydrating'),
      error,
    );
  });
});
