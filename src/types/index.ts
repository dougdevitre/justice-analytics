/**
 * Shared Type Definitions
 *
 * Common types used across the Justice Analytics engine.
 * Defines interfaces for data models, configuration, and
 * cross-cutting analytics concerns.
 */

/** Demographic categories for breakdowns */
export type DemographicCategory = 'race' | 'income' | 'geography' | 'representation' | 'language' | 'age';

/** Time granularity for trend analysis */
export type TimeGranularity = 'day' | 'week' | 'month' | 'quarter' | 'year';

/** Privacy level for analytics output */
export type PrivacyLevel = 'public' | 'aggregated' | 'restricted';

/** Analytics query configuration */
export interface AnalyticsQuery {
  jurisdiction: string;
  caseType?: string;
  timeRange: { start: string; end: string };
  breakdownBy?: DemographicCategory[];
  granularity?: TimeGranularity;
  privacyLevel: PrivacyLevel;
}

/** Standard result envelope for analytics responses */
export interface AnalyticsResult<T> {
  query: AnalyticsQuery;
  data: T;
  metadata: {
    sampleSize: number;
    generatedAt: string;
    privacyNote?: string;
  };
}
