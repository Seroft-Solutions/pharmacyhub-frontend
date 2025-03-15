# Feature-Centric RBAC System

## Overview

This RBAC (Role-Based Access Control) system uses a feature-centric approach where each feature in the application defines its own permissions, feature flags, and role requirements. This makes the code more maintainable, portable, and clearer in showing which permissions and roles are needed for each feature.

## Architecture

### Core Components

1. **Feature Registry** - Centralized registry for features, permissions, and feature flags
2. **RBAC Registry** - Maps roles to permissions based on feature requirements
3. **Feature Flag Service** - Runtime management of feature flags
4. **Feature Context** - React context for easy access to feature status and permissions

### Directory Structure

```
src/
└── features/
    ├── auth/
    │   ├── constants/
    │   │   └── index.ts (auth-specific constants)
    │   └── ...
    ├── exams/
    │   ├── constants/
    │   │   └── index.ts (exam-specific constants)
    │   └── ...
    └── rbac/
        ├── constants/
        │   └── roles.ts (core roles definition)
        ├── contexts/
        │   └── FeatureContext.tsx (React context for features)
        ├── hooks/
        │   ├── useAccess.ts (permissions checking)
        │   └── useFeatureAccess.ts (feature access checking)
        ├── registry/
        │   ├── featureRegistry.ts (feature management)
        │   ├── rbacRegistry.ts (role-permission mapping)
        │   └── index.ts (registry exports)
        ├── services/
        │   └── featureFlagService.ts (runtime feature flags)
        ├── ui/
        │   └── FeatureGuard.tsx (component guards)
        └── index.ts (main exports)
```

## Usage

### Defining a Feature

Each feature in your application should define its permissions, feature flags, and role requirements:

```typescript
// src/features/myFeature/constants/index.ts
import { defineFeature } from '@/features/rbac/registry';
import { Role } from '@/features/rbac/constants/roles';
import { registerFeature } from '@/features/rbac/registry';

// Feature definition
export const MY_FEATURE = defineFeature(
  'myFeature',
  'My Feature',
  'Description of my feature'
);

// Feature-specific permissions
export enum MyFeaturePermission {
  VIEW = 'myFeature:view',
  EDIT = 'myFeature:edit',
  DELETE = 'myFeature:delete'
}

// Feature flags
export enum MyFeatureFlag {
  ADVANCED_MODE = 'myFeature:advanced-mode',
  BETA_FEATURES = 'myFeature:beta-features'
}

// Feature flag definitions
export const MY_FEATURE_FLAGS = {
  [MyFeatureFlag.ADVANCED_MODE]: {
    name: 'Advanced Mode',
    description: 'Enable advanced features',
    defaultEnabled: false
  },
  [MyFeatureFlag.BETA_FEATURES]: {
    name: 'Beta Features',
    description: 'Enable beta features',
    defaultEnabled: false
  }
};

// Roles that have access to this feature
export const MY_FEATURE_REQUIRED_ROLES = [
  Role.USER,
  Role.ADMIN
];

// Feature initializer
export function initializeMyFeature() {
  // Register this feature with the registry
  registerFeature(
    MY_FEATURE,
    MyFeaturePermission,
    MY_FEATURE_REQUIRED_ROLES,
    MyFeatureFlag,
    MY_FEATURE_FLAGS
  );
  
  console.log('My feature registered');
}
```

### Application Initialization

Initialize the RBAC system and register all features:

```typescript
// src/app/providers.tsx
import { FeatureProvider, initializeRbac } from '@/features/rbac';
import { initializeAuthFeature } from '@/features/auth/constants';
import { initializeExamsFeature } from '@/features/exams/constants';
import { initializeMyFeature } from '@/features/myFeature/constants';

// Initialize features
initializeAuthFeature();
initializeExamsFeature();
initializeMyFeature();

// Initialize RBAC system
initializeRbac();

export function Providers({ children }) {
  return (
    <FeatureProvider>
      {children}
    </FeatureProvider>
  );
}
```

### Using Feature Guards in Components

