import {
  DataSourceError,
  DataSourceErrorCode,
  DuplicateRecordError,
  InvalidResponseError,
  QueryFailedError,
  RecordNotFoundError,
  ConflictError,
  InvalidStateError,
  MappingFailedError,
  RepositoryError,
  RepositoryErrorCode,
  TransformationFailedError,
  AlreadyExistsError,
  BusinessRuleViolationError,
  InvalidInputError,
  NotFoundError,
  OperationFailedError,
  PreconditionFailedError,
  UseCaseError,
  UseCaseErrorCode,
  ValidationError,
} from '../../../core/errors';

// Feature constant for consistent error categorization
const TAGS_FEATURE = 'tags';

// ============================================================================
// Data-Source Errors
// ============================================================================

/**
 * Base class for all tags data-source errors
 */
export class TagsDataSourceError extends DataSourceError {
  constructor(message: string, code: DataSourceErrorCode, context?: Record<string, unknown>) {
    super(message, code, TAGS_FEATURE, context);
  }
}

/**
 * Error thrown when a tag record is not found in the data-source
 */
export class TagRecordNotFoundError extends RecordNotFoundError {
  constructor(recordId: string, context?: Record<string, unknown>) {
    super(TAGS_FEATURE, recordId, context);
  }
}

/**
 * Error thrown when a query to the tag data-source fails
 */
export class TagsQueryFailedError extends QueryFailedError {
  constructor(query: string, originalError?: Error, context?: Record<string, unknown>) {
    super(TAGS_FEATURE, query, originalError, context);
  }
}

/**
 * Error thrown when a duplicate tag is detected
 */
export class TagDuplicateError extends DuplicateRecordError {
  constructor(field: string, value: unknown, context?: Record<string, unknown>) {
    super(TAGS_FEATURE, field, value, context);
  }
}

/**
 * Error thrown when the response from the tag data-source is invalid
 */
export class TagsInvalidResponseError extends InvalidResponseError {
  constructor(expectedType: string, actualType: string, context?: Record<string, unknown>) {
    super(TAGS_FEATURE, expectedType, actualType, context);
  }
}

// ============================================================================
// Repository Errors
// ============================================================================

/**
 * Base class for all tags repository errors
 */
export class TagsRepositoryError extends RepositoryError {
  constructor(message: string, code: RepositoryErrorCode, context?: Record<string, unknown>) {
    super(message, code, TAGS_FEATURE, context);
  }
}

/**
 * Error thrown when tag model mapping fails
 */
export class TagMappingError extends MappingFailedError {
  constructor(
    sourceType: string,
    targetType: string,
    originalError?: Error,
    context?: Record<string, unknown>,
  ) {
    super(TAGS_FEATURE, sourceType, targetType, originalError, context);
  }
}

/**
 * Error thrown when tag data transformation fails
 */
export class TagTransformationError extends TransformationFailedError {
  constructor(operation: string, originalError?: Error, context?: Record<string, unknown>) {
    super(TAGS_FEATURE, operation, originalError, context);
  }
}

/**
 * Error thrown when an invalid tag state is detected
 */
export class TagInvalidStateError extends InvalidStateError {
  constructor(expectedState: string, actualState: string, context?: Record<string, unknown>) {
    super(TAGS_FEATURE, expectedState, actualState, context);
  }
}

/**
 * Error thrown when there's a conflict in tag operations
 */
export class TagConflictError extends ConflictError {
  constructor(
    resourceType: string,
    resourceId: string,
    conflictReason: string,
    context?: Record<string, unknown>,
  ) {
    super(TAGS_FEATURE, resourceType, resourceId, conflictReason, context);
  }
}

// ============================================================================
// Use-Case Errors
// ============================================================================

/**
 * Base class for all tags use-case errors
 */
export class TagsUseCaseError extends UseCaseError {
  constructor(message: string, code: UseCaseErrorCode, context?: Record<string, unknown>) {
    super(message, code, TAGS_FEATURE, context);
  }
}

/**
 * Error thrown when tag input validation fails
 */
export class TagValidationError extends ValidationError {
  constructor(errors: Record<string, string[]>, context?: Record<string, unknown>) {
    super(TAGS_FEATURE, errors, context);
  }
}

/**
 * Error thrown when a business rule for tags is violated
 */
export class TagBusinessRuleError extends BusinessRuleViolationError {
  constructor(rule: string, details: string, context?: Record<string, unknown>) {
    super(TAGS_FEATURE, rule, details, context);
  }
}

/**
 * Error thrown when a precondition for a tag use-case is not met
 * Error thrown when a precondition for a tag use-case is not met
 */
export class TagPreconditionError extends PreconditionFailedError {
  constructor(precondition: string, context?: Record<string, unknown>) {
    super(TAGS_FEATURE, precondition, context);
  }
}

/**
 * Error thrown when a tag is not found
 */
export class TagNotFoundError extends NotFoundError {
  constructor(resourceId: string, context?: Record<string, unknown>) {
    super(TAGS_FEATURE, 'Tag', resourceId, context);
  }
}

/**
 * Error thrown when a tag with the same name already exists
 */
export class TagAlreadyExistsError extends AlreadyExistsError {
  constructor(identifier: string, context?: Record<string, unknown>) {
    super(TAGS_FEATURE, 'Tag', identifier, context);
  }
}

/**
 * Error thrown when tag input is invalid
 */
export class TagInvalidInputError extends InvalidInputError {
  constructor(field: string, reason: string, context?: Record<string, unknown>) {
    super(TAGS_FEATURE, field, reason, context);
  }
}

/**
 * Error thrown when a tag operation fails
 */
export class TagOperationError extends OperationFailedError {
  constructor(operation: string, originalError?: Error, context?: Record<string, unknown>) {
    super(TAGS_FEATURE, operation, originalError, context);
  }
}

// ============================================================================
// Feature-Specific Business Errors
// ============================================================================

/**
 * Error thrown when trying to create a tag with an empty name
 */
export class EmptyTagNameError extends TagInvalidInputError {
  constructor(context?: Record<string, unknown>) {
    super('name', 'Tag name cannot be empty', context);
  }
}

/**
 * Error thrown when trying to create a tag with a name that's too long
 */
export class TagNameTooLongError extends TagInvalidInputError {
  constructor(name: string, maxLength: number, context?: Record<string, unknown>) {
    super('name', `Tag name exceeds maximum length of ${maxLength} characters`, {
      name,
      maxLength,
      actualLength: name.length,
      ...context,
    });
  }
}

/**
 * Error thrown when trying to delete a tag that is still in use
 */
export class TagInUseError extends TagConflictError {
  constructor(tagId: string, usageCount: number, context?: Record<string, unknown>) {
    super('Tag', tagId, `Cannot delete tag that is used by ${usageCount} resource(s)`, {
      tagId,
      usageCount,
      ...context,
    });
  }
}
