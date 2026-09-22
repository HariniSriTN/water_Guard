import React, { useState } from 'react';
import { ZoneData } from '../types/water';
import { formatLiters, formatPercentage } from '../utils/formatters';
import { BarChart2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, Legend } from 'recharts';

interface ZoneComparisonChartProps {
  zones: ZoneData[];
  onSelectZone: (zone: ZoneData) => void;
  selectedZoneId?: string;
}

export const ZoneComparisonChart: React.FC<ZoneComparisonChartProps> = ({
  zones,
  onSelectZone,
  selectedZoneId,
}) => {
  const [metric, setMetric] = useState<'loss' | 'lossPct' | 'balance'>('loss');

  // Find zone with highest water loss (based strictly on actual measured loss values)
  const sortedByLoss = [...zones].sort((a, b) => b.currentLoss - a.currentLoss);
  const highestLossZone = sortedByLoss[0];

  const chartData = zones.map((z) => ({
    id: z.id,
    name: z.name.split(' - ')[0], // short name for x-axis
    fullName: z.name,
    loss: z.currentLoss,
    lossPct: z.lossPercentage,
    supplied: z.currentSupply,
    consumed: z.currentConsumed,
    status: z.status,
    rawZone: z
  }));

  return (
    <section id="comparison-section" className="space-y-4 my-8 scroll-mt-20" aria-label="Zone Water Loss Comparison">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5" /> Zone Comparative Ranking
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            📊 Which Zone Needs Attention?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Compare actual measured water loss across all city distribution zones.
          </p>
        </div>

        {/* Metric Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setMetric('loss')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              metric === 'loss' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Water Loss (Litres)
          </button>
          <button
            onClick={() => setMetric('lossPct')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              metric === 'lossPct' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Loss %
          </button>
          <button
            onClick={() => setMetric('balance')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              metric === 'balance' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Supply vs Consumed
          </button>
        </div>
      </div>

      {/* Main Chart Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Chart View */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {metric === 'balance' ? (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600, fill: '#334155' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k L`} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    typeof val === 'number' ? formatLiters(val) : val,
                    name === 'supplied' ? 'Supplied' : 'Consumed'
                  ]}
                  contentStyle={{ borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="supplied" name="Water Supplied" fill="#0ea5e9" radius={[6, 6, 0, 0]} />
                <Bar dataKey="consumed" name="Water Consumed" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : (
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12, fontWeight: 600, fill: '#334155' }} axisLine={false} tickLine={false} />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(v) => metric === 'loss' ? `${(v/1000).toFixed(0)}k L` : `${v}%`} 
                />
                <Tooltip
                  formatter={(val: any) => [
                    typeof val === 'number' ? (metric === 'loss' ? formatLiters(val) : formatPercentage(val)) : val,
                    metric === 'loss' ? 'Water Loss' : 'Loss Percentage'
                  ]}
                  contentStyle={{ borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                />
                <Bar
                  dataKey={metric === 'loss' ? 'loss' : 'lossPct'}
                  name={metric === 'loss' ? 'Water Loss' : 'Loss %'}
                  radius={[8, 8, 0, 0]}
                  onClick={(data: any) => {
                    if (data && data.rawZone) onSelectZone(data.rawZone);
                  }}
                  className="cursor-pointer"
                >
                  {chartData.map((entry, index) => {
                    const isSelected = selectedZoneId === entry.id;
                    const isAbnormal = entry.status === 'abnormal';
                    const isWarning = entry.status === 'warning';
                    const fill = isSelected 
                      ? '#0284c7' 
                      : isAbnormal 
                      ? '#f43f5e' 
                      : isWarning 
                      ? '#f59e0b' 
                      : '#10b981';
                    return <Cell key={`cell-${index}`} fill={fill} className="transition-all hover:opacity-80" />;
                  })}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Section 8 Mandated Insight Card */}
        {highestLossZone && (
          <div className="p-5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" /> Key Ranking Insight
              </span>
              <p className="text-lg font-black text-white">
                🚨 <span className="text-rose-400">{highestLossZone.name}</span> currently shows the highest water loss.
              </p>
              <p className="text-xs text-slate-300">
                Losing <strong>{formatLiters(highestLossZone.currentLoss)}</strong> ({formatPercentage(highestLossZone.lossPercentage)} of its supplied water).
              </p>
            </div>

            <button
              onClick={() => onSelectZone(highestLossZone)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-md transition-all whitespace-nowrap self-start sm:self-center"
            >
              <span>Inspect {highestLossZone.name.split(' - ')[0]}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>

    </section>
  );
};
