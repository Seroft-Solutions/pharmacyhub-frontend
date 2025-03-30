# Import Path Migration Plan

This document outlines the plan for updating import paths after migrating from the old `exams` feature to the new `exams-preparation` feature.

## Path Changes

### 1. Internal Feature Imports

For files within the `exams-preparation` feature, all imports should use relative paths rather than absolute paths:

```typescript
// Change from
import { something } from '@/features/exams-preparation/[path]';

// To
import { something } from '../../[path]';
```

### 2. External Imports of Exams Feature

Files outside the `exams-preparation` feature that import from the old `exams` feature need to be updated to import from `exams-preparation` instead:

```typescript
// Change from
import { something } from '@/features/exams/[path]';

// To
import { something } from '@/features/exams-preparation/[path]';
```

### 3. Type Imports

Type imports need special attention:

```typescript
// Change from
import { SomeType } from '@/features/exams/types';

// To
import { SomeType } from '@/features/exams-preparation/types';
```

## Migration Strategy

### Phase 1: Update Internal Imports

1. Update all imports within the `exams-preparation` feature to use relative paths
2. Ensure all components reference the correct paths for types, utils, and other modules

### Phase 2: Create Type Compatibility Layer

1. Create compatibility type exports in the old `exams/types` to re-export from `exams-preparation/types`
2. This will prevent breaking external code during the transition

### Phase 3: External Import Updates

1. Identify all files that import from the old `exams` feature
2. Update these imports to point to the new `exams-preparation` feature
3. Test each updated file to ensure functionality is maintained

## Files to Update

1. Pages that use the exams feature
2. Components that reference exam types or utilities
3. Other features that integrate with exams (like payments)

## Testing Strategy

1. Run TypeScript compiler to catch type errors
2. Run linting to identify import issues
3. Verify each updated file with manual testing
4. Run unit and integration tests

## Rollback Plan

If issues are encountered:
1. Temporarily revert to using the compatibility layer
2. Address specific issues in the new feature
3. Re-attempt the migration with fixes
