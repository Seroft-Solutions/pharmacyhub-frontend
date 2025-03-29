import React from 'react';
import { render, screen } from '@testing-library/react';
import { RBACProvider } from '../contexts/RBACProvider';
import { PermissionGuard } from '../components/PermissionGuard';
import { UserPermissions } from '../types';

describe('PermissionGuard', () => {
  const mockPermissions: UserPermissions = {
    permissions: ['READ_USERS', 'EDIT_USERS'],
    roles: ['USER']
  };

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <RBACProvider initialPermissions={mockPermissions}>
      {children}
    </RBACProvider>
  );

  it('should render children when user has the required permission', () => {
    render(
      <PermissionGuard permissions="READ_USERS">
        <div data-testid="protected-content">Protected Content</div>
      </PermissionGuard>,
      { wrapper }
    );
    
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should render fallback when user does not have the required permission', () => {
    render(
      <PermissionGuard 
        permissions="DELETE_USERS"
        fallback={<div data-testid="fallback-content">Access Denied</div>}
      >
        <div data-testid="protected-content">Protected Content</div>
      </PermissionGuard>,
      { wrapper }
    );
    
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('fallback-content')).toBeInTheDocument();
    expect(screen.getByText('Access Denied')).toBeInTheDocument();
  });

  it('should render nothing when renderNothing is true and permission check fails', () => {
    render(
      <PermissionGuard 
        permissions="DELETE_USERS"
        renderNothing={true}
      >
        <div data-testid="protected-content">Protected Content</div>
      </PermissionGuard>,
      { wrapper }
    );
    
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    // The component should render nothing, so the container should be empty
    expect(screen.queryByText(/./)).toBeNull();
  });

  it('should handle array of permissions with ANY logic by default', () => {
    render(
      <PermissionGuard permissions={['READ_USERS', 'DELETE_USERS']}>
        <div data-testid="protected-content">Protected Content</div>
      </PermissionGuard>,
      { wrapper }
    );
    
    // Should render because user has READ_USERS permission
    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('should handle array of permissions with ALL logic when specified', () => {
    render(
      <PermissionGuard 
        permissions={['READ_USERS', 'DELETE_USERS']}
        options={{ all: true }}
        fallback={<div data-testid="fallback-content">Access Denied</div>}
      >
        <div data-testid="protected-content">Protected Content</div>
      </PermissionGuard>,
      { wrapper }
    );
    
    // Should not render because user doesn't have DELETE_USERS permission
    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('fallback-content')).toBeInTheDocument();
  });
});
