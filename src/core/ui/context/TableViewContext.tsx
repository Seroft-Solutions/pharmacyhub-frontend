"use client";

/**
 * Table View Context
 * 
 * Context for managing table view preferences like column visibility,
 * sorting, and other UI state specific to tables.
 * 
 * This is a feature-specific UI state that changes infrequently,
 * making it a good candidate for React Context.
 */
import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';

/**
 * Column visibility state
 */
export interface ColumnVisibility {
  [columnId: string]: boolean;
}

/**
 * Sort state
 */
export interface SortState {
  columnId: string;
  direction: 'asc' | 'desc';
}

/**
 * Table view context interface
 */
interface TableViewContextType {
  /** Column visibility state */
  columnVisibility: ColumnVisibility;
  /** Set column visibility */
  setColumnVisibility: (columnId: string, isVisible: boolean) => void;
  /** Reset column visibility to default */
  resetColumnVisibility: () => void;
  
  /** Current sort state */
  sort: SortState | null;
  /** Set sort state */
  setSort: (columnId: string, direction?: 'asc' | 'desc') => void;
  /** Clear sort */
  clearSort: () => void;
  
  /** Density of the table */
  density: 'compact' | 'normal' | 'spacious';
  /** Set density */
  setDensity: (density: 'compact' | 'normal' | 'spacious') => void;
}

// Create the context with a default value
const TableViewContext = createContext<TableViewContextType | undefined>(undefined);

/**
 * Props for the TableViewProvider component
 */
interface TableViewProviderProps {
  /** Default column visibility */
  defaultColumnVisibility?: ColumnVisibility;
  /** Default sort state */
  defaultSort?: SortState | null;
  /** Default density */
  defaultDensity?: 'compact' | 'normal' | 'spacious';
  /** Children components */
  children: ReactNode;
}

/**
 * Table View Provider Component
 * 
 * Provides table view functionality to the application
 */
export function TableViewProvider({
  defaultColumnVisibility = {},
  defaultSort = null,
  defaultDensity = 'normal',
  children
}: TableViewProviderProps) {
  // Column visibility state
  const [columnVisibility, setColumnVisibilityState] = useState<ColumnVisibility>(defaultColumnVisibility);
  
  // Sort state
  const [sort, setSortState] = useState<SortState | null>(defaultSort);
  
  // Density state
  const [density, setDensity] = useState<'compact' | 'normal' | 'spacious'>(defaultDensity);

  // Set column visibility
  const setColumnVisibility = useCallback((columnId: string, isVisible: boolean) => {
    setColumnVisibilityState(prev => ({
      ...prev,
      [columnId]: isVisible
    }));
  }, []);

  // Reset column visibility
  const resetColumnVisibility = useCallback(() => {
    setColumnVisibilityState(defaultColumnVisibility);
  }, [defaultColumnVisibility]);

  // Set sort state
  const setSort = useCallback((columnId: string, direction?: 'asc' | 'desc') => {
    // If no direction provided, toggle between asc and desc
    if (!direction) {
      if (sort?.columnId === columnId) {
        // Toggle direction if same column
        direction = sort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        // Default to asc for new column
        direction = 'asc';
      }
    }
    
    setSortState({ columnId, direction });
  }, [sort]);

  // Clear sort
  const clearSort = useCallback(() => {
    setSortState(null);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    columnVisibility,
    setColumnVisibility,
    resetColumnVisibility,
    sort,
    setSort,
    clearSort,
    density,
    setDensity
  }), [
    columnVisibility, 
    setColumnVisibility, 
    resetColumnVisibility, 
    sort, 
    setSort, 
    clearSort, 
    density, 
    setDensity
  ]);

  return (
    <TableViewContext.Provider value={contextValue}>
      {children}
    </TableViewContext.Provider>
  );
}

/**
 * Hook for consuming the table view context
 * 
 * @returns Table view context with all table-related state and functions
 * @throws Error if used outside of TableViewProvider
 */
export function useTableView(): TableViewContextType {
  const context = useContext(TableViewContext);
  
  if (context === undefined) {
    throw new Error('useTableView must be used within a TableViewProvider');
  }
  
  return context;
}

export default TableViewContext;