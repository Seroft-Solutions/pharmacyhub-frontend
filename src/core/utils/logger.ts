/**
 * Core Logger Module
 * 
 * Provides standardized logging across the application with support for
 * different environments, log levels, and structured metadata.
 */

// Log levels
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace',
}

// Logger configuration
export interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  isDevelopment: boolean;
  appVersion?: string;
}

// Default logger configuration
const defaultConfig: LoggerConfig = {
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableRemote: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',
  appVersion: process.env.NEXT_PUBLIC_APP_VERSION,
};

// Logger interface
export interface Logger {
  error(message: string, meta?: any): void;
  warn(message: string, meta?: any): void;
  info(message: string, meta?: any): void;
  debug(message: string, meta?: any): void;
  trace(message: string, meta?: any): void;
  
  // Configure the logger
  configure(config: Partial<LoggerConfig>): void;
  
  // Get the current configuration
  getConfig(): LoggerConfig;
}

/**
 * Default logger implementation
 * Handles both console logging and remote logging (when enabled)
 */
class CoreLogger implements Logger {
  private config: LoggerConfig;
  
  constructor(config: LoggerConfig = defaultConfig) {
    this.config = { ...config };
  }
  
  // Configure the logger
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }
  
  // Get the current configuration
  getConfig(): LoggerConfig {
    return { ...this.config };
  }
  
  // Log an error message
  error(message: string, meta?: any): void {
    this.log(LogLevel.ERROR, message, meta);
  }
  
  // Log a warning message
  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta);
  }
  
  // Log an info message
  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta);
  }
  
  // Log a debug message
  debug(message: string, meta?: any): void {
    this.log(LogLevel.DEBUG, message, meta);
  }
  
  // Log a trace message
  trace(message: string, meta?: any): void {
    this.log(LogLevel.TRACE, message, meta);
  }
  
  // Internal logging method
  private log(level: LogLevel, message: string, meta?: any): void {
    // Check if this level should be logged
    if (!this.shouldLog(level)) {
      return;
    }
    
    // Format the log entry
    const logEntry = this.formatLogEntry(level, message, meta);
    
    // Console logging (if enabled)
    if (this.config.enableConsole) {
      this.logToConsole(level, logEntry);
    }
    
    // Remote logging (if enabled)
    if (this.config.enableRemote) {
      this.logToRemote(level, logEntry);
    }
  }
  
  // Determine if a log level should be logged
  private shouldLog(level: LogLevel): boolean {
    const levels = [
      LogLevel.ERROR,
      LogLevel.WARN,
      LogLevel.INFO,
      LogLevel.DEBUG,
      LogLevel.TRACE,
    ];
    
    const configLevelIndex = levels.indexOf(this.config.minLevel);
    const logLevelIndex = levels.indexOf(level);
    
    return logLevelIndex <= configLevelIndex;
  }
  
  // Format a log entry
  private formatLogEntry(level: LogLevel, message: string, meta?: any): any {
    const timestamp = new Date().toISOString();
    
    return {
      level,
      message,
      timestamp,
      environment: this.config.isDevelopment ? 'development' : 'production',
      appVersion: this.config.appVersion,
      ...(meta && typeof meta === 'object' ? meta : { data: meta }),
    };
  }
  
  // Log to the console
  private logToConsole(level: LogLevel, logEntry: any): void {
    const { timestamp, message, ...rest } = logEntry;
    const metaString = Object.keys(rest).length > 0 ? JSON.stringify(rest, null, 2) : '';
    
    const logPrefix = `[${timestamp}] [${level.toUpperCase()}]`;
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(`${logPrefix} ${message}`, metaString);
        break;
      case LogLevel.WARN:
        console.warn(`${logPrefix} ${message}`, metaString);
        break;
      case LogLevel.INFO:
        console.info(`${logPrefix} ${message}`, metaString);
        break;
      case LogLevel.DEBUG:
        console.debug(`${logPrefix} ${message}`, metaString);
        break;
      case LogLevel.TRACE:
        console.log(`${logPrefix} ${message}`, metaString);
        break;
    }
  }
  
  // Log to a remote logging service
  private logToRemote(level: LogLevel, logEntry: any): void {
    // This is a placeholder for remote logging implementation
    // In a real application, you would send the log to a service like Sentry, LogRocket, etc.
    if (typeof window !== 'undefined' && window?.navigator?.sendBeacon) {
      try {
        // This is just an example - replace with your actual logging endpoint
        const loggingEndpoint = '/api/log';
        navigator.sendBeacon(
          loggingEndpoint,
          JSON.stringify({
            ...logEntry,
            clientTime: new Date().toISOString(),
          })
        );
      } catch (e) {
        // If sending fails, log to console as fallback
        console.error('Failed to send log to remote', e);
      }
    }
  }
}

// Create and export the singleton logger instance
const logger: Logger = new CoreLogger();

export default logger;

// Utility function to get the logger instance
export function getLogger(): Logger {
  return logger;
}
