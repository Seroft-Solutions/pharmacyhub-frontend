# OpenAPI Example Implementation

This document provides a complete example implementation of OpenAPI integration in the PharmacyHub frontend project, demonstrating the workflow from API specification to feature implementation.

## Step 1: API Specification

Let's start with a sample OpenAPI specification for a `/products` endpoint:

```yaml
# product-api.yaml
openapi: 3.0.0
info:
  title: Product API
  version: 1.0.0
  description: API for managing pharmacy products
paths:
  /products:
    get:
      summary: Get all products
      operationId: getProducts
      parameters:
        - name: category
          in: query
          required: false
          schema:
            type: string
        - name: search
          in: query
          required: false
          schema:
            type: string
        - name: page
          in: query
          required: false
          schema:
            type: integer
            default: 0
        - name: size
          in: query
          required: false
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PagedProductsResponse'
        '400':
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
    post:
      summary: Create a new product
      operationId: createProduct
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateProductRequest'
      responses:
        '201':
          description: Product created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProductResponse'
        '400':
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '401':
          description: Unauthorized
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
  /products/{id}:
    get:
      summary: Get a product by ID
      operationId: getProductById
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProductResponse'
        '404':
          description: Product not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
    put:
      summary: Update a product
      operationId: updateProduct
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateProductRequest'
      responses:
        '200':
          description: Product updated
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ProductResponse'
        '400':
          description: Bad request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
        '404':
          description: Product not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
    delete:
      summary: Delete a product
      operationId: deleteProduct
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '204':
          description: Product deleted
        '404':
          description: Product not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'
components:
  schemas:
    ProductResponse:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        description:
          type: string
        category:
          type: string
        price:
          type: number
          format: float
        stock:
          type: integer
        manufacturer:
          type: string
        expiryDate:
          type: string
          format: date
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
      required:
        - id
        - name
        - price
    PagedProductsResponse:
      type: object
      properties:
        content:
          type: array
          items:
            $ref: '#/components/schemas/ProductResponse'
        page:
          type: integer
        size:
          type: integer
        totalElements:
          type: integer
        totalPages:
          type: integer
      required:
        - content
        - page
        - size
        - totalElements
        - totalPages
    CreateProductRequest:
      type: object
      properties:
        name:
          type: string
        description:
          type: string
        category:
          type: string
        price:
          type: number
          format: float
        stock:
          type: integer
        manufacturer:
          type: string
        expiryDate:
          type: string
          format: date
      required:
        - name
        - price
        - category
    UpdateProductRequest:
      type: object
      properties:
        name:
          type: string
        description:
          type: string
        category:
          type: string
        price:
          type: number
          format: float
        stock:
          type: integer
        manufacturer:
          type: string
        expiryDate:
          type: string
          format: date
    ErrorResponse:
      type: object
      properties:
        message:
          type: string
        code:
          type: string
        timestamp:
          type: string
          format: date-time
        path:
          type: string
      required:
        - message
```

## Step 2: Generate API Code

First, we'll set up the OpenAPI generator in package.json:

```json
{
  "scripts": {
    "generate-api": "openapi --input http://localhost:8080/api-docs --output ./src/core/api/generated --client axios",
    "generate-api:local": "openapi --input ./api-specs/product-api.yaml --output ./src/core/api/generated --client axios"
  }
}
```

Run the generation script:

```bash
npm run generate-api:local
```

This will generate the following files:

- `src/core/api/generated/index.ts`
- `src/core/api/generated/models/index.ts`
- `src/core/api/generated/models/CreateProductRequest.ts`
- `src/core/api/generated/models/ErrorResponse.ts`
- `src/core/api/generated/models/PagedProductsResponse.ts`
- `src/core/api/generated/models/ProductResponse.ts`
- `src/core/api/generated/models/UpdateProductRequest.ts`
- `src/core/api/generated/services/ProductsApi.ts`

## Step 3: Set Up TanStack Query Adapters

Create the adapter for TanStack Query:

