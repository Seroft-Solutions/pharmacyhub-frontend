# Task 05: Consolidate State Management

## Description
Review, organize, and optimize the state management approach for the Exams feature, ensuring proper use of Zustand for feature-specific state, TanStack Query for server state, and React Context where appropriate.

## Current State Analysis
The Exams feature currently uses Zustand stores for state management in the `/store` directory, and TanStack Query for API state. There may be inconsistencies in the implementation or opportunities for optimization.

## Implementation Steps

1. **Review current state management**
   - Catalog all Zustand stores and their purposes
   - Check implementation patterns for consistency
   - Identify any state not managed through Zustand or TanStack Query
   - Look for opportunities to optimize state organization

2. **Refactor Zustand stores**
   - Ensure each store follows consistent patterns
   - Implement proper TypeScript interfaces
   - Add selectors for performance optimization
   - Consider breaking down large stores into smaller, focused ones

3. **Validate TanStack Query usage**
   - Ensure all server state is managed through TanStack Query
   - Check for proper query invalidation strategies
   - Implement optimistic updates where appropriate
   - Review caching strategies

4. **Evaluate React Context usage**
   - Identify any React Context implementations
   - Ensure Context is only used for simple, infrequently updating state
   - Consider replacing heavy Context usage with Zustand

5. **Implement state selectors**
   - Create focused selector hooks for common state access patterns
   - Ensure selectors are properly typed
   - Document selector usage

6. **Review state access patterns**
   - Check components for direct store access
   - Replace direct access with selector hooks
   - Ensure consistent patterns across the feature

7. **Document state management**
   - Update comments and documentation
   - Create usage examples
   - Document state structure and management strategies

## Zustand Store Pattern

```typescript
// /state/examStore.ts
import { create } from 'zustand';

interface Exam {
  id: string;
  title: string;
  // other properties...
}

interface ExamState {
  // State properties
  currentExam: Exam | null;
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  setCurrentExam: (exam: Exam | null) => void;
  startLoading: () => void;
  stopLoading: () => void;
  setError: (error: Error | null) => void;
}

export const useExamStore = create<ExamState>((set) => ({
  // Initial state
  currentExam: null,
  isLoading: false,
  error: null,
  
  // Actions
  setCurrentExam: (exam) => set({ currentExam: exam }),
  startLoading: () => set({ isLoading: true, error: null }),
  stopLoading: () => set({ isLoading: false }),
  setError: (error) => set({ error, isLoading: false }),
}));

// Selectors for better performance
export const useCurrentExam = () => useExamStore((state) => state.currentExam);
export const useExamLoading = () => useExamStore((state) => state.isLoading);
export const useExamError = () => useExamStore((state) => state.error);
```

## TanStack Query Pattern

```typescript
// /api/hooks/useExamQuery.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/core/api';
import { Exam } from '@/features/exams/types';

export const useExamQuery = (examId: string) => {
  return useQuery({
    queryKey: ['exam', examId],
    queryFn: async () => {
      const { data } = await apiClient.get<Exam>(`/exams/${examId}`);
      return data;
    },
    enabled: !!examId,
  });
};

export const useUpdateExamMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ examId, examData }: { examId: string; examData: Partial<Exam> }) => {
      const { data } = await apiClient.patch<Exam>(`/exams/${examId}`, examData);
      return data;
    },
    onSuccess: (data, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['exam', variables.examId] });
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
};
```

## React Context Pattern (for simple state)

```typescript
// /context/ExamFilterContext.tsx
import React, { createContext, useState, useContext, FC, PropsWithChildren } from 'react';

interface FilterContextType {
  filter: string;
  setFilter: (filter: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const ExamFilterProvider: FC<PropsWithChildren> = ({ children }) => {
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

## Component Usage Examples

```tsx
// Example component using state management
import { useCurrentExam } from '@/features/exams/state/examStore';
import { useExamQuery, useUpdateExamMutation } from '@/features/exams/api/hooks';
import { useExamFilter } from '@/features/exams/context/ExamFilterContext';

const ExamEditor = ({ examId }) => {
  // TanStack Query for server state
  const { data: exam, isLoading } = useExamQuery(examId);
  const updateExamMutation = useUpdateExamMutation();
  
  // Zustand for complex state
  const currentExam = useCurrentExam();
  
  // React Context for simple UI state
  const { filter, setFilter } = useExamFilter();
  
  // Component implementation...
};
```

## Verification Criteria
- All feature state properly managed with Zustand
- All server state managed with TanStack Query
- React Context only used for simple, infrequently updating state
- Consistent implementation patterns across the feature
- Proper selector hooks for performance optimization
- Clear documentation for state management

## Time Estimate
Approximately 10-12 hours

## Dependencies
- Task 01: Document Current Directory Structure and Identify Gaps
- Task 02: Evaluate and Organize API Integration

## Risks
- Changes to state management could impact multiple components
- Performance issues if selectors aren't properly implemented
- Complex state transitions may be difficult to refactor
