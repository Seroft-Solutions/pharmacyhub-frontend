import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/app/providers/AuthProvider";
import QueryClientProvider from "@/app/providers/QueryClientProvider";

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
        <QueryClientProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}