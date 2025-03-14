"use client";

import React from 'react';
import { cn } from "@/lib/utils";
import { ShieldCheck, User, Shield } from "lucide-react";

interface RoleSwitcherProps {
  role: 'user' | 'admin' | 'super_admin';
  onRoleChange: (role: 'user' | 'admin' | 'super_admin') => void;
}

/**
 * RoleSwitcher component - A toggle to switch between admin and user interfaces
 * Only visible to users with admin permissions
 */
export function RoleSwitcher({
                               role,
                               onRoleChange
                             }: RoleSwitcherProps) {
  // Check if the user has SUPER_ADMIN role from JWT
  const hasSuperAdminRole = () => {
    try {
      const authToken = localStorage.getItem('auth_token') || localStorage.getItem('access_token');
      if (authToken) {
        // Get the payload part of the JWT
        const payloadBase64 = authToken.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));
        return payload.roles && payload.roles.includes('SUPER_ADMIN');
      }
      return false;
    } catch (error) {
      console.error('Error checking for SUPER_ADMIN role:', error);
      return false;
    }
  };

  const showSuperAdmin = hasSuperAdminRole();

  return (
    <div className="flex items-center justify-between px-3 py-2 border-b">
      <span className="text-xs font-medium text-muted-foreground">View as:</span>
      <div className="flex items-center gap-1 p-1 bg-muted rounded-md">
        <button
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-colors",
            role === 'user'
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => onRoleChange('user')}
        >
          <User className="h-3 w-3" />
          User
        </button>
        <button
          className={cn(
            "flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium transition-colors",
            role === 'admin'
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          onClick={() => onRoleChange('admin')}
        >
          <ShieldCheck className="h-3 w-3" />
          Admin
        </button>
      </div>
    </div>
  );
}
