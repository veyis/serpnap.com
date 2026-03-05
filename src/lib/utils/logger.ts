import { config } from '@/lib/config';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogContext {
  action?: string;
  userId?: string;
  entityType?: string;
  entityId?: string;
  duration?: number;
  [key: string]: unknown;
}

export function log(level: LogLevel, message: string, context?: LogContext): void {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };

  const shouldLog = config.isDev || level === 'error' || level === 'warn';

  if (!shouldLog) return;

  if (config.isProd) {
    const method = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    method(JSON.stringify(logEntry));
  } else {
    const prefix = `[${level.toUpperCase()}]`;
    const method = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    method(prefix, message, context || '');
  }
}

export function logAction(action: string, context?: Omit<LogContext, 'action'>): void {
  log('info', `Action: ${action}`, { action, ...context });
}

export function logError(action: string, error: unknown, context?: Omit<LogContext, 'action'>): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  log('error', `Error in ${action}: ${errorMessage}`, {
    action,
    error: errorMessage,
    stack: error instanceof Error ? error.stack : undefined,
    ...context,
  });
}
