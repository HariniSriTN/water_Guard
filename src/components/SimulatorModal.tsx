import React, { useState } from 'react';
import { ZoneData } from '../types/water';
import { formatLiters, formatPercentage } from '../utils/formatters';
import { Cpu, X, Sliders, RefreshCw, CheckCircle2, TrendingDown, DollarSign } from 'lucide-react';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  zones: ZoneData[];
  onApplySimulation: (modifiedZones: ZoneData[]) => void;
  onResetSimulation: () => void;
  isSimulating: boolean;
}

export const SimulatorModal: React.FC<SimulatorModalProps> = ({
  isOpen,
  onClose,
  zones,
  onApplySimulation,
  onResetSimulation,
  isSimulating,
}) => {
  if (!isOpen) return null;

  // Local state for simulation adjustments
  const [leakReductionPct, setLeakReductionPct] = useState(65);
  const [pressureOptimizationPct, setPressureOptimizationPct] = useState(15);
  const [costPerThousandLiters, setCostPerThousandLiters] = useState(45); // in INR/currency

  // Calculate simulated numbers
  const currentTotalLoss = zones.reduce((s, z) => s + z.currentLoss, 0);
  const currentTotalSupply = zones.reduce((s, z) => s + z.currentSupply, 0);
  
  // Simulated savings
  const savedLiters = Math.round(currentTotalLoss * (leakReductionPct / 100));
  const newTotalLoss = Math.max(0, currentTotalLoss - savedLiters);
  const newLossPct = currentTotalSupply > 0 ? (newTotalLoss / currentTotalSupply) * 100 : 0;
  const financialSavings = Math.round((savedLiters / 1000) * costPerThousandLiters);

  const handleApply = () => {
    const updatedZones = zones.map((z) => {
      const zoneSaved = Math.round(z.currentLoss * (leakReductionPct / 100));
      const newLoss = Math.max(0, z.currentLoss - zoneSaved);
      const newPct = z.currentSupply > 0 ? (newLoss / z.currentSupply) * 100 : 0;
      const newStatus = newPct >= 30 ? 'abnormal' : newPct >= 15 ? 'warning' : 'normal';

      return {
        ...z,
        currentLoss: newLoss,
        lossPercentage: parseFloat(newPct.toFixed(1)),
        currentConsumed: z.currentSupply - newLoss,
        status: newStatus as any,
        anomalyScore: Math.round(newPct * 2.1),
        currentPressure: z.currentPressure < z.standardPressure 
          ? Math.min(z.standardPressure, z.currentPressure + (pressureOptimizationPct / 100) * 1.5)
          : z.currentPressure
      };
    });

    onApplySimulation(updatedZones);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">What-If Water Loss Reduction Simulator</h3>
              <p className="text-xs text-slate-300">Simulate engineering interventions (leak fixes, pressure modulation) and estimate savings.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {/* Sliders */}
          <div className="space-y-4">
            
            {/* Leak Reduction Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-sky-600" />
                  Target Leak Repair & Maintenance Efficiency
                </span>
                <span className="text-sky-600 font-extrabold text-sm">{leakReductionPct}% Fixed</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={leakReductionPct}
                onChange={(e) => setLeakReductionPct(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-sky-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0% (Status Quo)</span>
                <span>50% (Standard DMA fix)</span>
                <span>100% (Zero Leakage)</span>
              </div>
            </div>

            {/* Pressure Valve Optimization Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-600" />
                  Pressure Reduction Valve (PRV) Optimization
                </span>
                <span className="text-amber-600 font-extrabold text-sm">+{pressureOptimizationPct}% Optimized</span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                step="5"
                value={pressureOptimizationPct}
                onChange={(e) => setPressureOptimizationPct(Number(e.target.value))}
                className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

          </div>

          {/* Outcome Prediction Grid */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
            
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Water Recovered</span>
              <span className="text-xl font-black text-emerald-600 block mt-1">
                {formatLiters(savedLiters)}
              </span>
              <span className="text-[10px] text-slate-400">per distribution cycle</span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">New City Loss %</span>
              <span className="text-xl font-black text-sky-600 block mt-1">
                {formatPercentage(newLossPct)}
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold">
                Down from {formatPercentage((currentTotalLoss / currentTotalSupply) * 100)}
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase block">Estimated Value</span>
              <span className="text-xl font-black text-slate-900 block mt-1">
                ₹{financialSavings.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-slate-400">Tariff recovery</span>
            </div>

          </div>

          {/* Footer Controls */}
          <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
            {isSimulating && (
              <button
                type="button"
                onClick={() => {
                  onResetSimulation();
                  onClose();
                }}
                className="px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
              >
                Reset to Original Data
              </button>
            )}

            <div className="flex items-center gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-5 py-2 text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl shadow-md transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Apply Simulation to Dashboard</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
