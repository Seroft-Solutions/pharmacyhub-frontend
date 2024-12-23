'use client'

import React, {useState} from 'react';
import {Button} from '@/components/ui/button';
import {useRouter} from "next/navigation";


export default function LoginPage() {

    const handleLogin = () => {
        const keycloakUrl = process.env.NEXT_PUBLIC_KEYCLOAK_URL;
        if (keycloakUrl) {
            window.location.href = keycloakUrl;
        } else {
            console.error("Keycloak URL is not defined");
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-secondary/20">
            <div className="bg-card rounded-3xl shadow-2xl p-8 w-full max-w-sm mx-4">
                <div className="flex flex-col items-center">
                    <h1 className="mt-6 text-3xl font-bold text-card-foreground">Welcome to Pharmacy Hub</h1>
                    <p className="mt-2 text-sm text-muted-foreground text-center">
                        Brew up some productivity.
                        <br/>

                    </p>
                </div>
                <Button
                    className="w-full mt-8"
                    variant="default"
                    onClick={handleLogin}
                >
                    Start Brewing
                </Button>
            </div>
        </div>
    );
}