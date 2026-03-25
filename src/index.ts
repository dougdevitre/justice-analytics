/**
 * @justice-os/analytics
 *
 * Main entry point for the Justice Analytics + Bias Detection Engine.
 * Exports ETL pipeline tools, analytics modules, dashboard builders,
 * and report generators for justice system transparency.
 */

export { createPipeline } from './etl/pipeline';
export { OutcomeAnalyzer } from './analytics/outcome-analyzer';
export { BiasDetector } from './analytics/bias-detector';
export { DisparityCalculator } from './analytics/disparity-calculator';
export { RiskPredictor } from './analytics/risk-predictor';

export { generateReport } from './reports/generator';

export * from './types';
