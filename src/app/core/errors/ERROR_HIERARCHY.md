# Error Hierarchy for Media Collection Tracker

This document describes the error hierarchy system used throughout the application for consistent error handling across features, use-cases, repositories, and data-sources.

## Structure

The error hierarchy follows a **layered naming convention**: `feature.domain.code(.reason)?`

- **Feature**: The feature module (e.g., `series`, `volumes`, `tags`)
- **Domain**: The architectural layer (e.g., `data-source`, `repository`, `use-case`)
- **Code**: The specific error type in kebab-case (e.g., `record-not-found`, `validation-failed`)
- **Reason** (Optional): Additional reason code if the error can be caused by multiple reasons within the feature

## Translation Keys

All errors support i18n through translation keys following the pattern:

```
errors.{feature}.{domain-kebab-case}.{error-code}
```

Example: `errors.series.data-source.record-not-found`

If the error with the `error-code` can be caused by multiple reasons in the feature, the translation key should have a fourth segment:

```
errors.{feature}.{domain-kebab-case}.{error-code}.{reason-code}
```

## Base Classes

### `BaseError` (core/errors/base.error.ts)

The root error class with:

- `code`: Error code string
- `message`: Human-readable error message
- `timestamp`: When the error occurred
- `translationKey`: Array of translation key segments (joined with '.' to form the full key)
- `translationParams`: Parameters for translation
- `handled`: Boolean flag indicating whether the error has been handled (defaults to `false`)

### `FeatureError` (core/errors/feature.error.ts)

Extends `BaseError` with:

- `feature`: Feature name
- `domain`: Layer (`FeatureDomain` enum with kebab-case values: `data-source`, `repository`, `use-case`)

## Domain-Specific Errors

### Data-Source Errors (core/errors/data-source.error.ts)

Base: `DataSourceError` extends `FeatureError` with domain = `data-source`

Available error classes:

- `DataSourceConnectionError` - Connection to data-source failed
- `RecordNotFoundError` - Record not found
- `QueryFailedError` - Query operation failed
- `InvalidResponseError` - Response format is invalid
- `DataSourceValidationError` - Data validation failed at source level

Translation key pattern: `errors.{feature}.data-source.{error-code}`

### Repository Errors (core/errors/repository.error.ts)

Base: `RepositoryError` extends `FeatureError` with domain = `repository`

Available error classes:

- `MappingFailedError` - Model mapping failed
- `TransformationFailedError` - Data transformation failed
- `InvalidStateError` - Invalid state detected
- `ConflictError` - Conflict in operations

Translation key pattern: `errors.{feature}.repository.{error-code}`

### Use-Case Errors (core/errors/use-case.error.ts)

Base: `UseCaseError` extends `FeatureError` with domain = `use-case`

Available error classes:

- `ValidationError` - Input validation failed
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
// Data-Source Layer
new SeriesRecordNotFoundError('series-123');
// Translation key: "errors.series.data-source.record-not-found"

// Use-Case Layer
new SeriesSingleVolumeWithMultipleVolumesError('series-123', 5);
// Translation key: "errors.series.use-case.single-volume-with-multiple-volumes"

new SeriesCompletedWithMissingVolumesError('series-123', 3);
// Translation key: "errors.series.use-case.completed-with-missing-volumes"
```

## Usage Examples

### In a Use-Case

```typescript
import { SeriesSingleVolumeWithMultipleVolumesError } from '../errors';

@Injectable({ providedIn: 'root' })
export class UpdateSeriesUseCase implements UseCase<UpdateSeriesParams, SeriesModel> {
  async execute(params: UpdateSeriesParams): Promise<SeriesModel> {
    const volumes = await this.volumesRepository.getVolumesBySeries(params.id);

    if (params.singleVolume && volumes.length > 1) {
      throw new SeriesSingleVolumeWithMultipleVolumesError(params.id, volumes.length);
    }

    return this.repository.update(params);
  }
}
```

### In a Repository

```typescript
import { SeriesRecordNotFoundError } from '../../../core/errors';

@Injectable({ providedIn: 'root' })
export class SeriesRepository {
  async getById(id: string): Promise<SeriesModel | null> {
    try {
      const record = await this.dataSource.getById(id);
      return SeriesModel.fromRecord(record);
    } catch (error) {
      if (error instanceof SeriesRecordNotFoundError) {
        return null;
      }
      throw error;
    }
  }
}
```

### In a Data-Source

```typescript
import { SeriesRecordNotFoundError } from '../errors';
import { ClientResponseError } from 'pocketbase';

export class BackendSeriesDataSource implements SeriesDataSource {
  async getById(id: string): Promise<SeriesRecord> {
    try {
      const record = await this.service.getOne(id);
      return record;
    } catch (error) {
      if (error instanceof ClientResponseError && error.status === 404) {
        throw new SeriesRecordNotFoundError(id);
      }
      throw error;
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

    if (translationKey && translationKey.length > 0) {
      const message = await this.translate.get(translationKey.join('.'), params).toPromise();
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
- `extractErrorInfo(error)`: Extract all error information safely
- `getTranslationKey(error)`: Get the translation key array
- `getTranslationParams(error)`: Get translation parameters
- `logError(error)`: Log error with consistent formatting

## Adding New Feature Errors

When adding errors for a new feature:

1. Create `src/app/features/{feature}/errors/{feature}.errors.ts`
2. Export all errors from `src/app/features/{feature}/errors/index.ts`
3. Use kebab-case for translation keys
4. Extend appropriate base error classes from core/errors
5. Pass new translation key segment

Example:

```typescript
// src/app/features/new-feature/errors/new-feature.errors.ts
import { RecordNotFoundError } from '../../../core/errors';

const NEW_FEATURE = 'newFeature';

export class NewFeatureRecordNotFoundError extends RecordNotFoundError {
  constructor(recordId: string) {
    super(NEW_FEATURE, recordId);
  }
}
```

## Translation Files

Add translations to `public/i18n/{lang}.json`:

```json
{
  "errors": {
    "default": "An error occurred",
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
        "not-found": "Series not found",
        "single-volume-with-multiple-volumes": "Cannot set series as single volume when it has {{volumeCount}} volumes",
        "completed-with-missing-volumes": "Cannot mark series as completed when it has {{missingVolumeCount}} missing volumes"
      }
    }
  }
}
```
