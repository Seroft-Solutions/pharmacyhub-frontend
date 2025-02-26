import { z } from 'zod';

const envSchema = z.object({
  // App Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_ENV: z.enum(['local', 'development', 'staging', 'production']).default('local'),

  // Next Auth
  NEXTAUTH_URL: z.string().url().default('http://localhost:3000'),
  NEXTAUTH_SECRET: z.string().min(32),

  // Backend API Configuration
  API_BASE_URL: z.string().url().default('http://localhost:8080'),
  API_AUTH_SECRET: z.string().optional(),

  // Frontend URLs
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:8080/api'),

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
    // For development, we'll use default values if env vars are missing
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    const parsed = isDevelopment 
      ? envSchema.parse({ ...process.env })
      : envSchema.parse(process.env);

    return parsed;
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

// API Configuration
export const apiConfig = {
  baseUrl: env.API_BASE_URL,
  authSecret: env.API_AUTH_SECRET,
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
