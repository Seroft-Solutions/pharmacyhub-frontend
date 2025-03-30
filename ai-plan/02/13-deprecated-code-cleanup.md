# Task 13: Clean Up Deprecated Code

## Description
Identify, document, and safely remove deprecated code from the Exams feature, ensuring all functionality is properly migrated and no regressions are introduced. This task focuses on cleaning up legacy implementations and reducing technical debt.

## Current State Analysis
The Exams feature contains deprecated code in several locations, including the `/model/deprecated` directory and possibly in the API, RBAC, and other areas. This deprecated code should be safely removed after ensuring all functionality has been properly migrated.

## Implementation Steps

1. **Catalog all deprecated code**
   - Create a complete inventory of deprecated files and functions
   - Document their current purpose and replacement implementations
   - Check usage across the feature
   - Identify dependencies and consumers

2. **Verify replacement implementations**
   - Confirm that all deprecated functionality has replacement implementations
   - Validate that replacements provide equivalent or better functionality
   - Test replacement implementations
   - Document any gaps or inconsistencies

3. **Create migration plan**
   - Prioritize deprecated code for removal
   - Identify dependencies to update
   - Plan for backwards compatibility if needed
   - Create a phased approach for large changes

4. **Update consumers of deprecated code**
   - Identify all usage of deprecated code
   - Refactor to use replacement implementations
   - Test changes thoroughly
   - Document migration patterns

5. **Remove deprecated code**
   - Safely remove deprecated files and functions
   - Update imports and references
   - Verify that removal doesn't break functionality
   - Remove deprecated re-exports

6. **Update documentation**
   - Update documentation to reflect removed code
   - Document migration patterns for future reference
   - Update README and other guides
   - Document any breaking changes

7. **Final verification**
   - Perform comprehensive testing
   - Verify all functionality is preserved
   - Check for any remaining references to removed code
   - Validate build process and runtime behavior

## Deprecated Code Inventory Template

```markdown
# Deprecated Code Inventory

## Deprecated Files

| File Path | Purpose | Replacement | Usage Locations | Priority |
|-----------|---------|-------------|-----------------|----------|
| `/model/deprecated/exam.ts` | Old exam type definitions | `/types/exam.ts` | Several components in `/components/admin` | High |
| `/hooks/deprecated/useExamPermissions.ts` | Old permission-based RBAC | `/rbac/useExamFeatureAccess` | ExamSidebarMenu, ExamSettings | Medium |
| `/api/deprecated/examApi.ts` | Direct API calls | TanStack Query hooks in `/api/hooks` | Legacy components | High |

## Deprecated Exports

| Export Name | Source File | Purpose | Replacement | Usage Locations | Priority |
|-------------|-------------|---------|-------------|-----------------|----------|
| `ExamPermission` | `/constants/deprecated/permissions/index.ts` | Permission constants | `ExamOperation` in `/rbac/types` | Legacy components | Medium |
| `getExamsByStatus` | `/api/deprecated/examApi.ts` | Filter exams by status | `useExamsQuery` with filter param | ExamList component | Low |

## Deprecated Constants

| Constant Name | Source File | Purpose | Replacement | Usage Locations | Priority |
|---------------|-------------|---------|-------------|-----------------|----------|
| `EXAM_STATUSES` | `/constants/deprecated/statuses.ts` | Status constants | `ExamStatus` enum in `/types/exam.ts` | Various components | Medium |
```

## Migration Example: Permission-Based to Feature-Based RBAC

### Deprecated Code

```typescript
// /hooks/deprecated/useExamPermissions.ts
import { usePermissions } from '@/features/rbac/hooks';
import { ExamPermission } from '../constants/deprecated/permissions';

export const useExamPermissions = () => {
  const { hasPermission } = usePermissions();
  
  const canViewExams = hasPermission(ExamPermission.VIEW_EXAMS);
  const canTakeExams = hasPermission(ExamPermission.TAKE_EXAM);
  const canManageExams = hasPermission(ExamPermission.MANAGE_EXAMS);
  
  return {
    canViewExams,
    canTakeExams,
    canManageExams,
    hasPermission,
  };
};
```

### Replacement Implementation

```typescript
// /rbac/hooks/useExamFeatureAccess.ts
import { useFeatureAccess } from '@/core/rbac';
import { ExamOperation } from '../types';

export const useExamFeatureAccess = () => {
  const { hasFeature, hasOperation } = useFeatureAccess();
  
  const canViewExams = hasOperation('exams', ExamOperation.VIEW);
  const canTakeExams = hasOperation('exams', ExamOperation.TAKE);
  const canManageExams = hasOperation('exams', ExamOperation.EDIT);
  
  const checkExamOperation = (operation: ExamOperation) => {
    return hasOperation('exams', operation);
  };
  
  return {
    canViewExams,
    canTakeExams,
    canManageExams,
    checkExamOperation,
  };
};
```

### Migration Steps

1. **Identify components using deprecated hook**
   ```
   # Use grep or similar to find usages
   grep -r "useExamPermissions" ./src/features/exams
   ```

2. **Update each component**
   ```typescript
   // Before
   import { useExamPermissions } from '@/features/exams/hooks';
   
   const Component = () => {
     const { canViewExams, hasPermission } = useExamPermissions();
     
     if (hasPermission(ExamPermission.CREATE_EXAM)) {
       // ...
     }
   };
   
   // After
   import { useExamFeatureAccess } from '@/features/exams/rbac';
   import { ExamOperation } from '@/features/exams/rbac/types';
   
   const Component = () => {
     const { canViewExams, checkExamOperation } = useExamFeatureAccess();
     
     if (checkExamOperation(ExamOperation.CREATE)) {
       // ...
     }
   };
   ```

3. **Verify functionality**
   - Test each component after migration
   - Ensure all permission checks work correctly
   - Validate with different user roles

4. **Remove deprecated exports**
   - Once all usages are migrated, remove re-exports from index.ts
   - Mark files as deprecated with comments
   - Plan for removal in final cleanup

## Verification Checklist

- [ ] All deprecated code identified and documented
- [ ] Replacement implementations verified for all functionality
- [ ] All consumers of deprecated code updated
- [ ] No remaining imports or references to deprecated code
- [ ] Documentation updated to reflect changes
- [ ] Comprehensive testing completed
- [ ] Build process succeeds without errors
- [ ] Runtime behavior verified

## Time Estimate
Approximately 8-10 hours

## Dependencies
- All previous tasks should be completed before this task
- Replacement implementations must be in place and working

## Risks
- Removing deprecated code may break functionality if not all usages are identified
- Some components may have subtle dependencies on deprecated behavior
- Testing all scenarios may be challenging
- May require coordination with other feature teams
