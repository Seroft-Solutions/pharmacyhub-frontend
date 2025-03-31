# Exams Feature RBAC Integration

This module implements Role-Based Access Control (RBAC) for the Exams feature, ensuring proper authorization for different user roles. It follows the Core as Foundation principle by leveraging the core RBAC module rather than reimplementing functionality.

## Key Features

- Comprehensive permission system with granular operation-based control
- Integration with core RBAC module for consistent permission checking
- Client-side guards for conditional UI rendering
- Server-side middleware for route and API protection
- Type-safe permission checks with TypeScript
- Convenient hooks for common permission patterns
- Enhanced error messages with human-readable operation descriptions
- Guarded callbacks for permission-checked user interactions

## Architecture

The RBAC implementation follows the core foundation principle, leveraging the core RBAC module while providing a more exam-specific interface.

### Key Components

- **ExamOperation**: Enum of all operations that can be performed in the Exams feature
- **OperationPermissionMap**: Maps operations to permissions
- **OPERATION_DESCRIPTIONS**: Human-readable descriptions of operations for error messages
- **ExamOperationGuard**: Component that conditionally renders content based on permission
- **ExamRoleGuard**: Component that conditionally renders content based on user role
- **useExamPermission**: Hook for checking permission for an operation
- **useExamFeatureAccess**: Convenience hook for common permission patterns
- **useGuardedCallback**: Hook that wraps a callback with a permission check

### File Structure

```
src/features/exams-preparation/rbac/
├── guards/               # Permission guard components
├── hooks/                # Permission check hooks
├── server/               # Server-side permission utilities
├── types/                # TypeScript type definitions
├── examples/             # Example usage
├── constants.ts          # Shared constants (operation descriptions, etc.)
├── index.ts              # Public API
└── README.md             # Documentation
```

## Usage Examples

### Guards

To protect a component or route:

```tsx
import { ExamOperationGuard, ExamOperation } from '@/features/exams-preparation/rbac';

function ProtectedComponent() {
  return (
    <ExamOperationGuard operation={ExamOperation.VIEW_EXAMS}>
      <YourComponent />
    </ExamOperationGuard>
  );
}
```

With custom fallback and loading components:

```tsx
import { ExamOperationGuard, ExamOperation } from '@/features/exams-preparation/rbac';

function ProtectedComponent() {
  return (
    <ExamOperationGuard 
      operation={ExamOperation.EDIT_EXAM}
      options={{ context: { examId: 123 } }}
      fallback={<AccessDeniedMessage />}
      loadingComponent={<PermissionLoader />}
    >
      <EditExamForm />
    </ExamOperationGuard>
  );
}
```

To protect based on user role:

```tsx
import { ExamRoleGuard } from '@/features/exams-preparation/rbac';

function AdminComponent() {
  return (
    <ExamRoleGuard roles="admin">
      <AdminDashboard />
    </ExamRoleGuard>
  );
}
```

### Permission Hooks

To check permissions in a component:

```tsx
import { useExamPermission, ExamOperation } from '@/features/exams-preparation/rbac';

function YourComponent() {
  const { hasPermission, isLoading } = useExamPermission(ExamOperation.EDIT_EXAM);
  
  if (isLoading) {
    return <Loading />;
  }
  
  return (
    <div>
      {hasPermission && <EditButton />}
    </div>
  );
}
```

### Feature Access Hook

For checking multiple permissions at once:

```tsx
import { useExamFeatureAccess } from '@/features/exams-preparation/rbac';

function YourComponent() {
  const { 
    canCreateExam, 
    canEditExam, 
    isAdmin,
    isLoading 
  } = useExamFeatureAccess();
  
  if (isLoading) {
    return <Loading />;
  }
  
  return (
    <div>
      {canCreateExam && <CreateButton />}
      {canEditExam && <EditButton />}
      {isAdmin && <AdminSection />}
    </div>
  );
}
```

### Guarded Callback Hook

For wrapping callbacks (like button clicks) with permission checks:

```tsx
import { useGuardedCallback, ExamOperation } from '@/features/exams-preparation/rbac';
import { Button } from '@/core/ui/atoms';

function DeleteButton({ examId }: { examId: number }) {
  // This callback will only execute if the user has the DELETE_EXAM permission
  const handleDelete = useGuardedCallback(
    ExamOperation.DELETE_EXAM,
    () => deleteExam(examId),
    {
      context: { examId },
      showNotification: true, // Show message if permission denied
    }
  );

  return <Button onClick={handleDelete}>Delete</Button>;
}
```

### Server-Side Permission Checks

Protecting server components:

```tsx
import { requireExamPermission, ExamOperation } from '@/features/exams-preparation/rbac';

export default async function AdminPage() {
  // This will redirect to login or access-denied if permission check fails
  await requireExamPermission(ExamOperation.CREATE_EXAM);
  
  // If execution continues, user has permission
  return <AdminComponent />;
}
```

Protecting API routes:

```tsx
import { withExamPermission, ExamOperation } from '@/features/exams-preparation/rbac';

const handler = async (req: NextRequest) => {
  // Handle the request
  return NextResponse.json({ success: true });
};

export const POST = withExamPermission(handler, ExamOperation.CREATE_EXAM);
```

In a server action:

```tsx
import { checkExamPermissionForServerAction, ExamOperation } from '@/features/exams-preparation/rbac/server';

export async function createExam(formData: FormData) {
  'use server'
  
  const hasPermission = await checkExamPermissionForServerAction(
    ExamOperation.CREATE_EXAM
  );
  
  if (!hasPermission) {
    return { error: 'Permission denied' };
  }
  
  // Create exam logic
}
```

## Operation Types

Operations are defined as enum values in `types/index.ts` and mapped to actual permission strings. This provides type safety while maintaining compatibility with the permission string system.

Example operations include:

- `VIEW_EXAMS`: Permission to view the list of exams
- `CREATE_EXAM`: Permission to create new exams
- `MANAGE_QUESTIONS`: Permission to manage questions within an exam
- `TAKE_EXAM`: Permission to take an exam as a student
- `VIEW_RESULTS`: Permission to view exam results

## Integration with Core RBAC

This implementation follows the Core as Foundation principle by:

1. Using core RBAC hooks and components instead of reimplementing them
2. Registering feature permissions with the core RBAC registry
3. Extending core functionality with feature-specific abstractions
4. Providing a consistent API pattern aligned with core RBAC

## Best Practices

1. **Use Operation Enums**: Always use the `ExamOperation` enum instead of hardcoded permission strings.

2. **Provide Context**: When checking permissions for specific resources (like an exam), provide the resource ID in the context.

3. **Handle Loading States**: Always handle loading states in your UI to prevent flickering.

4. **Use Guards for Routes**: Protect routes with guards to prevent unauthorized access.

5. **Use Hooks for UI Elements**: Use hooks for conditional rendering of UI elements.

6. **Use Guarded Callbacks**: Use the `useGuardedCallback` hook for action buttons.

7. **Server and Client Protection**: Implement both server-side and client-side permission checks for full security.

## Migration Notes

Legacy permission functions are maintained for backward compatibility but new code should use the new hooks and guards.
