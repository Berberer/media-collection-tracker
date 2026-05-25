import { FeatureDomain, FeatureError } from './feature.error';

/**
 * Error codes for repository operations
 */
export enum RepositoryErrorCode {
  MAPPING_FAILED = 'MAPPING_FAILED',
  TRANSFORMATION_FAILED = 'TRANSFORMATION_FAILED',
  INVALID_STATE = 'INVALID_STATE',
  CONFLICT = 'CONFLICT',
}

/**
 * Base error class for repository errors.
 * Repository errors occur during data transformation and business logic coordination.
 */
export abstract class RepositoryError extends FeatureError {
  protected constructor(
    message: string,
    code: RepositoryErrorCode,
    feature: string,
    context?: Record<string, unknown>,
    translationKey?: string,
    translationParams?: Record<string, string>,
  ) {
    super(
      message,
      code,
      feature,
      FeatureDomain.REPOSITORY,
      context,
      translationKey,
      translationParams,
    );
  }
}

/**
 * Error thrown when model mapping from record fails
 */
export abstract class MappingFailedError extends RepositoryError {
  protected constructor(
    feature: string,
    readonly sourceType: string,
    readonly targetType: string,
    originalError?: Error,
    context?: Record<string, unknown>,
  ) {
    super(
      `Failed to map ${sourceType} to ${targetType} in ${feature}`,
      RepositoryErrorCode.MAPPING_FAILED,
      feature,
      {
        sourceType,
        targetType,
        originalError: originalError?.message,
        ...context,
      },
      'mapping-failed',
      { sourceType, targetType },
    );
  }
}

/**
 * Error thrown when data transformation fails
 */
export abstract class TransformationFailedError extends RepositoryError {
  protected constructor(
    feature: string,
    readonly operation: string,
    originalError?: Error,
    context?: Record<string, unknown>,
  ) {
    super(
      `Data transformation failed during ${operation} in ${feature}`,
      RepositoryErrorCode.TRANSFORMATION_FAILED,
      feature,
      {
        operation,
        originalError: originalError?.message,
        ...context,
      },
      'transformation-failed',
      { operation },
    );
  }
}

/**
 * Error thrown when an invalid state is detected
 */
export abstract class InvalidStateError extends RepositoryError {
  protected constructor(
    feature: string,
    readonly expectedState: string,
    readonly actualState: string,
    context?: Record<string, unknown>,
  ) {
    super(
      `Invalid state in ${feature}: expected ${expectedState}, got ${actualState}`,
      RepositoryErrorCode.INVALID_STATE,
      feature,
      { expectedState, actualState, ...context },
      'invalid-state',
      { expectedState, actualState },
    );
  }
}

/**
 * Error thrown when there's a conflict in operations
 */
export abstract class ConflictError extends RepositoryError {
  protected constructor(
    feature: string,
    readonly resourceType: string,
    readonly resourceId: string,
    readonly conflictReason: string,
    context?: Record<string, unknown>,
  ) {
    super(
      `Conflict detected for ${resourceType} '${resourceId}' in ${feature}: ${conflictReason}`,
      RepositoryErrorCode.CONFLICT,
      feature,
      {
        resourceType,
        resourceId,
        conflictReason,
        ...context,
      },
      'conflict',
      { resourceType, resourceId, conflictReason },
    );
  }
}
