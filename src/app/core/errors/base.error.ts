/**
 * Base error class for all application errors.
 * Provides a consistent error structure across the application.
 */
export abstract class BaseError extends Error {
  readonly timestamp: Date;
  readonly context?: Record<string, unknown>;
  readonly translationKey?: string;
  readonly translationParams?: Record<string, string>;

  protected constructor(
    message: string,
    readonly code: string,
    context?: Record<string, unknown>,
    translationKey?: string,
    translationParams?: Record<string, string>,
  ) {
    super(message);
    this.name = this.constructor.name;
    this.timestamp = new Date();
    this.context = context;
    this.translationKey = translationKey;
    this.translationParams = translationParams;
  }

  /**
   * Convert error to a plain object for logging/serialization
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      translationKey: this.translationKey,
      translationParams: this.translationParams,
      stack: this.stack?.split('\n'),
    };
  }
}
