import { PreconditionFailedError, RecordNotFoundError } from '../../../core/errors';

// Feature constant for consistent error categorization
const SERIES_FEATURE = 'series';

// ============================================================================
// Data-Source Errors
// ============================================================================
/**
 * Error thrown when a series record is not found in the data-source
 */
export class SeriesRecordNotFoundError extends RecordNotFoundError {
  constructor(recordId: string) {
    super(SERIES_FEATURE, recordId);
  }
}

// ============================================================================
// Use-Case Errors
// ============================================================================
/**
 * Error thrown when trying to set a series as a single volume, but it has multiple volumes attached
 */
export class SeriesSingleVolumeWithMultipleVolumesError extends PreconditionFailedError {
  constructor(seriesId: string, volumeCount: number) {
    super(
      SERIES_FEATURE,
      `Series ${seriesId} has ${volumeCount} volumes and cannot be set as single volume`,
      'single-volume-with-multiple-volumes',
      { volumeCount },
    );
  }
}

/**
 * Error thrown when trying to mark a series as completed, but it still has missing volumes
 */
export class SeriesCompletedWithMissingVolumesError extends PreconditionFailedError {
  constructor(seriesId: string, missingVolumeCount: number) {
    super(
      SERIES_FEATURE,
      `Series ${seriesId} has ${missingVolumeCount} missing volume(s) and cannot be marked as completed`,
      'completed-with-missing-volumes',
      { missingVolumeCount },
    );
  }
}
