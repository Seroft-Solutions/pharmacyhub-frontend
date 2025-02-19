"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '../../model/store';
import { useLogin } from '../../api/mutations';
import { validateLoginForm } from '../../lib/validation';
import { ROUTES } from '@/config/auth';

// Import shadcn UI components
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/ui/card';
import { Label } from '@/shared/ui/label';
import { Separator } from '@/shared/ui/separator';
import { Checkbox } from '@/shared/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';

// Import icons
import { 
  LockKeyhole, 
  Mail, 
  AlertCircle, 
  Loader2, 
  Key,
  UserCircle,
  User,
  LogIn,
  Settings
} from 'lucide-react';

export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  
  const login = useAuthStore(state => state.login);
  const loginMutation = useLogin();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setError('');

    // Form validation
    const validationErrors = validateLoginForm({ email, password });
    if (Object.keys(validationErrors).length > 0) {
      setError(Object.values(validationErrors)[0]);
      return;
    }

    try {
      const result = await loginMutation.mutateAsync({ email, password, rememberMe });
      
      // Show success animation before redirecting
      setShowSuccessAnimation(true);
      
      // Delay redirect to show animation
      setTimeout(() => {
        login(result.token);
        router.push(ROUTES.DASHBOARD);
      }, 1000);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    }
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
        <Tabs defaultValue="credentials" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="credentials" className="data-[state=active]:bg-blue-50">
              <User className="mr-2 h-4 w-4" />
              Credentials
            </TabsTrigger>
            <TabsTrigger value="admin" className="data-[state=active]:bg-blue-50">
              <Settings className="mr-2 h-4 w-4" />
              Admin Access
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="credentials" className="mt-0">
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
                disabled={loginMutation.isPending || showSuccessAnimation}
                className="w-full h-11 font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
              >
                {showSuccessAnimation ? (
                  <div className="flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-2">Success!</span>
                  </div>
                ) : loginMutation.isPending ? (
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
                  className="bg-white font-normal hover:bg-gray-50 transition-colors"
                >
                  <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path fill="#0078d4" d="M11.44 24H1.503C.665 24 0 23.335 0 22.497V1.503C0 .665.665 0 1.503 0h20.994C23.335 0 24 .665 24 1.503v20.994c0 .838-.665 1.503-1.503 1.503h-7.918v-9.159h3.076l.461-3.574h-3.537V9.03c0-1.035.287-1.74 1.771-1.74h1.893V4.122a25.24 25.24 0 00-2.756-.142c-2.728 0-4.595 1.666-4.595 4.717v2.629H9.74v3.574h3.076V24h-1.376z"/>
                  </svg>
                  Microsoft
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="admin" className="mt-0">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
              <h3 className="text-blue-800 font-medium mb-2 flex items-center">
                <Key className="h-5 w-5 mr-2 text-blue-600" />
                Admin Access
              </h3>
              <p className="text-sm text-blue-700">
                This area is restricted to pharmacy administrators only. Please contact your system
                administrator if you need access.
              </p>
            </div>
            
            <form className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin-email" className="text-gray-700 font-medium">
                  Admin Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="admin@example.com"
                    className="pl-10 border-gray-300 bg-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password" className="text-gray-700 font-medium">
                  Admin Password
                </Label>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 border-gray-300 bg-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="admin-code" className="text-gray-700 font-medium">
                  Security Code
                </Label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="admin-code"
                    type="text"
                    placeholder="Enter your security code"
                    className="pl-10 border-gray-300 bg-white"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  The security code was provided by your system administrator
                </p>
              </div>

              <Button
                type="button"
                className="w-full h-11 font-semibold"
                disabled
              >
                Request Admin Access
              </Button>
            </form>
          </TabsContent>
        </Tabs>
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
