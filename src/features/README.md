# Features Directory

This directory contains the main feature modules of the application.

## Organization

Each feature should follow the standardized directory structure:
- `api/`: API-related code, services, and hooks
- `components/`: UI components
- `hooks/`: React hooks specific to the feature
- `types/`: TypeScript type definitions
- `utils/`: Utility functions
- `constants/`: Constants, configuration, etc.
- `context/`: React contexts

## Deprecated Features

The following directories are deprecated and should be moved to the `src/deprecated` folder:

- `auth-new`: Use the main `auth` feature instead
- `shell-new`: Use the main `shell` feature instead
- `shell-proper`: Use the main `shell` feature instead

Due to permission issues, these directories could not be automatically moved. Please run the script at `src/deprecated/move-deprecated-directories.ps1` or `.bat` to complete this move.

## Naming Conventions

- Use PascalCase for React components (e.g., `LoginForm.tsx`)
- Use camelCase for utilities, hooks, and non-component files (e.g., `useAuth.ts`)
- Use camelCase for directories (e.g., `auth`, `exams`, `components`)