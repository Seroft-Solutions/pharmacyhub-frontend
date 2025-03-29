# Component Size Refactoring Plan

## Overview

Based on our analysis, we have identified **100 components** that exceed the 200-line limit and **204 functions** that exceed the 30-line limit. This document outlines a prioritized plan for refactoring these oversized components and functions to comply with our architecture principles.

## High-Priority Modules

The following modules have been identified as high priority for refactoring:

1. **Exams Module** - Contains the largest and most complex components
2. **App Pages** - Several page components exceed size limits
3. **Shared Components** - Core UI components used across the application
4. **Core Auth** - Authentication components with complex logic

## Refactoring Strategies

We will apply the following strategies when refactoring:

1. **Component Decomposition**
   - Break large components into smaller, more focused ones
   - Apply functional decomposition where appropriate
   - Extract reusable UI patterns

2. **Container/Presentation Pattern**
   - Separate data fetching and state management from presentation
   - Create container components to handle data and state
   - Create presentation components focused on rendering UI

3. **Custom Hooks**
   - Extract complex logic into custom hooks
   - Move business logic out of components
   - Create reusable hooks for common patterns

4. **Atomic Design**
   - Reorganize components according to atomic design principles
   - Identify atoms, molecules, organisms, templates, and pages
   - Create a clear component hierarchy

## Prioritized Component List

### Phase 1: Top 10 Largest Components

1. **ExamContainer.tsx** (1061 lines)
   - Split into multiple smaller components
   - Extract exam logic into custom hooks
   - Apply container/presentation pattern

2. **JsonExamUploader.tsx** (882 lines)
   - Extract file processing logic into hooks
   - Create step-by-step UI components
   - Separate preview and upload components

3. **exam/progress/page.tsx** (867 lines)
   - Break into smaller page sections
   - Extract data fetching into custom hooks
   - Create reusable UI components for exam progress

4. **sidebar.tsx** (800 lines)
   - Split by navigation section
   - Create atomic components for menu items
   - Extract state management to custom hooks

5. **RegisterForm.tsx** (737 lines)
   - Split form into logical sections
   - Extract validation logic to custom hooks
   - Create reusable form field components

6. **ManualPaymentsAdminDashboard.tsx** (704 lines)
   - Break into dashboard sections
   - Extract table and filtering components
   - Create components for different payment states

7. **ExamQuestions.tsx** (687 lines)
   - Create separate components for question types
   - Extract question management logic to hooks
   - Apply container/presentation pattern

8. **ManualPaymentForm.tsx** (603 lines)
   - Split form into logical sections
   - Extract payment processing logic to hooks
   - Create reusable form field components

9. **mcqExamStore.ts** (532 lines)
   - Split store into logical domains
   - Extract related actions and state into separate stores
   - Create selector hooks for accessing state

10. **exam/practice/page.tsx** (519 lines)
    - Break into smaller page sections
    - Extract data fetching into custom hooks
    - Create reusable UI components for practice exams

### Phase 2: Approach by Module

After addressing the top 10 largest components, we'll continue refactoring by module:

1. **Exams Module**
   - Focus on remaining exam components
   - Extract common patterns to shared components
   - Create atomic design hierarchy for exam components

2. **Auth Module**
   - Refactor remaining auth forms
   - Extract common validation and authentication logic
   - Create reusable form components

3. **Payments Module**
   - Address payment form components
   - Extract payment processing logic
   - Create reusable payment UI components

4. **Dashboard Module**
   - Break down dashboard components
   - Extract data visualization components
   - Create reusable dashboard widgets

## Function Refactoring

We will also address oversized functions using these strategies:

1. **Function Extraction**
   - Split large functions into smaller, focused ones
   - Create helper functions for repeated logic
   - Apply single responsibility principle

2. **Conditional Refactoring**
   - Extract complex conditionals to readable functions
   - Create declarative helper functions
   - Use early returns to simplify logic

3. **Model Transformation**
   - Create dedicated transformer functions
   - Extract data processing logic
   - Implement pure functions for data operations

## Implementation Plan

1. **Analysis & Setup** (Complete)
   - Create script to identify oversized components
   - Generate report of component sizes
   - Create prioritized refactoring plan

2. **Phase 1: Top 10 Components**
   - Refactor each component one by one
   - Create PRs for each refactored component
   - Update tests to match refactored components

3. **Phase 2: Module-by-Module**
   - Address remaining components by module
   - Update module structure to follow atomic design
   - Document patterns and best practices

4. **Documentation & Review**
   - Update component documentation
   - Create examples of refactoring patterns
   - Review and verify refactored components

## Tracking Progress

We will track our progress using JIRA tickets:

- PHAR-353: Apply Component Size Limitations
- PHAR-355: Apply Single Responsibility Principle
- PHAR-356: Apply Hierarchical Composition with Atomic Design

## Conclusion

By following this refactoring plan, we aim to bring all components and functions into compliance with our architecture principles. This will result in a more maintainable, testable, and understandable codebase.
