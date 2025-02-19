'use client';

import {cn} from "@/shared/lib/utils";
import {AuthProvider} from "@/context/AuthContext";
import {QueryProvider as TanstackProvider} from "@/shared/lib/providers/QueryProvider";
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {ThemeProvider} from '@/shared/lib/providers/ThemeProvider';
import type {ReactNode} from 'react';

interface ClientLayoutProps {
  children: ReactNode;
  fontVariable: string;
}

export function ClientLayout({children, fontVariable}: ClientLayoutProps) {
  return (
    <body
      className={cn(
        "min-h-screen bg-background font-sans antialiased",
        fontVariable
      )}
    >
      <TanstackProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false}/>
      </TanstackProvider>
    </body>
  );
}