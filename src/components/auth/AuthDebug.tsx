"use client";

import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { Permission, Role } from "@/types/auth";

export function AuthDebug() {
  const { user, isAuthenticated, hasPermission, hasRole } = useAuth();
  const [testPermission, setTestPermission] = useState("");
  const [testRole, setTestRole] = useState("");

  const checkPermission = (permission: string) => {
    return hasPermission(permission as Permission);
  };

  const checkRole = (role: string) => {
    return hasRole(role as Role);
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white rounded-lg shadow-lg border w-96">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Auth Debug Panel</h3>
        <div className={`h-2 w-2 rounded-full ${isAuthenticated ? 'bg-green-500' : 'bg-red-500'}`} />
      </div>

      {/* User Info */}
      <div className="space-y-2 mb-4">
        <div className="text-sm">
          <span className="font-medium">User:</span>{" "}
          {user?.email || "Not authenticated"}
        </div>
        <div className="text-sm">
          <span className="font-medium">Roles:</span>{" "}
          {user?.roles?.join(", ") || "None"}
        </div>
        <div className="text-sm">
          <span className="font-medium">Permissions:</span>{" "}
          {user?.permissions?.join(", ") || "None"}
        </div>
      </div>

      {/* Permission Tester */}
      <div className="space-y-2 mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={testPermission}
            onChange={(e) => setTestPermission(e.target.value)}
            placeholder="Test permission..."
            className="text-sm p-1 border rounded flex-1"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm">Has Permission:</span>
            <div 
              className={`h-2 w-2 rounded-full ${
                testPermission && checkPermission(testPermission)
                  ? 'bg-green-500' 
                  : 'bg-red-500'
              }`} 
            />
          </div>
        </div>
      </div>

      {/* Role Tester */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            value={testRole}
            onChange={(e) => setTestRole(e.target.value)}
            placeholder="Test role..."
            className="text-sm p-1 border rounded flex-1"
          />
          <div className="flex items-center gap-2">
            <span className="text-sm">Has Role:</span>
            <div 
              className={`h-2 w-2 rounded-full ${
                testRole && checkRole(testRole)
                  ? 'bg-green-500' 
                  : 'bg-red-500'
              }`} 
            />
          </div>
        </div>
      </div>

      {/* Current Path */}
      <div className="mt-4 text-sm text-gray-500">
        Path: {typeof window !== 'undefined' ? window.location.pathname : ''}
      </div>
    </div>
  );
}