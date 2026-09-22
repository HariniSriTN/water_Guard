import { 
  ZoneData, 
  WaterScenario, 
  NetworkNode, 
  NetworkPipe, 
  MaintenanceTicket,
  PreprocessingMetrics,
  MLFeature,
  MLPerformanceMetrics,
  TraceabilityItem
} from '../types/water';

// Generate 14 days of realistic daily history leading up to today
const generateZoneHistory = (
  _zoneId: string,
  baseSupply: number,
  baseConsumed: number,
  anomalyDayStart: number | null,
  lossMultiplier: number = 1
) => {
  const history = [];
  const today = new Date();
  
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dayNumber = 14 - i;
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Normal variations
    const supplyVariation = (Math.sin(dayNumber * 0.8) * 0.05 + 1) * baseSupply;
    let consumedVariation = (Math.cos(dayNumber * 0.8) * 0.05 + 1) * baseConsumed;
    let pressure = 3.2 + (Math.sin(dayNumber) * 0.15);
    
    let isAnomaly = false;
    let anomalyScore = 12;

    // Apply anomaly jump after day anomalyDayStart if specified
    if (anomalyDayStart && dayNumber >= anomalyDayStart) {
      isAnomaly = true;
      consumedVariation = consumedVariation * (1 - (0.35 * lossMultiplier));
      pressure = pressure * 0.55; // Drop in pressure
      anomalyScore = 88;
    }

    const loss = Math.max(0, supplyVariation - consumedVariation);
    const lossPct = (loss / supplyVariation) * 100;
    const nightFlow = isAnomaly ? (loss * 0.45) : (loss * 0.12);

    history.push({
      date: dateStr,
      dayNumber,
      supplyLiters: Math.round(supplyVariation),
      consumedLiters: Math.round(consumedVariation),
      lossLiters: Math.round(loss),
      lossPercentage: parseFloat(lossPct.toFixed(1)),
      pressureBar: parseFloat(pressure.toFixed(2)),
      minNightFlowLitersPerHour: Math.round(nightFlow),
      anomalyScore,
      isAnomaly
    });
  }
  return history;
};

