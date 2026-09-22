export type ZoneStatus = 'normal' | 'warning' | 'abnormal';

export type AppPage = 
  | 'overview' 
  | 'find-loss' 
  | 'ml-explanations' 
  | 'compare-zones' 
  | 'loss-timeline' 
  | 'forecast' 
  | 'network' 
  | 'action-plan' 
  | 'preprocessing' 
  | 'ml-performance';

export interface DailyTelemetry {
  date: string;
  dayNumber: number;
  supplyLiters: number;
  consumedLiters: number;
  lossLiters: number;
  lossPercentage: number;
  pressureBar: number;
  minNightFlowLitersPerHour?: number;
  anomalyScore?: number;
  isAnomaly?: boolean;
}

export interface ZoneData {
  id: string;
  name: string;
  type: 'Residential' | 'Commercial' | 'Industrial' | 'Mixed-Use' | 'Rural/Suburban';
  populationServed: number;
  pipeLengthKm: number;
  avgPipeAgeYears: number;
  currentSupply: number;
  currentConsumed: number;
  currentLoss: number;
  lossPercentage: number;
  currentPressure: number; // in Bar
  standardPressure: number; // expected in Bar
  minNightFlow: number; // in L/h
  status: ZoneStatus;
  anomalyScore: number; // 0 to 100
  history: DailyTelemetry[];
  sensorHealth: 'Good' | 'Fair' | 'Suspect';
  coordinates: { x: number; y: number }; // For visual network map
}

export interface WarningSign {
  id: string;
  label: string;
  severity: 'critical' | 'warning' | 'info';
  description: string;
}

export interface DiagnosticReason {
  id: string;
  title: string;
  icon: string;
  category: 'leakage' | 'meter' | 'consumption' | 'pressure' | 'distribution';
  confidence: 'High' | 'Medium' | 'Low';
  evidence: string;
  suggestedAction: string;
  zoneId: string;
  zoneName: string;
  potentialRecoveryLiters?: number;
}

export interface ModelExplanation {
  zoneId: string;
  zoneName: string;
  isAbnormal: boolean;
  anomalyScore: number;
  plainSummary: string;
  reasons: string[];
  warningSigns: WarningSign[];
}

export interface ForecastDay {
  date: string;
  dayName: string;
  predictedDemand: number;
  recommendedSupply: number;
  expectedLoss: number;
  lowerBound: number;
  upperBound: number;
  isPeakDay: boolean;
  weatherFactor: string;
}

export interface MaintenanceTicket {
  id: string;
  zoneId: string;
  zoneName: string;
  issueType: 'Pipeline Leakage Inspection' | 'Pressure Regulator Check' | 'Smart Meter Calibration' | 'Acoustic Sounding Crew' | 'Valve Maintenance';
  priority: 'Urgent' | 'High' | 'Medium' | 'Low';
  status: 'Open' | 'Dispatched' | 'In Progress' | 'Resolved';
  assignedTeam: string;
  createdAt: string;
  estimatedWaterSavedLiters: number;
  description: string;
}

export interface WaterScenario {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  totalSupplied: number;
  totalConsumed: number;
  totalLoss: number;
  lossPercentage: number;
  zones: ZoneData[];
  keyInsight: string;
}

export interface NetworkNode {
  id: string;
  label: string;
  type: 'reservoir' | 'treatment_plant' | 'booster_pump' | 'zone' | 'pressure_valve';
  x: number;
  y: number;
  status: 'normal' | 'warning' | 'abnormal';
  pressure?: number;
  flow?: number;
  zoneId?: string;
}

export interface NetworkPipe {
  id: string;
  from: string;
  to: string;
  flowRate: number; // L/min
  pressure: number; // Bar
  status: 'normal' | 'warning' | 'abnormal';
}

// Data Preprocessing & Data Quality Types
export interface PreprocessingMetrics {
  rawRecords: number;
  missingValuesRemoved: number;
  duplicatesRemoved: number;
  outliersHandled: number;
  processedRecords: number;
  featuresSelected: number;
  completenessPct: number;
  consistencyPct: number;
  validRecordsPct: number;
  qualityRating: 'Good' | 'Fair' | 'Poor';
}

// Feature Selection Types
export interface MLFeature {
  id: string;
  name: string;
  key: string;
  category: 'Telemetry' | 'Hydraulic' | 'Historical' | 'Spatial/Temporal';
  importance: number; // 0 to 100
  unit: string;
  description: string;
  sampleValue: string;
}

// ML Model Evaluation Types
export interface MLPerformanceMetrics {
  modelName: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  crossValidationFolds: number;
  confusionMatrix: {
    trueNormal: number;
    falseNormal: number; // False negative (missed leak)
    falseAbnormal: number; // False positive (false alarm)
    trueAbnormal: number; // True positive (caught leak)
  };
}

// End-to-End Traceability Item
export interface TraceabilityItem {
  id: string;
  zoneId: string;
  zoneName: string;
  waterLossLiters: number;
  lossPercentage: number;
  detectedCondition: string;
  evidence: string;
  mlConfidence: 'High' | 'Medium' | 'Low';
  anomalyScore: number;
  recommendedAction: string;
  actionCategory: 'Maintenance Work Order' | 'Distribution & PRV Adjustment';
  potentialRecoveryLiters: number;
}
