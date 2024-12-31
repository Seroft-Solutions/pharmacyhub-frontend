import {useState, useEffect, useCallback, useMemo} from 'react';
import {useRouter} from 'next/navigation';
import {hasRole as checkRole} from '../utils/roleUtils';

interface User {
    id: string;
    emailAddress: string;
    roles: string[];
    firstName:string;
    lastName:string;
}

interface AuthState {
    user: User | null;
}

export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({user: null});
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr && userStr !== 'undefined') {
                try {
                    const user = JSON.parse(userStr);
                    setAuthState({user});
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    localStorage.removeItem('user');
                }
            }
        }
    }, []);



    const logout = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
        setAuthState({user: null});
        router.push('/login');
    }, [router]);

    const getToken = useCallback(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    }, []);

    const isAuthenticated = useMemo(() => !!getToken(), [getToken]);

    const hasRole = useCallback((param1: string, param2?: string) => {
        if (!authState.user) return false;

        if (param2 === undefined) {
            return authState.user.roles.includes(param1);
        } else {
            return checkRole(authState.user.roles, param1 as any, param2);
        }
    }, [authState.user]);



    return useMemo(() => ({
        user: authState.user,
        logout,
        getToken,
        isAuthenticated,
        hasRole,
    }), [authState.user, logout, getToken, isAuthenticated, hasRole]);
}