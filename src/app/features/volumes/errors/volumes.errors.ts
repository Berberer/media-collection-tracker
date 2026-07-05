import { PreconditionFailedError, RecordNotFoundError } from '../../../core/errors';

// Feature constant for consistent error categorization
const VOLUMES_FEATURE = 'volumes';

// ============================================================================
// Data-Source Errors
// ============================================================================
/**
 * Error thrown when a volume record is not found in the data-source
 */
export class VolumeRecordNotFoundError extends RecordNotFoundError {
  constructor(recordId: string) {
    super(VOLUMES_FEATURE, recordId);
  }
}

// ============================================================================
// Use-Case Errors
// ============================================================================
/**
 * Error thrown when trying to add a second volume to a single-volume series
 */
export class SecondVolumeInSingleVolumeSeriesError extends PreconditionFailedError {
  constructor(seriesId: string) {
    super(
      VOLUMES_FEATURE,
      `Series ${seriesId} is marked as single-volume and cannot have a second volume.`,
      'adding-second-volume-to-single-volume-series',
    );
  }
}
