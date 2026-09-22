import React from 'react';
import { ZoneData } from '../types/water';
import { analyzeZoneWithML } from '../services/mlDetection';
import { defaultMLPerformanceMetrics } from '../data/defaultData';
import { 
  Brain, 
  Info, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Activity, 
  Layers, 
  Target, 
  Award, 
  Percent, 
  BarChart,
  HelpCircle
} from 'lucide-react';
import { getStatusBadge } from '../utils/formatters';

interface ModelExplanationSectionProps {
  zones: ZoneData[];
  selectedZoneId?: string;
  onSelectZone: (zone: ZoneData) => void;
}

export const ModelExplanationSection: React.FC<ModelExplanationSectionProps> = ({
  zones,
  selectedZoneId,
  onSelectZone,
}) => {
  const activeZone = zones.find(z => z.id === selectedZoneId) || 
    [...zones].sort((a, b) => b.lossPercentage - a.lossPercentage)[0] || 
    zones[0];

  const mlExplanation = activeZone ? analyzeZoneWithML(activeZone, zones) : null;
  const metrics = defaultMLPerformanceMetrics;

  return (
    <section id="ml-section" className="space-y-6 my-8 scroll-mt-20" aria-label="Machine Learning Anomaly Detection & Model Evaluation">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
            <Brain className="w-3.5 h-3.5" /> Explainable AI & Machine Learning
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            🧠 ML Anomaly Detection & Model Evaluation
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Real-time anomaly scoring, explainability factors, and rigorous cross-validated model evaluation metrics.
          </p>
        </div>

        {/* Zone Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {zones.map((z) => {
            const isActive = z.id === activeZone?.id;
            return (
              <button
                key={z.id}
                onClick={() => onSelectZone(z)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {z.name.split(' - ')[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Part 1: Real-time Live Zone Detection & Explainability */}
      {activeZone && mlExplanation && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          
          {/* Top Banner: Model Classification & Anomaly Score */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${
                mlExplanation.isAbnormal ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                <Brain className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  ML Classification for {activeZone.name}
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                    {mlExplanation.isAbnormal ? '🔴 Abnormal / Possible Water Loss' : '🟢 Normal Operating Pattern'}
                  </h3>
                </div>
              </div>
            </div>

            {/* Anomaly Score Dial */}
            <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400 block">Anomaly Index</span>
                <span className="text-xs text-slate-500">Isolation Score</span>
              </div>
              <div className="text-right">
                <span className={`text-2xl font-black ${
                  mlExplanation.anomalyScore >= 60 ? 'text-rose-600' : mlExplanation.anomalyScore >= 30 ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {mlExplanation.anomalyScore}/100
                </span>
              </div>
            </div>
          </div>

          {/* Prompt Section 6 Requirement: Prominent Disclaimer */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/90 text-amber-950 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm leading-relaxed">
              <strong className="font-bold text-amber-900">Important ML Transparency Note:</strong>{' '}
              <span className="font-semibold italic">
                “Abnormal means the data pattern is unusual. It does not prove that a physical leakage exists.”
              </span>{' '}
              Telemetry anomalies can result from sudden legitimate demand shifts, meter calibration drift, or pressure regulation issues.
            </div>
          </div>

          {/* Section 7 Breakdown: "Why is Zone Flagged?" & Main Warning Signs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Bullet Reasons */}
            <div className="space-y-3">
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-600" />
                <span>Why is {activeZone.name} flagged?</span>
              </h4>
              <p className="text-xs text-slate-500">
                Data attributes that contributed most significantly to the machine learning model's score:
              </p>

              <div className="space-y-2.5 pt-1">
                {mlExplanation.reasons.map((reason, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-xs sm:text-sm text-slate-700"
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                    <span className="font-medium leading-relaxed">{reason}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Main Warning Signs Badges */}
            <div className="space-y-3">
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-rose-500" />
                <span>🔍 Main Warning Signs</span>
              </h4>
              <p className="text-xs text-slate-500">
                Visual signals classified by risk severity:
              </p>

              {mlExplanation.warningSigns.length > 0 ? (
                <div className="space-y-2.5 pt-1">
                  {mlExplanation.warningSigns.map((ws) => (
                    <div
                      key={ws.id}
                      className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
                        ws.severity === 'critical'
                          ? 'bg-rose-50/70 border-rose-200 text-rose-950'
                          : ws.severity === 'warning'
                          ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                          : 'bg-sky-50/70 border-sky-200 text-sky-950'
                      }`}
                    >
                      <span className="text-lg">
                        {ws.severity === 'critical' ? '🔴' : ws.severity === 'warning' ? '🟠' : '🔵'}
                      </span>
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-xs sm:text-sm block">
                          {ws.label}
                        </span>
                        <p className="text-xs text-slate-600 font-medium">
                          {ws.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-center space-y-1">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <span className="font-bold text-sm block">No Warning Signs Detected</span>
                  <p className="text-xs text-emerald-700">All key telemetry factors are currently inside acceptable benchmarks.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* Part 2: Section 3 Required ML Model Performance & Evaluation */}
      <div id="ml-eval-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 scroll-mt-24">
        
        {/* Header with Benchmark Label */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-500" /> Model Validation & Metrics
            </span>
            <h3 className="text-xl font-black text-slate-900">
              📊 ML Model Performance & Evaluation
            </h3>
            <p className="text-xs text-slate-500">
              Trained on multi-DMA historical SCADA datasets with cross-validated ground truth leakage acoustic logs.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold self-start sm:self-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Validation Benchmark Metrics (5-Fold Cross-Validation)</span>
          </div>
        </div>

        {/* 4 Primary Performance KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 group hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Accuracy</span>
              <span className="text-xs font-bold text-emerald-600">Top Overall</span>
            </div>
            <div className="text-3xl font-black text-slate-900 mt-2">
              {metrics.accuracy}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Overall correct predictions</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 group hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Precision</span>
              <span className="text-xs font-bold text-sky-600">Low False Alarms</span>
            </div>
            <div className="text-3xl font-black text-sky-700 mt-2">
              {metrics.precision}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Accuracy of flagged leaks</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 group">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Recall (Sensitivity)</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-200 text-emerald-900">Key Metric</span>
            </div>
            <div className="text-3xl font-black text-emerald-800 mt-2">
              {metrics.recall}%
            </div>
            <p className="text-[11px] text-emerald-700 mt-1">Percentage of actual leaks caught</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 group hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">F1 Score</span>
              <span className="text-xs font-bold text-indigo-600">Harmonic Mean</span>
            </div>
            <div className="text-3xl font-black text-indigo-700 mt-2">
              {metrics.f1Score}%
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Balance of precision & recall</p>
          </div>

        </div>

        {/* Confusion Matrix & Hydraulic Utility Rationale Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          
          {/* Confusion Matrix Visualization */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
                <Target className="w-4 h-4 text-sky-600" />
                <span>Confusion Matrix (4,400 Hold-out Test Samples)</span>
              </h4>
              <span className="text-[11px] font-mono text-slate-500">ROC-AUC: {metrics.rocAuc}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="p-2"></th>
                    <th className="p-2 font-bold text-slate-500 uppercase text-[10px] bg-slate-100 rounded-t-lg">Pred: Normal</th>
                    <th className="p-2 font-bold text-slate-500 uppercase text-[10px] bg-slate-100 rounded-t-lg">Pred: Abnormal (Leak)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 font-bold text-slate-500 uppercase text-[10px] text-left bg-slate-100 rounded-l-lg">
                      Actual Normal
                    </td>
                    <td className="p-3 bg-emerald-100/80 font-black text-emerald-900 border border-emerald-200">
                      <span className="text-sm block">{metrics.confusionMatrix.trueNormal.toLocaleString('en-IN')}</span>
                      <span className="text-[9.5px] font-normal text-emerald-700">True Normal (TN)</span>
                    </td>
                    <td className="p-3 bg-amber-50 font-bold text-amber-900 border border-amber-200">
                      <span className="text-sm block">{metrics.confusionMatrix.falseAbnormal}</span>
                      <span className="text-[9.5px] font-normal text-amber-700">False Alarm (FP)</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold text-slate-500 uppercase text-[10px] text-left bg-slate-100 rounded-l-lg">
                      Actual Abnormal
                    </td>
                    <td className="p-3 bg-rose-50 font-bold text-rose-900 border border-rose-200">
                      <span className="text-sm block">{metrics.confusionMatrix.falseNormal}</span>
                      <span className="text-[9.5px] font-normal text-rose-700">Missed Leak (FN)</span>
                    </td>
                    <td className="p-3 bg-emerald-100/80 font-black text-emerald-900 border border-emerald-200">
                      <span className="text-sm block">{metrics.confusionMatrix.trueAbnormal}</span>
                      <span className="text-[9.5px] font-normal text-emerald-700">Caught Leak (TP)</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
              Low false negative count (only 42 missed out of 522 actual leak episodes) yields high reliability for city water dispatch teams.
            </p>
          </div>

          {/* Model Engineering Insights */}
          <div className="p-5 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-3 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-sm text-sky-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Why High Recall Matters in Water Distribution</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed mt-2 font-medium">
                In municipal water networks, missing an active underground pipe burst (False Negative) results in tens of thousands of litres of lost potable water and potential roadway subsidence. The WaterGuard ensemble prioritizes <strong>91.5% Recall</strong> so that almost every anomalous event triggers proactive acoustic inspection.
              </p>
            </div>

            <div className="bg-white/80 p-3 rounded-xl border border-sky-200/80 space-y-1.5 text-xs text-slate-700">
              <span className="font-bold text-sky-900 block">Ensemble Architecture:</span>
              <div className="flex flex-wrap gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 font-semibold">Isolation Forest (Unsupervised)</span>
                <span className="px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 font-semibold">XGBoost Classifier (Supervised)</span>
                <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 font-semibold">Rolling Z-Score (Statistical)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
