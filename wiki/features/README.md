# Features & Components

## Core Features

### 1. Authentication Module
Location: `src/features/auth/`

#### Components
- **LoginForm** (`src/features/auth/ui/login/LoginForm.tsx`)
  - Handles user authentication
  - Implements form validation
  - Manages authentication state

- **RegisterForm** (`src/features/auth/ui/register/RegisterForm.tsx`)
  - User registration flow
  - Email verification
  - Form validation

- **Password Recovery** (`src/features/auth/ui/password-recovery/`)
  - Password reset flow
  - Security verification
  - Email notifications

#### Authentication Flow
```typescript
// src/features/auth/api/authService.ts
export const authService = {
  login: async (credentials) => {
    // Login implementation
  },
  register: async (userData) => {
    // Registration implementation
  },
  resetPassword: async (email) => {
    // Password reset implementation
  }
};
```

### 2. Exam Management
Location: `src/features/exam/`

#### Components
- **ExamLayout** (`src/components/exam/ExamLayout.tsx`)
  - Exam interface structure
  - Navigation controls
  - Timer integration

- **QuestionCard** (`src/components/exam/QuestionCard.tsx`)
  - Question display
  - Answer selection
  - Validation feedback

#### Exam State Management
```typescript
// src/features/exam/model/store.ts
interface ExamState {
  currentQuestion: number;
  answers: Record<number, string>;
  timeRemaining: number;
  isSubmitted: boolean;
}

const useExamStore = create<ExamState>((set) => ({
  // Exam state implementation
}));
```

### 3. Licensing Management
Location: `src/features/licensing/`

#### Components

##### Registration Forms
```typescript
// src/features/licensing/ui/forms/
- PharmacistForm
- PharmacyManagerForm
- ProprietorForm
- SalesmanForm
```

##### List Components
```typescript
// src/features/licensing/ui/
- PharmacistList
- PharmacyManagerList
- ProprietorList
- SalesmanList
```

#### Licensing Models
```typescript
// src/features/licensing/model/types.ts
interface LicenseBase {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submissionDate: string;
  expiryDate: string;
}

interface PharmacistLicense extends LicenseBase {
  // Pharmacist-specific fields
}

interface PharmacyManagerLicense extends LicenseBase {
  // Manager-specific fields
}
```

## UI Component Library

### 1. Form Components
Location: `src/components/ui/`

#### Input Component
```typescript
// src/components/ui/input.tsx
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input: React.FC<InputProps> = ({
  error,
  label,
  ...props
}) => {
  // Input implementation
};
```

#### Select Component
```typescript
// src/components/ui/select.tsx
export interface SelectProps {
  options: Array<{ value: string; label: string }>;
  value: string;
  onChange: (value: string) => void;
}
```

### 2. Layout Components

#### Responsive Container
```typescript
// src/shared/ui/layouts/responsive-container.tsx
export const ResponsiveContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  // Responsive container implementation
};
```

#### Sidebar Navigation
```typescript
// src/components/dashboard/Sidebar.tsx
export const Sidebar = () => {
  // Navigation implementation with role-based menu items
};
```

### 3. Feedback Components

#### Toast Notifications
```typescript
// src/components/ui/toast.tsx
export const useToast = () => {
  const toast = (message: string, type: 'success' | 'error' | 'info') => {
    // Toast implementation
  };
  return toast;
};
```

#### Loading States
```typescript
// src/components/ui/loading-spinner.tsx
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ size = 'md', className }) => {
  // Loading spinner implementation
};
```

## Feature Integration

### 1. API Integration
Location: `src/shared/api/`

```typescript
// src/shared/api/apiClient.ts
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  // Request interceptor implementation
  return config;
});
```

### 2. State Management

#### Global Store
```typescript
// src/store/index.ts
interface GlobalState {
  theme: 'light' | 'dark';
  language: string;
  notifications: Notification[];
}

export const useGlobalStore = create<GlobalState>((set) => ({
  // Global state implementation
}));
```

#### Feature-Specific Stores
```typescript
// Example: src/features/exam/store/examStore.ts
interface ExamState {
  currentExam: Exam | null;
  answers: Answer[];
  timeRemaining: number;
}

export const useExamStore = create<ExamState>((set) => ({
  // Exam-specific state implementation
}));
```

## Component Usage Guidelines

### 1. Form Usage
```typescript
// Example form implementation
import { Input, Select, Button } from '@/components/ui';

const MyForm = () => {
  const handleSubmit = (data) => {
    // Form submission logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        name="username"
        label="Username"
        required
      />
      <Select
        name="role"
        label="Role"
        options={roleOptions}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
```

### 2. Layout Implementation
```typescript
// Example page layout
import { ResponsiveContainer, Sidebar, Header } from '@/components/ui';

const PageLayout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Header />
      <div className="flex">
        <Sidebar />
        <ResponsiveContainer>
          {children}
        </ResponsiveContainer>
      </div>
    </div>
  );
};
```

### 3. Error Handling
```typescript
// Example error boundary usage
import { ErrorBoundary } from '@/components/common';

const FeatureComponent = () => {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      {/* Feature content */}
    </ErrorBoundary>
  );
};
```

## Maintenance and Updates

### 1. Component Updates
- Follow semantic versioning
- Document breaking changes
- Maintain backwards compatibility
- Update type definitions

### 2. Testing Requirements
- Unit tests for components
- Integration tests for features
- E2E tests for critical flows
- Accessibility testing

### 3. Performance Considerations
- Implement proper memoization
- Optimize re-renders
- Use proper loading states
- Monitor component performance