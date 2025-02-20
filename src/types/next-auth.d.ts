import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import type { Role, Permission } from "@/types/auth-types";

declare module "next-auth" {
  interface Session extends DefaultSession {
    accessToken?: string;
    error?: string;
    user: {
      id: string;
      roles: Role[];
      permissions: Permission[];
      email: string;
      name: string;
    } & DefaultSession["user"]
  }

  interface User extends DefaultUser {
    id: string;
    roles: Role[];
    permissions: Permission[];
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
    roles: Role[];
    permissions: Permission[];
    error?: string;
  }
}