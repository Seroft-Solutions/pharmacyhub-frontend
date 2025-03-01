"use client";

import { AuthProvider as KeycloakAuthProvider } from "@/shared/auth";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Global authentication provider
 that combines NextAuth and Keycloak
 * 
 * This component wraps the application with both NextAuth's SessionProvider
 * and our custom Keycloak
 authentication provider, making all auth
 * functionality available
 throughout the app.
 */
export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <KeycloakAuthProvider>{children}</KeycloakAuthProvider>
    </SessionProvider>
  );
}
