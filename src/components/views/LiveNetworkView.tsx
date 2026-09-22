import React, { useState } from 'react';
import { ZoneData, AppPage } from '../../types/water';
import { NetworkTopologyMap } from '../NetworkTopologyMap';
import { formatLiters, formatPercentage, formatPressure, getStatusBadge } from '../../utils/formatters';
import { 
  ArrowLeft, 
  Layers, 
  BrainCircuit, 
  Wrench, 
  Activity, 
  Gauge, 
  Waves, 
  Droplet, 
  AlertTriangle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface LiveNetworkViewProps {
  zones: ZoneData[];
  onNavigate: (page: AppPage) => void;
  onSelectZone: (zone: ZoneData) => void;
  selectedZoneId?: string;
  onDispatchTicket: (zone: ZoneData) => void;
}

export const LiveNetworkView: React.FC<LiveNetworkViewProps> = ({
  zones,
  onNavigate,
  onSelectZone,
  selectedZoneId,
  onDispatchTicket,
}) => {
  const [activeZone, setActiveZone] = useState<ZoneData>(
    zones.find(z => z.id === selectedZoneId) || 
    zones.find(z => z.status === 'abnormal') || 
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
            <span className="text-xs font-bold uppercase tracking-wider text-teal-600 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Smart City DMA Grid
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              🗺️ Live Water Network & Feeder Map
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('action-plan')}
            className="px-3.5 py-1.5 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>Open Action Plan</span>
          </button>
        </div>
      </div>

      {/* SVG Network Map */}
      <NetworkTopologyMap
        zones={zones}
        selectedZoneId={activeZone.id}
        onSelectZone={handleSelect}
      />

      {/* Screen 7 Requirement: Interactive Node Telemetry Inspector */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Selected Network Node Telemetry
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <h3 className="text-xl font-black text-slate-900">{activeZone.name}</h3>
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.badgeClass}`}>
                {badge.iconEmoji} {badge.label}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Pipe Grid Coordinates: ({activeZone.coordinates.x}, {activeZone.coordinates.y}) • Mainline Feeder: 200mm Ductile Iron
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onSelectZone(activeZone);
                onNavigate('ml-explanations');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 rounded-xl shadow-2xs transition-all"
            >
              <BrainCircuit className="w-4 h-4 text-rose-500" />
              <span>ML Explanations</span>
            </button>

            {isAbnormal && (
              <button
                onClick={() => onDispatchTicket(activeZone)}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md shadow-rose-600/20 transition-all"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Dispatch Response Crew</span>
              </button>
            )}
          </div>
        </div>

        {/* Node Sensor Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
            <span className="text-xs font-bold text-sky-800 uppercase block">Line Pressure</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatPressure(activeZone.currentPressure)}
            </div>
            <span className="text-[11px] text-slate-500">Target: {formatPressure(activeZone.standardPressure)}</span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100">
            <span className="text-xs font-bold text-blue-800 uppercase block">Feeder Inflow</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatLiters(activeZone.currentSupply)}
            </div>
            <span className="text-[11px] text-slate-500">DMA intake node</span>
          </div>

          <div className={`p-4 rounded-2xl border ${
            isAbnormal ? 'bg-rose-50/70 border-rose-200' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className={`text-xs font-bold uppercase block ${isAbnormal ? 'text-rose-700' : 'text-slate-600'}`}>Water Loss</span>
            <div className={`text-2xl font-black mt-1 ${isAbnormal ? 'text-rose-700' : 'text-slate-800'}`}>
              {formatLiters(activeZone.currentLoss)}
            </div>
            <span className="text-[11px] text-slate-500">{formatPercentage(activeZone.lossPercentage)} loss</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-700 uppercase block">Minimum Night Flow</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {formatLiters(activeZone.minNightFlow)}/h
            </div>
            <span className="text-[11px] text-slate-500">02:00 - 04:00 AM</span>
          </div>

        </div>

        {/* Possible Issue & Recommended Action */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
              Possible Issue on Feeder Line
            </span>
            <p className="text-xs sm:text-sm font-bold text-slate-900">
              {isAbnormal ? 'Major distribution line breach near junction B-4 with severe pressure drop.' : 'Normal line resistance. No hydraulic bottleneck or leak detected.'}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 block">
              Recommended Engineering Action
            </span>
            <p className="text-xs sm:text-sm font-bold text-sky-950">
              {isAbnormal ? 'Dispatch acoustic leak team to valve section B-4 and adjust PRV booster.' : 'Continue continuous telemetry polling.'}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
