# Core API Integration Guide

This guide explains how to properly integrate with the core API module in the exams-preparation feature.

## API Hooks Usage

### Query Hooks

Use the core API module's query hooks for data fetching:

```typescript
import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';
import { EXAM_ENDPOINTS } from '../constants/endpoints';
import { examsQueryKeys } from '../utils/queryKeys';

interface UseExamQueryOptions {
  enabled?: boolean;
}

export function useExamQuery(examId: number, options: UseExamQueryOptions = {}) {
  const { enabled = true } = options;
  
  return useApiQuery(
    examsQueryKeys.detail(examId),
    EXAM_ENDPOINTS.DETAIL(examId),
    { enabled }
  );
}
```

### Mutation Hooks

Use the core API module's mutation hooks for data modification:

```typescript
import { useApiMutation } from '@/core/api/hooks/mutation/useApiMutation';
import { EXAM_ENDPOINTS } from '../constants/endpoints';
import { examsQueryKeys } from '../utils/queryKeys';

export function useCreateExamMutation() {
  return useApiMutation(
    EXAM_ENDPOINTS.CREATE,
    {
      method: 'POST',
      onSuccess: (data, variables, context) => {
        // Invalidate queries to refetch data
        context?.queryClient.invalidateQueries({ queryKey: examsQueryKeys.lists() });
      }
    }
  );
}
```

### Pagination Hooks

Use the core API module's pagination hooks for paginated data:

```typescript
import { useApiPaginatedQuery } from '@/core/api/hooks/query/useApiQuery';
import { EXAM_ENDPOINTS } from '../constants/endpoints';
import { examsQueryKeys } from '../utils/queryKeys';

interface UseExamsQueryOptions {
  page?: number;
  limit?: number;
  status?: string;
  enabled?: boolean;
}

export function useExamsQuery(options: UseExamsQueryOptions = {}) {
  const {
    page = 1,
    limit = 10,
    status,
    enabled = true,
  } = options;
  
  return useApiPaginatedQuery(
    examsQueryKeys.lists(),
    EXAM_ENDPOINTS.LIST,
    { page, limit },
    {
      params: { status },
      enabled,
    }
  );
}
```

## Query Keys

Define consistent query keys for caching:

```typescript
// src/features/exams-preparation/utils/queryKeys.ts
import { createQueryKeyFactory } from '@/core/api/utils/queryKeys';

export const examsQueryKeys = createQueryKeyFactory('exams', {
  all: null,
  lists: () => ['list'],
  list: (filters: any) => [...examsQueryKeys.lists(), filters],
  details: () => ['detail'],
  detail: (id: number) => [...examsQueryKeys.details(), id],
  questions: (examId: number) => ['exam', examId, 'questions'],
  question: (examId: number, questionId: number) => ['exam', examId, 'question', questionId],
  results: (examId: number) => ['exam', examId, 'results'],
});
```

## API Endpoints

Define endpoints in a central location:

```typescript
// src/features/exams-preparation/constants/endpoints.ts
const API_PREFIX = '/api/exams';

export const EXAM_ENDPOINTS = {
  LIST: `${API_PREFIX}`,
  DETAIL: (id: number) => `${API_PREFIX}/${id}`,
  CREATE: `${API_PREFIX}`,
  UPDATE: (id: number) => `${API_PREFIX}/${id}`,
  DELETE: (id: number) => `${API_PREFIX}/${id}`,
  PUBLISHED: `${API_PREFIX}/published`,
  BY_STATUS: (status: string) => `${API_PREFIX}/status/${status}`,
  
  // Questions
  QUESTIONS: (examId: number) => `${API_PREFIX}/${examId}/questions`,
  QUESTION: (examId: number, questionId: number) => 
    `${API_PREFIX}/${examId}/questions/${questionId}`,
  
  // Results
  RESULTS: (examId: number) => `${API_PREFIX}/${examId}/results`,
  USER_RESULTS: (userId: string) => `${API_PREFIX}/user/${userId}/results`,
};
```

## Error Handling

Use the core API error handling patterns:

```typescript
import { useExamQuery } from '../api/hooks/useExamQuery';
import { ApiError } from '@/core/api/types';

function ExamComponent({ examId }: { examId: number }) {
  const { data, isLoading, error } = useExamQuery(examId);
  
  // Type-safe error handling
  if (error) {
    const apiError = error as ApiError;
    
    // Handle specific error types
    if (apiError.status === 404) {
      return <div>Exam not found</div>;
    }
    
    if (apiError.status === 403) {
      return <div>You don't have permission to view this exam</div>;
    }
    
    // Generic error
    return <div>Error loading exam: {apiError.message}</div>;
  }
  
  // Handle loading
  if (isLoading) {
    return <div>Loading exam...</div>;
  }
  
  // Render component with data
  return <div>{data.title}</div>;
}
```

## Type Safety

Use types from the core API module when available:

```typescript
import { ApiResponse, PaginatedResponse } from '@/core/api/types';
import { Exam } from '../types';

interface UseExamsQueryResult {
  data?: PaginatedResponse<Exam>;
  isLoading: boolean;
  error?: Error;
}

// Function signatures should be type-safe
function useExamsQuery(): UseExamsQueryResult {
  // Implementation
}
```

## Best Practices

1. **Consistent Naming**: Use consistent naming for API hooks (e.g., `useEntityQuery`, `useEntitiesQuery`, `useCreateEntityMutation`)
2. **Query Key Management**: Use the core query key factory for consistent caching
3. **Endpoint Constants**: Define endpoints in a constants file
4. **Error Handling**: Implement consistent error handling
5. **Type Safety**: Ensure proper type safety for API calls and responses
6. **Documentation**: Document API hooks with JSDoc comments
7. **Testing**: Create tests for API hooks

## Migration Guide

For existing API code in the exams-preparation feature:

1. Identify all API calls and ensure they use core API module
2. Standardize query key management
3. Consolidate endpoint definitions
4. Implement consistent error handling
5. Ensure proper type safety