export const defaultZones: ZoneData[] = [
  {
    id: 'zone-a',
    name: 'Zone A - North Residential',
    type: 'Residential',
    populationServed: 14200,
    pipeLengthKm: 18.4,
    avgPipeAgeYears: 6,
    currentSupply: 20000,
    currentConsumed: 19000,
    currentLoss: 1000,
    lossPercentage: 5.0,
    currentPressure: 3.4,
    standardPressure: 3.5,
    minNightFlow: 120,
    status: 'normal',
    anomalyScore: 8,
    sensorHealth: 'Good',
    coordinates: { x: 220, y: 110 },
    history: generateZoneHistory('zone-a', 20000, 19000, null)
  },
  {
    id: 'zone-b',
    name: 'Zone B - Central Downtown',
    type: 'Commercial',
    populationServed: 28500,
    pipeLengthKm: 31.2,
    avgPipeAgeYears: 24,
    currentSupply: 20000,
    currentConsumed: 12000,
    currentLoss: 8000,
    lossPercentage: 40.0,
    currentPressure: 1.8, // Pressure dropped significantly
    standardPressure: 3.6,
    minNightFlow: 2450, // Massive night flow leak
    status: 'abnormal',
    anomalyScore: 94,
    sensorHealth: 'Good',
    coordinates: { x: 380, y: 190 },
    history: [
      { date: 'Day 1', dayNumber: 1, supplyLiters: 20000, consumedLiters: 18000, lossLiters: 2000, lossPercentage: 10.0, pressureBar: 3.6, minNightFlowLitersPerHour: 220, isAnomaly: false, anomalyScore: 14 },
      { date: 'Day 2', dayNumber: 2, supplyLiters: 20100, consumedLiters: 17600, lossLiters: 2500, lossPercentage: 12.4, pressureBar: 3.5, minNightFlowLitersPerHour: 240, isAnomaly: false, anomalyScore: 16 },
      { date: 'Day 3', dayNumber: 3, supplyLiters: 19900, consumedLiters: 17600, lossLiters: 2300, lossPercentage: 11.5, pressureBar: 3.5, minNightFlowLitersPerHour: 230, isAnomaly: false, anomalyScore: 15 },
      { date: 'Day 4', dayNumber: 4, supplyLiters: 20000, consumedLiters: 15000, lossLiters: 5000, lossPercentage: 25.0, pressureBar: 2.6, minNightFlowLitersPerHour: 1400, isAnomaly: true, anomalyScore: 68 },
      { date: 'Day 5', dayNumber: 5, supplyLiters: 20000, consumedLiters: 14600, lossLiters: 5400, lossPercentage: 27.0, pressureBar: 2.3, minNightFlowLitersPerHour: 1650, isAnomaly: true, anomalyScore: 78 },
      { date: 'Day 6', dayNumber: 6, supplyLiters: 20050, consumedLiters: 13200, lossLiters: 6850, lossPercentage: 34.1, pressureBar: 2.0, minNightFlowLitersPerHour: 2100, isAnomaly: true, anomalyScore: 89 },
      { date: 'Day 7 (Today)', dayNumber: 7, supplyLiters: 20000, consumedLiters: 12000, lossLiters: 8000, lossPercentage: 40.0, pressureBar: 1.8, minNightFlowLitersPerHour: 2450, isAnomaly: true, anomalyScore: 94 }
    ]
  },
  {
    id: 'zone-c',
    name: 'Zone C - East Suburbs',
    type: 'Residential',
    populationServed: 16800,
    pipeLengthKm: 22.0,
    avgPipeAgeYears: 9,
    currentSupply: 20000,
    currentConsumed: 18500,
    currentLoss: 1500,
    lossPercentage: 7.5,
    currentPressure: 3.3,
    standardPressure: 3.4,
    minNightFlow: 180,
    status: 'normal',
    anomalyScore: 11,
    sensorHealth: 'Good',
    coordinates: { x: 540, y: 130 },
    history: generateZoneHistory('zone-c', 20000, 18500, null)
  },
  {
    id: 'zone-d',
    name: 'Zone D - South Industrial Estate',
    type: 'Industrial',
    populationServed: 6500,
    pipeLengthKm: 14.5,
    avgPipeAgeYears: 18,
    currentSupply: 20000,
    currentConsumed: 14000,
    currentLoss: 6000,
    lossPercentage: 30.0,
    currentPressure: 4.1, // Pressure higher than expected
    standardPressure: 3.2,
    minNightFlow: 920,
    status: 'abnormal',
    anomalyScore: 76,
    sensorHealth: 'Fair',
    coordinates: { x: 440, y: 290 },
    history: generateZoneHistory('zone-d', 20000, 14000, 10, 0.8)
  },
  {
    id: 'zone-e',
    name: 'Zone E - Tech Park & University',
    type: 'Mixed-Use',
    populationServed: 19200,
    pipeLengthKm: 16.8,
    avgPipeAgeYears: 12,
    currentSupply: 20000,
    currentConsumed: 14500,
    currentLoss: 5500,
    lossPercentage: 27.5,
    currentPressure: 2.9,
    standardPressure: 3.3,
    minNightFlow: 650,
    status: 'warning',
    anomalyScore: 62,
    sensorHealth: 'Good',
    coordinates: { x: 190, y: 270 },
    history: generateZoneHistory('zone-e', 20000, 14500, 12, 0.7)
  }
];

