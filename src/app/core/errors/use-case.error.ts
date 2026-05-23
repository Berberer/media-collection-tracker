import { FeatureError, FeatureDomain } from './feature.error';

/**
 * Error codes for use-case operations
 */
export enum UseCaseErrorCode {
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  BUSINESS_RULE_VIOLATION = 'BUSINESS_RULE_VIOLATION',
  PRECONDITION_FAILED = 'PRECONDITION_FAILED',
  POSTCONDITION_FAILED = 'POSTCONDITION_FAILED',
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',
  INVALID_INPUT = 'INVALID_INPUT',
  OPERATION_FAILED = 'OPERATION_FAILED',
}

/**
 * Base error class for use-case errors.
 * Use-case errors represent business logic failures and validation issues.
 */
export abstract class UseCaseError extends FeatureError {
  protected constructor(
    message: string,
    code: UseCaseErrorCode,
    feature: string,
    context?: Record<string, unknown>,
    translationKey?: string,
    translationParams?: Record<string, string>,
  ) {
    super(
      message,
      code,
      feature,
      FeatureDomain.USE_CASE,
      context,
      translationKey,
      translationParams,
    );
  }
}

/**
 * Error thrown when input validation fails in a use-case
 */
export abstract class ValidationError extends UseCaseError {
  protected readonly errors: Record<string, string[]>;

  protected constructor(
    feature: string,
    errors: Record<string, string[]>,
    context?: Record<string, unknown>,
  ) {
    const errorMessages = Object.entries(errors)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
      .join('; ');

    super(
      `Validation failed for ${feature}: ${errorMessages}`,
      UseCaseErrorCode.VALIDATION_FAILED,
      feature,
      { errors, ...context },
      'validation-failed',
      { fields: Object.keys(errors).join(', ') },
    );

    this.errors = errors;
  }
}

/**
 * Error thrown when a business rule is violated
 */
export abstract class BusinessRuleViolationError extends UseCaseError {
  protected constructor(
    feature: string,
    readonly rule: string,
    readonly details: string,
    context?: Record<string, unknown>,
  ) {
    super(
      `Business rule violation in ${feature}: ${rule} - ${details}`,
      UseCaseErrorCode.BUSINESS_RULE_VIOLATION,
      feature,
      { rule, details, ...context },
      'business-rule-violation',
      { rule },
    );
  }
}

/**
 * Error thrown when a precondition for a use-case is not met
 */
export abstract class PreconditionFailedError extends UseCaseError {
  protected constructor(
    feature: string,
    readonly precondition: string,
    context?: Record<string, unknown>,
  ) {
    super(
      `Precondition failed for ${feature}: ${precondition}`,
      UseCaseErrorCode.PRECONDITION_FAILED,
      feature,
      { precondition, ...context },
      'precondition-failed',
      { precondition },
    );
  }
}

/**
 * Error thrown when a postcondition for a use-case is not met
 */
export abstract class PostconditionFailedError extends UseCaseError {
  protected constructor(
    feature: string,
    readonly postcondition: string,
    context?: Record<string, unknown>,
  ) {
    super(
      `Postcondition failed for ${feature}: ${postcondition}`,
      UseCaseErrorCode.POSTCONDITION_FAILED,
      feature,
      { postcondition, ...context },
      'postcondition-failed',
      { postcondition },
    );
  }
}

/**
 * Error thrown when a required resource is not found
 */
export abstract class NotFoundError extends UseCaseError {
  protected constructor(
    feature: string,
    readonly resourceType: string,
    readonly resourceId: string,
    context?: Record<string, unknown>,
  ) {
    super(
      `${resourceType} with id '${resourceId}' not found in ${feature}`,
      UseCaseErrorCode.NOT_FOUND,
      feature,
      { resourceType, resourceId, ...context },
      'not-found',
      { resourceType, resourceId },
    );
  }
}

/**
 * Error thrown when trying to create a resource that already exists
 */
export abstract class AlreadyExistsError extends UseCaseError {
  protected constructor(
    feature: string,
    readonly resourceType: string,
    readonly identifier: string,
    context?: Record<string, unknown>,
  ) {
    super(
      `${resourceType} with identifier '${identifier}' already exists in ${feature}`,
      UseCaseErrorCode.ALREADY_EXISTS,
      feature,
      { resourceType, identifier, ...context },
      'already-exists',
      { resourceType, identifier },
    );
  }
}

/**
 * Error thrown when input is invalid for a use-case
 */
export abstract class InvalidInputError extends UseCaseError {
  protected constructor(
    feature: string,
    readonly field: string,
    readonly reason: string,
    context?: Record<string, unknown>,
  ) {
    super(
      `Invalid input for ${field} in ${feature}: ${reason}`,
      UseCaseErrorCode.INVALID_INPUT,
      feature,
      { field, reason, ...context },
      'invalid-input',
      { field, reason },
    );
  }
}

/**
 * Generic error for when a use-case operation fails
 */
export abstract class OperationFailedError extends UseCaseError {
  protected constructor(
    feature: string,
    readonly operation: string,
    originalError?: Error,
    context?: Record<string, unknown>,
  ) {
    super(
      `Operation '${operation}' failed in ${feature}`,
      UseCaseErrorCode.OPERATION_FAILED,
      feature,
      {
        operation,
        originalError: originalError?.message,
        originalStack: originalError?.stack,
        ...context,
      },
      'operation-failed',
      { operation },
    );
  }
}
