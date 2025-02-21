import { LoggerConfig } from '../types/logger';
import path from 'path';

const isDevelopment = process.env.NODE_ENV === 'development';

export const loggerConfig: LoggerConfig = {
  level: isDevelopment ? 'debug' : 'info',
  directory: path.join(process.cwd(), 'logs'),
  maxSize: '10m',
  maxFiles: '14d',
  format: 'json'
};

export const logFormatConfig = {
  timestamp: true,
  json: true,
  colorize: isDevelopment,
  prettyPrint: isDevelopment,
  metadata: {
    app: 'pharmacyhub-frontend',
    environment: process.env.NODE_ENV || 'development'
  }
};

// Define log file patterns
export const logFilePatterns = {
  error: 'error-%DATE%.log',
  combined: 'combined-%DATE%.log',
  api: 'api-%DATE%.log'
};

// Define retention policies
export const retentionPolicy = {
  maxFiles: '14d',    // Keep logs for 14 days
  maxSize: '10m'      // Maximum size per file
};