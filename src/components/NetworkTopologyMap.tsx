import React from 'react';
import { ZoneData, NetworkNode, NetworkPipe } from '../types/water';
import { defaultNetworkNodes, defaultNetworkPipes } from '../data/defaultData';
import { formatLiters, formatPressure } from '../utils/formatters';
import { MapPin, Activity, Droplets, Waves, Gauge, AlertTriangle, Layers, Info } from 'lucide-react';

interface NetworkTopologyMapProps {
  zones: ZoneData[];
  onSelectZone: (zone: ZoneData) => void;
  selectedZoneId?: string;
}

export const NetworkTopologyMap: React.FC<NetworkTopologyMapProps> = ({
  zones,
  onSelectZone,
  selectedZoneId,
}) => {
  const nodes = defaultNetworkNodes;
  const pipes = defaultNetworkPipes;

  return (
    <section id="network-section" className="space-y-4 my-8 scroll-mt-20" aria-label="Smart City Water Network Grid">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Smart City Grid Topology
          </span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            🗺️ Live Water Network & Feeder Map
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Visual topology map illustrating water flow from the central reservoir through booster pumps to each zone.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Normal Flow
          </span>
          <span className="flex items-center gap-1.5 text-amber-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Warning
          </span>
          <span className="flex items-center gap-1.5 text-rose-700 font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span> Anomaly / Rupture
          </span>
        </div>
      </div>

      {/* SVG Map Container */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl overflow-hidden relative">
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

        <div className="relative z-10 w-full overflow-x-auto">
          <svg viewBox="0 0 700 400" className="w-full min-w-[640px] h-[340px] select-none">
            
            {/* Draw Pipes / Connections */}
            {pipes.map((pipe) => {
              const fromNode = nodes.find(n => n.id === pipe.from);
              const toNode = nodes.find(n => n.id === pipe.to);
              if (!fromNode || !toNode) return null;

              const isFlagged = pipe.status === 'abnormal';
              const isWarning = pipe.status === 'warning';
              const strokeColor = isFlagged ? '#f43f5e' : isWarning ? '#f59e0b' : '#38bdf8';

              return (
                <g key={pipe.id}>
                  {/* Glow under pipe */}
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={strokeColor}
                    strokeWidth={isFlagged ? 6 : 4}
                    strokeOpacity={0.3}
                  />
                  {/* Pipe Main Line */}
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke={strokeColor}
                    strokeWidth={isFlagged ? 3 : 2}
                    strokeDasharray={isFlagged ? "6,4" : undefined}
                    className={isFlagged ? "animate-pulse" : ""}
                  />
                  {/* Midpoint flow badge */}
                  <circle
                    cx={(fromNode.x + toNode.x) / 2}
                    cy={(fromNode.y + toNode.y) / 2}
                    r={5}
                    fill={strokeColor}
                  />
                </g>
              );
            })}

            {/* Draw Nodes */}
            {nodes.map((node) => {
              const matchedZone = zones.find(z => z.id === node.zoneId);
              const nodeStatus = matchedZone ? matchedZone.status : node.status;
              const isSelected = matchedZone && selectedZoneId === matchedZone.id;
              const isAbnormal = nodeStatus === 'abnormal';
              const isWarning = nodeStatus === 'warning';

              const ringColor = isAbnormal ? '#f43f5e' : isWarning ? '#f59e0b' : '#10b981';
              const bgColor = isAbnormal ? '#881337' : isWarning ? '#78350f' : '#064e3b';

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className={matchedZone ? "cursor-pointer group" : ""}
                  onClick={() => {
                    if (matchedZone) onSelectZone(matchedZone);
                  }}
                >
                  {/* Ping Animation for Abnormal Nodes */}
                  {isAbnormal && (
                    <circle r={28} fill="none" stroke="#f43f5e" strokeWidth={2} opacity={0.6} className="animate-ping" />
                  )}

                  {/* Outer ring */}
                  <circle
                    r={isSelected ? 24 : 20}
                    fill={bgColor}
                    stroke={ringColor}
                    strokeWidth={isSelected ? 4 : 2}
                    className="transition-all duration-200"
                  />

                  {/* Icon label inside circle */}
                  <text
                    textAnchor="middle"
                    dy="4"
                    fontSize={node.type === 'reservoir' ? "14" : "12"}
                    fill="#ffffff"
                    fontWeight="bold"
                  >
                    {node.type === 'reservoir' ? '💧' : node.type === 'booster_pump' ? '⚡' : '📍'}
                  </text>

                  {/* Node Label Text */}
                  <text
                    x={0}
                    y={34}
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="11"
                    fontWeight="bold"
                    className="drop-shadow-md"
                  >
                    {node.label}
                  </text>

                  {/* Metrics subtext */}
                  {matchedZone ? (
                    <text
                      x={0}
                      y={48}
                      textAnchor="middle"
                      fill={isAbnormal ? '#fca5a5' : '#94a3b8'}
                      fontSize="9.5"
                      fontWeight="600"
                    >
                      {matchedZone.lossPercentage}% Loss ({formatPressure(matchedZone.currentPressure)})
                    </text>
                  ) : node.pressure ? (
                    <text
                      x={0}
                      y={48}
                      textAnchor="middle"
                      fill="#7dd3fc"
                      fontSize="9.5"
                      fontWeight="600"
                    >
                      {formatPressure(node.pressure)}
                    </text>
                  ) : null}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bottom Legend / Explanatory Footer */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-sky-400" />
            <span>Interactive: Click any zone node above to open its deep telemetry breakdown.</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span><strong>Reservoir:</strong> 100k L/day capacity</span>
            <span><strong>Booster Pump:</strong> 4.8 Bar output</span>
            <span><strong>Feeder Mains:</strong> 5 Active DMA Sectors</span>
          </div>
        </div>

      </div>

    </section>
  );
};
