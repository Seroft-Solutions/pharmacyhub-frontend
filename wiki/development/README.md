# Development Guide

## Getting Started

### Prerequisites
- Node.js (version compatible with Next.js 15)
- npm or yarn package manager
- Git for version control

### Environment Setup

1. **Clone the Repository**
```bash
git clone [repository-url]
cd pharmacyhub-frontend
```

2. **Install Dependencies**
```bash
npm install
# or
yarn install
```

3. **Environment Configuration**
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_KEYCLOAK_URL=
NEXT_PUBLIC_KEYCLOAK_REALM=
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=
```

4. **Start Development Server**
```bash
npm run dev
# or
yarn dev
```

## Project Structure

### Core Directories

```
src/
├── app/                 # Next.js App Router pages and layouts
├── components/          # Reusable UI components
├── features/           # Feature modules following FSD
├── shared/             # Shared utilities and components
└── types/              # TypeScript type definitions
```

### Feature Module Structure
Each feature follows the Feature-Sliced Design pattern:
```
feature/
├── api/                # API integration
├── lib/                # Feature-specific utilities
├── model/             # State management and types
└── ui/                # Feature-specific components
```

## Development Workflow

### 1. Code Style & Standards

#### TypeScript Configuration
```typescript
// tsconfig.json key settings
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "noEmit": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}]
  }
}
```

#### ESLint Configuration
The project uses Next.js's ESLint configuration with custom rules.

### 2. Component Development

#### UI Components
- Use shadcn/ui components as base
- Implement responsive design
- Follow accessibility guidelines

Example component structure:
```typescript
// src/components/ui/MyComponent.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface MyComponentProps {
  // Props definition
}

export const MyComponent: React.FC<MyComponentProps> = ({
  // Props destructuring
}) => {
  return (
    // JSX implementation
  );
};
```

### 3. State Management

#### Zustand Store Pattern
```typescript
// src/features/[feature]/model/store.ts
import { create } from 'zustand';

interface StoreState {
  // State definition
}

export const useStore = create<StoreState>((set) => ({
  // Store implementation
}));
```

#### React Query Usage
```typescript
// src/features/[feature]/api/queries.ts
import { useQuery } from '@tanstack/react-query';

export const useFeatureData = () => {
  return useQuery({
    queryKey: ['feature'],
    queryFn: () => // API call implementation
  });
};
```

### 4. API Integration

#### API Client Setup
```typescript
// src/lib/api.ts
import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // Additional configuration
});
```

#### Service Pattern
```typescript
// src/features/[feature]/api/service.ts
import { apiClient } from '@/lib/api';

export const featureService = {
  // Service methods
};
```

## Testing Strategy

### Unit Testing
- Test business logic
- Test utility functions
- Test hooks and state management

### Integration Testing
- Test feature workflows
- Test API integration
- Test authentication flows

### E2E Testing
- Test critical user journeys
- Test form submissions
- Test navigation flows

## Performance Optimization

### 1. Code Splitting
- Use dynamic imports
- Implement route-based splitting
- Optimize component loading

### 2. Image Optimization
- Use Next.js Image component
- Implement lazy loading
- Optimize image formats

### 3. State Management
- Implement proper caching
- Optimize re-renders
- Use proper memoization

## Debugging

### Development Tools
- React Developer Tools
- React Query DevTools
- Next.js DevTools

### Logging
```typescript
// src/lib/logger.ts
import { logger } from '@/shared/lib/logger';

logger.info('Log message', {
  // Additional context
});
```

## Build & Deployment

### Build Process
```bash
# Production build
npm run build

# Start production server
npm run start
```

### Environment-Specific Builds
- Development
- Staging
- Production

## Contributing Guidelines

### 1. Branch Naming
- feature/feature-name
- bugfix/issue-description
- hotfix/urgent-fix

### 2. Commit Messages
- Follow conventional commits
- Include ticket references
- Provide clear descriptions

### 3. Pull Requests
- Include description
- Link related issues
- Add necessary labels

## Troubleshooting

### Common Issues
1. Authentication Issues
   - Check Keycloak configuration
   - Verify token handling
   - Check CORS settings

2. Build Issues
   - Clear Next.js cache
   - Update dependencies
   - Check TypeScript errors

3. State Management Issues
   - Check store implementation
   - Verify React Query setup
   - Debug state updates

## Additional Resources

### Documentation
- Next.js Documentation
- shadcn/ui Components
- Keycloak Documentation

### Tools
- VS Code Extensions
- Chrome DevTools
- React Developer Tools