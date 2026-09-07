import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  CloudRain,
  Droplets,
  Gauge,
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { LocationWeather } from '../types';

interface TrendChartsProps {
  location: LocationWeather;
}

export const TrendCharts: React.FC<TrendChartsProps> = ({ location }) => {
  const [activeMetric, setActiveMetric] = useState<'ALL' | 'PROBABILITY' | 'RAINFALL' | 'PRESSURE' | 'HUMIDITY'>('ALL');

  const trendData = location.weatherTrend;

  // Custom tooltip for dark theme
  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl text-xs font-mono">
          <div className="text-slate-300 font-bold mb-1.5 pb-1 border-b border-slate-800">
            Time: {label} IST ({location.name})
          </div>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-bold text-white">
                {entry.value} {entry.name === 'Cloudburst Probability' ? '%' : entry.name === 'Rainfall Intensity' ? 'mm/h' : entry.name === 'Humidity' ? '%' : 'hPa'}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-white flex items-center gap-2">
              Weather Trend & Escalation Curves
              <span className="text-xs text-slate-400 font-normal">
                ({location.name}, {location.state})
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Temporal evolution leading to Cloudburst Trigger Thresholds over the past 6 hours
            </p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center rounded-lg bg-slate-800/90 border border-slate-700 p-0.5 text-xs font-semibold">
          {[
            { id: 'ALL', label: 'All 4 Metrics' },
            { id: 'PROBABILITY', label: 'Probability Escalation' },
            { id: 'RAINFALL', label: 'Rainfall Spike' },
            { id: 'PRESSURE', label: 'Pressure Drop' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMetric(tab.id as typeof activeMetric)}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                activeMetric === tab.id
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Big Chart: Cloudburst Probability Escalation */}
      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-mono font-bold text-slate-200">
                Cloudburst Probability Surge: 25% → 39% → 51% → 68% → 79% → 87%
              </span>
            </div>
            <span className="text-[11px] font-mono text-red-400 font-bold bg-red-950/40 px-2 py-0.5 rounded border border-red-800/50">
              CRITICAL ESCALATION
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="probGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 120]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  formatter={(val) => <span className="text-slate-300 font-mono">{val}</span>}
                />
                <Area
                  type="monotone"
                  dataKey="probability"
                  name="Cloudburst Probability"
                  stroke="#ef4444"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#probGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="rainfall"
                  name="Rainfall Intensity"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#rainGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side: Pressure & Humidity Sub-Charts */}
        <div className="lg:col-span-4 flex flex-col gap-4 justify-between">
          {/* Pressure Drop Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 flex-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5" /> Barometric Pressure
              </span>
              <span className="text-[11px] font-mono text-red-400 font-bold">1014 → 1004 hPa (-10)</span>
            </div>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={9} hide />
                  <YAxis stroke="#64748b" fontSize={9} domain={[1000, 1020]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="pressure"
                    name="Atmospheric Pressure"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    dot={{ fill: '#f59e0b', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Humidity Surge Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 flex-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-blue-400 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5" /> Relative Humidity
              </span>
              <span className="text-[11px] font-mono text-cyan-300 font-bold">71% → 94% (+23%)</span>
            </div>
            <div className="h-24 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#1e293b" />
                  <XAxis dataKey="time" stroke="#64748b" fontSize={9} hide />
                  <YAxis stroke="#64748b" fontSize={9} domain={[50, 100]} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="humidity"
                    name="Humidity"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: '#3b82f6', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
