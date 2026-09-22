import React, { useState } from 'react';
import { ZoneData, AppPage } from '../../types/water';
import { ZoneComparisonChart } from '../ZoneComparisonChart';
import { formatLiters, formatPercentage, formatPressure, getStatusBadge } from '../../utils/formatters';
import { 
  ArrowLeft, 
  BarChart2, 
  BrainCircuit, 
  ChevronRight, 
  Waves, 
  Droplet, 
  AlertTriangle, 
  PieChart, 
  Gauge, 
  ArrowRight 
} from 'lucide-react';

interface CompareZonesViewProps {
  zones: ZoneData[];
  onNavigate: (page: AppPage) => void;
  onSelectZone: (zone: ZoneData) => void;
  selectedZoneId?: string;
}

export const CompareZonesView: React.FC<CompareZonesViewProps> = ({
  zones,
  onNavigate,
  onSelectZone,
  selectedZoneId,
}) => {
  const [activeZone, setActiveZone] = useState<ZoneData>(
    zones.find(z => z.id === selectedZoneId) || 
    [...zones].sort((a, b) => b.currentLoss - a.currentLoss)[0] || 
    zones[0]
  );

  const badge = getStatusBadge(activeZone.status);
  const isAbnormal = activeZone.status === 'abnormal';

  const handleSelect = (zone: ZoneData) => {
    setActiveZone(zone);
    onSelectZone(zone);
  };

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
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1">
              <BarChart2 className="w-3.5 h-3.5" /> District Comparison
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              📊 Compare Zones (Measured Water Loss)
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('find-loss')}
            className="px-3.5 py-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
          >
            View Table Breakdown
          </button>
          <button
            onClick={() => {
              onSelectZone(activeZone);
              onNavigate('ml-explanations');
            }}
            className="px-3.5 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Analyze {activeZone.name.split(' - ')[0]}</span>
          </button>
        </div>
      </div>

      {/* Main Bar Chart */}
      <ZoneComparisonChart
        zones={zones}
        selectedZoneId={activeZone.id}
        onSelectZone={handleSelect}
      />

      {/* Screen 4 Requirement: Selected Zone Inspector Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Selected Zone Inspection
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h3 className="text-xl font-black text-slate-900">{activeZone.name}</h3>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.badgeClass}`}>
                {badge.iconEmoji} {badge.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {activeZone.type} District • {activeZone.populationServed.toLocaleString('en-IN')} Residents • {activeZone.pipeLengthKm} km Mainline
            </p>
          </div>

          <button
            onClick={() => {
              onSelectZone(activeZone);
              onNavigate('ml-explanations');
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-md shadow-sky-600/20 transition-all self-start sm:self-center"
          >
            <BrainCircuit className="w-4 h-4" />
            <span>Analyze This Zone</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 6 Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100">
            <span className="text-[11px] font-bold text-sky-800 uppercase block">Supplied</span>
            <span className="text-lg font-black text-slate-900 block mt-1">
              {formatLiters(activeZone.currentSupply)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <span className="text-[11px] font-bold text-emerald-800 uppercase block">Consumed</span>
            <span className="text-lg font-black text-emerald-800 block mt-1">
              {formatLiters(activeZone.currentConsumed)}
            </span>
          </div>

          <div className={`p-3.5 rounded-2xl border ${
            isAbnormal ? 'bg-rose-50/70 border-rose-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[11px] font-bold uppercase block ${isAbnormal ? 'text-rose-700' : 'text-slate-500'}`}>Water Lost</span>
            <span className={`text-lg font-black block mt-1 ${isAbnormal ? 'text-rose-700' : 'text-slate-800'}`}>
              {formatLiters(activeZone.currentLoss)}
            </span>
          </div>

          <div className={`p-3.5 rounded-2xl border ${
            isAbnormal ? 'bg-rose-50/70 border-rose-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-[11px] font-bold uppercase block ${isAbnormal ? 'text-rose-700' : 'text-slate-500'}`}>Loss %</span>
            <span className={`text-lg font-black block mt-1 ${isAbnormal ? 'text-rose-700' : 'text-emerald-700'}`}>
              {formatPercentage(activeZone.lossPercentage)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Pressure</span>
            <span className="text-lg font-black text-slate-900 block mt-1">
              {formatPressure(activeZone.currentPressure)}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-slate-500 uppercase block">Status</span>
            <span className="text-sm font-black text-slate-900 block mt-1">
              {badge.iconEmoji} {badge.label}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
};
