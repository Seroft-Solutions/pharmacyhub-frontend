# Performance Optimization Guide

## Performance Monitoring

### 1. Web Vitals Tracking

```typescript
// src/lib/web-vitals.ts
import { onCLS, onFID, onLCP, onTTFB } from 'web-vitals';

export function reportWebVitals(metric: any) {
  // Send to analytics service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to Google Analytics
    window.gtag?.('event', metric.name, {
      value: Math.round(metric.value * 1000),
      event_category: 'Web Vitals',
      event_label: metric.id,
      non_interaction: true,
    });
  }
}

export function initWebVitals() {
  onCLS(reportWebVitals);
  onFID(reportWebVitals);
  onLCP(reportWebVitals);
  onTTFB(reportWebVitals);
}
```

### 2. Custom Performance Monitoring

```typescript
// src/lib/performance-monitoring.ts
import { logger } from '@/lib/logger';

export class PerformanceMonitor {
  private static marks: Record<string, number> = {};

  static startMark(name: string) {
    this.marks[name] = performance.now();
  }

  static endMark(name: string) {
    const startTime = this.marks[name];
    if (startTime) {
      const duration = performance.now() - startTime;
      logger.info(`Performance: ${name} took ${duration}ms`);
      delete this.marks[name];
      return duration;
    }
    return 0;
  }

  static measureApiCall(name: string, promise: Promise<any>) {
    this.startMark(name);
    return promise.finally(() => this.endMark(name));
  }
}
```

### 3. Error Tracking

```typescript
// src/lib/error-tracking.ts
import { captureException } from '@/lib/logger';

export class ErrorTracker {
  static track(error: Error, context?: Record<string, any>) {
    captureException(error, {
      context,
      tags: {
        feature: context?.feature,
        environment: process.env.NODE_ENV
      }
    });
  }

  static async trackPromise<T>(
    promise: Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      this.track(error as Error, context);
      throw error;
    }
  }
}
```

## Frontend Optimization Techniques

### 1. React Component Optimization

```typescript
// src/components/exam/QuestionList.tsx
import { useCallback, useMemo } from 'react';

export const QuestionList: React.FC<QuestionListProps> = ({ questions, onSelect }) => {
  // Memoize expensive computations
  const sortedQuestions = useMemo(() => 
    questions.sort((a, b) => a.order - b.order),
    [questions]
  );

  // Memoize callback functions
  const handleSelect = useCallback((id: string) => {
    onSelect(id);
  }, [onSelect]);

  return (
    <div>
      {sortedQuestions.map(question => (
        <QuestionCard
          key={question.id}
          question={question}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
};
```

### 2. Virtual List Implementation

```typescript
// src/components/common/VirtualList.tsx
import { useVirtualizer } from '@tanstack/react-virtual';

export const VirtualList = <T,>({
  items,
  renderItem,
  itemHeight = 50
}: VirtualListProps<T>) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight,
  });

  return (
    <div ref={parentRef} style={{ height: '400px', overflow: 'auto' }}>
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              transform: `translateY(${virtualItem.start}px)`,
              width: '100%',
            }}
          >
            {renderItem(items[virtualItem.index])}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 3. Image Lazy Loading

```typescript
// src/components/common/LazyImage.tsx
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setError(true);
  }, [src]);

  if (error) {
    return <div className="image-error">Failed to load image</div>;
  }

  return (
    <>
      {!isLoaded && <div className="image-placeholder" />}
      <img
        src={src}
        alt={alt}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        {...props}
      />
    </>
  );
};
```

## Resource Loading Optimization

### 1. Script Loading

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    optimizeFonts: true,
    optimizeImages: true,
    scriptLoader: {
      strategy: 'worker'
    }
  }
};

export default nextConfig;
```

### 2. Font Loading

```typescript
// src/app/layout.tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
```

### 3. Asset Preloading

```typescript
// src/components/common/AssetPreloader.tsx
export const AssetPreloader: React.FC = () => {
  return (
    <head>
      <link
        rel="preload"
        href="/fonts/custom-font.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      <link
        rel="preload"
        href="/critical-image.jpg"
        as="image"
      />
    </head>
  );
};
```

## Performance Testing

### 1. Lighthouse CI Configuration

```yaml
# lighthouserc.js
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: 'npm run start',
      url: ['http://localhost:3000']
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }]
      }
    },
    upload: {
      target: 'temporary-public-storage'
    }
  }
};
```

### 2. Performance Testing Scripts

```json
// package.json
{
  "scripts": {
    "test:performance": "lighthouse http://localhost:3000 --output-path=./performance-report.html",
    "test:load": "k6 run load-test.js",
    "analyze:bundle": "ANALYZE=true next build"
  }
}
```

## Performance Best Practices

### 1. Code Guidelines
- Use code splitting for large components
- Implement proper memoization
- Optimize images and assets
- Minimize bundle size
- Use proper caching strategies

### 2. Monitoring Guidelines
- Track Core Web Vitals
- Monitor API performance
- Track error rates
- Monitor bundle sizes
- Track user interactions

### 3. Optimization Checklist
- Image optimization
- Code splitting
- Bundle optimization
- Caching strategy
- Performance monitoring
- Error tracking
- Resource loading
- Component optimization