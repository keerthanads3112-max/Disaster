import React, { useState } from 'react';
import {
  History,
  GitCompare,
  Calendar,
  MapPin,
  CloudRain,
  Droplets,
  Gauge,
  AlertTriangle,
  Flame,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  Info
} from 'lucide-react';
import { sampleHistoricalEvents } from '../data/sampleLocations';
import { LocationWeather, HistoricalCloudburstEvent } from '../types';

interface HistoricalAnalysisProps {
  currentLocation: LocationWeather;
}

export const HistoricalAnalysis: React.FC<HistoricalAnalysisProps> = ({ currentLocation }) => {
  const [selectedEvent, setSelectedEvent] = useState<HistoricalCloudburstEvent>(sampleHistoricalEvents[0]);

  // Compute similarity vector metrics between current location and selected historical disaster
  const rainfallMatch = Math.min(
    99,
    Math.round(100 - Math.abs(currentLocation.rainfallIntensity - selectedEvent.peakRainfallMmHr) * 0.6)
  );
  const humidityMatch = Math.min(
    99,
    Math.round(100 - Math.abs(currentLocation.humidity - selectedEvent.humidityPeak) * 1.2)
  );
  const pressureMatch = Math.min(
    99,
    Math.round(100 - Math.abs(currentLocation.pressureDrop3Hr - selectedEvent.pressureDropHpa) * 4)
  );
  const overallSimilarity = Math.round((rainfallMatch * 0.4 + humidityMatch * 0.35 + pressureMatch * 0.25));

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col p-5 space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-950/80 border border-purple-800/80 text-purple-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
              Historical Cloudburst Pattern & Analogue Analysis
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-purple-500/20 text-purple-400 border border-purple-500/40">
                Vector Match Engine
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Benchmark real-time convective atmospheric vectors against past major Indian cloudburst disasters
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Engine: Current Telemetry vs Historical Precedent */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display font-bold text-base text-white">
              Current Weather ({currentLocation.name}) vs Historical Cloudburst Signature
            </h3>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold font-mono bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
            Overall Analogue Similarity: {overallSimilarity}%
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
          {/* Sub-Card 1: Current Atmospheric State */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Live Telemetry Vector: {currentLocation.name}
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Rainfall Intensity:</span>
                <span className="font-bold text-cyan-300">{currentLocation.rainfallIntensity} mm/hr</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Relative Humidity:</span>
                <span className="font-bold text-blue-300">{currentLocation.humidity}%</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Pressure Drop (3h):</span>
                <span className="font-bold text-amber-300">-{currentLocation.pressureDrop3Hr} hPa</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Reflectivity:</span>
                <span className="font-bold text-red-400">{currentLocation.radarReflectivityDbz} dBZ</span>
              </div>
            </div>
          </div>

          {/* Sub-Card 2: Selected Historical Case */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-800">
              <span className="w-2 h-2 rounded-full bg-purple-400" />
              Benchmark Case: {selectedEvent.name}
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Peak Rainfall:</span>
                <span className="font-bold text-cyan-300">{selectedEvent.peakRainfallMmHr} mm/hr</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Peak Humidity:</span>
                <span className="font-bold text-blue-300">{selectedEvent.humidityPeak}%</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Pre-Burst Pressure Drop:</span>
                <span className="font-bold text-amber-300">-{selectedEvent.pressureDropHpa} hPa</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-slate-900 border border-slate-800">
                <span className="text-slate-400">Casualties & Impact:</span>
                <span className="font-bold text-rose-400">{selectedEvent.casualties} lost</span>
              </div>
            </div>
          </div>

          {/* Sub-Card 3: Similarity Vector Breakdown */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3 flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider pb-2 border-b border-slate-800">
                Cosine Similarity Decomposition
              </div>
              <div className="mt-3 space-y-2.5 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300">Current Rainfall Pattern:</span>
                    <span className="font-bold text-cyan-300">{rainfallMatch}% Similarity</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${rainfallMatch}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300">Current Humidity Pattern:</span>
                    <span className="font-bold text-blue-300">{humidityMatch}% Similarity</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${humidityMatch}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-300">Current Pressure Drop Pattern:</span>
                    <span className="font-bold text-amber-300">{pressureMatch}% Similarity</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pressureMatch}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-800/40 text-[11px] text-red-200 mt-2">
              <span className="font-bold">🚨 Analogue Diagnosis: </span>
              "The current atmospheric pattern over {currentLocation.name} closely resembles pre-cloudburst conditions observed in the {selectedEvent.name} ({selectedEvent.date})."
            </div>
          </div>
        </div>
      </div>

      {/* Historical Disasters Catalog */}
      <div>
        <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
          <span>Himalayan & National Cloudburst Archive ({sampleHistoricalEvents.length} Events)</span>
          <span className="text-cyan-400">Click any card to benchmark</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sampleHistoricalEvents.map((evt) => {
            const isSelected = selectedEvent.id === evt.id;
            return (
              <div
                key={evt.id}
                onClick={() => setSelectedEvent(evt)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-950/40 border-purple-500 shadow-lg shadow-purple-950/40'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="font-bold text-sm text-white">{evt.name}</div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-purple-300">
                    {evt.similarityScore}% Match
                  </span>
                </div>

                <div className="mt-2 text-xs font-mono text-slate-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin className="w-3 h-3 text-cyan-400" /> {evt.location}, {evt.state}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-slate-400" /> {evt.date}
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Peak Rainfall</div>
                    <div className="font-bold text-cyan-300">{evt.peakRainfallMmHr} mm/h</div>
                  </div>
                  <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
                    <div className="text-[10px] text-slate-400">Humidity Peak</div>
                    <div className="font-bold text-blue-300">{evt.humidityPeak}%</div>
                  </div>
                </div>

                <p className="mt-2.5 text-[11px] text-slate-400 line-clamp-2">
                  {evt.impactSummary}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
