# Molecules Components

This directory contains components that are composed of multiple atoms or core UI components that work together as a unit.

## Components

### ExamAlertDialog

A customizable alert dialog component for confirmations.

- Uses the core AlertDialog components from '@/components/ui/alert-dialog'
- Provides standardized styling and behavior for confirmation dialogs
- Supports danger variant for destructive actions

### ExamMetadata

Displays metadata about an exam in various formats.

- Uses the core Card component from '@/components/ui/card'
- Supports different display variants (default, compact, detailed)
- Shows information like question count, duration, marks, and dates

### ExamPaperCard

Card component displaying exam paper information with actions.

- Uses core Card, Button, and Badge components
- Composes with ExamStatusBadge atom component
- Handles premium content and payment status visually

### ExamTimer

Manages and displays a countdown timer for exams.

- Uses core Card and Button components
- Composes with TimeRemainingComponent atom
- Handles timer state management and pause/resume functionality

## Usage Guidelines

1. Molecules should combine multiple atoms or core components into a meaningful unit
2. Leverage core UI components from '@/components/ui/...'
3. Compose with atom components from '../atoms/...'
4. Keep molecules focused on a specific piece of UI functionality
5. Maintain single responsibility principle
6. Keep components under 200 lines of code
7. Molecules can have their own state for UI purposes
8. Molecules should not depend on organisms or templates
