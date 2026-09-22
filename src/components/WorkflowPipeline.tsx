import React from 'react';
import { AppPage } from '../types/water';
import { 
  Database, 
  Filter, 
  BarChart2, 
  BrainCircuit, 
  CheckCircle2, 
  TrendingUp, 
  Wrench, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface WorkflowPipelineProps {
  onStageClick: (page: AppPage) => void;
}

export const WorkflowPipeline: React.FC<WorkflowPipelineProps> = ({ onStageClick }) => {
  const stages: Array<{
    step: string;
    title: string;
    desc: string;
    icon: any;
    targetId: AppPage;
    color: string;
    badge: string;
  }> = [
    {
      step: '01',
      title: 'Raw Data',
      desc: 'SCADA Telemetry',
      icon: Database,
      targetId: 'preprocessing',
      color: 'from-sky-500 to-blue-600',
      badge: '50k Records'
    },
    {
      step: '02',
      title: 'Preprocessing',
      desc: 'Cleaning & Quality',
      icon: Filter,
      targetId: 'preprocessing',
      color: 'from-blue-600 to-indigo-600',
      badge: '12 Features'
    },
    {
      step: '03',
      title: 'Analytics',
      desc: 'Supply vs Loss',
      icon: BarChart2,
      targetId: 'find-loss',
      color: 'from-indigo-600 to-violet-600',
      badge: '5 DMA Zones'
    },
    {
      step: '04',
      title: 'ML Detection',
      desc: 'Anomaly Scoring',
      icon: BrainCircuit,
      targetId: 'ml-explanations',
      color: 'from-rose-500 to-pink-600',
      badge: 'Isolation Forest'
    },
    {
      step: '05',
      title: 'Evaluation',
      desc: '94.2% Accuracy',
      icon: CheckCircle2,
      targetId: 'ml-performance',
      color: 'from-emerald-500 to-teal-600',
      badge: '91.5% Recall'
    },
    {
      step: '06',
      title: 'Forecasting',
      desc: 'Demand Projections',
      icon: TrendingUp,
      targetId: 'forecast',
      color: 'from-teal-500 to-cyan-600',
      badge: '7-14 Days'
    },
    {
      step: '07',
      title: 'Recommendations',
      desc: 'Actions & Recovery',
      icon: Wrench,
      targetId: 'action-plan',
      color: 'from-amber-500 to-orange-600',
      badge: 'Work Orders'
    },
  ];

  return (
    <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm space-y-3" aria-label="End-to-End System Workflow">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-xl bg-sky-50 text-sky-600">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              End-to-End Big Data & Machine Learning Pipeline
            </h2>
            <p className="text-xs text-slate-500">
              Interactive architecture connecting data ingestion, preprocessing, ML detection, evaluation, and automated interventions.
            </p>
          </div>
        </div>

        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 w-fit">
          Click any stage to navigate
        </span>
      </div>

      {/* Horizontal Pipeline Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-1">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isLast = idx === stages.length - 1;

          return (
            <button
              key={stage.step}
              onClick={() => onStageClick(stage.targetId)}
              className="relative p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/80 hover:border-sky-300 transition-all text-left flex flex-col justify-between group hover:shadow-xs hover:scale-[1.02] active:scale-[0.98]"
            >
              {/* Top Step Number & Icon */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black font-mono text-slate-400 group-hover:text-sky-600 transition-colors">
                  {stage.step}
                </span>
                <div className={`p-1.5 rounded-xl bg-gradient-to-tr ${stage.color} text-white shadow-2xs group-hover:shadow-sm`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Title & Desc */}
              <div className="mt-2.5">
                <span className="text-xs font-bold text-slate-900 group-hover:text-sky-700 block truncate">
                  {stage.title}
                </span>
                <span className="text-[10px] text-slate-500 font-medium block truncate">
                  {stage.desc}
                </span>
              </div>

              {/* Pill Badge */}
              <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 truncate">
                  {stage.badge}
                </span>
                {!isLast && (
                  <ArrowRight className="w-3 h-3 text-slate-300 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all hidden lg:block" />
                )}
              </div>
            </button>
          );
        })}
      </div>

    </section>
  );
};
