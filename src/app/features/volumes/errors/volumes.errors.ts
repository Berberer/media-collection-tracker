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
const VOLUMES_FEATURE = 'volumes';

// ============================================================================
// Data-Source Errors
// ============================================================================

/**
 * Base class for all volumes data-source errors
 */
export class VolumesDataSourceError extends DataSourceError {
  constructor(message: string, code: DataSourceErrorCode, context?: Record<string, unknown>) {
    super(message, code, VOLUMES_FEATURE, context);
  }
}

/**
 * Error thrown when a volume record is not found in the data-source
 */
export class VolumeRecordNotFoundError extends RecordNotFoundError {
  constructor(recordId: string, context?: Record<string, unknown>) {
    super(VOLUMES_FEATURE, recordId, context);
  }
}

/**
 * Error thrown when a query to the volume data-source fails
 */
export class VolumesQueryFailedError extends QueryFailedError {
  constructor(query: string, originalError?: Error, context?: Record<string, unknown>) {
    super(VOLUMES_FEATURE, query, originalError, context);
  }
}

/**
 * Error thrown when a duplicate volume is detected
 */
export class VolumeDuplicateError extends DuplicateRecordError {
  constructor(field: string, value: unknown, context?: Record<string, unknown>) {
    super(VOLUMES_FEATURE, field, value, context);
  }
}

/**
 * Error thrown when the response from the volume data-source is invalid
 */
export class VolumesInvalidResponseError extends InvalidResponseError {
  constructor(expectedType: string, actualType: string, context?: Record<string, unknown>) {
    super(VOLUMES_FEATURE, expectedType, actualType, context);
  }
}

// ============================================================================
// Repository Errors
// ============================================================================

/**
 * Base class for all volume repository errors
 */
export class VolumesRepositoryError extends RepositoryError {
  constructor(message: string, code: RepositoryErrorCode, context?: Record<string, unknown>) {
    super(message, code, VOLUMES_FEATURE, context);
  }
}

/**
 * Error thrown when volume model mapping fails
 */
export class VolumeMappingError extends MappingFailedError {
  constructor(
    sourceType: string,
    targetType: string,
    originalError?: Error,
    context?: Record<string, unknown>,
  ) {
    super(VOLUMES_FEATURE, sourceType, targetType, originalError, context);
  }
}

/**
 * Error thrown when volume data transformation fails
 */
export class VolumeTransformationError extends TransformationFailedError {
  constructor(operation: string, originalError?: Error, context?: Record<string, unknown>) {
    super(VOLUMES_FEATURE, operation, originalError, context);
  }
}

/**
 * Error thrown when an invalid volume state is detected
 */
export class VolumeInvalidStateError extends InvalidStateError {
  constructor(expectedState: string, actualState: string, context?: Record<string, unknown>) {
    super(VOLUMES_FEATURE, expectedState, actualState, context);
  }
}

/**
 * Error thrown when there's a conflict in volume operations
 */
export class VolumeConflictError extends ConflictError {
  constructor(
    resourceType: string,
    resourceId: string,
    conflictReason: string,
    context?: Record<string, unknown>,
  ) {
    super(VOLUMES_FEATURE, resourceType, resourceId, conflictReason, context);
  }
}

// ============================================================================
// Use-Case Errors
// ============================================================================

/**
 * Base class for all volumes use-case errors
 */
export class VolumesUseCaseError extends UseCaseError {
  constructor(message: string, code: UseCaseErrorCode, context?: Record<string, unknown>) {
    super(message, code, VOLUMES_FEATURE, context);
  }
}

/**
 * Error thrown when volume input validation fails
 */
export class VolumeValidationError extends ValidationError {
  constructor(errors: Record<string, string[]>, context?: Record<string, unknown>) {
    super(VOLUMES_FEATURE, errors, context);
  }
}

/**
 * Error thrown when a business rule for volumes is violated
 */
