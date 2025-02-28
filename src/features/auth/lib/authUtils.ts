import { jwtDecode } from 'jwt-decode';
import { Permission, Role } from '../model/types';

interface JWTPayload {
  sub: string;
  email: string;
  roles?: string[];
  authorities?: string[];
  scope?: string;
  permissions?: string[];
  exp: number;
}

export const parseToken = (token: string): JWTPayload => {
  try {
    return jwtDecode<JWTPayload>(token);
  } catch {
    throw new Error('Invalid token format');
  }
};

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = parseToken(token);
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};