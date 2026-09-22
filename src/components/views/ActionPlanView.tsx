import React from 'react';
import { ZoneData, MaintenanceTicket, AppPage } from '../../types/water';
import { ActionPlanner } from '../ActionPlanner';
import { TraceabilityMatrix } from '../TraceabilityMatrix';
import { ArrowLeft, Wrench, ShieldCheck, CheckCircle2, GitCommit } from 'lucide-react';

interface ActionPlanViewProps {
  tickets: MaintenanceTicket[];
  zones: ZoneData[];
  onNavigate: (page: AppPage) => void;
  onAddTicket: (ticket: MaintenanceTicket) => void;
  onUpdateTicketStatus: (id: string, newStatus: 'Open' | 'Dispatched' | 'In Progress' | 'Resolved') => void;
  onSelectZone: (zone: ZoneData) => void;
}

export const ActionPlanView: React.FC<ActionPlanViewProps> = ({
  tickets,
  zones,
  onNavigate,
  onAddTicket,
  onUpdateTicketStatus,
  onSelectZone,
}) => {
  const handleDispatchFromTrace = (zone: ZoneData, actionDescription: string, _category: string) => {
    const newTicket: MaintenanceTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      zoneId: zone.id,
      zoneName: zone.name,
      issueType: zone.currentPressure < 2.0 ? 'Acoustic Sounding Crew' : 'Smart Meter Calibration',
      priority: 'Urgent',
      status: 'Dispatched',
      assignedTeam: 'Emergency Response Squad',
      createdAt: 'Just now',
      estimatedWaterSavedLiters: Math.round(zone.currentLoss * 0.8),
      description: actionDescription
    };
    onAddTicket(newTicket);
  };

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
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1">
              <Wrench className="w-3.5 h-3.5" /> Maintenance Operations
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              🛠️ Action Plan & Maintenance Work Orders
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('find-loss')}
            className="px-3.5 py-1.5 text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Find Water Loss
          </button>
        </div>
      </div>

      {/* Action Planner Component */}
      <ActionPlanner
        tickets={tickets}
        zones={zones}
        onAddTicket={onAddTicket}
        onUpdateTicketStatus={onUpdateTicketStatus}
      />

      {/* Traceability Matrix */}
      <TraceabilityMatrix
        zones={zones}
        onSelectZone={(zone) => {
          onSelectZone(zone);
          onNavigate('ml-explanations');
        }}
        onDispatchAction={handleDispatchFromTrace}
      />

    </div>
  );
};
