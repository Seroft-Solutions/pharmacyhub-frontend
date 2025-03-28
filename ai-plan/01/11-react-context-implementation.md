# Task 11: Implement React Context for Simple State

## Description
Implement React Context for simple, infrequently updating state throughout the application, focusing on feature-specific UI state and theme/appearance preferences.

## Implementation Steps

1. **Context State Audit**
   - Identify appropriate use cases for React Context
   - Review existing Context usage
   - Identify which state should remain in Context vs move to Zustand
   - Follow the principle of using Context only for simple, infrequently updating state

2. **Context Implementation Standards**
   - Define a standard pattern for Context implementation
   - Create a template for Context providers
   - Ensure proper typing
   - Add error handling for out-of-provider usage

3. **Core UI Context Implementation**
   - Implement theme/appearance context if needed
   - Implement any global UI preferences context
   - Keep these contexts minimal and focused

4. **Feature-Specific Context Examples**
   - Create example contexts for feature-specific UI state
   - Document when to use Context vs Zustand
   - Create templates that features can follow

5. **Context Performance Optimization**
   - Implement memoization for context values
   - Use context splitting to prevent unnecessary re-renders
   - Ensure context value stability with useCallback/useMemo

6. **Documentation**
   - Document the React Context implementation
   - Create examples of context usage
   - Document best practices
   - Update README.md files

## Implementation Examples

### Theme Context Example

```typescript
// core/ui/contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useMemo } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('system');
  
  // Use useMemo to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ theme, setTheme }), [theme]);
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
```

### Feature-Specific Filter Context Example

```typescript
// features/products/contexts/FilterContext.tsx
import React, { createContext, useContext, useState, useMemo } from 'react';

interface Filters {
  category: string;
  priceRange: [number, number];
  inStock: boolean;
}

interface FilterContextType {
  filters: Filters;
  setCategory: (category: string) => void;
  setPriceRange: (range: [number, number]) => void;
  setInStock: (inStock: boolean) => void;
  resetFilters: () => void;
}

const defaultFilters: Filters = {
  category: 'all',
  priceRange: [0, 1000],
  inStock: false,
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  
  const setCategory = (category: string) => {
    setFilters(prev => ({ ...prev, category }));
  };
  
  const setPriceRange = (priceRange: [number, number]) => {
    setFilters(prev => ({ ...prev, priceRange }));
  };
  
  const setInStock = (inStock: boolean) => {
    setFilters(prev => ({ ...prev, inStock }));
  };
  
  const resetFilters = () => {
    setFilters(defaultFilters);
  };
  
  // Use useMemo to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({ filters, setCategory, setPriceRange, setInStock, resetFilters }),
    [filters]
  );
  
  return (
    <FilterContext.Provider value={contextValue}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
```

## Verification Criteria
- React Context used appropriately for simple state
- Clear distinction between Context and Zustand usage
- Proper typing for all contexts
- Error handling for out-of-provider usage
- Performance optimization through memoization
- Clear documentation and examples

## Time Estimate
Approximately 1-2 days

## Dependencies
- Tasks 06-08: Refactoring of core components

## Risks
- May lead to confusion about when to use Context vs Zustand
- May cause performance issues if used for frequently updating state
- May require significant refactoring of components that use existing contexts
