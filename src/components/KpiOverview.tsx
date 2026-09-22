import React from 'react';
import { Waves, Droplet, AlertTriangle, PieChart, Info, ArrowUpRight, TrendingUp } from 'lucide-react';
import { formatLiters, formatPercentage } from '../utils/formatters';

interface KpiOverviewProps {
  totalSupplied: number;
  totalConsumed: number;
  totalLoss: number;
  lossPercentage: number;
}

export const KpiOverview: React.FC<KpiOverviewProps> = ({
  totalSupplied,
  totalConsumed,
  totalLoss,
  lossPercentage,
}) => {
  const isLossHigh = lossPercentage > 15;
  const isLossSevere = lossPercentage > 25;

  return (
    <section className="space-y-4 my-8" aria-label="Key Performance Indicators">
      
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
            Current Water Balance
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            🚨 How much water are we losing?
          </h2>
        </div>
        <div className="text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
          Refreshed across all District Metered Areas
        </div>
      </div>

      {/* 4 Large KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* 1. Total Water Supplied */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Water Supplied
            </span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 group-hover:bg-sky-100 transition-colors">
              <Waves className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {formatLiters(totalSupplied)}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
              Pushed into city feeder mains
            </p>
          </div>

          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-sky-50 rounded-full opacity-60 pointer-events-none"></div>
        </div>

        {/* 2. Total Water Consumed */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Water Consumed
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
              <Droplet className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight">
              {formatLiters(totalConsumed)}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Legitimate consumer meter readings
            </p>
          </div>

          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-emerald-50 rounded-full opacity-60 pointer-events-none"></div>
        </div>

        {/* 3. Total Water Loss */}
        <div className={`relative overflow-hidden bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow group ${
          isLossSevere ? 'border-rose-300 ring-1 ring-rose-200' : isLossHigh ? 'border-amber-300' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Water Loss
            </span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
              isLossSevere 
                ? 'bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-100' 
                : 'bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-100'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isLossSevere ? 'text-rose-600' : isLossHigh ? 'text-amber-600' : 'text-slate-800'
            }`}>
              {formatLiters(totalLoss)}
            </div>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <span className={`w-1.5 h-1.5 rounded-full ${isLossSevere ? 'bg-rose-500 animate-ping' : 'bg-amber-500'}`}></span>
              Unaccounted distribution volume
            </p>
          </div>

          <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-60 pointer-events-none ${
            isLossSevere ? 'bg-rose-50' : 'bg-amber-50'
          }`}></div>
        </div>

        {/* 4. Loss Percentage */}
        <div className={`relative overflow-hidden bg-white rounded-2xl p-6 border shadow-sm hover:shadow-md transition-shadow group ${
          isLossSevere ? 'border-rose-300 ring-1 ring-rose-200' : isLossHigh ? 'border-amber-300' : 'border-slate-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Loss Percentage
            </span>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
              isLossSevere 
                ? 'bg-rose-50 text-rose-600 border-rose-100' 
                : 'bg-sky-50 text-sky-600 border-sky-100'
            }`}>
              <PieChart className="w-5 h-5" />
            </div>
          </div>

          <div className="mt-4">
            <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isLossSevere ? 'text-rose-600' : isLossHigh ? 'text-amber-600' : 'text-emerald-700'
            }`}>
              {formatPercentage(lossPercentage)}
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
              <span>Benchmark target: &lt; 7%</span>
              <span className={`font-semibold ${lossPercentage > 7 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {lossPercentage > 7 ? `+${(lossPercentage - 7).toFixed(1)}%` : 'Optimal'}
              </span>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-slate-50 rounded-full opacity-60 pointer-events-none"></div>
        </div>

      </div>

      {/* Human-Friendly Summary & Clarification Box */}
      <div className={`rounded-2xl p-4 sm:p-5 border transition-all ${
        isLossSevere
          ? 'bg-rose-50/80 border-rose-200 text-rose-950'
          : isLossHigh
          ? 'bg-amber-50/80 border-amber-200 text-amber-950'
          : 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
            isLossSevere ? 'bg-rose-100 text-rose-700' : isLossHigh ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
              <span>⚠️ {formatLiters(totalLoss)} of water were not accounted for in consumption records.</span>
            </h3>

            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              <strong className="text-slate-900 font-semibold">Important note:</strong> This does not necessarily mean physical leakage everywhere.{' '}
              <span className="underline decoration-slate-400 decoration-dotted">
                “This may indicate leakage, meter issues, abnormal usage or other distribution losses.”
              </span>
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Leakage Risk
              </span>
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Meter Telemetry Error
              </span>
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Pressure Imbalance
              </span>
              <span className="flex items-center gap-1 font-semibold text-slate-800">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span> Billed Drift
              </span>
            </div>
          </div>
        </div>
      </div>

    </section>
  );
};
