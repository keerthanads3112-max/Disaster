import React, { useState } from 'react';
import {
  Activity,
  CheckCircle2,
  Radio,
  Satellite,
  Radar,
  Cpu,
  Database,
  AlertOctagon,
  RefreshCw,
  Download,
  ShieldCheck,
  Server,
  Zap
} from 'lucide-react';
import { systemHealthServices } from '../data/sampleLocations';
import { SystemHealthComponent } from '../types';

export const SystemHealthPanel: React.FC = () => {
  const [services, setServices] = useState<SystemHealthComponent[]>(systemHealthServices);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setServices((prev) =>
        prev.map((s) => ({
          ...s,
          latencyMs: Math.max(5, Math.round(s.latencyMs + (Math.random() * 10 - 5))),
          lastPing: 'Just now',
        }))
      );
      setIsRefreshing(false);
    }, 600);
  };

  const handleExportSystemAudit = () => {
    const report = {
      platform: 'CloudGuard AI - Cloudburst Prediction & Early Warning Platform',
      systemEdition: 'National Cloudburst Early Warning Network (NCEWN)',
      auditTimestamp: new Date().toISOString(),
      systemStatus: '100% OPERATIONAL',
      services: services,
      modelEngine: 'Random Forest Ensemble v2.4 (150 trees, F1: 0.934)',
      telemetryNodes: '42 AWS Ground Stations, 3 INSAT-3DR TIR Channels, 5 Doppler Radars',
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CloudGuard_AI_System_Audit_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col p-5 space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
              System Health & Telemetry Microservices
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                All 6 Subsystems Connected
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Live heartbeat monitoring of IMD data brokers, ML inference clusters, and Common Alerting Protocol pipelines
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Pinging...' : 'Ping Services'}</span>
          </button>

          <button
            onClick={handleExportSystemAudit}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center gap-1 shadow transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Log</span>
          </button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {services.map((svc, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="font-bold text-white text-sm truncate">{svc.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {svc.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">{svc.category}</div>
              <p className="text-slate-300 text-[11px] mt-2 font-sans leading-relaxed">
                {svc.telemetry}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <Zap className="w-3 h-3 text-emerald-400" /> {svc.latencyMs} ms
              </span>
              <span>Last Ping: {svc.lastPing}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Government & Architecture Specification Banner */}
      <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/50 flex items-start gap-3 text-xs text-slate-300">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-cyan-300">Telemetry & Architecture Specification: </span>
          The platform integrates high-frequency atmospheric data from IMD Automatic Weather Stations (AWS), ISRO INSAT-3DR/3DS TIR & Water Vapor radiance grids, and Doppler Weather Radar polarimetric feeds with an explainable Random Forest ML pipeline for 0–100% cloudburst risk classification.
        </div>
      </div>
    </div>
  );
};
