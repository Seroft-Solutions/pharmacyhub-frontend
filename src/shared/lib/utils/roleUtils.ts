// src/utils/roleUtils.ts
import roles from '../config/roles.json';

export function getRole(module: keyof typeof roles, action: string): string {
  return roles[module][action];
}

export function hasRole(userRoles: string[], module: keyof typeof roles, action: string): boolean {
  const requiredRole = getRole(module, action);
  return userRoles.includes(requiredRole);
}