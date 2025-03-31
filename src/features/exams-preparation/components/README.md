# Exam Preparation Components

This directory contains components for the Exam Preparation feature, organized according to atomic design principles.

## Directory Structure

- **atoms**: The smallest building blocks (buttons, inputs, badges)
- **molecules**: Simple combinations of atoms (headers, cards, navigation)
- **organisms**: Complex UI sections (question displays, sidebars, dialogs)
- **templates**: Page layouts and containers
- **admin**: Admin-specific components
- **navigation**: Navigation components (not currently used)
- **guards**: Permission and access control components

## Component Organization

### Atoms
- `EmptyState`: Displays when no data is available
- `ErrorState`: Displays when an error occurs
- `ExamStatusBadge`: Badge showing exam status
- `LoadingState`: Loading indicator
- `TimeRemainingComponent`: Shows time remaining in an exam

### Molecules
- `ExamAlertDialog`: Confirmation dialogs for exam actions
- `ExamHeader`: Displays exam title, description, and time
- `ExamMetadata`: Shows metadata about an exam
- `ExamPaperCard`: Card displaying exam paper information
- `ExamQuestionNavigation`: Navigation buttons for moving between questions
- `ExamScoreOverview`: Overview of exam scores
- `ExamStatistics`: Displays exam statistics
- `ExamTimer`: Timer component for exams

### Organisms
- `ExamDialogs`: Manages all the dialogs related to exams
- `ExamQuestion`: Displays a single exam question with options
- `ExamQuestionCard`: Card containing question and navigation
- `ExamResultsTabs`: Tabbed interface for viewing exam results
- `ExamSidebar`: Sidebar for exam navigation and overview
- `ExamsPagination`: Pagination component for exam lists
- `ExamsTable`: Table displaying a list of exams

### Templates
- `ExamContainer`: Main container for the exam taking experience
- `ExamLayout`: Overall layout for exam-related pages
- `ExamResults`: Displays exam results after completion

## Core Component Integration

This feature follows the "Core as Foundation" principle, leveraging core UI components wherever possible:

- Uses `Card`, `CardHeader`, `CardContent`, and `CardFooter` from UI library
- Uses `Button` components from core UI
- Uses `AlertDialog` for confirmation dialogs
- Uses core layout components for structural elements

## Component Composition

Components are composed following a hierarchical pattern:

1. Templates use organisms and molecules
2. Organisms use molecules and atoms
3. Molecules use atoms
4. Atoms use core UI components

This composition pattern ensures each component has a single responsibility and remains under the 200-line limit.
