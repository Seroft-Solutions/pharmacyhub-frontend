'use client'

import React, {useEffect, useState} from 'react';



export default function LoginPage() {

    const handleLogin = () => {
        const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
        if (keycloakUrl) {
            window.location.href = keycloakUrl;
        } else {
            console.error("Keycloak URL is not defined");
        }
    };

    useEffect(() => {
        handleLogin();
    }, []);

    return null;
}