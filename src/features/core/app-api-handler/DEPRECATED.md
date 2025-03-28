# DEPRECATED

This module has been migrated to `/src/core/api` as part of the core architecture refactoring.

Please update all imports to use the new location:

```typescript
// Before
import { apiClient, QueryProvider } from '@/features/core/app-api-handler';

// After
import { apiClient, QueryProvider } from '@/core/api';
```

This directory will be removed in a future update. Do not add new code to this directory.
