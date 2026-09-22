import React from 'react';
import { AppPage } from '../../types/water';
import { defaultMLPerformanceMetrics } from '../../data/defaultData';
import { 
  ArrowLeft, 
  Award, 
  Target, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  BrainCircuit, 
  Percent,
  Layers
} from 'lucide-react';

interface MlPerformanceViewProps {
  onNavigate: (page: AppPage) => void;
}

export const MlPerformanceView: React.FC<MlPerformanceViewProps> = ({ onNavigate }) => {
  const metrics = defaultMLPerformanceMetrics;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('overview')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> Model Verification & Validation
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              🏆 ML Model Performance & Evaluation
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('ml-explanations')}
            className="px-3.5 py-1.5 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>View Live Explanations</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Banner with Model Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div className="space-y-0.5">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Evaluated Model Architecture
            </span>
            <h3 className="text-xl font-black text-slate-900">
              {metrics.modelName}
            </h3>
            <p className="text-xs text-slate-500">
              Cross-validated against physical acoustic noise logger recordings and verified DMA repair logs.
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold self-start sm:self-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Validation Benchmark Metrics (5-Fold Cross-Validation)</span>
          </div>
        </div>

        {/* 4 Large Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Accuracy</span>
              <span className="text-xs font-bold text-emerald-600">Overall</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 mt-2">
              {metrics.accuracy}%
            </div>
            <p className="text-xs text-slate-500 mt-1">Classification accuracy across all cycles</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Precision</span>
              <span className="text-xs font-bold text-sky-600">Reliable Alarms</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-sky-700 mt-2">
              {metrics.precision}%
            </div>
            <p className="text-xs text-slate-500 mt-1">Ratio of true leaks among flagged alarms</p>
          </div>

          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 hover:border-emerald-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Recall (Sensitivity)</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-200 text-emerald-900">Critical</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-800 mt-2">
              {metrics.recall}%
            </div>
            <p className="text-xs text-emerald-700 mt-1">Percentage of physical leaks successfully caught</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">F1 Score</span>
              <span className="text-xs font-bold text-indigo-600">Harmonic Mean</span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-indigo-700 mt-2">
              {metrics.f1Score}%
            </div>
            <p className="text-xs text-slate-500 mt-1">Balanced metric for imbalanced leak data</p>
          </div>

        </div>

        {/* Confusion Matrix & Utility Deep-Dive */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          
          {/* Confusion Matrix Table */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-base text-slate-800 flex items-center gap-2">
                <Target className="w-4 h-4 text-sky-600" />
                <span>Confusion Matrix (4,400 Test Samples)</span>
              </h4>
              <span className="text-xs font-mono font-bold text-slate-600">ROC-AUC: {metrics.rocAuc}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr>
                    <th className="p-2"></th>
                    <th className="p-2.5 font-bold text-slate-600 uppercase text-[10px] bg-slate-200/70 rounded-t-xl">Pred: Normal</th>
                    <th className="p-2.5 font-bold text-slate-600 uppercase text-[10px] bg-slate-200/70 rounded-t-xl">Pred: Abnormal (Leak)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-bold text-slate-600 uppercase text-[10px] text-left bg-slate-100 rounded-l-xl">
                      Actual Normal
                    </td>
                    <td className="p-4 bg-emerald-100/80 font-black text-emerald-950 border border-emerald-200">
                      <span className="text-base block">{metrics.confusionMatrix.trueNormal.toLocaleString('en-IN')}</span>
                      <span className="text-[10px] font-semibold text-emerald-700">True Normal (TN)</span>
                    </td>
                    <td className="p-4 bg-amber-50 font-bold text-amber-950 border border-amber-200">
                      <span className="text-base block">{metrics.confusionMatrix.falseAbnormal}</span>
                      <span className="text-[10px] font-semibold text-amber-700">False Alarm (FP)</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-3 font-bold text-slate-600 uppercase text-[10px] text-left bg-slate-100 rounded-l-xl">
                      Actual Abnormal
                    </td>
                    <td className="p-4 bg-rose-50 font-bold text-rose-950 border border-rose-200">
                      <span className="text-base block">{metrics.confusionMatrix.falseNormal}</span>
                      <span className="text-[10px] font-semibold text-rose-700">Missed Leak (FN)</span>
                    </td>
                    <td className="p-4 bg-emerald-100/80 font-black text-emerald-950 border border-emerald-200">
                      <span className="text-base block">{metrics.confusionMatrix.trueAbnormal}</span>
                      <span className="text-[10px] font-semibold text-emerald-700">Caught Leak (TP)</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              <strong>Evaluation Summary:</strong> The model identified 480 out of 522 actual anomaly events while maintaining a minimal false alarm rate (58 events out of 3,878 normal operations).
            </p>
          </div>

          {/* Model Engineering & Utility Significance */}
          <div className="p-6 rounded-2xl bg-sky-50/50 border border-sky-100 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="font-bold text-base text-sky-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600" />
                <span>Hydraulic Utility Optimization Rationale</span>
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                In municipal water networks, the cost of an undetected underground leak (False Negative) vastly exceeds the inspection cost of a false alarm. WaterGuard is specifically tuned for <strong>91.5% Recall</strong> to ensure that anomalous night flows and pressure drops trigger immediate field response.
              </p>
            </div>

            <div className="bg-white/90 p-4 rounded-2xl border border-sky-200/80 space-y-2 text-xs text-slate-700">
              <span className="font-bold text-sky-950 block">Validation Parameters:</span>
              <ul className="space-y-1 text-[11px] list-disc list-inside text-slate-600">
                <li>5-Fold Stratified Cross-Validation on 48k telemetry records</li>
                <li>Hyperparameter tuned with Bayesian Optimization</li>
                <li>Feature importance weighted towards hydrostatic pressure and MNF</li>
              </ul>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
