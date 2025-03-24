import { Inter } from "next/font/google";
import "./globals.css";
import "@/features/core/mobile-support/utils/mobile-styles.css";
import AuthProvider from "@/app/providers/AuthProvider";
import QueryProvider from "@/app/providers/QueryProvider";
import AppManagerProvider from "@/app/providers/AppManagerProvider";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "PharmacyHub",
  description: "Your complete pharmacy management solution",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <AuthProvider>
            <AppManagerProvider>
              {children}
            </AppManagerProvider>
          </AuthProvider>
        </QueryProvider>
        <Toaster />
      </body>
    </html>
  );
}
