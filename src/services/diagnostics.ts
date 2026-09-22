import { ZoneData, DiagnosticReason } from '../types/water';
import { formatLiters, formatPercentage, formatPressure } from '../utils/formatters';

/**
 * Root-Cause Diagnostics Engine
 * Translates raw sensor measurements into plain-English root causes with concrete data evidence and actionable recommendations.
 */
export function diagnoseZone(zone: ZoneData): DiagnosticReason[] {
  const diagnostics: DiagnosticReason[] = [];

  // 1. Possible Pipeline Leakage
  // Triggered when supply is high, consumption is significantly lower, and night flow or pressure drop is present
  if (zone.lossPercentage > 20 && zone.currentSupply >= 15000) {
    const nightFlowText = zone.minNightFlow > 500 
      ? ` Minimum Night Flow is abnormally high at ${formatLiters(zone.minNightFlow)}/hr between 2 AM and 4 AM.`
      : '';
    const pressureDropText = zone.currentPressure < zone.standardPressure * 0.8
      ? ` Pipeline pressure dropped to ${formatPressure(zone.currentPressure)} (standard is ${formatPressure(zone.standardPressure)}).`
      : '';

    diagnostics.push({
      id: `leak-${zone.id}`,
      title: '💧 Possible Pipeline Leakage',
      icon: 'Droplets',
      category: 'leakage',
      confidence: zone.lossPercentage > 30 ? 'High' : 'Medium',
      evidence: `Supply is ${formatLiters(zone.currentSupply)}, but only ${formatLiters(zone.currentConsumed)} was recorded at consumer meters, leaving ${formatLiters(zone.currentLoss)} (${formatPercentage(zone.lossPercentage)}) unaccounted for.${pressureDropText}${nightFlowText}`,
      suggestedAction: `Dispatch an acoustic leak detection crew to inspect distribution mains and joint fittings across ${zone.name}, starting near low-pressure sensor nodes.`,
      zoneId: zone.id,
      zoneName: zone.name
    });
  }

  // 2. Pressure Problem
  // Triggered when pressure deviates notably from standard operating limits
  if (zone.currentPressure > 0 && Math.abs(zone.currentPressure - zone.standardPressure) >= 0.5) {
    const isHigh = zone.currentPressure > zone.standardPressure;
    diagnostics.push({
      id: `pressure-${zone.id}`,
      title: '🔧 Pressure Problem',
      icon: 'Gauge',
      category: 'pressure',
      confidence: 'High',
      evidence: isHigh
        ? `${zone.name} pressure is recorded at ${formatPressure(zone.currentPressure)}, which is significantly higher than the standard target (${formatPressure(zone.standardPressure)}). Excessive pressure increases stress on older pipes (avg age: ${zone.avgPipeAgeYears} yrs).`
        : `${zone.name} pressure is ${formatPressure(zone.currentPressure)}, well below the standard target of ${formatPressure(zone.standardPressure)}. Pressure drops often accompany large physical line fractures or open blow-offs.`,
      suggestedAction: isHigh
        ? 'Adjust Pressure Reducing Valves (PRVs) and calibrate upstream booster pumps to bring line pressure into safe working thresholds.'
        : 'Inspect pressure control equipment, check for open hydrant flushing, and survey feeder mains for hidden bursts.',
      zoneId: zone.id,
      zoneName: zone.name
    });
  }

  // 3. Possible Meter Issue
  // Triggered when sensorHealth is suspect or consumption is disproportionately low while pressure remains high
  if (zone.sensorHealth === 'Suspect' || (zone.currentPressure >= zone.standardPressure && zone.lossPercentage > 25)) {
    diagnostics.push({
      id: `meter-${zone.id}`,
      title: '📟 Possible Meter Issue',
      icon: 'Cpu',
      category: 'meter',
      confidence: zone.sensorHealth === 'Suspect' ? 'High' : 'Medium',
      evidence: `Bulk flow telemetry shows high upstream pressure (${formatPressure(zone.currentPressure)}), but billed consumer endpoints report sharp drop-offs. Sensor telemetry health is currently flagged as "${zone.sensorHealth}".`,
      suggestedAction: 'Send telemetry technicians to recalibrate District Metered Area (DMA) ultrasonic flow meters and inspect commercial water meters.',
      zoneId: zone.id,
      zoneName: zone.name
    });
  }

  // 4. Abnormal Consumption Pattern
  // Triggered when historical consumption shows sudden shift
  if (zone.history && zone.history.length >= 4) {
    const earlyHistory = zone.history.slice(0, 3);
    const avgEarly = earlyHistory.reduce((s, h) => s + h.consumedLiters, 0) / earlyHistory.length;
    const diff = Math.abs(zone.currentConsumed - avgEarly);
    const diffPct = (diff / Math.max(1, avgEarly)) * 100;

    if (diffPct > 25) {
      diagnostics.push({
        id: `abn-cons-${zone.id}`,
        title: '📈 Abnormal Consumption Pattern',
        icon: 'TrendingDown',
        category: 'consumption',
        confidence: 'Medium',
        evidence: `Current consumption of ${formatLiters(zone.currentConsumed)} shifted by ${diffPct.toFixed(0)}% compared to the earlier baseline average of ${formatLiters(avgEarly)}.`,
        suggestedAction: 'Review commercial customer billing accounts and check for large unauthorized drawdowns or unrecorded construction usage.',
        zoneId: zone.id,
        zoneName: zone.name
      });
    }
  }

  // 5. Distribution Loss / Aging Infrastructure
  // Triggered when pipe age is high (>20 years) and loss is steady
  if (zone.avgPipeAgeYears >= 20 && zone.lossPercentage > 15) {
    diagnostics.push({
      id: `dist-${zone.id}`,
      title: '🏘️ Distribution & Infrastructure Loss',
      icon: 'Network',
      category: 'distribution',
      confidence: 'Medium',
      evidence: `Zone network has an average pipe age of ${zone.avgPipeAgeYears} years spanning ${zone.pipeLengthKm} km of distribution mains, making it prone to background micro-leaks and joint weeping.`,
      suggestedAction: 'Schedule sector for non-destructive pipe wall thickness testing and prioritize for pipe rehabilitation / lining program.',
      zoneId: zone.id,
      zoneName: zone.name
    });
  }

  // If no issues detected
  if (diagnostics.length === 0) {
    diagnostics.push({
      id: `normal-${zone.id}`,
      title: '🟢 Normal Operating Conditions',
      icon: 'CheckCircle2',
      category: 'distribution',
      confidence: 'High',
      evidence: `Water supply (${formatLiters(zone.currentSupply)}) closely matches metered consumption (${formatLiters(zone.currentConsumed)}). Loss is within the acceptable 5-8% benchmark.`,
      suggestedAction: 'Maintain standard routine monitoring. No immediate maintenance intervention required.',
      zoneId: zone.id,
      zoneName: zone.name
    });
  }

  return diagnostics;
}
