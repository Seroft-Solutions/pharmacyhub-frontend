# OpenAPI Integration Best Practices

This document outlines best practices for working with OpenAPI specifications in the PharmacyHub frontend project.

## General Principles

1. **Single Source of Truth**: The OpenAPI specification should be the single source of truth for API contracts.
2. **Type Safety**: All API interactions should leverage generated types for full type safety.
3. **Consistent Integration**: Integration with core/api should be consistent across all features.
4. **Versioning**: API versioning should be handled gracefully.
5. **Error Handling**: Error responses should be properly typed and handled.

## Directory Structure

```
/src
  /core
    /api
      /generated          # OpenAPI generated code
        /models           # Generated data models
        /services         # Generated API services
        index.ts         # Exports all models and services
      /adapters           # Adapters for integration with TanStack Query
      /hooks              # Custom hooks built on top of generated code
      /errors             # Error handling utilities
      /utils              # API utilities
      index.ts           # Public API
```

## Working with Generated Types

### DO:

- Use generated types for request and response objects
- Extend generated types when additional properties are needed
- Create type guards for proper type narrowing
- Document any discrepancies between generated types and actual API

```typescript
// Good practice
import { ProductDto } from '@/core/api/generated';

// Extending generated types
interface EnhancedProduct extends ProductDto {
  formattedPrice: string;
}

// Type guard
function isValidProduct(product: unknown): product is ProductDto {
  return (
    typeof product === 'object' &&
    product !== null &&
    'id' in product &&
    'name' in product
  );
}
```

### DON'T:

- Duplicate types that are already generated
- Ignore type errors by using `any` or type assertions
- Modify generated files directly

```typescript
// Bad practice - duplicating types
interface Product { // DON'T do this if ProductDto exists
  id: string;
  name: string;
  price: number;
}

// Bad practice - ignoring types
const product = response.data as any; // DON'T do this

// Bad practice - modifying generated files
// Don't edit files in the generated directory
```

## Working with API Services

### DO:

- Create custom hooks that wrap generated services
- Use TanStack Query adapters for data fetching
- Handle errors consistently
- Add proper documentation

```typescript
// Good practice
import { ProductsApi } from '@/core/api/generated';
import { createQueryHook } from '@/core/api/adapters/queryAdapter';

const productsApi = new ProductsApi();

// Create a custom hook with proper keys and error handling
export const useProductsQuery = (filters: string = '') => {
  return createQueryHook(
    productsApi.getProducts,
    ['products', 'list', filters]
  )({ filters }, {
    onError: (error) => {
      // Handle error consistently
      errorHandler.handleApiError(error);
    }
  });
};
```

### DON'T:

- Call generated API services directly in components
- Mix different API calling patterns
- Handle errors inconsistently

```typescript
// Bad practice - calling API directly in component
const Component = () => {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    // DON'T do this
    const productsApi = new ProductsApi();
    productsApi.getProducts()
      .then(response => setProducts(response.data))
      .catch(error => console.error(error));
  }, []);
  
  // ...
};
```

## Error Handling

### DO:

- Create error types based on OpenAPI error responses
- Use type guards to narrow error types
- Handle errors at the appropriate level
- Map error codes to user-friendly messages

```typescript
// Good practice
import { ApiError } from '@/core/api/generated';

// Type guard for API errors
function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'data' in error
  );
}

// Error handler
export const handleApiError = (error: unknown) => {
  if (isApiError(error)) {
    switch (error.status) {
      case 400:
        notificationService.error('Invalid input data');
        break;
      case 401:
        authService.handleUnauthorized();
        break;
      // Other cases
      default:
        notificationService.error('An unexpected error occurred');
    }
    // Log error details
    logger.error('API Error', error);
  } else {
    // Handle non-API errors
    notificationService.error('A network error occurred');
    logger.error('Network Error', error);
  }
};
```

### DON'T:

- Use generic error messages for all errors
- Ignore error typing
- Handle errors inconsistently across the application

## API Changes Workflow

### When Backend API Changes:

1. Backend team updates the API and OpenAPI specification
2. OpenAPI spec is published to a known location
3. Frontend developers run the generation script:
   ```bash
   npm run generate-api
   ```
4. TypeScript will highlight type errors in the codebase
5. Fix type errors and update implementations
6. Run tests to ensure functionality
7. Commit changes to version control

### When Frontend Needs New API:

1. Frontend team discusses requirements with backend team
2. Backend team updates the API and OpenAPI spec
3. Frontend team generates new types and clients
4. Frontend implements new features using the generated code
5. Both teams test the integration

## Examples

### Basic Query Example

```typescript
// features/products/api/productQueries.ts
import { ProductsApi, ProductDto } from '@/core/api/generated';
import { createQueryHook } from '@/core/api/adapters/queryAdapter';

const productsApi = new ProductsApi();

export const useProductsQuery = createQueryHook(
  productsApi.getProducts,
  (filters = '') => ['products', 'list', filters]
);

// Using the hook in a component
const ProductList = () => {
  const { data: products, isLoading, error } = useProductsQuery('category=electronics');
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div>
      {products?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

### Mutation Example

```typescript
// features/products/api/productMutations.ts
import { ProductsApi, CreateProductDto } from '@/core/api/generated';
import { createMutationHook } from '@/core/api/adapters/queryAdapter';
import { queryClient } from '@/core/api/queryClient';

const productsApi = new ProductsApi();

export const useCreateProductMutation = createMutationHook(
  productsApi.createProduct,
  {
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries(['products']);
      notificationService.success('Product created successfully');
    },
    onError: (error) => {
      handleApiError(error);
    }
  }
);

// Using the hook in a component
const ProductForm = () => {
  const createProduct = useCreateProductMutation();
  
  const handleSubmit = (formData: CreateProductDto) => {
    createProduct.mutate(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={createProduct.isLoading}>
        {createProduct.isLoading ? 'Creating...' : 'Create Product'}
      </button>
    </form>
  );
};
```

## Conclusion

Following these best practices ensures:

1. Type safety across all API interactions
2. Consistent error handling
3. Easy adaptation to API changes
4. Clear separation of concerns
5. Maintainable and scalable codebase

Remember that the goal is to have a single source of truth for API contracts while maintaining a clean and consistent codebase architecture.
