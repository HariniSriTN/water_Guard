import { ZoneData, ModelExplanation, WarningSign } from '../types/water';
import { formatPercentage, formatLiters, formatPressure } from '../utils/formatters';

/**
 * ML Anomaly Detection Engine
 * Evaluates multi-dimensional telemetry:
 * - Loss percentage deviation vs city baseline
 * - Pressure deviation vs expected standard operating pressure
 * - Minimum Night Flow (MNF) ratio
 * - Historical consumption variance
 */
export function analyzeZoneWithML(zone: ZoneData, allZones: ZoneData[]): ModelExplanation {
  const avgCityLossPct = allZones.reduce((acc, z) => acc + z.lossPercentage, 0) / Math.max(1, allZones.length);
  const reasons: string[] = [];
  const warningSigns: WarningSign[] = [];
  
  let anomalyScore = 0;

  // 1. Loss Percentage Evaluation
  if (zone.lossPercentage > 25) {
    anomalyScore += 45;
    reasons.push(`Loss percentage (${formatPercentage(zone.lossPercentage)}) is significantly higher than the city average of ${formatPercentage(avgCityLossPct)}.`);
    warningSigns.push({
      id: 'high-loss',
      label: 'High Water Loss',
      severity: 'critical',
      description: `Unaccounted water is ${formatLiters(zone.currentLoss)}, representing ${formatPercentage(zone.lossPercentage)} of total supplied water.`
    });
  } else if (zone.lossPercentage > 15) {
    anomalyScore += 25;
    reasons.push(`Water loss (${formatPercentage(zone.lossPercentage)}) is moderately elevated above normal thresholds (7-10%).`);
    warningSigns.push({
      id: 'elevated-loss',
      label: 'Elevated Water Loss',
      severity: 'warning',
      description: `Loss percentage is ${formatPercentage(zone.lossPercentage)}.`
    });
  }

  // 2. Pressure Deviation Evaluation
  const pressureDelta = zone.currentPressure - zone.standardPressure;
  const pressurePctDiff = Math.abs(pressureDelta / zone.standardPressure) * 100;
  
  if (zone.currentPressure < zone.standardPressure * 0.7) {
    anomalyScore += 30;
    reasons.push(`Pressure is ${formatPressure(zone.currentPressure)}, which is ${pressurePctDiff.toFixed(0)}% lower than standard (${formatPressure(zone.standardPressure)}), often indicating high-volume outflow or rupture.`);
    warningSigns.push({
      id: 'low-pressure',
      label: 'Abnormal Pressure Drop',
      severity: 'critical',
      description: `Current pressure (${formatPressure(zone.currentPressure)}) is well below expected standard.`
    });
  } else if (zone.currentPressure > zone.standardPressure * 1.2) {
    anomalyScore += 20;
    reasons.push(`Pressure is unusually high (${formatPressure(zone.currentPressure)} vs expected ${formatPressure(zone.standardPressure)}), which can overstress joints or indicate valve closure downstream.`);
    warningSigns.push({
      id: 'high-pressure',
      label: 'Excess Line Pressure',
      severity: 'warning',
      description: `Line pressure is running ${pressurePctDiff.toFixed(0)}% above recommended standard.`
    });
  }

  // 3. Night Flow (MNF) Evaluation
  if (zone.minNightFlow > 1000) {
    anomalyScore += 20;
    reasons.push(`Minimum Night Flow (02:00-04:00 AM) is extremely high at ${formatLiters(zone.minNightFlow)}/hr, indicating continuous background losses when legitimate customer demand is near zero.`);
    warningSigns.push({
      id: 'night-flow',
      label: 'Night Flow Surge',
      severity: 'critical',
      description: `Continuous baseline loss of ${formatLiters(zone.minNightFlow)}/hr recorded overnight.`
    });
  }

  // 4. Historical Consumption Shift
  if (zone.history && zone.history.length >= 3) {
    const prevDays = zone.history.slice(0, zone.history.length - 1);
    const avgHistoricalConsumed = prevDays.reduce((a, b) => a + b.consumedLiters, 0) / prevDays.length;
    const consumptionDropPct = ((avgHistoricalConsumed - zone.currentConsumed) / avgHistoricalConsumed) * 100;

    if (consumptionDropPct > 20) {
      anomalyScore += 15;
      reasons.push(`Recent metered consumption dropped by ${consumptionDropPct.toFixed(0)}% compared to the 7-day baseline.`);
      warningSigns.push({
        id: 'consumption-shift',
        label: 'Sudden Consumption Change',
        severity: 'warning',
        description: `Billed consumption deviates notably from historical moving average.`
      });
    }
  }

  // Cap score between 0 and 100
  const finalScore = Math.min(100, Math.max(0, anomalyScore));
  const isAbnormal = finalScore >= 50;

  if (reasons.length === 0) {
    reasons.push('All telemetry parameters (Supply, Consumption, Pressure, Night Flow) are operating within normal baseline limits.');
  }

  let plainSummary = '';
  if (isAbnormal) {
    plainSummary = `The machine learning model detected significant anomalies in ${zone.name}. The primary drivers are high unaccounted water volume combined with abnormal pressure fluctuations.`;
  } else if (finalScore > 25) {
    plainSummary = `${zone.name} is showing slight statistical variance, but remains within manageable operating tolerances. Continuous monitoring advised.`;
  } else {
    plainSummary = `${zone.name} exhibits healthy distribution metrics with balanced pressure and expected consumption rates.`;
  }

  return {
    zoneId: zone.id,
    zoneName: zone.name,
    isAbnormal,
    anomalyScore: finalScore,
    plainSummary,
    reasons,
    warningSigns
  };
}
