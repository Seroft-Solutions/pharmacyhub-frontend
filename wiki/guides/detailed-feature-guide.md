# Comprehensive Feature Implementation Guide

## Tech Stack Overview

### Core Technologies
- Next.js 15 (App Router)
- TypeScript 5.x
- React 19.x
- Zustand (State Management)
- React Query (Server State)
- shadcn/ui (Component Library)
- Tailwind CSS (Styling)

### Testing Stack
- Jest
- React Testing Library
- Cypress (E2E)
- MSW (API Mocking)

### Development Tools
- ESLint
- Prettier
- Husky (Git Hooks)
- Docker
- Keycloak (Auth)

## Feature-Sliced Design Structure

### Base Directory Structure
```
src/
├── features/          # Feature modules
├── entities/          # Business entities
├── shared/           # Shared code
└── widgets/          # Composite components
```

### Feature Module Structure
```
feature-name/
├── api/              # API layer
│   ├── endpoints.ts
│   ├── queries.ts
│   ├── mutations.ts
│   └── types.ts
├── model/           # Domain model
│   ├── types.ts
│   ├── store.ts
│   └── constants.ts
├── ui/              # UI components
│   ├── components/
│   │   └── [ComponentName]/
│   │       ├── index.tsx
│   │       ├── styles.ts
│   │       └── types.ts
│   └── pages/
├── lib/             # Feature-specific utilities
│   ├── utils.ts
│   └── helpers.ts
└── index.ts         # Public API
```

## Feature Implementation Steps

### 1. Domain Analysis
```typescript
// src/entities/[domain]/types.ts
export interface DomainEntity {
  id: string;
  // Core domain properties
}

// Domain invariants and business rules
export class DomainModel {
  private entity: DomainEntity;

  constructor(data: DomainEntity) {
    this.validateEntity(data);
    this.entity = data;
  }

  private validateEntity(data: DomainEntity) {
    // Business rule validations
  }

  // Domain methods
}
```

### 2. Feature Setup

#### a. Feature Configuration
```typescript
// src/features/[feature]/config.ts
export const FEATURE_CONFIG = {
  name: 'featureName',
  routes: {
    base: '/feature',
    detail: '/feature/:id',
  },
  permissions: {
    read: 'feature:read',
    write: 'feature:write',
  },
};
```

#### b. API Types
```typescript
// src/features/[feature]/api/types.ts
import { DomainEntity } from '@/entities/domain';

export interface FeatureDTO {
  // DTO properties
}

export interface FeatureRequest {
  // Request properties
}

export interface FeatureResponse {
  // Response properties
}

// Type transformers
export const toEntity = (dto: FeatureDTO): DomainEntity => ({
  // Transform DTO to domain entity
});

export const toDTO = (entity: DomainEntity): FeatureDTO => ({
  // Transform domain entity to DTO
});
```

### 3. API Layer Implementation

#### a. API Service
```typescript
// src/features/[feature]/api/endpoints.ts
import { apiClient } from '@/shared/api';
import type { FeatureRequest, FeatureResponse } from './types';

export const featureApi = {
  getAll: async (): Promise<FeatureResponse[]> => {
    const response = await apiClient.get('/feature');
    return response.data;
  },

  getById: async (id: string): Promise<FeatureResponse> => {
    const response = await apiClient.get(`/feature/${id}`);
    return response.data;
  },

  create: async (data: FeatureRequest): Promise<FeatureResponse> => {
    const response = await apiClient.post('/feature', data);
    return response.data;
  },
};
```

#### b. React Query Implementation
```typescript
// src/features/[feature]/api/queries.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { featureApi } from './endpoints';
import { FEATURE_CONFIG } from '../config';

export const useFeatures = () => {
  return useQuery({
    queryKey: [FEATURE_CONFIG.name, 'list'],
    queryFn: featureApi.getAll,
  });
};

export const useFeature = (id: string) => {
  return useQuery({
    queryKey: [FEATURE_CONFIG.name, id],
    queryFn: () => featureApi.getById(id),
  });
};

export const useCreateFeature = () => {
  return useMutation({
    mutationFn: featureApi.create,
    onSuccess: () => {
      // Handle success
    },
  });
};
```

### 4. State Management

#### a. Store Implementation
```typescript
// src/features/[feature]/model/store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { DomainEntity } from '@/entities/domain';

interface FeatureState {
  entities: DomainEntity[];
  selected: string | null;
  filters: Record<string, unknown>;
  setEntities: (entities: DomainEntity[]) => void;
  setSelected: (id: string | null) => void;
  setFilters: (filters: Record<string, unknown>) => void;
}

export const useFeatureStore = create<FeatureState>()(
  devtools(
    (set) => ({
      entities: [],
      selected: null,
      filters: {},
      setEntities: (entities) => set({ entities }),
      setSelected: (id) => set({ selected: id }),
      setFilters: (filters) => set({ filters }),
    }),
    {
      name: 'FeatureStore',
    }
  )
);
```

