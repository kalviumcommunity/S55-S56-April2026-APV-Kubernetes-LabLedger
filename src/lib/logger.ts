/**
 * Logger utility for observability.
 * In a production environment, you can swap the implementation to use Sentry, Datadog, etc.
 */
class Logger {
  info(message: string, context?: Record<string, unknown>) {
    console.info(`[INFO] ${message}`, context || '');
  }

  warn(message: string, context?: Record<string, unknown>) {
    console.warn(`[WARN] ${message}`, context || '');
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    console.error(`[ERROR] ${message}`, error || '', context || '');
    // In the future: Sentry.captureException(error, { extra: context });
  }
}

export const logger = new Logger();
