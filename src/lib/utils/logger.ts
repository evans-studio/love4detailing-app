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

interface Logger {
  debug: (message: string, ...args: any[]) => void
  info: (message: string, ...args: any[]) => void
  warn: (message: string, ...args: any[]) => void
  error: (message: string, ...args: any[]) => void
}

class LoggerImpl implements Logger {
  private readonly context: string
  private readonly isDev: boolean
  private logs: LogEntry[] = []
  private maxLogEntries = 100

  constructor(context: string) {
    this.context = context
    this.isDev = process.env.NODE_ENV === 'development'
  }

  private log(level: LogLevel, message: string, ...args: any[]) {
    const timestamp = new Date().toISOString()
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${this.context}]`
    
    if (this.isDev) {
      console[level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log'](
        `${prefix} ${message}`,
        ...args
      )
    } else {
      // In production, we might want to send logs to a service
      // For now, only log warnings and errors
      if (level === 'warn' || level === 'error') {
        console[level](
          `${prefix} ${message}`,
          ...args
        )
      }
    }
  }

  debug(message: string, ...args: any[]) {
    this.log('debug', message, ...args)
  }

  info(message: string, ...args: any[]) {
    this.log('info', message, ...args)
  }

  warn(message: string, ...args: any[]) {
    this.log('warn', message, ...args)
  }

  error(message: string, ...args: any[]) {
    this.log('error', message, ...args)
  }

  private formatMessage(level: string, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      service: this.context,
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

// Create loggers for different contexts
export const bookingLogger = new LoggerImpl('Booking')
export const vehicleLogger = new LoggerImpl('Vehicle')
export const paymentLogger = new LoggerImpl('Payment')
export const emailLogger = new LoggerImpl('Email')
export const authLogger = new LoggerImpl('Auth')

// Create singleton instance
export const logger = new LoggerImpl('app')

// Context-specific loggers for better organization
export const apiLogger = {
  debug: (message: string, data?: unknown) => logger.debug(message, 'API', data),
  info: (message: string, data?: unknown) => logger.info(message, 'API', data),
  warn: (message: string, data?: unknown) => logger.warn(message, 'API', data),
  error: (message: string, error?: unknown) => logger.error(message, 'API', error),
}

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