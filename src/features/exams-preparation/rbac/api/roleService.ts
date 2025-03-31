/**
 * RBAC Role Service
 * 
 * Client-side service for fetching role and permission data from the Spring Boot backend.
 * This service handles the communication with the backend API for RBAC-related operations.
 */
import { apiClient } from '@/core/api';
import { ExamOperation, ExamOperationContext } from '../types';

/**
 * Check if the current user has permission for an operation
 * 
 * @param operation The operation to check permission for
 * @param context Additional context for the permission check
 * @returns Promise resolving to whether the user has permission
 */
export async function checkPermission(
  operation: ExamOperation,
  context?: ExamOperationContext
): Promise<boolean> {
  try {
    const response = await apiClient.post('/api/rbac/check-permission', {
      operation,
      context
    });
    
    return response.data.hasPermission;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

/**
 * Check if the current user has a specific role
 * 
 * @param role The role to check for
 * @returns Promise resolving to whether the user has the role
 */
export async function checkRole(role: string): Promise<boolean> {
  try {
    const response = await apiClient.post('/api/rbac/check-role', {
      role
    });
    
    return response.data.hasRole;
  } catch (error) {
    console.error('Error checking role:', error);
    return false;
  }
}

/**
 * Get all roles for the current user
 * 
 * @returns Promise resolving to an array of role names
 */
export async function getUserRoles(): Promise<string[]> {
  try {
    const response = await apiClient.get('/api/rbac/user-roles');
    return response.data.roles;
  } catch (error) {
    console.error('Error fetching user roles:', error);
    return [];
  }
}

/**
 * Get all permissions for the current user
 * 
 * @returns Promise resolving to an array of permission names
 */
export async function getUserPermissions(): Promise<string[]> {
  try {
    const response = await apiClient.get('/api/rbac/user-permissions');
    return response.data.permissions;
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return [];
  }
}

/**
 * Check if the user can access a specific exam
 * 
 * @param examId The ID of the exam to check access for
 * @param operation The operation to check
 * @returns Promise resolving to whether the user has access
 */
export async function checkExamAccess(
  examId: string | number,
  operation: ExamOperation
): Promise<boolean> {
  try {
    const response = await apiClient.post('/api/exams/check-access', {
      examId,
      operation
    });
    
    return response.data.hasAccess;
  } catch (error) {
    console.error('Error checking exam access:', error);
    return false;
  }
}
