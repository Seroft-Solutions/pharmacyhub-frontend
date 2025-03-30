# Exams Preparation Components

This directory contains UI components for the exams-preparation feature, organized according to atomic design principles.

## Atomic Design Structure

- **atoms/** - Basic UI elements (buttons, inputs, icons, etc.)
- **molecules/** - Combinations of atoms (form fields, search bars, etc.)
- **organisms/** - Collections of molecules forming a section (data tables, forms, etc.)
- **templates/** - Page layouts composed of organisms

## Additional Categories

- **admin/** - Admin-specific components (to be reorganized into atomic design categories)
- **guards/** - Components for access control (to be reorganized into atomic design categories)
- **navigation/** - Navigation components (to be reorganized into atomic design categories)

## Core Integration

Components in this directory should:

- Use core UI component library for atomic components
- Follow established patterns for styling and behavior
- Maintain size limitations (<200 lines)
- Have a single responsibility
- Be independently testable

## Usage Guidelines

1. Keep components small and focused
2. Use composition over inheritance
3. Minimize props (max 7-8 props per component)
4. Use TypeScript interfaces to strictly type all props
5. Export components through index.ts files
