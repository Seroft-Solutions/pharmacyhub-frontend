# Core Module

The Core module contains all cross-cutting concerns and services that are used across multiple features in the PharmacyHub application.

## Architecture Principles

The Core module follows these key architectural principles:

1. **Clear Separation of Concerns**: Each subdirectory has a specific responsibility.
2. **Component Size Limitations**: No component should exceed 200 lines.
3. **Function Length**: Functions should not exceed 20-30 lines.
4. **Single Responsibility**: Each component should have one clear purpose.
5. **Hierarchical Composition**: UI components follow atomic design principles.

## Directory Structure

```
/core
  /auth                   # Authentication services
    /components           # Auth-specific UI components
    /hooks                # Auth-specific hooks
    /state                # Auth state (Zustand)
    /types                # Auth-related types
    index.ts             # Public API for auth
  /rbac                   # Role-based access control
    /components           # RBAC-specific UI components
    /hooks                # RBAC-specific hooks
    /state                # RBAC state (Zustand)
    /types                # RBAC-related types
    index.ts             # Public API for rbac
  /api                    # API client setup
    /components           # API-related UI components
    /hooks                # API-related hooks
    /services             # API services and client setup
    /types                # API-related types
    index.ts             # Public API for api
  /ui                     # Shared UI component library
    /atoms                # Primitive UI components
    /feedback             # Loaders, notifications, etc.
    /layout               # Layout components
    index.ts             # Public API for ui
  /utils                  # Common utilities
    index.ts             # Public API for utils
  index.ts               # Main entry point for all core functionality
```

## Usage

Always import from the public API of each module:

```typescript
// Good
import { useAuth } from '@/core/auth';
import { PermissionGuard } from '@/core/rbac';
import { Button } from '@/core/ui';

// Bad - don't import from internal directories
import { useAuth } from '@/core/auth/hooks/useAuth';
import { PermissionGuard } from '@/core/rbac/components/PermissionGuard';
```

## State Management

- **Zustand**: Used for feature-specific state with complex interactions
- **TanStack Query**: Used for all server state management
- **React Context**: Used only for simple, infrequently updating state

## Adding to Core

Before adding something to the core, consider:

1. Is it truly a cross-cutting concern?
2. Is it used by multiple features?
3. Is it stable and unlikely to change frequently?

If yes to all, then it belongs in core. Otherwise, it should likely be in a feature module.
