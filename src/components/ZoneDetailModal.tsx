import React from 'react';
import { ZoneData } from '../types/water';
import { formatLiters, formatPercentage, formatPressure, getStatusBadge } from '../utils/formatters';
import { X, AlertTriangle, Droplet, Waves, PieChart, Calendar, Wrench, ShieldAlert } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface ZoneDetailModalProps {
  zone: ZoneData | null;
  onClose: () => void;
  onOpenTicket: (zone: ZoneData) => void;
}

export const ZoneDetailModal: React.FC<ZoneDetailModalProps> = ({
  zone,
  onClose,
  onOpenTicket,
}) => {
  if (!zone) return null;

  const badge = getStatusBadge(zone.status);
  const isHighLoss = zone.lossPercentage >= 30;
  const isModerateLoss = zone.lossPercentage >= 15 && zone.lossPercentage < 30;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-2xl ${isHighLoss ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'}`}>
              <Droplet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-slate-900">{zone.name}</h3>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${badge.badgeClass}`}>
                  {badge.iconEmoji} {badge.label}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {zone.type} District • {zone.populationServed.toLocaleString('en-IN')} Residents • {zone.pipeLengthKm} km Mainline • Avg Pipe Age: {zone.avgPipeAgeYears} yrs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          {/* Section 4 Required KPI Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1">
                <Waves className="w-3.5 h-3.5" /> Water Supplied
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1.5">
                {formatLiters(zone.currentSupply)}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">District meter inlet</span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5" /> Water Consumed
              </span>
              <div className="text-2xl font-black text-emerald-800 mt-1.5">
                {formatLiters(zone.currentConsumed)}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Customer endpoints</span>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isHighLoss ? 'bg-rose-50/80 border-rose-200' : isModerateLoss ? 'bg-amber-50/80 border-amber-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
                isHighLoss ? 'text-rose-700' : isModerateLoss ? 'text-amber-700' : 'text-slate-600'
              }`}>
                <AlertTriangle className="w-3.5 h-3.5" /> Unaccounted Water
              </span>
              <div className={`text-2xl font-black mt-1.5 ${
                isHighLoss ? 'text-rose-700' : isModerateLoss ? 'text-amber-700' : 'text-slate-800'
              }`}>
                {formatLiters(zone.currentLoss)}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">Unbilled delta</span>
            </div>

            <div className={`p-4 rounded-2xl border ${
              isHighLoss ? 'bg-rose-50/80 border-rose-200' : isModerateLoss ? 'bg-amber-50/80 border-amber-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className={`text-xs font-bold uppercase tracking-wider flex items-center gap-1 ${
                isHighLoss ? 'text-rose-700' : isModerateLoss ? 'text-amber-700' : 'text-slate-600'
              }`}>
                <PieChart className="w-3.5 h-3.5" /> Loss Percentage
              </span>
              <div className={`text-2xl font-black mt-1.5 ${
                isHighLoss ? 'text-rose-700' : isModerateLoss ? 'text-amber-700' : 'text-emerald-700'
              }`}>
                {formatPercentage(zone.lossPercentage)}
              </div>
              <span className="text-[11px] text-slate-500 font-medium">City limit: 7%</span>
            </div>

          </div>

          {/* Section 4 Nuanced Explanation Box (Mandated exact wording) */}
          <div className={`p-5 rounded-2xl border ${
            isHighLoss
              ? 'bg-rose-50 border-rose-200 text-rose-950'
              : isModerateLoss
              ? 'bg-amber-50 border-amber-200 text-amber-950'
              : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                isHighLoss ? 'bg-rose-100 text-rose-700' : isModerateLoss ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                <ShieldAlert className="w-5 h-5" />
              </div>

              <div className="space-y-2">
                <h4 className="font-extrabold text-base flex items-center gap-2">
                  {isHighLoss ? (
                    <span>🚨 This zone has unusually high water loss.</span>
                  ) : isModerateLoss ? (
                    <span>⚠️ This zone has moderately elevated water loss.</span>
                  ) : (
                    <span>🟢 This zone is operating within normal parameters.</span>
                  )}
                </h4>

                <p className="text-xs sm:text-sm leading-relaxed text-slate-800 font-medium">
                  {isHighLoss || isModerateLoss ? (
                    <>
                      <strong>System Assessment:</strong> “The data indicates possible abnormal water loss. 
                      Possible reasons include pipeline leakage, abnormal consumption, meter issues or pressure-related distribution problems.”
                    </>
                  ) : (
                    <>
                      <strong>System Assessment:</strong> Water balance is tightly maintained. No significant anomaly detected in telemetry or pressure lines.
                    </>
                  )}
                </p>

                <div className="text-[11px] text-slate-600 bg-white/70 p-2.5 rounded-xl border border-slate-200/60 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span><strong>Line Pressure:</strong> {formatPressure(zone.currentPressure)} (Target: {formatPressure(zone.standardPressure)})</span>
                  <span><strong>Night Flow Rate:</strong> {formatLiters(zone.minNightFlow)}/hr</span>
                  <span><strong>Telemetry Sensor Health:</strong> {zone.sensorHealth}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Historical Trend Chart for this Zone */}
          {zone.history && zone.history.length > 0 && (
            <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    <span>Historical Water Balance Trend for {zone.name}</span>
                  </h4>
                  <p className="text-xs text-slate-500">
                    Comparing Daily Supplied vs Consumed vs Lost (Litres)
                  </p>
                </div>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={zone.history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="supplyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="consumedGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                      </linearGradient>
                      <linearGradient id="lossGrad" x1="0" y1="0" x2="0" y2="1">
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
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Area type="monotone" dataKey="supplyLiters" name="Supplied" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#supplyGrad)" />
                    <Area type="monotone" dataKey="consumedLiters" name="Consumed" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#consumedGrad)" />
                    <Area type="monotone" dataKey="lossLiters" name="Water Loss" stroke="#f43f5e" strokeWidth={2.5} fillOpacity={1} fill="url(#lossGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Action footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
            <span className="text-xs text-slate-500 font-medium">
              Zone ID: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{zone.id}</code>
            </span>

            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenTicket(zone);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md shadow-sky-600/20 hover:from-sky-500 hover:to-blue-600 transition-all"
              >
                <Wrench className="w-3.5 h-3.5" />
                <span>Create Maintenance Work Order</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
