import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExamFilterProvider, useExamFilter, useHasActiveFilters, useFilterValues } from '../contexts/ExamFilterContext';
import { createTestProvider } from '../contextFactory';

// Test component that uses the filter context
const FilterConsumer = () => {
  const { status, difficulty, search, setFilter, clearFilters } = useExamFilter();
  const hasFilters = useHasActiveFilters();
  const filterValues = useFilterValues();
  
  return (
    <div>
      <div data-testid="status">{status || 'none'}</div>
      <div data-testid="difficulty">{difficulty || 'none'}</div>
      <div data-testid="search">{search || 'none'}</div>
      <div data-testid="has-filters">{hasFilters ? 'true' : 'false'}</div>
      <div data-testid="filter-count">{Object.keys(filterValues).length}</div>
      
      <button 
        data-testid="set-status" 
        onClick={() => setFilter('status', 'active')}
      >
        Set Status
      </button>
      
      <button 
        data-testid="set-difficulty" 
        onClick={() => setFilter('difficulty', 'hard')}
      >
        Set Difficulty
      </button>
      
      <button 
        data-testid="clear-filters" 
        onClick={clearFilters}
      >
        Clear Filters
      </button>
    </div>
  );
};

describe('ExamFilterContext', () => {
  it('should provide empty initial state', () => {
    render(
      <ExamFilterProvider>
        <FilterConsumer />
      </ExamFilterProvider>
    );
    
    expect(screen.getByTestId('status')).toHaveTextContent('none');
    expect(screen.getByTestId('difficulty')).toHaveTextContent('none');
    expect(screen.getByTestId('search')).toHaveTextContent('none');
    expect(screen.getByTestId('has-filters')).toHaveTextContent('false');
    expect(screen.getByTestId('filter-count')).toHaveTextContent('0');
  });
  
  it('should update filters when setFilter is called', () => {
    render(
      <ExamFilterProvider>
        <FilterConsumer />
      </ExamFilterProvider>
    );
    
    // Set status filter
    fireEvent.click(screen.getByTestId('set-status'));
    expect(screen.getByTestId('status')).toHaveTextContent('active');
    expect(screen.getByTestId('has-filters')).toHaveTextContent('true');
    expect(screen.getByTestId('filter-count')).toHaveTextContent('1');
    
    // Set difficulty filter
    fireEvent.click(screen.getByTestId('set-difficulty'));
    expect(screen.getByTestId('difficulty')).toHaveTextContent('hard');
    expect(screen.getByTestId('has-filters')).toHaveTextContent('true');
    expect(screen.getByTestId('filter-count')).toHaveTextContent('2');
  });
  
  it('should clear filters when clearFilters is called', () => {
    render(
      <ExamFilterProvider>
        <FilterConsumer />
      </ExamFilterProvider>
    );
    
    // Set filters
    fireEvent.click(screen.getByTestId('set-status'));
    fireEvent.click(screen.getByTestId('set-difficulty'));
    expect(screen.getByTestId('filter-count')).toHaveTextContent('2');
    
    // Clear filters
    fireEvent.click(screen.getByTestId('clear-filters'));
    expect(screen.getByTestId('status')).toHaveTextContent('none');
    expect(screen.getByTestId('difficulty')).toHaveTextContent('none');
    expect(screen.getByTestId('has-filters')).toHaveTextContent('false');
    expect(screen.getByTestId('filter-count')).toHaveTextContent('0');
  });
  
  it('should accept custom initial state', () => {
    render(
      <ExamFilterProvider initialState={{ status: 'completed', search: 'test' }}>
        <FilterConsumer />
      </ExamFilterProvider>
    );
    
    expect(screen.getByTestId('status')).toHaveTextContent('completed');
    expect(screen.getByTestId('search')).toHaveTextContent('test');
    expect(screen.getByTestId('has-filters')).toHaveTextContent('true');
    expect(screen.getByTestId('filter-count')).toHaveTextContent('2');
  });
  
  it('should work correctly with the test provider', () => {
    // Create test provider with initial state and mock actions
    const testProvider = createTestProvider<
      { status?: string; difficulty?: string; search?: string },
      { setFilter: any; clearFilters: any }
    >(
      { status: 'active' }, // Initial state
      {
        setFilter: jest.fn((key, value) => {
          testProvider.setState({ [key]: value });
        }),
        clearFilters: jest.fn(() => {
          testProvider.setState({ status: undefined, difficulty: undefined, search: undefined });
        }),
      }
    );
    
    render(
      <testProvider.Provider>
        <FilterConsumer />
      </testProvider.Provider>
    );
    
    // Check initial state
    expect(screen.getByTestId('status')).toHaveTextContent('active');
    
    // Trigger action
    fireEvent.click(screen.getByTestId('set-difficulty'));
    
    // Verify action was called
    expect(testProvider.getActionMock('setFilter')).toHaveBeenCalledWith('difficulty', 'hard');
    
    // Update state directly for testing
    testProvider.setState({ difficulty: 'easy' });
    expect(screen.getByTestId('difficulty')).toHaveTextContent('easy');
    
    // Trigger clear action
    fireEvent.click(screen.getByTestId('clear-filters'));
    expect(testProvider.getActionMock('clearFilters')).toHaveBeenCalled();
  });
});
