// Centralized logging utility for Love4Detailing app

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: string
  data?: unknown
}

interface LoggerOptions {
  service: string;
  level?: 'info' | 'warn' | 'error';
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private logs: LogEntry[] = []
  private maxLogEntries = 100
  private service: string;

  constructor(options: LoggerOptions) {
    this.service = options.service;
  }

  private formatMessage(level: string, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      service: this.service,
      message,
      ...(meta && { meta })
    };
  }

  private addToLogs(level: LogLevel, message: string, context?: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      data
    }

    this.logs.push(entry)
    
    // Keep only the last N entries to prevent memory issues
    if (this.logs.length > this.maxLogEntries) {
      this.logs = this.logs.slice(-this.maxLogEntries)
    }
  }

  debug(message: string, context?: string, data?: unknown): void {
    this.addToLogs('debug', message, context, data)
    
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage('debug', message, { context, data })
      if (data) {
        console.log(formattedMessage)
      } else {
        console.log(formattedMessage)
      }
    }
  }

  info(message: string, context?: string, data?: unknown): void {
    const formattedMessage = this.formatMessage('info', message, { context, data });
    this.addToLogs('info', message, context, data);
    
    if (this.isDevelopment) {
      console.log(JSON.stringify(formattedMessage));
    }
  }

  warn(message: string, context?: string, data?: unknown): void {
    const formattedMessage = this.formatMessage('warn', message, { context, data });
    this.addToLogs('warn', message, context, data);
    
    if (this.isDevelopment) {
      console.warn(JSON.stringify(formattedMessage));
    }
  }

  error(message: string, context?: string, error?: Error | unknown, meta?: any): void {
    const formattedMessage = this.formatMessage('error', message, {
      ...(error instanceof Error ? {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      } : { error }),
      ...meta
    });
    this.addToLogs('error', message, context, error);
    
    if (this.isDevelopment) {
      console.error(JSON.stringify(formattedMessage));
    }
  }

  // Get recent logs for debugging
  getRecentLogs(count = 50): LogEntry[] {
    return this.logs.slice(-count)
  }

  // Clear logs
  clearLogs(): void {
    this.logs = []
  }

  // Export logs for analysis
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2)
  }
}

// Create singleton instance
export const logger = new Logger({ service: 'app' })

// Context-specific loggers for better organization
export const apiLogger = {
  debug: (message: string, data?: unknown) => logger.debug(message, 'API', data),
  info: (message: string, data?: unknown) => logger.info(message, 'API', data),
  warn: (message: string, data?: unknown) => logger.warn(message, 'API', data),
  error: (message: string, error?: unknown) => logger.error(message, 'API', error),
}

export const authLogger = {
  debug: (message: string, data?: unknown) => logger.debug(message, 'AUTH', data),
  info: (message: string, data?: unknown) => logger.info(message, 'AUTH', data),
  warn: (message: string, data?: unknown) => logger.warn(message, 'AUTH', data),
  error: (message: string, error?: unknown) => logger.error(message, 'AUTH', error),
}

export const paymentLogger = {
  debug: (message: string, data?: unknown) => logger.debug(message, 'PAYMENT', data),
  info: (message: string, data?: unknown) => logger.info(message, 'PAYMENT', data),
  warn: (message: string, data?: unknown) => logger.warn(message, 'PAYMENT', data),
  error: (message: string, error?: unknown) => logger.error(message, 'PAYMENT', error),
}

export const bookingLogger = {
  debug: (message: string, data?: unknown) => logger.debug(message, 'BOOKING', data),
  info: (message: string, data?: unknown) => logger.info(message, 'BOOKING', data),
  warn: (message: string, data?: unknown) => logger.warn(message, 'BOOKING', data),
  error: (message: string, error?: unknown) => logger.error(message, 'BOOKING', error),
}

export const vehicleLogger = {
  debug: (message: string, data?: unknown) => logger.debug(message, 'VEHICLE', data),
  info: (message: string, data?: unknown) => logger.info(message, 'VEHICLE', data),
  warn: (message: string, data?: unknown) => logger.warn(message, 'VEHICLE', data),
  error: (message: string, error?: unknown) => logger.error(message, 'VEHICLE', error),
}

// Create loggers for different services
export const rewardsLogger = new Logger({ service: 'rewards-service' });

// Helper function to sanitize sensitive data
export function sanitizeData(
  data: Record<string, any>,
  sensitiveFields: string[] = ['password', 'token', 'key', 'secret', 'card']
): Record<string, any> {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (sensitiveFields.some(field => key.toLowerCase().includes(field.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeData(value, sensitiveFields);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
}

// Helper function to format API errors
export function formatApiError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  if (typeof error === 'string') {
    return error;
  }
  return JSON.stringify(error);
} 