import {
  AlreadyExistsError,
  BusinessRuleViolationError,
  ConflictError,
  DataSourceError,
  DataSourceErrorCode,
  DuplicateRecordError,
  InvalidInputError,
  InvalidResponseError,
  InvalidStateError,
  MappingFailedError,
  NotFoundError,
  OperationFailedError,
  PreconditionFailedError,
  QueryFailedError,
  RecordNotFoundError,
  RepositoryError,
  RepositoryErrorCode,
  TransformationFailedError,
  UseCaseError,
  UseCaseErrorCode,
  ValidationError,
} from '../../../core/errors';

// Feature constant for consistent error categorization
const SERIES_FEATURE = 'series';

// ============================================================================
// Data-Source Errors
// ============================================================================

/**
 * Base class for all series data-source errors
 */
export class SeriesDataSourceError extends DataSourceError {
  constructor(message: string, code: DataSourceErrorCode, context?: Record<string, unknown>) {
    super(message, code, SERIES_FEATURE, context);
  }
}

/**
 * Error thrown when a series record is not found in the data-source
 */
export class SeriesRecordNotFoundError extends RecordNotFoundError {
  constructor(recordId: string, context?: Record<string, unknown>) {
    super(SERIES_FEATURE, recordId, context);
  }
}

/**
 * Error thrown when a query to the series data-source fails
 */
export class SeriesQueryFailedError extends QueryFailedError {
  constructor(query: string, originalError?: Error, context?: Record<string, unknown>) {
    super(SERIES_FEATURE, query, originalError, context);
  }
}

/**
 * Error thrown when a duplicate series is detected
 */
export class SeriesDuplicateError extends DuplicateRecordError {
  constructor(field: string, value: unknown, context?: Record<string, unknown>) {
    super(SERIES_FEATURE, field, value, context);
  }
}

/**
 * Error thrown when the response from a series data-source is invalid
 */
export class SeriesInvalidResponseError extends InvalidResponseError {
  constructor(expectedType: string, actualType: string, context?: Record<string, unknown>) {
    super(SERIES_FEATURE, expectedType, actualType, context);
  }
}

// ============================================================================
// Repository Errors
// ============================================================================

/**
 * Base class for all series repository errors
 */
export class SeriesRepositoryError extends RepositoryError {
  constructor(message: string, code: RepositoryErrorCode, context?: Record<string, unknown>) {
    super(message, code, SERIES_FEATURE, context);
  }
}

/**
 * Error thrown when series model mapping fails
 */
export class SeriesMappingError extends MappingFailedError {
  constructor(
    sourceType: string,
    targetType: string,
    originalError?: Error,
    context?: Record<string, unknown>,
  ) {
    super(SERIES_FEATURE, sourceType, targetType, originalError, context);
  }
}

/**
 * Error thrown when series data transformation fails
 */
export class SeriesTransformationError extends TransformationFailedError {
  constructor(operation: string, originalError?: Error, context?: Record<string, unknown>) {
    super(SERIES_FEATURE, operation, originalError, context);
  }
}

/**
 * Error thrown when an invalid series state is detected
 */
export class SeriesInvalidStateError extends InvalidStateError {
  constructor(expectedState: string, actualState: string, context?: Record<string, unknown>) {
    super(SERIES_FEATURE, expectedState, actualState, context);
  }
}

/**
 * Error thrown when there's a conflict in series operations
 */
export class SeriesConflictError extends ConflictError {
  constructor(
    resourceType: string,
    resourceId: string,
    conflictReason: string,
    context?: Record<string, unknown>,
  ) {
    super(SERIES_FEATURE, resourceType, resourceId, conflictReason, context);
  }
}

// ============================================================================
// Use-Case Errors
// ============================================================================

/**
 * Base class for all series use-case errors
 */
export class SeriesUseCaseError extends UseCaseError {
  constructor(message: string, code: UseCaseErrorCode, context?: Record<string, unknown>) {
    super(message, code, SERIES_FEATURE, context);
  }
}

/**
 * Error thrown when series input validation fails
 */
export class SeriesValidationError extends ValidationError {
  constructor(errors: Record<string, string[]>, context?: Record<string, unknown>) {
    super(SERIES_FEATURE, errors, context);
  }
}

/**
 * Error thrown when a business rule for series is violated
 */
export class SeriesBusinessRuleError extends BusinessRuleViolationError {
  constructor(rule: string, details: string, context?: Record<string, unknown>) {
    super(SERIES_FEATURE, rule, details, context);
  }
}

/**
 * Error thrown when a precondition for a series use-case is not met
 */
export class SeriesPreconditionError extends PreconditionFailedError {
  constructor(precondition: string, context?: Record<string, unknown>) {
    super(SERIES_FEATURE, precondition, context);
  }
}

/**
 * Error thrown when a series is not found
 */
export class SeriesNotFoundError extends NotFoundError {
  constructor(resourceId: string, context?: Record<string, unknown>) {
    super(SERIES_FEATURE, 'Series', resourceId, context);
  }
}

/**
 * Error thrown when a series with the same name already exists
 */
export class SeriesAlreadyExistsError extends AlreadyExistsError {
  constructor(identifier: string, context?: Record<string, unknown>) {
    super(SERIES_FEATURE, 'Series', identifier, context);
  }
}

/**
 * Error thrown when series input is invalid
 */
export class SeriesInvalidInputError extends InvalidInputError {
  constructor(field: string, reason: string, context?: Record<string, unknown>) {
    super(SERIES_FEATURE, field, reason, context);
  }
}

/**
 * Error thrown when a series operation fails
 */
export class SeriesOperationError extends OperationFailedError {
  constructor(operation: string, originalError?: Error, context?: Record<string, unknown>) {
    super(SERIES_FEATURE, operation, originalError, context);
  }
}

// ============================================================================
// Feature-Specific Business Errors
// ============================================================================

/**
 * Error thrown when trying to delete a series that still has volumes
 */
export class SeriesHasVolumesError extends SeriesBusinessRuleError {
  constructor(seriesId: string, volumeCount: number, context?: Record<string, unknown>) {
    super(
      'Cannot delete series with volumes',
      `Series '${seriesId}' has ${volumeCount} volume(s) and cannot be deleted`,
      { seriesId, volumeCount, ...context },
    );
  }
}

/**
 * Error thrown when trying to update a completed series
 */
export class SeriesAlreadyCompletedError extends SeriesBusinessRuleError {
  constructor(seriesId: string, context?: Record<string, unknown>) {
    super(
      'Cannot modify completed series',
      `Series '${seriesId}' is already marked as completed and cannot be modified`,
      { seriesId, ...context },
    );
  }
}