#### b. Selectors
```typescript
// src/features/[feature]/model/selectors.ts
import { useFeatureStore } from './store';

export const useSelectedEntity = () => {
  const [entities, selected] = useFeatureStore(
    (state) => [state.entities, state.selected]
  );
  return entities.find((entity) => entity.id === selected);
};

export const useFilteredEntities = () => {
  const [entities, filters] = useFeatureStore(
    (state) => [state.entities, state.filters]
  );
  return entities.filter((entity) => {
    // Apply filters
  });
};
```

### 5. UI Components

#### a. Base Component Template
```typescript
// src/features/[feature]/ui/components/FeatureComponent/index.tsx
import { FC } from 'react';
import { useFeatures } from '../../../api/queries';
import { useFeatureStore } from '../../../model/store';
import styles from './styles';
import type { FeatureComponentProps } from './types';

export const FeatureComponent: FC<FeatureComponentProps> = ({
  // Props
}) => {
  const { data, isLoading } = useFeatures();
  const setEntities = useFeatureStore((state) => state.setEntities);

  // Component logic

  return (
    <div className={styles.root}>
      {/* Component JSX */}
    </div>
  );
};
```

#### b. Form Implementation
```typescript
// src/features/[feature]/ui/components/FeatureForm/index.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { schema } from './schema';
import type { FeatureFormData } from './types';

export const FeatureForm: FC<FeatureFormProps> = ({
  onSubmit,
}) => {
  const form = useForm<FeatureFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      // Default values
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        {/* Form fields */}
      </form>
    </Form>
  );
};
```

### 6. Testing Implementation

#### a. Unit Tests
```typescript
// src/features/[feature]/__tests__/unit/FeatureComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { FeatureComponent } from '../../ui/components/FeatureComponent';

describe('FeatureComponent', () => {
  it('renders correctly', () => {
    render(<FeatureComponent />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  // More test cases
});
```

#### b. Integration Tests
```typescript
// src/features/[feature]/__tests__/integration/FeatureFlow.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FeatureFlow } from '../../ui/components/FeatureFlow';

describe('FeatureFlow', () => {
  it('completes the feature flow', async () => {
    render(<FeatureFlow />);
    
    // Test complete feature flow
    await userEvent.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(screen.getByText('Success')).toBeInTheDocument();
    });
  });
});
```

### 7. Error Handling

```typescript
// src/features/[feature]/lib/errors.ts
export class FeatureError extends Error {
  constructor(
    message: string,
    public code: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'FeatureError';
  }
}

// Error handler
export const handleFeatureError = (error: unknown) => {
  if (error instanceof FeatureError) {
    // Handle specific feature errors
  }
  // Handle other errors
};
```

### 8. Performance Optimization

```typescript
// src/features/[feature]/ui/components/FeatureList/index.tsx
import { useVirtualizer } from '@tanstack/react-virtual';

export const FeatureList: FC<FeatureListProps> = ({
  items,
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  });

  return (
    <div ref={parentRef} className="h-[500px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
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
            }}
          >
            {/* Item content */}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 9. Security Implementation

```typescript
// src/features/[feature]/lib/security.ts
import { Permission } from '@/shared/types';

export const checkFeaturePermission = (
  requiredPermission: Permission,
  userPermissions: Permission[]
): boolean => {
  // Check permissions
};

// Permission guard component
export const FeaturePermissionGuard: FC<{
  permission: Permission;
  children: ReactNode;
}> = ({ permission, children }) => {
  const hasPermission = usePermission(permission);
  
  if (!hasPermission) {
    return <Unauthorized />;
  }
  
  return <>{children}</>;
};
```

### 10. Documentation

```typescript
/**
 * Feature documentation should include:
 * 1. Overview
 * 2. Technical architecture
 * 3. Domain model
 * 4. API endpoints
 * 5. Component usage
 * 6. State management
 * 7. Error handling
 * 8. Security
 * 9. Performance considerations
 * 10. Testing strategy
 */
```

### 11. Deployment Considerations

```yaml
# Feature deployment checklist:
- [ ] Feature flag configuration
- [ ] Environment variables
- [ ] API endpoints configuration
- [ ] Database migrations
- [ ] Cache invalidation
- [ ] Monitoring setup
- [ ] Security checks
- [ ] Performance metrics
- [ ] Documentation updates
- [ ] User analytics setup
```

This guide provides a comprehensive approach to feature implementation following FSD and DDD patterns, with our specific tech stack. Would you like me to:

1. Add more specific examples for certain types of features?
2. Include more detailed testing scenarios?
3. Add more security implementations?
4. Expand on any particular section?