# Exams Preparation API Module

This module contains all API-related functionality for the exams-preparation feature.

## Structure

- **constants/** - API endpoint constants and configurations
- **hooks/** - React Query hooks for data fetching
- **services/** - Extended API services
- **index.ts** - Public API exports

## Core Integration

This module leverages the core API module and follows established patterns:

- Use core API module for all data fetching
- Use TanStack Query for all server state management
- Follow established patterns for error handling
- Use proper request/response types

## Usage Guidelines

1. Define endpoint constants in `constants/` directory
2. Implement service functions in `services/` directory
3. Create React Query hooks in `hooks/` directory
4. Export everything through the index.ts file

Avoid direct imports from subdirectories. Always use the public API through the index.ts file.
