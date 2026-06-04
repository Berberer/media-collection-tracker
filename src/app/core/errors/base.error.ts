/**
 * Base error class for all application errors.
 * Provides a consistent error structure across the application.
 */
export abstract class BaseError extends Error {
  readonly code: string;
  readonly timestamp: Date;
  readonly translationKey: (string | undefined)[];
  readonly translationParams?: Record<string, unknown>;
  handled = false;

  protected constructor(
    message: string,
    code: string,
    translationKey: (string | undefined)[],
    translationParams?: Record<string, unknown>,
  ) {
    super(message);
    this.code = code;
    this.timestamp = new Date();
    this.translationKey = ['errors', ...translationKey];
    this.translationParams = translationParams;
  }

  /**
   * Convert error to a plain object for logging/serialization
   */
  toJSON(): Record<string, unknown> {
    return {
      message: this.message,
      code: this.code,
      timestamp: this.timestamp.toISOString(),
      translationKey: this.translationKey,
      translationParams: this.translationParams,
      stack: this.stack?.split('\n'),
    };
  }
}
