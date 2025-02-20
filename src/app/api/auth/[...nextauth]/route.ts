import NextAuth, { AuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { JWT } from "next-auth/jwt";
import { authConfig, keycloakConfig } from "@/config/env";
import type { Role, Permission, TokenUser } from "@/types/auth-types";
import { DEFAULT_PERMISSIONS } from "@/types/auth-constants";

// Valid roles and permissions arrays for runtime checks
const VALID_ROLES = [
  'SUPER_ADMIN', 'ADMIN', 'MANAGER', 'USER', 'PHARMACIST', 'INSTRUCTOR'
] as const satisfies Role[];

const VALID_PERMISSIONS = [
  'manage_system', 'manage_users', 'manage_staff', 'view_reports', 
  'approve_orders', 'manage_inventory', 'view_products', 'place_orders',
  'create:pharmacy', 'edit:pharmacy', 'delete:pharmacy', 'view:pharmacy',
  'manage:users', 'view:users', 'manage:roles', 'manage:exams',
  'take:exams', 'grade:exams'
] as const satisfies Permission[];

function validateRoles(roles: string[]): Role[] {
  return roles.filter((role): role is Role => 
    VALID_ROLES.includes(role as Role)
  );
}

function validatePermissions(permissions: string[]): Permission[] {
  return permissions.filter((permission): permission is Permission => 
    VALID_PERMISSIONS.includes(permission as Permission)
  );
}

function getDefaultPermissions(roles: Role[]): Permission[] {
  return validatePermissions(roles.flatMap(role => DEFAULT_PERMISSIONS[role] || []));
}

interface TokenOverrides extends Partial<JWT> {
  roles?: Role[];
  permissions?: Permission[];
}

function createNewToken(token: Partial<JWT>, overrides: TokenOverrides = {}): JWT {
  const roles = (overrides.roles || token.roles || []) as Role[];
  const permissions = (overrides.permissions || getDefaultPermissions(roles)) as Permission[];
  
  return {
    name: overrides.name || token.name || "",
    email: overrides.email || token.email || "",
    picture: overrides.picture || token.picture || null,
    sub: overrides.sub || token.sub || "",
    accessToken: overrides.accessToken || token.accessToken || "",
    refreshToken: overrides.refreshToken || token.refreshToken,
    accessTokenExpires: overrides.accessTokenExpires || token.accessTokenExpires,
    roles,
    permissions,
    iat: Date.now() / 1000,
    exp: (Date.now() + (overrides.accessTokenExpires || 0)) / 1000,
    jti: overrides.jti || token.jti || "",
  };
}

function ensureTokenUser(token: JWT): TokenUser {
  return {
    id: token.sub || "unknown",
    name: token.name || "Anonymous",
    email: token.email || "no-email",
    roles: token.roles,
    permissions: token.permissions,
  };
}

export const authOptions: AuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: keycloakConfig.clientId,
      clientSecret: keycloakConfig.clientSecret,
      issuer: keycloakConfig.issuer,
      authorization: {
        params: {
          scope: "openid profile email roles",
          response_type: "code",
        },
      },
    }),
  ],
  
  session: {
    strategy: "jwt",
    maxAge: authConfig.sessionMaxAge,
  },

  callbacks: {
    async jwt({ token, account, profile }): Promise<JWT> {
      // Initial sign in
      if (account && profile) {
        const rawRoles = [
          ...(profile.realm_access?.roles || []),
          ...(profile.resource_access?.account.roles || []),
        ];
        const roles = validateRoles(rawRoles);
        const permissions = getDefaultPermissions(roles);
        
        return createNewToken(token, {
          name: profile.name || "Anonymous",
          email: profile.email || "no-email",
          sub: profile.sub,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: account.expires_at! * 1000,
          roles,
          permissions,
          idToken: account.id_token,
        });
      }

      // Return the previous token if it hasn't expired
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Token has expired, try to refresh it
      try {
        const response = await fetch(`${keycloakConfig.baseUrl}/protocol/openid-connect/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: keycloakConfig.clientId,
            client_secret: keycloakConfig.clientSecret,
            refresh_token: token.refreshToken!,
          }),
        });

        const tokens = await response.json();

        if (!response.ok) {
          throw new Error('Failed to refresh token');
        }

        return createNewToken(token, {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          accessTokenExpires: Date.now() + tokens.expires_in * 1000,
          idToken: tokens.id_token,
        });
      } catch (error) {
        console.error("Error refreshing token:", error);
        return createNewToken(token, {
          error: "RefreshAccessTokenError",
        });
      }
    },

    async session({ session, token }) {
      const user = ensureTokenUser(token);

      return {
        ...session,
        accessToken: token.accessToken,
        error: token.error,
        user: {
          ...session.user,
          ...user,
        },
      };
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },

  events: {
    async signIn({ user }) {
      console.log("User signed in:", user.email);
    },
    async signOut({ token }) {
      if (!token.refreshToken) return;

      try {
        await fetch(`${keycloakConfig.baseUrl}/protocol/openid-connect/logout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: keycloakConfig.clientId,
            client_secret: keycloakConfig.clientSecret,
            refresh_token: token.refreshToken,
          }),
        });
      } catch (error) {
        console.error("Error during Keycloak logout:", error);
      }
    },
  },

  pages: {
    signIn: '/login',
    error: '/auth/error',
    signOut: '/auth/signout',
  },

  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };