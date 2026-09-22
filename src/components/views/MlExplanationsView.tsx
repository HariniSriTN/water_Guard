import React from 'react';
import { ZoneData, AppPage, DiagnosticReason } from '../../types/water';
import { DiagnosticsSection } from '../DiagnosticsSection';
import { ModelExplanationSection } from '../ModelExplanationSection';
import { analyzeZoneWithML } from '../../services/mlDetection';
import { formatLiters, formatPercentage, formatPressure } from '../../utils/formatters';
import { 
  ArrowLeft, 
  BrainCircuit, 
  Wrench, 
  ArrowRight, 
  ShieldCheck, 
  Activity, 
  AlertTriangle,
  HelpCircle,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface MlExplanationsViewProps {
  zones: ZoneData[];
  onNavigate: (page: AppPage) => void;
  selectedZoneId?: string;
  onSelectZone: (zone: ZoneData) => void;
  onOpenTicketForReason: (zone: ZoneData, reason: DiagnosticReason) => void;
}

export const MlExplanationsView: React.FC<MlExplanationsViewProps> = ({
  zones,
  onNavigate,
  selectedZoneId,
  onSelectZone,
  onOpenTicketForReason,
}) => {
  const activeZone = zones.find(z => z.id === selectedZoneId) || 
    zones.find(z => z.status === 'abnormal') || 
    zones[0];

  const mlExplanation = activeZone ? analyzeZoneWithML(activeZone, zones) : null;
  const isAbnormal = activeZone?.status === 'abnormal';

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header */}
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
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1">
              <BrainCircuit className="w-3.5 h-3.5" /> Explainable AI Diagnostics
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              🤔 Why Is This Happening? (ML Explanations)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('ml-performance')}
            className="px-3.5 py-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Model Performance Metrics
          </button>
          <button
            onClick={() => onNavigate('action-plan')}
            className="px-3.5 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Open Action Plan</span>
          </button>
        </div>
      </div>

      {/* Screen 3 Showcase Card for Active Zone */}
      {activeZone && mlExplanation && (
        <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest block">
                ANOMALY DIAGNOSTIC SUMMARY
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                {activeZone.name.toUpperCase()}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Supplied: <strong>{formatLiters(activeZone.currentSupply)}</strong> • Lost: <strong className="text-rose-400">{formatLiters(activeZone.currentLoss)} ({formatPercentage(activeZone.lossPercentage)})</strong> • Pressure: <strong className="text-sky-300">{formatPressure(activeZone.currentPressure)}</strong>
              </p>
            </div>

            <div className="flex items-center gap-4 bg-slate-800/90 p-3 rounded-2xl border border-slate-700">
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Anomaly Score</span>
                <span className={`text-2xl font-black ${isAbnormal ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {mlExplanation.anomalyScore}/100
                </span>
              </div>
              <div className={`px-3 py-1.5 rounded-xl text-xs font-black ${
                isAbnormal ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {activeZone.status.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Detected Signals Row */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
              ✓ Detected Telemetry Signals
            </span>
            <div className="flex flex-wrap gap-2">
              {mlExplanation.warningSigns.map((ws) => (
                <span
                  key={ws.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 border border-slate-700 text-slate-200"
                >
                  <span>{ws.severity === 'critical' ? '🔴' : '🟠'}</span>
                  <span>{ws.label}</span>
                </span>
              ))}
              {mlExplanation.warningSigns.length === 0 && (
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> All signals within normal baseline
                </span>
              )}
            </div>
          </div>

          {/* Recommended Cause & Action Ribbon */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 block">
                Recommended Primary Cause
              </span>
              <p className="text-sm font-extrabold text-white">
                {isAbnormal ? '💧 Possible Pipeline Leakage / Major Fracture' : '🟢 Standard Distribution Dynamics'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                  Recommended Action
                </span>
                <p className="text-sm font-extrabold text-white">
                  {isAbnormal ? 'Dispatch Acoustic Sounding Crew' : 'Continue Routine Sensor Polling'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Model Explanation Section */}
      <ModelExplanationSection
        zones={zones}
        selectedZoneId={activeZone?.id}
        onSelectZone={onSelectZone}
      />

      {/* Root-Cause Diagnostics Section */}
      <DiagnosticsSection
        zones={zones}
        selectedZoneId={activeZone?.id}
        onSelectZone={onSelectZone}
        onOpenTicketForReason={onOpenTicketForReason}
      />

    </div>
  );
};
