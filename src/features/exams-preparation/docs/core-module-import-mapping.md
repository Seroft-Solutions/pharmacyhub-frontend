# Core Module Import Mapping for Exams Preparation Feature

This document provides a detailed mapping of imports that need to be updated in the exams-preparation feature to properly integrate with the Core Module Foundation.

## State Management

### Current Implementation

The feature currently uses a local store factory implementation in `storeFactory.ts` which is marked as deprecated:

```typescript
/**
 * DEPRECATED: This store factory has been promoted to core.
 * 
 * Use the core state module instead:
 * import { createStore, createStoreFactory, createSelectors } from '@/core/state';
 * 
 * See docs/STATE_MANAGEMENT.md for migration details.
 */
```

### Files to Update

| File | Current Import | Updated Import |
|------|---------------|---------------|
| `src/features/exams-preparation/state/stores/examStore.ts` | `import { createStore } from '../storeFactory';` | `import { createStore } from '@/core/state';` |
| `src/features/exams-preparation/state/stores/examAttemptStore.ts` | `import { createStore } from '../storeFactory';` | `import { createStore } from '@/core/state';` |
| `src/features/exams-preparation/state/stores/examEditorStore.ts` | `import { createStore } from '../storeFactory';` | `import { createStore } from '@/core/state';` |
| `src/features/exams-preparation/state/stores/examPreparationStore.ts` | `import { createStore } from '../storeFactory';` | `import { createStore } from '@/core/state';` |
| `src/features/exams-preparation/state/contextFactory.ts` | Likely uses local implementation | Should use `@/core/state` implementation |

## UI Components

### Current Implementation

The feature currently uses components from `@/components/ui` but should ideally use them from the core UI module:

```typescript
// Example from ExamStatusBadge.tsx
import { Badge, BadgeProps } from "@/components/ui/badge";
```

### Files to Update

| Component File | Current Import | Updated Import |
|----------------|---------------|---------------|
| `src/features/exams-preparation/components/atoms/ExamStatusBadge.tsx` | `import { Badge, BadgeProps } from "@/components/ui/badge";` | `import { Badge, BadgeProps } from "@/core/ui/atoms/badge";` |
| Other components in the atoms directory | Likely use `@/components/ui` | Should use `@/core/ui/atoms` |
| Components in molecules directory | May use `@/components/ui` | Should use appropriate imports from `@/core/ui` |
| Components in organisms directory | May use `@/components/ui` | Should use appropriate imports from `@/core/ui` |

## Auth and RBAC

### Current Implementation

The feature exports RBAC functionality but it's unclear if it's properly integrated with the core RBAC module:

```typescript
// From index.ts
export {
  ExamPermission,
  ExamRole,
  canViewExam,
  canTakeExam,
  // ...
} from './rbac';
```

### Files to Verify and Update

| Directory/File | Current Integration | Expected Integration |
|----------------|-------------------|---------------------|
| `src/features/exams-preparation/rbac/` | Unknown if using core RBAC | Should use `@/core/rbac` services |
| `src/features/exams-preparation/components/guards/` | Likely contains auth guards | Should use `@/core/auth` for auth checks |

## API Integration

### Current Implementation

The feature is already using the core API module correctly:

```typescript
import { useApiQuery } from '@/core/api/hooks/query/useApiQuery';
```

### Areas to Verify

While the feature appears to be correctly using the core API module, we should verify consistent usage across all API calls to ensure no duplicate implementation exists.

## Utils Integration

### Current Implementation

The feature uses core utils for logging:

```typescript
import logger from '@/core/utils/logger';
```

### Areas to Verify

Verify all utility functions to ensure they don't duplicate functionality available in core utils.

## Concrete Action Plan

1. **State Management Updates**:
   - Remove the deprecated `storeFactory.ts` file
   - Update all stores to use the core state module
   - Verify proper migration of persisted state settings

2. **UI Component Updates**:
   - Audit all components to map current UI imports
   - Update imports to use core UI components
   - Verify correct component usage patterns

3. **Auth & RBAC Updates**:
   - Review and update RBAC implementation
   - Ensure proper integration with core auth services
   - Verify permission checks follow core patterns

4. **API & Utils Verification**:
   - Verify consistent use of core API hooks
   - Check utils for any duplication of core functionality
