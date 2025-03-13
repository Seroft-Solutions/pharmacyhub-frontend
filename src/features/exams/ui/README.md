# Exams UI Components

This directory contains UI components specific to the Exams feature.

## Permission Usage

All UI components in this feature should use permission checks to control access to specific functionality. Use the following patterns:

### 1. Using PermissionGuard Component

```tsx
import { PermissionGuard, AnyPermissionGuard } from '@/features/rbac/ui';
import { ExamPermission } from '@/features/exams/constants/permissions';

// Example with a single permission
<PermissionGuard 
  permission={ExamPermission.CREATE_EXAM}
  fallback={<p>You do not have permission to create exams</p>}
>
  <CreateExamButton />
</PermissionGuard>

// Example with multiple permissions (any of them)
<AnyPermissionGuard 
  permissions={[
    ExamPermission.EDIT_EXAM,
    ExamPermission.DUPLICATE_EXAM
  ]}
  fallback={<p>You do not have permission to modify exams</p>}
>
  <EditExamPanel />
</AnyPermissionGuard>
```

### 2. Using usePermissions Hook

```tsx
import { usePermissions } from '@/features/rbac/hooks';
import { ExamPermission } from '@/features/exams/constants/permissions';

function ExamComponent() {
  const { hasPermission, hasAnyPermission } = usePermissions();
  
  // Check a single permission
  const canCreateExam = hasPermission(ExamPermission.CREATE_EXAM);
  
  // Check multiple permissions (any of them)
  const canModifyExam = hasAnyPermission([
    ExamPermission.EDIT_EXAM,
    ExamPermission.DUPLICATE_EXAM
  ]);
  
  return (
    <div>
      {canCreateExam && <CreateExamButton />}
      {canModifyExam && <EditExamPanel />}
    </div>
  );
}
```

Always use these patterns for permission checks rather than implementing custom checks.
