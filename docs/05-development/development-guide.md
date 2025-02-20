# PharmacyHub Development Guide

## Development Standards

### 1. TypeScript Configuration

```typescript
// tsconfig.json key settings
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "module": "ESNext",
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### 2. State Management Patterns

#### Global State (Zustand)

```typescript
// /src/features/licensing/model/store.ts
import create from 'zustand';

interface LicensingStore {
  licenses: License[];
  setLicenses: (licenses: License[]) => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useLicensingStore = create<LicensingStore>((set) => ({
  licenses: [],
  setLicenses: (licenses) => set({ licenses }),
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),
}));
```

#### Server State (React Query)

```typescript
// /src/features/licensing/api/queries.ts
import { useQuery } from '@tanstack/react-query';

export const useLicenses = () => {
  return useQuery({
    queryKey: ['licenses'],
    queryFn: fetchLicenses,
  });
};
```

### 3. Component Patterns

#### Feature Components

```typescript
// /src/features/licensing/ui/pharmacist/PharmacistList.tsx
import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/shared/ui/data-table';
import { usePharmacists } from '../api/queries';

export const PharmacistList = () => {
  const { data, isLoading } = usePharmacists();

  return (
    <DataTable
      data={data}
      columns={pharmacistColumns}
      isLoading={isLoading}
    />
  );
};
```

#### Shared Components

```typescript
// /src/shared/ui/form/FormField.tsx
import { FC } from 'react';
import { Label } from '@/shared/ui/label';
import { Input } from '@/shared/ui/input';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  error?: string;
}

export const FormField: FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  error,
}) => (
  <div className="space-y-2">
    <Label htmlFor={name}>{label}</Label>
    <Input type={type} id={name} name={name} />
    {error && <p className="text-red-500 text-sm">{error}</p>}
  </div>
);
```

### 4. API Integration

#### Service Layer Pattern

```typescript
// /src/shared/api/service.ts
export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.getToken()}`,
    };
  }
}
```

### 5. Route Protection

```typescript
// /src/app/(licensing)/layout.tsx
import { withAuth } from '@/shared/auth/withAuth';
import { LicensingLayout } from '@/features/licensing/ui/layout';

export default withAuth(LicensingLayout, ['admin', 'pharmacist']);
```

### 6. Error Handling

```typescript
// /src/shared/lib/error-handling.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number
  ) {
    super(message);
  }
}

export const handleApiError = (error: unknown) => {
  if (error instanceof AppError) {
    // Handle known application errors
    notify.error(error.message);
  } else {
    // Handle unexpected errors
    notify.error('An unexpected error occurred');
    console.error(error);
  }
};
```

## Best Practices

### 1. Component Organization

- Keep components small and focused
- Use composition over inheritance
- Follow Single Responsibility Principle
- Implement proper TypeScript types

### 2. State Management

- Use local state for UI-only state
- Use Zustand for global application state
- Use React Query for server state
- Implement proper loading and error states

### 3. Performance

- Implement proper memoization
- Use React.lazy for code splitting
- Optimize re-renders
- Follow React Query best practices

### 4. Testing

```typescript
// /src/features/licensing/ui/__tests__/PharmacistList.test.tsx
import { render, screen } from '@testing-library/react';
import { PharmacistList } from '../PharmacistList';

describe('PharmacistList', () => {
  it('renders list of pharmacists', async () => {
    render(<PharmacistList />);
    expect(await screen.findByRole('table')).toBeInTheDocument();
  });
});
```

### 5. Documentation

- Document complex business logic
- Add JSDoc comments for components
- Keep README files updated
- Document API integrations

### 6. Code Style

- Follow ESLint rules
- Use Prettier for formatting
- Follow naming conventions
- Write meaningful commit messages