import { FeatureDomain, FeatureError } from './feature.error';

/**
 * Error codes for data-source operations
 */
export enum DataSourceErrorCode {
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  RECORD_NOT_FOUND = 'RECORD_NOT_FOUND',
  QUERY_FAILED = 'QUERY_FAILED',
  INVALID_RESPONSE = 'INVALID_RESPONSE',
  UNAUTHORIZED = 'UNAUTHORIZED',
  TIMEOUT = 'TIMEOUT',
  DUPLICATE_RECORD = 'DUPLICATE_RECORD',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
}

/**
 * Base error class for data-source errors.
 * Used by both backend and mock data-sources.
 */
export abstract class DataSourceError extends FeatureError {
  protected constructor(
    message: string,
    code: DataSourceErrorCode,
    feature: string,
    context?: Record<string, unknown>,
    translationKey?: string,
    translationParams?: Record<string, string>,
  ) {
    super(
      message,
      code,
      feature,
      FeatureDomain.DATA_SOURCE,
      context,
      translationKey,
      translationParams,
    );
  }
}

/**
 * Error thrown when a connection to the data-source fails
 */
export abstract class DataSourceConnectionError extends DataSourceError {
  protected constructor(feature: string, context?: Record<string, unknown>) {
    super(
      `Failed to connect to ${feature} data-source`,
      DataSourceErrorCode.CONNECTION_FAILED,
      feature,
      context,
      'connection-failed',
    );
  }
}

/**
 * Error thrown when a record is not found
 */
export abstract class RecordNotFoundError extends DataSourceError {
  protected constructor(
    feature: string,
    readonly recordId: string,
    context?: Record<string, unknown>,
  ) {
    super(
      `Record with id '${recordId}' not found in ${feature}`,
      DataSourceErrorCode.RECORD_NOT_FOUND,
      feature,
      { recordId, ...context },
      'record-not-found',
      { recordId },
    );
  }
}

/**
 * Error thrown when a query operation fails
 */
export abstract class QueryFailedError extends DataSourceError {
  protected constructor(
    feature: string,
    readonly query: string,
    originalError?: Error,
    context?: Record<string, unknown>,
  ) {
    super(
      `Query failed for ${feature}: ${query}`,
      DataSourceErrorCode.QUERY_FAILED,
      feature,
      {
        query,
        originalError: originalError?.message,
        originalStack: originalError?.stack,
        ...context,
      },
      'query-failed',
      { query },
    );
  }
}

/**
 * Error thrown when the response from the data-source is invalid
 */
export abstract class InvalidResponseError extends DataSourceError {
  protected constructor(
    feature: string,
    readonly expectedType: string,
    readonly actualType: string,
    context?: Record<string, unknown>,
  ) {
    super(
      `Invalid response type for ${feature}: expected ${expectedType}, got ${actualType}`,
      DataSourceErrorCode.INVALID_RESPONSE,
      feature,
      { expectedType, actualType, ...context },
      'invalid-response',
      { expectedType, actualType },
    );
  }
}

/**
 * Error thrown when a duplicate record is detected
 */
export abstract class DuplicateRecordError extends DataSourceError {
  protected constructor(
    feature: string,
    readonly field: string,
    readonly value: unknown,
    context?: Record<string, unknown>,
  ) {
    super(
      `Duplicate ${field} value '${String(value)}' in ${feature}`,
      DataSourceErrorCode.DUPLICATE_RECORD,
      feature,
      { field, value, ...context },
      'duplicate-record',
      { field, value: String(value) },
    );
  }
}

/**
 * Error thrown when data validation fails at the data-source level
 */
export abstract class DataSourceValidationError extends DataSourceError {
  protected constructor(
    feature: string,
    readonly field: string,
    readonly reason: string,
    context?: Record<string, unknown>,
  ) {
    super(
      `Validation failed for ${field} in ${feature}: ${reason}`,
      DataSourceErrorCode.VALIDATION_FAILED,
      feature,
      { field, reason, ...context },
      'validation-failed',
      { field, reason },
    );
  }
}
