# UI Component Integration Guide for Exams Preparation

This guide documents how the exams-preparation feature integrates with UI components, following the Core as Foundation principle while leveraging shadcn/ui components.

## Overview

The exams-preparation feature uses a mix of:
1. shadcn/ui components from `@/components/ui`
2. Custom components built specifically for exam functionality

## Shadcn/UI Integration

Shadcn/UI components are imported directly from the `@/components/ui` directory:

```typescript
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
// ... other shadcn components
```

This is the correct approach for shadcn/ui components, as they are meant to be imported from this location.

## Atomic Design Principles

The exams-preparation feature organizes components following atomic design principles:

1. **Atoms** (`src/features/exams-preparation/components/atoms`)
   - Smallest UI elements (ExamStatusBadge, EmptyState, etc.)
   - May compose shadcn/ui components with exam-specific logic

2. **Molecules** (`src/features/exams-preparation/components/molecules`)
   - Combinations of atoms (ExamPaperCard, ExamTimer, etc.)
   - More complex but still focused components

3. **Organisms** (`src/features/exams-preparation/components/organisms`)
   - Collections of molecules (ExamQuestion, ExamsTable, etc.)
   - Complete functional sections

4. **Templates** (`src/features/exams-preparation/components/templates`)
   - Page layouts (ExamContainer, ExamLayout, etc.)
   - Arrange organisms into complete pages

## Examples of Component Integration

### Atomic Components with shadcn/ui

```typescript
// ExamStatusBadge.tsx
import { Badge, BadgeProps } from "@/components/ui/badge";

export const ExamStatusBadge: React.FC<ExamStatusBadgeProps> = ({ status, size = 'md', className = '' }) => {
  const getVariant = (status: ExamStatus): BadgeProps['variant'] => {
    // Determine variant based on status
  };

  return (
    <Badge 
      variant={getVariant(status)} 
      className={`${sizeClasses} ${className}`}
    >
      {getLabel(status)}
    </Badge>
  );
};
```

### Error State Component with shadcn/ui

```typescript
// ErrorState.tsx
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = 'Something went wrong. Please try again.',
  icon = <AlertCircle className="h-12 w-12 text-red-500" />,
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 text-center ${className}`}>
      <div className="mb-4">{icon}</div>
      <p className="text-gray-700 mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
```

## Best Practices

### Component Composition

1. **Prefer Composition Over Inheritance**
   - Compose shadcn/ui components rather than extending them
   - Use props to customize behavior and appearance

2. **Pass Through Props**
   - Use prop spreading or explicit props to pass through customization options
   - Support common props like `className` for style customization

3. **Minimize Style Overrides**
   - Use shadcn/ui variants when possible
   - Use Tailwind utilities for additional styling
   - Avoid applying custom styles that override shadcn/ui's default styles

### Styling Integration

1. **Follow Design System Theme Variables**
   - Use theme variables from shadcn/ui when possible
   - Match color schemes and spacing with the design system

2. **Use Tailwind Classes Consistently**
   - Follow project conventions for Tailwind classes
   - Group related classes together
   - Use template literals for conditional classes

## When to Create Custom Components

Create custom components when:

1. The UI pattern is specific to the exams-preparation feature
2. The component combines multiple shadcn/ui components with specific logic
3. The component needs state management that's tied to exam functionality

Example of justified custom component:

```typescript
// TimeRemainingComponent.tsx
export const TimeRemainingComponent: React.FC<TimeRemainingComponentProps> = ({
  timeRemaining,
  className = '',
  variant = 'default',
  showIcon = false,
}) => {
  const formattedTime = formatTimeVerbose(timeRemaining);
  const isLowTime = timeRemaining < 300; // less than 5 minutes
  
  // Custom logic for time formatting and styling
  // This justifies a custom component
  
  return (
    <div className={`${baseClasses} ${sizeClasses} ${colorClasses} ${className}`}>
      {showIcon && <span className="inline-block mr-2">⏱️</span>}
      {formattedTime}
    </div>
  );
};
```

## Component Testing

Test components using React Testing Library:

```typescript
import { render, screen } from '@testing-library/react';
import { ExamStatusBadge } from './ExamStatusBadge';

describe('ExamStatusBadge', () => {
  it('renders correct label for published status', () => {
    render(<ExamStatusBadge status="published" />);
    expect(screen.getByText('Published')).toBeInTheDocument();
  });
  
  // More tests...
});
```

## Future Improvements

As the core UI library evolves:

1. Consider moving commonly used patterns from the exams-preparation feature to the core UI library
2. Regularize usage of similar components across features
3. Ensure consistent prop naming between similar components
