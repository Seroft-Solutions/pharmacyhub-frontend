import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL,
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM,
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID,
};

class KeycloakService {
  private static instance: KeycloakService;
  private keycloak: Keycloak;

  private constructor() {
    this.keycloak = new Keycloak(keycloakConfig);
  }

  public static getInstance(): KeycloakService {
    if (!KeycloakService.instance) {
      KeycloakService.instance = new KeycloakService();
    }
    return KeycloakService.instance;
  }

  public async init(): Promise<boolean> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
        pkceMethod: 'S256',
      });

      if (!authenticated) {
        console.log('Not authenticated');
      }

      return authenticated;
    } catch (error) {
      console.error('Failed to initialize Keycloak:', error);
      throw error;
    }
  }

  public async login(options?: Keycloak.KeycloakLoginOptions): Promise<void> {
    return this.keycloak.login(options);
  }

  public async logout(): Promise<void> {
    return this.keycloak.logout();
  }

  public getToken(): string | undefined {
    return this.keycloak.token;
  }

  public isAuthenticated(): boolean {
    return !!this.keycloak.authenticated;
  }

  public getUsername(): string | undefined {
    return this.keycloak.tokenParsed?.preferred_username;
  }

  public getRoles(): string[] {
    return this.keycloak.realmAccess?.roles || [];
  }

  public getGroups(): string[] {
    return this.keycloak.tokenParsed?.groups || [];
  }

  public hasRole(role: string): boolean {
    return this.keycloak.hasRealmRole(role);
  }

  public updateToken(minValidity: number = 5): Promise<boolean> {
    return this.keycloak.updateToken(minValidity);
  }

  public getKeycloakInstance(): Keycloak {
    return this.keycloak;
  }
}

export const keycloakService = KeycloakService.getInstance();