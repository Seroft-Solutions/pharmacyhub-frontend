# RBAC Integration for Exams Feature

This document describes how to use the RBAC (Role-Based Access Control) utilities in the Exams-Preparation feature.

## Overview

The RBAC integration for the Exams-Preparation feature provides a comprehensive set of utilities for implementing role-based access control:

- **Permission-based Operations**: Define granular operations that can be checked for permissions
- **Guards**: Components for conditional rendering based on permissions
- **Hooks**: Custom hooks for checking permissions and adapting UI based on roles
- **API Integration**: Services for communicating with the backend for permission checks

## Available Operations

The following operations are defined for the Exams feature in `ExamOperation` enum:

### View Operations
- `VIEW_EXAMS`: Permission to view the list of exams
- `VIEW_EXAM_DETAILS`: Permission to view detailed exam information
- `VIEW_RESULTS`: Permission to view one's own results
- `VIEW_ALL_RESULTS`: Permission to view results of all users

### Exam Management Operations
- `CREATE_EXAM`: Permission to create new exams
- `EDIT_EXAM`: Permission to edit existing exams
- `DELETE_EXAM`: Permission to delete exams
- `PUBLISH_EXAM`: Permission to publish exams (make them visible)
- `ARCHIVE_EXAM`: Permission to archive exams
- `DUPLICATE_EXAM`: Permission to duplicate/clone an exam
- `IMPORT_EXAM`: Permission to import exams from external sources
- `EXPORT_EXAM`: Permission to export exams to external formats

### Question Management Operations
- `MANAGE_QUESTIONS`: General permission to manage questions
- `CREATE_QUESTION`: Permission to create new questions
- `EDIT_QUESTION`: Permission to edit existing questions
- `DELETE_QUESTION`: Permission to delete questions
- `REORDER_QUESTIONS`: Permission to change question order

### Student Operations
- `TAKE_EXAM`: Permission to attempt an exam
- `SUBMIT_EXAM`: Permission to submit exam answers
- `RESUME_EXAM`: Permission to resume an incomplete exam

### Payment Operations
- `MANAGE_PAYMENTS`: Permission to manage payment settings
- `ACCESS_PREMIUM`: Permission to access premium exams
- `PURCHASE_EXAM`: Permission to purchase exams

### Analytics Operations
- `VIEW_ANALYTICS`: Permission to view exam analytics
- `EXPORT_ANALYTICS`: Permission to export analytics data

## Using RBAC Components

### 1. ExamOperationGuard

The `ExamOperationGuard` component conditionally renders content based on operation permissions.

```tsx
import { ExamOperationGuard, ExamOperation } from '@/features/exams-preparation/rbac';

function ProtectedComponent() {
  return (
    <ExamOperationGuard 
      operation={ExamOperation.VIEW_EXAMS}
      fallback={<AccessDeniedMessage />}
      loadingComponent={<LoadingSpinner />}
    >
      <ExamList />
    </ExamOperationGuard>
  );
}
```

#### Props
- `operation`: The operation to check permission for
- `options`: Optional context for the permission check
- `fallback`: Content to show if permission check fails
- `loadingComponent`: Content to show while checking permissions
- `renderNothing`: Whether to render nothing (instead of fallback) if permission check fails
- `errorMessage`: Custom error message for access denied
- `errorComponent`: Custom component to show on error

### 2. ExamRoleGuard

The `ExamRoleGuard` component conditionally renders content based on user roles.

```tsx
import { ExamRoleGuard } from '@/features/exams-preparation/rbac';

function AdminComponent() {
  return (
    <ExamRoleGuard 
      roles={['admin']}
      fallback={<AccessDeniedMessage />}
    >
      <AdminPanel />
    </ExamRoleGuard>
  );
}
```

#### Props
- `roles`: Role or array of roles to check
- `fallback`: Content to show if role check fails
- `renderNothing`: Whether to render nothing if role check fails
- `loadingComponent`: Content to show while checking roles

### 3. ConditionalContent

The `ConditionalContent` component provides lightweight conditional rendering based on permissions. It's designed for inline use within components.

```tsx
import { ConditionalContent, ExamOperation } from '@/features/exams-preparation/rbac';

function ExamActions() {
  return (
    <div>
      <Button>View</Button>
      
      <ConditionalContent operation={ExamOperation.EDIT_EXAM}>
        <Button>Edit</Button>
      </ConditionalContent>
      
      <ConditionalContent 
        operation={ExamOperation.DELETE_EXAM}
        fallback={<DisabledButton>Delete</DisabledButton>}
      >
        <Button>Delete</Button>
      </ConditionalContent>
    </div>
  );
}
```

#### Props
- `operation`: The operation to check permission for
- `children`: Content to render if permission check passes
- `fallback`: Content to render if permission check fails
- `options`: Optional context for the permission check
- `showWhenLoading`: Whether to show content while permissions are loading

### 4. ExamActionButtons

The `ExamActionButtons` component provides a reusable set of permission-checked action buttons.

