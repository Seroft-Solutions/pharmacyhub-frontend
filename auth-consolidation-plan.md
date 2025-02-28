# Authentication Consolidation Plan

## Current Structure
- `/shared/auth` - Main auth implementation (AuthContext, authService)
- `/features/auth` - Partial auth implementation with UI components, hooks, etc.
- `/app/(auth)` - Next.js route pages for auth flows
- `/lib/auth.ts` - Token management code
- `/hooks/useSession.ts` - Session hook

## Consolidation Steps

1. **Move Auth Service Implementation**
   - Move `/shared/auth/AuthContext.tsx` → `/features/auth/context/AuthContext.tsx`
   - Move `/shared/auth/authService.ts` → `/features/auth/api/authService.ts` (merge with existing)
   - Create unified types in `/features/auth/model/types.ts`
   - Move token management from `/lib/auth.ts` → `/features/auth/lib/tokenManager.ts`

2. **Move Auth Hooks**
   - Move `/hooks/useSession.ts` → `/features/auth/hooks/useSession.ts`
   - Ensure `/features/auth/hooks/useAuth.ts` uses the consolidated context

3. **Consolidate Auth Pages**
   - Create adapters in `/features/auth/adapters` to map between app routes and feature
   - Ensure all pages in `/app/(auth)` use components from `/features/auth/ui`

4. **Update Imports**
   - Update all import paths to use the consolidated auth feature
   - Create a comprehensive exports file at `/features/auth/index.ts`

5. **Test and Verify**
   - Verify all auth flows still work
   - Ensure TypeScript errors are resolved
   - Test login, registration, and protected routes

## Folder Structure After Consolidation

```
/features/auth/
  ├── adapters/            - Adapters for Next.js routes
  ├── api/                 - API integrations
  ├── context/             - Auth context providers
  ├── hooks/               - Auth hooks (useAuth, useSession)
  ├── lib/                 - Utilities (tokenManager)
  ├── model/               - Types and interfaces
  ├── ui/                  - UI components
  │   ├── auth-flow/       - Auth flow components
  │   ├── layout/          - Auth layouts
  │   ├── login/           - Login components
  │   ├── register/        - Registration components
  │   └── ...
  └── index.ts             - Public exports
```

## Implementation Approach
1. First copy all files to their new locations
2. Then update imports
3. Test each auth flow individually
4. Once confirmed working, remove the old files
