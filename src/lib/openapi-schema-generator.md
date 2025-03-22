# OpenAPI Schema Generator for Feature-Based Architecture

This guide explains how to generate TypeScript types from the OpenAPI specification for use with your feature-based architecture and TanStack Query API setup.

## Prerequisites

- Node.js installed
- npm or yarn

## Setup

### 1. Install Required Dependencies

```bash
# Install OpenAPI Generator CLI and TypeScript types generator
npm install --save-dev @openapitools/openapi-generator-cli
```

### 2. Add Scripts to package.json

```json
{
  "scripts": {
    "fetch-openapi": "wget -O ./src/features/core/api-schema/openapi-spec.json http://localhost:8080/api/openapi/download-spec",
    "generate-api-types": "openapi-generator-cli generate -i ./src/features/core/api-schema/openapi-spec.json -g typescript -o ./src/features/core/api-schema/generated --global-property models,supportingFiles=index.ts --additional-properties=modelPropertyNaming=original,enumPropertyNaming=original,useSingleRequestParameter=false",
    "update-api-types": "npm run fetch-openapi && npm run generate-api-types && npm run cleanup-api-types",
    "cleanup-api-types": "node ./scripts/cleanup-api-types.js"
  }
}
```

### 3. Create Directory Structure

```bash
mkdir -p src/features/core/api-schema/generated
```

### 4. Create Cleanup Script

Create a file at `scripts/cleanup-api-types.js`:

```javascript
const fs = require('fs');
const path = require('path');

// Path to the generated types directory
const generatedDir = path.join(__dirname, '../src/features/core/api-schema/generated');

// Remove API client files (we only want the types)
const filesToRemove = [
  'api.ts',
  'base.ts',
  'common.ts',
  'configuration.ts',
];

filesToRemove.forEach(file => {
  const filePath = path.join(generatedDir, file);
  if (fs.existsSync(filePath)) {
    console.log(`Removing ${file}...`);
    fs.unlinkSync(filePath);
  }
});

// Modify index.ts to export only the models
const indexPath = path.join(generatedDir, 'index.ts');
if (fs.existsSync(indexPath)) {
  console.log('Updating index.ts...');
  const indexContent = fs.readFileSync(indexPath, 'utf8');
  // Remove API exports but keep model exports
  const updatedContent = indexContent
    .split('\n')
    .filter(line => !line.includes('api') && !line.includes('Api') && !line.includes('configuration'))
    .join('\n');
  fs.writeFileSync(indexPath, updatedContent);
}

console.log('Cleanup complete!');
```

## Using Generated Types with Your Feature-Based Architecture

### 1. Import Types in Your Feature Modules

In your feature-specific type files, import and extend the generated types:

```typescript
// src/features/exams/types/index.ts
import { ExamResponseDTO, ExamRequestDTO } from '../../../core/api-schema/generated';

// You can extend or alias the generated types
export type Exam = ExamResponseDTO;
export type CreateExamRequest = ExamRequestDTO;

// Add any additional feature-specific types
export interface ExamWithStatus extends Exam {
  statusLabel: string;
}
```

### 2. Use Types in Your TanStack Query Setup

```typescript
// src/features/exams/api/hooks.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { createApiHooks } from '../../../core/tanstack-query-api';
import { Exam, CreateExamRequest } from '../types';

export const EXAM_ENDPOINTS = {
  all: '/api/v1/exams',
  published: '/api/v1/exams/published',
  byId: '/api/v1/exams/:id',
  // ...other endpoints
};

// Continue using your existing TanStack Query setup
export const examApiHooks = createApiHooks<Exam>(EXAM_ENDPOINTS);

// Your hooks can now use the proper types from OpenAPI
export const useExams = () => {
  return useQuery<Exam[]>({
    queryKey: ['exams'],
    queryFn: () => examApiHooks.useList().queryFn(),
  });
};

export const useCreateExam = () => {
  return useMutation<Exam, Error, CreateExamRequest>({
    mutationFn: (data) => examApiHooks.useCreate().mutationFn(data),
  });
};
```

## Benefits

This approach gives you the best of both worlds:

1. **Maintain Feature-Based Architecture**: Continue using your modular, feature-based code organization.

2. **Type Safety from Backend Contract**: The generated types ensure your frontend types match the backend API.

3. **Keep TanStack Query**: Continue using your existing TanStack Query setup for API calls.

4. **Automatic Type Updates**: When the backend API changes, simply run `npm run update-api-types` to update your types.

## Validation and Type Checking

To add runtime validation with your TanStack Query setup:

```typescript
// Add zod for validation
import { z } from 'zod';
import { Exam } from '../types';

// Create a zod schema based on your types
const examSchema = z.object({
  id: z.number(),
  title: z.string(),
  // ...other fields
});

// Use the schema in your API hooks
export const useExam = (id: number) => {
  return useQuery<Exam>({
    queryKey: ['exam', id],
    queryFn: async () => {
      const data = await examApiHooks.useGet(id).queryFn();
      // Validate the data matches the expected schema
      return examSchema.parse(data);
    },
  });
};
```

## Updates and Maintenance

When your backend API changes:

1. Run `npm run update-api-types`
2. Check for any type errors in your codebase
3. Update your feature-specific types as needed

This will ensure your frontend stays in sync with the backend API contract.
