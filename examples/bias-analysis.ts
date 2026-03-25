/**
 * Bias Analysis -- Example
 *
 * Shows how to use the BiasDetector and OutcomeAnalyzer to run a
 * bias detection audit on sentencing outcomes in a given jurisdiction,
 * broken down by race and representation status.
 */

import { BiasDetector } from '../src/analytics/bias-detector';
import { OutcomeAnalyzer } from '../src/analytics/outcome-analyzer';

async function main() {
  /* ---------------------------------------------------------------- */
  /*  1. Detect bias in sentencing by race                             */
  /* ---------------------------------------------------------------- */

  const detector = new BiasDetector({
    significanceLevel: 0.05,
    minimumSampleSize: 30,
  });

  console.log('--- Bias Detection: Sentencing by Race ---');

  const raceBias = await detector.detectBias(
    'CA',                       // jurisdiction
    'sentence_length',          // outcome metric
    'race',                     // protected attribute
    ['case_type', 'prior_record', 'charge_severity'], // control variables
  );

  console.log('Finding:', raceBias.finding);
  console.log('Disparity ratio:', raceBias.disparityRatio.toFixed(3));
  console.log('Statistical significance (p):', raceBias.statisticalSignificance.toFixed(4));
  console.log('Effect size:', raceBias.effectSize.toFixed(3));

  /* ---------------------------------------------------------------- */
  /*  2. Full audit across all protected attributes                    */
  /* ---------------------------------------------------------------- */

  console.log('\n--- Full Audit ---');

  const auditResults = await detector.runFullAudit('CA');

  for (const result of auditResults) {
    console.log(
      `${result.protectedAttribute} x ${result.metric}: ${result.finding}` +
      ` (disparity ratio = ${result.disparityRatio.toFixed(3)})`,
    );
  }

  /* ---------------------------------------------------------------- */
  /*  3. Outcome analysis with demographic breakdown                   */
  /* ---------------------------------------------------------------- */

  console.log('\n--- Outcome Analysis: Conviction Rate by Representation ---');

  const analyzer = new OutcomeAnalyzer();

  const outcomes = await analyzer.analyzeOutcomes(
    'CA',             // jurisdiction
    'criminal',       // case type
    'representation', // breakdown dimension
  );

  console.log('Overall conviction rate:', outcomes.overallValue.toFixed(3));
  console.log('Total sample size:', outcomes.totalSampleSize);

  for (const group of outcomes.breakdowns) {
    console.log(
      `  ${group.category}: ${group.value.toFixed(3)}` +
      ` (n=${group.sampleSize}, CI=[${group.confidenceInterval[0].toFixed(3)}, ${group.confidenceInterval[1].toFixed(3)}])`,
    );
  }

  /* ---------------------------------------------------------------- */
  /*  4. Cross-jurisdiction comparison                                 */
  /* ---------------------------------------------------------------- */

  console.log('\n--- Cross-Jurisdiction Comparison: Dismissal Rate ---');

  const comparison = await analyzer.compareOutcomes(
    ['CA', 'NY', 'TX'],
    'dismissal_rate',
  );

  for (const jurisdictionResult of comparison) {
    console.log(
      `Jurisdiction overall: ${jurisdictionResult.overallValue.toFixed(3)}` +
      ` (n=${jurisdictionResult.totalSampleSize})`,
    );
  }
}

main().catch(console.error);
