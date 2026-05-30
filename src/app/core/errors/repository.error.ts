import { FeatureDomain, FeatureError } from './feature.error';

/**
 * Error codes for repository operations
 */
enum RepositoryErrorCode {
  MAPPING_FAILED = 'mapping-failed',
  TRANSFORMATION_FAILED = 'transformation-failed',
  INVALID_STATE = 'invalid-state',
  CONFLICT = 'conflict',
}

/**
 * Base error class for repository errors.
 * Repository errors occur during data transformation and business logic coordination.
 */
abstract class RepositoryError extends FeatureError {
  protected constructor(
    message: string,
    feature: string,
    code: RepositoryErrorCode,
    translationKey?: string,
    translationParams?: Record<string, unknown>,
  ) {
    super(message, feature, FeatureDomain.REPOSITORY, code, translationKey, translationParams);
  }
}

/**
 * Error thrown when model mapping from record fails
 */
export abstract class MappingFailedError extends RepositoryError {
  protected constructor(
    feature: string,
    sourceType: string,
    targetType: string,
    translationKey?: string,
    translationParams?: Record<string, unknown>,
  ) {
    super(
      `Failed to map ${sourceType} to ${targetType} in ${feature}`,
      feature,
      RepositoryErrorCode.MAPPING_FAILED,
      translationKey,
      translationParams,
    );
  }
}

/**
 * Error thrown when data transformation fails
 */
export abstract class TransformationFailedError extends RepositoryError {
  protected constructor(
    feature: string,
    operation: string,
    translationKey?: string,
    translationParams?: Record<string, unknown>,
  ) {
    super(
      `Data transformation failed during ${operation} in ${feature}`,
      feature,
      RepositoryErrorCode.TRANSFORMATION_FAILED,
      translationKey,
      translationParams,
    );
  }
}

/**
 * Error thrown when an invalid state is detected
 */
export abstract class InvalidStateError extends RepositoryError {
  protected constructor(
    feature: string,
    expectedState: string,
    actualState: string,
    translationKey?: string,
    translationParams?: Record<string, unknown>,
  ) {
    super(
      `Invalid state in ${feature}: expected ${expectedState}, got ${actualState}`,
      feature,
      RepositoryErrorCode.INVALID_STATE,
      translationKey,
      translationParams,
    );
  }
}

/**
 * Error thrown when there's a conflict in operations
 */
export abstract class ConflictError extends RepositoryError {
  protected constructor(
    feature: string,
    resourceType: string,
    resourceId: string,
    conflictReason: string,
    translationKey?: string,
    translationParams?: Record<string, unknown>,
  ) {
    super(
      `Conflict detected for ${resourceType} '${resourceId}' in ${feature}: ${conflictReason}`,
      feature,
      RepositoryErrorCode.CONFLICT,
      translationKey,
      translationParams,
    );
  }
}
