import React, { useState } from 'react';
import { MLFeature } from '../types/water';
import { defaultMLFeatures } from '../data/defaultData';
import { 
  Sliders, 
  Sparkles, 
  Droplet, 
  Gauge, 
  Clock, 
  Calendar, 
  Network, 
  Info, 
  TrendingUp,
  Activity
} from 'lucide-react';

interface FeatureSelectionSectionProps {
  features?: MLFeature[];
}

export const FeatureSelectionSection: React.FC<FeatureSelectionSectionProps> = ({
  features = defaultMLFeatures,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: `All (${features.length})` },
    { id: 'Telemetry', label: 'Telemetry (4)' },
    { id: 'Hydraulic', label: 'Hydraulics (3)' },
    { id: 'Historical', label: 'Historical (3)' },
    { id: 'Spatial/Temporal', label: 'Spatial/Temporal (2)' }
  ];

  const filteredFeatures = selectedCategory === 'all'
    ? features
    : features.filter(f => f.category === selectedCategory);

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case 'Telemetry':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Hydraulic':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Historical':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Spatial/Temporal':
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  return (
    <section id="features-section" className="space-y-4 my-8 scroll-mt-20" aria-label="Feature Selection and ML Inputs">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5" /> Feature Engineering
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            🧬 Selected ML Input Features ({features.length})
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Key input variables extracted and scaled for the anomaly classification and leakage detection model.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === c.id
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'hover:text-slate-900'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        
        {/* Mandated Explanation Callout */}
        <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200 text-sky-950 flex items-start gap-3">
          <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm leading-relaxed">
            <strong className="font-bold text-sky-900">Feature Engineering Rationale:</strong>{' '}
            <span className="font-semibold italic">
              “These features are used to identify abnormal distribution patterns and possible leakage conditions.”
            </span>{' '}
            By coupling volumetric balances with real-time hydrostatic pressure and minimum night flow, the model discriminates between legitimate customer demand surges and underground physical pipe breaches.
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredFeatures.map((feat) => (
            <div
              key={feat.id}
              className="p-4 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-sky-300 transition-all shadow-2xs hover:shadow-xs flex flex-col justify-between space-y-3 group"
            >
              {/* Card Header: Name & Category */}
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-extrabold text-sm text-slate-900 group-hover:text-sky-700 transition-colors">
                    {feat.name}
                  </h4>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getCategoryBadgeColor(feat.category)}`}>
                    {feat.category}
                  </span>
                </div>
                <code className="text-[10.5px] font-mono text-slate-400 block mt-0.5">
                  {feat.key}
                </code>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 font-medium leading-relaxed">
                {feat.description}
              </p>

              {/* Importance Weight Bar & Sample Value */}
              <div className="pt-2 border-t border-slate-200/60 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-medium">Model Importance</span>
                  <span className="font-bold text-sky-700">{feat.importance}%</span>
                </div>
                <div className="w-full bg-slate-200/80 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-blue-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${feat.importance}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                  <span>Unit: {feat.unit}</span>
                  <span className="font-semibold text-slate-700">Sample: {feat.sampleValue}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

    </section>
  );
};
