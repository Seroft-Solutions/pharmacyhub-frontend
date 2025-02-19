import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    error?: string;
    user: {
      id: string;
      roles: string[];
      permissions: string[];
      email: string;
      name: string;
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string;
    roles: string[];
    permissions: string[];
    name: string;
  }

  interface Profile {
    sub: string;
    email_verified: boolean;
    name: string;
    preferred_username: string;
    given_name: string;
    family_name: string;
    email: string;
    realm_access?: {
      roles: string[];
    };
    resource_access?: {
      account: {
        roles: string[];
      };
    };
    groups?: string[];
    permissions?: string[];
  }
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  interface JWT extends DefaultJWT {
    /** OpenID ID Token */
    idToken?: string;
    accessToken: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    roles: string[];
    permissions: string[];
    error?: string;
  }
}

export type Role = 'ADMIN' | 'PHARMACIST' | 'USER' | 'INSTRUCTOR';

export type Permission = 
  | 'create:pharmacy'
  | 'edit:pharmacy'
  | 'delete:pharmacy'
  | 'view:pharmacy'
  | 'manage:users'
  | 'view:users'
  | 'manage:roles'
  | 'manage:exams'
  | 'take:exams'
  | 'grade:exams';

export const DEFAULT_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: [
    'manage:users',
    'manage:roles',
    'manage:exams',
    'create:pharmacy',
    'edit:pharmacy',
    'delete:pharmacy',
    'view:pharmacy',
    'view:users',
    'grade:exams'
  ],
  PHARMACIST: [
    'create:pharmacy',
    'edit:pharmacy',
    'view:pharmacy',
    'take:exams'
  ],
  USER: [
    'view:pharmacy',
    'take:exams'
  ],
  INSTRUCTOR: [
    'manage:exams',
    'grade:exams',
    'view:users'
  ]
} as const;

export interface TokenUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  permissions: string[];
}

export interface ExtendedJWT extends JWT {
  user?: TokenUser;
}