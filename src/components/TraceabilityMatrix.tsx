import React from 'react';
import { ZoneData, TraceabilityItem } from '../types/water';
import { getTraceabilityItems } from '../data/defaultData';
import { formatLiters, formatPercentage } from '../utils/formatters';
import { 
  GitCommit, 
  ArrowRight, 
  ShieldCheck, 
  Wrench, 
  Droplet, 
  Activity, 
  Cpu, 
  Sliders, 
  CheckCircle2,
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface TraceabilityMatrixProps {
  zones: ZoneData[];
  onSelectZone: (zone: ZoneData) => void;
  onDispatchAction: (zone: ZoneData, actionDescription: string, category: string) => void;
}

export const TraceabilityMatrix: React.FC<TraceabilityMatrixProps> = ({
  zones,
  onSelectZone,
  onDispatchAction,
}) => {
  const items: TraceabilityItem[] = getTraceabilityItems(zones);

  return (
    <section id="traceability-section" className="space-y-4 my-8 scroll-mt-20" aria-label="Traceable Analytics to Recommendations">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
            <GitCommit className="w-3.5 h-3.5" /> End-to-End Traceability
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            🔗 Traceability: Analytics → ML → Action
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Directly connect detected telemetry imbalances, machine learning confidence scores, and recommended interventions.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl w-fit flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Transparent Decision Chain</span>
        </div>
      </div>

      {/* Traceability Flow Cards */}
      <div className="space-y-3.5">
        {items.map((item) => {
          const rawZone = zones.find(z => z.id === item.zoneId);
          const isAbnormal = item.lossPercentage >= 30;
          const isWarning = item.lossPercentage >= 15 && item.lossPercentage < 30;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-3xl border transition-all shadow-xs hover:shadow-md ${
                isAbnormal
                  ? 'bg-rose-50/40 border-rose-200'
                  : isWarning
                  ? 'bg-amber-50/40 border-amber-200'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                
                {/* 1. Zone & Water Loss Stats (Cols 1-3) */}
                <div className="lg:col-span-3 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900 hover:text-sky-600 cursor-pointer" onClick={() => rawZone && onSelectZone(rawZone)}>
                      {item.zoneName}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-500">Water Loss:</span>
                    <span className={`font-extrabold ${isAbnormal ? 'text-rose-600' : isWarning ? 'text-amber-600' : 'text-slate-700'}`}>
                      {formatLiters(item.waterLossLiters)} ({formatPercentage(item.lossPercentage)})
                    </span>
                  </div>
                </div>

                {/* 2. Detected Condition & Evidence (Cols 4-6) */}
                <div className="lg:col-span-4 bg-white/80 p-3 rounded-2xl border border-slate-200/70 space-y-1 text-xs">
                  <span className="font-bold text-slate-800 block truncate">
                    {item.detectedCondition}
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-2">
                    {item.evidence}
                  </p>
                </div>

                {/* 3. ML Confidence & Score (Cols 7-8) */}
                <div className="lg:col-span-2 text-center lg:text-left space-y-0.5">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">ML Confidence</span>
                  <div className="flex items-center gap-1.5 justify-center lg:justify-start">
                    <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full border ${
                      item.mlConfidence === 'High'
                        ? 'bg-rose-100 text-rose-800 border-rose-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}>
                      {item.mlConfidence}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-600">
                      Score: {item.anomalyScore}/100
                    </span>
                  </div>
                </div>

                {/* 4. Recommended Action & Water Recovery (Cols 9-12) */}
                <div className="lg:col-span-3 flex flex-col justify-between space-y-2">
                  <div className="space-y-0.5 text-xs">
                    <span className="font-bold text-slate-900 block leading-tight">
                      {item.recommendedAction}
                    </span>
                    {item.potentialRecoveryLiters > 0 && (
                      <span className="text-[11px] font-bold text-emerald-700 block">
                        Target Recovery: {formatLiters(item.potentialRecoveryLiters)}
                      </span>
                    )}
                  </div>

                  {rawZone && isAbnormal && (
                    <button
                      onClick={() => onDispatchAction(rawZone, item.recommendedAction, item.actionCategory)}
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-xs transition-all w-fit"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Dispatch Order</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};
