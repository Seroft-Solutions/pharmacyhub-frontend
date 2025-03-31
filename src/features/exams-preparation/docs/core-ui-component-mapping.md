# Core UI Component Mapping for Exams Feature

This document outlines how the Exams feature leverages core UI components as part of the "Core as Foundation" architecture principle.

## Component Mapping

### Direct Usage of Core UI Components

| Core Component | Used In | Purpose |
|----------------|---------|---------|
| `Button` | `ExamQuestionNavigation` | Navigation controls |
| `Card` | `ExamQuestionCard`, `ExamQuestion` | Content container |
| `CardHeader` | `ExamQuestion` | Question title area |
| `CardContent` | `ExamQuestionCard`, `ExamQuestion` | Question content |
| `CardFooter` | `ExamQuestionCard`, `ExamQuestion` | Navigation controls |
| `AlertDialog` | `ExamAlertDialog` | Confirmation dialogs |
| `RadioGroup` | `ExamQuestion` | Multiple choice options |
| `Spinner` | `LoadingState` | Loading indicator |

### Extended Core Components

| Feature Component | Extends Core Component | Purpose |
|-------------------|-------------------------|---------|
| `ExamAlertDialog` | `AlertDialog` | Standardized dialog for exam confirmations |
| `ExamStatusBadge` | `Badge` | Custom badge for exam statuses |
| `EmptyState` | Core feedback patterns | Standardized empty state display |
| `ErrorState` | Core feedback patterns | Standardized error display |

## Atomic Design Organization

### Atoms (Basic UI Elements)
- `EmptyState`: Uses core layout patterns
- `ErrorState`: Uses core layout and Button
- `ExamStatusBadge`: Uses core Badge
- `LoadingState`: Uses core Spinner
- `TimeRemainingComponent`: Uses core text styling

### Molecules (Combinations of Atoms)
- `ExamAlertDialog`: Uses core AlertDialog
- `ExamHeader`: Uses core headings and text
- `ExamMetadata`: Uses core Card, text elements
- `ExamPaperCard`: Uses core Card components
- `ExamQuestionNavigation`: Uses core Button, layout
- `ExamTimer`: Uses core layout, text

### Organisms (Complex UI Sections)
- `ExamDialogs`: Composes ExamAlertDialog
- `ExamQuestion`: Uses core Card, RadioGroup
- `ExamQuestionCard`: Uses core Card, composes ExamQuestion
- `ExamSidebar`: Uses core layout, Badge, Button

### Templates (Page Layouts)
- `ExamContainer`: Uses core layout containers
- `ExamLayout`: Uses core layout grid system

## Component Breakdown Implementation

As part of the refactoring process for PHAR-436, several improvements were made to break down large components into smaller, more maintainable pieces:

1. `ExamContainer.tsx` was refactored to:
   - Extract business logic to `useExamSession.ts` hook
   - Extract navigation to `ExamQuestionNavigation.tsx`
   - Extract dialog management to `ExamDialogs.tsx`
   - Make the container a pure orchestration component

2. Component responsibilities were clarified:
   - `ExamQuestionNavigation`: Only handling navigation UI
   - `ExamQuestionCard`: Only question display and composition
   - `ExamDialogs`: Only dialog UI management
   - `useExamSession`: All business logic

3. Core UI integration improvements:
   - Consistency in using core Card components
   - Direct use of core Button components
   - Standardized dialog patterns

This refactoring ensures that all components follow the single responsibility principle, remain under the 200-line limit, and properly leverage core UI components instead of duplicating functionality.
