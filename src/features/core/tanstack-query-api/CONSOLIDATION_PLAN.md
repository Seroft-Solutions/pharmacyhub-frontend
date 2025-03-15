# TanStack Query Implementation Consolidation Plan

## Current State

We have two working TanStack Query implementations:

### 1. Shared API Implementation (/shared/api/)
- Uses TanStack Query hooks (useQuery, useMutation)
- Has working token management
- Used by role-specific services (pharmacist, etc.)
- Provides useApi hook with custom abstractions

### 2. Feature-Specific Implementation (/features/tanstack-query-api/)
- More detailed implementation with separate concerns
- Includes query key management
- Used by exam feature
- Provides service creation patterns

## Consolidation Strategy

1. **Keep Both Temporarily**
   - Both implementations are working and using TanStack Query correctly
   - They serve different parts of the application
   - Immediate removal could break functionality

2. **Gradual Migration Plan**
   - Phase 1: Document all API usage patterns
   - Phase 2: Create unified patterns
   - Phase 3: Migrate services one by one
   - Phase 4: Remove duplicate code

3. **Steps to Unify**
   a. Move shared/api/apiClient.ts functionality into tanstack-query-api/core/apiClient.ts
   b. Merge token management strategies
   c. Consolidate hook patterns
   d. Update imports across the application

## Next Steps

1. Create unified TypeScript types
2. Merge request handling logic
3. Create migration guide for services
4. Update documentation

## Notes

- Keep tokenManager.ts as it's a core auth utility
- Keep adapter.ts files as they handle data transformation
- Keep role-specific service files but gradually update them to use the unified implementation

## Timeline

This should be a gradual process to ensure stability. Each service should be migrated individually with proper testing.
