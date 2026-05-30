import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { extractErrorInfo, getTranslationKey, getTranslationParams } from '../errors';

/**
 * Pipe for translating error objects directly in templates.
 *
 * Usage:
 *   {{ error | errorTranslate }}
 *   {{ error | errorTranslate:defaultMessage }}
 *
 * If the error has a translation key, it will be translated with parameters.
 * Otherwise, falls back to the error message or the provided default.
 */
@Pipe({
  name: 'errorTranslate',
  standalone: true,
})
export class ErrorTranslatePipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  transform(error: unknown, defaultMessage?: string): string {
    // Extract error info
    const info = extractErrorInfo(error);

    // Get translation key
    const translationKeyElements = getTranslationKey(error);

    // If we have a translation key, use it
    if (translationKeyElements) {
      const params = getTranslationParams(error) ?? {};
      const translationKey = translationKeyElements
        .filter((element) => element !== undefined)
        .join('.');
      return this.translate.instant(translationKey, params) as string;
    }

    // Fall back to error message
    if (info.message) {
      return info.message;
    }

    // Fall back to default message
    return defaultMessage ?? (this.translate.instant('errors.default') as string);
  }
}
