# Task 02: Refactor API Implementation

## Description

Refactor the API implementation of the Exams feature to fully leverage TanStack Query and ensure consistency with core API patterns. This task focuses on ensuring the API layer follows best practices for data fetching, caching, and error handling.

## Current State Analysis

The current API structure has the following components:

- `api/hooks/`: React Query hooks for data fetching
- `api/services/`: API service implementations
- `api/constants/`: API constants and endpoints
- `api/adapter.ts`: Adapter for backward compatibility
- `api/queryKeys.ts`: Query key definitions
- Direct API calls in some components and store files

## Target Implementation

```
/api
  /constants/                    # API endpoint constants
    endpoints.ts                 # Endpoint definitions
    index.ts                     # Exports
  /hooks/                        # React Query hooks
    useExamPaperHooks.ts         # Paper-related hooks
    useExamSubmissionHooks.ts    # Submission-related hooks
    useExamAdminHooks.ts         # Admin-related hooks
    index.ts                     # Exports all hooks
  /services/                     # API services
    examService.ts               # Core exam services
    paperService.ts              # Paper-related services
    submissionService.ts         # Submission-related services
    adminService.ts              # Admin-related services
    index.ts                     # Exports
  adapter.ts                     # Adapter for backward compatibility
  example-with-schema-validation.ts # Example with Zod validation
  index.ts                       # Main API exports
  queryKeys.ts                   # TanStack Query keys
```

## Implementation Steps

1. **Review and consolidate API constants:**
   - Ensure all endpoint constants are defined in a single location
   - Remove any duplications or inconsistencies
   - Properly export constants through index.ts

2. **Refactor API hooks:**
   - Ensure all hooks follow TanStack Query best practices
   - Group hooks by logical domain (papers, submissions, admin)
   - Remove any direct usage of fetch/axios in favor of core API client
   - Implement proper error handling and loading states
   - Ensure consistent return types

3. **Refactor API services:**
   - Separate service functions by domain responsibility
   - Ensure services use core API utilities
   - Remove any direct HTTP client usage
   - Implement proper error handling

4. **Update adapter for backward compatibility:**
   - Ensure the adapter correctly maps new API patterns to legacy code
   - Add deprecation warnings to encourage migration

5. **Update query keys:**
   - Ensure all query keys follow a consistent pattern
   - Add type safety to query keys
   - Document query key structure

6. **Create a comprehensive index.ts:**
   - Export all necessary hooks and services
   - Provide direct exports for frequently used hooks

7. **Create schema validation example:**
   - Create or update the example with schema validation
   - Document best practices for using Zod or other validation libraries

## Migration Strategy for Components

1. Identify components that directly use fetch/axios
2. Replace direct API calls with appropriate hooks
3. Update any data transformation logic

## Code Examples

### Example hook implementation

```typescript
// hooks/useExamPaperHooks.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiClient } from '@/core/api';
import { queryKeys } from '../queryKeys';
import { Exam, ExamPaper } from '../../types';

export const useExamPapers = () => {
  return useQuery({
    queryKey: queryKeys.papers.list(),
    queryFn: async () => {
      const { data } = await apiClient.get<ExamPaper[]>('/exams/papers');
      return data;
    }
  });
};

export const useExamPaper = (id: string) => {
  return useQuery({
    queryKey: queryKeys.papers.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get<ExamPaper>(`/exams/papers/${id}`);
      return data;
    },
    enabled: !!id
  });
};
```

### Example query keys

```typescript
// queryKeys.ts
export const queryKeys = {
  papers: {
    all: ['exams', 'papers'] as const,
    list: () => [...queryKeys.papers.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.papers.all, 'detail', id] as const,
  },
  submissions: {
    all: ['exams', 'submissions'] as const,
    list: () => [...queryKeys.submissions.all, 'list'] as const,
    detail: (id: string) => [...queryKeys.submissions.all, 'detail', id] as const,
  }
};
```

## Verification Criteria

- All API calls use TanStack Query hooks
- No direct fetch/axios calls in components
- Proper error handling and loading states
- Consistent naming and patterns
- Type safety for all API interactions
- Clear documentation in code

## Time Estimate

Approximately 1-2 days (8-16 hours)

## Dependencies

- Task 01: Restructure Directory (must be completed first)

## Risks

- Some components may heavily depend on current API implementation
- Backward compatibility might be challenging
- Integration with Zustand stores needs careful consideration
