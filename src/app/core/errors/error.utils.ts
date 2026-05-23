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
 * Type guard to check if an error is a FeatureError
 */
export function isFeatureError(error: unknown): error is FeatureError {
  return (
    isBaseError(error) &&
    'feature' in error &&
    typeof (error as Record<string, unknown>)['feature'] === 'string'
  );
}

/**
 * Extract error information safely from any error-like object
 */
export function extractErrorInfo(error: unknown): {
  name: string;
  message: string;
  code?: string;
  feature?: string;
  context?: Record<string, unknown>;
  timestamp?: Date;
  stack?: string;
  translationKey?: string;
  translationParams?: Record<string, string>;
  fullTranslationKey?: string;
} {
  if (isBaseError(error)) {
    const featureError = error as FeatureError;
    return {
      name: error.name,
      message: error.message,
      code: error.code,
      feature: 'feature' in error ? featureError.feature : undefined,
      context: error.context ? { ...error.context } : undefined,
      timestamp: error.timestamp,
      stack: error.stack,
      translationKey: error.translationKey,
      translationParams: error.translationParams,
      fullTranslationKey:
        'fullTranslationKey' in featureError ? featureError.fullTranslationKey : undefined,
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
      context: error as unknown as Record<string, unknown>,
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
export function getTranslationKey(error: unknown): string | undefined {
  const info = extractErrorInfo(error);
  return info.fullTranslationKey ?? info.translationKey;
}

/**
 * Get translation parameters for an error, if available
 */
export function getTranslationParams(error: unknown): Record<string, string> | undefined {
  const info = extractErrorInfo(error);
  return info.translationParams;
}

/**
 * Log an error with consistent formatting
 */
export function logError(error: unknown, additionalContext: Record<string, unknown> = {}): void {
  const info = extractErrorInfo(error);
  const context = { ...info.context, ...additionalContext };

  console.error({
    timestamp: info.timestamp?.toISOString() ?? new Date().toISOString(),
    error: {
      name: info.name,
      message: info.message,
      code: info.code,
      feature: info.feature,
      stack: info.stack,
    },
    context,
  });
}

/**
 * Wrap a promise to catch and transform errors
 */
export async function wrapError<T>(
  promise: Promise<T>,
  context: Record<string, unknown> = {},
): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    const info = extractErrorInfo(error);

    // If it's already a BaseError, just add context and rethrow
    if (isBaseError(error)) {
      throw new Error(
        `${info.message}\nContext: ${JSON.stringify({ ...info.context, ...context })}`,
      );
    }

    // Otherwise, wrap it in a generic error
    throw new Error(`${info.message}\nContext: ${JSON.stringify(context)}`);
  }
}
