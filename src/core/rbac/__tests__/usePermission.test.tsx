import { renderHook } from '@testing-library/react-hooks';
import { RBACProvider } from '../contexts/RBACProvider';
import { usePermission } from '../hooks/usePermission';
import React from 'react';
import { UserPermissions } from '../types';

// Mock wrapper for the hook
const wrapper = ({ children, initialPermissions }: { children: React.ReactNode; initialPermissions: UserPermissions }) => (
  <RBACProvider initialPermissions={initialPermissions}>
    {children}
  </RBACProvider>
);

describe('usePermission hook', () => {
  const mockPermissions: UserPermissions = {
    permissions: ['READ_USERS', 'EDIT_USERS'],
    roles: ['USER']
  };

  it('should return true for a permission the user has', () => {
    const { result } = renderHook(() => usePermission('READ_USERS'), {
      wrapper: ({ children }) => wrapper({ children, initialPermissions: mockPermissions })
    });
    
    expect(result.current.hasPermission).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should return false for a permission the user does not have', () => {
    const { result } = renderHook(() => usePermission('DELETE_USERS'), {
      wrapper: ({ children }) => wrapper({ children, initialPermissions: mockPermissions })
    });
    
    expect(result.current.hasPermission).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should handle loading state', () => {
    // Create a mock provider that is still in loading state
    const LoadingWrapper = ({ children }: { children: React.ReactNode }) => (
      <RBACProvider initialPermissions={mockPermissions} initializeImmediately={false}>
        {children}
      </RBACProvider>
    );
    
    const { result } = renderHook(() => usePermission('READ_USERS'), {
      wrapper: LoadingWrapper
    });
    
    expect(result.current.hasPermission).toBe(false);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should throw error when throwOnError is true and permission check fails', () => {
    // We need to mock console.error to avoid cluttering test output
    const originalError = console.error;
    console.error = jest.fn();
    
    expect(() => {
      renderHook(
        () => usePermission('DELETE_USERS', { throwOnError: true }),
        {
          wrapper: ({ children }) => wrapper({ children, initialPermissions: mockPermissions })
        }
      );
    }).toThrow(/Permission denied/);
    
    // Restore console.error
    console.error = originalError;
  });
});
