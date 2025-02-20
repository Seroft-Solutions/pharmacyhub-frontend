# PharmacyHub Architecture

## Overview

PharmacyHub implements a modern, scalable architecture following Feature-Sliced Design (FSD) principles with Next.js 15. The application architecture is designed to handle pharmacy management, licensing, and exam preparation features while maintaining high performance, security, and maintainability.

## Architectural Principles

1. **Separation of Concerns**: Clear boundaries between different parts of the application
2. **Domain-Driven Design**: Focus on the core domain model and business logic
3. **Component-Based Architecture**: Modular, reusable components
4. **Single Responsibility**: Each module has a single, well-defined purpose
5. **Progressive Enhancement**: Core functionality works without JavaScript, enhanced with JS
6. **Mobile-First Design**: Optimized for mobile devices first, then enhanced for larger screens

## Architectural Patterns

### 1. Feature-Sliced Design (FSD)

The application follows a layered architecture with clear boundaries:

```
/src/
├── entities/       # Business entities
├── features/       # Feature modules
├── shared/         # Shared utilities
└── app/            # Application layer (Next.js)
```

Key principles of FSD:
- **Namespaces**: Code is organized by business domains
- **Layers**: Code is divided into vertical layers (shared, entities, features, widgets, pages)
- **Slices**: Each layer is divided into slices (authentication, profiles, etc.)
- **Segments**: Each slice is divided into segments (ui, model, api, etc.)

### 2. Domain-Driven Design (DDD)

- **Bounded Contexts**: Clear separation between different parts of the system
- **Ubiquitous Language**: Consistent terminology throughout the codebase
- **Aggregates**: Objects that are treated as a single unit 
- **Entities**: Objects with identity that persist over time
- **Value Objects**: Objects without identity, defined by their attributes
- **Domain Services**: Business operations that don't belong to entities
- **Repositories**: Abstractions over data access

### 3. Client-Side State Management

- **Zustand**: For global application state
- **React Query**: For server state and data fetching
- **Local Component State**: For UI-specific state

## High-Level Architecture

```
┌─────────────────────────────────┐           ┌─────────────────────────┐
│         Client Application       │           │     Authentication      │
│  ┌─────────────┐ ┌─────────────┐ │           │                         │
│  │   Next.js   │ │    React    │ │           │        Keycloak         │
│  └─────────────┘ └─────────────┘ │           │                         │
│  ┌─────────────┐ ┌─────────────┐ │           └─────────────────────────┘
│  │   Zustand   │ │React Query  │ │                       │
│  └─────────────┘ └─────────────┘ │                       ▼
└────────────────┬────────────────┘           ┌─────────────────────────┐
                 │                            │     API Gateway         │
                 ▼                            │                         │
┌─────────────────────────────────┐           └────────────┬────────────┘
│         API Layer               │                        │
└────────────────┬────────────────┘                        ▼
                 │                            ┌─────────────────────────┐
                 ▼                            │   Microservices         │
┌─────────────────────────────────┐           │  ┌─────────────────┐    │
│       Backend Services           │           │  │Licensing Service│    │
│                                 │◄──────────┼──┤                 │    │
│                                 │           │  └─────────────────┘    │
└─────────────────────────────────┘           │  ┌─────────────────┐    │
                                             │  │  Exam Service   │    │
                                             │  │                 │    │
                                             │  └─────────────────┘    │
                                             │  ┌─────────────────┐    │
                                             │  │ User Service    │    │
                                             │  │                 │    │
                                             │  └─────────────────┘    │
                                             └─────────────────────────┘
```

## Directory Structure

### 1. Entities Layer (`/src/entities/`)

Domain models and business logic:

```
/entities/
├── user/
│   ├── model.ts    # User entity definition
│   └── types.ts    # User-related types
├── pharmacy/
│   ├── model.ts    # Pharmacy entity
│   └── types.ts    # Pharmacy-related types
└── license/
    ├── model.ts    # License entity
    └── types.ts    # License-related types
```

### 2. Features Layer (`/src/features/`)

Feature-specific modules:

