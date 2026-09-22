import React, { useState } from 'react';
import { ZoneData, AppPage } from '../../types/water';
import { ZoneTable } from '../ZoneTable';
import { formatLiters, formatPercentage, formatPressure, getStatusBadge } from '../../utils/formatters';
import { 
  ArrowLeft, 
  Search, 
  BrainCircuit, 
  Waves, 
  Droplet, 
  AlertTriangle, 
  PieChart, 
  Gauge, 
  ChevronRight,
  ShieldAlert,
  Calendar,
  Wrench
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface FindLossViewProps {
  zones: ZoneData[];
  onNavigate: (page: AppPage) => void;
  onSelectZone: (zone: ZoneData) => void;
  selectedZoneId?: string;
  onOpenTicket: (zone: ZoneData) => void;
}

export const FindLossView: React.FC<FindLossViewProps> = ({
  zones,
  onNavigate,
  onSelectZone,
  selectedZoneId,
  onOpenTicket,
}) => {
  const activeZone = zones.find(z => z.id === selectedZoneId) || zones.find(z => z.status === 'abnormal') || zones[0];
  const badge = activeZone ? getStatusBadge(activeZone.status) : null;
  const isHighLoss = activeZone ? activeZone.lossPercentage >= 30 : false;

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Navigation Header */}
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
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                District Metered Area Balances
              </span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              🔎 Find the Water Loss
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('compare-zones')}
            className="px-3 py-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Compare All Zones
          </button>
          {activeZone && (
            <button
              onClick={() => {
                onSelectZone(activeZone);
                onNavigate('ml-explanations');
              }}
              className="px-3.5 py-1.5 text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>View ML Explanation</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Zone Table */}
      <ZoneTable
        zones={zones}
        onSelectZone={(zone) => onSelectZone(zone)}
        selectedZoneId={activeZone?.id}
      />

      {/* Selected Zone Deep-Dive Inspection Panel */}
      {activeZone && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          
          {/* Panel Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${isHighLoss ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'}`}>
                <Droplet className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900">{activeZone.name}</h3>
                  {badge && (
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.badgeClass}`}>
                      {badge.iconEmoji} {badge.label}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">
                  {activeZone.type} District • {activeZone.populationServed.toLocaleString('en-IN')} Residents • {activeZone.pipeLengthKm} km Mainline • Avg Pipe Age: {activeZone.avgPipeAgeYears} yrs
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onSelectZone(activeZone);
                  onNavigate('ml-explanations');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl shadow-md shadow-rose-600/20 transition-all"
              >
                <BrainCircuit className="w-4 h-4" />
                <span>View ML Explanation for {activeZone.name.split(' - ')[0]}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* KPI Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1">
                <Waves className="w-3.5 h-3.5" /> Water Supplied
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1.5">
                {formatLiters(activeZone.currentSupply)}
              </div>
              <span className="text-[11px] text-slate-500">Feeder Inflow</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5" /> Water Consumed
              </span>
              <div className="text-2xl font-black text-emerald-800 mt-1.5">
                {formatLiters(activeZone.currentConsumed)}
              </div>
              <span className="text-[11px] text-slate-500">Billed Metered</span>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isHighLoss ? 'bg-rose-50/80 border-rose-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
                isHighLoss ? 'text-rose-700' : 'text-slate-600'
              }`}>
                <AlertTriangle className="w-3.5 h-3.5" /> Unaccounted Water
              </span>
              <div className={`text-2xl font-black mt-1.5 ${
                isHighLoss ? 'text-rose-700' : 'text-slate-800'
              }`}>
                {formatLiters(activeZone.currentLoss)}
              </div>
              <span className="text-[11px] text-slate-500">Unbilled Volume</span>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isHighLoss ? 'bg-rose-50/80 border-rose-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
                isHighLoss ? 'text-rose-700' : 'text-slate-600'
              }`}>
                <PieChart className="w-3.5 h-3.5" /> Loss Percentage
              </span>
              <div className={`text-2xl font-black mt-1.5 ${
                isHighLoss ? 'text-rose-700' : 'text-emerald-700'
              }`}>
                {formatPercentage(activeZone.lossPercentage)}
              </div>
              <span className="text-[11px] text-slate-500">City Limit: 7%</span>
            </div>

          </div>

          {/* Assessment Callout */}
          <div className={`p-5 rounded-2xl border ${
            isHighLoss ? 'bg-rose-50 border-rose-200 text-rose-950' : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}>
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs sm:text-sm">
                <h4 className="font-extrabold text-sm sm:text-base">
                  {isHighLoss ? '🚨 This zone has unusually high water loss.' : '🟢 Operating within normal balance standards.'}
                </h4>
                <p className="leading-relaxed text-slate-700 font-medium">
                  {isHighLoss 
                    ? '“The data indicates possible abnormal water loss. Possible reasons include pipeline leakage, abnormal consumption, meter issues or pressure-related distribution problems.”'
                    : 'Water balance is tightly maintained. Inflow closely matches customer endpoint meter readings.'}
                </p>
                <div className="pt-1 flex flex-wrap gap-4 text-[11px] text-slate-600">
                  <span><strong>Line Pressure:</strong> {formatPressure(activeZone.currentPressure)}</span>
                  <span><strong>Minimum Night Flow:</strong> {formatLiters(activeZone.minNightFlow)}/hr</span>
                  <span><strong>Sensor Health:</strong> {activeZone.sensorHealth}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Trend Chart */}
          {activeZone.history && activeZone.history.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-600" />
                <span>Daily Water Balance Trend for {activeZone.name}</span>
              </h4>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeZone.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="flSupplyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="flConsumedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="flLossGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                    <Tooltip
                      formatter={(val: any, name: any) => [
                        typeof val === 'number' ? formatLiters(val) : val,
                        name === 'supplyLiters' ? 'Supplied' : name === 'consumedLiters' ? 'Consumed' : 'Water Loss'
                      ]}
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="supplyLiters" name="Supplied" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#flSupplyGrad)" />
                    <Area type="monotone" dataKey="consumedLiters" name="Consumed" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#flConsumedGrad)" />
                    <Area type="monotone" dataKey="lossLiters" name="Water Loss" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#flLossGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
