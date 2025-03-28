# DEPRECATED

This module has been migrated to `/src/core/mobile` as part of the core architecture refactoring.

Please update all imports to use the new location:

```typescript
// Before
import { isMobile, useDeviceDetection } from '@/features/core/app-mobile-handler';

// After
import { isMobile, useDeviceDetection } from '@/core/mobile';
```

This directory will be removed in a future update. Do not add new code to this directory.
