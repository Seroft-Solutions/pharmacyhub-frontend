# Core Architecture Refactoring Plan

This document outlines the comprehensive plan for refactoring the core architecture of PharmacyHub Frontend to align with the Feature-First Organization principle and Core Layer Foundation approach.

## Current Structure Analysis

The current structure has four main modules in the core features directory:

- `app-api-handler`: Handles API operations
- `app-auth`: Manages authentication
- `app-mobile-handler`: Handles mobile-specific functionality
- `app-rbac`: Manages role-based access control

Each module has its own structure which doesn't fully align with the desired core architecture principles. We need to migrate these modules to their proper locations according to the new architecture.

## Target Structure

We'll be refactoring to match the specified architecture:

```
/src
  /core                     # Core cross-cutting concerns
    /auth                   # Authentication services
    /rbac                   # Role-based access control
    /api                    # API client setup
      /generated            # OpenAPI generated code
      /adapters             # Adapters for generated code
    /ui                     # Shared UI component library (atoms only)
    /utils                  # Common utilities
  /features                 # Feature modules
    /feature1               # Business capabilities
    /feature2
    ...
```

## Refactoring Process Overview

1. Create the new core structure
2. Migrate each existing core feature module to its proper location
3. Refactor components according to component design principles
4. Implement proper state management strategy
5. Integrate OpenAPI specification for API type safety
6. Apply code quality standards
7. Clean up and finalize

## Progress Tracking

| Task ID | Task Description | Status | Completion Date |
|---------|-----------------|--------|-----------------|
| 01      | Create new core directory structure | Not Started | |
| 02      | Migrate app-api-handler to core/api | Not Started | |
| 03      | Migrate app-auth to core/auth | Not Started | |
| 04      | Migrate app-rbac to core/rbac | Not Started | |
| 05      | Migrate app-mobile-handler to core/mobile (if needed) | Not Started | |
| 06      | Refactor core/api components | Not Started | |
| 07      | Refactor core/auth components | Not Started | |
| 08      | Refactor core/rbac components | Not Started | |
| 09      | Implement Zustand state management where appropriate | Not Started | |
| 10      | Implement TanStack Query for API state | Not Started | |
| 11      | Implement React Context for simple state | Not Started | |
| 12      | Apply component size limitations | Not Started | |
| 13      | Apply single responsibility principle | Not Started | |
| 14      | Apply hierarchical composition | Not Started | |
| 15      | Update imports across the project | Not Started | |
| 16      | Update documentation | Not Started | |
| 17      | Final cleanup | Not Started | |
| 18      | OpenAPI specification integration | Not Started | |

## Implementation Timeline

- Phase 1 (Tasks 01-05): Structure Creation and Migration - Days 1-3
- Phase 2 (Tasks 06-08): Component Refactoring - Days 4-7
- Phase 3 (Tasks 09-11): State Management Implementation - Days 8-10
- Phase 4 (Tasks 12-14): Architecture Principle Application - Days 11-13
- Phase 5 (Tasks 15-17): Finalization - Days 14-15
- Phase 6 (Task 18): OpenAPI Integration - Days 16-18
