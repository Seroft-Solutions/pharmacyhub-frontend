# Exams Preparation RBAC

This directory contains Role-Based Access Control (RBAC) configurations specific to the exams-preparation feature.

## Purpose

- Define feature-specific permissions and operations
- Integrate with the core RBAC module
- Provide hooks and utilities for access control

## Guidelines

1. Use the core RBAC module rather than reimplementing functionality
2. Define clear, descriptive permission and operation names
3. Document the purpose of each permission
4. Leverage core RBAC hooks for permission checks

## Example Structure

```
rbac/
  operations-mapping.ts   # Map operations to required permissions
  permissions.ts          # Define feature-specific permissions
  constants.ts            # RBAC-related constants
  index.ts                # Public exports
```

## Integration with Core RBAC

The exams-preparation RBAC should integrate with the core RBAC module:

```ts
// Example integration
import { definePermission, registerFeaturePermissions } from '@/core/rbac';

// Define permissions
export const EXAM_PERMISSIONS = {
  VIEW_EXAMS: definePermission('exams:view', 'Ability to view available exams'),
  TAKE_EXAM: definePermission('exams:take', 'Ability to take an exam'),
  CREATE_EXAM: definePermission('exams:create', 'Ability to create new exams'),
  EDIT_EXAM: definePermission('exams:edit', 'Ability to edit existing exams'),
  DELETE_EXAM: definePermission('exams:delete', 'Ability to delete exams'),
};

// Register with core RBAC
registerFeaturePermissions('exams', Object.values(EXAM_PERMISSIONS));
```

## Example Usage

```tsx
// In a component
import { usePermission } from '@/core/rbac';
import { EXAM_PERMISSIONS } from '../rbac';

function ExamManagerComponent() {
  const canCreateExam = usePermission(EXAM_PERMISSIONS.CREATE_EXAM);
  
  return (
    <div>
      {canCreateExam && (
        <Button onClick={handleCreateExam}>Create New Exam</Button>
      )}
    </div>
  );
}
```
