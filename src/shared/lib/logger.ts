import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { loggerConfig, logFormatConfig, logFilePatterns, retentionPolicy } from '../config/logger';
import { LogMetadata, ApiRequest, ApiResponse } from '../types/logger';

class Logger {
  private static instance: Logger;
  private logger: winston.Logger;

  private constructor() {
    const { combine, timestamp, json, colorize, printf } = winston.format;

    // Create logs directory if it doesn't exist
    const rotateFileOptions = {
      ...retentionPolicy,
      dirname: loggerConfig.directory,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
    };

    // Initialize Winston logger
    this.logger = winston.createLogger({
      level: loggerConfig.level,
      format: combine(
        timestamp(),
        json(),
        printf(({ timestamp, level, message, ...metadata }) => {
          return JSON.stringify({
            timestamp,
            level,
            message,
            ...logFormatConfig.metadata,
            ...metadata,
          });
        })
      ),
      transports: [
        // Error log file
        new DailyRotateFile({
          ...rotateFileOptions,
          filename: logFilePatterns.error,
          level: 'error',
        }),
        // Combined log file for all levels
        new DailyRotateFile({
          ...rotateFileOptions,
          filename: logFilePatterns.combined,
        }),
        // API-specific log file
        new DailyRotateFile({
          ...rotateFileOptions,
          filename: logFilePatterns.api,
        }),
      ],
    });

    // Add console transport in development
    if (process.env.NODE_ENV === 'development') {
      this.logger.add(
        new winston.transports.Console({
          format: combine(
            colorize(),
            printf(({ timestamp, level, message, ...metadata }) => {
              return `${timestamp} [${level}]: ${message} ${
                Object.keys(metadata).length ? JSON.stringify(metadata, null, 2) : ''
              }`;
            })
          ),
        })
      );
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMetadata(metadata?: LogMetadata): LogMetadata {
    return {
      timestamp: new Date().toISOString(),
      ...metadata,
    };
  }

  public error(message: string, metadata?: LogMetadata): void {
    this.logger.error(message, this.formatMetadata(metadata));
  }

  public warn(message: string, metadata?: LogMetadata): void {
    this.logger.warn(message, this.formatMetadata(metadata));
  }

  public info(message: string, metadata?: LogMetadata): void {
    this.logger.info(message, this.formatMetadata(metadata));
  }

  public debug(message: string, metadata?: LogMetadata): void {
    this.logger.debug(message, this.formatMetadata(metadata));
  }

  // Helper method for API logging
  public logApiRequest(req: ApiRequest, metadata?: LogMetadata): void {
    this.info(`API Request: ${req.method} ${req.url}`, {
      ...this.formatMetadata(metadata),
      method: req.method,
      path: req.url,
      query: req.query,
      body: req.body,
      headers: {
        'user-agent': req.headers['user-agent'],
        'content-type': req.headers['content-type'],
      },
    });
  }

  // Helper method for API response logging
  public logApiResponse(req: ApiRequest, res: ApiResponse, responseTime: number, metadata?: LogMetadata): void {
    this.info(`API Response: ${req.method} ${req.url}`, {
      ...this.formatMetadata(metadata),
      method: req.method,
      path: req.url,
      statusCode: res.statusCode,
      responseTime: `${responseTime}ms`,
    });
  }
}

// Export a singleton instance
export const logger = Logger.getInstance();

// Export a middleware for API routes
export const apiLogger = (handler: (req: ApiRequest, res: ApiResponse) => Promise<unknown>) => 
  async (req: ApiRequest, res: ApiResponse): Promise<unknown> => {
    const start = Date.now();
    
    try {
      logger.logApiRequest(req);
      const result = await handler(req, res);
      logger.logApiResponse(req, res, Date.now() - start);
      return result;
    } catch (error) {
      logger.error('API Error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        method: req.method,
        path: req.url,
      });
      throw error;
    }
  };