# Task 04: Migrate app-rbac to core/rbac

## Description
Migrate the existing app-rbac module from the features/core directory to the new core/rbac directory, restructuring according to the architecture principles.

## Current Structure Analysis
The current app-rbac contains:
- api
- components
- constants
- contexts
- hooks
- permissions.ts
- registry
- services
- types
- usage-example.tsx

This module handles role-based access control and needs careful migration to ensure security is maintained.

## Implementation Steps

1. **Assessment Phase**
   - Review all components in the app-rbac
   - Identify components that exceed the 200-line limit
   - Identify instances of mixed responsibilities
   - Map dependencies between components
   - Review the MIGRATION.md file for any existing migration notes

2. **Migration Phase**
   - Move RBAC components to `/core/rbac/components`
   - Move RBAC hooks to `/core/rbac/hooks`
   - Move RBAC types to `/core/rbac/types`
   - Move RBAC services to `/core/rbac/services`
   - Move RBAC constants to `/core/rbac/constants`
   - Move permissions.ts to `/core/rbac/permissions.ts`
   - Move registry functionality to `/core/rbac/registry`
   - Migrate contexts to proper state management (Zustand or Context)
   - Move API-related functions to `/core/rbac/api`

3. **Refactoring Phase**
   - Split components that exceed 200 lines
   - Ensure each function follows the 20-30 line limit
   - Refactor to use Zustand for complex state
   - Refactor to use Context for simple state
   - Update imports throughout the codebase
   - Update the usage example to reflect new structure

4. **Public API Phase**
   - Define a clear public API in core/rbac/index.ts
   - Only expose what's necessary for features to consume
   - Create README.md documenting the API and usage
   - Update or create usage examples

## Verification Criteria
- All components from app-rbac properly migrated
- No component exceeds 200 lines
- All functions stay within 20-30 line limit
- Clear separation of concerns
- Proper state management implementation
- Clear and documented public API
- Working usage examples

## Time Estimate
Approximately 1-2 days

## Dependencies
- Task 01: Create new core directory structure

## Risks
- May break existing RBAC functionality if not carefully migrated
- Security implications if permissions are not properly maintained
- May impact multiple features that rely on RBAC
