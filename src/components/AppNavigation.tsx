import React from 'react';
import { AppPage } from '../types/water';
import { 
  LayoutDashboard, 
  Search, 
  BrainCircuit, 
  BarChart2, 
  Calendar, 
  TrendingUp, 
  Layers, 
  Wrench, 
  Filter, 
  Award,
  Sparkles
} from 'lucide-react';

interface AppNavigationProps {
  currentPage: AppPage;
  onNavigate: (page: AppPage) => void;
  abnormalCount: number;
  openTicketsCount: number;
}

export const AppNavigation: React.FC<AppNavigationProps> = ({
  currentPage,
  onNavigate,
  abnormalCount,
  openTicketsCount,
}) => {
  const navItems = [
    {
      id: 'overview' as AppPage,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'find-loss' as AppPage,
      label: 'Find Water Loss',
      icon: Search,
      badge: abnormalCount > 0 ? `${abnormalCount} Abnormal` : null,
      badgeColor: 'bg-rose-500 text-white'
    },
    {
      id: 'ml-explanations' as AppPage,
      label: 'Why Is This Happening? (ML)',
      icon: BrainCircuit,
      badge: 'Explainable AI',
      badgeColor: 'bg-indigo-100 text-indigo-700'
    },
    {
      id: 'compare-zones' as AppPage,
      label: 'Compare Zones',
      icon: BarChart2,
      badge: null
    },
    {
      id: 'loss-timeline' as AppPage,
      label: 'Water Loss Over Time',
      icon: Calendar,
      badge: null
    },
    {
      id: 'forecast' as AppPage,
      label: 'Demand Forecast',
      icon: TrendingUp,
      badge: '7-14 Days',
      badgeColor: 'bg-emerald-100 text-emerald-800'
    },
    {
      id: 'network' as AppPage,
      label: 'Live Water Network',
      icon: Layers,
      badge: 'Grid Topology',
      badgeColor: 'bg-cyan-100 text-cyan-800'
    },
    {
      id: 'action-plan' as AppPage,
      label: 'Action Plan',
      icon: Wrench,
      badge: openTicketsCount > 0 ? `${openTicketsCount} Active` : null,
      badgeColor: 'bg-amber-500 text-white'
    },
    {
      id: 'preprocessing' as AppPage,
      label: 'Data Preprocessing',
      icon: Filter,
      badge: '12 Feat',
      badgeColor: 'bg-slate-200 text-slate-700'
    },
    {
      id: 'ml-performance' as AppPage,
      label: 'ML Performance',
      icon: Award,
      badge: '94.2% Acc',
      badgeColor: 'bg-emerald-500 text-white'
    }
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/90 shadow-sm sticky top-16 sm:top-18 z-30 transition-all">
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 shrink-0 ${
                isActive
                  ? 'bg-slate-900 text-white shadow-sm ring-1 ring-slate-800 scale-[1.01]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/90'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
              <span>{item.label}</span>
              {item.badge && (
                <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                  isActive ? 'bg-white/20 text-white' : item.badgeColor || 'bg-slate-100 text-slate-600'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
