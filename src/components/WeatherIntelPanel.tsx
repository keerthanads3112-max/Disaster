import React from 'react';
import {
  Satellite,
  Radio,
  Radar,
  CheckCircle2,
  Activity,
  Wind,
  Droplets,
  Thermometer,
  Gauge,
  CloudRain,
  Eye,
  RefreshCw,
  Clock,
  Layers
} from 'lucide-react';
import { LocationWeather } from '../types';

interface WeatherIntelPanelProps {
  location: LocationWeather;
}

export const WeatherIntelPanel: React.FC<WeatherIntelPanelProps> = ({ location }) => {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-950/80 border border-blue-800/60 text-blue-400">
            <Satellite className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-white">
              Multi-Source Weather Intelligence
            </h2>
            <p className="text-xs text-slate-400">
              Synchronized data fusion across Ground AWS, Geostationary Satellites & Doppler Weather Radars
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Triple Fusion Active
          </span>
        </div>
      </div>

      {/* 3 Source Cards */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Source 1: Ground Weather Stations (AWS) */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 flex flex-col justify-between hover:border-cyan-500/40 transition-all">
          <div>
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-950/80 text-cyan-400 border border-cyan-800/50">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-white">Ground Weather Stations</h3>
                  <div className="text-[10px] text-slate-400 font-mono">IMD Automatic AWS Network</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                CONNECTED
              </span>
            </div>

            {/* Status Pills */}
            <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-cyan-400">Station: {location.stationId}</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3 h-3 text-cyan-400" /> {location.lastUpdated}
              </span>
            </div>

            {/* Metrics List */}
            <div className="mt-3 space-y-2 text-xs font-mono">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-cyan-400" /> Rainfall Intensity
                </span>
                <span className="font-bold text-cyan-300">{location.rainfallIntensity} mm/hr</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-blue-400" /> Relative Humidity
                </span>
                <span className="font-bold text-blue-300">{location.humidity}%</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-amber-400" /> Atmospheric Pressure
                </span>
                <span className="font-bold text-amber-300">{location.pressure} hPa</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-rose-400" /> Surface Temperature
                </span>
                <span className="font-bold text-slate-200">{location.temperature}°C</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Wind className="w-3.5 h-3.5 text-indigo-400" /> Wind Velocity & Dir
                </span>
                <span className="font-bold text-slate-200">{location.windSpeed} km/h ({location.windDirection})</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-mono flex items-center justify-between">
            <span>DATA RECEIVED (100%)</span>
            <span>Elevation: {location.elevationMeters}m</span>
          </div>
        </div>

        {/* Source 2: Satellite Data (INSAT-3DR) */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 flex flex-col justify-between hover:border-blue-500/40 transition-all">
          <div>
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-950/80 text-blue-400 border border-blue-800/50">
                  <Satellite className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-white">Satellite Data</h3>
                  <div className="text-[10px] text-slate-400 font-mono">INSAT-3DR Geostationary</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                CONNECTED
              </span>
            </div>

            {/* Status Pills */}
            <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-blue-400">Channel: TIR-1 / TIR-2 IR</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3 h-3 text-blue-400" /> 1 min ago
              </span>
            </div>

            {/* Metrics List */}
            <div className="mt-3 space-y-2 text-xs font-mono">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Cloud Coverage</span>
                <span className="font-bold text-blue-300">{location.cloudCoverage}% (Dense Overcast)</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Cloud Top Height</span>
                <span className="font-bold text-cyan-300">{location.cloudTopHeightKm} km (Overshooting)</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Convective Activity (CAPE)</span>
                <span className="font-bold text-amber-400">{location.convectiveAvailablePotentialEnergy} J/kg</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Cloud Density & Type</span>
                <span className="font-bold text-slate-200">Cumulonimbus Calvus</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Mesoscale Cell State</span>
                <span className="font-bold text-red-400">{location.satelliteActivity}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-mono flex items-center justify-between">
            <span>DATA RECEIVED (100%)</span>
            <span>Resolution: 1.0 km²</span>
          </div>
        </div>

        {/* Source 3: Doppler Weather Radar (DWR) */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/90 flex flex-col justify-between hover:border-indigo-500/40 transition-all">
          <div>
            {/* Header Badge */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-950/80 text-indigo-400 border border-indigo-800/50">
                  <Radar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-xs sm:text-sm text-white">Doppler Radar (DWR)</h3>
                  <div className="text-[10px] text-slate-400 font-mono">IMD C-Band Polarimetric</div>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                CONNECTED
              </span>
            </div>

            {/* Status Pills */}
            <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="text-indigo-400">Reflectivity Core: {location.radarReflectivityDbz} dBZ</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Clock className="w-3 h-3 text-indigo-400" /> Real-time
              </span>
            </div>

            {/* Metrics List */}
            <div className="mt-3 space-y-2 text-xs font-mono">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Core Reflectivity (dBZ)</span>
                <span className="font-bold text-red-400">{location.radarReflectivityDbz} dBZ (Severe)</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Storm Motion Vector</span>
                <span className="font-bold text-indigo-300">32 km/h toward SW Basin</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Precipitation Structure</span>
                <span className="font-bold text-amber-300">Convective Vortex Core</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Radial Velocity Shear</span>
                <span className="font-bold text-slate-200">±26 m/s (Couplet)</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Radar Status Flag</span>
                <span className="font-bold text-red-400">{location.radarStatus}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-emerald-400 font-mono flex items-center justify-between">
            <span>DATA RECEIVED (100%)</span>
            <span>Sweep Range: 250 km</span>
          </div>
        </div>
      </div>
    </div>
  );
};
