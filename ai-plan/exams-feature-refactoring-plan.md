# PharmacyHub Exams Feature Refactoring Plan

## Overview

This plan outlines a comprehensive approach to refactor the exams feature in the PharmacyHub frontend application to:
1. Follow a proper feature-based architecture
2. Replace React hooks with Zustand state management
3. Break down large components into smaller, more maintainable ones
4. Use constants instead of string literals
5. Improve code organization with smaller, more focused files
6. Ensure consistent patterns throughout the codebase

## New Directory Structure

```
/src/features/exams/
├── api/                    # API integration layer
│   ├── constants/          # API endpoints, permissions
│   ├── hooks/              # API hooks (to be migrated)
│   ├── services/           # API service adapters
│   └── types/              # API-specific types
├── core/                   # Core, shared functionality
│   ├── components/         # Shared UI components
│   ├── constants/          # Core constants
│   ├── store/              # Core Zustand stores
│   ├── types/              # Core types
│   └── utils/              # Utilities
├── taking/                 # Exam taking domain
│   ├── components/         # UI components
│   ├── constants/          # Domain-specific constants
│   ├── store/              # Domain-specific stores
│   ├── types/              # Domain-specific types
│   └── utils/              # Domain-specific utilities
├── creation/               # Exam creation and management domain
│   ├── components/         # UI components
│   ├── constants/          # Domain-specific constants
│   ├── store/              # Domain-specific stores
│   ├── types/              # Domain-specific types
│   └── utils/              # Domain-specific utilities
├── review/                 # Exam review domain
│   ├── components/         # UI components
│   ├── constants/          # Domain-specific constants
│   ├── store/              # Domain-specific stores
│   ├── types/              # Domain-specific types
│   └── utils/              # Domain-specific utilities
├── management/             # Admin management domain
│   ├── components/         # UI components
│   ├── constants/          # Domain-specific constants
│   ├── store/              # Domain-specific stores
│   ├── types/              # Domain-specific types
│   └── utils/              # Domain-specific utilities
├── analytics/              # Analytics and reporting domain
│   ├── components/         # UI components
│   ├── constants/          # Domain-specific constants
│   ├── store/              # Domain-specific stores
│   ├── types/              # Domain-specific types
│   └── utils/              # Domain-specific utilities
├── rbac/                   # Permission and access control
│   ├── components/         # Guard components
│   ├── constants/          # Permission constants
│   ├── hooks/              # RBAC hooks (to be migrated)
│   └── store/              # RBAC stores
├── premium/                # Premium features domain
│   ├── components/         # UI components
│   ├── constants/          # Domain-specific constants
│   ├── store/              # Domain-specific stores
│   └── hooks/              # Premium hooks (to be migrated)
├── deprecated/             # Old code, organized by domain
└── index.ts                # Public API
```

## Implementation Phases

### Phase 1: Initial Setup and Directory Structure (25%)
- [ ] Create the new directory structure
- [ ] Create placeholder files and folders
- [ ] Setup basic index.ts files for exports
- [ ] Create initial constants files
- [ ] Define core types
- [ ] Set up the deprecated folder

### Phase 2: Core and API Layers (20%)
- [ ] Implement core types with JSDoc comments
- [ ] Create comprehensive constants for UI text, status, etc.
- [ ] Enhance API constants and endpoints
- [ ] Create API service layer with adapters
- [ ] Refine API hooks using the createApiHooks factory
- [ ] Implement response transformers for consistent data formats

### Phase 3: Zustand Store Migration (25%)
- [ ] Create core exam store
- [ ] Implement exam taking store to replace useExamSession
- [ ] Create exam creation store for admin functionality
- [ ] Implement review store for results and analytics
- [ ] Create management store for admin operations
- [ ] Ensure stores handle persistence, errors, and loading states

### Phase 4: Component Decomposition (20%)
- [ ] Break down ExamContainer into smaller components
- [ ] Decompose QuestionDisplay into focused components
- [ ] Split ExamResults into smaller parts
- [ ] Update all components to use new stores
- [ ] Ensure consistent prop types and documentation

