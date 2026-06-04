import { BaseError } from './base.error';
import { FeatureError } from './feature.error';

/**
 * Type guard to check if an error is a BaseError
 */
export function isBaseError(error: unknown): error is BaseError {
  return (
    error instanceof Error &&
    'code' in error &&
    'timestamp' in error &&
    typeof (error as Record<string, unknown>)['code'] === 'string'
  );
}

/**
 * Check if an error has already been marked as handled
 */
export function isHandled(error: unknown): boolean {
  if (error && typeof error === 'object' && 'handled' in error) {
    return (error as Record<string, unknown>)['handled'] === true;
  }
  return false;
}

/**
 * Extract error information safely from any error-like object
 */
export function extractErrorInfo(error: unknown): {
  name: string;
  message: string;
  code?: string;
  feature?: string;
  timestamp?: Date;
  handled?: boolean;
  stack?: string;
  translationKey?: (string | undefined)[];
  translationParams?: Record<string, unknown>;
} {
  if (isBaseError(error)) {
    return {
      name: error.name,
      message: error.message,
      code: error.code,
      feature: error instanceof FeatureError ? error.feature : undefined,
      timestamp: error.timestamp,
      handled: error.handled,
      stack: error.stack,
      translationKey: error.translationKey,
      translationParams: error.translationParams,
    };
  }

  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  if (typeof error === 'string') {
    return {
      name: 'Error',
      message: error,
    };
  }

  if (error && typeof error === 'object') {
    return {
      name: 'UnknownError',
      message: JSON.stringify(error),
      handled:
        'handled' in error ? (error as Record<string, unknown>)['handled'] === true : undefined,
    };
  }

  return {
    name: 'UnknownError',
    message: 'An unknown error occurred',
  };
}

/**
 * Get the translation key for an error, if available
 */
export function getTranslationKey(error: unknown): (string | undefined)[] | undefined {
  const info = extractErrorInfo(error);
  return info.translationKey;
}

/**
 * Get translation parameters for an error, if available
 */
export function getTranslationParams(error: unknown): Record<string, unknown> | undefined {
  const info = extractErrorInfo(error);
  return info.translationParams;
}

/**
 * Mark an error as handled to prevent global error handling
 */
export function markAsHandled(error: unknown): void {
  if (error && typeof error === 'object') {
    (error as Record<string, unknown>)['handled'] = true;
  }
}

/**
 * Log an error with consistent formatting
 */
export function logError(error: unknown): void {
  const info = extractErrorInfo(error);

  console.error({
    timestamp: info.timestamp?.toISOString() ?? new Date().toISOString(),
    error: {
      name: info.name,
      message: info.message,
      code: info.code,
      feature: info.feature,
      handled: info.handled,
      stack: info.stack,
    },
  });
}
