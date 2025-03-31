# Implementing RBAC for Exams Feature

This guide explains how to use the RBAC (Role-Based Access Control) system in the Exams-Preparation feature.

## Overview

The RBAC implementation for the Exams-Preparation feature provides several ways to apply permission checks:

1. **Route-Level Protection**: Protecting entire pages or routes
2. **Component-Level Protection**: Conditionally rendering components based on permissions
3. **Action-Level Protection**: Guarding actions (like button clicks) with permission checks
4. **UI-Level Protection**: Showing or hiding UI elements based on permissions

## Components and Hooks

### Route-Level Protection

Use the `withExamPermission` HOC to protect routes:

```tsx
// src/app/admin/exams-analytics/page.tsx
import { withExamPermission, ExamOperation } from '@/features/exams-preparation/rbac';
import AnalyticsDashboard from '@/features/exams-preparation/components/organisms/AnalyticsDashboard';

// Wrap the component with withExamPermission
const ProtectedAnalyticsPage = withExamPermission(
  AnalyticsDashboard,
  ExamOperation.VIEW_ANALYTICS,
  { 
    // Optional: Redirect to this URL if permission denied
    fallbackUrl: '/admin/exams',
    
    // Optional: Custom fallback component
    customFallback: <AccessDeniedMessage />,
    
    // Optional: Context for the permission check
    context: { examId: '123' }
  }
);

// Export the protected component as the page
export default ProtectedAnalyticsPage;
```

### Component-Level Protection

Use the `ExamOperationGuard` component to conditionally render components:

```tsx
import { ExamOperationGuard, ExamOperation } from '@/features/exams-preparation/rbac';

function AdminDashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Only render if user has CREATE_EXAM permission */}
      <ExamOperationGuard 
        operation={ExamOperation.CREATE_EXAM}
        fallback={<AccessDeniedMessage />}
        loadingComponent={<LoadingSpinner />}
      >
        <CreateExamForm />
      </ExamOperationGuard>
    </div>
  );
}
```

### Action-Level Protection

Use the `useGuardedCallback` hook to guard actions:

```tsx
import { useGuardedCallback, ExamOperation } from '@/features/exams-preparation/rbac';
import { Button } from '@/components/ui/button';

function DeleteExamButton({ examId }) {
  // This callback will only execute if user has permission
  const handleDelete = useGuardedCallback(
    ExamOperation.DELETE_EXAM,
    () => deleteExam(examId),
    {
      // Provide context for the permission check
      context: { examId },
      
      // Show a notification if permission denied
      showNotification: true,
      
      // Custom notification message
      notificationMessage: `You don't have permission to delete exam #${examId}`
    }
  );

  return (
    <Button onClick={handleDelete} variant="destructive">
      Delete Exam
    </Button>
  );
}
```

### UI-Level Protection

Use the `ConditionalContent` component for inline conditional rendering:

```tsx
import { ConditionalContent, ExamOperation } from '@/features/exams-preparation/rbac';

function ExamCard({ exam }) {
  return (
    <div className="card">
      <h3>{exam.title}</h3>
      
      <div className="actions">
        {/* Always show View button */}
        <Button variant="outline">View</Button>
        
        {/* Only show Edit button if user has EDIT_EXAM permission */}
        <ConditionalContent 
          operation={ExamOperation.EDIT_EXAM}
          options={{ context: { examId: exam.id } }}
        >
          <Button>Edit</Button>
        </ConditionalContent>
      </div>
      
      {/* Show a different UI based on permissions */}
      <ConditionalContent 
        operation={ExamOperation.VIEW_ANALYTICS}
        fallback={<BasicExamStats />}
      >
        <DetailedAnalytics examId={exam.id} />
      </ConditionalContent>
    </div>
  );
}
```

### Reusable Action Buttons

Use the `ExamActionButtons` component for tables and lists:

```tsx
import { ExamActionButtons } from '@/features/exams-preparation/components/molecules';

function ExamsTable({ exams }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {exams.map(exam => (
          <tr key={exam.id}>
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
        ))}
      </tbody>
    </table>
  );
}
```

## Permission Hooks

### Basic Permission Check

```tsx
import { useExamPermission, ExamOperation } from '@/features/exams-preparation/rbac';

function EditButton({ examId }) {
  const { hasPermission, isLoading } = useExamPermission(
    ExamOperation.EDIT_EXAM,
    { context: { examId } }
  );
  
  if (isLoading) {
    return <Loading />;
  }
  
  if (!hasPermission) {
    return null;
  }
  
  return <Button>Edit</Button>;
}
```

### Feature Access Check

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
  
  if (isLoading) {
    return <Loading />;
  }
  
  return (
    <div className="header">
      <h1>Exams</h1>
      <div className="actions">
        {canCreateExam && <CreateButton />}
        {isAdmin && <AdminPanel />}
      </div>
    </div>
  );
}
```

## Best Practices

1. **Add Context**: Always provide context (like `examId`) for resource-specific operations
2. **Handle Loading States**: Always handle loading states to prevent UI flicker
3. **Provide Fallbacks**: Use fallbacks to show appropriate messages when access is denied
4. **Layer Protection**: Add protection at multiple levels (route, component, action) for security in depth
5. **Keep Permissions Granular**: Use specific operations rather than generic ones
6. **Use Role Guards**: For role-based checks, use `ExamRoleGuard` instead of operation-based guards

## Examples

See the examples directory for more detailed examples:

- `ProtectedRoutesExample.tsx`: Examples of route protection
- `ConditionalContentExample.tsx`: Examples of conditional UI rendering
- `GuardedCallbackExample.tsx`: Examples of guarded action buttons