### Phase 5: Testing and Refinement (10%)
- [ ] Manually test all functionality
- [ ] Fix any issues that arise
- [ ] Optimize performance with memoization
- [ ] Clean up deprecated code
- [ ] Ensure proper documentation throughout

## Zustand Store Architecture

The following Zustand stores will be implemented:

1. **Core Exam Store**
   - [ ] Basic exam information
   - [ ] Global settings
   - [ ] Shared state

2. **Exam Taking Store**
   - [ ] Active exam taking session
   - [ ] Questions, answers, flagging
   - [ ] Timer and progress
   - [ ] Submission

3. **Exam Creation Store**
   - [ ] Exam creation and editing
   - [ ] Form state and validation
   - [ ] Publishing and archiving

4. **Exam Review Store**
   - [ ] Results review
   - [ ] Analytics and feedback
   - [ ] Performance metrics

5. **Exam Management Store**
   - [ ] Admin functionality
   - [ ] Bulk operations
   - [ ] Status management

## Constants-Based Approach

The following categories of constants will be implemented:

1. **Route Constants**
   - [ ] Define all route paths in a central location

2. **UI Text Constants**
   - [ ] Labels, titles, messages, etc.

3. **Status Constants**
   - [ ] Define all possible status values

4. **Event Constants**
   - [ ] Analytics events, custom events, etc.

5. **CSS Class Constants**
   - [ ] Common CSS class names

6. **Configuration Constants**
   - [ ] Default values, settings, etc.

7. **Type Constants**
   - [ ] Enum-like constants for types

## Component Breakdown

The following large components will be broken down:

1. **ExamContainer**
   - [ ] ExamSession (orchestration)
   - [ ] ExamStart (starting screen)
   - [ ] ExamQuestions (questions display)
   - [ ] ExamControls (navigation controls)
   - [ ] ExamCompletion (completion logic)

2. **QuestionDisplay**
   - [ ] QuestionText (display question text)
   - [ ] OptionsList (list of answer options)
   - [ ] QuestionControls (flag, navigate, etc.)

3. **ExamResults**
   - [ ] ResultsSummary (overall results)
   - [ ] AnswersReview (review individual answers)
   - [ ] PerformanceMetrics (charts, stats)
   - [ ] ResultsActions (actions to take after exam)

## API Integration

The API integration will be enhanced with:

1. **API Constants**
   - [ ] Ensure all endpoints are defined properly
   - [ ] Group endpoints logically by resource

2. **API Services**
   - [ ] Create a service layer for each resource
   - [ ] Implement proper error handling
   - [ ] Add response transformation

3. **Store Adapters**
   - [ ] Create adapters for each domain
   - [ ] Bridge between stores and services
   - [ ] Handle response transformation

4. **Custom Hooks**
   - [ ] Create TanStack Query hooks for API interaction
   - [ ] Ensure proper caching and invalidation
   - [ ] Add error handling and loading states

## Migration Strategy

To ensure a smooth transition:

1. **Parallel Implementation**
   - [ ] Implement new structure alongside existing code
   - [ ] Keep old code working during migration
   - [ ] Move files to deprecated folder as they're replaced

2. **Incremental Testing**
   - [ ] Test each component as it's migrated
   - [ ] Ensure all functionality is preserved
   - [ ] Fix issues before moving to the next component

3. **Documentation**
   - [ ] Document all new components and stores
   - [ ] Create migration guide for developers
   - [ ] Add JSDoc comments to all exported functions

## Expected Benefits

1. **Better Code Organization**
   - Clearer structure
   - Easier to find files
   - Better separation of concerns

2. **Improved Maintainability**
   - Smaller, focused files
   - Consistent patterns
   - Better error handling

3. **Enhanced Developer Experience**
   - Standardized patterns
   - Better type safety
   - Clearer component responsibilities

4. **Better Performance**
   - Targeted re-renders
   - Optimized state management
   - Better caching

5. **Easier Testing**
   - Isolated components
   - Testable state
   - Clear boundaries

## Deliverables

1. **Refactored Codebase**
   - All the implemented components and stores
   - Proper directory structure
   - Clean, well-documented code

2. **Documentation**
   - Implementation guide
   - Component documentation
   - Store documentation

3. **Test Cases**
   - Manual test scenarios
   - Validation steps
   - Regression tests
