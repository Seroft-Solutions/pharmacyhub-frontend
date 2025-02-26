# PharmacyHub Project Architecture

## Overview

PharmacyHub is a comprehensive platform for pharmacists and pharmacy students. The application includes features for exams, educational content, and professional development tracking.

## Tech Stack

### Frontend
- **Framework**: Next.js (React)
- **State Management**: Likely using React hooks, Context API and custom stores
- **Styling**: Tailwind CSS (based on components.json)
- **Testing**: Jest
- **TypeScript**: For type safety

### Backend
- **Framework**: Spring Boot 3.1.x
- **Database Access**: Spring Data JPA
- **Security**: Spring Security with JWT
- **Documentation**: SpringDoc OpenAPI
- **Database**: PostgreSQL (production) / H2 (development)
- **Testing**: JUnit Jupiter
- **API Style**: RESTful

## Architecture

### Frontend Architecture

The frontend follows a feature-based architecture:

```
src/
├── app/              # Next.js page routes 
├── components/       # Shared UI components
├── features/         # Feature modules
│   ├── exams/        # Exam feature
│   │   ├── api/      # API integration
│   │   ├── hooks/    # Custom React hooks
│   │   ├── model/    # TypeScript types and interfaces
│   │   ├── store/    # State management
│   │   └── ui/       # UI components
│   └── progress/     # Progress tracking feature
└── shared/           # Shared utilities and services
    ├── api/          # API client utilities
    └── auth/         # Authentication utilities
```

#### Design Patterns

1. **Feature-Based Organization**: Code is organized around business features rather than technical concerns
2. **Adapter Pattern**: Used to transform data between frontend and backend formats
3. **Repository Pattern**: API clients abstract data access details
4. **Hooks Pattern**: Custom React hooks encapsulate reusable logic
5. **Store Pattern**: State management for complex features

### Backend Architecture

The backend follows a layered architecture:

```
src/main/java/com/pharmacyhub/
├── controller/       # REST API controllers
├── domain/           # Domain entities and repositories
│   ├── entity/       # JPA entity classes
│   └── repository/   # Spring Data repositories
├── dto/              # Data Transfer Objects
├── service/          # Business logic layer
│   ├── interfaces/   # Service interfaces
│   └── impl/         # Service implementations
├── security/         # Security configuration and JWT
└── loader/           # Data loaders for sample/test data
```

#### Design Patterns

1. **Layered Architecture**: Clear separation between controllers, services, and repositories
2. **Repository Pattern**: Spring Data JPA repositories for data access
3. **DTO Pattern**: Separate objects for API communication
4. **Service Pattern**: Business logic encapsulated in services
5. **Dependency Injection**: Spring's IoC container manages dependencies

## Data Flow

1. **API Request Flow**:
   - Request from browser → Next.js → API client → Backend Controller → Service → Repository → Database
   - Response: Database → Repository → Service → Controller → API client → React component

2. **State Management Flow**:
   - User action → React component → Custom hook → API client → Backend
   - Or: User action → React component → Store → React components (re-render)

## Integration Points

1. **API Integration**:
   - Frontend API clients in `features/*/api/` folders
   - Backend controllers define REST endpoints
   - JWT authentication for secure communication

2. **Authentication Flow**:
   - Login → JWT token generation → Token storage → Include token in API requests
   - Authenticated routes protected on both frontend and backend
   
## Deployment Strategy

The application likely follows a containerized deployment approach:
- Docker containers for frontend and backend
- Separate databases for different environments
- CI/CD pipeline for automated deployments

## Development Patterns

1. **TypeScript Type Safety**: Strict typing between frontend and backend
2. **Adapter Pattern**: For data transformation between API and frontend models
3. **Feature-First Organization**: Code organized around business features
4. **Layered Security**: JWT-based authentication with role-based access control

## Exam Feature Architecture

The exam feature follows a clean structure:
1. **Model Layer**: Type definitions in `mcqTypes.ts` and `types.ts`
2. **API Layer**: Adapters and API clients for data fetching
3. **UI Layer**: React components for exam taking and result display
4. **Store Layer**: State management for exam session data

### API Contract
- GET /exams - Get all exams
- GET /exams/published - Get published exams
- GET /exams/:id - Get exam by ID
- GET /exams/:id/questions - Get questions for exam
- POST /exams/:id/start - Start an exam attempt
- POST /exams/:id/submit - Submit exam answers
- GET /exams/attempts/:id/result - Get exam result

## Conclusion

PharmacyHub follows modern architecture practices with clear separation of concerns, type safety, and modular organization. The feature-based approach makes it easy to add new features while maintaining existing ones.