```typescript
// src/core/api/adapters/queryAdapter.ts
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import type { AxiosResponse } from 'axios';

/**
 * Adapter to convert OpenAPI generated service methods to TanStack Query hooks
 */
export function createQueryHook<TResponse, TParams extends any[]>(
  apiMethod: (...params: TParams) => Promise<AxiosResponse<TResponse>>,
  getQueryKey: (...params: TParams) => unknown[]
) {
  return (
    ...params: TParams
  ) => (
    options?: Omit<UseQueryOptions<TResponse, Error>, 'queryKey' | 'queryFn'>
  ) => {
    return useQuery<TResponse, Error>({
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
 * Adapter to convert OpenAPI generated service methods to TanStack Query mutation hooks
 */
export function createMutationHook<TResponse, TVariables>(
  apiMethod: (variables: TVariables) => Promise<AxiosResponse<TResponse>>
) {
  return (
    options?: Omit<UseMutationOptions<TResponse, Error, TVariables>, 'mutationFn'>
  ) => {
    return useMutation<TResponse, Error, TVariables>({
      mutationFn: async (variables: TVariables) => {
        const response = await apiMethod(variables);
        return response.data;
      },
      ...options,
    });
  };
}

/**
 * Adapter for API methods with path parameters and request body
 */
export function createPathParamMutationHook<TResponse, TPathParam, TBody>(
  apiMethod: (pathParam: TPathParam, body: TBody) => Promise<AxiosResponse<TResponse>>
) {
  return (
    options?: Omit<UseMutationOptions<TResponse, Error, { pathParam: TPathParam; body: TBody }>, 'mutationFn'>
  ) => {
    return useMutation<TResponse, Error, { pathParam: TPathParam; body: TBody }>({
      mutationFn: async ({ pathParam, body }) => {
        const response = await apiMethod(pathParam, body);
        return response.data;
      },
      ...options,
    });
  };
}
```

## Step 4: Create Product API Hooks

Now, let's create the feature-specific API hooks:

```typescript
// src/features/products/api/productApi.ts
import { 
  ProductsApi, 
  CreateProductRequest, 
  UpdateProductRequest, 
  ProductResponse,
  PagedProductsResponse
} from '@/core/api/generated';
import { 
  createQueryHook, 
  createMutationHook,
  createPathParamMutationHook
} from '@/core/api/adapters/queryAdapter';
import { queryClient } from '@/core/api/queryClient';

// Create API instance
const productsApi = new ProductsApi();

// Query keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: { category?: string; search?: string; page?: number; size?: number }) => 
    [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};

// Query hooks
export const useProductsQuery = (params: { 
  category?: string; 
  search?: string; 
  page?: number; 
  size?: number 
} = {}) => {
  return createQueryHook<PagedProductsResponse, [params: any]>(
    productsApi.getProducts,
    (params) => productKeys.list(params)
  )(params)();
};

export const useProductQuery = (id: string) => {
  return createQueryHook<ProductResponse, [id: string]>(
    productsApi.getProductById,
    (id) => productKeys.detail(id)
  )(id)({
    enabled: !!id,
  });
};

// Mutation hooks
export const useCreateProductMutation = () => {
  return createMutationHook<ProductResponse, CreateProductRequest>(
    productsApi.createProduct
  )({
    onSuccess: () => {
      queryClient.invalidateQueries(productKeys.lists());
    },
  });
};

export const useUpdateProductMutation = () => {
  return createPathParamMutationHook<ProductResponse, string, UpdateProductRequest>(
    productsApi.updateProduct
  )({
    onSuccess: (_, { pathParam }) => {
      queryClient.invalidateQueries(productKeys.detail(pathParam));
      queryClient.invalidateQueries(productKeys.lists());
    },
  });
};

export const useDeleteProductMutation = () => {
  return createMutationHook<void, string>(
    productsApi.deleteProduct
  )({
    onSuccess: () => {
      queryClient.invalidateQueries(productKeys.lists());
    },
  });
};

// Type exports
export type { 
  ProductResponse,
  PagedProductsResponse,
  CreateProductRequest,
  UpdateProductRequest
};
```

## Step 5: Feature Implementation

Now let's use these API hooks in our feature components:

### Product List Component

