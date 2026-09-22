import React, { useState } from 'react';
import { ZoneData, DiagnosticReason } from '../types/water';
import { diagnoseZone } from '../services/diagnostics';
import { 
  HelpCircle, 
  Droplets, 
  Gauge, 
  Cpu, 
  TrendingDown, 
  Network, 
  CheckCircle2, 
  ArrowRight, 
  Wrench, 
  Sparkles,
  ShieldCheck,
  Building
} from 'lucide-react';

interface DiagnosticsSectionProps {
  zones: ZoneData[];
  selectedZoneId?: string;
  onSelectZone: (zone: ZoneData) => void;
  onOpenTicketForReason: (zone: ZoneData, reason: DiagnosticReason) => void;
}

export const DiagnosticsSection: React.FC<DiagnosticsSectionProps> = ({
  zones,
  selectedZoneId,
  onSelectZone,
  onOpenTicketForReason,
}) => {
  // Focus on currently selected zone, or default to highest loss zone
  const activeZone = zones.find(z => z.id === selectedZoneId) || 
    [...zones].sort((a, b) => b.lossPercentage - a.lossPercentage)[0] || 
    zones[0];

  const diagnostics = activeZone ? diagnoseZone(activeZone) : [];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'leakage':
        return <Droplets className="w-5 h-5 text-rose-500" />;
      case 'pressure':
        return <Gauge className="w-5 h-5 text-amber-500" />;
      case 'meter':
        return <Cpu className="w-5 h-5 text-indigo-500" />;
      case 'consumption':
        return <TrendingDown className="w-5 h-5 text-purple-500" />;
      case 'distribution':
      default:
        return <Network className="w-5 h-5 text-sky-500" />;
    }
  };

  return (
    <section id="diagnostics-section" className="space-y-4 my-8 scroll-mt-20" aria-label="Root Cause Diagnostics">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> Root-Cause Analysis
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            🤔 Why might this be happening?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Automatic diagnostic breakdown linking real telemetry metrics directly to actionable root causes.
          </p>
        </div>

        {/* Zone Selector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {zones.map((z) => {
            const isActive = z.id === activeZone?.id;
            const isAbnormal = z.status === 'abnormal';
            return (
              <button
                key={z.id}
                onClick={() => onSelectZone(z)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                    : isAbnormal
                    ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span>{isAbnormal ? '🔴' : '🟢'}</span>
                <span>{z.name.split(' - ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Zone Overview Banner */}
      {activeZone && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Analyzing Zone</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">{activeZone.id}</span>
            </div>
            <h3 className="text-xl font-black text-white mt-1">{activeZone.name}</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Loss: <strong className="text-rose-400">{activeZone.currentLoss.toLocaleString('en-IN')} L ({activeZone.lossPercentage}%)</strong> • 
              Pressure: <strong className="text-sky-300">{activeZone.currentPressure} Bar</strong> (Target: {activeZone.standardPressure} Bar) • 
              Pipe Age: <strong className="text-amber-300">{activeZone.avgPipeAgeYears} yrs</strong>
            </p>
          </div>

          <div className="text-xs text-slate-300 bg-slate-800/80 p-3 rounded-xl border border-slate-700 sm:max-w-xs">
            <span className="text-emerald-400 font-bold block flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Grounded in Sensor Telemetry
            </span>
            <span>Reasons are only generated when verified by actual sensor readings.</span>
          </div>
        </div>
      )}

      {/* Reasons Cards Grid: Reason -> Evidence from Data -> Suggested Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {diagnostics.map((diag) => (
          <div
            key={diag.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            {/* Top: Reason Title & Confidence */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                    {getCategoryIcon(diag.category)}
                  </div>
                  <h4 className="font-extrabold text-base text-slate-900">
                    {diag.title}
                  </h4>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  diag.confidence === 'High'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}>
                  {diag.confidence} Confidence
                </span>
              </div>
            </div>

            {/* Middle: Evidence from Data */}
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <span>📊 Evidence from Data</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                {diag.evidence}
              </p>
            </div>

            {/* Bottom: Suggested Action */}
            <div className="bg-sky-50/60 rounded-xl p-3.5 border border-sky-100 space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1">
                <span>🔧 Suggested Action</span>
              </span>
              <p className="text-xs sm:text-sm text-sky-950 font-semibold leading-relaxed">
                {diag.suggestedAction}
              </p>
            </div>

            {/* Dispatch Action Button */}
            {activeZone && activeZone.status !== 'normal' && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onOpenTicketForReason(activeZone, diag)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-sky-700 hover:text-sky-800 bg-sky-50 hover:bg-sky-100 rounded-xl border border-sky-200 transition-colors"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Dispatch Maintenance Crew for this</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

    </section>
  );
};
