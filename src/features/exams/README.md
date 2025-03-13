# Exams Feature

This module provides exam management and taking functionality for the PharmacyHub application.

## Features

- Exam creation and management
- Questions and answer management
- Exam taking and submission
- Results viewing and analysis
- Support for different paper types (Practice, Model, Past, Subject)

## Architecture

The Exams feature follows the project's architecture guidelines, including:

- **Feature-based organization**: All exam-related code is in this feature directory
- **Separation of concerns**: UI, API, state management, etc. are separated
- **RBAC integration**: All components use the RBAC system for permission checks
- **TanStack Query API**: All API calls go through the TanStack Query API hooks

## Permissions

All permissions for this feature are defined in `src/features/exams/constants/permissions/index.ts` and registered with the RBAC system through `initializeExamsFeature()` in `constants/index.ts`. These permissions are also added to the global permissions in `src/features/rbac/constants/permissions.ts`.

The following permissions are available:

### Basic Exam Access
- `exams:view` - View available exams
- `exams:take` - Take exams

### Exam Creation & Management
- `exams:create` - Create new exams
- `exams:edit` - Edit existing exams
- `exams:delete` - Delete exams
- `exams:duplicate` - Duplicate exams

### Question Management
- `exams:manage-questions` - Manage questions within exams

### Exam Administration
- `exams:publish` - Publish exams to make them available
- `exams:unpublish` - Unpublish exams
- `exams:assign` - Assign exams to users

### Results & Grading
- `exams:grade` - Grade exam attempts
- `exams:view-results` - View exam results
- `exams:export-results` - Export exam results

### Analytics
- `exams:view-analytics` - View exam analytics

## Permission Usage

To check permissions in components, always use one of these patterns:

### 1. Using PermissionGuard Component

```tsx
import { PermissionGuard } from '@/features/rbac/ui';
import { ExamPermission } from '@/features/exams/constants/permissions';

<PermissionGuard permission={ExamPermission.CREATE_EXAM}>
  <CreateExamButton />
</PermissionGuard>
```

### 2. Using usePermissions Hook

```tsx
import { usePermissions } from '@/features/rbac/hooks';
import { ExamPermission } from '@/features/exams/constants/permissions';

function Component() {
  const { hasPermission } = usePermissions();
  const canCreateExam = hasPermission(ExamPermission.CREATE_EXAM);
  
  return canCreateExam ? <CreateExamButton /> : null;
}
```

## Feature Flags

Feature flags are defined in `src/features/exams/constants/flags/index.ts`. These control which features are enabled, and can be used to toggle experimental features.

Use the `useFeatureAccess` hook to check if a feature is enabled:

```tsx
import { useFeatureAccess } from '@/features/rbac/hooks';
import { ExamFeatureFlag } from '@/features/exams/constants/flags';

function Component() {
  const { canAccess } = useFeatureAccess('exams', {
    flagId: ExamFeatureFlag.ENABLE_ANALYTICS
  });
  
  return canAccess ? <AnalyticsPanel /> : null;
}
```

## API Integration

All API calls in this feature must be made through the TanStack Query API. Direct API calls are not allowed.

- API endpoints are defined in `src/features/exams/api/core/examService.ts`
- React Query hooks are in `src/features/exams/api/UseExamApi.ts`

Example usage:

```tsx
import { useExam } from '@/features/exams/api/UseExamApi';

function ExamDetails({ examId }) {
  const { data, isLoading, error } = useExam(examId);
  
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  
  return <div>{data.title}</div>;
}
```

## State Management

Exam state is managed using:

- React Query for server state
- React state for local UI state
- Zustand for complex state that needs to persist across components

## Inputs and Outputs

### Inputs
- Exam configurations (title, description, time limit, etc.)
- Questions and answers
- User responses to questions
- Metadata for different paper types

### Outputs
- Exam listings
- Exam attempt interface
- Results and analytics
- Administrative interfaces for exam management

## Testing

Components should have unit tests covering:
- Rendering with different permission scenarios
- Interaction with the API
- State changes

## Getting Started

To work on this feature, familiarize yourself with:

1. The permission model in `constants/permissions/index.ts`
2. The API hooks in `api/UseExamApi.ts`
3. The RBAC integration through `usePermissions` and `PermissionGuard`
