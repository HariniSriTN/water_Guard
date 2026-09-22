import React from 'react';
import { ZoneData, AppPage } from '../../types/water';
import { TimeSeriesChart } from '../TimeSeriesChart';
import { ArrowLeft, Calendar, TrendingUp, Sparkles, Clock, AlertTriangle } from 'lucide-react';

interface LossTimelineViewProps {
  zones: ZoneData[];
  onNavigate: (page: AppPage) => void;
  onSelectZone: (zone: ZoneData) => void;
  selectedZoneId?: string;
}

export const LossTimelineView: React.FC<LossTimelineViewProps> = ({
  zones,
  onNavigate,
  onSelectZone,
  selectedZoneId,
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
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Historical Loss Evolution
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              📅 Water Loss Over Time (Telemetry Timeline)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('forecast')}
            className="px-3.5 py-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
          >
            View Forward Demand Forecast
          </button>
        </div>
      </div>

      {/* Main Historical Chart & Onset Inspector */}
      <TimeSeriesChart
        zones={zones}
        selectedZoneId={selectedZoneId}
        onSelectZone={onSelectZone}
      />

    </div>
  );
};
