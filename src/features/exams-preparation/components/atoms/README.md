# Atoms

This directory contains the most basic UI components that cannot be broken down any further without losing their functionality.

## What to place here

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
