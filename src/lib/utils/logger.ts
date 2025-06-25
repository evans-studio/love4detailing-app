// Centralized logging utility for Love4Detailing app

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: string
  data?: unknown
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'
  private logs: LogEntry[] = []
  private maxLogEntries = 100

  private formatMessage(level: LogLevel, message: string, context?: string): string {
    const timestamp = new Date().toISOString()
    const prefix = context ? `[${context}]` : ''
    return `${timestamp} [${level.toUpperCase()}] ${prefix} ${message}`
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
      const formattedMessage = this.formatMessage('debug', message, context)
      if (data) {
        console.log(formattedMessage, data)
      } else {
        console.log(formattedMessage)
      }
    }
  }

  info(message: string, context?: string, data?: unknown): void {
    this.addToLogs('info', message, context, data)
    
    if (this.isDevelopment) {
      const formattedMessage = this.formatMessage('info', message, context)
      if (data) {
        console.info(formattedMessage, data)
      } else {
        console.info(formattedMessage)
      }
    }
  }

  warn(message: string, context?: string, data?: unknown): void {
    this.addToLogs('warn', message, context, data)
    
    const formattedMessage = this.formatMessage('warn', message, context)
    if (data) {
      console.warn(formattedMessage, data)
    } else {
      console.warn(formattedMessage)
    }
  }

  error(message: string, context?: string, error?: unknown): void {
    this.addToLogs('error', message, context, error)
    
    const formattedMessage = this.formatMessage('error', message, context)
    if (error) {
      console.error(formattedMessage, error)
    } else {
      console.error(formattedMessage)
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
export const logger = new Logger()

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