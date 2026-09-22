import React, { useState } from 'react';
import { ZoneData } from '../types/water';
import { formatLiters, formatPercentage, formatPressure, getStatusBadge } from '../utils/formatters';
import { Search, ChevronRight, AlertCircle, CheckCircle2, SlidersHorizontal, ArrowUpDown, Droplets, Gauge } from 'lucide-react';

interface ZoneTableProps {
  zones: ZoneData[];
  onSelectZone: (zone: ZoneData) => void;
  selectedZoneId?: string;
}

export const ZoneTable: React.FC<ZoneTableProps> = ({
  zones,
  onSelectZone,
  selectedZoneId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'abnormal' | 'normal'>('all');
  const [sortBy, setSortBy] = useState<'loss' | 'lossPct' | 'name'>('loss');
  const [sortDesc, setSortDesc] = useState(true);

  // Filter & Sort
  const filteredZones = zones
    .filter((zone) => {
      const matchesSearch = zone.name.toLowerCase().includes(searchTerm.toLowerCase()) || zone.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' ? true : statusFilter === 'abnormal' ? (zone.status === 'abnormal' || zone.status === 'warning') : zone.status === 'normal';
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'loss') comparison = a.currentLoss - b.currentLoss;
      else if (sortBy === 'lossPct') comparison = a.lossPercentage - b.lossPercentage;
      else comparison = a.name.localeCompare(b.name);
      return sortDesc ? -comparison : comparison;
    });

  const toggleSort = (type: 'loss' | 'lossPct' | 'name') => {
    if (sortBy === type) {
      setSortDesc(!sortDesc);
    } else {
      setSortBy(type);
      setSortDesc(true);
    }
  };

  return (
    <section id="zone-section" className="space-y-4 my-8 scroll-mt-20" aria-label="Zone Water Loss Overview">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Zone-by-Zone Breakdown
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            🔎 Find the Water Loss
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Click on any zone to inspect root causes, pressure curves, and recommended actions.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search zones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent w-40 sm:w-52 shadow-xs"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
              }`}
            >
              All ({zones.length})
            </button>
            <button
              onClick={() => setStatusFilter('abnormal')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                statusFilter === 'abnormal' ? 'bg-rose-500 text-white shadow-xs' : 'hover:text-rose-600'
              }`}
            >
              <span>🔴 Abnormal</span>
            </button>
            <button
              onClick={() => setStatusFilter('normal')}
              className={`px-3 py-1 rounded-lg transition-all flex items-center gap-1 ${
                statusFilter === 'normal' ? 'bg-emerald-600 text-white shadow-xs' : 'hover:text-emerald-700'
              }`}
            >
              <span>🟢 Normal</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Zones Table */}
      <div className="overflow-hidden bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th 
                  className="py-3.5 px-4 sm:px-6 cursor-pointer hover:text-slate-900 select-none"
                  onClick={() => toggleSort('name')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Zone</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Supplied</th>
                <th className="py-3.5 px-4">Consumed</th>
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 select-none"
                  onClick={() => toggleSort('loss')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Lost</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3.5 px-4 cursor-pointer hover:text-slate-900 select-none"
                  onClick={() => toggleSort('lossPct')}
                >
                  <div className="flex items-center gap-1.5">
                    <span>Loss %</span>
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                </th>
                <th className="py-3.5 px-4">Pressure</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredZones.map((zone) => {
                const badge = getStatusBadge(zone.status);
                const isSelected = selectedZoneId === zone.id;
                const isHighLoss = zone.lossPercentage >= 30;
                const isModerateLoss = zone.lossPercentage >= 15 && zone.lossPercentage < 30;

                return (
                  <tr
                    key={zone.id}
                    onClick={() => onSelectZone(zone)}
                    className={`cursor-pointer transition-all duration-150 ${
                      isSelected
                        ? 'bg-sky-50/90 font-medium'
                        : isHighLoss
                        ? 'bg-rose-50/40 hover:bg-rose-50/80'
                        : isModerateLoss
                        ? 'bg-amber-50/30 hover:bg-amber-50/70'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    {/* Zone Name & Type */}
                    <td className="py-4 px-4 sm:px-6">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${badge.dotColor} ${isHighLoss ? 'animate-pulse' : ''}`} />
                        <div>
                          <span className="font-bold text-slate-900 hover:text-sky-600 flex items-center gap-1">
                            {zone.name}
                          </span>
                          <span className="text-[11px] text-slate-500 font-normal">
                            {zone.type} • {zone.populationServed.toLocaleString('en-IN')} pop
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Supplied */}
                    <td className="py-4 px-4 font-semibold text-slate-900">
                      {formatLiters(zone.currentSupply)}
                    </td>

                    {/* Consumed */}
                    <td className="py-4 px-4 font-semibold text-emerald-700">
                      {formatLiters(zone.currentConsumed)}
                    </td>

                    {/* Lost */}
                    <td className="py-4 px-4">
                      <span className={`font-bold ${
                        isHighLoss ? 'text-rose-600 text-base' : isModerateLoss ? 'text-amber-600' : 'text-slate-700'
                      }`}>
                        {formatLiters(zone.currentLoss)}
                      </span>
                    </td>

                    {/* Loss % */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-extrabold ${
                          isHighLoss ? 'text-rose-600' : isModerateLoss ? 'text-amber-600' : 'text-emerald-700'
                        }`}>
                          {formatPercentage(zone.lossPercentage)}
                        </span>
                        {/* Mini progress bar */}
                        <div className="w-12 h-1.5 rounded-full bg-slate-100 overflow-hidden hidden sm:block">
                          <div
                            className={`h-full rounded-full ${
                              isHighLoss ? 'bg-rose-500' : isModerateLoss ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${Math.min(100, zone.lossPercentage * 2.2)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Pressure */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                        <Gauge className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatPressure(zone.currentPressure)}</span>
                        {zone.currentPressure < zone.standardPressure * 0.7 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700 font-bold">
                            Low
                          </span>
                        )}
                        {zone.currentPressure > zone.standardPressure * 1.2 && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-700 font-bold">
                            High
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${badge.badgeClass}`}>
                        <span>{badge.iconEmoji}</span>
                        <span>{badge.label}</span>
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectZone(zone);
                        }}
                        className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                          isHighLoss
                            ? 'bg-rose-600 text-white border-rose-600 hover:bg-rose-700 shadow-xs'
                            : 'bg-white hover:bg-sky-50 text-sky-700 border-slate-200 hover:border-sky-300'
                        }`}
                      >
                        <span>Inspect</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer info */}
        <div className="bg-slate-50/80 px-4 sm:px-6 py-3 border-t border-slate-200 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-2">
          <span>Showing {filteredZones.length} of {zones.length} District Metered Areas</span>
          <span className="flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
            <span>Click any row to open the <strong>Zone Detail Diagnostics</strong></span>
          </span>
        </div>
      </div>

    </section>
  );
};
