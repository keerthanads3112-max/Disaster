import React, { useState } from 'react';
import {
  Shield,
  PhoneCall,
  Users,
  Send,
  CheckCircle2,
  AlertTriangle,
  Building,
  Radio,
  FileSpreadsheet,
  Clock,
  MapPin,
  Flame,
  Truck,
  LifeBuoy
} from 'lucide-react';
import { EarlyWarningAlert, LocationWeather } from '../types';

interface AuthorityControlCenterProps {
  alerts: EarlyWarningAlert[];
  locations: LocationWeather[];
  onAcknowledge: (id: string) => void;
  onDispatch: (id: string) => void;
  onViewMap: (locId: string) => void;
}

export const AuthorityControlCenter: React.FC<AuthorityControlCenterProps> = ({
  alerts,
  locations,
  onAcknowledge,
  onDispatch,
  onViewMap,
}) => {
  const [activeTab, setActiveTab] = useState<'ACTIVE_WAR_ROOM' | 'RESOURCES' | 'CONTACTS'>('ACTIVE_WAR_ROOM');

  // Emergency contact list for disaster management
  const emergencyContacts = [
    { agency: 'State Emergency Operation Centre (SEOC Uttarakhand)', phone: '1070 / 0135-2710334', officer: 'Duty Officer Verma', status: 'ON DUTY' },
    { agency: 'NDRF 8th Battalion (Uttarakhand & HP Region)', phone: '0120-2766013 / 9412345678', officer: 'Commandant R. S. Negi', status: 'MOBILIZED' },
    { agency: 'SDRF Uttarakhand Quick Reaction HQ', phone: '0135-2410100', officer: 'Inspector Chauhan', status: 'ACTIVE' },
    { agency: 'District Disaster Management Authority (DDMA Uttarkashi)', phone: '01374-222722', officer: 'District Magistrate / DEOC', status: 'HIGH ALERT' },
    { agency: 'Chamoli DEOC Emergency Line', phone: '01372-251437', officer: 'SDM Joshimath', status: 'HIGH ALERT' },
    { agency: 'Air Force Station Sarsawa (Helicopter SAR Unit)', phone: '0132-2451000', officer: 'Wing Commander Anand', status: 'STANDBY' },
  ];

  const resources = [
    { name: 'NDRF Rescue Teams', deployed: 4, standby: 8, total: 12, icon: Users },
    { name: 'Inflatable Motor Boats (Gemini)', deployed: 14, standby: 22, total: 36, icon: LifeBuoy },
    { name: 'Heavy Excavators & Earthmovers', deployed: 8, standby: 15, total: 23, icon: Truck },
    { name: 'Evacuation Relief Shelters', deployed: 6, standby: 18, total: 24, icon: Building },
  ];

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col p-5 space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-800/80 text-cyan-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
              Disaster Authority Control Center & Civil Defence War Room
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                SDMA / DDMA Command Level
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Coordinated incident command dashboard for real-time tasking, civil evacuation, and NDRF deployment
            </p>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center rounded-lg bg-slate-800/90 border border-slate-700 p-0.5 text-xs font-semibold">
          {[
            { id: 'ACTIVE_WAR_ROOM', label: 'Active Incident Tasking' },
            { id: 'RESOURCES', label: 'NDRF / Equipment Readiness' },
            { id: 'CONTACTS', label: 'Inter-Agency Hotline Directory' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                activeTab === tab.id
                  ? 'bg-cyan-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Active War Room */}
      {activeTab === 'ACTIVE_WAR_ROOM' && (
        <div className="space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Incident Command Log ({alerts.length} Registered Alerts)</span>
            <span className="text-cyan-400 font-bold">Standard Operating Procedure (SOP) Level-3</span>
          </div>

          <div className="space-y-3">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all text-xs"
              >
                <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-cyan-400 text-sm bg-slate-900 px-2 py-1 rounded border border-slate-800">
                      {alert.id}
                    </span>
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-2">
                        {alert.locationName} ({alert.district}, {alert.state})
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                            alert.riskLevel === 'CRITICAL'
                              ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                              : 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                          }`}
                        >
                          {alert.riskLevel} • {alert.probability}% Prob
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Issued: {alert.timestamp} | Window: {alert.expectedWindow} | Rain: {alert.rainfallIntensity} mm/h
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded font-mono font-bold text-[11px] ${
                        alert.status === 'DISPATCHED'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          : alert.status === 'ACKNOWLEDGED'
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                          : 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                      }`}
                    >
                      STATUS: {alert.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-slate-300 text-xs font-medium max-w-2xl">
                    <span className="text-amber-400 font-bold">Mandate: </span>
                    {alert.recommendedAction}
                  </p>

                  <div className="flex items-center gap-2">
                    {alert.status === 'SENT' && (
                      <button
                        onClick={() => onAcknowledge(alert.id)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>ACKNOWLEDGE</span>
                      </button>
                    )}

                    {alert.status !== 'DISPATCHED' && (
                      <button
                        onClick={() => onDispatch(alert.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>DISPATCH RESPONSE TEAM</span>
                      </button>
                    )}

                    <button
                      onClick={() => onViewMap(alert.locationId)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs flex items-center gap-1 border border-slate-700 transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>VIEW MAP</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Resources & Equipment */}
      {activeTab === 'RESOURCES' && (
        <div className="space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Emergency Logistics & Civil Defence Asset Allocation
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {resources.map((res, i) => {
              const Icon = res.icon;
              return (
                <div key={i} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold text-slate-200">{res.name}</span>
                    <Icon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-black font-mono text-white">{res.total}</div>
                  <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-mono">
                    <span className="text-emerald-400 font-bold">{res.deployed} Deployed</span>
                    <span className="text-cyan-400">{res.standby} Ready</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Emergency Contacts */}
      {activeTab === 'CONTACTS' && (
        <div className="space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Government & Military Disaster Response Hotline Directory
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            {emergencyContacts.map((c, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">{c.agency}</div>
                  <div className="text-cyan-300 font-bold mt-1 flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5" /> {c.phone}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Contact: {c.officer}</div>
                </div>
                <span className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
