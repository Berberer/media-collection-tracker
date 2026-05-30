import { FeatureDomain, FeatureError } from './feature.error';

/**
 * Error codes for data-source operations
 */
enum DataSourceErrorCode {
  CONNECTION_FAILED = 'connection-failed',
  RECORD_NOT_FOUND = 'record-not-found',
  QUERY_FAILED = 'query-failed',
  INVALID_RESPONSE = 'invalid-response',
  VALIDATION_FAILED = 'validation-failed',
}

/**
 * Base error class for data-source errors.
 * Used by both backend and mock data-sources.
 */
abstract class DataSourceError extends FeatureError {
  protected constructor(
    message: string,
    feature: string,
    code: DataSourceErrorCode,
    translationKey?: string,
    translationParams?: Record<string, unknown>,
  ) {
    super(message, feature, FeatureDomain.DATA_SOURCE, code, translationKey, translationParams);
  }
}

/**
 * Error thrown when a connection to the data-source fails
 */
export abstract class DataSourceConnectionError extends DataSourceError {
  protected constructor(
    feature: string,
    translationKey?: string,
    translationParams?: Record<string, unknown>,
  ) {
    super(
      `Failed to connect to ${feature} data-source`,
      feature,
      DataSourceErrorCode.CONNECTION_FAILED,
      translationKey,
      translationParams,
    );
  }
}

/**
 * Error thrown when a record is not found
 */
export abstract class RecordNotFoundError extends DataSourceError {
  protected constructor(
    feature: string,
    recordId: string,
    translationKey?: string,
    translationParams?: Record<string, unknown>,
  ) {
    super(
      `Record with id '${recordId}' not found in ${feature}`,
      feature,
      DataSourceErrorCode.RECORD_NOT_FOUND,
      translationKey,
      translationParams,
    );
  }
}

/**
 * Error thrown when a query operation fails
 */
export abstract class QueryFailedError extends DataSourceError {
  protected constructor(
    feature: string,
    query: string,
    translationKey?: string,
    translationParams?: Record<string, unknown>,
  ) {
    super(
      `Query failed for ${feature}: ${query}`,
      feature,
      DataSourceErrorCode.QUERY_FAILED,
      translationKey,
      translationParams,
    );
  }
}

/**
 * Error thrown when the response from the data-source is invalid
 */
export abstract class InvalidResponseError extends DataSourceError {
  protected constructor(
    feature: string,
    expectedType: string,
    actualType: string,
    translationKey?: string,
    translationParams?: Record<string, unknown>,
  ) {
    super(
      `Invalid response type for ${feature}: expected ${expectedType}, got ${actualType}`,
      feature,
      DataSourceErrorCode.INVALID_RESPONSE,
      translationKey,
      translationParams,
    );
  }
}

/**
 * Error thrown when data validation fails at the data-source level
 */
export abstract class DataSourceValidationError extends DataSourceError {
  protected constructor(
    feature: string,
    field: string,
    reason: string,
    translationKey?: string,
    translationParams?: Record<string, unknown>,
  ) {
    super(
      `Validation failed for ${field} in ${feature}: ${reason}`,
      feature,
      DataSourceErrorCode.VALIDATION_FAILED,
      translationKey,
      translationParams,
    );
  }
}