export class VolumeBusinessRuleError extends BusinessRuleViolationError {
  constructor(rule: string, details: string, context?: Record<string, unknown>) {
    super(VOLUMES_FEATURE, rule, details, context);
  }
}

/**
 * Error thrown when a precondition for a volume use-case is not met
 */
export class VolumePreconditionError extends PreconditionFailedError {
  constructor(precondition: string, context?: Record<string, unknown>) {
    super(VOLUMES_FEATURE, precondition, context);
  }
}

/**
 * Error thrown when a volume is not found
 */
export class VolumeNotFoundError extends NotFoundError {
  constructor(resourceId: string, context?: Record<string, unknown>) {
    super(VOLUMES_FEATURE, 'Volume', resourceId, context);
  }
}

/**
 * Error thrown when a volume with the same sequence number already exists
 */
export class VolumeAlreadyExistsError extends AlreadyExistsError {
  constructor(seriesId: string, sequenceNumber: number, context?: Record<string, unknown>) {
    super(VOLUMES_FEATURE, 'Volume', `${seriesId}:${sequenceNumber}`, {
      seriesId,
      sequenceNumber,
      ...context,
    });
  }
}

/**
 * Error thrown when volume input is invalid
 */
export class VolumeInvalidInputError extends InvalidInputError {
  constructor(field: string, reason: string, context?: Record<string, unknown>) {
    super(VOLUMES_FEATURE, field, reason, context);
  }
}

/**
 * Error thrown when a volume operation fails
 */
export class VolumeOperationError extends OperationFailedError {
  constructor(operation: string, originalError?: Error, context?: Record<string, unknown>) {
    super(VOLUMES_FEATURE, operation, originalError, context);
  }
}

// ============================================================================
// Feature-Specific Business Errors
// ============================================================================

/**
 * Error thrown when trying to create a volume for a non-existent series
 */
export class SeriesNotFoundForVolumeError extends VolumeBusinessRuleError {
  constructor(seriesId: string, context?: Record<string, unknown>) {
    super('Series not found', `Cannot create volume for non-existent series '${seriesId}'`, {
      seriesId,
      ...context,
    });
  }
}

/**
 * Error thrown when trying to create a volume with an invalid sequence number
 */
export class InvalidSequenceNumberError extends VolumeInvalidInputError {
  constructor(sequenceNumber: number, min = 1, context?: Record<string, unknown>) {
    super('sequenceNumber', `Sequence number must be >= ${min}, got ${sequenceNumber}`, {
      sequenceNumber,
      min,
      ...context,
    });
  }
}

/**
 * Error thrown when trying to update a volume that doesn't belong to the specified series
 */
export class VolumeSeriesMismatchError extends VolumeBusinessRuleError {
  constructor(
    volumeId: string,
    expectedSeriesId: string,
    actualSeriesId: string,
    context?: Record<string, unknown>,
  ) {
    super(
      'Volume series mismatch',
      `Volume '${volumeId}' belongs to series '${actualSeriesId}', not '${expectedSeriesId}'`,
      {
        volumeId,
        expectedSeriesId,
        actualSeriesId,
        ...context,
      },
    );
  }
}

/**
 * Error thrown when trying to mark a volume as collected before its release date
 */
export class VolumeNotYetReleasedError extends VolumeBusinessRuleError {
  constructor(volumeId: string, releaseDate: Date, context?: Record<string, unknown>) {
    super(
      'Volume not yet released',
      `Cannot mark volume '${volumeId}' as collected before release date ${releaseDate.toISOString()}`,
      { volumeId, releaseDate: releaseDate.toISOString(), ...context },
    );
  }
}

/**
 * Error thrown when trying to delete a volume that is referenced by other entities
 */
export class VolumeInUseError extends VolumeConflictError {
  constructor(volumeId: string, usageDetails: string, context?: Record<string, unknown>) {
    super('Volume', volumeId, usageDetails, context);
  }
}
