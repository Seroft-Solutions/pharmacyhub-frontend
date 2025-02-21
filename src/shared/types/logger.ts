export type LogLevel = 'error' | 'warn' | 'info' | 'debug';

export interface LoggerConfig {
  level: LogLevel;
  directory: string;
  maxSize: string;
  maxFiles: string;
  format: string;
}

// Allow nested objects in metadata
export interface LogMetadata {
  [key: string]: string | number | boolean | null | undefined | Record<string, unknown>;
  timestamp?: string;
  correlationId?: string;
  userId?: string;
  path?: string;
  method?: string;
  headers?: Record<string, string>;
  query?: Record<string, unknown>;
  body?: Record<string, unknown>;
  statusCode?: number;
  responseTime?: string;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  metadata?: LogMetadata;
}

// Types for API logging
export interface ApiRequest {
  method: string;
  url: string;
  query: Record<string, unknown>;
  body: Record<string, unknown>;
  headers: {
    'user-agent': string;
    'content-type': string;
    [key: string]: string;
  };
}

export interface ApiResponse {
  statusCode: number;
  headers: Record<string, string>;
}