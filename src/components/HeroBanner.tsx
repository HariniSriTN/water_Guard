import React from 'react';
import { Droplet, Search, BrainCircuit, Activity, ArrowRight, ShieldCheck } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
  onWhyFlaggedClick: () => void;
  highestLossZoneName: string;
  highestLossPct: number;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExploreClick,
  onWhyFlaggedClick,
  highestLossZoneName,
  highestLossPct,
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white shadow-xl shadow-sky-950/20 border border-slate-800/80 p-6 sm:p-8 lg:p-10 my-6">
      {/* Background ambient water glow & grid */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        
        {/* Left text column */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-semibold backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse"></span>
            Smart City Water Management & Anomaly Intelligence
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span className="p-2 bg-gradient-to-tr from-sky-500 to-cyan-400 rounded-2xl text-slate-950 inline-flex shadow-lg shadow-sky-500/30">
                <Droplet className="w-8 h-8 fill-current text-white" />
              </span>
              <span>WaterGuard</span>
            </h1>
            <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-sky-200 via-cyan-200 to-blue-300 bg-clip-text text-transparent">
              “Know your water. Find the loss. Save the future.”
            </p>
          </div>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
            We compare the amount of water supplied to each zone with the amount consumed. 
            The system identifies unusual water loss, possible leakage areas, predicts future water demand, 
            and suggests actionable maintenance workflows.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm shadow-md shadow-sky-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Search className="w-4 h-4" />
              <span>Find the Water Loss</span>
              <ArrowRight className="w-4 h-4 ml-0.5" />
            </button>

            {highestLossPct >= 15 && (
              <button
                onClick={onWhyFlaggedClick}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-200 font-semibold text-sm transition-all"
              >
                <BrainCircuit className="w-4 h-4 text-rose-400" />
                <span>Explain {highestLossZoneName} Anomaly ({highestLossPct.toFixed(0)}% Loss)</span>
              </button>
            )}
          </div>
        </div>

        {/* Right mini banner card */}
        <div className="lg:w-80 bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 shadow-inner flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700 pb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> System Mission
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
              Active Monitoring
            </span>
          </div>

          <blockquote className="text-xs text-slate-300 italic leading-relaxed border-l-2 border-sky-400 pl-3">
            "Make water loss visible, understandable and actionable for every citizen and water utility operator."
          </blockquote>

          <div className="grid grid-cols-2 gap-2 pt-1 text-center text-xs">
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="block text-slate-400 text-[10px]">Telemetry Rate</span>
              <span className="font-bold text-sky-300">100% Real-time</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="block text-slate-400 text-[10px]">AI Diagnostics</span>
              <span className="font-bold text-cyan-300">Explainable</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
