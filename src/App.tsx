import React, { useState } from 'react';
import { ZoneData, MaintenanceTicket, WaterScenario, DiagnosticReason, AppPage } from './types/water';
import { defaultScenarios, defaultTickets } from './data/defaultData';
import { Navbar } from './components/Navbar';
import { AppNavigation } from './components/AppNavigation';
import { OverviewView } from './components/views/OverviewView';
import { FindLossView } from './components/views/FindLossView';
import { MlExplanationsView } from './components/views/MlExplanationsView';
import { CompareZonesView } from './components/views/CompareZonesView';
import { LossTimelineView } from './components/views/LossTimelineView';
import { DemandForecastView } from './components/views/DemandForecastView';
import { LiveNetworkView } from './components/views/LiveNetworkView';
import { ActionPlanView } from './components/views/ActionPlanView';
import { PreprocessingView } from './components/views/PreprocessingView';
import { MlPerformanceView } from './components/views/MlPerformanceView';
import { ZoneDetailModal } from './components/ZoneDetailModal';
import { SimulatorModal } from './components/SimulatorModal';
import { DataUploaderModal } from './components/DataUploaderModal';
import { Droplet } from 'lucide-react';

export const App: React.FC = () => {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<AppPage>('overview');

  // Active Scenario & Zones
  const [scenarios] = useState<WaterScenario[]>(defaultScenarios);
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(defaultScenarios[0].id);
  const [activeZones, setActiveZones] = useState<ZoneData[]>(defaultScenarios[0].zones);
  
  // Selected Zone for Drill-down / Focus
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
  const [focusedZoneId, setFocusedZoneId] = useState<string>('zone-b');

  // Maintenance Tickets
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(defaultTickets);

  // Modals & Tools
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Compute City Totals
  const totalSupplied = activeZones.reduce((acc, z) => acc + z.currentSupply, 0);
  const totalConsumed = activeZones.reduce((acc, z) => acc + z.currentConsumed, 0);
  const totalLoss = Math.max(0, totalSupplied - totalConsumed);
  const lossPercentage = totalSupplied > 0 ? (totalLoss / totalSupplied) * 100 : 0;

  // Counts
  const abnormalCount = activeZones.filter(z => z.status === 'abnormal').length;
  const openTicketsCount = tickets.filter(t => t.status !== 'Resolved').length;

  // Navigation Handler
  const handleNavigate = (page: AppPage) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Scenario Switch
  const handleSelectScenario = (scenarioId: string) => {
    setSelectedScenarioId(scenarioId);
    setIsSimulating(false);
    const matched = scenarios.find(s => s.id === scenarioId);
    if (matched) {
      setActiveZones(matched.zones);
      const topAbnormal = matched.zones.find(z => z.status === 'abnormal') || matched.zones[0];
      setFocusedZoneId(topAbnormal.id);
    }
  };

  // Handle Custom CSV Loaded
  const handleCustomDataLoaded = (newZones: ZoneData[]) => {
    setActiveZones(newZones);
    setIsSimulating(false);
    if (newZones.length > 0) {
      const topAbnormal = newZones.find(z => z.status === 'abnormal') || newZones[0];
      setFocusedZoneId(topAbnormal.id);
    }
  };

  // Handle Simulator Application
  const handleApplySimulation = (modifiedZones: ZoneData[]) => {
    setActiveZones(modifiedZones);
    setIsSimulating(true);
  };

  const handleResetSimulation = () => {
    handleSelectScenario(selectedScenarioId);
  };

  // Handle Adding / Resolving Tickets
  const handleAddTicket = (ticket: MaintenanceTicket) => {
    setTickets([ticket, ...tickets]);
  };

  const handleUpdateTicketStatus = (id: string, newStatus: 'Open' | 'Dispatched' | 'In Progress' | 'Resolved') => {
    setTickets(tickets.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const handleOpenTicketFromReason = (zone: ZoneData, reason: DiagnosticReason) => {
    let issueType: MaintenanceTicket['issueType'] = 'Pipeline Leakage Inspection';
    if (reason.category === 'leakage') issueType = 'Acoustic Sounding Crew';
    else if (reason.category === 'pressure') issueType = 'Pressure Regulator Check';
    else if (reason.category === 'meter') issueType = 'Smart Meter Calibration';
    else if (reason.category === 'distribution') issueType = 'Valve Maintenance';

    const newTicket: MaintenanceTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      zoneId: zone.id,
      zoneName: zone.name,
      issueType,
      priority: reason.confidence === 'High' ? 'Urgent' : 'High',
      status: 'Dispatched',
      assignedTeam: 'Field Response Unit Alpha',
      createdAt: 'Just now',
      estimatedWaterSavedLiters: Math.round(zone.currentLoss * 0.75),
      description: `${reason.title}: ${reason.suggestedAction}`
    };

    handleAddTicket(newTicket);
    handleNavigate('action-plan');
  };

  const handleDispatchQuickTicket = (zone: ZoneData) => {
    const newTicket: MaintenanceTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      zoneId: zone.id,
      zoneName: zone.name,
      issueType: zone.currentPressure < 2.0 ? 'Acoustic Sounding Crew' : 'Pressure Regulator Check',
      priority: 'Urgent',
      status: 'Dispatched',
      assignedTeam: 'Rapid Response Unit 1',
      createdAt: 'Just now',
      estimatedWaterSavedLiters: Math.round(zone.currentLoss * 0.8),
      description: `Emergency crew dispatched to inspect ${zone.name} mainline following ${zone.lossPercentage}% loss alert.`
    };
    handleAddTicket(newTicket);
    handleNavigate('action-plan');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-sky-500 selection:text-white">
      
      {/* Top Header Navbar */}
      <Navbar
        scenarios={scenarios}
        selectedScenarioId={selectedScenarioId}
        onSelectScenario={handleSelectScenario}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onReset={() => handleSelectScenario(defaultScenarios[0].id)}
        isSimulating={isSimulating}
        onNavigate={handleNavigate}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex-1 w-full space-y-6">
        
        {/* Simulation Alert Banner */}
        {isSimulating && (
          <div className="bg-amber-500 text-slate-950 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-between shadow-md animate-pulse">
            <span className="flex items-center gap-2">
              <span>⚡</span>
              <span><strong>Active What-If Simulation:</strong> Telemetry reflects hypothetical leak repairs and pressure optimizations.</span>
            </span>
            <button
              onClick={handleResetSimulation}
              className="bg-slate-950 text-white px-3 py-1 rounded-xl text-xs font-semibold hover:bg-slate-800"
            >
              Reset to Live Data
            </button>
          </div>
        )}

        {/* Dedicated Navigation Bar with Active Tabs */}
        <AppNavigation
          currentPage={currentPage}
          onNavigate={handleNavigate}
          abnormalCount={abnormalCount}
          openTicketsCount={openTicketsCount}
        />

        {/* 1. Dashboard Overview Page */}
        {currentPage === 'overview' && (
          <OverviewView
            totalSupplied={totalSupplied}
            totalConsumed={totalConsumed}
            totalLoss={totalLoss}
            lossPercentage={lossPercentage}
            zones={activeZones}
            onNavigate={handleNavigate}
            onSelectZone={(zone) => {
              setSelectedZone(zone);
              setFocusedZoneId(zone.id);
            }}
          />
        )}

        {/* 2. Find Water Loss Page */}
        {currentPage === 'find-loss' && (
          <FindLossView
            zones={activeZones}
            onNavigate={handleNavigate}
            onSelectZone={(zone) => {
              setSelectedZone(zone);
              setFocusedZoneId(zone.id);
            }}
            selectedZoneId={focusedZoneId}
            onOpenTicket={(zone) => {
              setSelectedZone(zone);
            }}
          />
        )}

        {/* 3. Why Is This Happening? / ML Explanations Page */}
        {currentPage === 'ml-explanations' && (
          <MlExplanationsView
            zones={activeZones}
            onNavigate={handleNavigate}
            selectedZoneId={focusedZoneId}
            onSelectZone={(zone) => setFocusedZoneId(zone.id)}
            onOpenTicketForReason={handleOpenTicketFromReason}
          />
        )}

        {/* 4. Compare Zones Page */}
        {currentPage === 'compare-zones' && (
          <CompareZonesView
            zones={activeZones}
            onNavigate={handleNavigate}
            selectedZoneId={focusedZoneId}
            onSelectZone={(zone) => {
              setFocusedZoneId(zone.id);
              setSelectedZone(zone);
            }}
          />
        )}

        {/* 5. Water Loss Over Time Page */}
        {currentPage === 'loss-timeline' && (
          <LossTimelineView
            zones={activeZones}
            onNavigate={handleNavigate}
            selectedZoneId={focusedZoneId}
            onSelectZone={(zone) => setFocusedZoneId(zone.id)}
          />
        )}

        {/* 6. Demand Forecast Page */}
        {currentPage === 'forecast' && (
          <DemandForecastView
            zones={activeZones}
            onNavigate={handleNavigate}
          />
        )}

        {/* 7. Live Water Network Page */}
        {currentPage === 'network' && (
          <LiveNetworkView
            zones={activeZones}
            onNavigate={handleNavigate}
            selectedZoneId={focusedZoneId}
            onSelectZone={(zone) => {
              setFocusedZoneId(zone.id);
              setSelectedZone(zone);
            }}
            onDispatchTicket={handleDispatchQuickTicket}
          />
        )}

        {/* 8. Action Plan Page */}
        {currentPage === 'action-plan' && (
          <ActionPlanView
            tickets={tickets}
            zones={activeZones}
            onNavigate={handleNavigate}
            onAddTicket={handleAddTicket}
            onUpdateTicketStatus={handleUpdateTicketStatus}
            onSelectZone={(zone) => setFocusedZoneId(zone.id)}
          />
        )}

        {/* 9. Data Preprocessing Page */}
        {currentPage === 'preprocessing' && (
          <PreprocessingView
            onNavigate={handleNavigate}
          />
        )}

        {/* 10. ML Model Performance Page */}
        {currentPage === 'ml-performance' && (
          <MlPerformanceView
            onNavigate={handleNavigate}
          />
        )}

      </main>

      {/* Zone Detail Modal (Can be opened from any view if needed) */}
      <ZoneDetailModal
        zone={selectedZone}
        onClose={() => setSelectedZone(null)}
        onOpenTicket={(zone) => {
          handleOpenTicketFromReason(zone, {
            id: `diag-${zone.id}`,
            title: 'General Zone Inspection',
            icon: 'Wrench',
            category: 'leakage',
            confidence: 'High',
            evidence: `Loss percentage is ${zone.lossPercentage}%.`,
            suggestedAction: 'Deploy leak detection team to inspect local mains.',
            zoneId: zone.id,
            zoneName: zone.name
          });
        }}
      />

      {/* What-If Simulator Modal */}
      <SimulatorModal
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        zones={activeZones}
        onApplySimulation={handleApplySimulation}
        onResetSimulation={handleResetSimulation}
        isSimulating={isSimulating}
      />

      {/* Custom CSV Uploader Modal */}
      <DataUploaderModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onDataLoaded={handleCustomDataLoaded}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-8 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex items-center justify-center gap-2 font-bold text-slate-800 text-sm">
            <Droplet className="w-4 h-4 text-sky-600 fill-sky-600" />
            <span>Smart WaterGuard</span>
            <span>•</span>
            <span className="font-normal text-slate-500">“Know your water. Find the loss. Save the future.”</span>
          </div>
          <p className="text-slate-400">
            End-to-End Big Data Analytics & Machine Learning Solution for Water Distribution, Waste & Leakage Detection.
          </p>
        </div>
      </footer>

    </div>
  );
};