```tsx
import { ExamActionButtons } from '@/features/exams-preparation/components/molecules';

function ExamRow({ exam }) {
  return (
    <tr>
      <td>{exam.title}</td>
      <td>
        <ExamActionButtons
          examId={exam.id}
          onView={() => handleView(exam.id)}
          onEdit={() => handleEdit(exam.id)}
          onDelete={() => handleDelete(exam.id)}
        />
      </td>
    </tr>
  );
}
```

#### Props
- `examId`: The ID of the exam
- `onView`: Callback for view action
- `onEdit`: Callback for edit action
- `onDelete`: Callback for delete action
- `size`: Size of the buttons
- `variant`: Variant of the buttons
- `className`: Additional CSS class

### 5. ExamNavigation

The `ExamNavigation` component provides a navigation menu that adapts to user roles and permissions.

```tsx
import { ExamNavigation } from '@/features/exams-preparation/components/organisms';

function Layout({ children }) {
  return (
    <div className="flex">
      <div className="w-64 border-r">
        <ExamNavigation />
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}
```

## Using RBAC Hooks

### 1. useExamPermission

The `useExamPermission` hook checks permission for a specific operation.

```tsx
import { useExamPermission, ExamOperation } from '@/features/exams-preparation/rbac';

function EditButton({ examId }) {
  const { hasPermission, isLoading } = useExamPermission(
    ExamOperation.EDIT_EXAM,
    { context: { examId } }
  );
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!hasPermission) {
    return null;
  }
  
  return <Button>Edit</Button>;
}
```

#### Return Value
- `hasPermission`: Whether the user has permission
- `isLoading`: Whether permission check is loading
- `error`: Any error that occurred
- `operation`: The operation that was checked
- `permissions`: The underlying permissions that were checked

### 2. useExamFeatureAccess

The `useExamFeatureAccess` hook provides convenience methods for common exam feature permissions.

```tsx
import { useExamFeatureAccess } from '@/features/exams-preparation/rbac';

function ExamActions() {
  const { 
    canCreateExam, 
    canEditExam, 
    canDeleteExam,
    isAdmin,
    isLoading 
  } = useExamFeatureAccess();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div>
      {canCreateExam && <CreateButton />}
      {canEditExam && <EditButton />}
      {canDeleteExam && <DeleteButton />}
      {isAdmin && <AdminActions />}
    </div>
  );
}
```

#### Return Value
Comprehensive set of boolean flags for common permission checks. See the hook's TypeScript interface for full details.

### 3. useGuardedCallback

The `useGuardedCallback` hook wraps a callback with a permission check.

```tsx
import { useGuardedCallback, ExamOperation } from '@/features/exams-preparation/rbac';

function DeleteButton({ examId }) {
  const handleDelete = useGuardedCallback(
    ExamOperation.DELETE_EXAM,
    () => deleteExam(examId),
    {
      context: { examId },
      showNotification: true,
      notificationMessage: `You don't have permission to delete this exam`
    }
  );
  
  return <Button onClick={handleDelete}>Delete</Button>;
}
```

The callback will only execute if the user has permission. If they don't, an optional notification can be shown.

### 4. useExamRoleUI

The `useExamRoleUI` hook provides UI flags based on the user's roles and permissions.

```tsx
import { useExamRoleUI } from '@/features/exams-preparation/rbac';

function Dashboard() {
  const {
    showAdminNav,
    showCreateExam,
    showManageExams,
    isAdmin,
    isInstructor,
    isLoading
  } = useExamRoleUI();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div>
      {showAdminNav && <AdminNav />}
      {showCreateExam && <CreateExamButton />}
      {showManageExams && <ManagementPanel />}
      {isAdmin && <AdminPanel />}
      {isInstructor && <InstructorPanel />}
    </div>
  );
}
```

#### Return Value
Comprehensive set of boolean flags for UI decisions. See the hook's TypeScript interface for full details.

## Route-Level Protection with withExamPermission

The `withExamPermission` HOC protects entire pages or routes with permission checks.

```tsx
import { withExamPermission, ExamOperation } from '@/features/exams-preparation/rbac';

function AdminDashboard() {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <AdminContent />
    </div>
  );
}

export default withExamPermission(
  AdminDashboard,
  ExamOperation.VIEW_ALL_RESULTS,
  {
    fallbackUrl: '/exams',
    customFallback: <CustomDeniedMessage />
  }
);
```

## API Integration

See [RBAC API Integration Guide](./rbac-api-integration-guide.md) for details on integrating with the backend API.

## Role-Based UI Customization

See [Role-Based UI Guide](./role-based-ui-guide.md) for details on creating UIs that adapt to user roles.

## Best Practices

1. **Use Operation Enums**: Always use the `ExamOperation` enum instead of hardcoded permission strings.

2. **Handle Loading States**: Always handle loading states in your permission checks to prevent UI flicker.

3. **Provide Fallbacks**: Give users meaningful fallbacks when they don't have permission.

4. **Use Context**: When checking permission for a specific resource (like an exam), always provide the resource ID in the context.

5. **Layer Protection**: Implement protection at multiple levels (route, component, action) for security in depth.

6. **Prefer Composition**: When building complex UIs, use the `ConditionalContent` component for inline permission checks.

7. **Test Different Roles**: Test your UI with different user roles to ensure it adapts correctly.

8. **Document Required Permissions**: Document which operations are required for each feature.
