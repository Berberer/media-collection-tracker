import { AlreadyExistsError, RecordNotFoundError } from '../../../core/errors';

// Feature constant for consistent error categorization
const TAGS_FEATURE = 'tags';

// ============================================================================
// Data-Source Errors
// ============================================================================
/**
 * Error thrown when a tag record is not found in the data-source
 */
export class TagRecordNotFoundError extends RecordNotFoundError {
  constructor(recordId: string) {
    super(TAGS_FEATURE, recordId);
  }
}

// ============================================================================
// Use-Case Errors
// ============================================================================
/**
 * Error thrown when a tag with the same name already exists
 */
export class TagAlreadyExistsError extends AlreadyExistsError {
  constructor(identifier: string) {
    super(TAGS_FEATURE, 'Tag', identifier, undefined, { identifier });
  }
}
