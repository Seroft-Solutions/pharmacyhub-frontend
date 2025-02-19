import { z } from 'zod';

const envSchema = z.object({
  // App Environment
  NODE_ENV: z.enum(['development', 'production', 'test']),
  APP_ENV: z.enum(['local', 'development', 'staging', 'production']),

  // Next Auth
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),

  // Keycloak Configuration
  KEYCLOAK_CLIENT_ID: z.string(),
  KEYCLOAK_CLIENT_SECRET: z.string(),
  KEYCLOAK_ISSUER: z.string().url(),
  KEYCLOAK_BASE_URL: z.string().url(),

  // Frontend URLs
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_API_URL: z.string().url(),

  // Optional Email Configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().transform(Number).pipe(z.number()).optional(),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),

  // Security Settings
  SESSION_MAX_AGE: z.string()
    .transform(Number)
    .pipe(z.number())
    .default("86400"),
  REFRESH_TOKEN_ROTATION: z.string()
    .transform(val => val === "true")
    .pipe(z.boolean())
    .default("true"),
  LOGIN_ATTEMPTS_LIMIT: z.string()
    .transform(Number)
    .pipe(z.number())
    .default("5"),
  LOGIN_ATTEMPTS_WINDOW: z.string()
    .transform(Number)
    .pipe(z.number())
    .default("900"),

  // Feature Flags
  ENABLE_REGISTRATION: z.string()
    .transform(val => val === "true")
    .pipe(z.boolean())
    .default("true"),
  ENABLE_EMAIL_VERIFICATION: z.string()
    .transform(val => val === "true")
    .pipe(z.boolean())
    .default("true"),
  ENABLE_SOCIAL_LOGIN: z.string()
    .transform(val => val === "true")
    .pipe(z.boolean())
    .default("false"),
  MAINTENANCE_MODE: z.string()
    .transform(val => val === "true")
    .pipe(z.boolean())
    .default("false")
});

export type Env = z.infer<typeof envSchema>;

function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const { fieldErrors } = error.flatten();
      const errorMessages = Object.entries(fieldErrors)
        .map(([field, errors]) => `${field}: ${errors?.join(", ")}`)
        .join("\n");
      
      throw new Error(`❌ Invalid environment variables:\n${errorMessages}`);
    }
    
    throw error;
  }
}

// Create a validated env object
const env = validateEnv();

// Keycloak specific configuration
export const keycloakConfig = {
  clientId: env.KEYCLOAK_CLIENT_ID,
  clientSecret: env.KEYCLOAK_CLIENT_SECRET,
  issuer: env.KEYCLOAK_ISSUER,
  baseUrl: env.KEYCLOAK_BASE_URL,
} as const;

// Auth specific configuration
export const authConfig = {
  sessionMaxAge: env.SESSION_MAX_AGE,
  refreshTokenRotation: env.REFRESH_TOKEN_ROTATION,
  loginAttemptsLimit: env.LOGIN_ATTEMPTS_LIMIT,
  loginAttemptsWindow: env.LOGIN_ATTEMPTS_WINDOW,
} as const;

// Feature flags
export const featureFlags = {
  enableRegistration: env.ENABLE_REGISTRATION,
  enableEmailVerification: env.ENABLE_EMAIL_VERIFICATION,
  enableSocialLogin: env.ENABLE_SOCIAL_LOGIN,
  maintenanceMode: env.MAINTENANCE_MODE,
} as const;

// Email configuration
export const emailConfig = env.SMTP_HOST ? {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: env.SMTP_USER && env.SMTP_PASSWORD ? {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  } : undefined,
  from: env.SMTP_FROM,
} : null;

// Export the validated env
export default env;