/**
 * Simple logger utility for the application
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface Logger {
  info(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  error(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
}

export function createLogger(context: string): Logger {
  const formatMessage = (level: LogLevel, message: string): string => {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}`;
  };

  return {
    info(message: string, ...args: any[]): void {
      console.log(formatMessage('info', message), ...args);
    },
    
    warn(message: string, ...args: any[]): void {
      console.warn(formatMessage('warn', message), ...args);
    },
    
    error(message: string, ...args: any[]): void {
      console.error(formatMessage('error', message), ...args);
    },
    
    debug(message: string, ...args: any[]): void {
      if (process.env.NODE_ENV !== 'production') {
        console.debug(formatMessage('debug', message), ...args);
      }
    }
  };
}