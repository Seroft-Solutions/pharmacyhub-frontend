# Deprecated Components

These components have been moved to the features-based architecture and should not be used in new code.

## Migration Guide

### Dashboard Components

All dashboard components have been migrated to the `features/dashboard` directory:

```typescript
// OLD - DO NOT USE
import { Breadcrumbs } from '@/components/dashboard/Breadcrumbs';

// NEW - USE THIS
import { Breadcrumbs } from '@/features/dashboard/components/navigation';
```

### Sidebar Components

All sidebar components have been migrated to the `features/shell` directory:

```typescript
// OLD - DO NOT USE
import { SimpleSidebar } from '@/components/dashboard/SimpleSidebar';

// NEW - USE THIS
import { AppSidebar } from '@/features/shell';
```

The preferred approach is to use the `AppLayout` component which includes the sidebar:

```typescript
import { AppLayout } from '@/features/shell';

export default function MyPage() {
  return (
    <AppLayout>
      {/* Your content here */}
    </AppLayout>
  );
}
```

## Feature-based Architecture

We've moved to a feature-based architecture where:

1. Each feature has its own directory in `src/features/`
2. Features register their navigation items with the shell
3. The shell provides a consistent layout and navigation for all features

This approach reduces duplication and promotes better separation of concerns.
