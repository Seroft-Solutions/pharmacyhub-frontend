# Auth Feature Refactoring Cleanup

This document outlines the cleanup steps needed to complete the auth feature refactoring. The refactoring has organized the auth feature into a more semantically meaningful structure:

## New Structure

```
src/features/auth/
├── api/                 # API services
├── hooks/               # React hooks
├── ui/
│   ├── auth-flow/       # Authentication flow components (login, register)
│   ├── feedback/        # Feedback components (loading, error states)
│   ├── protection/      # Auth guards and protection components
│   ├── rbac/            # Role-based access control components
│   └── index.ts         # UI barrel exports
└── index.ts             # Feature barrel exports
```

## Cleanup Commands

The following commands should be executed in the terminal to clean up redundant directories and files:

```bash
# Remove redundant directories
rm -rf "D:/code/PharmacyHub/pharmacyhub-frontend/src/features/auth/ui/components"
rm -rf "D:/code/PharmacyHub/pharmacyhub-frontend/src/features/auth/ui/guards"
rm -rf "D:/code/PharmacyHub/pharmacyhub-frontend/src/features/auth/ui/security"

# Ensure backward compatibility folders in components directory have updated imports
# (These should import from the new locations)
```

## Manual Steps

If the above commands don't work in your environment, manually delete the following directories:

1. `src/features/auth/ui/components`
2. `src/features/auth/ui/guards`
3. `src/features/auth/ui/security`

## Backward Compatibility

Backward compatibility is maintained through re-export files in the original locations. If you encounter any import errors, check that the compatibility files are properly importing from the new locations.

## Import Update Guide

Update imports in your application to use the new structure:

### Before:
```typescript
import { AuthGuard } from '@/components/auth/AuthGuard';
import { RequireAuth } from '@/components/guards/RequireAuth';
import { PermissionCheck } from '@/components/security/PermissionCheck';
```

### After:
```typescript
import { AuthGuard } from '@/features/auth/ui/protection';
import { RequireAuth } from '@/features/auth/ui/protection';
import { PermissionCheck } from '@/features/auth/ui/rbac';
```

Or, using the barrel exports:
```typescript
import { AuthGuard, RequireAuth } from '@/features/auth/ui';
import { PermissionCheck } from '@/features/auth/ui';
```