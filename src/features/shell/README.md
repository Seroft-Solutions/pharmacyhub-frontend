# Shell Feature

The Shell feature provides a unified application shell with components for creating consistent layouts and navigation across the PharmacyHub application. It includes a navigation system, sidebar, topbar, and layout components that can be used by any feature in the application.

## Architecture Overview

The shell feature uses a registry-based approach where:

1. Features register their navigation items with the shell's navigation system
2. The shell provides a unified, permission-aware navigation UI
3. Features use the shell layout without creating duplicate layouts

This approach reduces duplication and ensures consistent navigation across the application.

## Components

### AppLayout

The `AppLayout` is the main layout component that combines all the shell elements (sidebar, topbar, content area) into a complete page layout.

```tsx
import { AppLayout } from '@/features/shell';

export default function DashboardPage() {
  return (
    <AppLayout>
      <h1>Dashboard Content</h1>
      {/* Your feature-specific content goes here */}
    </AppLayout>
  );
}
```

#### Props

- `children`: React nodes to render in the content area
- `features`: Optional custom navigation features
- `requireAuth`: Whether authentication is required (default: true)
- `appName`: Application name displayed in the topbar
- `logoComponent`: Custom logo component
- `showFeatureGroups`: Whether to group navigation items by feature

### Navigation System

The shell provides a navigation system that allows features to register their navigation items and provides a unified navigation structure for the application.

```tsx
import { useNavigation, FeatureNavigation } from '@/features/shell';

// Example feature navigation
const FEATURE_NAVIGATION: FeatureNavigation = {
  id: "feature",
  name: "Feature Name",
  rootPath: "/feature",
  order: 10,
  items: [
    {
      id: "feature-item",
      label: "Feature Item",
      href: "/feature/item",
      icon: Icon,
      subItems: [
        // Sub-items
      ]
    }
  ]
};

// Register feature navigation
function FeatureRoot({ children }) {
  const { registerFeature, unregisterFeature } = useNavigation();
  
  useEffect(() => {
    registerFeature(FEATURE_NAVIGATION);
    return () => {
      unregisterFeature(FEATURE_NAVIGATION.id);
    };
  }, []);
  
  return <>{children}</>;
}
```

## Usage in Next.js App Router

### Root Layout

```tsx
// app/layout.tsx
import { AppLayout } from '@/features/shell';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppLayout requireAuth={false}>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
```

### Feature Layout

```tsx
// app/feature/layout.tsx
import { AppLayout } from '@/features/shell';
import { FEATURE_NAVIGATION } from '@/features/feature/navigation';

export default function FeatureLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppLayout 
      features={[FEATURE_NAVIGATION]} 
      appName="Feature Name"
    >
      {children}
    </AppLayout>
  );
}
```

## Feature-specific Navigation

Each feature can define its own navigation configuration:

```tsx
// src/features/feature/navigation.ts
import { FeatureNavigation } from '@/features/shell';
import { Icon1, Icon2 } from 'lucide-react';

export const FEATURE_NAVIGATION: FeatureNavigation = {
  id: "feature",
  name: "Feature Name",
  rootPath: "/feature",
  order: 10,
  items: [
    {
      id: "feature-item-1",
      label: "Item 1",
      href: "/feature/item-1",
      icon: Icon1,
    },
    {
      id: "feature-item-2",
      label: "Item 2",
      href: "/feature/item-2",
      icon: Icon2,
    }
  ]
};
```

## RBAC Integration

The navigation system automatically integrates with the application's Role-Based Access Control system. Items will only be displayed if the user has the required roles or permissions.

To restrict an item based on roles or permissions:

```tsx
{
  id: "admin-item",
  label: "Admin Item",
  href: "/admin/item",
  icon: Shield,
  roles: ["ADMIN"],
  permissions: ["manage_users"]
}
```

## Responsive Behavior

The shell components automatically adapt to different screen sizes:
- On mobile: Sidebar becomes a slide-out drawer accessible via a menu button
- On desktop: Sidebar is shown inline and can be collapsed/expanded

## Benefits of This Approach

1. **Separation of Concerns**: Navigation logic is separate from UI components
2. **Extensibility**: New features can easily register their navigation items
3. **Consistency**: Unified navigation structure across the application
4. **Maintainability**: Single source of truth for navigation
5. **Flexibility**: Features can override navigation behavior when needed

## Migration Guide

Old sidebar components have been moved to `src/components/deprecated`. If you were using any of these components:

- `SimpleSidebar`
- `SimpleExamsSidebar`
- `ExamsSidebar`
- `Sidebar`

You should update your imports to use the new AppLayout from the shell feature:

```tsx
// Old
import { SimpleSidebar } from '@/components/dashboard/SimpleSidebar';

// New
import { AppLayout } from '@/features/shell';

// Old usage
<SimpleSidebar />

// New usage
<AppLayout>{children}</AppLayout>
```
