'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {useAuth} from '@/hooks/useAuth';
import {Loader2} from 'lucide-react';

export default function CallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const {setAuthState} = useAuth();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      handleCallback(code);
    }
  }, []);

  const handleCallback = async (code: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/callback?code=${code}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const userDTO = data.userDTO;

        const user = {
          id: userDTO.id.toString(),
          email: userDTO.email,
          roles: userDTO.roles,
        };

        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(user));

        setAuthState({user});
        router.push('/dashboard');
      } else {
        throw new Error('Failed to exchange code for token');
      }
    } catch (error) {
      console.error('Callback error:', error);
      setError('Authentication failed. Please try again.');
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500 mx-auto"/>
        <p className="mt-4 text-lg font-semibold text-gray-700">Processing login...</p>
      </div>
    </div>
  );
}