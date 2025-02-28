"use client";

import { AuthProvider as FeatureAuthProvider } from "@/features/auth/context/AuthContext";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Global authentication provider that combines NextAuth and our custom auth implementation
 * 
 * This component wraps the application with both NextAuth's SessionProvider
 * and our custom authentication provider, making all auth
 * functionality available throughout the app.
 */
export default function AuthProvider({ children }: AuthProviderProps) {
  return (
    <SessionProvider>
      <FeatureAuthProvider>{children}</FeatureAuthProvider>
    </SessionProvider>
  );
}
