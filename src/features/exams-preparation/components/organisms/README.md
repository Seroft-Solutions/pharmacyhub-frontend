# Organism Components

This directory contains larger components that are composed of multiple molecules, atoms, and core UI components working together to form distinct sections of the UI.

## Components

### ExamQuestion

A component for displaying and interacting with exam questions.

- Uses core Card, RadioGroup, Label, and Button components from '@/components/ui/...'
- Handles question state, options selection, and review mode
- Provides explanation visibility toggling
- Shows correct/incorrect answers in review mode

### ExamsPagination

Provides navigation between pages of content.

- Uses core Pagination components from '@/components/ui/pagination'
- Handles page calculation and navigation logic
- Provides smart ellipsis for large page counts

### ExamsTable

Displays exam data in a tabular format with actions.

- Uses core Table components from '@/components/ui/table'
- Uses core Button component from '@/components/ui/button'
- Composes with ExamStatusBadge atom
- Provides view/edit/delete actions
- Handles conditional column rendering

## Usage Guidelines

1. Organisms should compose multiple molecules, atoms, and core UI components
2. Leverage core UI components from '@/components/ui/...'
3. Compose with atom and molecule components from the feature
4. Organisms can contain more complex state management
5. Maintain single responsibility principle at the section level
6. Keep components under 200 lines of code
7. Consider splitting larger organisms into multiple components
8. Organisms should not contain page-level layout concerns
