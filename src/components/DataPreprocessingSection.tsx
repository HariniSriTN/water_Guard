import React from 'react';
import { PreprocessingMetrics } from '../types/water';
import { defaultPreprocessingMetrics } from '../data/defaultData';
import { 
  Database, 
  Filter, 
  Trash2, 
  CopyCheck, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Info,
  ArrowRight,
  Sliders
} from 'lucide-react';

interface DataPreprocessingSectionProps {
  metrics?: PreprocessingMetrics;
}

export const DataPreprocessingSection: React.FC<DataPreprocessingSectionProps> = ({
  metrics = defaultPreprocessingMetrics,
}) => {
  const pipelineSteps = [
    {
      num: '1',
      title: 'Raw Data Ingestion',
      detail: 'DMA Flow Meters & SCADA Telemetry',
      badge: '50,000 Records',
      color: 'border-sky-200 bg-sky-50/70 text-sky-800'
    },
    {
      num: '2',
      title: 'Missing Value Imputation',
      detail: 'Forward Fill + KNN on Pressure Gap',
      badge: '1,245 Imputed',
      color: 'border-blue-200 bg-blue-50/70 text-blue-800'
    },
    {
      num: '3',
      title: 'Deduplication',
      detail: 'Timestamp & Device ID Resolution',
      badge: '328 Cleaned',
      color: 'border-indigo-200 bg-indigo-50/70 text-indigo-800'
    },
    {
      num: '4',
      title: 'Outlier Detection',
      detail: 'IQR & Multi-sensor Z-Score Filtering',
      badge: '412 Flagged',
      color: 'border-amber-200 bg-amber-50/70 text-amber-800'
    },
    {
      num: '5',
      title: 'Data Transformation',
      detail: 'MinMax Scaling & Moving Averages',
      badge: 'Normalized',
      color: 'border-violet-200 bg-violet-50/70 text-violet-800'
    },
    {
      num: '6',
      title: 'Feature Selection',
      detail: 'Random Forest Feature Importance',
      badge: '12 Selected',
      color: 'border-teal-200 bg-teal-50/70 text-teal-800'
    },
    {
      num: '7',
      title: 'ML-Ready Dataset',
      detail: 'High-Fidelity Training & Inference Store',
      badge: '48,427 Clean Rows',
      color: 'border-emerald-200 bg-emerald-50/70 text-emerald-800'
    }
  ];

  return (
    <section id="preprocessing-section" className="space-y-4 my-8 scroll-mt-20" aria-label="Data Preprocessing and Data Quality">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Data Engineering & Hygiene
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            🧹 Data Preprocessing & Data Quality
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Automated cleaning, deduplication, outlier treatment, and feature transformations preparing raw smart-meter telemetry for machine learning.
          </p>
        </div>

        {/* Validation Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-semibold self-start sm:self-center">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Processed Demo / Validation Metrics</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Top 6 KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Raw Records
            </span>
            <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {metrics.rawRecords.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-slate-400">Total ingested events</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
              Missing Values
            </span>
            <div className="text-xl sm:text-2xl font-black text-blue-900 mt-1">
              {metrics.missingValuesRemoved.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-blue-600">Imputed / Resolved</span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 block">
              Duplicates Cleaned
            </span>
            <div className="text-xl sm:text-2xl font-black text-indigo-900 mt-1">
              {metrics.duplicatesRemoved.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-indigo-600">De-duplicated rows</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
              Outliers Handled
            </span>
            <div className="text-xl sm:text-2xl font-black text-amber-900 mt-1">
              {metrics.outliersHandled.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-amber-600">Z-Score &gt; 3.0 capped</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 block">
              Clean Processed
            </span>
            <div className="text-xl sm:text-2xl font-black text-emerald-800 mt-1">
              {metrics.processedRecords.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-600">96.9% yield rate</span>
          </div>

          <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
            <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 block">
              Selected Features
            </span>
            <div className="text-xl sm:text-2xl font-black text-purple-900 mt-1">
              {metrics.featuresSelected}
            </div>
            <span className="text-[10px] text-purple-600">Engineered inputs</span>
          </div>

        </div>

        {/* Preprocessing Step-by-Step Pipeline Flow */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-600" />
              <span>Data Transformation & Cleaning Pipeline</span>
            </h4>
            <span className="text-[11px] font-semibold text-slate-400">7 Automated Stages</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2.5">
            {pipelineSteps.map((step) => (
              <div
                key={step.num}
                className={`p-3.5 rounded-2xl border ${step.color} flex flex-col justify-between space-y-2`}
              >
                <div className="flex items-center justify-between">
                  <span className="w-5 h-5 rounded-full bg-white font-mono text-[10px] font-black flex items-center justify-center shadow-2xs">
                    {step.num}
                  </span>
                  <span className="text-[9.5px] font-bold px-1.5 py-0.5 rounded-md bg-white/80">
                    {step.badge}
                  </span>
                </div>

                <div>
                  <span className="font-extrabold text-xs block leading-tight">
                    {step.title}
                  </span>
                  <span className="text-[10px] opacity-85 block mt-0.5 leading-snug">
                    {step.detail}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6 Requirement: Data Quality Summary Indicators */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col lg:flex-row lg:items-center justify-between gap-6 shadow-sm">
          
          <div className="space-y-1 max-w-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Data Quality Index (DQI)
            </span>
            <h3 className="text-lg font-black text-white">Overall Quality: 🟢 Good</h3>
            <p className="text-xs text-slate-300">
              Sensor telemetry passes structural integrity, freshness, and temporal coherence benchmarks across all DMA sectors.
            </p>
          </div>

          {/* 4 Quality Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
            
            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Completeness</span>
              <span className="text-lg font-black text-emerald-400 block mt-0.5">
                {metrics.completenessPct}%
              </span>
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${metrics.completenessPct}%` }} />
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Consistency</span>
              <span className="text-lg font-black text-sky-400 block mt-0.5">
                {metrics.consistencyPct}%
              </span>
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-sky-400 h-full rounded-full" style={{ width: `${metrics.consistencyPct}%` }} />
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Valid Records</span>
              <span className="text-lg font-black text-teal-400 block mt-0.5">
                {metrics.validRecordsPct}%
              </span>
              <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div className="bg-teal-400 h-full rounded-full" style={{ width: `${metrics.validRecordsPct}%` }} />
              </div>
            </div>

            <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
              <span className="text-[11px] font-bold text-slate-400 uppercase block">Schema State</span>
              <span className="text-lg font-black text-purple-400 block mt-0.5">
                Standard
              </span>
              <span className="text-[10px] text-slate-400 block mt-1">12 Feat / Hourly</span>
            </div>

          </div>

        </div>

      </div>

    </section>
  );
};