export const defaultScenarios: WaterScenario[] = [
  {
    id: 'scenario-mainline-burst',
    title: '🚨 Scenario 1: Downtown Pipe Rupture (Zone B Crisis)',
    subtitle: 'Sudden pressure drop and 40% unaccounted water in Zone B starting Day 4.',
    description: 'City telemetry captures a major rupture on the primary distribution line in Zone B. Notice the steep divergence between supply and consumption after Day 3.',
    totalSupplied: 100000,
    totalConsumed: 78000,
    totalLoss: 22000,
    lossPercentage: 22.0,
    zones: defaultZones,
    keyInsight: 'Zone B accounts for 36.3% of total city water loss with critical pressure drops.'
  },
  {
    id: 'scenario-meter-malfunction',
    title: '📟 Scenario 2: Industrial Meter Calibration Drift (Zone D)',
    subtitle: 'Bulk consumer ultrasonic meter reporting erroneous zero-flow spikes.',
    description: 'Zone D exhibits erratic consumption recording with high line pressure, indicating telemetry meter drift rather than physical earth leakage.',
    totalSupplied: 100000,
    totalConsumed: 86000,
    totalLoss: 14000,
    lossPercentage: 14.0,
    zones: defaultZones.map(z => {
      if (z.id === 'zone-b') {
        return {
          ...z,
          currentSupply: 20000,
          currentConsumed: 18200,
          currentLoss: 1800,
          lossPercentage: 9.0,
          currentPressure: 3.5,
          status: 'normal',
          anomalyScore: 12
        };
      }
      if (z.id === 'zone-d') {
        return {
          ...z,
          currentSupply: 20000,
          currentConsumed: 11000,
          currentLoss: 9000,
          lossPercentage: 45.0,
          currentPressure: 4.6,
          sensorHealth: 'Suspect',
          status: 'abnormal',
          anomalyScore: 92
        };
      }
      return z;
    }),
    keyInsight: 'Zone D shows suspect meter telemetry with anomalous high line pressure (4.6 Bar).'
  },
  {
    id: 'scenario-healthy-city',
    title: '🟢 Scenario 3: Healthy & Optimized Distribution',
    subtitle: 'All DMA (District Metered Areas) operating within 6% benchmark efficiency.',
    description: 'Standard baseline post-rehabilitation. Pressure is balanced across all zones and minimum night flows are at optimal levels.',
    totalSupplied: 100000,
    totalConsumed: 94200,
    totalLoss: 5800,
    lossPercentage: 5.8,
    zones: defaultZones.map(z => ({
      ...z,
      currentSupply: 20000,
      currentConsumed: 18800 + Math.floor(Math.random() * 400),
      currentLoss: 1200 - Math.floor(Math.random() * 400),
      lossPercentage: 5.5,
      currentPressure: 3.4,
      status: 'normal',
      anomalyScore: 7,
      minNightFlow: 110
    })),
    keyInsight: 'All 5 zones meet the global Smart City NRW (Non-Revenue Water) standard of < 7%.'
  }
];

export const defaultNetworkNodes: NetworkNode[] = [
  { id: 'node-res', label: 'Main Reservoir & Treatment', type: 'reservoir', x: 80, y: 190, status: 'normal', flow: 100000, pressure: 5.2 },
  { id: 'node-pump', label: 'Central Booster Pump 01', type: 'booster_pump', x: 230, y: 190, status: 'normal', pressure: 4.8 },
  { id: 'node-a', label: 'Zone A (Residential)', type: 'zone', x: 340, y: 80, status: 'normal', pressure: 3.4, zoneId: 'zone-a' },
  { id: 'node-b', label: 'Zone B (Downtown)', type: 'zone', x: 420, y: 190, status: 'abnormal', pressure: 1.8, zoneId: 'zone-b' },
  { id: 'node-c', label: 'Zone C (Suburbs)', type: 'zone', x: 570, y: 110, status: 'normal', pressure: 3.3, zoneId: 'zone-c' },
  { id: 'node-d', label: 'Zone D (Industrial)', type: 'zone', x: 480, y: 310, status: 'abnormal', pressure: 4.1, zoneId: 'zone-d' },
  { id: 'node-e', label: 'Zone E (Tech Park)', type: 'zone', x: 300, y: 310, status: 'warning', pressure: 2.9, zoneId: 'zone-e' },
];

export const defaultNetworkPipes: NetworkPipe[] = [
  { id: 'pipe-1', from: 'node-res', to: 'node-pump', flowRate: 100000, pressure: 5.2, status: 'normal' },
  { id: 'pipe-2', from: 'node-pump', to: 'node-a', flowRate: 20000, pressure: 3.4, status: 'normal' },
  { id: 'pipe-3', from: 'node-pump', to: 'node-b', flowRate: 20000, pressure: 1.8, status: 'abnormal' }, // Flagged pipe
  { id: 'pipe-4', from: 'node-pump', to: 'node-e', flowRate: 20000, pressure: 2.9, status: 'warning' },
  { id: 'pipe-5', from: 'node-b', to: 'node-c', flowRate: 20000, pressure: 3.3, status: 'normal' },
  { id: 'pipe-6', from: 'node-b', to: 'node-d', flowRate: 20000, pressure: 4.1, status: 'abnormal' },
];

