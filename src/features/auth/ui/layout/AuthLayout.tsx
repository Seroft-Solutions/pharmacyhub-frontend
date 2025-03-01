import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md space-y-6 p-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        </div>
        {children}
      </Card>
    </div>
  );
}
