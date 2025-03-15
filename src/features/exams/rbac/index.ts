/**
 * Exam Feature RBAC
 * 
 * This module exports all RBAC-related functionality for the exam feature.
 * Use these hooks and components when implementing access control for exams.
 */

// Export the hooks and guards
export { useExamFeatureAccess, ExamOperation } from '../hooks/useExamFeatureAccess';
export { 
  ExamGuard, 
  ExamOperationGuard, 
  ViewExamsGuard, 
  TakeExamsGuard, 
  ManageExamsGuard, 
  ExamAdminGuard 
} from '@/features/exams/components/guards/ExamGuard';

// Export the permission to operation mapping utilities
export {
  permissionToOperation,
  permissionToOperationMap,
  stringToOperationMap
} from './operations-mapping';

/**
 * Exam Feature Access Control Quick Guide
 * 
 * This serves as a quick reference for implementing access control in the exam feature.
 * 
 * Basic Pattern:
 * 
 * 1. Import what you need from this module:
 *    ```
 *    import { useExamFeatureAccess, ExamGuard, ExamOperation } from '@/features/exams/rbac';
 *    ```
 * 
 * 2. Use the hooks for programmatic checks:
 *    ```
 *    const { canViewExams, canCreateExams } = useExamFeatureAccess();
 *    
 *    if (canCreateExams) {
 *      // Perform action that requires create permission
 *    }
 *    ```
 * 
 * 3. Use the guards for UI element protection:
 *    ```
 *    <ExamGuard>
 *      <YourProtectedComponent />
 *    </ExamGuard>
 *    
 *    <ExamOperationGuard operation={ExamOperation.CREATE}>
 *      <CreateExamButton />
 *    </ExamOperationGuard>
 *    ```
 * 
 * 4. Use the convenience guards for common operations:
 *    ```
 *    <ViewExamsGuard>
 *      <ExamsList />
 *    </ViewExamsGuard>
 *    
 *    <ManageExamsGuard>
 *      <AdminPanel />
 *    </ManageExamsGuard>
 *    ```
 * 
 * 5. For migrating from old permission-based system:
 *    ```
 *    import { permissionToOperation } from '@/features/exams/rbac';
 *    
 *    // Convert old permission string to new operation
 *    const operation = permissionToOperation('view_exams');
 *    
 *    <ExamOperationGuard operation={operation}>
 *      <YourComponent />
 *    </ExamOperationGuard>
 *    ```
 */
