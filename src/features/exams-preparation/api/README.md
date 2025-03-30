# Exams Preparation API Integration

This feature leverages the core API module for all data fetching and mutation operations, following the "Core as Foundation" principle. Do NOT implement custom query or mutation patterns.

## Core API Components Used

- `apiClient` from `@/core/api/core/apiClient` - For all HTTP requests
- `createApiHooks` from `@/core/api/services/factories` - For creating standard API hooks
- `useApiQuery`, `useApiMutation` from `@/core/api/hooks` - For specialized queries/mutations
- `createQueryKeyFactory` from `@/core/api/utils/queryKeyFactory` - For consistent query keys
- `createEndpoints` from `@/core/api/utils/endpointUtils` - For endpoint constants

## Pattern Examples

### API Hooks Factory Example

```tsx
// Correct pattern using core API hooks factory
import { createApiHooks } from '@/core/api/services/factories';
import { ENDPOINTS } from '../constants';
import { Exam } from '../../types';

export const examsApiHooks = createApiHooks<Exam>(
  {
    // Map the CRUD endpoints for exams
    list: ENDPOINTS.LIST,
    detail: ENDPOINTS.DETAIL(':id'),
    create: ENDPOINTS.CREATE,
    update: ENDPOINTS.UPDATE(':id'),
    delete: ENDPOINTS.DELETE(':id'),
    
    // Map custom endpoints
    published: ENDPOINTS.PUBLISHED,
    byStatus: ENDPOINTS.BY_STATUS(':status'),
  },
  {
    resourceName: 'exams-preparation',
    defaultStaleTime: 5 * 60 * 1000,
    requiresAuth: true
  }
);

// Usage:
examsApiHooks.useList();          // List all exams
examsApiHooks.useDetail(123);     // Get specific exam
examsApiHooks.useCreate();        // Create exam mutation
examsApiHooks.useUpdate(123);     // Update exam mutation
```

### Query Hook Example

```tsx
// Correct pattern using core API hooks factory
import { examsApiHooks } from '../services/apiHooksFactory';
import { Exam } from '../../types';

export const useExam = (examId: number, options = {}) => {
  return examsApiHooks.useDetail<Exam>(examId, options);
};

export const useExamsByStatus = (status: string, options = {}) => {
  return examsApiHooks.useCustomQuery<Exam[]>(
    'byStatus',
    ['status', status],
    {
      urlParams: { status },
      ...options
    }
  );
};
```

### Mutation Hook Example

```tsx
// Correct pattern using core API hooks factory
import { examsApiHooks } from '../services/apiHooksFactory';
import { Exam } from '../../types';

export const useCreateExam = () => {
  return examsApiHooks.useCreate<Exam, Partial<Exam>>();
};

export const useArchiveExam = () => {
  return examsApiHooks.useAction<Exam, number>(
    (id) => examsApiHooks.queryKeys.custom('archive', id),
    {
      onSuccess: (_, id, context) => {
        // Invalidate specific exam
        context?.queryClient.invalidateQueries({
          queryKey: examsApiHooks.queryKeys.detail(id)
        });
      }
    }
  );
};
```

## Core Principle: Core as Foundation

This feature strictly follows the "Core as Foundation" principle:

1. **Leverage Core Modules**: All API operations use core API modules instead of implementing custom solutions
2. **Extend, Don't Duplicate**: When new functionality is needed, extend the core modules instead of creating duplicates
3. **Consistent Patterns**: Follow the established patterns from core modules for consistency
4. **Standard Query Keys**: Use the query key factory from core for proper invalidation
5. **Standard Endpoints**: Use the endpoint utilities from core for consistent URL patterns

## Best Practices

1. Always use `createApiHooks` for standard CRUD operations
2. Follow the established query key patterns for consistency
3. Use the API_ENDPOINTS constants for all endpoint references
4. Use proper TypeScript typing throughout
5. Create focused hooks that leverage the core API hooks factory
6. Separate queries and mutations into logical groups
7. Follow standardized invalidation patterns

## Troubleshooting

If you encounter issues with the API integration:

1. Check that you're properly using the core API hooks factory
2. Ensure that all endpoint strings match the API specifications
3. Verify proper query invalidation in mutation success handlers
4. Check typing for proper generics usage
5. Ensure that all hooks ultimately use the core API utilities
