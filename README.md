# PharmacyHub Frontend

A modern web application built with Next.js 14+ for managing pharmacy operations.

## Project Structure

```
pharmacyhub-frontend/
├── src/
│   ├── api/                  # API integration layer
│   ├── app/                  # Next.js app directory (routes and layouts)
│   │   ├── (auth)/          # Authentication related routes
│   │   ├── (pages)/         # Application pages
│   │   ├── auth/            # Auth callback handlers
│   │   └── loginCheck/      # Login verification routes
│   ├── components/          
│   │   ├── Home/            # Homepage specific components
│   │   ├── NavigationBar/   # Navigation components
│   │   ├── NavSideBar/      # Sidebar navigation components
│   │   ├── Provider/        # Provider components
│   │   ├── shared/          # Reusable shared components
│   │   └── ui/              # UI components (buttons, inputs, etc.)
│   ├── config/              
│   │   ├── components/      # Component configurations
│   │   └── features/        # Feature flags and role configurations
│   ├── features/            # Feature-based modules
│   │   ├── auth/           
│   │   ├── billing/
│   │   ├── organizations/
│   │   ├── pharmacist/
│   │   ├── roles/
│   │   └── users/
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility libraries
│   ├── providers/          # React context providers
│   ├── services/           # Service layer for API interactions
│   ├── store/             
│   │   ├── react-query/    # React Query configurations
│   │   └── zustand/        # Zustand state management
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── public/                 # Static assets
└── ...config files        # Various configuration files
```

## Key Features

- **Role-Based Access Control**: Implemented through features/roles
- **Feature Flags**: Configurable feature toggles
- **Theme Support**: Dark/Light mode with ThemeProvider
- **Form Components**: Reusable form elements
- **API Integration**: Organized service layer
- **State Management**: 
  - React Query for server state
  - Zustand for client state

## Technology Stack

- **Framework**: Next.js 14+
- **Styling**: Tailwind CSS
- **State Management**: 
  - Zustand
  - React Query
- **Form Handling**: React Hook Form
- **UI Components**: shadcn/ui

## Component Architecture

### Shared Components
- `FormField`: Base form input wrapper
- `InputField`: Text input component
- `SelectField`: Dropdown select component
- `RadioButtonField`: Radio button group
- `DialogHeaderField`: Modal header component
- `OptimizedImage`: Optimized image loading component
- `DebouncedSelect`: Performance optimized select input

### Feature Components
Organization by feature modules allows for better code organization and separation of concerns:
- `auth/`: Authentication related components
- `pharmacist/`: Pharmacist management
- `billing/`: Billing and invoicing
- `organizations/`: Organization management
- `users/`: User management

### Navigation
- `NavigationBar/`: Main navigation components
- `NavSideBar/`: Sidebar navigation with role-based menu items
- `UserMenu`: User profile and settings dropdown

## Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

For more information about specific features or components, refer to the documentation in respective directories.
