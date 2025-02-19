declare module 'keycloak-js' {
  interface KeycloakConfig {
    url?: string;
    realm: string;
    clientId: string;
  }

  interface KeycloakLoginOptions {
    redirectUri?: string;
    prompt?: string;
    maxAge?: number;
    loginHint?: string;
    idpHint?: string;
    scope?: string;
    locale?: string;
  }

  interface KeycloakInstance {
    authenticated?: boolean;
    token?: string;
    tokenParsed?: {
      exp?: number;
      preferred_username?: string;
      email?: string;
      groups?: string[];
    };
    realmAccess?: {
      roles: string[];
    };

    init(options?: {
      onLoad?: 'login-required' | 'check-sso';
      silentCheckSsoRedirectUri?: string;
      pkceMethod?: 'S256';
      checkLoginIframe?: boolean;
    }): Promise<boolean>;

    login(options?: KeycloakLoginOptions): Promise<void>;
    logout(options?: { redirectUri?: string }): Promise<void>;
    updateToken(minValidity: number): Promise<boolean>;
    hasRealmRole(role: string): boolean;
  }

  interface KeycloakStatic {
    new (config?: KeycloakConfig): KeycloakInstance;
  }

  const Keycloak: KeycloakStatic;
  export default Keycloak;
}