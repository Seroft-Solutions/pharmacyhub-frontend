# RBAC Components Analysis Report

## Overview
This document analyzes the current structure of core/rbac components to identify components exceeding 200 lines, functions exceeding 20-30 lines, and areas where component decomposition is needed. This analysis is part of the PHAR-333 "Refactor core/rbac components" task.

## Directory Structure
- /core/rbac
  - /api
  - /components
  - /constants
  - /contexts
  - /hooks
  - /registry
  - /services
  - /state
  - /types
  - index.ts
  - permissions.ts

## Component Analysis

### Components Exceeding 200 Lines
1. **useAccess.ts** (~300+ lines)
   - Current: Multiple functions for permission and role checking
   - Issue: Size and multiple responsibilities

### Components Approaching Size Limit
1. **featureFlagService.ts** (~200 lines)
   - Current: Feature flag service with multiple responsibilities
   - Issue: Mixed storage, API, and management concerns

2. **featureRegistry.ts** (~200 lines)
   - Current: Feature registration and management functions
   - Issue: Multiple operations in a single file

3. **FeatureContext.tsx** (~180 lines)
   - Current: Feature context provider and hooks
   - Issue: Mixed provider and hook responsibilities

### Functions Exceeding 30-Line Limit
1. **useAccess.ts**:
   - `hasPermission` - Complex permission checking logic
   - `hasRole` - Role checking with normalization
   - `hasAnyRole` - Multiple role checking with normalization
   - `hasAllRoles` - Comprehensive role checking
   - `hasAccess` - Complex access condition logic

2. **featureFlagService.ts**:
   - `initialize` - Feature flag initialization
   - `initializeDefaultFlags` - Default flag setup

3. **FeatureContext.tsx**:
   - `hasFeatureAccess` - Feature access checking logic

4. **FeatureGuard.tsx**:
   - useEffect callback - Complex feature access checking

### Components Needing Decomposition

1. **PermissionGuard.tsx** (~140 lines)
   - Current: 5 components and 2 hooks in one file
   - Issue: Mixed responsibilities, should be separate components

2. **PermissionCheck.tsx** (~150 lines)
   - Current: 3 components with similar patterns
   - Issue: Redundant code, could share common patterns

3. **FeatureGuard.tsx** (~120 lines)
   - Current: 3 components in one file
   - Issue: Should be separate files for maintainability

4. **RoleGuards.tsx** (~50 lines)
   - Current: 3 specialized guards
   - Issue: Consistency with other decomposed components

## Refactoring Recommendations

### High Priority
1. **useAccess.ts**
   - Split into multiple smaller hooks
   - Extract utility functions
   - Focus each hook on a specific type of check

2. **PermissionGuard.tsx**
   - Separate each component and hook into its own file
   - Create shared utilities for common patterns

### Medium Priority
1. **FeatureContext.tsx**
   - Separate provider from hooks
   - Extract state management logic
   - Simplify complex functions

2. **PermissionCheck.tsx**
   - Extract each component into its own file
   - Create a higher-order component for common patterns

3. **FeatureGuard.tsx**
   - Separate components into individual files
   - Simplify access checking logic

### Lower Priority
1. **featureFlagService.ts**
   - Split into domain-specific services
   - Extract storage and API functionality

2. **featureRegistry.ts**
   - Break into registration, querying, and management modules
   - Simplify interfaces

## Detailed Refactoring Plan

### 1. useAccess.ts Refactoring:
- Create the following files:
  - `usePermissionChecks.ts` - Extract permission-related functions
  - `useRoleChecks.ts` - Extract role-related functions
  - `useAccessVerification.ts` - Extract backend verification functions
  - `accessUtils.ts` - Extract utility functions
- Each extracted hook should focus on a specific responsibility
- Keep common state (user) in the base hook and compose other hooks as needed
- Functions should be limited to 30 lines or less

### 2. PermissionGuard.tsx Refactoring:
- Create separate component files:
  - `PermissionGuard.tsx` - Single permission checking
  - `AllPermissionsGuard.tsx` - All permissions checking
  - `AnyPermissionGuard.tsx` - Any permission checking
  - `RoleGuard.tsx` - Single role checking
  - `AnyRoleGuard.tsx` - Any role checking
- Create separate hook files:
  - `usePermission.ts` - Permission checking hook
  - `useRole.ts` - Role checking hook
- Use shared utility functions for common logic
- Update index.ts to re-export all components

### 3. FeatureGuard.tsx Refactoring:
- Create separate component files:
  - `FeatureGuard.tsx` - Base feature access component
  - `OperationGuard.tsx` - Feature operation component
  - `AdminOnly.tsx` - Admin-specific component
- Extract utility functions for feature checking
- Create a shared loading indicator component
- Simplify the access checking logic in useEffect

### 4. PermissionCheck.tsx Refactoring:
- Create separate component files:
  - `PermissionCheck.tsx` - Permission checking component
  - `RoleCheck.tsx` - Role checking component
  - `AccessCheck.tsx` - Combined access checking component
- Create shared utilities for backend verification
- Create a higher-order component for common patterns
- Standardize prop interfaces and error handling

### 5. FeatureContext.tsx Refactoring:
- Split into:
  - `FeatureProvider.tsx` - Context provider component
  - `useFeatures.ts` - Primary hook for feature access
  - `useFeature.ts` - Hook for specific feature checking
  - `featureAccessUtils.ts` - Utility functions
- Extract complex state management logic
- Break down larger functions into smaller ones

### 6. featureFlagService.ts Refactoring:
- Split service into:
  - `featureFlagService.ts` - Main service (simplified)
  - `featureFlagStorage.ts` - Storage-related functions
  - `featureFlagApi.ts` - API-related functions
  - `featureFlagUtils.ts` - Utility functions
- Break down initialization logic
- Extract complex functionality into simpler functions

### 7. featureRegistry.ts Refactoring:
- Split into:
  - `featureRegistry.ts` - Main registry (simplified)
  - `featureRegistration.ts` - Registration functions
  - `featureQuery.ts` - Query functions
  - `featureManagement.ts` - Management functions
- Focus each module on a specific responsibility
- Simplify the interfaces for better usability

## Conclusion
The core/rbac components generally follow good structure but need refactoring to fully comply with component design principles. The most critical issues are the large size of useAccess.ts and the mixture of multiple components in single files like PermissionGuard.tsx.

The refactoring should focus on splitting large files into smaller ones, extracting shared utilities, and ensuring each component has a single responsibility. This will improve maintainability, testability, and code quality.
