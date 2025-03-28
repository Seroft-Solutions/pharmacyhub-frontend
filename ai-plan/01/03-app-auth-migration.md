# Task 03: Migrate app-auth to core/auth

## Description
Migrate the existing app-auth module from the features/core directory to the new core/auth directory, restructuring according to the architecture principles.

## Current Structure Analysis
The current app-auth contains:
- admin
- anti-sharing
- api
- components
- config
- constants
- core
- deprecated
- hooks
- lib
- model
- types

This is a complex module with many subdirectories that need careful migration and possible refactoring.

## Implementation Steps

1. **Assessment Phase**
   - Review all components in the app-auth
   - Identify components that exceed the 200-line limit
   - Identify instances of mixed responsibilities
   - Map dependencies between components
   - Identify deprecated code that can be removed

2. **Migration Phase**
   - Move auth components to `/core/auth/components`
   - Move auth hooks to `/core/auth/hooks`
   - Move auth types to `/core/auth/types`
   - Move auth state management to `/core/auth/state`
   - Convert existing state to Zustand if not already
   - Move auth API calls to `/core/auth/api`
   - Move auth utilities from lib to `/core/auth/utils`
   - Move relevant constants to `/core/auth/constants`
   - Evaluate admin functionality for proper placement
   - Decide on anti-sharing functionality placement

3. **Refactoring Phase**
   - Split components that exceed 200 lines
   - Apply atomic design principles to components
   - Ensure each function follows the 20-30 line limit
   - Remove any deprecated code
   - Update imports throughout the codebase

4. **Public API Phase**
   - Define a clear public API in core/auth/index.ts
   - Only expose what's necessary for features to consume
   - Create README.md documenting the API and usage

## Verification Criteria
- All components from app-auth properly migrated
- No component exceeds 200 lines
- All functions stay within 20-30 line limit
- Clear separation of concerns
- Deprecated code removed
- Zustand implemented for auth state
- Clear and documented public API

## Time Estimate
Approximately 2-3 days

## Dependencies
- Task 01: Create new core directory structure

## Risks
- May break existing authentication functionality if not carefully migrated
- May require coordination with backend for any API changes
- May impact multiple features that rely on authentication
