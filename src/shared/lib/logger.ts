/**
 * Application logger
 * 
 * This module provides logging utilities for the application
 * with different log levels and environments support.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  prefix?: string;
  enabled?: boolean;
  level?: LogLevel;
}

class Logger {
  private prefix: string;
  private enabled: boolean;
  private level: LogLevel;
  private levels: Record<LogLevel, number>;

  constructor(options: LoggerOptions = {}) {
    this.prefix = options.prefix || '';
    this.enabled = options.enabled ?? (process.env.NODE_ENV !== 'production');
    this.level = options.level || 'info';
    
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
  }

  /**
   * Format message with prefix
   */
  private format(message: string): string {
    return this.prefix ? `[${this.prefix}] ${message}` : message;
  }

  /**
   * Check if the given log level should be displayed
   */
  private shouldLog(level: LogLevel): boolean {
    return this.enabled && this.levels[level] >= this.levels[this.level];
  }

  /**
   * Log debug message
   */
  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.format(message), ...args);
    }
  }

  /**
   * Log info message
   */
  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(this.format(message), ...args);
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.format(message), ...args);
    }
  }

  /**
   * Log error message
   */
  error(message: string | Error, ...args: any[]): void {
    if (this.shouldLog('error')) {
      if (message instanceof Error) {
        console.error(this.format(message.message), message.stack, ...args);
      } else {
        console.error(this.format(message), ...args);
      }
    }
  }

  /**
   * Create a child logger with a new prefix
   */
  child(prefix: string): Logger {
    return new Logger({
      prefix: this.prefix ? `${this.prefix}:${prefix}` : prefix,
      enabled: this.enabled,
      level: this.level
    });
  }
}

/**
 * Default application logger
 */
export const logger = new Logger({ prefix: 'app' });

/**
 * Create a feature logger with the given name
 */
export function createFeatureLogger(feature: string): Logger {
  return logger.child(feature);
}

export default logger;
