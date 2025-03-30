# Import Update Plan for Exams Preparation Feature

## Overview

This document outlines the plan for updating imports in files outside the `exams-preparation` feature to use the new feature structure. The plan focuses on migrating from the deprecated `exams` feature to the new `exams-preparation` feature.

## Files Requiring Updates

Based on our analysis, the following files need to be updated to use the new `exams-preparation` feature:

### App Pages

1. `src/app/(exams)/exam/[id]/page.tsx`
   - Update import for `ExamContainer` component
   - Update import for `useExam` hook
   - Update imports for `ExamTimer` and `QuestionNavigation` components

2. `src/app/(exams)/exam/review/[id]/page.tsx`
   - Update import for `ReviewMode` component
   - Update import for `useExamStore`
   - Update import for `examService`

3. `src/app/(exams)/exam/dashboard/page.tsx`
   - Update import for `useExamStats` hook

4. `src/app/(exams)/exam/results/[attemptId]/page.tsx`
   - Update import for exam result components and hooks

5. `src/app/(dashboard)/payments/manual/[examId]/page.tsx`
   - Update import for exam-related hooks and components

### Feature Integration

1. `src/features/payments/api/hooks/usePremiumAccessHooks.ts`
   - Update imports for exam-related types and hooks

2. `src/features/payments/components/PaperPricingManager.tsx`
   - Update imports for exam-related components and hooks

3. `src/features/dashboard/api/hooks/useDashboardData.ts`
   - Update imports for exam-related hooks and types

## Implementation Approach

### Step 1: Create Compatibility Layer (Optional)

Consider creating a temporary compatibility layer in the `exams` feature that re-exports components and hooks from the `exams-preparation` feature. This would allow for a phased migration without breaking existing functionality.

```typescript
// src/features/exams/index.ts
export {
  useExam,
  useExams,
  useExamResult
  // ... other hooks
} from '@/features/exams-preparation';

export {
  ExamContainer,
  ExamQuestion,
  ExamResults
  // ... other components
} from '@/features/exams-preparation';

// Re-export types
export type {
  Exam,
  Question,
  ExamAttempt
  // ... other types
} from '@/features/exams-preparation';
```

### Step 2: Update App Pages

For each app page identified above:

1. Update import statements to use the new feature
2. Test the page to ensure functionality is maintained
3. Fix any type errors or runtime issues that may arise

Example:
```typescript
// OLD:
import ExamContainer from '@/features/exams/components/ExamContainer';
import { useExam } from '@/features/exams/api/UseExamApi';

// NEW:
import { ExamContainer } from '@/features/exams-preparation';
import { useExam } from '@/features/exams-preparation';
```

### Step 3: Update Other Feature Integrations

For each feature that integrates with the exams feature:

1. Update import statements to use the new feature
2. Test the integration points to ensure functionality is maintained
3. Fix any type errors or runtime issues that may arise

### Step 4: Remove Compatibility Layer

Once all imports have been updated to directly use the `exams-preparation` feature:

1. Remove the compatibility layer from the `exams` feature
2. Deprecate and eventually remove the `exams` feature entirely

## Testing Strategy

For each updated file:

1. Perform unit tests where applicable
2. Perform integration tests to verify feature interactions
3. Conduct end-to-end testing of critical user flows
4. Perform manual testing of updated pages and components

## Rollout Strategy

1. Implement changes in a feature branch
2. Use feature flags to gradually roll out updates if necessary
3. Monitor for any issues during the transition period
4. Fully deprecate the old `exams` feature once all imports have been updated

## Timeline

- Estimated time for app page updates: 2-3 days
- Estimated time for feature integration updates: 1-2 days
- Testing and validation: 1-2 days
- Total estimated time: 4-7 days
