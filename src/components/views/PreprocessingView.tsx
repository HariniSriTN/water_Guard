import React from 'react';
import { AppPage } from '../../types/water';
import { DataPreprocessingSection } from '../DataPreprocessingSection';
import { FeatureSelectionSection } from '../FeatureSelectionSection';
import { defaultPreprocessingMetrics, defaultMLFeatures } from '../../data/defaultData';
import { ArrowLeft, Filter, Sparkles, Sliders, ShieldCheck } from 'lucide-react';

interface PreprocessingViewProps {
  onNavigate: (page: AppPage) => void;
}

export const PreprocessingView: React.FC<PreprocessingViewProps> = ({ onNavigate }) => {
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
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Big Data Preparation
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              🧹 Data Preprocessing & Feature Engineering
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('ml-performance')}
            className="px-3.5 py-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
          >
            View ML Performance
          </button>
        </div>
      </div>

      {/* Preprocessing Section */}
      <DataPreprocessingSection metrics={defaultPreprocessingMetrics} />

      {/* 12 Features Set */}
      <FeatureSelectionSection features={defaultMLFeatures} />

    </div>
  );
};
