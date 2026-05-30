import { FeatureDomain, FeatureError } from './feature.error';

/**
 * Error codes for use-case operations
 */
enum UseCaseErrorCode {
  VALIDATION_FAILED = 'validation-failed',
  PRECONDITION_FAILED = 'precondition-failed',
  POSTCONDITION_FAILED = 'postcondition-failed',
  NOT_FOUND = 'not-found',
  ALREADY_EXISTS = 'already-exists',
  INVALID_INPUT = 'invalid-input',
  OPERATION_FAILED = 'operation-failed',
}

/**
 * Base error class for use-case errors.
 * Use-case errors represent business logic failures and validation issues.
 */
abstract class UseCaseError extends FeatureError {
  protected constructor(
    message: string,
    feature: string,
    code: UseCaseErrorCode,
    translationKey?: string,
    translationParams?: Record<string, unknown>,
  ) {
    super(message, feature, FeatureDomain.USE_CASE, code, translationKey, translationParams);
  }
}

/**
 * Error thrown when input validation fails in a use-case
 */
export abstract class ValidationError extends UseCaseError {
  protected constructor(
    feature: string,
    errors: Record<string, string[]>,
    translationKey?: string,
    translationParams?: Record<string, unknown>,
  ) {
    const errorMessages = Object.entries(errors)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
      .join('; ');

    super(
      `Validation failed for ${feature}: ${errorMessages}`,
      feature,
      UseCaseErrorCode.VALIDATION_FAILED,
      translationKey,
      translationParams,
    );
  }
}

/**
 * Error thrown when a precondition for a use-case is not met
 */
export abstract class PreconditionFailedError extends UseCaseError {
  protected constructor(
    feature: string,
    precondition: string,
    translationKey?: string,
    translationParams?: Record<string, unknown>,
  ) {
    super(
      `Precondition failed for ${feature}: ${precondition}`,
      feature,
      UseCaseErrorCode.PRECONDITION_FAILED,
      translationKey,
      translationParams,
    );
  }
}

/**
 * Error thrown when a postcondition for a use-case is not met
 */
export abstract class PostconditionFailedError extends UseCaseError {
  protected constructor(
    feature: string,
    postcondition: string,
    translationKey?: string,
    translationParams?: Record<string, unknown>,
  ) {
    super(
      `Postcondition failed for ${feature}: ${postcondition}`,
      feature,
      UseCaseErrorCode.POSTCONDITION_FAILED,
      translationKey,
      translationParams,
    );
  }
}

/**
 * Error thrown when a required resource is not found
 */
export abstract class NotFoundError extends UseCaseError {
  protected constructor(
    feature: string,
    resourceType: string,
    resourceId: string,
    translationKey?: string,
    translationParams?: Record<string, unknown>,
  ) {
    super(
      `${resourceType} with id '${resourceId}' not found in ${feature}`,
      feature,
      UseCaseErrorCode.NOT_FOUND,
      translationKey,
      translationParams,
    );
  }
}

/**
 * Error thrown when trying to create a resource that already exists
 */
export abstract class AlreadyExistsError extends UseCaseError {
  protected constructor(
    feature: string,
    resourceType: string,
    identifier: string,
    translationKey?: string,
    translationParams?: Record<string, unknown>,
  ) {
    super(
      `${resourceType} with identifier '${identifier}' already exists in ${feature}`,
      feature,
      UseCaseErrorCode.ALREADY_EXISTS,
      translationKey,
      translationParams,
    );
  }
}

/**
 * Error thrown when input is invalid for a use-case
 */
export abstract class InvalidInputError extends UseCaseError {
  protected constructor(
    feature: string,
    field: string,
    reason: string,
    translationKey?: string,
    translationParams?: Record<string, unknown>,
  ) {
    super(
      `Invalid input for ${field} in ${feature}: ${reason}`,
      feature,
      UseCaseErrorCode.INVALID_INPUT,
      translationKey,
      translationParams,
    );
  }
}

/**
 * Generic error for when a use-case operation fails
 */
export abstract class OperationFailedError extends UseCaseError {
  protected constructor(
    feature: string,
    operation: string,
    translationKey?: string,
    translationParams?: Record<string, unknown>,
  ) {
    super(
      `Operation '${operation}' failed in ${feature}`,
      feature,
      UseCaseErrorCode.OPERATION_FAILED,
      translationKey,
      translationParams,
    );
  }
}
