# React Context Guidelines

This document explains when and how to use React Context for state management.

## When to Use React Context

React Context is best suited for:

1. **Simple, infrequently updating UI state**:
   - Theme/appearance preferences
   - UI layout preferences
   - Feature-specific UI settings
   - Form state within a complex form

2. **Deeply nested component trees**:
   - When props would need to be passed through many layers of components
   - Feature-specific contexts that are only needed in a specific part of the application

3. **Static or semi-static configuration**:
   - Application configuration that doesn't change frequently
   - Feature flags and toggles
   - Internationalization (i18n) providers

## When NOT to Use React Context

React Context is NOT suitable for:

1. **Frequently changing state**:
   - State that updates on every keystroke
   - State that updates on mouse movements
   - High-frequency UI animations

2. **Complex state logic**:
   - State with complex update logic
   - State with many interdependent values
   - State that requires middleware (like persistence, undo/redo)

3. **Global application state**:
   - User authentication state (use Zustand instead)
   - Application-wide data models (use TanStack Query instead)
   - Shopping carts or other data that needs to persist

## Choosing Between Context, Zustand, and TanStack Query

| Type of State               | Recommended Solution |
|-----------------------------|----------------------|
| Server/API data             | TanStack Query       |
| Complex client state        | Zustand              |
| Simple UI preferences       | React Context        |
| Global app state            | Zustand              |
| Component-specific UI state | React Context        |
| Authentication state        | Zustand              |
| Form state                  | React Context        |

## Context Implementation Pattern

All React Context implementations should follow the pattern in `ContextTemplate.tsx`. This pattern includes:

1. A **Context interface** that defines the state and methods
2. A **Provider component** that manages the state and provides it to its children
3. A **Custom hook** for consuming the context
4. **Error handling** for when the context is used outside of the provider
5. **Memoization** of context values to prevent unnecessary re-renders

## Best Practices

1. **Memoize context values**:
   - Always use `useMemo` to memoize the context value
   - Only include values in the dependency array that are part of the context value

2. **Wrap methods in useCallback**:
   - Use `useCallback` for all methods in the context value
   - This prevents unnecessary re-renders of consuming components

3. **Use proper TypeScript typing**:
   - Define clear interfaces for the context value and provider props
   - Make sure the context is generic enough to be reusable but specific enough to be type-safe

4. **Split large contexts**:
   - If a context grows too large, consider splitting it into multiple smaller contexts
   - Keep related state and methods together in the same context

5. **Provide clear error messages**:
   - Always provide clear error messages for when the context is used outside of the provider
   - Include the component name in the error message

6. **Don't overuse Context**:
   - Default to component props and local state when possible
   - Only use Context when prop drilling becomes cumbersome

## Example Usage

### 1. Create a context and provider:

```tsx
// MyFeatureContext.tsx
import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';

// Define the context interface
interface MyFeatureContextType {
  isOpen: boolean;
  toggle: () => void;
  setValue: (value: string) => void;
  value: string;
}

// Create the context
const MyFeatureContext = createContext<MyFeatureContextType | undefined>(undefined);

// Define the provider props
interface MyFeatureProviderProps {
  initialValue?: string;
  children: ReactNode;
}

// Create the provider component
export function MyFeatureProvider({ initialValue = '', children }: MyFeatureProviderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const handleSetValue = useCallback((newValue: string) => {
    setValue(newValue);
  }, []);

  // Memoize the context value
  const contextValue = useMemo(() => ({
    isOpen,
    toggle,
    value,
    setValue: handleSetValue
  }), [isOpen, toggle, value, handleSetValue]);

  return (
    <MyFeatureContext.Provider value={contextValue}>
      {children}
    </MyFeatureContext.Provider>
  );
}

// Create the hook for consuming the context
export function useMyFeature() {
  const context = useContext(MyFeatureContext);
  if (context === undefined) {
    throw new Error('useMyFeature must be used within a MyFeatureProvider');
  }
  return context;
}
```

### 2. Use the context in components:

```tsx
// MyFeatureComponent.tsx
import React from 'react';
import { useMyFeature } from './MyFeatureContext';

export function MyFeatureComponent() {
  const { isOpen, toggle, value, setValue } = useMyFeature();

  return (
    <div>
      <button onClick={toggle}>
        {isOpen ? 'Close' : 'Open'}
      </button>
      
      {isOpen && (
        <div>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <p>Current value: {value}</p>
        </div>
      )}
    </div>
  );
}
```

### 3. Wrap the component tree with the provider:

```tsx
// MyFeaturePage.tsx
import React from 'react';
import { MyFeatureProvider } from './MyFeatureContext';
import { MyFeatureComponent } from './MyFeatureComponent';

export function MyFeaturePage() {
  return (
    <MyFeatureProvider initialValue="Hello, World!">
      <div>
        <h1>My Feature</h1>
        <MyFeatureComponent />
      </div>
    </MyFeatureProvider>
  );
}
```