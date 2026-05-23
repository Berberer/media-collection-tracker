import { BaseError } from './base.error';

/**
 * Domain layers within a feature
 */
export enum FeatureDomain {
  DATA_SOURCE = 'DATA_SOURCE',
  REPOSITORY = 'REPOSITORY',
  USE_CASE = 'USE_CASE',
}

/**
 * Base error class for feature-specific errors.
 * All feature errors should extend this class.
 */
export abstract class FeatureError extends BaseError {
  readonly domain: FeatureDomain;

  protected constructor(
    message: string,
    code: string,
    readonly feature: string,
    domain: FeatureDomain,
    context?: Record<string, unknown>,
    translationKey?: string,
    translationParams?: Record<string, string>,
  ) {
    super(message, code, context, translationKey, translationParams);
    this.domain = domain;
  }

  /**
   * Get the fully qualified error code including feature and domain
   */
  get qualifiedCode(): string {
    return `${this.feature}.${this.domain}.${this.code}`;
  }

  /**
   * Get the translation key with feature and domain prefix in kebab-case
   */
  get fullTranslationKey(): string | undefined {
    if (!this.translationKey) return undefined;
    const domainKebab = this.domain.toLowerCase().replace('_', '-');
    return `errors.${this.feature}.${domainKebab}.${this.translationKey}`;
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      feature: this.feature,
      domain: this.domain,
      qualifiedCode: this.qualifiedCode,
      fullTranslationKey: this.fullTranslationKey,
    };
  }
}
