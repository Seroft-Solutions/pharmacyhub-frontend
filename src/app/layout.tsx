import type {Metadata} from "next";
import {Inter as FontSans} from "next/font/google";
import "./globals.css";
import type {ReactNode} from 'react';
import {ClientLayout} from "./ClientLayout";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Pharmacy Hub",
  description: "",
};

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({
  children,
}: Readonly<RootLayoutProps>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head/>
      <ClientLayout fontVariable={fontSans.variable}>
        {children}
      </ClientLayout>
    </html>
  );
}