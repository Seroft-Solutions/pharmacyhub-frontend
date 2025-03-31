# Exams Preparation RBAC Operations Guide

This document provides a comprehensive overview of the Role-Based Access Control (RBAC) system used in the Exams Preparation feature. It explains all available operations, their associated permissions, and best practices for implementing permission checks.

## Operations Overview

The Exams Preparation feature defines a set of operations through the `ExamOperation` enum in `src/features/exams-preparation/rbac/types/index.ts`. These operations represent specific actions that users can perform within the feature.

### View Operations

| Operation | Description | Required Permission(s) |
|-----------|-------------|------------------------|
| `VIEW_EXAMS` | Permission to view the list of exams | `exam:view` |
| `VIEW_EXAM_DETAILS` | Permission to view detailed exam information | `exam:view:details` |
| `VIEW_RESULTS` | Permission to view one's own results | `exam:results:view` |
| `VIEW_ALL_RESULTS` | Permission to view results of all users | `exam:results:view` + `admin:view` |

### Exam Management Operations

| Operation | Description | Required Permission(s) |
|-----------|-------------|------------------------|
| `CREATE_EXAM` | Permission to create new exams | `exam:create` |
| `EDIT_EXAM` | Permission to edit existing exams | `exam:edit` |
| `DELETE_EXAM` | Permission to delete exams | `exam:delete` |
| `PUBLISH_EXAM` | Permission to publish exams (make them visible) | `exam:publish` |
| `ARCHIVE_EXAM` | Permission to archive exams | `exam:archive` |
| `DUPLICATE_EXAM` | Permission to duplicate/clone an exam | `exam:view` + `exam:create` |
| `IMPORT_EXAM` | Permission to import exams from external sources | `exam:create` + `import:exams` |
| `EXPORT_EXAM` | Permission to export exams to external formats | `exam:view` + `export:exams` |

### Question Management Operations

| Operation | Description | Required Permission(s) |
|-----------|-------------|------------------------|
| `MANAGE_QUESTIONS` | General permission to manage questions | `exam:edit:questions` |
| `CREATE_QUESTION` | Permission to create new questions | `question:create` |
| `EDIT_QUESTION` | Permission to edit existing questions | `question:edit` |
| `DELETE_QUESTION` | Permission to delete questions | `question:delete` |
| `REORDER_QUESTIONS` | Permission to change question order | `question:edit` + `exam:edit` |

### Student Operations

| Operation | Description | Required Permission(s) |
|-----------|-------------|------------------------|
| `TAKE_EXAM` | Permission to attempt an exam | `exam:take` |
| `SUBMIT_EXAM` | Permission to submit exam answers | `attempt:submit` |
| `RESUME_EXAM` | Permission to resume an incomplete exam | `exam:take` + `attempt:resume` |

### Payment Operations

| Operation | Description | Required Permission(s) |
|-----------|-------------|------------------------|
| `MANAGE_PAYMENTS` | Permission to manage payment settings | `payments:manage` |
| `ACCESS_PREMIUM` | Permission to access premium exams | `premium:access` |
| `PURCHASE_EXAM` | Permission to purchase exams | `exam:purchase` |

### Analytics Operations

| Operation | Description | Required Permission(s) |
|-----------|-------------|------------------------|
| `VIEW_ANALYTICS` | Permission to view exam analytics | `analytics:view` |
| `EXPORT_ANALYTICS` | Permission to export analytics data | `analytics:view` + `analytics:export` |

## Using Operations in Components

### Using Guards

The `ExamOperationGuard` component can be used to conditionally render content based on permission checks:

```tsx
import { ExamOperationGuard } from '@/features/exams-preparation/rbac';
import { ExamOperation } from '@/features/exams-preparation/rbac/types';

function AdminPage() {
  return (
    <ExamOperationGuard
      operation={ExamOperation.MANAGE_QUESTIONS}
      fallback={<AccessDeniedMessage />}
    >
      <QuestionEditor />
    </ExamOperationGuard>
  );
}
```

### Using Hooks

For more control, you can use the permission hooks directly:

```tsx
import { useExamPermission } from '@/features/exams-preparation/rbac';
import { ExamOperation } from '@/features/exams-preparation/rbac/types';

function ExamActions({ examId }) {
  const { hasPermission, isLoading } = useExamPermission(
    ExamOperation.EDIT_EXAM,
    { context: { examId } }
  );
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div>
      {hasPermission && <EditButton onClick={handleEdit} />}
    </div>
  );
}
```

For more comprehensive access checks, use the `useExamFeatureAccess` hook:

```tsx
import { useExamFeatureAccess } from '@/features/exams-preparation/rbac';

function ExamDashboard() {
  const {
    canCreateExam,
    canViewResults,
    canViewAllResults,
    isAdmin,
    isLoading
  } = useExamFeatureAccess();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div>
      {canCreateExam && <CreateExamButton />}
      {canViewResults && <MyResultsButton />}
      {canViewAllResults && <AllResultsButton />}
      {isAdmin && <AdminPanel />}
    </div>
  );
}
```

## Server-Side Permission Checks

For server components and API routes, use the server-side permission utilities:

```tsx
// In a server component
import { requireExamPermission } from '@/features/exams-preparation/rbac/server';
import { ExamOperation } from '@/features/exams-preparation/rbac/types';

export default async function AdminPage() {
  // This will redirect if the user doesn't have permission
  await requireExamPermission(ExamOperation.MANAGE_QUESTIONS);
  
  return <AdminDashboard />;
}

// In an API route
import { withExamPermission } from '@/features/exams-preparation/rbac/server';
import { ExamOperation } from '@/features/exams-preparation/rbac/types';

export const GET = withExamPermission(
  async (req) => {
    // Handle the request
    return NextResponse.json({ data: 'Success' });
  },
  ExamOperation.VIEW_EXAMS
);
```

## Best Practices

1. **Use Operations, Not Permissions**: Always use the `ExamOperation` enum rather than hardcoding permission strings. This provides better type safety and allows for consistent permission mapping.

2. **Provide Context When Needed**: For operations that might depend on the specific resource (like `EDIT_EXAM`), always provide the context object with relevant IDs.

3. **Handle Loading States**: Always handle the `isLoading` state from permission hooks to provide a good user experience.

4. **Use Feature Access Hook for Multiple Checks**: When you need to check multiple permissions, use `useExamFeatureAccess` rather than multiple `useExamPermission` hooks.

5. **Use Guards for Simple Cases**: For simple conditional rendering, use the `ExamOperationGuard` component.

6. **Consider Server vs. Client Protection**: Remember to implement both client-side and server-side permission checks for complete protection.

7. **Protect Routes at Layout Level**: Whenever possible, protect routes at the layout level to prevent unnecessary rendering of child components.

## Extending Operations

When adding new operations:

1. Add the new operation to the `ExamOperation` enum
2. Add a mapping in the `OperationPermissionMap` to link it to one or more permissions
3. Update the documentation to reflect the new operation
4. If needed, add the operation to relevant hooks (like `useExamFeatureAccess`)

## Implementation Details

The RBAC system for Exams Preparation is built on top of the core RBAC module. The `ExamOperation` enum and `OperationPermissionMap` provide a domain-specific abstraction over the core permission strings.

When permission checks are performed, the operation is mapped to its corresponding permission(s), and these permissions are then checked against the user's assigned permissions.