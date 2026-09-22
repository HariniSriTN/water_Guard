import React, { useState } from 'react';
import { MaintenanceTicket, ZoneData } from '../types/water';
import { formatLiters } from '../utils/formatters';
import { Wrench, Plus, CheckCircle2, Clock, ShieldAlert, ArrowRight, Sparkles, UserCheck, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ActionPlannerProps {
  tickets: MaintenanceTicket[];
  zones: ZoneData[];
  onAddTicket: (ticket: MaintenanceTicket) => void;
  onUpdateTicketStatus: (id: string, newStatus: 'Open' | 'Dispatched' | 'In Progress' | 'Resolved') => void;
}

export const ActionPlanner: React.FC<ActionPlannerProps> = ({
  tickets,
  zones,
  onAddTicket,
  onUpdateTicketStatus,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState(zones[0]?.id || 'zone-b');
  const [issueType, setIssueType] = useState<MaintenanceTicket['issueType']>('Acoustic Sounding Crew');
  const [priority, setPriority] = useState<MaintenanceTicket['priority']>('Urgent');
  const [team, setTeam] = useState('Emergency Leak Detection Unit');
  const [description, setDescription] = useState('Inspect acoustic noise loggers and pinpoint distribution main anomaly.');

  const totalSavedSoFar = tickets
    .filter(t => t.status === 'Resolved')
    .reduce((acc, t) => acc + t.estimatedWaterSavedLiters, 0);

  const potentialSavings = tickets
    .filter(t => t.status !== 'Resolved')
    .reduce((acc, t) => acc + t.estimatedWaterSavedLiters, 0);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const zone = zones.find(z => z.id === selectedZoneId) || zones[0];
    
    const newTicket: MaintenanceTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      zoneId: zone.id,
      zoneName: zone.name,
      issueType,
      priority,
      status: 'Dispatched',
      assignedTeam: team,
      createdAt: 'Just now',
      estimatedWaterSavedLiters: Math.round(zone.currentLoss * 0.75),
      description
    };

    onAddTicket(newTicket);
    setIsCreating(false);
  };

  const handleResolve = (ticketId: string) => {
    onUpdateTicketStatus(ticketId, 'Resolved');
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 }
    });
  };

  return (
    <section id="actions-section" className="space-y-4 my-8 scroll-mt-20" aria-label="Maintenance Action Planner">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
            <Wrench className="w-3.5 h-3.5" /> Actionable Interventions
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            🛠️ What should be done to reduce the loss?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Convert data findings into dispatched maintenance work orders and track water saved.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-sm transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Dispatch New Work Order</span>
        </button>
      </div>

      {/* Top Impact Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Water Saved (Resolved Actions)
            </span>
            <div className="text-2xl font-black text-emerald-800 mt-1">
              {formatLiters(totalSavedSoFar)}
            </div>
          </div>
          <span className="text-3xl">🎉</span>
        </div>

        <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-sky-600" /> Potential Water Recovery
            </span>
            <div className="text-2xl font-black text-sky-900 mt-1">
              {formatLiters(potentialSavings)}
            </div>
          </div>
          <span className="text-3xl">🎯</span>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-sky-600" /> Dispatch Maintenance Order
              </h3>
              <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-700 text-lg">✕</button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Zone</label>
                <select
                  value={selectedZoneId}
                  onChange={(e) => setSelectedZoneId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                >
                  {zones.map(z => (
                    <option key={z.id} value={z.id}>
                      {z.name} (Loss: {formatLiters(z.currentLoss)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Intervention Type</label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="Acoustic Sounding Crew">Acoustic Sounding Crew</option>
                    <option value="Pipeline Leakage Inspection">Pipeline Leakage Inspection</option>
                    <option value="Pressure Regulator Check">Pressure Regulator Check</option>
                    <option value="Smart Meter Calibration">Smart Meter Calibration</option>
                    <option value="Valve Maintenance">Valve Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white font-medium"
                  >
                    <option value="Urgent">🔴 Urgent</option>
                    <option value="High">🟠 High</option>
                    <option value="Medium">🟡 Medium</option>
                    <option value="Low">🟢 Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Field Unit</label>
                <input
                  type="text"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white"
                  placeholder="e.g. Field Response Unit Alpha"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Scope & Instructions</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-white resize-none"
                  placeholder="Describe specific junctions or sensor alerts..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20"
                >
                  Confirm & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tickets List */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
        {tickets.length === 0 ? (
          <div className="p-8 text-center text-slate-500 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="font-bold text-slate-800">No Active Maintenance Tickets</p>
            <p className="text-xs">All district networks are operating without open work orders.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tickets.map((ticket) => {
              const isResolved = ticket.status === 'Resolved';
              const isUrgent = ticket.priority === 'Urgent';

              return (
                <div
                  key={ticket.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isResolved
                      ? 'bg-slate-50 border-slate-200 opacity-75'
                      : isUrgent
                      ? 'bg-rose-50/40 border-rose-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  {/* Left Ticket Info */}
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        {ticket.id}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        ticket.priority === 'Urgent' ? 'bg-rose-100 text-rose-800' :
                        ticket.priority === 'High' ? 'bg-amber-100 text-amber-800' :
                        'bg-sky-100 text-sky-800'
                      }`}>
                        {ticket.priority} Priority
                      </span>
                      <span className="text-xs font-bold text-slate-900">
                        {ticket.issueType}
                      </span>
                      <span className="text-xs text-slate-500">
                        • {ticket.zoneName}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 font-medium">
                      {ticket.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                        <span>{ticket.assignedTeam}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Created {ticket.createdAt}</span>
                      </span>
                      <span className="text-emerald-700 font-bold">
                        Target Saved: {formatLiters(ticket.estimatedWaterSavedLiters)}
                      </span>
                    </div>
                  </div>

                  {/* Right Status / Action Controls */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                      ticket.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : ticket.status === 'In Progress'
                        ? 'bg-sky-100 text-sky-800 border-sky-200'
                        : ticket.status === 'Dispatched'
                        ? 'bg-amber-100 text-amber-800 border-amber-200'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {ticket.status}
                    </span>

                    {!isResolved ? (
                      <button
                        onClick={() => handleResolve(ticket.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-xs transition-all"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Resolved</span>
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Completed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </section>
  );
};
