import React, { useState } from 'react';
import {
  AlertOctagon,
  ShieldAlert,
  Send,
  CheckCircle2,
  Bell,
  MapPin,
  Clock,
  Radio,
  FileText,
  Users,
  Building,
  Sparkles,
  PhoneCall,
  CheckCheck
} from 'lucide-react';
import { EarlyWarningAlert, LocationWeather } from '../types';

interface EarlyWarningCenterProps {
  alerts: EarlyWarningAlert[];
  selectedLocation: LocationWeather;
  onGenerateEarlyWarning: (loc: LocationWeather) => void;
  onAcknowledgeAlert: (alertId: string) => void;
  onDispatchTeams: (alertId: string) => void;
  onViewLocationOnMap: (locId: string) => void;
}

export const EarlyWarningCenter: React.FC<EarlyWarningCenterProps> = ({
  alerts,
  selectedLocation,
  onGenerateEarlyWarning,
  onAcknowledgeAlert,
  onDispatchTeams,
  onViewLocationOnMap,
}) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity === 'ALL') return true;
    return alert.riskLevel === filterSeverity;
  });

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col space-y-6 p-5">
      {/* Header & Quick Generator Action */}
      <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-red-950/80 border border-red-800/80 text-red-400">
            <AlertOctagon className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
              Early Warning & Emergency Alert Center
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-red-500/20 text-red-400 border border-red-500/40">
                CAP Protocol Active
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Automated multi-agency alerting for District Disaster Management Authorities & NDRF Battalions
            </p>
          </div>
        </div>

        {/* Generate Early Warning Action */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onGenerateEarlyWarning(selectedLocation)}
            id="btn-generate-warning-main"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-red-950/60 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>GENERATE EARLY WARNING FOR {selectedLocation.name.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* Severity Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-semibold">Filter Severity:</span>
          <div className="flex items-center rounded-lg bg-slate-800/90 border border-slate-700 p-0.5">
            {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-3 py-1 rounded-md font-semibold text-xs transition-colors ${
                  filterSeverity === sev
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        <span className="text-xs text-slate-400 font-mono">
          Showing {filteredAlerts.length} Broadcasts
        </span>
      </div>

      {/* Alerts Grid */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.riskLevel === 'CRITICAL';
          const isHigh = alert.riskLevel === 'HIGH';

          return (
            <div
              key={alert.id}
              className={`p-5 rounded-2xl border transition-all shadow-xl ${
                isCritical
                  ? 'bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border-red-800/80 shadow-red-950/30'
                  : isHigh
                  ? 'bg-gradient-to-r from-orange-950/30 via-slate-900 to-slate-900 border-orange-800/70 shadow-orange-950/20'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow ${
                      isCritical ? 'bg-red-600 animate-pulse' : isHigh ? 'bg-orange-600' : 'bg-yellow-500 text-slate-950'
                    }`}
                  >
                    {isCritical ? '🔴' : isHigh ? '🟠' : '🟡'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display font-black text-base sm:text-lg text-white">
                        {alert.riskLevel} ALERT: {alert.locationName}
                      </h3>
                      <span className="text-xs text-slate-400 font-mono">({alert.district}, {alert.state})</span>
                      <span className="px-2 py-0.5 rounded font-mono text-[11px] font-bold bg-slate-800 border border-slate-700 text-cyan-300">
                        {alert.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mt-0.5">
                      <span className="flex items-center gap-1 text-slate-300">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" /> Issued: {alert.timestamp}
                      </span>
                      <span className="text-red-400 font-bold">
                        Window: {alert.expectedWindow}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right font-mono">
                    <div className="text-xl font-extrabold text-white">
                      {alert.probability}% Prob
                    </div>
                    <div className="text-[11px] text-cyan-300">{alert.rainfallIntensity} mm/h Rain</div>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono uppercase tracking-wider ${
                      alert.status === 'DISPATCHED'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                        : alert.status === 'ACKNOWLEDGED'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                        : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}
                  >
                    {alert.status}
                  </span>
                </div>
              </div>

              {/* Recommended Action Box */}
              <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs">
                <div className="font-bold text-amber-400 flex items-center gap-1.5 mb-1">
                  <ShieldAlert className="w-4 h-4" /> Recommended Civil Defence Action:
                </div>
                <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed">
                  {alert.recommendedAction}
                </p>
              </div>

              {/* Recipients & Agencies */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-1.5 text-slate-400">
                  <span className="font-semibold text-slate-300 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-cyan-400" /> Dispatched To:
                  </span>
                  {alert.recipients.map((rec, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300 font-mono"
                    >
                      {rec}
                    </span>
                  ))}
                </div>

                {/* Control Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  {alert.status === 'SENT' && (
                    <button
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Acknowledge</span>
                    </button>
                  )}

                  {alert.status !== 'DISPATCHED' && (
                    <button
                      onClick={() => onDispatchTeams(alert.id)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Dispatch Response Team</span>
                    </button>
                  )}

                  <button
                    onClick={() => onViewLocationOnMap(alert.locationId)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs flex items-center gap-1 border border-slate-700 transition-colors"
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Map</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
