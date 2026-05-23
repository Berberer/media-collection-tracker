# Error Hierarchy for Media Collection Tracker

This document describes the error hierarchy system used throughout the application for consistent error handling across features, use-cases, repositories, and data-sources.

## Structure

The error hierarchy follows a **three-layer naming convention**: `feature.domain.code`

- **Feature**: The feature module (e.g., `series`, `volumes`, `tags`)
- **Domain**: The architectural layer (e.g., `DATA_SOURCE`, `REPOSITORY`, `USE_CASE`, `BUSINESS`)
- **Code**: The specific error type in kebab-case (e.g., `record-not-found`, `validation-failed`)

## Translation Keys

All errors support i18n through translation keys following the pattern:

```
errors.{feature}.{domain-kebab-case}.{error-code}
```

Example: `errors.series.data-source.record-not-found`

## Base Classes

### `BaseError` (core/errors/base.error.ts)

The root error class with:

- `code`: Error code string
- `message`: Human-readable error message
- `timestamp`: When the error occurred
- `context`: Additional error context
- `translationKey`: i18n key (without prefix)
- `translationParams`: Parameters for translation

### `FeatureError` (core/errors/feature.error.ts)

Extends `BaseError` with:

- `feature`: Feature name
- `domain`: Layer (`FeatureDomain` enum)
- `qualifiedCode`: Full code as `feature.domain.code`
- `fullTranslationKey`: Full i18n key as `errors.feature.domain-kebab-case.error-code`

## Domain-Specific Errors

### Data-Source Errors (core/errors/data-source.error.ts)

Base: `DataSourceError` extends `FeatureError` with domain = `DATA_SOURCE`

Available error classes:

- `DataSourceConnectionError` - Connection to data-source failed
- `RecordNotFoundError` - Record not found
- `QueryFailedError` - Query operation failed
- `InvalidResponseError` - Response format is invalid
- `DuplicateRecordError` - Duplicate record detected
- `DataSourceValidationError` - Data validation failed at source level

Translation key pattern: `errors.{feature}.data-source.{error-code}`

### Repository Errors (core/errors/repository.error.ts)

Base: `RepositoryError` extends `FeatureError` with domain = `REPOSITORY`

Available error classes:

- `MappingFailedError` - Model mapping failed
- `TransformationFailedError` - Data transformation failed
- `InvalidStateError` - Invalid state detected
- `ConflictError` - Conflict in operations

Translation key pattern: `errors.{feature}.repository.{error-code}`

### Use-Case Errors (core/errors/use-case.error.ts)

Base: `UseCaseError` extends `FeatureError` with domain = `USE_CASE`

Available error classes:

- `ValidationError` - Input validation failed
- `BusinessRuleViolationError` - Business rule violated
- `PreconditionFailedError` - Precondition not met
- `PostconditionFailedError` - Postcondition not met
- `NotFoundError` - Resource not found
- `AlreadyExistsError` - Resource already exists
- `InvalidInputError` - Input is invalid
- `OperationFailedError` - Operation failed

Translation key pattern: `errors.{feature}.use-case.{error-code}`

## Feature-Specific Errors

Each feature module has its own error file that extends the core error classes with feature-specific implementations:

- `src/app/features/series/errors/series.errors.ts`
- `src/app/features/volumes/errors/volumes.errors.ts`
- `src/app/features/tags/errors/tags.errors.ts`

### Series Errors Example

```typescript
// data-source Layer
new SeriesRecordNotFoundError('series-123');
// qualifiedCode: "series.DATA_SOURCE.RECORD_NOT_FOUND"
// fullTranslationKey: "errors.series.data-source.record-not-found"

// Repository Layer
new SeriesMappingError('SeriesRecord', 'SeriesModel');
// qualifiedCode: "series.REPOSITORY.MAPPING_FAILED"
// fullTranslationKey: "errors.series.repository.mapping-failed"

// Use-Case Layer
new SeriesNotFoundError('series-123');
// qualifiedCode: "series.USE_CASE.NOT_FOUND"
// fullTranslationKey: "errors.series.use-case.not-found"

// Business Layer (custom)
new SeriesHasVolumesError('series-123', 5);
// qualifiedCode: "series.BUSINESS.BUSINESS_RULE_VIOLATION"
// fullTranslationKey: "errors.series.business.series-has-volumes"
```

## Usage Examples

