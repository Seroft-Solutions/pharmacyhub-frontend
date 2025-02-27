# Auth Feature Refactoring

## Overview
This document outlines the refactoring of the authentication feature in the PharmacyHub frontend to follow the feature-based architecture pattern.

## Changes Made

1. **Created Auth API Services**
   - Created `userService.ts` with methods for user profile operations
   - Created `securityService.ts` with methods for access control operations
   - Updated the API barrel export in `features/auth/api/index.ts`

2. **Moved Auth Hooks**
   - Moved `useAuth.ts` from `src/hooks` to `src/features/auth/hooks`
   - Updated imports to reference the new API services
   - Created barrel exports for hooks in `features/auth/hooks/index.ts`

3. **Moved Auth UI Components**
   - Moved components from `src/components/auth` to `src/features/auth/ui/components`
   - Moved guards from `src/components/guards` to `src/features/auth/ui/guards`
   - Moved security components from `src/components/security` to `src/features/auth/ui/security`
   - Created appropriate barrel exports at each level

4. **Backward Compatibility**
   - Created re-export files at the old locations to maintain compatibility with existing imports
   - Added deprecation notices to encourage migration to the new import paths

5. **Feature Exports**
   - Created a barrel export file at `src/features/auth/index.ts` to provide a clean public API for the auth feature
   - Structured exports by category (api, hooks, ui)

## Architecture Benefits

This refactoring aligns with the feature-based architecture pattern seen in other parts of the application:

1. **Cohesion**: All auth-related code is now in a single feature directory
2. **Isolation**: Auth feature has clear boundaries and a well-defined public API
3. **Discoverability**: Easier to find and understand auth-related code
4. **Consistency**: Follows the same pattern as other features in the application

## Feature Structure

```
src/features/auth/
├── api/                 # API services
│   ├── authService.ts   # Auth API service
│   ├── userService.ts   # User profile service
│   ├── securityService.ts # Security/access control service
│   └── index.ts         # API barrel exports
├── hooks/               # React hooks
│   ├── useAuth.ts       # Main auth hook
│   └── index.ts         # Hooks barrel exports
├── ui/                  # UI components
│   ├── components/      # Basic UI components
│   │   ├── AuthLoading.tsx
│   │   ├── Unauthorized.tsx
│   │   └── index.ts
│   ├── guards/          # Auth guard components
│   │   ├── AuthGuard.tsx
│   │   ├── RoleGuards.tsx
│   │   ├── RequireAuth.tsx
│   │   ├── types.ts
│   │   └── index.ts
│   ├── security/        # RBAC components
│   │   ├── PermissionCheck.tsx
│   │   └── index.ts
│   └── index.ts         # UI barrel exports
└── index.ts             # Feature barrel exports
```

## Next Steps

1. Gradually update imports in other files to use the new paths (`@/features/auth/...`)
2. Consider removing the backward compatibility layer in a future release
3. Review other hooks for potential migration to the feature-based pattern
4. Update documentation and examples to use the new import paths
