# PharmacyHub Code Cleanup Guide

This document outlines redundant files that can be safely removed as part of code cleanup, along with their updated alternatives.

## Redundant Files to Remove

### 1. Legacy API Client

**File to remove:** `src/lib/api.ts`

**Replacement:** Use the shared API client pattern with domain-specific API services:
- Base API Client: `src/shared/api/apiClient.ts`
- Exam API Service: `src/features/exams/api/examApi.ts`
- Progress API Service: `src/features/progress/api/progressApi.ts`

### 2. Legacy Exam Hook

**File to remove:** `src/hooks/useExam.ts`

**Replacement:** Use the new React Query hooks:
- Exam Hooks: `src/features/exams/hooks/useExamQueries.ts`

### 3. Legacy Progress Hook

**File to remove:** `src/hooks/useProgress.ts` 

**Replacement:** Use the new React Query hooks:
- Progress Hooks: `src/features/progress/hooks/useProgressQueries.ts`

## Required Updates

When removing these files, ensure that all components that depend on them are updated to use the replacements:

### ExamLayout Component

Updated reference from:
```typescript
import { useExam } from '@/hooks/useExam';
```

To:
```typescript
import { useExamSession } from '@/features/exams/hooks/useExamQueries';
```

And modify the hook call:
```typescript
const { ... } = useExamSession(parseInt(examId!));
```

### Progress Components

Update any components that use the old progress hook to use the new hooks:

```typescript
// Old way
import { useProgress } from '@/hooks/useProgress';

// New way
import { useProgress } from '@/features/progress/hooks/useProgressQueries';
```

## Documentation Updates

The following documentation files reference the old API implementation and should be updated:

1. `wiki/guides/feature-implementation.md`
2. `wiki/development/README.md`

Update these references to point to the new API client pattern.

## Benefits of New Implementation

1. **Consistent API Client Usage**: All features use the same base API client
2. **Better Type Safety**: Improved TypeScript interfaces for all API responses
3. **Enhanced Error Handling**: Standardized error handling across all API calls
4. **Optimized Data Fetching**: Efficient caching and data invalidation with React Query
5. **Domain-Driven Structure**: API services and hooks organized by feature domain