export const defaultTickets: MaintenanceTicket[] = [
  {
    id: 'TKT-1042',
    zoneId: 'zone-b',
    zoneName: 'Zone B - Central Downtown',
    issueType: 'Acoustic Sounding Crew',
    priority: 'Urgent',
    status: 'Dispatched',
    assignedTeam: 'Field Response Unit Alpha',
    createdAt: '2 hours ago',
    estimatedWaterSavedLiters: 6500,
    description: 'Major acoustic leakage detection dispatched to Main St & 4th Avenue junction following 40% loss telemetry.'
  },
  {
    id: 'TKT-1039',
    zoneId: 'zone-d',
    zoneName: 'Zone D - South Industrial Estate',
    issueType: 'Smart Meter Calibration',
    priority: 'High',
    status: 'Open',
    assignedTeam: 'Telemetry & Metering Div.',
    createdAt: '5 hours ago',
    estimatedWaterSavedLiters: 4000,
    description: 'Ultrasonic bulk meter recalibration and pressure regulator inspection scheduled for feeder line D-4.'
  }
];

// Data Preprocessing & Quality Default Metrics
export const defaultPreprocessingMetrics: PreprocessingMetrics = {
  rawRecords: 50000,
  missingValuesRemoved: 1245,
  duplicatesRemoved: 328,
  outliersHandled: 412,
  processedRecords: 48427,
  featuresSelected: 12,
  completenessPct: 97.8,
  consistencyPct: 95.4,
  validRecordsPct: 96.9,
  qualityRating: 'Good'
};

// 12 Selected ML Features
export const defaultMLFeatures: MLFeature[] = [
  {
    id: 'feat-1',
    name: 'Water Supply',
    key: 'supply_liters',
    category: 'Telemetry',
    importance: 96,
    unit: 'Litres',
    description: 'Total volume pumped into the District Metered Area (DMA) intake feeder.',
    sampleValue: '20,000 L'
  },
  {
    id: 'feat-2',
    name: 'Water Consumption',
    key: 'consumed_liters',
    category: 'Telemetry',
    importance: 94,
    unit: 'Litres',
    description: 'Aggregated sum of all smart endpoint customer meter readings.',
    sampleValue: '12,000 L'
  },
  {
    id: 'feat-3',
    name: 'Water Loss (NRW)',
    key: 'loss_liters',
    category: 'Telemetry',
    importance: 98,
    unit: 'Litres',
    description: 'Unaccounted-for water volume delta (Supply minus Billed Consumption).',
    sampleValue: '8,000 L'
  },
  {
    id: 'feat-4',
    name: 'Loss Percentage',
    key: 'loss_percentage',
    category: 'Telemetry',
    importance: 97,
    unit: '%',
    description: 'Relative ratio of unaccounted water volume against supplied inflow.',
    sampleValue: '40.0%'
  },
  {
    id: 'feat-5',
    name: 'Line Pressure',
    key: 'pressure_bar',
    category: 'Hydraulic',
    importance: 91,
    unit: 'Bar',
    description: 'Real-time hydrostatic pressure monitored at distribution trunk sensors.',
    sampleValue: '1.8 Bar'
  },
  {
    id: 'feat-6',
    name: 'Minimum Night Flow (MNF)',
    key: 'min_night_flow',
    category: 'Hydraulic',
    importance: 89,
    unit: 'L/h',
    description: 'Baseline continuous flow rate measured between 02:00 AM and 04:00 AM.',
    sampleValue: '2,450 L/h'
  },
  {
    id: 'feat-7',
    name: '7-Day Moving Avg Consumption',
    key: 'rolling_7d_consumed',
    category: 'Historical',
    importance: 84,
    unit: 'Litres',
    description: 'Rolling 7-day smoothed historical baseline for anomaly subtraction.',
    sampleValue: '17,800 L'
  },
  {
    id: 'feat-8',
    name: 'Consumption Deviation %',
    key: 'consumption_shift_pct',
    category: 'Historical',
    importance: 82,
    unit: '%',
    description: 'Percentage change in consumption vs historical day-of-week expectation.',
    sampleValue: '-32.5%'
  },
  {
    id: 'feat-9',
    name: 'Zone / DMA Classification',
    key: 'zone_type',
    category: 'Spatial/Temporal',
    importance: 76,
    unit: 'Category',
    description: 'District consumer demographic profile (Residential, Commercial, Industrial).',
    sampleValue: 'Commercial'
  },
  {
    id: 'feat-10',
    name: 'Time of Day / Temporal Period',
    key: 'time_window',
    category: 'Spatial/Temporal',
    importance: 72,
    unit: 'Hour',
    description: 'Peak morning, midday, evening, or low-demand night diurnal cycle index.',
    sampleValue: 'Morning Peak'
  },
  {
    id: 'feat-11',
    name: 'Feeder Inflow Rate',
    key: 'flow_rate_lpm',
    category: 'Hydraulic',
    importance: 79,
    unit: 'L/min',
    description: 'Velocity flow rate through the upstream DMA boundary control valve.',
    sampleValue: '330 L/min'
  },
  {
    id: 'feat-12',
    name: 'Historical Loss Trend',
    key: 'loss_trend_gradient',
    category: 'Historical',
    importance: 85,
    unit: 'Slope',
    description: 'Rate of acceleration in unaccounted water loss over successive cycles.',
    sampleValue: '+14.2%/day'
  }
];

