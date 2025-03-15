# Exams Feature RBAC Migration Guide

This guide explains how to migrate from the old permission-based RBAC system to the new feature-based RBAC system in the exams feature.

## Overview

The RBAC (Role-Based Access Control) functionality has been migrated to use the centralized feature-based RBAC system. This means:

1. `useExamPermissions` → `useExamFeatureAccess`
2. `ExamPermission` → `ExamOperation`
3. Permission strings → Feature operation strings

## Import Changes

### Before

```tsx
import { useExamPermissions } from '@/features/exams/hooks';
import { ExamPermission } from '@/features/exams/constants/permissions';
```

### After

```tsx
import { useExamFeatureAccess, ExamOperation } from '@/features/exams/rbac';
```

## Hook Migration

### Before

```tsx
const { 
  canViewExams, 
  canTakeExams, 
  canManageExams,
  hasPermission 
} = useExamPermissions();

if (hasPermission(ExamPermission.CREATE_EXAM)) {
  // ...
}
```

### After

```tsx
const { 
  canViewExams, 
  canTakeExams, 
  canManageExams,
  canCreateExams,
  checkExamOperation 
} = useExamFeatureAccess();

if (canCreateExams) {
  // ...
}

// Or for custom operations
if (checkExamOperation(ExamOperation.CREATE)) {
  // ...
}
```

## Component Migration

### Before

```tsx
import { PermissionGuard } from '@/features/rbac';
import { ExamPermission } from '@/features/exams/constants/permissions';

<PermissionGuard permission={ExamPermission.VIEW_EXAMS}>
  <ExamsList />
</PermissionGuard>
```

### After

```tsx
import { ExamGuard, ExamOperationGuard, ViewExamsGuard } from '@/features/exams/rbac';

// Basic feature guard
<ExamGuard>
  <ExamComponent />
</ExamGuard>

// Operation-specific guard
<ExamOperationGuard operation={ExamOperation.VIEW}>
  <ExamsList />
</ExamOperationGuard>

// Or using the convenience guard
<ViewExamsGuard>
  <ExamsList />
</ViewExamsGuard>
```

## Permission to Operation Mapping

| Old Permission              | New Operation           |
|----------------------------|------------------------|
| ExamPermission.VIEW_EXAMS   | ExamOperation.VIEW      |
| ExamPermission.TAKE_EXAM    | ExamOperation.TAKE      |
| ExamPermission.CREATE_EXAM  | ExamOperation.CREATE    |
| ExamPermission.EDIT_EXAM    | ExamOperation.EDIT      |
| ExamPermission.DELETE_EXAM  | ExamOperation.DELETE    |
| ExamPermission.DUPLICATE_EXAM | ExamOperation.DUPLICATE |
| ExamPermission.MANAGE_QUESTIONS | ExamOperation.MANAGE_QUESTIONS |
| ExamPermission.PUBLISH_EXAM | ExamOperation.PUBLISH   |
| ExamPermission.UNPUBLISH_EXAM | ExamOperation.UNPUBLISH |
| ExamPermission.ASSIGN_EXAM  | ExamOperation.ASSIGN    |
| ExamPermission.GRADE_EXAM   | ExamOperation.GRADE     |
| ExamPermission.VIEW_RESULTS | ExamOperation.VIEW_RESULTS |
| ExamPermission.EXPORT_RESULTS | ExamOperation.EXPORT_RESULTS |
| ExamPermission.VIEW_ANALYTICS | ExamOperation.VIEW_ANALYTICS |

## Updating `usePermissions` to `useFeatureAccess`

If your component uses `usePermissions` from the RBAC feature, consider updating it to use `useFeatureAccess`:

### Before

```tsx
import { usePermissions } from '@/features/rbac/hooks';

const { 
  hasPermission, 
  hasRole,
  hasAccess 
} = usePermissions();

if (hasPermission('SOME_PERMISSION')) {
  // ...
}
```

### After

```tsx
import { useFeatureAccess } from '@/features/rbac/hooks';

const { 
  hasFeature, 
  hasOperation,
  hasRole 
} = useFeatureAccess();

if (hasOperation('feature', 'operation')) {
  // ...
}
```

## Need Help?

If you encounter any issues during migration, please refer to the [RBAC Feature Documentation](../core/rbac/README.md) or contact the development team.
