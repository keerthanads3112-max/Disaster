import React from 'react';
import {
  MapPin,
  Radio,
  Satellite,
  Radar,
  AlertTriangle,
  Flame,
  ShieldAlert,
  Activity,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { LocationWeather, EarlyWarningAlert } from '../types';

interface KPICardsProps {
  locations: LocationWeather[];
  alerts: EarlyWarningAlert[];
  onSelectHighRisk: () => void;
}

export const KPICards: React.FC<KPICardsProps> = ({
  locations,
  alerts,
  onSelectHighRisk,
}) => {
  // Compute dynamic KPI metrics
  const maxRiskLocation = locations.reduce((prev, current) =>
    prev.cloudburstProbability > current.cloudburstProbability ? prev : current
  );

  const criticalCount = locations.filter((l) => l.riskLevel === 'CRITICAL').length;
  const highCount = locations.filter((l) => l.riskLevel === 'HIGH').length;
  const activeAlertsCount = alerts.filter((a) => a.status !== 'RESOLVED').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Locations Monitored & Ground Stations */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-lg shadow-black/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Current Monitoring
          </span>
          <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/50 text-cyan-400">
            <MapPin className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-2xl lg:text-3xl font-extrabold text-white">
            128
          </span>
          <span className="text-xs text-slate-400 font-mono">Himalayan & Coastal Zones</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <Radio className="w-3 h-3 text-emerald-400" />
            42 AWS Stations
          </span>
          <span>100% Online</span>
        </div>
      </div>

      {/* 2. Multi-Source Feeds (Satellite & Radar) */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all shadow-lg shadow-black/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Telemetry Ingestion
          </span>
          <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-800/50 text-blue-400">
            <Satellite className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-2xl lg:text-3xl font-extrabold text-white">
            8 Feeds
          </span>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Synchronized
          </span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-cyan-300">
            <Satellite className="w-3 h-3 text-cyan-400" /> 3 Satellite (INSAT-3DR)
          </span>
          <span className="flex items-center gap-1 text-indigo-300">
            <Radar className="w-3 h-3 text-indigo-400" /> 5 DWR Doppler
          </span>
        </div>
      </div>

      {/* 3. Highest Risk Zone & Probability */}
      <div
        onClick={onSelectHighRisk}
        className="p-4 rounded-xl bg-gradient-to-br from-red-950/40 to-slate-900/90 border border-red-800/60 hover:border-red-500 transition-all shadow-lg shadow-red-950/30 cursor-pointer group"
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-red-400 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            Highest Risk Zone
          </span>
          <div className="p-2 rounded-lg bg-red-900/40 border border-red-700/60 text-red-400 group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <div>
            <div className="font-display text-xl lg:text-2xl font-extrabold text-white group-hover:text-red-300 transition-colors">
              {maxRiskLocation.name}
            </div>
            <div className="text-[11px] text-slate-400 font-mono">{maxRiskLocation.state}</div>
          </div>
          <div className="text-right">
            <div className="font-display text-2xl lg:text-3xl font-extrabold text-red-500 font-mono animate-pulse">
              {maxRiskLocation.cloudburstProbability}%
            </div>
            <div className="text-[10px] text-red-400 font-bold uppercase tracking-wider">
              {maxRiskLocation.riskLevel}
            </div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-red-900/40 flex items-center justify-between text-xs font-mono text-slate-300">
          <span>Rain: {maxRiskLocation.rainfallIntensity} mm/h</span>
          <span className="text-red-400 underline">Investigate →</span>
        </div>
      </div>

      {/* 4. Active Warnings & Critical Zones */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-orange-500/40 transition-all shadow-lg shadow-black/20">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Emergency Alerts
          </span>
          <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-800/50 text-amber-400">
            <ShieldAlert className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-display text-2xl lg:text-3xl font-extrabold text-amber-400 font-mono">
            {activeAlertsCount}
          </span>
          <span className="text-xs text-slate-400 font-mono">Active Broadcasts</span>
        </div>
        <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
          <span className="text-red-400 font-bold">
            {criticalCount} Critical Zones
          </span>
          <span className="text-orange-400">
            {highCount} High Risk
          </span>
        </div>
      </div>
    </div>
  );
};
