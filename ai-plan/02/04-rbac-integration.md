# Task 04: Review RBAC Integration

## Description
Review and finalize the Role-Based Access Control (RBAC) integration for the Exams feature, ensuring it properly uses the centralized RBAC system from the core module and follows best practices.

## Current State Analysis
The Exams feature has already undergone some RBAC migration with the implementation of feature-based access control, as documented in the RBAC_MIGRATION.md and RBAC_CHANGES_SUMMARY.md files. However, there may still be legacy code using the old permission-based system, and the integration with the core RBAC module may need review.

## Implementation Steps

1. **Review current RBAC implementation**
   - Examine the current RBAC integration in the `/rbac` directory
   - Verify alignment with core RBAC principles
   - Identify any remaining legacy code using the old permission system

2. **Complete RBAC migration**
   - Finish migrating any components still using `useExamPermissions` to `useExamFeatureAccess`
   - Replace any remaining `ExamPermission` enums with `ExamOperation` enums
   - Update guard components to use the new system

3. **Verify role-based guards**
   - Ensure all guards correctly use the core RBAC system
   - Check for consistent patterns in guard implementation
   - Test guards with different roles to verify correct behavior

4. **Implement consolidated RBAC exports**
   - Create a clear public API for RBAC functionality
   - Ensure proper exports in the feature's index.ts
   - Document all available operations and guards

5. **Update component usage**
   - Identify components still using the old permission system
   - Update them to use the new feature-based system
   - Test components with different permissions

6. **Clean up deprecated RBAC code**
   - Plan for safe removal of deprecated RBAC code
   - Ensure replacements are in place and working properly
   - Update documentation to reflect the changes

7. **Document RBAC integration**
   - Update RBAC documentation with the latest implementation details
   - Create examples for common use cases
   - Document RBAC operation mappings for reference

## RBAC Implementation Pattern

```typescript
// /rbac/types.ts
export enum ExamOperation {
  VIEW = 'VIEW',
  TAKE = 'TAKE',
  CREATE = 'CREATE',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  DUPLICATE = 'DUPLICATE',
  MANAGE_QUESTIONS = 'MANAGE_QUESTIONS',
  PUBLISH = 'PUBLISH',
  UNPUBLISH = 'UNPUBLISH',
  ASSIGN = 'ASSIGN',
  GRADE = 'GRADE',
  VIEW_RESULTS = 'VIEW_RESULTS',
  EXPORT_RESULTS = 'EXPORT_RESULTS',
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
}

// /rbac/hooks/useExamFeatureAccess.ts
export const useExamFeatureAccess = () => {
  const { hasFeature, hasOperation, hasRole } = useFeatureAccess();
  
  // Common operations as boolean flags
  const canViewExams = hasOperation('exams', ExamOperation.VIEW);
  const canTakeExams = hasOperation('exams', ExamOperation.TAKE);
  const canManageExams = hasOperation('exams', ExamOperation.EDIT);
  const canCreateExams = hasOperation('exams', ExamOperation.CREATE);
  
  // Generic operation checker
  const checkExamOperation = (operation: ExamOperation) => {
    return hasOperation('exams', operation);
  };
  
  return {
    canViewExams,
    canTakeExams,
    canManageExams,
    canCreateExams,
    checkExamOperation,
  };
};

// /rbac/guards/index.ts
export const ExamGuard: FC<PropsWithChildren> = ({ children }) => {
  const { hasFeature } = useFeatureAccess();
  
  if (!hasFeature('exams')) {
    return null; // Or fallback content
  }
  
  return <>{children}</>;
};

export const ExamOperationGuard: FC<PropsWithChildren<{ operation: ExamOperation }>> = ({ 
  children, 
  operation 
}) => {
  const { checkExamOperation } = useExamFeatureAccess();
  
  if (!checkExamOperation(operation)) {
    return null; // Or fallback content
  }
  
  return <>{children}</>;
};

// Convenience guards
export const ViewExamsGuard: FC<PropsWithChildren> = ({ children }) => {
  return <ExamOperationGuard operation={ExamOperation.VIEW}>{children}</ExamOperationGuard>;
};
```

## Component Usage Examples

```tsx
// Example of updated component using new RBAC
import { useExamFeatureAccess, ExamOperation } from '@/features/exams/rbac';

const ExamActionButtons = () => {
  const { canCreateExams, checkExamOperation } = useExamFeatureAccess();
  
  return (
    <div>
      {canCreateExams && <Button>Create Exam</Button>}
      {checkExamOperation(ExamOperation.DUPLICATE) && <Button>Duplicate</Button>}
      {checkExamOperation(ExamOperation.DELETE) && <Button>Delete</Button>}
    </div>
  );
};
```

## Verification Criteria
- No components use the old permission-based system
- All RBAC functionality properly uses the core RBAC module
- Guards correctly control access to functionality
- Consistent implementation across all components
- Clear documentation for RBAC integration
- Plan for removal of deprecated code

## Time Estimate
Approximately 6-8 hours

## Dependencies
- Task 01: Document Current Directory Structure and Identify Gaps
- Core RBAC module must be properly implemented

## Risks
- Changes to the core RBAC system could impact the feature
- Some components may have complex permission logic
- Testing all permission combinations can be challenging
