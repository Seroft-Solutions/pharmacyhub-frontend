# OpenAPI Integration

This document explains how to use the OpenAPI integration in the Pharmacy Hub frontend application.

## Overview

The OpenAPI integration automates the generation of TypeScript types and API clients from the backend OpenAPI specification. This ensures type safety and consistency between the frontend and backend API contracts.

## Setup

The OpenAPI integration is set up with the following components:

1. **OpenAPI Generator**: Uses [openapi-typescript-codegen](https://github.com/ferdikoomen/openapi-typescript-codegen) to generate TypeScript interfaces and API clients.
2. **Fetch Script**: A script to fetch the latest OpenAPI specification from the backend.
3. **Generate Script**: A script to generate the TypeScript interfaces and API clients.
4. **TanStack Query Integration**: Hooks to integrate the generated API clients with TanStack Query.

## Usage

### Fetching the OpenAPI Specification

To fetch the latest OpenAPI specification from the backend, run:

```bash
npm run openapi:fetch
```

This will download the OpenAPI specification from the backend API and save it to `src/core/api/openapi.json`.

### Generating API Clients

To generate TypeScript interfaces and API clients from the OpenAPI specification, run:

```bash
npm run openapi:generate
```

This will generate the API clients in the `src/core/api/generated` directory.

### Running Both Steps

To fetch the specification and generate the API clients in one command, run:

```bash
npm run openapi
```

### Using Generated API Clients

The generated API clients can be used directly:

```typescript
import { UserService } from '@/core/api/generated';

// Use the service directly
const user = await UserService.getUserById({ id: 123 });
```

However, it's recommended to use the TanStack Query integration for better state management:

```typescript
import { useGetUserById } from '@/features/users/api/userApi';

// In a component
const { data: user, isLoading, error } = useGetUserById(123);
```

## Creating Feature API Services

To create a new feature API service that uses the generated API clients:

1. Create a new file in the feature's `api` directory, e.g., `src/features/products/api/productApi.ts`.
2. Import the necessary hooks and services:

```typescript
import { 
  createOpenApiQueryHook, 
  useOpenApiMutation 
} from '@/core/api/hooks';
import { productKeys } from '@/core/api/utils/openApiQueryKeys';
import { 
  ProductService,
  ProductDTO
} from '@/core/api/generated';
```

3. Create query and mutation hooks for the feature:

```typescript
// Query hook
export function useGetProducts(page = 0, size = 20, options = {}) {
  return useOpenApiQuery(
    productKeys.list({ page, size }),
    () => ProductService.getProducts({ page, size }),
    options
  );
}

// Mutation hook
export function useCreateProduct(options = {}) {
  return useOpenApiMutation(
    (data) => ProductService.createProduct({ requestBody: data }),
    options
  );
}
```

## Best Practices

1. **Don't modify generated code**: The code in the `generated` directory is automatically generated and should not be modified manually.
2. **Use feature-specific API services**: Create feature-specific API services that use the generated API clients rather than using the generated clients directly in components.
3. **Consistent query keys**: Use the query key factories to create consistent query keys for better cache management.
4. **Error handling**: Implement proper error handling in your components when using the API services.
5. **Type safety**: Leverage TypeScript's type system to ensure type safety when working with API data.
6. **Regenerate after backend changes**: Whenever the backend API changes, regenerate the API clients to ensure consistency.

## Troubleshooting

If you encounter issues with the OpenAPI integration:

1. **Check the backend API**: Ensure the backend API is running and accessible.
2. **Check the OpenAPI specification**: Ensure the OpenAPI specification is valid by verifying it with a tool like the [Swagger Editor](https://editor.swagger.io/).
3. **Clean the generated directory**: Delete the `generated` directory and regenerate the API clients.
4. **Check for type errors**: Look for TypeScript errors in your codebase after regenerating the API clients.