// ML Model Performance Evaluation Metrics
export const defaultMLPerformanceMetrics: MLPerformanceMetrics = {
  modelName: 'Ensemble Isolation Forest & Random Forest Classifier',
  accuracy: 94.2,
  precision: 92.8,
  recall: 91.5,
  f1Score: 92.1,
  rocAuc: 0.96,
  crossValidationFolds: 5,
  confusionMatrix: {
    trueNormal: 3820,
    falseNormal: 42,   // Missed anomaly (false negative)
    falseAbnormal: 58, // False alarm (false positive)
    trueAbnormal: 480  // Caught anomaly (true positive)
  }
};

// Build Traceability Items from Active Zones
export function getTraceabilityItems(zones: ZoneData[]): TraceabilityItem[] {
  return zones.map((zone) => {
    let condition = '🟢 Normal Distribution Efficiency';
    let action = 'Maintain standard automated SCADA telemetry observation.';
    let actionCategory: TraceabilityItem['actionCategory'] = 'Distribution & PRV Adjustment';
    let confidence: 'High' | 'Medium' | 'Low' = 'High';
    let evidence = `Supplied ${zone.currentSupply.toLocaleString('en-IN')} L vs Consumed ${zone.currentConsumed.toLocaleString('en-IN')} L. Loss rate is ${zone.lossPercentage}%.`;
    let potentialRecovery = 0;

    if (zone.id === 'zone-b' || zone.lossPercentage >= 35) {
      condition = '🚨 Pipeline Rupture & Pressure Deficit';
      evidence = `Loss is ${zone.currentLoss.toLocaleString('en-IN')} L (40%), Night Flow is ${zone.minNightFlow} L/h, Pressure fell to ${zone.currentPressure} Bar (Target: ${zone.standardPressure} Bar).`;
      confidence = 'High';
      action = 'Dispatch Acoustic Sounding Crew to isolate junction leak and repair burst mainline.';
      actionCategory = 'Maintenance Work Order';
      potentialRecovery = 6500;
    } else if (zone.id === 'zone-d' || (zone.currentPressure > 4.0 && zone.lossPercentage >= 25)) {
      condition = '📟 Ultrasonic Meter Telemetry Drift & Overpressure';
      evidence = `Loss is ${zone.currentLoss.toLocaleString('en-IN')} L (30%), Line pressure elevated to ${zone.currentPressure} Bar, Sensor health is "${zone.sensorHealth}".`;
      confidence = 'High';
      action = 'Recalibrate DMA bulk ultrasonic meter and regulate PRV-4 back to 3.2 Bar.';
      actionCategory = 'Maintenance Work Order';
      potentialRecovery = 4000;
    } else if (zone.id === 'zone-e' || zone.lossPercentage >= 20) {
      condition = '⚠️ Micro-Weeping & Aging Feeder Stress';
      evidence = `Loss is ${zone.currentLoss.toLocaleString('en-IN')} L (27.5%), Pipe age is ${zone.avgPipeAgeYears} yrs with elevated background loss.`;
      confidence = 'Medium';
      action = 'Schedule non-destructive pipe wall inspection and optimize evening booster pressure.';
      actionCategory = 'Distribution & PRV Adjustment';
      potentialRecovery = 3200;
    }

    return {
      id: `trace-${zone.id}`,
      zoneId: zone.id,
      zoneName: zone.name,
      waterLossLiters: zone.currentLoss,
      lossPercentage: zone.lossPercentage,
      detectedCondition: condition,
      evidence,
      mlConfidence: confidence,
      anomalyScore: zone.anomalyScore,
      recommendedAction: action,
      actionCategory,
      potentialRecoveryLiters: potentialRecovery
    };
  });
}
