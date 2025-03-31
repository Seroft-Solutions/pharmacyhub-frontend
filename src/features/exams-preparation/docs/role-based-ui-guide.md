# Role-Based UI Customization Guide

This guide explains how to create UIs that adapt to the user's roles and permissions in the Exams-Preparation feature.

## Overview

Role-based UI customization allows you to create a single UI that adapts to different user roles and permissions. This approach has several benefits:

- **Consistent UX**: All users see the same basic UI structure, but with appropriate controls for their role
- **Simplified Codebase**: No need to create separate components for each role
- **Easier Maintenance**: Changes to UI structure only need to be made in one place
- **Fine-grained Control**: Show or hide specific UI elements based on permissions

## Using the useExamRoleUI Hook

The `useExamRoleUI` hook provides boolean flags for common UI decisions based on the user's roles and permissions.

### Basic Usage

```tsx
import { useExamRoleUI } from '@/features/exams-preparation/rbac';

function ExamDashboard() {
  const {
    showAdminNav,
    showCreateExam,
    showManageExams,
    isAdmin,
    isInstructor,
    isLoading
  } = useExamRoleUI();
  
  // Handle loading state
  if (isLoading) {
    return <Loading />;
  }
  
  return (
    <div>
      <h1>Exams Dashboard</h1>
      
      {/* Standard content visible to all users */}
      <ExamList />
      
      {/* Admin navigation only shown to users with appropriate permissions */}
      {showAdminNav && (
        <AdminNavigation />
      )}
      
      {/* Create exam button only shown to users who can create exams */}
      {showCreateExam && (
        <CreateExamButton />
      )}
      
      {/* Management panel only shown to users who can manage exams */}
      {showManageExams && (
        <ManagementPanel />
      )}
      
      {/* Role-specific content */}
      {isAdmin && <AdminPanel />}
      {isInstructor && <InstructorPanel />}
    </div>
  );
}
```

### Available Flags

The `useExamRoleUI` hook provides the following boolean flags:

#### Navigation Flags
- `showAdminNav`: Whether to show admin navigation
- `showAllResults`: Whether to show "all results" section
- `showPaymentSection`: Whether to show payment settings

#### Role-Based Feature Flags
- `showInstructorFeatures`: Whether to show instructor-specific features
- `showStudentFeatures`: Whether to show student-specific features

#### Exam Management Flags
- `showCreateExam`: Whether to show exam creation features
- `showManageExams`: Whether to show exam management features
- `showManageQuestions`: Whether to show question management features
- `showAnalytics`: Whether to show analytics features

#### Role Flags
- `isAdmin`: Whether the user is an administrator
- `isInstructor`: Whether the user is an instructor
- `isStudent`: Whether the user is a student

#### State Flag
- `isLoading`: Whether role/permission data is still loading

## Using the ExamNavigation Component

The `ExamNavigation` component provides a navigation menu that adapts to the user's roles and permissions.

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

The `ExamNavigation` component uses the `useExamRoleUI` hook internally to determine which navigation items to show.

## Best Practices

### Loading States

Always handle loading states to prevent UI flicker. The `isLoading` flag indicates when permission data is still being loaded.

```tsx
const { isLoading, showAdminFeatures } = useExamRoleUI();

if (isLoading) {
  return <Skeleton />;
}

return (
  <div>
    {showAdminFeatures && <AdminPanel />}
  </div>
);
```

### Role vs. Permission Checks

- Use role checks (`isAdmin`, `isInstructor`) when a feature is specific to a role
- Use permission-based flags (`showCreateExam`, `showManageExams`) when a feature depends on specific permissions
- Prefer permission-based flags over role checks for most features to support fine-grained permissions

### Fallback Content

Consider providing alternative content for users who don't have access to certain features:

```tsx
{showAnalytics ? (
  <AnalyticsDashboard />
) : (
  <p>Analytics are only available to administrators.</p>
)}
```

### Testing Different Roles

During development, you'll need to test the UI for different roles. You have several options:

1. Create test users with different roles in the backend
2. Add a role selector in your development environment
3. Create a mock API service that returns different roles based on a configuration

## Component Examples

### Role-Based Dashboard

See the complete example in `examples/RoleBasedUIExample.tsx` for a dashboard that adapts to different user roles.

Key components in the example:

- Tab visibility based on permissions
- Cards that appear only for specific roles
- Action buttons that only appear for users with appropriate permissions
- Role-specific UI elements within shared components

### Exam Navigation

The `ExamNavigation` component (`components/organisms/ExamNavigation.tsx`) demonstrates how to create a navigation menu that adapts to user roles and permissions.

## Integration with Core RBAC

The role-based UI system integrates with the core RBAC module for permission and role checking. It:

1. Uses `useRoles` from core RBAC to check user roles
2. Uses `useExamPermission` to check operation permissions
3. Combines role and permission data into a consistent API
