# Auth Imports Update Plan

## Current Import Patterns

Auth code is currently being imported from multiple locations:
- `@/shared/auth/AuthContext` - Auth context provider and hooks 
- `@/lib/auth` - Token utility functions
- `@/shared/auth/authService` - Auth service implementation
- `@/hooks/useSession` - Session hook

## New Import Pattern

All auth imports should be consolidated to:
- `@/features/auth` - Main feature exports
- `@/features/auth/context` - Auth context
- `@/features/auth/api` - Auth services
- `@/features/auth/hooks` - Auth hooks
- `@/features/auth/lib` - Auth utilities
- `@/features/auth/model` - Auth types and models
- `@/features/auth/ui` - Auth UI components

## Path Updates

1. **AuthContext imports**
   - Old: `import { useAuth, AuthProvider } from '@/shared/auth'`
   - New: `import { useAuth, AuthProvider } from '@/features/auth'`

2. **authService imports**
   - Old: `import { authService } from '@/shared/auth'`
   - New: `import { authService } from '@/features/auth'`

3. **Auth utilities imports**
   - Old: `import { parseToken, isTokenExpired } from '@/lib/auth'`
   - New: `import { authUtils } from '@/features/auth'`
   - Usage: `authUtils.parseToken()`, `authUtils.isTokenExpired()`

4. **useSession imports**
   - Old: `import { useSession } from '@/hooks/useSession'`
   - New: `import { useSession } from '@/features/auth/hooks'`

5. **Token management**
   - Old: Directly accessing localStorage
   - New: `import { tokenManager } from '@/features/auth'`

6. **Auth types**
   - Old: `import { UserProfile, Role } from '@/types/auth'`
   - New: `import { UserProfile, Role } from '@/features/auth/model/types'`

## Implementation Strategy

1. Update `features/auth/index.ts` to re-export all necessary components
2. Find all auth-related imports in the codebase
3. Update import paths to use the consolidated auth feature
4. Test each auth flow to ensure the changes work
5. Remove deprecated files once the transition is complete

## Priority Files

These files will need to be updated first:
- `app/providers/AuthProvider.tsx`
- `app/(auth)/layout.tsx`
- `app/(auth)/login/page.tsx`
- `middleware.ts`
- Components that use auth-related functionality

## Rollout Phases

1. **Phase 1:** Create all new files in the auth feature
2. **Phase 2:** Update import paths in high-priority files
3. **Phase 3:** Update remaining import paths
4. **Phase 4:** Test all auth flows
5. **Phase 5:** Remove deprecated files after successful testing
