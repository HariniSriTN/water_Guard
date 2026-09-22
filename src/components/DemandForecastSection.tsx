import React, { useState } from 'react';
import { ZoneData } from '../types/water';
import { generateDemandForecast } from '../services/forecasting';
import { formatLiters } from '../utils/formatters';
import { TrendingUp, Calendar, CloudSun, ShieldCheck, Zap, Droplet } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

interface DemandForecastSectionProps {
  zones: ZoneData[];
}

export const DemandForecastSection: React.FC<DemandForecastSectionProps> = ({ zones }) => {
  const [daysAhead, setDaysAhead] = useState<7 | 14>(7);

  const forecastResult = generateDemandForecast(zones, daysAhead);
  const { forecast, totalExpectedDemand, totalRecommendedSupply, peakDemandDay, recommendationSummary } = forecastResult;

  return (
    <section id="forecast-section" className="space-y-4 my-8 scroll-mt-20" aria-label="Future Water Demand Forecasting">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> Predictive Production Planning
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            📈 What will we need next? (Future Demand)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Forecast future consumption using historical moving average, weather multipliers, and weekend demand cycles.
          </p>
        </div>

        {/* Days Ahead Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
          <button
            onClick={() => setDaysAhead(7)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              daysAhead === 7 ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            7-Day Forecast
          </button>
          <button
            onClick={() => setDaysAhead(14)}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              daysAhead === 14 ? 'bg-white text-slate-900 shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            14-Day Outlook
          </button>
        </div>
      </div>

      {/* Main Forecast Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        
        {/* Forecast Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-700 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5" /> Projected Consumer Demand
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1.5">
              {formatLiters(totalExpectedDemand)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Expected legitimate consumption</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" /> Recommended Supply Output
            </span>
            <div className="text-2xl font-black text-emerald-800 mt-1.5">
              {formatLiters(totalRecommendedSupply)}
            </div>
            <p className="text-xs text-slate-500 mt-1">Includes 6.5% standard buffer</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
              <CloudSun className="w-3.5 h-3.5" /> Anticipated Peak Demand Day
            </span>
            <div className="text-xl font-black text-slate-900 mt-1.5">
              {peakDemandDay}
            </div>
            <p className="text-xs text-slate-500 mt-1">Higher residential weekend peak</p>
          </div>

        </div>

        {/* Forecast Recommendation Summary Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-900 to-slate-900 text-white flex items-start gap-3.5 shadow-sm">
          <div className="p-2 rounded-xl bg-sky-800/80 text-sky-300 shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              City Water Board Production Recommendation
            </span>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {recommendationSummary}
            </p>
          </div>
        </div>

        {/* Forecast Chart */}
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-600" />
            <span>Forward Demand Curve & Supply Target (Litres / Day)</span>
          </h4>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="forecastDemandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0}/>
                  </linearGradient>
                  <linearGradient id="forecastSupplyGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k L`} />
                <Tooltip
                  formatter={(val: any, name: any) => [
                    typeof val === 'number' ? formatLiters(val) : val,
                    name === 'predictedDemand' ? 'Predicted Demand' : 'Recommended Supply'
                  ]}
                  contentStyle={{ borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="recommendedSupply" name="Recommended Supply" stroke="#10b981" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#forecastSupplyGrad)" />
                <Area type="monotone" dataKey="predictedDemand" name="Predicted Demand" stroke="#0ea5e9" strokeWidth={2.5} fillOpacity={1} fill="url(#forecastDemandGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Forecast Breakdown Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-2">
          {forecast.slice(0, 7).map((f, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-2xl border text-center transition-all ${
                f.isPeakDay
                  ? 'bg-amber-50/70 border-amber-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                <span>{f.dayName.slice(0, 3)}</span>
                <span>{f.date}</span>
              </div>
              <span className="text-sm font-black text-slate-900 block mt-1">
                {formatLiters(f.predictedDemand)}
              </span>
              <span className="text-[10px] text-slate-500 block truncate mt-0.5" title={f.weatherFactor}>
                {f.weatherFactor.split(' ')[0]}
              </span>
              {f.isPeakDay && (
                <span className="mt-1 inline-block text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-900">
                  Peak Day
                </span>
              )}
            </div>
          ))}
        </div>

      </div>

    </section>
  );
};