```tsx
import { FeatureGuard, FeatureFlagGuard } from '@/features/rbac/ui/FeatureGuard';
import { MyFeaturePermission, MyFeatureFlag } from '@/features/myFeature/constants';

function MyFeatureComponent() {
  return (
    <div>
      {/* Basic feature guard */}
      <FeatureGuard
        featureId="myFeature"
        fallback={<p>Feature not available</p>}
      >
        <div>My Feature Content</div>
      </FeatureGuard>
      
      {/* Guard with permission requirements */}
      <FeatureGuard
        featureId="myFeature"
        permissionsRequired={[MyFeaturePermission.EDIT]}
        fallback={<p>You don't have permission to edit</p>}
      >
        <EditButton />
      </FeatureGuard>
      
      {/* Specific feature flag guard */}
      <FeatureFlagGuard
        featureId="myFeature"
        flagId={MyFeatureFlag.ADVANCED_MODE}
        fallback={<p>Advanced mode is disabled</p>}
      >
        <AdvancedOptions />
      </FeatureFlagGuard>
    </div>
  );
}
```

### Using Hooks for Feature Access

```tsx
import { useFeatureAccess } from '@/features/rbac/hooks';
import { MyFeaturePermission } from '@/features/myFeature/constants';

function MyComponent() {
  const { 
    canAccess,
    isEnabled,
    hasPermissions,
    feature,
    isLoading
  } = useFeatureAccess('myFeature', {
    permissionsRequired: [MyFeaturePermission.VIEW],
    flagId: 'myFeature:advanced-mode'
  });
  
  if (isLoading) return <Loading />;
  
  if (!isEnabled) return <p>This feature is disabled</p>;
  
  if (!canAccess) return <p>You don't have access to this feature</p>;
  
  return (
    <div>
      <h1>{feature.name}</h1>
      <p>{feature.description}</p>
      {/* Feature content */}
    </div>
  );
}
```

### Feature Management UI

For admin interfaces, you can build UI components to manage feature flags:

```tsx
import { useFeatures } from '@/features/rbac';

function FeatureManagement() {
  const { 
    getAllFeatureInfo,
    isFeatureEnabled,
    enableFeature,
    disableFeature
  } = useFeatures();
  
  const features = getAllFeatureInfo();
  
  return (
    <div>
      <h1>Feature Management</h1>
      <table>
        <thead>
          <tr>
            <th>Feature</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(features).map(([id, feature]) => (
            <tr key={id}>
              <td>{feature.name}</td>
              <td>{feature.description}</td>
              <td>{isFeatureEnabled(id) ? 'Enabled' : 'Disabled'}</td>
              <td>
                <button 
                  onClick={() => isFeatureEnabled(id) 
                    ? disableFeature(id) 
                    : enableFeature(id)
                  }
                >
                  {isFeatureEnabled(id) ? 'Disable' : 'Enable'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

## Extending the System

### Adding New Roles

To add new roles, update the roles enum in `rbac/constants/roles.ts`:

```typescript
export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  // Add new roles here
  MY_NEW_ROLE = 'MY_NEW_ROLE'
}
```

Also update the role hierarchy and metadata:

```typescript
export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  // Add new role to hierarchy
  [Role.MY_NEW_ROLE]: [Role.USER]
}

export const ROLE_METADATA: Record<Role, { name: string; description: string }> = {
  // Add metadata for new role
  [Role.MY_NEW_ROLE]: {
    name: 'My New Role',
    description: 'Description of my new role'
  }
}
```

### Supporting Server-Side Feature Flags

To integrate with a server-side feature flag service, update the `loadFlagsFromApi` method in `featureFlagService.ts`:

```typescript
private async loadFlagsFromApi(): Promise<void> {
  try {
    const response = await fetch('/api/features/flags');
    const data = await response.json();
    
    // Update flags with server values
    this.flags = { ...this.flags, ...data };
  } catch (error) {
    console.error('Failed to load feature flags from API', error);
    throw error;
  }
}
```

## Benefits of This Approach

1. **Feature-Centric Organization**: Each feature owns its constants, permissions, and flags
2. **Self-Contained**: Features define all their requirements in one place
3. **Portability**: Easy to reuse features across projects
4. **Maintainability**: Clear visibility of which feature needs which permissions/roles
5. **Type Safety**: Strong TypeScript typing throughout
6. **Discoverability**: Easy to see what capabilities a feature has
7. **Namespacing**: Permissions are namespaced by feature (e.g., `exams:view`)
