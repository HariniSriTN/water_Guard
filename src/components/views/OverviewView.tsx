import React from 'react';
import { ZoneData, AppPage } from '../../types/water';
import { HeroBanner } from '../HeroBanner';
import { KpiOverview } from '../KpiOverview';
import { WorkflowPipeline } from '../WorkflowPipeline';
import { formatLiters, formatPercentage } from '../../utils/formatters';
import { 
  Search, 
  BrainCircuit, 
  BarChart2, 
  Calendar, 
  TrendingUp, 
  Layers, 
  Wrench, 
  Filter, 
  Award, 
  AlertTriangle, 
  ArrowRight, 
  ShieldCheck,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

interface OverviewViewProps {
  totalSupplied: number;
  totalConsumed: number;
  totalLoss: number;
  lossPercentage: number;
  zones: ZoneData[];
  onNavigate: (page: AppPage) => void;
  onSelectZone: (zone: ZoneData) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  totalSupplied,
  totalConsumed,
  totalLoss,
  lossPercentage,
  zones,
  onNavigate,
  onSelectZone,
}) => {
  const highestLossZone = [...zones].sort((a, b) => b.lossPercentage - a.lossPercentage)[0] || zones[0];
  const abnormalZones = zones.filter(z => z.status === 'abnormal' || z.status === 'warning');

  const navigationCards = [
    {
      id: 'find-loss' as AppPage,
      title: 'Find Water Loss',
      desc: 'Inspect all 5 District Metered Areas, supply vs consumption balances, and leak risks.',
      icon: Search,
      badge: `${zones.length} Zones Tracked`,
      color: 'bg-sky-500 text-white',
      accent: 'border-sky-200 hover:border-sky-400 bg-white'
    },
    {
      id: 'ml-explanations' as AppPage,
      title: 'Why Is This Happening? (ML)',
      desc: 'Explainable AI diagnostic reasons: pipeline ruptures, meter drifts, and pressure drops.',
      icon: BrainCircuit,
      badge: 'Explainable AI',
      color: 'bg-rose-500 text-white',
      accent: 'border-rose-200 hover:border-rose-400 bg-white'
    },
    {
      id: 'compare-zones' as AppPage,
      title: 'Compare Zones',
      desc: 'Direct measured volumetric ranking identifying which DMA sector requires immediate repair.',
      icon: BarChart2,
      badge: 'Zone Loss Ranking',
      color: 'bg-indigo-500 text-white',
      accent: 'border-indigo-200 hover:border-indigo-400 bg-white'
    },
    {
      id: 'loss-timeline' as AppPage,
      title: 'Water Loss Over Time',
      desc: '7-day historical telemetry curve with automated onset detection pinning down when loss started.',
      icon: Calendar,
      badge: '7-14 Day Trends',
      color: 'bg-cyan-600 text-white',
      accent: 'border-cyan-200 hover:border-cyan-400 bg-white'
    },
    {
      id: 'forecast' as AppPage,
      title: 'View Demand Forecast',
      desc: 'Predict upcoming 7–14 day consumption and calculate recommended production supply volume.',
      icon: TrendingUp,
      badge: 'Supply Planning',
      color: 'bg-emerald-600 text-white',
      accent: 'border-emerald-200 hover:border-emerald-400 bg-white'
    },
    {
      id: 'network' as AppPage,
      title: 'Open Network Map',
      desc: 'Live smart city grid topology with animated pipe flow rates, pressure sensors, and nodes.',
      icon: Layers,
      badge: 'Interactive Topology',
      color: 'bg-teal-600 text-white',
      accent: 'border-teal-200 hover:border-teal-400 bg-white'
    },
    {
      id: 'action-plan' as AppPage,
      title: 'View Action Plan',
      desc: 'Dispatch maintenance work orders, acoustic detection teams, and track water saved.',
      icon: Wrench,
      badge: 'Work Orders Dispatch',
      color: 'bg-amber-500 text-white',
      accent: 'border-amber-200 hover:border-amber-400 bg-white'
    },
    {
      id: 'preprocessing' as AppPage,
      title: 'Data Preprocessing',
      desc: 'Review 50k telemetry cleaning, deduplication, outlier handling, and 12 ML feature sets.',
      icon: Filter,
      badge: '96.9% Valid Yield',
      color: 'bg-purple-600 text-white',
      accent: 'border-purple-200 hover:border-purple-400 bg-white'
    },
    {
      id: 'ml-performance' as AppPage,
      title: 'ML Model Performance',
      desc: 'Review 94.2% accuracy, 91.5% recall, confusion matrix, and 5-fold cross-validation metrics.',
      icon: Award,
      badge: '94.2% Accuracy',
      color: 'bg-emerald-500 text-white',
      accent: 'border-emerald-200 hover:border-emerald-400 bg-white'
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* 1. Hero Landing Banner */}
      <HeroBanner
        onExploreClick={() => onNavigate('find-loss')}
        onWhyFlaggedClick={() => {
          onSelectZone(highestLossZone);
          onNavigate('ml-explanations');
        }}
        highestLossZoneName={highestLossZone.name.split(' - ')[0]}
        highestLossPct={highestLossZone.lossPercentage}
      />

      {/* 2. Top Water Balance KPI Cards */}
      <KpiOverview
        totalSupplied={totalSupplied}
        totalConsumed={totalConsumed}
        totalLoss={totalLoss}
        lossPercentage={lossPercentage}
      />

      {/* 3. Critical Zone Alert Summary Box */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Real-time District Alert Summary
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-0.5">
              Priority Water Loss Attention Required
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {abnormalZones.length} of {zones.length} zones require inspection
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {abnormalZones.map((zone) => {
            const isCritical = zone.lossPercentage >= 35;
            return (
              <div
                key={zone.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  isCritical ? 'bg-rose-50/70 border-rose-200' : 'bg-amber-50/70 border-amber-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{zone.name}</span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                        isCritical ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                      }`}>
                        {zone.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Supplied: <strong>{formatLiters(zone.currentSupply)}</strong> • Lost: <strong className={isCritical ? 'text-rose-700' : 'text-amber-700'}>{formatLiters(zone.currentLoss)} ({formatPercentage(zone.lossPercentage)})</strong>
                    </p>
                  </div>
                  <span className="text-xl">{isCritical ? '🚨' : '⚠️'}</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-600 font-medium">
                    Pressure: <strong>{zone.currentPressure} Bar</strong> (Target: {zone.standardPressure} Bar)
                  </span>
                  <button
                    onClick={() => {
                      onSelectZone(zone);
                      onNavigate('ml-explanations');
                    }}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:text-sky-800 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs hover:bg-sky-50"
                  >
                    <span>Explain Anomaly</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Quick Application Navigation Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Application Modules
            </span>
            <h3 className="text-xl font-black text-slate-900">
              🚀 Explore Smart WaterGuard Modules
            </h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Click any card to open screen
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {navigationCards.map((card) => {
            const Icon = card.icon;

            return (
              <button
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className={`p-5 rounded-3xl border ${card.accent} shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between space-y-4 group hover:scale-[1.01] active:scale-[0.99]`}
              >
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-2xl ${card.color} shadow-sm`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                    {card.badge}
                  </span>
                </div>

                <div>
                  <h4 className="font-black text-base text-slate-900 group-hover:text-sky-600 transition-colors flex items-center justify-between">
                    <span>{card.title}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-all" />
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. End-to-End Workflow Pipeline Visualizer */}
      <div className="space-y-2">
        <WorkflowPipeline onStageClick={onNavigate} />
      </div>

    </div>
  );
};
