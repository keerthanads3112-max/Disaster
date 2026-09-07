import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Cpu,
  Satellite,
  TrendingUp,
  AlertOctagon,
  Sliders,
  History,
  Workflow,
  Shield,
  Building2,
  Activity,
  PlayCircle,
  Car,
  Settings
} from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  activeAlertsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  activeAlertsCount,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: string | number; badgeColor?: string }[] = [
    { id: 'dashboard', label: 'Main Dashboard', icon: LayoutDashboard },
    { id: 'map', label: 'Real-Time Risk Map', icon: MapPin, badge: 'LIVE', badgeColor: 'bg-emerald-500/20 text-emerald-400' },
    { id: 'driving-route', label: 'Highway & Driving Guard', icon: Car, badge: 'On-Road', badgeColor: 'bg-indigo-500/20 text-indigo-300' },
    { id: 'prediction', label: 'AI Prediction Engine', icon: Cpu, badge: 'XAI', badgeColor: 'bg-cyan-500/20 text-cyan-400' },
    { id: 'weather-intel', label: 'Multi-Source Intel', icon: Satellite },
    { id: 'trend-charts', label: 'Weather Trend Charts', icon: TrendingUp },
    { id: 'early-warnings', label: 'Early Warning Center', icon: AlertOctagon, badge: activeAlertsCount, badgeColor: 'bg-red-500 text-white font-bold' },
    { id: 'simulator', label: 'AI Prediction Simulator', icon: Sliders, badge: 'Interactive', badgeColor: 'bg-indigo-500/20 text-indigo-400' },
    { id: 'historical', label: 'Historical Analysis', icon: History },
    { id: 'data-pipeline', label: 'Data Pipeline Flow', icon: Workflow },
    { id: 'authority', label: 'Authority Control Center', icon: Shield },
    { id: 'infrastructure', label: 'Infrastructure at Risk', icon: Building2 },
    { id: 'settings', label: 'System Health & Config', icon: Activity },
  ];

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Platform Title in Sidebar */}
      <div className="px-4 py-3 border-b border-slate-800/80">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
          Disaster Navigation Hub
        </div>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              id={`nav-btn-${item.id}`}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-950/80 to-blue-950/60 text-cyan-300 border border-cyan-700/60 shadow-lg shadow-cyan-950/40 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    item.badgeColor || 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/50 text-[10px] text-slate-400 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Model Engine:</span>
          <span className="text-cyan-400 font-mono font-semibold">RandomForest-v2.4</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Telemetry Sync:</span>
          <span className="text-emerald-400 font-mono">10s Interval</span>
        </div>
        <div className="pt-1 text-[9px] text-slate-400 leading-tight">
          National Cloudburst Prediction & Early Warning Grid.
        </div>
      </div>
    </aside>
  );
};
