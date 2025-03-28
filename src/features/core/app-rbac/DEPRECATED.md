# DEPRECATED

This module has been migrated to `/src/core/rbac` as part of the core architecture refactoring.

Please update all imports to use the new location:

```typescript
// Before
import { HasPermission, usePermissions } from '@/features/core/app-rbac';

// After
import { HasPermission, usePermissions } from '@/core/rbac';
```

This directory will be removed in a future update. Do not add new code to this directory.
