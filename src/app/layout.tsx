// RootLayout.tsx
import type {Metadata} from "next";
import {Inter as FontSans} from "next/font/google";
import "./globals.css";
import {cn} from "@/lib/utils";
import {ThemeProvider} from "next-themes";
import {AuthProvider} from "@/context/AuthContext";


const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Pharmacy Hub",
  description: "",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en" suppressHydrationWarning>
      <head/>
      <body
          className={cn(
              "min-h-screen bg-background font-sans antialiased",
              fontSans.variable
          )}
      >

      <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
      >

          <AuthProvider>{children}</AuthProvider>

      </ThemeProvider>

      </body>
      </html>
  );
}