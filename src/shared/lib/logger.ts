// Browser-compatible logger implementation
const isDevelopment = process.env.NODE_ENV === 'development';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogParams {
  [key: string]: any;
}

class Logger {
  private prefix: string;

  constructor(prefix: string = 'PharmacyHub') {
    this.prefix = prefix;
  }

  info(message: string, params?: LogParams): void {
    this.log('info', message, params);
  }

  warn(message: string, params?: LogParams): void {
    this.log('warn', message, params);
  }

  error(message: string, params?: LogParams): void {
    this.log('error', message, params);
  }

  debug(message: string, params?: LogParams): void {
    if (isDevelopment) {
      this.log('debug', message, params);
    }
  }

  private log(level: LogLevel, message: string, params?: LogParams): void {
    // Only log in development or use browser's console in production
    // This ensures no server-side code is imported in the client
    if (typeof window !== 'undefined') {
      const timestamp = new Date().toISOString();
      const logPrefix = `[${this.prefix}] [${timestamp}] [${level.toUpperCase()}]`;
      
      switch (level) {
        case 'info':
          console.info(logPrefix, message, params ? params : '');
          break;
        case 'warn':
          console.warn(logPrefix, message, params ? params : '');
          break;
        case 'error':
          console.error(logPrefix, message, params ? params : '');
          break;
        case 'debug':
          console.debug(logPrefix, message, params ? params : '');
          break;
      }
    }
  }
}

// Export a singleton instance
export const logger = new Logger();
