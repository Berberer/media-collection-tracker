import { BaseError } from './base.error';

/**
 * Domain layers within a feature
 */
export enum FeatureDomain {
  DATA_SOURCE = 'data-source',
  REPOSITORY = 'repository',
  USE_CASE = 'use-case',
}

/**
 * Base error class for feature-specific errors.
 * All feature errors should extend this class.
 */
export abstract class FeatureError extends BaseError {
  readonly domain: FeatureDomain;
  readonly feature: string;

  protected constructor(
    message: string,
    feature: string,
    domain: FeatureDomain,
    code: string,
    translationKey?: string,
    translationParams?: Record<string, unknown>,
  ) {
    super(message, code, [feature, domain, code, translationKey], translationParams);
    this.domain = domain;
    this.feature = feature;
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      feature: this.feature,
      domain: this.domain,
    };
  }
}
