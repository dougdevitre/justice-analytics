/**
 * Outcome Analyzer
 *
 * Analyzes case outcomes across demographic breakdowns including
 * race, income, geography, and representation status. Calculates
 * outcome rates, conviction rates, sentence distributions, and
 * other metrics that reveal patterns in how the justice system
 * treats different populations.
 */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface OutcomeBreakdown {
  /** Group label (e.g. "represented", "unrepresented") */
  category: string;
  /** Metric value for this group */
  value: number;
  /** Number of cases in this group */
  sampleSize: number;
  /** 95% confidence interval [lower, upper] */
  confidenceInterval: [number, number];
}

export interface OutcomeAnalysis {
  /** The metric analyzed (e.g. "conviction_rate") */
  metric: string;
  /** Breakdown by demographic group */
  breakdowns: OutcomeBreakdown[];
  /** Overall metric value across all groups */
  overallValue: number;
  /** Total cases in the analysis */
  totalSampleSize: number;
}

export interface TrendPoint {
  /** Time period label (e.g. "2024-Q1") */
  period: string;
  /** Metric value in this period */
  value: number;
  /** Sample size for this period */
  sampleSize: number;
}

export interface OutcomeAnalyzerOptions {
  /** Confidence level for intervals (default 0.95) */
  confidenceLevel?: number;
  /** Minimum cases per group to report (default 10 for privacy) */
  minimumCellSize?: number;
}

/* ------------------------------------------------------------------ */
/*  Analyzer                                                           */
/* ------------------------------------------------------------------ */

export class OutcomeAnalyzer {
  private readonly confidenceLevel: number;
  private readonly minimumCellSize: number;

  constructor(options: OutcomeAnalyzerOptions = {}) {
    this.confidenceLevel = options.confidenceLevel ?? 0.95;
    this.minimumCellSize = options.minimumCellSize ?? 10;
  }

  /**
   * Analyze outcomes for a jurisdiction and case type, broken down
   * by a demographic dimension.
   */
  async analyzeOutcomes(
    jurisdiction: string,
    caseType: string,
    breakdownBy: string,
  ): Promise<OutcomeAnalysis> {
    // Fetch raw data (stub)
    const data = await this.fetchData(jurisdiction, caseType, breakdownBy);

    // Compute per-group metrics
    const breakdowns: OutcomeBreakdown[] = [];
    let totalValue = 0;
    let totalN = 0;

    for (const [category, outcomes] of data.entries()) {
      if (outcomes.length < this.minimumCellSize) continue; // privacy suppression

      const value = this.mean(outcomes);
      const ci = this.confidenceInterval(outcomes);
      breakdowns.push({
        category,
        value,
        sampleSize: outcomes.length,
        confidenceInterval: ci,
      });

      totalValue += value * outcomes.length;
      totalN += outcomes.length;
    }

    return {
      metric: `${caseType}_outcome`,
      breakdowns,
      overallValue: totalN > 0 ? totalValue / totalN : 0,
      totalSampleSize: totalN,
    };
  }

  /**
   * Compare a single metric across multiple jurisdictions.
   */
  async compareOutcomes(
    jurisdictions: string[],
    metric: string,
  ): Promise<OutcomeAnalysis[]> {
    const results: OutcomeAnalysis[] = [];

    for (const jurisdiction of jurisdictions) {
      const analysis = await this.analyzeOutcomes(jurisdiction, 'all', 'overall');
      results.push({ ...analysis, metric });
    }

    return results;
  }

  /**
   * Compute a time-series trend for a given metric.
   */
  async analyzeTrend(
    jurisdiction: string,
    metric: string,
    periods: string[],
  ): Promise<TrendPoint[]> {
    // TODO: fetch time-series data from warehouse
    return periods.map((period) => ({
      period,
      value: 0,
      sampleSize: 0,
    }));
  }

  /* ---- statistical helpers ---- */

  private mean(values: number[]): number {
    if (values.length === 0) return 0;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private standardDeviation(values: number[]): number {
    if (values.length < 2) return 0;
    const avg = this.mean(values);
    const squaredDiffs = values.map((v) => (v - avg) ** 2);
    return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / (values.length - 1));
  }

  private confidenceInterval(values: number[]): [number, number] {
    if (values.length < 2) return [0, 0];
    const avg = this.mean(values);
    const sd = this.standardDeviation(values);
    // z-score for 95% CI
    const z = this.confidenceLevel === 0.99 ? 2.576 : 1.96;
    const margin = z * (sd / Math.sqrt(values.length));
    return [avg - margin, avg + margin];
  }

  /* ---- data access (stubs) ---- */

  private async fetchData(
    _jurisdiction: string,
    _caseType: string,
    _breakdownBy: string,
  ): Promise<Map<string, number[]>> {
    // TODO: connect to analytics warehouse
    return new Map();
  }
}
