"use client";

import {createContext, ReactNode, useContext, useEffect, useState,} from "react";

import {useRouter} from "next/navigation";

interface AuthContextProps {
  token: string | null;
  setToken: (token: string | null) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  logout: () => void;
  login: (token: string) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({children}: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  });
  const router = useRouter();

  useEffect(() => {
    const validateToken = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          const response = await fetch(
            process.env.NEXT_PUBLIC_API_BASE_URL + "/oauth2/validate-token",
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${savedToken}`,
              },
            }
          );
          if (response.ok) {
            setToken(savedToken);
            setIsLoggedIn(true);
          } else {
            logout();
          }
        } catch (error) {
          console.error("Error validating token:", error);
          logout();
        }
      }
    };

    validateToken();
  }, [router]);

  const login = (token: string) => {
    setToken(token);
    setIsLoggedIn(true);
    localStorage.setItem('token', token);
    router.push('/dashboard');
  };

  const logout = async () => {
    setToken(null);
    setIsLoggedIn(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = process.env.NEXT_PUBLIC_API_BASE_URL + "/logout"; // Redirect to Keycloak

  };

  return (
    <AuthContext.Provider value={{token, setToken, isLoggedIn, setIsLoggedIn, logout, login}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};