### In a Use-Case

```typescript
import { SeriesNotFoundError, SeriesValidationError } from '../errors';

@Injectable({ providedIn: 'root' })
export class GetSeriesUseCase implements UseCase<string, SeriesModel> {
  async execute(id: string): Promise<SeriesModel> {
    // Validate input
    if (!id) {
      throw new SeriesValidationError({
        id: ['Series ID is required'],
      });
    }

    // Check if exists
    const series = await this.repository.getById(id);
    if (!series) {
      throw new SeriesNotFoundError(id);
    }

    return series;
  }
}
```

### In a Repository

```typescript
import { SeriesMappingError } from '../errors';

@Injectable({ providedIn: 'root' })
export class SeriesRepository {
  async getById(id: string): Promise<SeriesModel | null> {
    try {
      const record = await this.dataSource.getById(id);
      return SeriesModel.fromRecord(record);
    } catch (error) {
      if (error instanceof RecordNotFoundError) {
        return null;
      }
      throw new SeriesMappingError('SeriesRecord', 'SeriesModel', error as Error);
    }
  }
}
```

### In a Data-Source

```typescript
import { SeriesRecordNotFoundError } from '../errors';

export class BackendSeriesDataSource implements SeriesDataSource {
  async getById(id: string): Promise<SeriesRecord> {
    try {
      const record = await this.service.getOne(id);
      if (!record) {
        throw new SeriesRecordNotFoundError(id);
      }
      return record;
    } catch (error) {
      throw new SeriesRecordNotFoundError(id, {}, undefined, error as Error);
    }
  }
}
```

### Handling Errors in Components

```typescript
import { getTranslationKey, getTranslationParams } from '../../../core/errors/error.utils';

@Injectable({ providedIn: 'root' })
export class SeriesService {
  constructor(private translate: TranslateService) {}

  async handleError(error: unknown): Promise<void> {
    const translationKey = getTranslationKey(error);
    const params = getTranslationParams(error);

    if (translationKey) {
      const message = await this.translate.get(translationKey, params).toPromise();
      // Display translated message to user
    } else {
      // Fallback to error message
      const info = extractErrorInfo(error);
      console.error(info.message);
    }
  }
}
```

## Error Utilities (core/errors/error.utils.ts)

- `isBaseError(error)`: Type guard for BaseError
- `isFeatureError(error)`: Type guard for FeatureError
- `hasTranslation(error)`: Type guard for translatable errors
- `extractErrorInfo(error)`: Extract all error information safely
- `getUserFriendlyErrorMessage(error)`: Get message suitable for display
- `getTranslationKey(error)`: Get the full translation key
- `getTranslationParams(error)`: Get translation parameters
- `logError(error, context)`: Log error with consistent formatting
- `wrapError(promise, context)`: Wrap promise to catch and transform errors
- `createErrorResponse(error)`: Create standardized API error response

## Adding New Feature Errors

When adding errors for a new feature:

1. Create `src/app/features/{feature}/errors/{feature}.errors.ts`
2. Export all errors from `src/app/features/{feature}/errors/index.ts`
3. Use kebab-case for translation keys
4. Extend appropriate base error classes
5. Include meaningful context in error constructors

Example:

```typescript
// src/app/features/new-feature/errors/new-feature.errors.ts
import { DataSourceError, DataSourceErrorCode } from '../../../core/errors/data-source.error';

const NEW_FEATURE = 'newFeature';

export class NewFeatureRecordNotFoundError extends DataSourceError {
  constructor(recordId: string, context?: Record<string, unknown>) {
    super(
      `Record not found`,
      DataSourceErrorCode.RECORD_NOT_FOUND,
      NEW_FEATURE,
      { recordId, ...context },
      'record-not-found',
      { recordId },
    );
  }
}
```

## Translation Files

Add translations to `public/i18n/{lang}.json`:

```json
{
  "errors": {
    "series": {
      "data-source": {
        "record-not-found": "Series with ID {{recordId}} not found",
        "connection-failed": "Failed to connect to series data-source"
      },
      "repository": {
        "mapping-failed": "Failed to map series data"
      },
      "use-case": {
        "validation-failed": "Series validation failed: {{fields}}",
        "not-found": "Series not found"
      },
      "business": {
        "series-has-volumes": "Cannot delete series with {{volumeCount}} volumes"
      }
    }
  }
}
```