```
/features/
├── licensing/
│   ├── ui/        # Feature-specific components
│   │   ├── forms/
│   │   ├── pages/
│   │   └── components/
│   ├── model/     # Feature domain logic
│   ├── api/       # API integration
│   └── lib/       # Feature utilities
├── exams/
│   ├── ui/
│   ├── model/
│   ├── api/
│   └── lib/
└── auth/
    ├── ui/
    │   ├── login/
    │   ├── register/
    │   └── reset-password/
    ├── model/
    └── api/
```

### 3. Shared Layer (`/src/shared/`)

Common utilities and components:

```
/shared/
├── ui/            # Reusable UI components
│   ├── button/
│   ├── input/
│   ├── modal/
│   ├── table/
│   └── layout/
├── api/           # API utilities
│   ├── client.ts
│   ├── hooks/
│   └── endpoints/
├── auth/          # Authentication utilities
│   ├── permissions.ts
│   ├── keycloakService.ts
│   └── PermissionGuard.tsx
├── config/        # Configuration
├── lib/           # Shared utilities
│   ├── validation/
│   ├── formatting/
│   └── helpers/
└── types/         # Common types
```

### 4. App Layer (`/src/app/`)

Next.js app router structure:

```
/app/
├── (auth)/        # Authentication routes
│   ├── login/
│   ├── register/
│   └── reset-password/
├── (licensing)/   # Licensing feature routes
│   ├── pharmacy/
│   ├── applications/
│   └── renewals/
├── (exams)/       # Exam feature routes
│   ├── practice/
│   ├── mock-tests/
│   └── results/
├── (dashboard)/   # Dashboard routes
│   ├── overview/
│   ├── analytics/
│   └── settings/
├── api/           # API routes
│   ├── auth/
│   ├── licensing/
│   └── exams/
└── layout.tsx     # Root layout
```

## Authentication Architecture

The authentication system is built around Keycloak 25.0.2:

```
┌─────────────────────────┐    ┌───────────────────┐    ┌─────────────────┐
│                         │    │                   │    │                 │
│    Frontend App         │    │  Identity         │    │  Spring Boot    │
│    (Next.js)            │◄───┤  Provider         ├───►│  Backend        │
│                         │    │  (Keycloak)       │    │                 │
│                         │    │                   │    │                 │
└─────────────────────────┘    └───────────────────┘    └─────────────────┘
         │                            ▲                        │
         │                            │                        │
         │                            │                        │
         │                     Token  │                        │
         │                   Validation                        │
         │                            │                        │
         ▼                            │                        ▼
┌─────────────────────────┐    ┌───────────────────┐    ┌─────────────────┐
│                         │    │                   │    │                 │
│    Auth Context         │    │  JWT Tokens       │    │  Resource       │
│    Permission Guards    │    │  - Access Token   │    │  Server         │
│                         │    │  - Refresh Token  │    │                 │
│                         │    │                   │    │                 │
└─────────────────────────┘    └───────────────────┘    └─────────────────┘
```

Key components:
1. **Keycloak Server**: Central authentication and authorization server
2. **Auth Context**: React context providing authentication state
3. **KeycloakService**: Service handling token management and API calls
4. **Permission Guards**: React components for permission-based rendering
5. **JWT Token**: Used for authentication and authorization

For more details on the authentication architecture, see the [Authentication Documentation](../03-authentication/README.md).

## State Management

### Global State (Zustand)

Zustand provides lightweight global state management:

```typescript
// Example Zustand store
import { create } from 'zustand';

interface ThemeStore {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  isDarkMode: false,
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));
```

### Server State (React Query)

React Query handles server-side state and caching:

```typescript
// Example React Query hooks
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchPharmacies, createPharmacy } from '@/api/pharmacies';

export const usePharmacies = () => {
  return useQuery({
    queryKey: ['pharmacies'],
    queryFn: fetchPharmacies,
  });
};

export const useCreatePharmacy = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPharmacy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pharmacies'] });
    },
  });
};
```

## Performance Optimizations

### Next.js Optimizations

