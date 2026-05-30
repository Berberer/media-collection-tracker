import { TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { BaseError, FeatureDomain, FeatureError } from '../errors';
import { ErrorTranslatePipe } from './error-translate.pipe';

describe('ErrorTranslatePipe', () => {
  let pipe: ErrorTranslatePipe;
  let translateService: jest.Mocked<TranslateService>;

  beforeEach(() => {
    // Create a mock TranslateService
    translateService = {
      instant: jest.fn((key: string) => {
        return `translated:${key}`;
      }),
      get: jest.fn(),
      onLangChange: jest.fn(),
      onTranslationChange: jest.fn(),
      onDefaultLangChange: jest.fn(),
      use: jest.fn(),
      setDefaultLang: jest.fn(),
      getBrowserLang: jest.fn(),
      getBrowserCultureLang: jest.fn(),
      currentLang: 'en',
      currentLoader: null,
      pending: null,
    } as unknown as jest.Mocked<TranslateService>;

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [{ provide: TranslateService, useValue: translateService }, ErrorTranslatePipe],
    });

    pipe = TestBed.inject(ErrorTranslatePipe);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('with errors that have translation keys', () => {
    it('should use translation key from FeatureError with fullTranslationKey', () => {
      const error = new (class extends FeatureError {
        constructor() {
          super(
            'Test error',
            'test-feature',
            FeatureDomain.USE_CASE,
            'test-error-code',
            'test-error',
            {
              param1: 'value1',
            },
          );
        }
      })();

      const result = pipe.transform(error);

      expect(translateService.instant).toHaveBeenCalledWith(
        'errors.test-feature.use-case.test-error-code.test-error',
        { param1: 'value1' },
      );
      expect(result).toBe('translated:errors.test-feature.use-case.test-error-code.test-error');
    });

    it('should use translation key from BaseError with translationKey', () => {
      const error = new (class extends BaseError {
        constructor() {
          super('Test error', 'test-error', ['custom-error'], { param: 'test' });
        }
      })();

      const result = pipe.transform(error);

      expect(translateService.instant).toHaveBeenCalledWith('errors.custom-error', {
        param: 'test',
      });
      expect(result).toBe('translated:errors.custom-error');
    });
  });

  describe('with errors that have messages but no translation keys', () => {
    it('should fall back to error message for regular Error', () => {
      const error = new Error('Something went wrong');

      const result = pipe.transform(error);

      expect(translateService.instant).not.toHaveBeenCalled();
      expect(result).toBe('Something went wrong');
    });

    it('should fall back to error message for string error', () => {
      const error = 'String error message';

      const result = pipe.transform(error);

      expect(translateService.instant).not.toHaveBeenCalled();
      expect(result).toBe('String error message');
    });

    it('should fall back to error message for object error', () => {
      const error = { message: 'Object error message', custom: 'data' };

      const result = pipe.transform(error);

      expect(translateService.instant).not.toHaveBeenCalled();
      expect(result).toBe('{"message":"Object error message","custom":"data"}');
    });
  });

  describe('with default message fallback', () => {
    it('should use provided default message when no translation key and no error message', () => {
      const error = new (class extends Error {
        constructor() {
          super('');
          this.message = '';
        }
      })();

      const result = pipe.transform(error, 'Custom default message');

      expect(translateService.instant).not.toHaveBeenCalled();
      expect(result).toBe('Custom default message');
    });

    it('should use i18n default message when no translation key, no error message, and no custom default', () => {
      const error = new (class extends Error {
        constructor() {
          super('');
          this.message = '';
        }
      })();

      const result = pipe.transform(error);

      expect(translateService.instant).toHaveBeenCalledWith('errors.default');
      expect(result).toBe('translated:errors.default');
    });

    it('should use provided default message over i18n default when both are available', () => {
      const error = new (class extends Error {
        constructor() {
          super('');
          this.message = '';
        }
      })();

      const result = pipe.transform(error, 'Custom default');

      expect(translateService.instant).not.toHaveBeenCalled();
      expect(result).toBe('Custom default');
    });
  });

  describe('edge cases', () => {
    it('should handle null error', () => {
      const result = pipe.transform(null);

      // null falls through to the default message since extractErrorInfo returns 'An unknown error occurred'
      expect(translateService.instant).not.toHaveBeenCalled();
      expect(result).toBe('An unknown error occurred');
    });

    it('should handle undefined error', () => {
      const result = pipe.transform(undefined);

      // undefined falls through to the default message since extractErrorInfo returns 'An unknown error occurred'
      expect(translateService.instant).not.toHaveBeenCalled();
      expect(result).toBe('An unknown error occurred');
    });

    it('should handle empty string error', () => {
      const result = pipe.transform('');

      // Empty string is treated as a string error with empty message
      // extractErrorInfo returns message: '' for empty string
      // Since message is empty (falsy), it falls back to default
      expect(translateService.instant).toHaveBeenCalledWith('errors.default');
      expect(result).toBe('translated:errors.default');
    });

    it('should handle number error', () => {
      const result = pipe.transform(404);

      // Numbers fall through to the default case in extractErrorInfo
      // which returns 'An unknown error occurred'
      expect(translateService.instant).not.toHaveBeenCalled();
      expect(result).toBe('An unknown error occurred');
    });

    it('should handle error with translationKey but empty message', () => {
      const error = new (class extends BaseError {
        constructor() {
          super('', 'empty-error', ['empty-error']);
        }
      })();

      const result = pipe.transform(error);

      expect(translateService.instant).toHaveBeenCalledWith('errors.empty-error', {});
      expect(result).toBe('translated:errors.empty-error');
    });
  });

  describe('translation parameters', () => {
    it('should pass translation parameters to translate service', () => {
      const error = new (class extends FeatureError {
        constructor() {
          super('Test error', 'test-feature', FeatureDomain.USE_CASE, 'test-error', 'param-error', {
            id: '123',
            name: 'test',
          });
        }
      })();

      pipe.transform(error);

      expect(translateService.instant).toHaveBeenCalledWith(
        'errors.test-feature.use-case.test-error.param-error',
        { id: '123', name: 'test' },
      );
    });

    it('should handle undefined translation parameters', () => {
      const error = new (class extends BaseError {
        constructor() {
          super('Test error', 'test-error', ['no-params']);
        }
      })();

      pipe.transform(error);

      expect(translateService.instant).toHaveBeenCalledWith('errors.no-params', {});
    });
  });
});
