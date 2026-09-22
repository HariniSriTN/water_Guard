import React from 'react';
import { ZoneData, AppPage } from '../../types/water';
import { DemandForecastSection } from '../DemandForecastSection';
import { ArrowLeft, TrendingUp, Calendar, Zap, ShieldCheck } from 'lucide-react';

interface DemandForecastViewProps {
  zones: ZoneData[];
  onNavigate: (page: AppPage) => void;
}

export const DemandForecastView: React.FC<DemandForecastViewProps> = ({
  zones,
  onNavigate,
}) => {
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
              <TrendingUp className="w-3.5 h-3.5" /> Forward Production Planning
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              📈 Demand Forecast & Supply Targets
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('network')}
            className="px-3.5 py-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Inspect Grid Network
          </button>
        </div>
      </div>

      {/* Main Forecast Component */}
      <DemandForecastSection zones={zones} />

    </div>
  );
};
