import React from 'react';
import { render, screen } from '@testing-library/react';
import { RBACProvider } from '../contexts/RBACProvider';
import { useRBAC } from '../hooks/useRBAC';
import { UserPermissions } from '../types';

// Test component that uses the RBAC context
function TestComponent() {
  const { isInitialized, isLoading } = useRBAC();
  
  return (
    <div>
      <div data-testid="initialized">{isInitialized ? 'true' : 'false'}</div>
      <div data-testid="loading">{isLoading ? 'true' : 'false'}</div>
    </div>
  );
}

describe('RBACProvider', () => {
  const mockPermissions: UserPermissions = {
    permissions: ['READ_USERS'],
    roles: ['USER']
  };

  it('should initialize RBAC context with provided permissions', () => {
    render(
      <RBACProvider initialPermissions={mockPermissions}>
        <TestComponent />
      </RBACProvider>
    );
    
    expect(screen.getByTestId('initialized').textContent).toBe('true');
    expect(screen.getByTestId('loading').textContent).toBe('false');
  });

  it('should not initialize when initializeImmediately is false', () => {
    render(
      <RBACProvider initialPermissions={mockPermissions} initializeImmediately={false}>
        <TestComponent />
      </RBACProvider>
    );
    
    expect(screen.getByTestId('initialized').textContent).toBe('false');
    expect(screen.getByTestId('loading').textContent).toBe('true');
  });

  it('should throw error when useRBAC is used outside provider', () => {
    // Suppress error output during test
    const originalError = console.error;
    console.error = jest.fn();
    
    expect(() => {
      render(<TestComponent />);
    }).toThrow(/useRBAC must be used within an RBACProvider/);
    
    // Restore console.error
    console.error = originalError;
  });
});
