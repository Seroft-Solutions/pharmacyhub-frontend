# Mobile Support

A core feature that provides mobile viewport detection, responsive rendering, and utilities for adapting UI to different screen sizes.

## Features

- ✅ SSR-safe viewport detection
- ✅ Zustand-powered state management (no React hooks)
- ✅ Responsive component wrappers
- ✅ Utility functions for checking device type
- ✅ Consistent breakpoint definitions

## Breakpoints

This feature uses the following breakpoints:

- Mobile: < 768px
- Tablet: 768px - 1024px 
- Desktop: >= 1024px

These align with Tailwind's breakpoints for consistency across the application.

## Usage

### Basic Viewport Detection

```tsx
import { useMobileStore, selectIsMobile } from '@/features/core/mobile-support';

const MyComponent = () => {
  const isMobile = useMobileStore(selectIsMobile);
  
  return (
    <div>
      {isMobile ? 'Mobile View' : 'Desktop View'}
    </div>
  );
};
```

### Using the MobileWrapper Component

```tsx
import { MobileWrapper } from '@/features/core/mobile-support';

const MyResponsiveComponent = () => {
  return (
    <MobileWrapper
      mobileChildren={<SimplifiedView />}
      desktopChildren={<FullFeaturedView />}
      mobileClassName="p-2"
      desktopClassName="p-6"
    >
      <FallbackView />
    </MobileWrapper>
  );
};
```

### Specialized Components

```tsx
import { MobileOnly, DesktopOnly } from '@/features/core/mobile-support';

const MyComponent = () => {
  return (
    <>
      <MobileOnly>
        <MobileNavigation />
      </MobileOnly>
      
      <DesktopOnly>
        <DesktopNavigation />
      </DesktopOnly>
    </>
  );
};
```

### Responsive Container

```tsx
import { ResponsiveContainer } from '@/features/core/mobile-support';

const ProductGrid = () => {
  return (
    <ResponsiveContainer
      className="grid gap-4"
      mobileClassName="grid-cols-1"
      tabletClassName="grid-cols-2"
      desktopClassName="grid-cols-4"
    >
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ResponsiveContainer>
  );
};
```

### Utility Functions

```tsx
import { isMobile, isPortrait } from '@/features/core/mobile-support';

const MyComponent = () => {
  const handleClick = () => {
    if (isMobile() && isPortrait()) {
      console.log('User is on mobile in portrait mode');
    }
  };
  
  return (
    <button onClick={handleClick}>
      Check Device
    </button>
  );
};
```

## Integration with TanStack Query

This feature doesn't directly depend on TanStack Query, but can be used to conditionally render query results:

```tsx
import { useQuery } from '@tanstack/react-query';
import { MobileWrapper } from '@/features/core/mobile-support';

const ProductDetails = ({ productId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId)
  });
  
  if (isLoading) return <Spinner />;
  
  return (
    <MobileWrapper
      mobileChildren={<MobileProductView product={data} />}
      desktopChildren={<DesktopProductView product={data} />}
    />
  );
};
```

## Benefits of this Approach

- **Centralized Detection**: Viewport detection happens in one place
- **Performance**: Uses Zustand for efficient state management
- **Consistency**: All features use the same breakpoints and detection logic
- **Flexibility**: Provides both component wrappers and direct state access
- **SSR-Compatible**: Works correctly in server-side rendering environments
