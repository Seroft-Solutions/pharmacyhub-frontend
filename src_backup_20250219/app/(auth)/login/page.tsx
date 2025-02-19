'use client'

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import axios from "axios";
import { User } from "@/types/User";
import { useAuthContext } from "@/context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const { login } = useAuthContext();

    useEffect(() => {
        async function checkAndFetchToken() {
            const storedToken = localStorage.getItem('token');

            if (storedToken) {
                // Token exists, get user data and redirect to dashboard
                const userStr = localStorage.getItem('user');
                if (userStr) {
                    const user = JSON.parse(userStr);
                    router.push('/dashboard');
                }
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
                        };

                        login(response.data.token);
                        localStorage.setItem('user', JSON.stringify(user));
                    } else {
                        // If fetching token fails, redirect to login
                       handleLogin();
                    }
                } catch (error) {
                    console.error('Error fetching token:', error);
                    handleLogin();
                }
            }
            setIsLoading(false);
        }

        checkAndFetchToken();
    }, [router]);
    const handleLogin = () => {
        const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
        if (keycloakUrl) {
            window.location.href = keycloakUrl;
        } else {
            console.error("Keycloak URL is not defined");
        }
    };

    return null;
}
