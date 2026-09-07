import React, { useState, useEffect } from 'react';
import {
  Car,
  Navigation,
  Compass,
  AlertTriangle,
  ShieldCheck,
  MapPin,
  Clock,
  Droplets,
  Gauge,
  Sparkles,
  PhoneCall,
  Search,
  ExternalLink,
  ChevronRight,
  Radio,
  ArrowRight,
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { LocationWeather, RiskLevel } from '../types';
import { POPULAR_DRIVING_ROUTES, DrivingRoute, synthesizeLocationWeather } from '../utils/locationService';

interface DrivingRouteAssistantProps {
  selectedLocation: LocationWeather;
  onSelectLocation: (loc: LocationWeather) => void;
  onNavigateTab: (tab: any) => void;
  onGenerateEarlyWarning: (loc: LocationWeather) => void;
  userGPSCoords: { lat: number; lon: number; speed?: number; heading?: number } | null;
  isLiveGPSEnabled: boolean;
  onToggleLiveGPS: () => void;
}

export const DrivingRouteAssistant: React.FC<DrivingRouteAssistantProps> = ({
  selectedLocation,
  onSelectLocation,
  onNavigateTab,
  onGenerateEarlyWarning,
  userGPSCoords,
  isLiveGPSEnabled,
  onToggleLiveGPS,
}) => {
  const [selectedRoute, setSelectedRoute] = useState<DrivingRoute>(POPULAR_DRIVING_ROUTES[0]);
  const [vehicleSpeed, setVehicleSpeed] = useState<number>(45);
  const [activeWaypointIndex, setActiveWaypointIndex] = useState<number>(2);
  const [customOrigin, setCustomOrigin] = useState<string>('');
  const [customDestination, setCustomDestination] = useState<string>('');
  const [showSOSModal, setShowSOSModal] = useState<boolean>(false);

  // Simulated vehicle movement along route if GPS is active
  useEffect(() => {
    if (!isLiveGPSEnabled) return;
    const interval = setInterval(() => {
      setVehicleSpeed(Math.round(38 + Math.random() * 22));
    }, 4000);
    return () => clearInterval(interval);
  }, [isLiveGPSEnabled]);

  const criticalWaypointsCount = selectedRoute.waypoints.filter((w) => w.riskLevel === 'CRITICAL').length;
  const highRiskWaypointsCount = selectedRoute.waypoints.filter((w) => w.riskLevel === 'HIGH').length;

  const handleInspectWaypoint = (wp: (typeof selectedRoute.waypoints)[0]) => {
    const synthesized = synthesizeLocationWeather({
      name: wp.name,
      district: selectedRoute.name,
      state: selectedRoute.state,
      latitude: wp.latitude,
      longitude: wp.longitude,
      elevationMeters: wp.elevationMeters,
    });
    onSelectLocation(synthesized);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Vehicle GPS Mode Control */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-400">
              <Car className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-xl text-white">
                  Highway Transit & Vehicle Cloudburst Route Guard
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                  On-Road Early Warning
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Real-time road sector atmospheric hazard detection, flash-flood bottleneck warnings, and safe halting points for drivers.
              </p>
            </div>
          </div>
        </div>

        {/* Live GPS / Vehicle Drive Mode Switch */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleLiveGPS}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all shadow-lg ${
              isLiveGPSEnabled
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/60 ring-2 ring-emerald-400 animate-pulse'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            <Navigation className={`w-4 h-4 ${isLiveGPSEnabled ? 'text-white' : 'text-slate-400'}`} />
            <span>{isLiveGPSEnabled ? 'LIVE VEHICLE GPS: ACTIVE' : 'ENABLE LIVE VEHICLE TRACKING'}</span>
          </button>

          <button
            onClick={() => setShowSOSModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-red-950/80 transition-all border border-red-400/40"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>HIGHWAY SOS</span>
          </button>
        </div>
      </div>

      {/* Live Vehicle Telemetry HUD (When Drive Mode is Active) */}
      {isLiveGPSEnabled && (
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-800/60 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <Gauge className="w-6 h-6 text-emerald-400" />
            <div>
              <div className="text-[10px] text-slate-400">Current Speed</div>
              <div className="text-base font-black text-white">{vehicleSpeed} km/h</div>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <Compass className="w-6 h-6 text-cyan-400" />
            <div>
              <div className="text-[10px] text-slate-400">Heading & Vector</div>
              <div className="text-base font-black text-white">
                {userGPSCoords?.heading ? `${Math.round(userGPSCoords.heading)}° N` : 'NE 042°'}
              </div>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <MapPin className="w-6 h-6 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-400">GPS Coordinates</div>
              <div className="text-xs font-bold text-white">
                {userGPSCoords ? `${userGPSCoords.lat.toFixed(3)}N, ${userGPSCoords.lon.toFixed(3)}E` : '30.145N, 78.598E'}
              </div>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-red-400 animate-pulse" />
            <div>
              <div className="text-[10px] text-slate-400">Next Hazard Sector</div>
              <div className="text-xs font-bold text-red-400">Rudraprayag (35 km)</div>
            </div>
          </div>
        </div>
      )}

      {/* Highway Route Selector */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <span>Select High-Risk Mountain Highway Corridor</span>
            </h3>
            <p className="text-xs text-slate-400">
              Monitoring critical landslide-prone pilgrim corridors and mountain pass transit routes
            </p>
          </div>
          <span className="text-xs font-mono text-cyan-400">
            {selectedRoute.distanceKm} km • Est. {selectedRoute.totalDurationHours} hrs
          </span>
        </div>

        {/* Route Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {POPULAR_DRIVING_ROUTES.map((route) => {
            const isSelected = selectedRoute.id === route.id;
            const critCount = route.waypoints.filter((w) => w.riskLevel === 'CRITICAL').length;

            return (
              <button
                key={route.id}
                onClick={() => setSelectedRoute(route)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-cyan-950/80 to-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-950/60'
                    : 'bg-slate-800/70 border-slate-700/80 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-bold">
                    {route.highwayCode}
                  </span>
                  {critCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-bold border border-red-500/40">
                      {critCount} Red Zones
                    </span>
                  )}
                </div>
                <div className="mt-2 font-bold text-xs text-white line-clamp-1">{route.name}</div>
                <div className="mt-1 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{route.state}</span>
                  <span>{route.distanceKm} km</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Corridor Waypoint Hazard Breakdown */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base text-white">{selectedRoute.name}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                {selectedRoute.waypoints.length} Checkpoints
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live convective cloudburst risk index along each highway section
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-red-400 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {criticalWaypointsCount} Critical Sectors
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-orange-400 font-bold">
              {highRiskWaypointsCount} High Risk
            </span>
          </div>
        </div>

        {/* Route Progression Road Strip */}
        <div className="p-4 overflow-x-auto">
          <div className="min-w-[700px] flex items-center gap-2 py-2">
            {selectedRoute.waypoints.map((wp, idx) => {
              const isLast = idx === selectedRoute.waypoints.length - 1;
              return (
                <React.Fragment key={wp.name}>
                  <div
                    onClick={() => handleInspectWaypoint(wp)}
                    className={`flex-1 p-3 rounded-xl border cursor-pointer transition-all hover:scale-105 ${
                      wp.riskLevel === 'CRITICAL'
                        ? 'bg-red-950/40 border-red-800/80 hover:bg-red-900/50'
                        : wp.riskLevel === 'HIGH'
                        ? 'bg-orange-950/40 border-orange-800/80 hover:bg-orange-900/50'
                        : wp.riskLevel === 'MODERATE'
                        ? 'bg-amber-950/30 border-amber-800/60 hover:bg-amber-900/40'
                        : 'bg-emerald-950/30 border-emerald-800/60 hover:bg-emerald-900/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>KM {wp.kmMark}</span>
                      <span
                        className={`px-1.5 py-0.2 rounded font-bold ${
                          wp.riskLevel === 'CRITICAL'
                            ? 'text-red-400'
                            : wp.riskLevel === 'HIGH'
                            ? 'text-orange-400'
                            : wp.riskLevel === 'MODERATE'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {wp.riskLevel}
                      </span>
                    </div>

                    <div className="mt-1 font-bold text-xs text-white truncate" title={wp.name}>
                      {wp.name}
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-cyan-300">{wp.rainfallMmHr} mm/h</span>
                      <span className="text-white font-extrabold">{wp.cloudburstProb}% Prob</span>
                    </div>

                    <div className="mt-1.5 pt-1.5 border-t border-slate-800/60 text-[9px] text-slate-400 truncate">
                      {wp.hazardType.replace(/_/g, ' ')}
                    </div>
                  </div>

                  {!isLast && <ArrowRight className="w-4 h-4 text-slate-600 shrink-0" />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Detailed Waypoint Table with Safe Shelter / Refuge Centers */}
        <div className="border-t border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-4">Highway Checkpoint</th>
                <th className="py-3 px-4">KM / Elevation</th>
                <th className="py-3 px-4">Cloudburst Risk</th>
                <th className="py-3 px-4">Rain Rate</th>
                <th className="py-3 px-4">Road Hazard Status</th>
                <th className="py-3 px-4">Designated Driver Refuge Point</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-200">
              {selectedRoute.waypoints.map((wp) => (
                <tr key={wp.name} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                        wp.riskLevel === 'CRITICAL'
                          ? 'bg-red-500 animate-ping'
                          : wp.riskLevel === 'HIGH'
                          ? 'bg-orange-500'
                          : wp.riskLevel === 'MODERATE'
                          ? 'bg-amber-400'
                          : 'bg-emerald-400'
                      }`}
                    />
                    <span>{wp.name}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    KM {wp.kmMark} • {wp.elevationMeters}m MSL
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded font-mono font-bold text-[11px] ${
                        wp.riskLevel === 'CRITICAL'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : wp.riskLevel === 'HIGH'
                          ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                          : wp.riskLevel === 'MODERATE'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {wp.cloudburstProb}% ({wp.riskLevel})
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-cyan-300 font-bold">{wp.rainfallMmHr} mm/hr</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        wp.hazardType === 'CLOUD_BURST_ZONE'
                          ? 'bg-red-950 text-red-300 border border-red-800'
                          : wp.hazardType === 'LANDSLIDE_CHUTE'
                          ? 'bg-orange-950 text-orange-300 border border-orange-800'
                          : wp.hazardType === 'FLASH_FLOOD_SUSCEPTIBLE'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {wp.hazardType.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-emerald-300 font-medium">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate">{wp.safeShelterPoint}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleInspectWaypoint(wp)}
                      className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-700 hover:bg-cyan-900 text-cyan-300 text-[11px] font-bold transition-colors"
                    >
                      Inspect Zone
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Driver Safety Protocols & Highway Advisory */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" />
            <span>Driver Safety Directives</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            If torrential rainfall exceeds 80 mm/hr while driving on mountain ghats, halt immediately at the nearest designated concrete shelter. Never park underneath steep talus slopes or inside natural stream gullies.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
            <Radio className="w-4 h-4" />
            <span>Emergency Radio Frequency</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Tune in to Disaster Broadcast VHF 146.500 MHz or FM Disaster Band 100.1 MHz for live road clearance status, JCB heavy bulldozer deployment, and convoy movement updates.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>SDRF & NDRF Rapid Staging</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Quick Reaction Teams (QRT) are staged along NH-7, NH-107, NH-21, and NH-44 at 25-km intervals equipped with hydraulic tree cutters, inflatable boats, and satellite phones.
          </p>
        </div>
      </div>

      {/* Highway SOS Modal */}
      {showSOSModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-red-700/80 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-red-400">
                <PhoneCall className="w-5 h-5 animate-pulse" />
                <h3 className="font-display font-bold text-lg text-white">
                  Highway Emergency Disaster Hotlines
                </h3>
              </div>
              <button
                onClick={() => setShowSOSModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">National Emergency Helpline</div>
                  <div className="text-slate-400">All India Disaster Support</div>
                </div>
                <a
                  href="tel:112"
                  className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold font-mono"
                >
                  Dial 112
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">NDRF Control Room</div>
                  <div className="text-slate-400">National Disaster Response Force HQ</div>
                </div>
                <a
                  href="tel:01124363260"
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-mono"
                >
                  011-24363260
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">Uttarakhand SEOC Disaster Ops</div>
                  <div className="text-slate-400">State Emergency Operation Centre</div>
                </div>
                <a
                  href="tel:1070"
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-mono"
                >
                  Dial 1070
                </a>
              </div>

              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between">
                <div>
                  <div className="font-bold text-white text-sm">Himachal Pradesh Disaster Helpline</div>
                  <div className="text-slate-400">HP SEOC Shimla Control</div>
                </div>
                <a
                  href="tel:1077"
                  className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold font-mono"
                >
                  Dial 1077
                </a>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => setShowSOSModal(false)}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs"
              >
                Close Hotline Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
