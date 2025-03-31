# RBAC Integration for Exams Feature

This document describes how to use the RBAC (Role-Based Access Control) utilities in the Exams feature.

## Table of Contents

1. [Available Operations](#available-operations)
2. [Permission Guards](#permission-guards)
   - [ExamOperationGuard](#examoperationguard)
   - [ExamRoleGuard](#examroleguard)
   - [ConditionalContent](#conditionalcontent)
   - [withExamPermission HOC](#withexampermission-hoc)
3. [Permission Hooks](#permission-hooks)
   - [useExamPermission](#useexampermission)
   - [useExamFeatureAccess](#useexamfeatureaccess)
   - [useGuardedCallback](#useguardedcallback)
   - [useExamRoleUI](#useexamroleui)
4. [UI Components](#ui-components)
   - [ExamActionButtons](#examactionbuttons)
   - [ExamNavigation](#examnavigation)
5. [API Integration](#api-integration)
6. [Best Practices](#best-practices)
7. [Examples](#examples)

## Available Operations

The following operations are defined for the Exams feature:

```tsx
export enum ExamOperation {
  // View operations
  VIEW_EXAMS = 'VIEW_EXAMS',                // Permission to view the list of exams
  VIEW_EXAM_DETAILS = 'VIEW_EXAM_DETAILS',  // Permission to view detailed exam information
  VIEW_RESULTS = 'VIEW_RESULTS',            // Permission to view one's own results
  VIEW_ALL_RESULTS = 'VIEW_ALL_RESULTS',    // Permission to view results of all users
  
  // Exam management operations
  CREATE_EXAM = 'CREATE_EXAM',              // Permission to create new exams
  EDIT_EXAM = 'EDIT_EXAM',                  // Permission to edit existing exams
  DELETE_EXAM = 'DELETE_EXAM',              // Permission to delete exams
  PUBLISH_EXAM = 'PUBLISH_EXAM',            // Permission to publish exams (make them visible)
  ARCHIVE_EXAM = 'ARCHIVE_EXAM',            // Permission to archive exams
  DUPLICATE_EXAM = 'DUPLICATE_EXAM',        // Permission to duplicate/clone an exam
  IMPORT_EXAM = 'IMPORT_EXAM',              // Permission to import exams from external sources
  EXPORT_EXAM = 'EXPORT_EXAM',              // Permission to export exams to external formats
  
  // Question management operations
  MANAGE_QUESTIONS = 'MANAGE_QUESTIONS',    // General permission to manage questions
  CREATE_QUESTION = 'CREATE_QUESTION',      // Permission to create new questions
  EDIT_QUESTION = 'EDIT_QUESTION',          // Permission to edit existing questions
  DELETE_QUESTION = 'DELETE_QUESTION',      // Permission to delete questions
  REORDER_QUESTIONS = 'REORDER_QUESTIONS',  // Permission to change question order
  
  // Student operations
  TAKE_EXAM = 'TAKE_EXAM',                  // Permission to attempt an exam
  SUBMIT_EXAM = 'SUBMIT_EXAM',              // Permission to submit exam answers
  RESUME_EXAM = 'RESUME_EXAM',              // Permission to resume an incomplete exam
  
  // Payment operations
  MANAGE_PAYMENTS = 'MANAGE_PAYMENTS',      // Permission to manage payment settings
  ACCESS_PREMIUM = 'ACCESS_PREMIUM',        // Permission to access premium exams
  PURCHASE_EXAM = 'PURCHASE_EXAM',          // Permission to purchase exams
  
  // Analytics operations
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',        // Permission to view exam analytics
  EXPORT_ANALYTICS = 'EXPORT_ANALYTICS',    // Permission to export analytics data
}
```

## Permission Guards

### ExamOperationGuard

The `ExamOperationGuard` component conditionally renders content based on permission checks.

```tsx
import { ExamOperationGuard, ExamOperation } from '@/features/exams-preparation/rbac';

function ProtectedComponent() {
  return (
    <ExamOperationGuard 
      operation={ExamOperation.VIEW_EXAMS}
      fallback={<AccessDeniedMessage />}
      loadingComponent={<Loading />}
    >
      <YourComponent />
    </ExamOperationGuard>
  );
}
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `operation` | `ExamOperation` | The operation to check permission for |
| `options` | `ExamPermissionOptions` | Additional options for the permission check |
| `children` | `ReactNode` | Content to render when permission check passes |
| `fallback` | `ReactNode` | Content to render when permission check fails |
| `renderNothing` | `boolean` | Whether to render nothing when permission check fails |
| `loadingComponent` | `ReactNode` | Content to render while checking permissions |
| `errorMessage` | `string` | Custom error message for access denied |
| `errorComponent` | `ReactNode` | Custom component for error state |

### ExamRoleGuard

The `ExamRoleGuard` component conditionally renders content based on user roles.

```tsx
import { ExamRoleGuard } from '@/features/exams-preparation/rbac';

function AdminComponent() {
  return (
    <ExamRoleGuard 
      roles="admin"
      fallback={<AccessDeniedMessage />}
    >
      <AdminDashboard />
    </ExamRoleGuard>
  );
}
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `roles` | `string \| string[]` | The role(s) to check for |
| `children` | `ReactNode` | Content to render when role check passes |
| `fallback` | `ReactNode` | Content to render when role check fails |
| `renderNothing` | `boolean` | Whether to render nothing when role check fails |
| `loadingComponent` | `ReactNode` | Content to render while checking roles |

### ConditionalContent

The `ConditionalContent` component is designed for inline conditional rendering based on permissions.

```tsx
import { ConditionalContent, ExamOperation } from '@/features/exams-preparation/rbac';

function DashboardActions() {
  return (
    <div className="actions">
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

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `operation` | `ExamOperation` | The operation to check permission for |
| `children` | `ReactNode` | Content to render when permission check passes |
| `fallback` | `ReactNode` | Content to render when permission check fails |
| `options` | `ExamPermissionOptions` | Additional options for the permission check |
| `showWhenLoading` | `boolean` | Whether to show content during loading |

### withExamPermission HOC

The `withExamPermission` HOC wraps a component with permission checks, useful for protecting entire pages.

```tsx
import { withExamPermission, ExamOperation } from '@/features/exams-preparation/rbac';
import AdminDashboard from './AdminDashboard';

const ProtectedAdminDashboard = withExamPermission(
  AdminDashboard,
  ExamOperation.VIEW_ANALYTICS,
  { 
    fallbackUrl: '/access-denied',
    customFallback: <CustomAccessDenied />
  }
);

export default ProtectedAdminDashboard;
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `Component` | `React.ComponentType<P>` | The component to protect |
| `operation` | `ExamOperation` | The operation to check permission for |
| `options` | `WithExamPermissionOptions` | Additional options |

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `fallbackUrl` | `string` | URL to redirect to if permission check fails |
| `customFallback` | `ReactNode` | Custom fallback component |
| `context` | `ExamOperationContext` | Additional context for permission check |

## Permission Hooks

### useExamPermission

The `useExamPermission` hook checks permission for a specific exam operation.

```tsx
import { useExamPermission, ExamOperation } from '@/features/exams-preparation/rbac';

function EditButton({ examId }) {
  const { hasPermission, isLoading } = useExamPermission(
    ExamOperation.EDIT_EXAM,
    { context: { examId } }
  );
  
  if (isLoading) return <LoadingSpinner />;
  if (!hasPermission) return null;
  
  return <Button>Edit</Button>;
}
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `operation` | `ExamOperation` | The operation to check permission for |
| `options` | `ExamPermissionOptions` | Additional options for the permission check |

**Returns:**

| Property | Type | Description |
|----------|------|-------------|
| `hasPermission` | `boolean` | Whether the user has permission |
| `isLoading` | `boolean` | Whether the permission check is loading |
| `error` | `Error \| null` | Any error that occurred during the check |
| `operation` | `ExamOperation` | The operation that was checked |
| `permissions` | `string \| string[]` | The underlying permissions checked |

### useExamFeatureAccess

The `useExamFeatureAccess` hook provides a comprehensive set of permission flags for the exams feature.

```tsx
import { useExamFeatureAccess } from '@/features/exams-preparation/rbac';

function ExamHeader() {
  const { 
    canCreateExam,
    canEditExam,
    canDeleteExam,
    isAdmin,
    isLoading
  } = useExamFeatureAccess();
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div>
      <h1>Exams</h1>
      <div className="actions">
        {canCreateExam && <CreateButton />}
        {canEditExam && <EditButton />}
        {canDeleteExam && <DeleteButton />}
        {isAdmin && <AdminPanel />}
      </div>
    </div>
  );
}
```

**Returns:**

A comprehensive object with boolean flags for all exam operations and roles.

### useGuardedCallback

The `useGuardedCallback` hook wraps a callback function with a permission check.

```tsx
import { useGuardedCallback, ExamOperation } from '@/features/exams-preparation/rbac';

function DeleteButton({ examId }) {
  const handleDelete = useGuardedCallback(
    ExamOperation.DELETE_EXAM,
    () => deleteExam(examId),
    {
      context: { examId },
      showNotification: true,
      notificationMessage: `You don't have permission to delete exam #${examId}`
    }
  );
  
  return <Button onClick={handleDelete}>Delete</Button>;
}
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `operation` | `ExamOperation` | The operation to check permission for |
| `callback` | `Function` | The callback to execute if permission check passes |
| `options` | `GuardedCallbackOptions` | Additional options |

**Options:**

| Option | Type | Description |
|--------|------|-------------|
| `context` | `ExamOperationContext` | Context for the permission check |
| `showNotification` | `boolean` | Whether to show a notification if permission check fails |
| `notify` | `Function` | Custom notification function |
| `notificationMessage` | `string` | Custom notification message |
| `bypassPermissionCheck` | `boolean` | Whether to bypass the permission check (for testing) |

### useExamRoleUI

The `useExamRoleUI` hook provides UI flags based on user roles and permissions.

```tsx
import { useExamRoleUI } from '@/features/exams-preparation/rbac';

function ExamDashboard() {
  const {
    showAdminNav,
    showAllResults,
    showCreateExam,
    isAdmin,
    isInstructor,
    isLoading
  } = useExamRoleUI();
  
  if (isLoading) return <LoadingSpinner />;
  
  return (
    <div>
      <div className="sidebar">
        {showAdminNav && <AdminNav />}
      </div>
      <div className="content">
        <h1>Dashboard</h1>
        {showCreateExam && <CreateExamButton />}
        {showAllResults && <AllResultsPanel />}
        {isAdmin && <AdminPanel />}
        {isInstructor && <InstructorPanel />}
      </div>
    </div>
  );
}
```

**Returns:**

An object with boolean flags for UI customization based on roles and permissions.

## UI Components

### ExamActionButtons

The `ExamActionButtons` component renders permission-checked action buttons for exams.

```tsx
import { ExamActionButtons } from '@/features/exams-preparation/components/molecules';

function ExamRow({ exam }) {
  return (
    <tr>
      <td>{exam.title}</td>
      <td>
        <ExamActionButtons
          examId={exam.id}
          onView={() => viewExam(exam.id)}
          onEdit={() => editExam(exam.id)}
          onDelete={() => deleteExam(exam.id)}
        />
      </td>
    </tr>
  );
}
```

**Props:**

| Prop | Type | Description |
|------|------|-------------|
| `examId` | `string` | ID of the exam |
| `onView` | `Function` | View callback |
| `onEdit` | `Function` | Edit callback |
| `onDelete` | `Function` | Delete callback |
| `size` | `string` | Button size |
| `variant` | `string` | Button variant |
| `className` | `string` | Additional CSS classes |

### ExamNavigation

The `ExamNavigation` component renders a navigation menu that adapts to user roles and permissions.

```tsx
import { ExamNavigation } from '@/features/exams-preparation/components/organisms';

function ExamLayout({ children }) {
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

## API Integration

The RBAC system integrates with the Spring Boot backend via the `roleService.ts` module.

See the [RBAC API Integration Guide](./rbac-api-integration-guide.md) for details on the API endpoints and integration.

## Best Practices

1. **Use Operation Enums**: Always use the `ExamOperation` enum instead of hardcoded permission strings.

2. **Provide Context**: When checking permissions for specific resources (like an exam), provide the resource ID in the context.

3. **Handle Loading States**: Always handle loading states in your UI to prevent flickering.

4. **Use Guards for Routes**: Protect routes with guards to prevent unauthorized access.

5. **Use Hooks for UI Elements**: Use hooks for conditional rendering of UI elements.

6. **Use Guarded Callbacks**: Use the `useGuardedCallback` hook for action buttons.

7. **Layer Protection**: Implement protection at multiple levels for security in depth.

8. **Prefer Permission Over Role Checks**: Use permission-based checks instead of role-based checks when possible.

## Examples

The following examples demonstrate how to use the RBAC utilities in common scenarios:

- [ProtectedRoutesExample](../examples/ProtectedRoutesExample.tsx): Examples of route protection
- [ConditionalContentExample](../examples/ConditionalContentExample.tsx): Examples of conditional UI rendering
- [GuardedCallbackExample](../examples/GuardedCallbackExample.tsx): Examples of guarded action buttons
- [RoleBasedUIExample](../examples/RoleBasedUIExample.tsx): Example of a UI that adapts to user roles

See also the [Role-Based UI Customization Guide](./role-based-ui-guide.md) for more information on creating role-based UIs.
