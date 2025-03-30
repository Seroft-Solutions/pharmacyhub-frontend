# Exams Preparation Context

This directory contains React Context providers and hooks for the exams-preparation feature.

## Purpose

- Provide React Context for sharing state between components
- Handle simple UI state that changes infrequently
- Avoid prop drilling for deeply nested components

## Guidelines

1. Use React Context only for simple, infrequently updating feature state
2. For complex state or performance-critical state, use Zustand stores instead
3. Follow the established pattern of context factory from core
4. Create a separate file for each context
5. Export provider components and hooks for consumers

## When to Use Context vs. Zustand

- **Use Context for**:
  - Theme settings
  - UI preferences
  - Feature flags
  - Simple filters or view settings
  - Component communication without many updates

- **Use Zustand for**:
  - Complex state
  - Frequently updating state
  - State that requires performance optimization
  - State with computed values
  - State with complex actions

## Example Structure

```
context/
  ExamFilterContext.tsx    # Context for exam filtering options
  ExamSessionContext.tsx   # Context for the current exam session
  index.ts                 # Public exports
```

## Example Context

```tsx
// Example context
import React, { createContext, useContext, useState, ReactNode } from 'react';

type FilterContextType = {
  filter: string;
  setFilter: (filter: string) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const ExamFilterProvider = ({ children }: { children: ReactNode }) => {
  const [filter, setFilter] = useState('');
  
  return (
    <FilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useExamFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useExamFilter must be used within ExamFilterProvider');
  }
  return context;
};
```
