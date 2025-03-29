import { rbacService } from '../services/rbacService';
import { UserPermissions } from '../types';

describe('rbacService', () => {
  const mockPermissions: UserPermissions = {
    permissions: ['READ_USERS', 'EDIT_USERS'],
    roles: ['USER', 'EDITOR']
  };

  beforeEach(() => {
    // Reset the service before each test
    rbacService.initialize(mockPermissions);
  });

  describe('permission checks', () => {
    it('should check if user has a permission', () => {
      expect(rbacService.hasPermission('READ_USERS')).toBe(true);
      expect(rbacService.hasPermission('DELETE_USERS')).toBe(false);
    });

    it('should check if user has any of the permissions', () => {
      expect(rbacService.hasAnyPermission(['READ_USERS', 'DELETE_USERS'])).toBe(true);
      expect(rbacService.hasAnyPermission(['CREATE_USERS', 'DELETE_USERS'])).toBe(false);
    });

    it('should check if user has all permissions', () => {
      expect(rbacService.hasAllPermissions(['READ_USERS', 'EDIT_USERS'])).toBe(true);
      expect(rbacService.hasAllPermissions(['READ_USERS', 'DELETE_USERS'])).toBe(false);
    });
  });

  describe('role checks', () => {
    it('should check if user has a role', () => {
      expect(rbacService.hasRole('USER')).toBe(true);
      expect(rbacService.hasRole('ADMIN')).toBe(false);
    });

    it('should check if user has any of the roles', () => {
      expect(rbacService.hasAnyRole(['USER', 'ADMIN'])).toBe(true);
      expect(rbacService.hasAnyRole(['ADMIN', 'MANAGER'])).toBe(false);
    });

    it('should check if user has all roles', () => {
      expect(rbacService.hasAllRoles(['USER', 'EDITOR'])).toBe(true);
      expect(rbacService.hasAllRoles(['USER', 'ADMIN'])).toBe(false);
    });

    // Add test for role inheritance if that feature exists
  });

  describe('general authorization', () => {
    it('should check if user is authorized with mixed roles and permissions', () => {
      expect(rbacService.isAuthorized(['USER', 'READ_USERS'])).toBe(true);
      expect(rbacService.isAuthorized(['ADMIN', 'DELETE_USERS'])).toBe(false);
    });

    it('should check authorization with ALL option', () => {
      expect(rbacService.isAuthorized(['USER', 'READ_USERS'], { all: true })).toBe(true);
      expect(rbacService.isAuthorized(['USER', 'DELETE_USERS'], { all: true })).toBe(false);
    });
  });

  describe('getters', () => {
    it('should return user permissions', () => {
      expect(rbacService.getUserPermissions()).toEqual(mockPermissions.permissions);
    });

    it('should return user roles', () => {
      expect(rbacService.getUserRoles()).toEqual(mockPermissions.roles);
    });
  });

  describe('reinitialize', () => {
    it('should update permissions after reinitialization', () => {
      const newPermissions: UserPermissions = {
        permissions: ['CREATE_USERS', 'DELETE_USERS'],
        roles: ['ADMIN']
      };

      rbacService.initialize(newPermissions);

      expect(rbacService.hasPermission('READ_USERS')).toBe(false);
      expect(rbacService.hasPermission('DELETE_USERS')).toBe(true);
      expect(rbacService.hasRole('USER')).toBe(false);
      expect(rbacService.hasRole('ADMIN')).toBe(true);
    });
  });
});
