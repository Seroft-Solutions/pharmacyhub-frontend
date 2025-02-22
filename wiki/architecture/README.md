# Architecture Overview

## System Architecture

PharmacyHub is built using a modern, scalable frontend architecture following Feature-Sliced Design (FSD) principles. The application is built with Next.js 15 and uses TypeScript for enhanced type safety and developer experience.

### Core Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **State Management**: Zustand + React Query
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: Keycloak + NextAuth.js
- **API Integration**: Axios + React Query
- **Form Management**: React Hook Form + Zod
- **UI Components**: Radix UI + shadcn/ui
- **Charts & Visualization**: Recharts

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Shared UI components
├── config/             # Application configuration
├── context/            # React context definitions
├── features/           # Feature-based modules
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and shared logic
├── services/           # API and external service integrations
├── shared/             # Shared utilities, types, and components
├── store/              # Global state management
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

### Key Directories

#### Features Directory
The features directory follows the Feature-Sliced Design methodology:

```
features/
├── auth/              # Authentication feature
│   ├── api/          # API integration
│   ├── lib/          # Feature-specific utilities
│   ├── model/        # State and types
│   └── ui/           # Feature-specific components
├── exam/             # Exam management feature
├── licensing/        # Licensing management feature
└── [feature]/        # Other features follow the same structure
```

Each feature module is self-contained and includes:
- API integration layer
- Business logic
- UI components
- State management
- Type definitions

## Design Patterns

### 1. Component Architecture
- Follows Atomic Design principles
- Uses composition over inheritance
- Implements Container/Presenter pattern for complex components

### 2. State Management
- Uses Zustand for global state management
- Implements React Query for server state
- Follows CQRS pattern for data operations

### 3. Authentication Flow
- Implements JWT-based authentication
- Uses Keycloak for identity management
- Implements role-based access control (RBAC)

### 4. Error Handling
- Centralized error handling
- Custom error boundaries
- Typed error responses

### 5. Performance Optimization
- Implements code splitting
- Uses dynamic imports
- Optimizes images and assets
- Implements caching strategies

## Design Decisions

### 1. Feature-Sliced Design
- Adopted for better code organization and scalability
- Enables independent feature development
- Facilitates code reuse and maintenance

### 2. TypeScript First
- Strict type checking enabled
- Interface-based development
- Comprehensive type definitions

### 3. Component Library
- Uses shadcn/ui for consistent design
- Custom component extensions
- Responsive design patterns

### 4. State Management Strategy
- Zustand for simple global state
- React Query for server state
- Context for component-level state

### 5. Authentication & Authorization
- Keycloak integration for enterprise-grade security
- Role-based access control
- Permission-based feature flags

## Configuration Management

### Environment Variables
Core environment variables are managed in `.env` files:

- `NEXT_PUBLIC_API_URL`: Backend API endpoint
- `NEXT_PUBLIC_KEYCLOAK_URL`: Keycloak server URL
- `NEXT_PUBLIC_KEYCLOAK_REALM`: Keycloak realm name
- `NEXT_PUBLIC_KEYCLOAK_CLIENT_ID`: Client ID for Keycloak

### Feature Flags
Feature flags are managed in `config/featureFlags.ts`:

- Development features
- Beta features
- Role-based feature access

## Development Guidelines

### Code Organization
1. Follow Feature-Sliced Design principles
2. Keep features self-contained
3. Use shared components for common UI elements
4. Implement proper type definitions

### Best Practices
1. Write unit tests for business logic
2. Implement error boundaries
3. Use proper TypeScript types
4. Follow naming conventions
5. Document complex logic

### Performance Considerations
1. Implement code splitting
2. Optimize bundle size
3. Use proper caching strategies
4. Implement proper loading states

## Monitoring and Logging

### Winston Logger Configuration
The application uses Winston for logging with the following levels:

- ERROR: Application errors
- WARN: Warning conditions
- INFO: General information
- DEBUG: Detailed debug information

### Performance Monitoring
- Implements performance metrics
- Tracks page load times
- Monitors API response times

## Deployment Strategy

### Build Process
1. TypeScript compilation
2. Asset optimization
3. Bundle generation
4. Environment configuration

### Deployment Environments
- Development
- Staging
- Production

Each environment has its own:
- Configuration
- Feature flags
- API endpoints
- Logging levels