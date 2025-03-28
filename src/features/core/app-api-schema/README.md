# API Schema

This directory contains TypeScript types generated from the OpenAPI specification.

## Structure

- `openapi-spec.json` - The OpenAPI specification downloaded from the backend
- `generated/` - TypeScript types generated from the OpenAPI spec
  - `models/` - Generated model interfaces
  - `index.ts` - Exports for all generated types

## Usage

Import the generated types in your feature modules:

```typescript
import { ExamResponseDTO } from '@/features/core/api-schema/generated';

// Use the type in your feature code
const exam: ExamResponseDTO = { /* ... */ };
```

## Updating Types

When the backend API changes, run:

```bash
npm run update-api-types
```

This will:
1. Download the latest OpenAPI spec from the backend
2. Generate updated TypeScript types
3. Clean up the generated files to only include types (no API client code)

## Integration with Feature-Based Architecture

These generated types provide a single source of truth for API contracts, while allowing each feature module to maintain its own internal types and API hooks.

See `src/lib/openapi-schema-generator.md` for detailed usage instructions.
