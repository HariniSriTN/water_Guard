import React from 'react';
import { Droplet, Activity, Sparkles, Upload, RefreshCw, Printer, Cpu } from 'lucide-react';
import { WaterScenario, AppPage } from '../types/water';

interface NavbarProps {
  scenarios: WaterScenario[];
  selectedScenarioId: string;
  onSelectScenario: (scenarioId: string) => void;
  onOpenUpload: () => void;
  onOpenSimulator: () => void;
  onReset: () => void;
  isSimulating: boolean;
  onNavigate: (page: AppPage) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  scenarios,
  selectedScenarioId,
  onSelectScenario,
  onOpenUpload,
  onOpenSimulator,
  onReset,
  isSimulating,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo & Brand - Clickable to go to Dashboard Overview */}
          <button
            onClick={() => onNavigate('overview')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-600 via-blue-600 to-cyan-500 shadow-md shadow-sky-500/20 text-white font-black text-xl group-hover:scale-105 transition-transform">
              <Droplet className="w-6 h-6 fill-white text-white animate-pulse-slow" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-sky-700 via-blue-700 to-indigo-800 bg-clip-text text-transparent group-hover:opacity-90 transition-opacity">
                  Smart WaterGuard
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                  <Activity className="w-3 h-3 text-sky-500" /> City Live DMA
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block font-medium">
                Water Supply, Waste & Leakage Detection Analytics System
              </p>
            </div>
          </button>

          {/* Controls: Preset Scenario, Simulator, Upload, Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Scenario Picker */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-100/90 p-1 rounded-xl border border-slate-200">
              <span className="text-xs font-semibold text-slate-600 pl-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Scenario:
              </span>
              <select
                value={selectedScenarioId}
                onChange={(e) => onSelectScenario(e.target.value)}
                aria-label="Select Water Monitoring Scenario"
                className="bg-white text-xs font-medium text-slate-800 rounded-lg py-1.5 px-2.5 border border-slate-200/80 shadow-xs focus:ring-2 focus:ring-sky-500 focus:outline-none cursor-pointer"
              >
                {scenarios.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.title}
                  </option>
                ))}
              </select>
            </div>

            {/* What-If Simulator Button */}
            <button
              onClick={onOpenSimulator}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all shadow-xs border ${
                isSimulating
                  ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/25 ring-2 ring-amber-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200/90 hover:border-slate-300'
              }`}
              title="Test What-If Scenarios (Fix Leaks, Lower Pressure)"
            >
              <Cpu className={`w-3.5 h-3.5 ${isSimulating ? 'text-white' : 'text-sky-600'}`} />
              <span className="hidden sm:inline">What-If Simulator</span>
              {isSimulating && <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>}
            </button>

            {/* Custom CSV Upload */}
            <button
              onClick={onOpenUpload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-xs transition-colors"
              title="Upload Custom Water Meter CSV"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Upload CSV</span>
            </button>

            {/* Print / Export Report */}
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors hidden md:flex items-center justify-center"
              title="Print Summary Report"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Reset */}
            <button
              onClick={onReset}
              className="p-2 text-slate-600 hover:text-sky-600 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors"
              title="Reset to Default"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
