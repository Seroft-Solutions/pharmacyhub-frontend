# Exam Operations Documentation

This document provides a comprehensive overview of the operations defined in the exams-preparation feature's RBAC system.

## Operation Categories

The operations are organized into the following categories:

1. **View Operations**: Operations related to viewing exams and results
2. **Exam Management Operations**: Operations related to creating, editing, and managing exams
3. **Question Management Operations**: Operations related to creating and managing questions
4. **Student Operations**: Operations related to taking exams
5. **Payment Operations**: Operations related to premium exams and payments
6. **Analytics Operations**: Operations related to viewing and exporting analytics

## Detailed Operations List

### View Operations

| Operation | Description | Required Permissions |
|-----------|-------------|---------------------|
| `VIEW_EXAMS` | Permission to view the list of exams | `exam:view` |
| `VIEW_EXAM_DETAILS` | Permission to view detailed exam information | `exam:view:details` |
| `VIEW_RESULTS` | Permission to view one's own results | `exam:results:view` |
| `VIEW_ALL_RESULTS` | Permission to view results of all users | `exam:results:view` and `admin:view` |

### Exam Management Operations

| Operation | Description | Required Permissions |
|-----------|-------------|---------------------|
| `CREATE_EXAM` | Permission to create new exams | `exam:create` |
| `EDIT_EXAM` | Permission to edit existing exams | `exam:edit` |
| `DELETE_EXAM` | Permission to delete exams | `exam:delete` |
| `PUBLISH_EXAM` | Permission to publish exams (make them visible) | `exam:publish` |
| `ARCHIVE_EXAM` | Permission to archive exams | `exam:archive` |
| `DUPLICATE_EXAM` | Permission to duplicate/clone an exam | `exam:view` and `exam:create` |
| `IMPORT_EXAM` | Permission to import exams from external sources | `exam:create` and `import:exams` |
| `EXPORT_EXAM` | Permission to export exams to external formats | `exam:view` and `export:exams` |

### Question Management Operations

| Operation | Description | Required Permissions |
|-----------|-------------|---------------------|
| `MANAGE_QUESTIONS` | General permission to manage questions | `exam:edit:questions` |
| `CREATE_QUESTION` | Permission to create new questions | `question:create` |
| `EDIT_QUESTION` | Permission to edit existing questions | `question:edit` |
| `DELETE_QUESTION` | Permission to delete questions | `question:delete` |
| `REORDER_QUESTIONS` | Permission to change question order | `question:edit` and `exam:edit` |

### Student Operations

| Operation | Description | Required Permissions |
|-----------|-------------|---------------------|
| `TAKE_EXAM` | Permission to attempt an exam | `exam:take` |
| `SUBMIT_EXAM` | Permission to submit exam answers | `attempt:submit` |
| `RESUME_EXAM` | Permission to resume an incomplete exam | `exam:take` and `attempt:resume` |

### Payment Operations

| Operation | Description | Required Permissions |
|-----------|-------------|---------------------|
| `MANAGE_PAYMENTS` | Permission to manage payment settings | `payments:manage` |
| `ACCESS_PREMIUM` | Permission to access premium exams | `premium:access` |
| `PURCHASE_EXAM` | Permission to purchase exams | `exam:purchase` |

### Analytics Operations

| Operation | Description | Required Permissions |
|-----------|-------------|---------------------|
| `VIEW_ANALYTICS` | Permission to view exam analytics | `analytics:view` |
| `EXPORT_ANALYTICS` | Permission to export analytics data | `analytics:view` and `analytics:export` |

## Using Operations in Permission Checks

Operations can be checked using the useExamPermission hook:

```tsx
import { useExamPermission } from '@/features/exams-preparation/rbac';
import { ExamOperation } from '@/features/exams-preparation/rbac/types';

function ExamComponent() {
  const { hasPermission } = useExamPermission(ExamOperation.EDIT_EXAM);
  
  return (
    <div>
      {hasPermission && <EditButton />}
    </div>
  );
}
```

Or using the ExamOperationGuard component:

```tsx
import { ExamOperationGuard } from '@/features/exams-preparation/rbac';
import { ExamOperation } from '@/features/exams-preparation/rbac/types';

function ExamPage() {
  return (
    <ExamOperationGuard operation={ExamOperation.VIEW_EXAMS}>
      <ExamList />
    </ExamOperationGuard>
  );
}
```

## Permission Mapping

Behind the scenes, operations are mapped to one or more actual permissions using the OperationPermissionMap. This allows more flexibility in permission management, as the mapping can be changed without affecting the code that uses the operations.

For example, the `VIEW_ALL_RESULTS` operation requires both the `exam:results:view` and `admin:view` permissions. This allows for more granular control over who can perform this operation.
