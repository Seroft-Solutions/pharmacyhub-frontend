declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // App Environment
      NODE_ENV: 'development' | 'production' | 'test';
      APP_ENV: 'local' | 'development' | 'staging' | 'production';
      
      // Next Auth
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
      
      // Keycloak Configuration
      KEYCLOAK_CLIENT_ID: string;
      KEYCLOAK_CLIENT_SECRET: string;
      KEYCLOAK_ISSUER: string;
      KEYCLOAK_BASE_URL: string;
      
      // Frontend URLs
      NEXT_PUBLIC_APP_URL: string;
      NEXT_PUBLIC_API_URL: string;
      
      // Email Configuration (optional)
      SMTP_HOST?: string;
      SMTP_PORT?: string;
      SMTP_USER?: string;
      SMTP_PASSWORD?: string;
      SMTP_FROM?: string;
    }
  }
}

// Ensure this is treated as a module
export {};