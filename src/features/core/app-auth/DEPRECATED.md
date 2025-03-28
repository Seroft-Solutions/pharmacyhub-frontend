# DEPRECATED

This module has been migrated to `/src/core/auth` as part of the core architecture refactoring.

Please update all imports to use the new location:

```typescript
// Before
import { useAuth, AuthProvider } from '@/features/core/app-auth';

// After
import { useAuth, AuthProvider } from '@/core/auth';
```

This directory will be removed in a future update. Do not add new code to this directory.