```typescript
// src/features/products/components/organisms/ProductList.tsx
import React, { useState } from 'react';
import { useProductsQuery } from '../../api/productApi';
import { ProductCard } from '../molecules/ProductCard';
import { Pagination } from '@/core/ui/molecules/Pagination';
import { LoadingSpinner } from '@/core/ui/atoms/LoadingSpinner';
import { ErrorMessage } from '@/core/ui/atoms/ErrorMessage';
import { EmptyState } from '@/core/ui/molecules/EmptyState';

interface ProductListProps {
  category?: string;
  search?: string;
}

export const ProductList: React.FC<ProductListProps> = ({ 
  category,
  search
}) => {
  const [page, setPage] = useState(0);
  const pageSize = 12;
  
  const { 
    data, 
    isLoading, 
    error 
  } = useProductsQuery({ 
    category, 
    search, 
    page, 
    size: pageSize 
  });
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorMessage message={error.message} />;
  }
  
  if (!data || data.content.length === 0) {
    return (
      <EmptyState 
        title="No products found" 
        description="Try adjusting your filters or search terms."
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.content.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {data.totalPages > 1 && (
        <Pagination
          currentPage={data.page}
          totalPages={data.totalPages}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};
```

### Product Detail Component

```typescript
// src/features/products/components/organisms/ProductDetail.tsx
import React from 'react';
import { useProductQuery } from '../../api/productApi';
import { LoadingSpinner } from '@/core/ui/atoms/LoadingSpinner';
import { ErrorMessage } from '@/core/ui/atoms/ErrorMessage';
import { Button } from '@/core/ui/atoms/Button';
import { formatCurrency, formatDate } from '@/core/utils/formatters';

interface ProductDetailProps {
  id: string;
  onEdit: (id: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ id, onEdit }) => {
  const { data: product, isLoading, error } = useProductQuery(id);
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorMessage message={error.message} />;
  }
  
  if (!product) {
    return <ErrorMessage message="Product not found" />;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.category}</p>
        </div>
        <Button
          variant="secondary"
          onClick={() => onEdit(product.id)}
        >
          Edit
        </Button>
      </div>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-lg font-semibold">Details</h3>
          <div className="mt-2 space-y-2">
            <div>
              <span className="font-medium">Price:</span> {formatCurrency(product.price)}
            </div>
            <div>
              <span className="font-medium">Stock:</span> {product.stock} units
            </div>
            <div>
              <span className="font-medium">Manufacturer:</span> {product.manufacturer}
            </div>
            <div>
              <span className="font-medium">Expiry Date:</span> {formatDate(product.expiryDate)}
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold">Description</h3>
          <p className="mt-2 text-gray-700">{product.description}</p>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <div>Created: {formatDate(product.createdAt, true)}</div>
        <div>Last Updated: {formatDate(product.updatedAt, true)}</div>
      </div>
    </div>
  );
};
```

### Product Form Component

```typescript
// src/features/products/components/organisms/ProductForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateProductMutation, useUpdateProductMutation, ProductResponse } from '../../api/productApi';
import { Button } from '@/core/ui/atoms/Button';
import { TextInput } from '@/core/ui/molecules/TextInput';
import { TextareaInput } from '@/core/ui/molecules/TextareaInput';
import { SelectInput } from '@/core/ui/molecules/SelectInput';
import { NumberInput } from '@/core/ui/molecules/NumberInput';
import { DateInput } from '@/core/ui/molecules/DateInput';

// Schema validation using zod
const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  stock: z.number().int().min(0, 'Stock cannot be negative'),
  manufacturer: z.string().optional(),
  expiryDate: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: ProductResponse;
  onSuccess: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ 
  product,
  onSuccess,
}) => {
  const isEditMode = !!product;
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      manufacturer: product.manufacturer,
      expiryDate: product.expiryDate,
    } : {
      name: '',
      description: '',
      category: '',
      price: 0,
      stock: 0,
      manufacturer: '',
      expiryDate: '',
    }
  });
  
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  
  const isLoading = createMutation.isPending || updateMutation.isPending;
  
  const onSubmit = (data: ProductFormValues) => {
    if (isEditMode && product) {
      updateMutation.mutate({
        pathParam: product.id,
        body: data
      }, {
        onSuccess: () => {
          onSuccess();
        }
      });
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          reset();
          onSuccess();
        }
      });
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <TextInput
        label="Product Name"
        {...register('name')}
        error={errors.name?.message}
      />
      
      <TextareaInput
        label="Description"
        {...register('description')}
        error={errors.description?.message}
      />
      
      <SelectInput
        label="Category"
        {...register('category')}
        error={errors.category?.message}
        options={[
          { value: 'medications', label: 'Medications' },
          { value: 'supplements', label: 'Supplements' },
          { value: 'equipment', label: 'Medical Equipment' },
          { value: 'skincare', label: 'Skincare' },
        ]}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NumberInput
          label="Price"
          {...register('price', { valueAsNumber: true })}
          error={errors.price?.message}
          min={0}
          step={0.01}
        />
        
        <NumberInput
          label="Stock"
          {...register('stock', { valueAsNumber: true })}
          error={errors.stock?.message}
          min={0}
          step={1}
        />
      </div>
      
      <TextInput
        label="Manufacturer"
        {...register('manufacturer')}
        error={errors.manufacturer?.message}
      />
      
      <DateInput
        label="Expiry Date"
        {...register('expiryDate')}
        error={errors.expiryDate?.message}
      />
      
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="secondary"
          onClick={() => reset()}
          disabled={isLoading}
        >
          Reset
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
};
```

