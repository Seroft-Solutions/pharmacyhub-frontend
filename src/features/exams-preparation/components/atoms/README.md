# Atoms Components

This directory contains atomic UI components for the exams-preparation feature. These are the smallest building blocks that can be composed to create more complex UI components.

## Components

### ExamStatusBadge

A badge component that displays the status of an exam with appropriate styling.

- Uses the core Badge component from '@/components/ui/badge'
- Provides appropriate styling based on exam status

### ErrorState

Displays error messages with an optional retry button.

- Uses the core Button component from '@/components/ui/button'
- Provides consistent error state UI across the feature

### EmptyState

Displays a message when no items are found.

- Simple component for empty states
- Customizable icon and message

### LoadingState

Displays a loading indicator with an optional message.

- Uses the core Spinner component from '@/components/ui/spinner'
- Provides consistent loading state UI across the feature

### TimeRemainingComponent

Displays formatted time remaining for exams.

- Custom component for displaying time in different formats
- Support for different size variants and status indicators

## Usage Guidelines

1. Atoms should be small, focused components with a single responsibility
2. Leverage core UI components from '@/components/ui/...' whenever possible
3. Avoid duplicating functionality available in core components
4. Keep components under 200 lines of code
5. Document props and usage patterns in component comments
- Basic UI elements like badges, indicators, buttons specific to exams
- Simple display components with minimal props and functionality
- Components that have a single responsibility
- Components that don't depend on other feature-specific components

## Examples

- Status badges (ExamStatusBadge)
- Loading indicators (LoadingState)
- Error displays (ErrorState)
- Empty state displays (EmptyState)
- Network status indicators (NetworkStatusIndicator)
- Time display components (TimeRemainingComponent)

## Guidelines

- Keep atoms small and focused (< 100 lines)
- Avoid business logic in atoms
- Atoms should be highly reusable
- Atoms can use core UI components but not other feature components
