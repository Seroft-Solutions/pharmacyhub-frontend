# Core Module Integration Guide

This guide provides a comprehensive overview of how the exams-preparation feature integrates with core modules following the "Core as Foundation" principle.

## Overview

The "Core as Foundation" principle means that core modules provide cross-cutting concerns, and features consume core functionality without duplication. This ensures consistency, reduces code duplication, and improves maintainability.

### Integration Status

| Module Area | Status | Documentation |
|-------------|--------|---------------|
| UI Components | ✅ Integrated | Uses components from `@/components/ui/*` |
| API Integration | ✅ Integrated | Uses hooks from `@/core/api/*` |
| State Management | ✅ Integrated | Core module created based on feature implementation |
| Logger | ✅ Integrated | Uses logger from `@/core/utils/logger` |
| Auth & RBAC | ✅ Integrated | Uses hooks from `@/core/auth/*` and `@/core/rbac/*` |

## Detailed Integration Guides

For detailed information on integrating with specific core modules, refer to these guides:

1. [Core Integration Audit](./CORE_INTEGRATION_AUDIT.md) - Assessment of current integration status
2. [Core Integration Plan](./CORE_INTEGRATION_PLAN.md) - Implementation plan for integration
3. [State Management Integration](./STATE_MANAGEMENT.md) - Guide for core state management
4. [Auth & RBAC Integration](./AUTH_RBAC_INTEGRATION.md) - Guide for core auth and RBAC
5. [Core API Integration](./CORE_API_INTEGRATION.md) - Guide for core API module

## Key Integration Principles

### 1. Direct Usage of Core Components

Always use core UI components directly:

```tsx
// Good - Direct import of core components
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Bad - Reimplementing functionality
const CustomButton = ({ children }) => (
  <button className="custom-button">{children}</button>
);
```

### 2. Leveraging Core API Hooks

Use core API hooks for data fetching and mutations:

```tsx
// Good - Using core API hooks
import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';

// Bad - Custom implementation of API fetching
const fetchData = async () => {
  const response = await fetch('/api/endpoint');
  return response.json();
};
```

### 3. Using Core State Management

Use core state management utilities:

```tsx
// Good - Using core state factory
import { createStore } from '@/core/state';

// Bad - Custom state implementation
import { create } from 'zustand';
const useCustomStore = create(() => ({}));
```

### 4. Proper Error Handling

Use core error handling patterns:

```tsx
// Good - Using core error handling
import { ApiError } from '@/core/api/types';
if (error instanceof ApiError) {
  // Handle specific error
}

// Bad - Custom error handling
if (error.response?.status === 404) {
  // Custom handling
}
```

### 5. Consistent Logging

Use core logger for consistent logging:

```tsx
// Good - Using core logger
import logger from '@/core/utils/logger';
logger.info('Event occurred', { metadata });

// Bad - Direct console logging
console.log('Event occurred', metadata);
```

## Integration Checklist

When working on the exams-preparation feature, ensure:

1. ✅ UI components come from `@/components/ui/*`
2. ✅ API calls use hooks from `@/core/api/*`
3. ✅ State management uses utilities from `@/core/state`
4. ✅ Logging uses `@/core/utils/logger`
5. ✅ Authentication uses hooks from `@/core/auth`
6. ✅ Permissions use hooks from `@/core/rbac`
7. ✅ No duplication of functionality available in core modules
8. ✅ All integration points documented

## Example Full Integration

Here's an example of a component that properly integrates with all core modules:

```tsx
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';
import { useAuth } from '@/core/auth';
import { usePermissions } from '@/core/rbac';
import logger from '@/core/utils/logger';
import { EXAM_ENDPOINTS } from '../constants/endpoints';
import { examsQueryKeys } from '../utils/queryKeys';
import { EXAM_PERMISSIONS } from '../constants/permissions';

export function ExamCard({ examId }: { examId: number }) {
  // Core auth integration
  const { user } = useAuth();
  
  // Core RBAC integration
  const { hasPermission } = usePermissions();
  const canEditExam = hasPermission(EXAM_PERMISSIONS.EDIT);
  
  // Core API integration
  const { data: exam, isLoading, error } = useApiQuery(
    examsQueryKeys.detail(examId),
    EXAM_ENDPOINTS.DETAIL(examId)
  );
  
  // State for tracking UI state
  const [expanded, setExpanded] = useState(false);
  
  // Core logging integration
  const toggleExpanded = () => {
    logger.debug('Toggling exam card', { examId, expanded: !expanded });
    setExpanded(!expanded);
  };
  
  if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div>Error loading exam</div>;
  }
  
  // Core UI components integration
  return (
    <Card>
      <CardHeader>
        <CardTitle>{exam.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {expanded && <p>{exam.description}</p>}
        <div className="flex justify-between mt-4">
          <Button onClick={toggleExpanded}>
            {expanded ? 'Show Less' : 'Show More'}
          </Button>
          
          {canEditExam && (
            <Button variant="outline">Edit</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
```

## Contributing to Core

When you identify patterns that could benefit other features:

1. Document the pattern
2. Discuss with the team
3. Create a proposal for promoting to core
4. Implement in core following established patterns
5. Update feature to use new core functionality

## Need Help?

If you have questions about core module integration, refer to:

1. This documentation
2. Core module documentation
3. Architecture principles documentation
4. Consult with the core team
