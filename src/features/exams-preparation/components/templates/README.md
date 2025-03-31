# Template Components

This directory contains layout components that define the structure of pages or major sections of the UI. Templates arrange organisms, molecules, and atoms to create complete interfaces.

## Components

### ExamContainer

A top-level container that manages the exam-taking experience.

- Uses core Card and Button components from '@/components/ui/...'
- Composes ExamLayout, ExamQuestion, ExamTimer, ExamMetadata, and ExamAlertDialog
- Manages exam state and question navigation
- Provides exam completion and time-up dialogs

### ExamLayout

A flexible layout component for exam-related pages.

- Uses core Card component from '@/components/ui/card'
- Provides optional header, sidebar, and footer sections
- Handles loading and error states
- Creates responsive layouts with proper grid structure

### ExamResults

Displays exam results with score information and question review.

- Uses core Card, Button, and Tabs components from '@/components/ui/...'
- Composes with ExamQuestion organism
- Provides score overview and question statistics
- Enables filtering questions by answer status

## Usage Guidelines

1. Templates should arrange organisms, molecules, and atoms into complete interfaces
2. Leverage core UI components from '@/components/ui/...'
3. Focus on layout and structure rather than detailed functionality
4. Handle responsive design concerns
5. Maintain clear sections (header, sidebar, main content, footer)
6. Keep page-level state management clean and focused
7. Provide consistent layouts across similar views
8. Consider accessibility in layout design
