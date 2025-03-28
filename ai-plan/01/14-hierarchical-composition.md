# Task 14: Apply Hierarchical Composition

## Description
Apply atomic design principles to component hierarchies across the core modules, organizing components into atoms, molecules, organisms, templates, and pages where appropriate.

## Implementation Steps

1. **Component Hierarchy Audit**
   - Review the current component structure
   - Identify components that don't follow atomic design principles
   - Map existing components to atomic design levels
   - Create a list of components that need reorganization

2. **Atom Components Identification and Refactoring**
   - Identify the smallest, most basic UI elements
   - Move or refactor these into atomic components
   - Ensure atoms are highly reusable and focused
   - Move shared atoms to the core/ui/atoms directory

3. **Molecule Components Identification and Refactoring**
   - Identify combinations of atoms that form coherent UI elements
   - Refactor these into molecule components
   - Ensure molecules have clear composition patterns
   - Organize feature-specific molecules appropriately

4. **Organism Components Identification and Refactoring**
   - Identify collections of molecules forming complete UI sections
   - Refactor these into organism components
   - Ensure organisms follow clear composition patterns
   - Organize feature-specific organisms appropriately

5. **Template and Page Components Identification and Refactoring**
   - Identify layout patterns and page structures
   - Refactor these into template components
   - Ensure clear separation of layout from content
   - Ensure pages properly compose templates with data

6. **Documentation Update**
   - Update component documentation to reflect atomic design levels
   - Create examples of atomic design application
   - Update README.md files

## Atomic Design Implementation Examples

### Atom Component Example

```typescript
// core/ui/atoms/Button.tsx
import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

// Responsibility: Basic button UI element with various styles
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = '',
  ...rest
}) => {
  // Base classes
  let buttonClasses = 'inline-flex items-center justify-center rounded font-medium';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent hover:bg-gray-100',
  };
  
  // Disabled state
  const disabledClasses = 'opacity-50 cursor-not-allowed';
  
  buttonClasses += ` ${sizeClasses[size]} ${variantClasses[variant]}`;
  buttonClasses += disabled ? ` ${disabledClasses}` : '';
  buttonClasses += ` ${className}`;
  
  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading && (
        <span className="mr-2">
          {/* Loading spinner */}
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </span>
      )}
      
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};
```

### Molecule Component Example

```typescript
// features/products/components/molecules/ProductCard.tsx
import React from 'react';
import { Card } from '@/core/ui/atoms/Card';
import { Button } from '@/core/ui/atoms/Button';
import { Badge } from '@/core/ui/atoms/Badge';
import { formatCurrency } from '@/core/utils/formatters';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    category: string;
    imageUrl: string;
    inStock: boolean;
  };
  onAddToCart: (productId: string) => void;
  onViewDetails: (productId: string) => void;
}

// Responsibility: Display product information as a card with actions
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onViewDetails,
}) => {
  const handleAddToCart = () => {
    onAddToCart(product.id);
  };
  
  const handleViewDetails = () => {
    onViewDetails(product.id);
  };
  
  return (
    <Card className="product-card">
      <div className="relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        <Badge
          variant={product.inStock ? 'success' : 'danger'}
          className="absolute top-2 right-2"
        >
          {product.inStock ? 'In Stock' : 'Out of Stock'}
        </Badge>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600">{product.category}</p>
        <p className="text-xl font-bold mt-2">
          {formatCurrency(product.price)}
        </p>
        
        <div className="mt-4 flex justify-between">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleViewDetails}
          >
            Details
          </Button>
          
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
};
```

### Organism Component Example

```typescript
// features/products/components/organisms/ProductGrid.tsx
import React from 'react';
import { ProductCard } from '../molecules/ProductCard';
import { EmptyState } from '@/core/ui/molecules/EmptyState';
import { Pagination } from '@/core/ui/molecules/Pagination';

interface ProductGridProps {
  products: Array<{
    id: string;
    name: string;
    price: number;
    category: string;
    imageUrl: string;
    inStock: boolean;
  }>;
  loading: boolean;
  error: Error | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onAddToCart: (productId: string) => void;
  onViewDetails: (productId: string) => void;
}

// Responsibility: Organize product cards in a grid with pagination
export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
  error,
  page,
  totalPages,
  onPageChange,
  onAddToCart,
  onViewDetails,
}) => {
  if (error) {
    return (
      <EmptyState
        title="Error loading products"
        description={error.message}
        icon="error"
      />
    );
  }
  
  if (loading) {
    return <div className="loading-grid">Loading products...</div>;
  }
  
  if (products.length === 0) {
    return (
      <EmptyState
        title="No products found"
        description="Try adjusting your filters or search terms."
        icon="empty"
      />
    );
  }
  
  return (
    <div className="product-grid-container">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};
```

### Template Component Example

```typescript
// features/products/components/templates/ProductListTemplate.tsx
import React from 'react';
import { ProductFilters } from '../organisms/ProductFilters';
import { ProductGrid } from '../organisms/ProductGrid';
import { ProductSorting } from '../molecules/ProductSorting';

interface ProductListTemplateProps {
  products: Array<{
    id: string;
    name: string;
    price: number;
    category: string;
    imageUrl: string;
    inStock: boolean;
  }>;
  loading: boolean;
  error: Error | null;
  page: number;
  totalPages: number;
  filters: any;
  sortOption: string;
  onPageChange: (page: number) => void;
  onFilterChange: (filters: any) => void;
  onSortChange: (sortOption: string) => void;
  onAddToCart: (productId: string) => void;
  onViewDetails: (productId: string) => void;
}

// Responsibility: Define the layout for the product listing page
export const ProductListTemplate: React.FC<ProductListTemplateProps> = ({
  products,
  loading,
  error,
  page,
  totalPages,
  filters,
  sortOption,
  onPageChange,
  onFilterChange,
  onSortChange,
  onAddToCart,
  onViewDetails,
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Products</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
          <ProductFilters
            filters={filters}
            onChange={onFilterChange}
          />
        </div>
        
        <div className="lg:w-3/4">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600">
                Showing {products.length} products
              </p>
            </div>
            
            <ProductSorting
              value={sortOption}
              onChange={onSortChange}
            />
          </div>
          
          <ProductGrid
            products={products}
            loading={loading}
            error={error}
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            onAddToCart={onAddToCart}
            onViewDetails={onViewDetails}
          />
        </div>
      </div>
    </div>
  );
};
```

## Verification Criteria
- Components properly organized according to atomic design principles
- Clear hierarchy of components
- Proper composition patterns used
- Components have appropriate responsibilities for their level
- Documentation clearly reflects atomic design organization
- Components follow size limitations and SRP
- Test coverage maintained or improved

## Time Estimate
Approximately 3-4 days

## Dependencies
- Task 12: Apply Component Size Limitations
- Task 13: Apply Single Responsibility Principle

## Risks
- May require significant refactoring of component relationships
- May require updates to many imports across the codebase
- May affect component testing strategy