1. **Static Site Generation (SSG)**
   ```typescript
   // Example SSG
   export async function generateStaticParams() {
     const pharmacies = await fetchPharmacies();
     return pharmacies.map((pharmacy) => ({
       id: pharmacy.id,
     }));
   }
   ```

2. **Incremental Static Regeneration (ISR)**
   ```typescript
   // Example ISR
   export const revalidate = 3600; // Revalidate every hour
   ```

3. **Server Components**
   ```typescript
   // Example server component
   export default async function PharmacyList() {
     const pharmacies = await fetchPharmacies();
     return (
       <ul>
         {pharmacies.map((pharmacy) => (
           <li key={pharmacy.id}>{pharmacy.name}</li>
         ))}
       </ul>
     );
   }
   ```

### Additional Optimizations

1. **Code Splitting**: Automatic code splitting by route
2. **Image Optimization**: Using Next.js Image component
3. **Font Optimization**: Using Next.js Font optimization
4. **Bundle Analysis**: Regular analysis and optimization
5. **Service Worker**: For offline support and caching
6. **Memoization**: Using React.memo, useMemo, and useCallback

## Security Architecture

Security is implemented at multiple levels:

1. **Authentication**: Keycloak provides robust authentication
2. **Authorization**: Permission-based access control 
3. **Data Protection**: HTTPS, secure cookies, CSRF protection
4. **Input Validation**: Client and server-side validation
5. **API Security**: Rate limiting, CORS, authentication middleware
6. **Content Security Policy**: Preventing XSS attacks

## Deployment Architecture

The application is deployed using containerization and orchestration:

```
┌─────────────────────────┐      ┌─────────────────────────┐
│                         │      │                         │
│    CI/CD Pipeline       │      │   Container Registry    │
│    (GitHub Actions)     │      │   (Docker Hub)          │
│                         │      │                         │
└──────────┬──────────────┘      └───────────┬─────────────┘
           │                                 │
           │                                 │
           ▼                                 ▼
┌─────────────────────────────────────────────────────────┐
│                                                         │
│                  Kubernetes Cluster                     │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │ Frontend    │  │ Backend     │  │ Keycloak    │      │
│  │ Pods        │  │ Pods        │  │ Pods        │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │
│  │ Database    │  │ Redis       │  │ Monitoring  │      │
│  │ Stateful Set│  │ Cluster     │  │ Stack       │      │
│  └─────────────┘  └─────────────┘  └─────────────┘      │
│                                                         │
└─────────────────────────────────────────────────────────┘
           │                                 │
           │                                 │
           ▼                                 ▼
┌─────────────────────────┐      ┌─────────────────────────┐
│                         │      │                         │
│    Load Balancer        │      │   CDN                   │
│    (Nginx/Traefik)      │      │   (Cloudflare)          │
│                         │      │                         │
└─────────────────────────┘      └─────────────────────────┘
```

## Technical Debt Management

The project follows these practices to manage technical debt:

1. **Regular Refactoring**: Scheduled refactoring sprints
2. **Code Reviews**: Mandatory reviews before merging
3. **Test Coverage**: Maintaining high test coverage
4. **Dependency Management**: Regular updates of dependencies
5. **Architecture Reviews**: Quarterly architecture reviews
6. **Documentation**: Keeping documentation up-to-date

## Future Architecture Considerations

1. **Micro-Frontends**
   - Independent deployment of frontend modules
   - Team-specific ownership of features
   - Technology-agnostic architecture

2. **Edge Computing**
   - Moving computation closer to users
   - Reduced latency
   - Improved global performance

3. **Server Components Evolution**
   - More sophisticated SSR/SSG strategies
   - Hybrid rendering approaches
   - Streaming server components

4. **WebAssembly Integration**
   - Performance-critical components in WASM
   - Cross-language component development
   - Near-native performance for complex calculations

## Additional Architecture Documentation

- [Authentication Architecture](../03-authentication/architecture.md)
- [API Integration](./api-integration.md)
- [State Management](./state-management.md)
- [Performance Strategy](./performance.md)
- [Security Architecture](./security.md)
