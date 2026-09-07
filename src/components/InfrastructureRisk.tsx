import React from 'react';
import {
  Building2,
  Route,
  Zap,
  HeartPulse,
  GraduationCap,
  Radio,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Flame
} from 'lucide-react';
import { LocationWeather } from '../types';

interface InfrastructureRiskProps {
  location: LocationWeather;
  onSelectLocation: (loc: LocationWeather) => void;
}

export const InfrastructureRisk: React.FC<InfrastructureRiskProps> = ({
  location,
  onSelectLocation,
}) => {
  const infra = location.infrastructure;

  const infraCards = [
    { name: 'Roads & Highways', count: infra.roadsAtRisk, icon: Route, color: 'text-amber-400', desc: 'Prone to rockfalls & culvert washouts' },
    { name: 'Bridges & Culverts', count: infra.bridgesAtRisk, icon: Building2, color: 'text-red-400', desc: 'Hydraulic scour & debris impact risk' },
    { name: 'Power Substations', count: infra.powerInfrastructure, icon: Zap, color: 'text-yellow-400', desc: 'High voltage grid submergence risk' },
    { name: 'Hospitals & Trauma Centers', count: infra.hospitals, icon: HeartPulse, color: 'text-rose-400', desc: 'Emergency backup generator preparedness' },
    { name: 'Schools & Relief Shelters', count: infra.schools, icon: GraduationCap, color: 'text-blue-400', desc: 'Evacuee staging & shelter capacity' },
    { name: 'Telecom & Radar Towers', count: infra.telecomTowers, icon: Radio, color: 'text-purple-400', desc: 'Emergency VHF / satellite link continuity' },
  ];

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col p-5 space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-orange-950/80 border border-orange-800/80 text-orange-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
              Critical Infrastructure Vulnerability Assessment
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-orange-500/20 text-orange-400 border border-orange-500/40">
                {location.name} Zone ({location.district})
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Downstream catchment exposure analysis for lifeline roads, power grids, and disaster relief assets
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-xs">
          <div className="text-slate-400">Threat Classification</div>
          <div className={`font-bold ${
            location.riskLevel === 'CRITICAL' ? 'text-red-400' : 'text-orange-400'
          }`}>
            {location.riskLevel} ({location.cloudburstProbability}% Probability)
          </div>
        </div>
      </div>

      {/* 6 Infrastructure Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {infraCards.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">{item.name}</span>
                  <div className={`p-1.5 rounded-lg bg-slate-900 border border-slate-800 ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-3xl font-black text-white font-mono">
                    {item.count}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Assets in Hazard Zone</span>
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 leading-tight">
                {item.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* High-Value Key Assets at Risk */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Key Lifeline Assets Identified in {location.name} Hazard Polygon
          </span>
          <span className="text-red-400 font-bold">{infra.keyAssets.length} Critical Targets</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          {infra.keyAssets.map((asset, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-200"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="font-semibold">{asset}</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-950/60 text-red-400 border border-red-800/50">
                EVACUATION ZONE
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
