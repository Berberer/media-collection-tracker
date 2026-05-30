import { RecordNotFoundError } from '../../../core/errors';

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
