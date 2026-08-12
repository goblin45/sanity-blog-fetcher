type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogFields {
  [key: string]: unknown;
}

/**
 * Writes a structured log line to the process stdout/stderr stream for the level.
 * Does not persist logs; replace or wrap when a log sink is introduced.
 *
 * @param level - Severity of the message.
 * @param message - Human-readable summary.
 * @param fields - Optional structured context (avoid secrets and PII).
 */
function writeLog(level: LogLevel, message: string, fields?: LogFields): void {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...fields,
  };
  const serialized = JSON.stringify(entry);

  if (level === 'error') {
    console.error(serialized);
    return;
  }

  if (level === 'warn') {
    console.warn(serialized);
    return;
  }

  console.log(serialized);
}

/**
 * Application logger used by route handlers, ETA wrappers, and controllers.
 * Prefer this over ad-hoc `console` calls so log shape stays consistent.
 */
export const logger = {
  /**
   * @param message - Debug summary.
   * @param fields - Optional structured context.
   */
  debug(message: string, fields?: LogFields): void {
    if (process.env.NODE_ENV === 'production') {
      return;
    }
    writeLog('debug', message, fields);
  },

  /**
   * @param message - Informational summary.
   * @param fields - Optional structured context.
   */
  info(message: string, fields?: LogFields): void {
    writeLog('info', message, fields);
  },

  /**
   * @param message - Warning summary.
   * @param fields - Optional structured context.
   */
  warn(message: string, fields?: LogFields): void {
    writeLog('warn', message, fields);
  },

  /**
   * @param message - Error summary safe to log.
   * @param fields - Optional structured context (include `error` message/name, not stacks with secrets).
   */
  error(message: string, fields?: LogFields): void {
    writeLog('error', message, fields);
  },
};
