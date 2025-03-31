# Core Integration Implementation Plan

This document outlines the step-by-step plan for integrating the exams-preparation feature with the core module foundation, ensuring proper adherence to the "Core as Foundation" principle.

## 1. Logger Integration

### Current Issue
The feature imports a logger from `@/core/utils/logger` which doesn't exist.

### Implementation Steps

1. **Create Core Logger Module**
   - Create a shared logger implementation in the core:
     ```tsx
     // src/core/utils/logger.ts
     /**
      * Core Logger Module
      * 
      * Provides standardized logging across the application.
      * Supports different log levels and contexts.
      */
     
     // Log levels
     export enum LogLevel {
       ERROR = 'error',
       WARN = 'warn',
       INFO = 'info',
       DEBUG = 'debug',
     }
     
     // Logger interface
     export interface Logger {
       error(message: string, meta?: any): void;
       warn(message: string, meta?: any): void;
       info(message: string, meta?: any): void;
       debug(message: string, meta?: any): void;
     }
     
     // Default logger implementation
     class DefaultLogger implements Logger {
       error(message: string, meta?: any): void {
         console.error(`[ERROR] ${message}`, meta || '');
       }
     
       warn(message: string, meta?: any): void {
         console.warn(`[WARN] ${message}`, meta || '');
       }
     
       info(message: string, meta?: any): void {
         console.info(`[INFO] ${message}`, meta || '');
       }
     
       debug(message: string, meta?: any): void {
         console.debug(`[DEBUG] ${message}`, meta || '');
       }
     }
     
     // Create and export the default logger
     const logger: Logger = new DefaultLogger();
     
     export default logger;
     ```

2. **Update Core API Error Logger**
   - Update the import in `src/core/api/core/error/errorLogger.ts`:
     ```tsx
     // Change:
     import { logger } from '@/shared/lib/logger';
     
     // To:
     import logger from '@/core/utils/logger';
     ```

3. **Verify Logger Usage in Exams Feature**
   - Confirm all logger imports in the exams-preparation feature are correctly using the core logger

## 2. State Management Integration

### Current Status
The feature uses a custom storeFactory implementation that is noted as "a candidate for promotion to core."

### Implementation Steps

1. **Evaluate Store Factory**
   - Review the custom storeFactory implementation
   - Compare with core state management patterns
   - Decide whether to promote to core or replace

2. **Option A: Promote to Core**
   - Create a core store factory:
     ```tsx
     // src/core/state/storeFactory.ts
     /**
      * Core Store Factory
      * 
      * Creates Zustand stores with consistent patterns and persistence options.
      * Provides utilities for optimizing component renders with selectors.
      */
     
     import { create, StateCreator, StoreApi, UseBoundStore } from 'zustand';
     import { persist, PersistOptions } from 'zustand/middleware';
     
     // Implementation based on exams-preparation storeFactory.ts
     // ...
     ```

3. **Option B: Replace with Core Equivalent**
   - If a similar solution already exists in core, update all imports:
     ```tsx
     // Change:
     import { createStore } from '../storeFactory';
     
     // To:
     import { createStore } from '@/core/state/storeFactory';
     ```

4. **Update Documentation**
   - Document the decision and implementation approach
   - Provide usage examples

## 3. Auth & RBAC Integration

### Current Status
Need to verify how the exams-preparation feature handles authentication and permissions.

### Implementation Steps

1. **Audit Auth & RBAC Usage**
   - Identify all auth-related code in the feature
   - Check for permission controls and access restrictions

2. **Implement Core Auth Integration**
   - Ensure all authentication uses core auth module:
     ```tsx
     // Example integration
     import { useAuth } from '@/core/auth';
     
     function ExamComponent() {
       const { user, isAuthenticated } = useAuth();
       
       if (!isAuthenticated) {
         return <AuthRequiredMessage />;
       }
       
       return <ExamContent />;
     }
     ```

3. **Implement Core RBAC Integration**
   - Ensure all permission checks use core RBAC module:
     ```tsx
     // Example integration
     import { usePermissions } from '@/core/rbac';
     
     function AdminExamComponent() {
       const { hasPermission } = usePermissions();
       
       if (!hasPermission('manage:exams')) {
         return <AccessDeniedMessage />;
       }
       
       return <AdminExamContent />;
     }
     ```

4. **Create RBAC Guards**
   - Implement consistent permission guards using core RBAC:
     ```tsx
     // src/features/exams-preparation/components/guards/ExamPermissionGuard.tsx
     import { ReactNode } from 'react';
     import { usePermissions } from '@/core/rbac';
     
     interface ExamPermissionGuardProps {
       permission: string;
       children: ReactNode;
       fallback?: ReactNode;
     }
     
     export function ExamPermissionGuard({
       permission,
       children,
       fallback,
     }: ExamPermissionGuardProps) {
       const { hasPermission } = usePermissions();
       
       if (!hasPermission(permission)) {
         return fallback || <div>Access denied</div>;
       }
       
       return <>{children}</>;
     }
     ```

## 4. Documentation

### Implementation Steps

1. **Create Integration Guide**
   - Document patterns for integrating with core modules
   - Provide examples for each integration area

2. **Update Component Documentation**
   - Add comments explaining core integration to key files
   - Document any feature-specific extensions

3. **Create Core API Usage Guide**
   - Document how to use core API module from the feature
   - Provide examples of core API hooks

4. **Verify Core Integration Checks**
   - Add checks to verify integration with core modules

## Implementation Timeline

1. **Logger Integration**: 1 hour
2. **State Management**: 3 hours
3. **Auth & RBAC**: 2 hours
4. **Documentation**: 2 hours

**Total Estimated Time**: 8 hours
