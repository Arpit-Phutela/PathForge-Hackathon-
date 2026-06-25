export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

export const logger = {
  info: (message: string, context?: Record<string, any>) => {
    log(LogLevel.INFO, message, context);
  },
  warn: (message: string, context?: Record<string, any>) => {
    log(LogLevel.WARN, message, context);
  },
  error: (message: string, error?: Error | unknown, context?: Record<string, any>) => {
    const errorDetails = error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : { error };
    log(LogLevel.ERROR, message, { ...context, ...errorDetails });
  },
};

function log(level: LogLevel, message: string, context?: Record<string, any>) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...context,
  };
  
  // In a production environment, this would ideally pipe to a log aggregator.
  if (level === LogLevel.ERROR) {
    console.error(JSON.stringify(logEntry));
  } else if (level === LogLevel.WARN) {
    console.warn(JSON.stringify(logEntry));
  } else {
    console.log(JSON.stringify(logEntry));
  }
}
