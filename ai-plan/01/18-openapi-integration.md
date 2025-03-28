# Task 18: OpenAPI Specification Integration

## Description
Integrate OpenAPI specification into the frontend workflow to ensure consistent API contracts, type safety, and a single source of truth for API communication between frontend and backend.

## Implementation Steps

1. **OpenAPI Spec Setup**
   - Configure the backend to generate and expose OpenAPI specification
   - Create a mechanism to fetch the latest OpenAPI spec during build or development
   - Set up versioning for the OpenAPI specifications

2. **Type Generation Pipeline**
   - Set up OpenAPI Generator for TypeScript
   - Configure type generation to match project conventions
   - Integrate generation into the build process
   - Output types to a consistent location in the project

3. **Core API Integration**
   - Design integration between generated types/clients and core/api module
   - Create adapters to connect generated code with TanStack Query
   - Ensure proper error handling
   - Maintain backward compatibility during transition

4. **Developer Workflow**
   - Create documentation for the API integration workflow
   - Set up tools for API testing and validation
   - Define process for handling API changes
   - Create examples for common API usage patterns

5. **CI/CD Integration**
   - Integrate OpenAPI validation into CI pipeline
   - Set up automated testing for API contracts
   - Ensure generated types are part of the build artifacts
   - Configure validation to catch API contract changes

## Technical Implementation

### OpenAPI Generator Setup

Add OpenAPI generator to your project:

```bash
npm install --save-dev openapi-typescript-codegen
# or
npm install --save-dev @openapitools/openapi-generator-cli
```

Create a generation script in package.json:

```json
{
  "scripts": {
    "generate-api": "openapi --input http://localhost:8080/api-docs --output ./src/core/api/generated --client axios"
  }
}
```

### Type Generation Configuration

Create a configuration file for OpenAPI generation:

```js
// openapi-config.js
module.exports = {
  input: process.env.OPENAPI_URL || 'http://localhost:8080/api-docs',
  output: './src/core/api/generated',
  client: 'axios',
  exportCore: true,
  exportServices: true,
  exportModels: true,
  exportSchemas: false,
  indent: '  ',
  postfixModels: 'Dto',
  postfixServices: 'Api',
  request: './src/core/api/services/apiClient.ts',
  useOptions: true,
  useUnionTypes: true
}
```

### Core API Integration

Create an adapter to integrate generated API clients with TanStack Query:

```typescript
// core/api/adapters/queryAdapter.ts
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';

// Generic type for API methods that return Promises with AxiosResponse
type ApiMethod<T, P = any> = (params: P) => Promise<AxiosResponse<T>>;

/**
 * Converts an OpenAPI generated method to a TanStack Query compatible function
 */
export function createQueryHook<TData, TParams extends any[]>(
  apiMethod: (...params: TParams) => Promise<AxiosResponse<TData>>,
  getQueryKey: (...params: TParams) => unknown[]
) {
  return (
    ...params: TParams
  ) => (
    options?: Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn'>
  ) => {
    return useQuery<TData, Error>({
      queryKey: getQueryKey(...params),
      queryFn: async () => {
        const response = await apiMethod(...params);
        return response.data;
      },
      ...options,
    });
  };
}

/**
 * Converts an OpenAPI generated mutation method to a TanStack Query compatible function
 */
export function createMutationHook<TData, TParams extends any[]>(
  apiMethod: (...params: TParams) => Promise<AxiosResponse<TData>>
) {
  return (
    options?: Omit<UseMutationOptions<TData, Error, TParams>, 'mutationFn'>
  ) => {
    return useMutation<TData, Error, TParams>({
      mutationFn: async (...params: TParams) => {
        const response = await apiMethod(...params);
        return response.data;
      },
      ...options,
    });
  };
}
```

### Feature API Implementation

```typescript
// features/products/api/productApi.ts
import { ProductsApi, ProductDto, CreateProductDto } from '@/core/api/generated';
import { createQueryHook, createMutationHook } from '@/core/api/adapters/queryAdapter';

// Query key factory
const productsKeys = {
  all: ['products'] as const,
  lists: () => [...productsKeys.all, 'list'] as const,
  list: (filters: string) => [...productsKeys.lists(), { filters }] as const,
  details: () => [...productsKeys.all, 'detail'] as const,
  detail: (id: string) => [...productsKeys.details(), id] as const,
};

// Create API instance
const productsApi = new ProductsApi();

// Create query hooks
export const useProductsQuery = createQueryHook(
  productsApi.getProducts,
  (filters: string = '') => productsKeys.list(filters)
);

export const useProductQuery = createQueryHook(
  productsApi.getProductById,
  (id: string) => productsKeys.detail(id)
);

// Create mutation hooks
export const useCreateProductMutation = createMutationHook(
  productsApi.createProduct
);

export const useUpdateProductMutation = createMutationHook(
  productsApi.updateProduct
);

export const useDeleteProductMutation = createMutationHook(
  productsApi.deleteProduct
);

// Re-export types
export type { ProductDto, CreateProductDto };
```

## CI/CD Pipeline Integration

Add to your GitHub Actions workflow:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Generate API types
        run: npm run generate-api
        env:
          OPENAPI_URL: ${{ secrets.API_DOCS_URL }}
        
      - name: Build
        run: npm run build
```

## Development Workflow

1. Backend team updates API and OpenAPI spec
2. Frontend team runs `npm run generate-api` to update types and clients
3. Frontend developers use the generated types and query hooks
4. CI validates that the frontend is using correct types and API contracts

## Verification Criteria
- OpenAPI specifications are properly fetched and used
- Types are generated correctly and match backend contracts
- Integration with TanStack Query is seamless
- Developer workflow is documented and easy to follow
- CI/CD pipeline validates API contracts
- Error handling is consistent
- Feature API implementations follow best practices

## Time Estimate
Approximately 3-4 days

## Dependencies
- Task 02: Migrate app-api-handler to core/api
- Task 06: Refactor core/api components
- Task 10: Implement TanStack Query for API state

## Risks
- Backend may not have proper OpenAPI specifications
- Generated code may not align with project coding standards
- Integration with TanStack Query may be complex
- Versioning and backward compatibility challenges
- Performance impact of generated code
