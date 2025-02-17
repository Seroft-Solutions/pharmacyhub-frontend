// src/hooks/useApi.ts
import {useCallback, useState} from 'react';

export function useApi(getToken, logout) {
    const [isLoading, setIsLoading] = useState(false);

    const fetchWithAuth = useCallback(async (url, options = {}) => {
        const token = localStorage.getItem('token');
        if (!token) {
            logout();
            return { error: 'No authentication token' };
        }

        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const fullUrl = `${baseUrl}${url}`;

        try {
            setIsLoading(true);
            const response = await fetch(fullUrl, {
                ...options,
                headers: {
                    ...options.headers,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 401) {
                logout();
                return { error: 'Authentication failed' };
            }

            if (response.status === 204) {
                // No content, typically for successful DELETE operations
                return { data: null };
            }

            let data;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                data = await response.json();
            } else {
                data = await response.text();
            }

            if (!response.ok) {
                return { error: data.message || 'An error occurred' };
            }

            return { data };
        } catch (error) {
            console.error('API request failed:', error);
            return { error: 'An unexpected error occurred' };
        } finally {
            setIsLoading(false);
        }
    }, [getToken, logout]);

    const get = useCallback((url) => fetchWithAuth(url), [fetchWithAuth]);

    const post = useCallback((url, body) =>
            fetchWithAuth(url, { method: 'POST', body: JSON.stringify(body) }),
        [fetchWithAuth]);

    const put = useCallback((url, body) =>
            fetchWithAuth(url, { method: 'PUT', body: JSON.stringify(body) }),
        [fetchWithAuth]);

    const del = useCallback((url) =>
            fetchWithAuth(url, { method: 'DELETE' }),
        [fetchWithAuth]);

    return {
        get,
        post,
        put,
        del,
        isLoading
    };
}