# Core Module Migration Plan

## Current Status Analysis

The PharmacyHub Frontend has already started migrating core functionality from the old structure (`src/features/core`) to the new structure (`src/core`), but the migration is incomplete. Both directory structures exist, and while the new structure appears to be fully implemented, many parts of the application are still importing from the old paths.

### What's Already Done

1. **New Core Structure Created**: The new core module at `src/core` has been created with proper structure
2. **Module Implementation**: The core modules (auth, api, rbac, mobile, ui, utils) have been implemented in the new location
3. **Deprecation Notices**: The old modules in `src/features/core` have been marked as deprecated with clear migration instructions

### What Remains To Be Done

1. **Import Path Updates**: Many components still import from the old paths instead of the new core module
2. **Provider Modernization**: App providers need to be updated to use the new core module
3. **Exams Feature Migration**: The exams feature still uses the old core factories and hooks
4. **CSS and Asset Migration**: Some CSS files (like mobile styles) still need to be moved and referenced properly
5. **Final Cleanup**: Once everything is migrated, remove the old directory structure

## Migration Plan

### Phase 1: Update Global App Components

1. **Update Root Layout**
   - Change mobile styles import:
   ```tsx
   // Before
   import "@/features/core/app-mobile-handler/utils/mobile-styles.css";
   
   // After
   import "@/core/mobile/utils/mobile-styles.css";
   ```

2. **Update Providers**
   - Update QueryProvider:
   ```tsx
   // Before
   import { queryClient } from '@/features/core/app-api-handler/core/queryClient';
   
   // After
   import { queryClient } from '@/core/api/core/queryClient';
   ```

   - Update AuthProvider if needed (currently it's using a different auth system from shared/auth)
   - Update any other providers that may be using the old core modules

### Phase 2: Update Exams Feature

1. **Update API Hooks Factory Imports**
   ```tsx
   // Before
   import { createApiHooks } from '@/features/core/app-api-handler/factories/createApiHooks';
   
   // After
   import { createApiHooks } from '@/core/api/factories/createApiHooks';
   ```

2. **Update Exams API Service Imports**
   - Check all files in `src/features/exams/api` and update core imports
   - Update any utility imports from core modules

3. **Update RBAC Imports**
   ```tsx
   // Before
   import { usePermissions } from '@/features/core/app-rbac';
   
   // After
   import { usePermissions } from '@/core/rbac';
   ```

4. **Update Auth Imports**
   ```tsx
   // Before
   import { useAuth } from '@/features/core/app-auth';
   
   // After
   import { useAuth } from '@/core/auth';
   ```

### Phase 3: Update All Other Features

1. **Create Codebase-Wide Import Scan**
   - Use a script or search to find all imports from `@/features/core`
   - Create a comprehensive list of all files that need updating

2. **Update Feature by Feature**
   - Update payments feature imports
   - Update dashboard feature imports
   - Update any other feature imports
   - Update shared utility imports

3. **Update Test Files**
   - Update import paths in all test files

### Phase 4: Verify Integration

1. **Testing Protocol**
   - Run a full build to ensure no import errors
   - Test all updated features to verify functionality
   - Run all automated tests

2. **Verification Checklist**
   - [ ] No more imports from `@/features/core` exist
   - [ ] Application builds successfully
   - [ ] All features work correctly
   - [ ] All tests pass

### Phase 5: Cleanup (Optional)

After a reasonable period of stability (e.g., 1-2 weeks in production), consider removing the old directories:

1. **Remove Deprecated Directories**
   - Remove `src/features/core/app-api-handler`
   - Remove `src/features/core/app-auth`
   - Remove `src/features/core/app-rbac`
   - Remove `src/features/core/app-mobile-handler`

2. **Update Any Re-export Files**
   - Ensure no re-exports from the old paths exist

## Implementation Approach

### Path 1: Automated Search and Replace

For simple imports, use automated search and replace:

1. Search for pattern: `@/features/core/app-api-handler`
2. Replace with: `@/core/api`

Same for other modules:
- `@/features/core/app-auth` → `@/core/auth`
- `@/features/core/app-rbac` → `@/core/rbac`
- `@/features/core/app-mobile-handler` → `@/core/mobile`

### Path 2: Manual Review for Complex Cases

For more complex cases where simple search/replace might not work:

1. Find all import statements with `@/features/core`
2. Review each file manually
3. Update imports based on the specific modules and functions being imported

### Path 3: Update with ESLint Rule

Create an ESLint rule to flag old imports:

```js
// In .eslintrc.js
module.exports = {
  // ... other config
  rules: {
    'no-deprecated-imports': {
      create: function (context) {
        return {
          ImportDeclaration(node) {
            if (node.source.value.includes('@/features/core/app-')) {
              context.report({
                node,
                message: 'Importing from deprecated core path. Use @/core/* instead.',
              });
            }
          },
        };
      },
    },
  },
};
```

## Migration Script

Create a Node.js script to help with the migration:

```js
// migrate-core-imports.js
const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Map of old paths to new paths
const pathMap = {
  '@/features/core/app-api-handler': '@/core/api',
  '@/features/core/app-auth': '@/core/auth',
  '@/features/core/app-rbac': '@/core/rbac',
  '@/features/core/app-mobile-handler': '@/core/mobile',
};

// Find all TypeScript and TSX files
const files = glob.sync('src/**/*.@(ts|tsx)', {
  ignore: ['**/node_modules/**', '**/dist/**'],
});

let updatedFiles = 0;

files.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  let updated = content;

  Object.entries(pathMap).forEach(([oldPath, newPath]) => {
    const regex = new RegExp(`from ['"]${oldPath}`, 'g');
    updated = updated.replace(regex, `from '${newPath}`);
    
    const importRegex = new RegExp(`import ['"]${oldPath}`, 'g');
    updated = updated.replace(importRegex, `import '${newPath}`);
  });

  if (content !== updated) {
    fs.writeFileSync(file, updated, 'utf8');
    console.log(`Updated: ${file}`);
    updatedFiles++;
  }
});

console.log(`Total files updated: ${updatedFiles}`);
```

## Risks and Mitigation

1. **Risk**: Breaking changes in the new core module implementation
   **Mitigation**: Ensure the new core modules have identical APIs to the old ones

2. **Risk**: Missing some import paths during migration
   **Mitigation**: Use the comprehensive search approach and automated tests

3. **Risk**: Performance issues with new implementations
   **Mitigation**: Test performance before and after migration

4. **Risk**: Different behavior between old and new implementations
   **Mitigation**: Conduct thorough testing of all features during migration

## Verification Criteria

The migration will be considered complete when:

1. No imports from `@/features/core/*` exist in the codebase
2. All functionality works identically to the pre-migration state
3. The application builds without warnings or errors
4. All tests pass successfully
5. No performance degradation is observed

## Timeline

- Phase 1 (Update Global App Components): 1 day
- Phase 2 (Update Exams Feature): 2-3 days
- Phase 3 (Update All Other Features): 3-5 days
- Phase 4 (Verify Integration): 1-2 days
- Phase 5 (Cleanup): 1 day (after 1-2 weeks of stability)

**Total Estimated Time**: 7-12 days for implementation, plus 1-2 weeks observation before cleanup
