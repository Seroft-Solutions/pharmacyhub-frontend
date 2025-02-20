"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/shared/auth';

// Import shadcn UI components
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import { Separator } from '@/shared/ui/separator';
import { Checkbox } from '@/shared/ui/checkbox';

// Import icons
import { 
  LockKeyhole, 
  Mail, 
  AlertCircle, 
  Loader2, 
  LogIn
} from 'lucide-react';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    // For social login, we'll redirect to Keycloak's login page with the selected provider
    const KEYCLOAK_BASE_URL = process.env.NEXT_PUBLIC_KEYCLOAK_BASE_URL || 'http://localhost:8080';
    const KEYCLOAK_REALM = process.env.NEXT_PUBLIC_KEYCLOAK_REALM || 'pharmacyhub';
    const KEYCLOAK_CLIENT_ID = process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || 'pharmacyhub-client';
    
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback`);
    const identityProvider = provider === 'google' ? 'google' : 'facebook';
    
    window.location.href = `${KEYCLOAK_BASE_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth?client_id=${KEYCLOAK_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=openid&kc_idp_hint=${identityProvider}`;
  };

  return (
    <Card className="border-none shadow-2xl backdrop-blur-sm bg-white/90">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex justify-center mb-4">
          <div className="size-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center p-5 shadow-lg">
            <LogIn className="text-white h-10 w-10" />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center text-gray-800">
          Welcome to PharmacyHub
        </CardTitle>
        <CardDescription className="text-center text-gray-600">
          Sign in to access your pharmacy dashboard
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-6 p-3 rounded flex items-center space-x-2 bg-red-50 border border-red-200 text-red-700">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Email
            </Label>
            <div className="relative group">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 border-gray-300 bg-white focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-700 font-medium">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative group">
              <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 border-gray-300 bg-white focus:border-blue-500 transition-all"
                required
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="remember_me"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(!!checked)}
              className="text-blue-600 border-gray-300"
            />
            <Label 
              htmlFor="remember_me" 
              className="text-sm font-normal text-gray-600 cursor-pointer"
            >
              Remember me for 30 days
            </Label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 bg-white text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('google')}
              className="bg-white font-normal hover:bg-gray-50 transition-colors"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialLogin('facebook')}
              className="bg-white font-normal hover:bg-gray-50 transition-colors"
            >
              <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Facebook
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-center justify-center p-6 border-t bg-gray-50 rounded-b-lg">
        <p className="text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Sign up now
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
};
