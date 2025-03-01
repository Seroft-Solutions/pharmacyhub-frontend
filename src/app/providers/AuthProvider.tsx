"use client";

import { AuthProvider as KeycloakAuthProvider } from "@/shared/auth";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Global authentication provider that uses Keycloak
 * 
 * This component wraps the application with our custom Keycloak
 * authentication provider, making all auth functionality 
 * available throughout the app.
 */
export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    <KeycloakAuthProvider>
      {children}
    </KeycloakAuthProvider>
  );
}
