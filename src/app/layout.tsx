import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/app/providers/AuthProvider";
import QueryProvider from "@/app/providers/QueryProvider";
import ToastProvider from "@/app/providers/ToastProvider";

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
            <ToastProvider>
              {children}
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
