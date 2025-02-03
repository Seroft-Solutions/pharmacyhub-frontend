'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import {User} from "@/types/User";


export default function LoginCheck() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAndFetchToken() {
      const storedToken = sessionStorage.getItem('token');

      if (storedToken) {
        // Token exists, redirect to dashboard
        router.push('/dashboard');
      } else {
        try {
          // Token doesn't exist, fetch it
          const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/oauth2/token`, {
            withCredentials: true
          });
          if (response.status === 200) {

            const userDTO = response.data.user;
            console.log("User data is:", response.data.user);

            const user: User = {
              id : userDTO.id,
              emailAddress: userDTO.emailAddress,
              roles: userDTO.roles,
              firstName:userDTO.firstName,
              lastName:userDTO.lastName,
              registered:userDTO.registered,
              businessPicture: userDTO.businessPicture
            };

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(user));

            router.push('/dashboard');
          } else {
            // If fetching token fails, redirect to login
            router.push('/login');
          }
        } catch (error) {
          console.error('Error fetching token:', error);
          router.push('/login');
        }
      }
      setIsLoading(false);
    }

    checkAndFetchToken();
  }, [router]);

  if (isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
    );
  }

  return null;
}