/**
 * Logout utilities to ensure complete session cleanup
 */

import { keycloakConfig } from '@/config/env';

/**
 * Clear all authentication-related local storage items
 */
export function clearLocalStorage(): void {
  const keycloakRelated = [
    'pharmacyhub_access_token',
    'pharmacyhub_refresh_token',
    'pharmacyhub_token_expiry',
    'pharmacyhub_user_profile',
    'pharmacyhub_session',
  ];

  // Clear specific items
  keycloakRelated.forEach(key => localStorage.removeItem(key));
}

/**
 * Clear all authentication-related cookies
 */
export function clearCookies(): void {
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
  }
}

/**
 * Revoke tokens with Keycloak
 */
export async function revokeTokens(refreshToken: string | null): Promise<void> {
  if (!refreshToken) return;

  try {
    const formData = new URLSearchParams();
    formData.append('client_id', keycloakConfig.clientId);
    formData.append('client_secret', keycloakConfig.clientSecret);
    formData.append('refresh_token', refreshToken);

    await fetch(`${keycloakConfig.baseUrl}/protocol/openid-connect/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
  } catch (error) {
    console.error('Failed to revoke tokens:', error);
    // Continue with logout even if token revocation fails
  }
}

/**
 * Logout from both client and Keycloak
 */
export async function logout(): Promise<void> {
  try {
    // Get refresh token before clearing storage
    const refreshToken = localStorage.getItem('pharmacyhub_refresh_token');

    // Clear local storage and cookies first
    clearLocalStorage();
    clearCookies();

    // Then attempt to revoke tokens
    await revokeTokens(refreshToken);

    // Make a request to NextAuth signout
    try {
      await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.warn('NextAuth signout failed:', error);
      // Continue with logout process
    }

    // Redirect to Keycloak logout endpoint to ensure complete session cleanup
    const logoutUrl = `${keycloakConfig.baseUrl}/protocol/openid-connect/logout?client_id=${keycloakConfig.clientId}&post_logout_redirect_uri=${encodeURIComponent(window.location.origin + '/login')}`;
    
    window.location.href = logoutUrl;
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}