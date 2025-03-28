# Task 02: Migrate app-api-handler to core/api

## Description
Migrate the existing app-api-handler module from the features/core directory to the new core/api directory, restructuring according to the architecture principles.

## Current Structure Analysis
The current app-api-handler contains:
- components
- core
- factories
- hooks
- services
- utils
- schema-helpers.ts

Many of these components may be tightly coupled and need to be refactored according to the single responsibility principle.

## Implementation Steps

1. **Assessment Phase**
   - Review all components in the app-api-handler
   - Identify components that exceed the 200-line limit
   - Identify instances of mixed responsibilities
   - Map dependencies between components

2. **Migration Phase**
   - Move base API client setup to `/core/api/services`
   - Move API-related hooks to `/core/api/hooks`
   - Move API-related types to `/core/api/types`
   - Move schema-helpers.ts to `/core/api/utils`
   - Migrate factories to appropriate locations based on functionality

3. **Refactoring Phase**
   - Split components that exceed 200 lines
   - Separate data fetching from presentation
   - Convert to use TanStack Query for API state management
   - Ensure each function follows the 20-30 line limit
   - Update imports throughout the codebase

4. **Public API Phase**
   - Define a clear public API in core/api/index.ts
   - Only expose what's necessary for features to consume
   - Create README.md documenting the API

## Verification Criteria
- All components from app-api-handler properly migrated
- No component exceeds 200 lines
- All functions stay within 20-30 line limit
- Clear separation of concerns
- All imports updated throughout the codebase
- TanStack Query implemented for API state
- Clear and documented public API

## Time Estimate
Approximately 1-2 days

## Dependencies
- Task 01: Create new core directory structure

## Risks
- May break existing functionality if imports are not properly updated
- May require refactoring of components that consume the API handler
- TanStack Query implementation may require changes to how data is consumed
