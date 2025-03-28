# Task 15: Update Imports Across the Project

## Description
Update import paths throughout the codebase to reflect the new directory structure and component organization, ensuring all references are properly maintained.

## Implementation Steps

1. **Import Path Analysis**
   - Scan the codebase for imports referencing the old directory structure
   - Create a mapping of old import paths to new import paths
   - Prioritize updates based on dependencies

2. **Core Module Import Updates**
   - Update imports for core/api
   - Update imports for core/auth
   - Update imports for core/rbac
   - Update imports for core/ui
   - Update imports for core/utils

3. **Feature Module Import Updates**
   - Update imports in each feature module
   - Ensure features use the public API of core modules
   - Fix any circular dependencies

4. **Pages Import Updates**
   - Update imports in page components
   - Ensure proper use of features and core modules

5. **Test Import Updates**
   - Update imports in test files
   - Ensure tests can still run properly

6. **Automated Testing**
   - Run unit tests to ensure functionality is maintained
   - Fix any broken tests caused by import changes

7. **Documentation Update**
   - Update import examples in documentation
   - Update README.md files with new import patterns

## Import Update Strategy

### Import Path Scanning

Use a script or tool to identify all import statements in the codebase:

```bash
# Example command to find all import statements
grep -r "from '[^']*features/core" --include="*.ts" --include="*.tsx" ./src
```

### Creating Import Mapping

Create a mapping of old paths to new paths:

```javascript
const importMapping = {
  '@/features/core/app-api-handler': '@/core/api',
  '@/features/core/app-auth': '@/core/auth',
  '@/features/core/app-rbac': '@/core/rbac',
  '@/features/core/app-mobile-handler': '@/core/mobile',
  // More specific mappings
  '@/features/core/app-api-handler/components': '@/core/api/components',
  '@/features/core/app-api-handler/hooks': '@/core/api/hooks',
  // And so on...
};
```

### Example Import Updates

#### Before

```typescript
// Before
import { useAuth } from '@/features/core/app-auth';
import { Permission } from '@/features/core/app-rbac/types';
import { apiClient } from '@/features/core/app-api-handler/services/apiClient';
```

#### After

```typescript
// After
import { useAuth } from '@/core/auth';
import { Permission } from '@/core/rbac/types';
import { apiClient } from '@/core/api/services/apiClient';
```

### Barrel File Updates

Update barrel files (index.ts) to properly re-export the components and functions:

```typescript
// core/auth/index.ts
// Public API exports
export { useAuth } from './hooks/useAuth';
export { AuthProvider } from './components/AuthProvider';
export type { User } from './types';
// And so on...
```

## Verification Criteria
- All imports updated to reflect new directory structure
- No references to old directory structure remain
- Application builds successfully
- All tests pass
- No runtime errors related to imports
- Documentation reflects new import patterns

## Time Estimate
Approximately 2-3 days

## Dependencies
- Tasks 02-05: Migration of core modules
- Tasks 06-08: Refactoring of core components

## Risks
- High risk of breaking changes if imports are not properly updated
- May require coordination with multiple team members
- May require updates to build configuration
