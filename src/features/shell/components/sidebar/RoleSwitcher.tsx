"use client";

import React from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";
import { useAuth } from "@/features/auth/hooks";

interface RoleSwitcherProps {
  role: 'user' | 'admin';
  onRoleChange: (role: 'user' | 'admin') => void;
}

export function RoleSwitcher({ role, onRoleChange }: RoleSwitcherProps) {
  const { hasRole } = useAuth();
  const isAdmin = hasRole('ADMIN');
  
  if (!isAdmin) return null;

  const handleToggle = (checked: boolean) => {
    onRoleChange(checked ? 'admin' : 'user');
  };

  return (
    <div className="flex items-center space-x-2 px-4 py-3 border-b">
      <Shield className="h-4 w-4 text-muted-foreground" />
      <Label htmlFor="role-switch" className="text-sm font-medium">
        Admin Mode
      </Label>
      <Switch 
        id="role-switch"
        checked={role === 'admin'}
        onCheckedChange={handleToggle}
      />
    </div>
  );
}