## Step 6: Page Component

Finally, let's implement a page component that uses these organism components:

```typescript
// src/features/products/components/templates/ProductsTemplate.tsx
import React, { useState } from 'react';
import { ProductList } from '../organisms/ProductList';
import { ProductDetail } from '../organisms/ProductDetail';
import { ProductForm } from '../organisms/ProductForm';
import { Modal } from '@/core/ui/molecules/Modal';
import { Button } from '@/core/ui/atoms/Button';
import { SearchInput } from '@/core/ui/molecules/SearchInput';
import { useDeleteProductMutation } from '../../api/productApi';

export const ProductsTemplate: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const deleteMutation = useDeleteProductMutation();
  
  const handleSearch = (value: string) => {
    setSearch(value);
  };
  
  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };
  
  const handleViewProduct = (id: string) => {
    setSelectedProductId(id);
  };
  
  const handleEditProduct = (id: string) => {
    setSelectedProductId(id);
    setIsEditModalOpen(true);
  };
  
  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          Add New Product
        </Button>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="md:w-1/2">
          <SearchInput
            placeholder="Search products..."
            value={search}
            onChange={handleSearch}
          />
        </div>
        
        <div className="md:w-1/2">
          <select
            className="w-full p-2 border rounded"
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="medications">Medications</option>
            <option value="supplements">Supplements</option>
            <option value="equipment">Medical Equipment</option>
            <option value="skincare">Skincare</option>
          </select>
        </div>
      </div>
      
      <ProductList
        category={category || undefined}
        search={search || undefined}
      />
      
      {/* Create Product Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModals}
        title="Create New Product"
      >
        <ProductForm
          onSuccess={handleCloseModals}
        />
      </Modal>
      
      {/* Edit Product Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        title="Edit Product"
      >
        {selectedProductId && (
          <ProductForm
            product={{ id: selectedProductId } as any}
            onSuccess={handleCloseModals}
          />
        )}
      </Modal>
    </div>
  );
};
```

## Step 7: Page Component Integration

Finally, create the Next.js page component:

```typescript
// src/pages/products/index.tsx
import React from 'react';
import { NextPage } from 'next';
import { ProductsTemplate } from '@/features/products/components/templates/ProductsTemplate';
import { MainLayout } from '@/core/ui/layout/MainLayout';

const ProductsPage: NextPage = () => {
  return (
    <MainLayout>
      <ProductsTemplate />
    </MainLayout>
  );
};

export default ProductsPage;
```

## Conclusion

This example demonstrates the complete flow from OpenAPI specification to feature implementation:

1. The OpenAPI spec defines the API contract
2. Generated types and services ensure type safety
3. TanStack Query adapters provide consistent data fetching patterns
4. Feature components use the generated types and API hooks
5. The application maintains a single source of truth for API contracts

This approach has several benefits:

- **Type Safety**: The frontend is guaranteed to match the backend API contract
- **Consistency**: All API calls follow the same pattern
- **Maintainability**: API changes are immediately reflected in the frontend
- **Developer Experience**: Autocomplete and type checking make development easier
- **Testability**: Clear separation of concerns makes testing simpler

When the backend API changes, simply regenerate the API code, and TypeScript will highlight any places in your codebase that need updates.
