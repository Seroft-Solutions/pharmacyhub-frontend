/**
 * Exam Server-Side RBAC
 * 
 * This module provides server-side RBAC utilities for the exams feature.
 * It includes middleware, API route protection, and server component protection.
 */

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { ExamOperation, OperationPermissionMap, ExamOperationContext } from '../types';

/**
 * Get the session from cookies
 * This is a simplified version - integrate with your actual auth system
 */
async function getSession(requestCookies: any) {
  try {
    // Get the session cookie
    const sessionCookie = requestCookies.get('auth-token')?.value;
    
    if (!sessionCookie) {
      return null;
    }
    
    // Verify the session
    // This is placeholder code - replace with your actual auth logic
    const session = { 
      userId: 'user-id',
      // Add other session data as needed
    };
    
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Check if a user has a permission on the server side
 * This is a simplified version - integrate with your actual RBAC system
 */
async function checkServerPermission(userId: string, permission: string, context?: ExamOperationContext) {
  try {
    // Placeholder implementation - replace with your actual RBAC check
    // This would typically involve a database or API call
    
    // For example:
    // const result = await apiClient.post('/api/rbac/check-permission', {
    //   userId,
    //   permission,
    //   context
    // });
    
    // For now, we'll return true by default
    return true;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
}

/**
 * Require exam permission for a server component
 * This function will redirect to login or access denied if permission check fails
 * 
 * @example
 * // In a server component
 * export default async function AdminPage() {
 *   await requireExamPermission(ExamOperation.CREATE_EXAM);
 *   
 *   // If execution continues, user has permission
 *   return <AdminComponent />;
 * }
 */
export async function requireExamPermission(
  operation: ExamOperation,
  context?: ExamOperationContext
) {
  const session = await getSession(cookies());
  
  // Redirect to login if not authenticated
  if (!session) {
    redirect('/login?redirect=exams');
  }
  
  // Get the permissions for this operation
  const permissions = OperationPermissionMap[operation];
  
  // Check permissions
  const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];
  
  // Check each permission
  const permissionResults = await Promise.all(
    permissionsArray.map(permission => 
      checkServerPermission(session.userId, permission, context)
    )
  );
  
  // User needs all permissions
  const hasPermission = permissionResults.every(Boolean);
  
  // Redirect to access denied if permission check fails
  if (!hasPermission) {
    redirect('/access-denied');
  }
}

/**
 * Middleware function to check exam permissions for API routes
 */
export function withExamPermission(
  handler: (req: NextRequest) => Promise<NextResponse>,
  operation: ExamOperation
) {
  return async (req: NextRequest) => {
    try {
      const session = await getSession(req.cookies);
      
      // Return 401 if not authenticated
      if (!session) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }
      
      // Get the permissions for this operation
      const permissions = OperationPermissionMap[operation];
      
      // Check permissions
      const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];
      
      // Check each permission
      const permissionResults = await Promise.all(
        permissionsArray.map(permission => 
          checkServerPermission(session.userId, permission)
        )
      );
      
      // User needs all permissions
      const hasPermission = permissionResults.every(Boolean);
      
      // Return 403 if permission check fails
      if (!hasPermission) {
        return NextResponse.json(
          { error: 'Permission denied' },
          { status: 403 }
        );
      }
      
      // Call the handler if permission check passes
      return handler(req);
    } catch (error) {
      console.error('Error in withExamPermission middleware:', error);
      
      return NextResponse.json(
        { error: 'Server error' },
        { status: 500 }
      );
    }
  };
}

/**
 * Server action permission check
 * Use this for server actions in forms
 */
export async function checkExamPermissionForServerAction(
  operation: ExamOperation,
  context?: ExamOperationContext
) {
  const session = await getSession(cookies());
  
  // Return false if not authenticated
  if (!session) {
    return false;
  }
  
  // Get the permissions for this operation
  const permissions = OperationPermissionMap[operation];
  
  // Check permissions
  const permissionsArray = Array.isArray(permissions) ? permissions : [permissions];
  
  // Check each permission
  const permissionResults = await Promise.all(
    permissionsArray.map(permission => 
      checkServerPermission(session.userId, permission, context)
    )
  );
  
  // User needs all permissions
  return permissionResults.every(Boolean);
}
