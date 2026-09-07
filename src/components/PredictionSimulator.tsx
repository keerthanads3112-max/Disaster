import React, { useState } from 'react';
import {
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Layers,
  Activity,
  AlertTriangle,
  Flame,
  CheckCircle2,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { SimulationParameters, SimulationResult, RiskLevel } from '../types';
import { runSimulatorEngine, playEmergencyAlertSound } from '../utils/mlEngine';
import confetti from 'canvas-confetti';

interface PredictionSimulatorProps {
  onTriggerAlertNotification: (result: SimulationResult, params: SimulationParameters) => void;
}

export const PredictionSimulator: React.FC<PredictionSimulatorProps> = ({
  onTriggerAlertNotification,
}) => {
  // Preset scenarios
  const defaultParams: SimulationParameters = {
    rainfallIntensity: 115,
    rainfallChangeRate: 32,
    humidity: 93,
    temperature: 19,
    pressure: 1004,
    windSpeed: 26,
    cloudCoverage: 96,
    cloudTopHeight: 14.5,
    capeValue: 2700,
    orographicUplift: 8,
    historicalSimilarity: 88,
  };

  const [params, setParams] = useState<SimulationParameters>(defaultParams);
  const [result, setResult] = useState<SimulationResult>(() => runSimulatorEngine(defaultParams));
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(4);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setActiveStep(1);

    setTimeout(() => setActiveStep(2), 250);
    setTimeout(() => setActiveStep(3), 500);
    setTimeout(() => {
      setActiveStep(4);
      const res = runSimulatorEngine(params);
      setResult(res);
      setIsSimulating(false);

      if (res.riskLevel === 'CRITICAL') {
        playEmergencyAlertSound('CRITICAL');
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#ef4444', '#f97316', '#38bdf8'],
          });
        } catch {
          // ignore
        }
      }
    }, 750);
  };

  const handleApplyPreset = (type: 'EXTREME' | 'MODERATE' | 'NORMAL') => {
    let preset: SimulationParameters;
    if (type === 'EXTREME') {
      preset = {
        rainfallIntensity: 140,
        rainfallChangeRate: 42,
        humidity: 97,
        temperature: 18,
        pressure: 998,
        windSpeed: 34,
        cloudCoverage: 100,
        cloudTopHeight: 16.0,
        capeValue: 3400,
        orographicUplift: 9,
        historicalSimilarity: 94,
      };
    } else if (type === 'MODERATE') {
      preset = {
        rainfallIntensity: 45,
        rainfallChangeRate: 10,
        humidity: 78,
        temperature: 22,
        pressure: 1011,
        windSpeed: 16,
        cloudCoverage: 75,
        cloudTopHeight: 10.0,
        capeValue: 1600,
        orographicUplift: 5,
        historicalSimilarity: 55,
      };
    } else {
      preset = {
        rainfallIntensity: 12,
        rainfallChangeRate: 2,
        humidity: 60,
        temperature: 26,
        pressure: 1016,
        windSpeed: 10,
        cloudCoverage: 40,
        cloudTopHeight: 6.5,
        capeValue: 700,
        orographicUplift: 2,
        historicalSimilarity: 15,
      };
    }
    setParams(preset);
    const res = runSimulatorEngine(preset);
    setResult(res);
  };

  const handleReset = () => {
    setParams(defaultParams);
    setResult(runSimulatorEngine(defaultParams));
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col p-5 space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-800/80 text-indigo-400">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
              AI Prediction Simulator & Sandbox
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
                Interactive ML Sandbox
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Adjust atmospheric boundary conditions, run feature synthesis, and observe live cloudburst probability escalation
            </p>
          </div>
        </div>

        {/* Preset quick buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Scenario Presets:</span>
          <button
            onClick={() => handleApplyPreset('EXTREME')}
            className="px-2.5 py-1.5 rounded-lg bg-red-950/80 border border-red-700 hover:bg-red-900 text-red-300 text-xs font-bold transition-all flex items-center gap-1"
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>Extreme Cloudburst</span>
          </button>
          <button
            onClick={() => handleApplyPreset('MODERATE')}
            className="px-2.5 py-1.5 rounded-lg bg-amber-950/80 border border-amber-700 hover:bg-amber-900 text-amber-300 text-xs font-semibold transition-all"
          >
            Moderate Rain
          </button>
          <button
            onClick={() => handleApplyPreset('NORMAL')}
            className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-700 hover:bg-emerald-900 text-emerald-300 text-xs font-semibold transition-all"
          >
            Normal Weather
          </button>
          <button
            onClick={handleReset}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200"
            title="Reset to default"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Visual Pipeline Step-by-Step Flowchart */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
        <div className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3 flex items-center justify-between">
          <span>AI Inference Pipeline Architecture</span>
          <span className="text-cyan-400 font-bold">End-to-End Decision Flow</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs font-mono text-center">
          <div className={`p-2.5 rounded-lg border transition-all ${
            activeStep >= 1 ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <div className="text-[10px] text-cyan-400">Step 1</div>
            <div className="font-bold">Input Conditions</div>
          </div>
          <div className={`p-2.5 rounded-lg border transition-all ${
            activeStep >= 2 ? 'bg-blue-950/60 border-blue-500 text-blue-200' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <div className="text-[10px] text-blue-400">Step 2</div>
            <div className="font-bold">Feature Extraction</div>
          </div>
          <div className={`p-2.5 rounded-lg border transition-all ${
            activeStep >= 3 ? 'bg-indigo-950/60 border-indigo-500 text-indigo-200' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <div className="text-[10px] text-indigo-400">Step 3</div>
            <div className="font-bold">Random Forest ML</div>
          </div>
          <div className={`p-2.5 rounded-lg border transition-all ${
            activeStep >= 4 ? 'bg-purple-950/60 border-purple-500 text-purple-200' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <div className="text-[10px] text-purple-400">Step 4</div>
            <div className="font-bold">Prob Risk Score</div>
          </div>
          <div className={`p-2.5 rounded-lg border transition-all ${
            activeStep >= 4 ? 'bg-rose-950/60 border-rose-500 text-rose-200' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <div className="text-[10px] text-rose-400">Step 5</div>
            <div className="font-bold">Classification</div>
          </div>
          <div className={`p-2.5 rounded-lg border transition-all ${
            activeStep >= 4 ? 'bg-red-950/60 border-red-500 text-red-200' : 'bg-slate-900 border-slate-800 text-slate-400'
          }`}>
            <div className="text-[10px] text-red-400">Step 6</div>
            <div className="font-bold">Early Warning</div>
          </div>
        </div>
      </div>

      {/* Main Sandbox Grid: Sliders on Left, Live Inference Engine on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Sliders */}
        <div className="lg:col-span-7 space-y-4">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center justify-between pb-1 border-b border-slate-800">
            <span>Atmospheric Telemetry Inputs</span>
            <span className="text-cyan-400 font-mono">Manual Sliders</span>
          </div>

          <div className="space-y-3.5 text-xs font-mono">
            {/* 1. Rainfall Intensity */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-cyan-300">Rainfall Intensity (mm/hr)</span>
                <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-400 font-bold">
                  {params.rainfallIntensity} mm/hr
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={params.rainfallIntensity}
                onChange={(e) => setParams({ ...params, rainfallIntensity: Number(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0 mm/hr (Dry)</span>
                <span>100 mm/hr (Cloudburst Threshold)</span>
                <span>200 mm/hr (Extreme)</span>
              </div>
            </div>

            {/* 2. Humidity */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-blue-300">Relative Humidity (%)</span>
                <span className="px-2 py-0.5 rounded bg-blue-950 border border-blue-800 text-blue-400 font-bold">
                  {params.humidity}%
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={params.humidity}
                onChange={(e) => setParams({ ...params, humidity: Number(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>30% (Arid)</span>
                <span>85% (Convective Saturation)</span>
                <span>100% (Fully Saturated)</span>
              </div>
            </div>

            {/* 3. Barometric Pressure */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-amber-300">Barometric Pressure (hPa)</span>
                <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-400 font-bold">
                  {params.pressure} hPa
                </span>
              </div>
              <input
                type="range"
                min="970"
                max="1025"
                value={params.pressure}
                onChange={(e) => setParams({ ...params, pressure: Number(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>970 hPa (Depression)</span>
                <span>1005 hPa (Low Vortex)</span>
                <span>1025 hPa (High Stable)</span>
              </div>
            </div>

            {/* 4. Rainfall Change Rate */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-rose-300">Precipitation Surge Rate (+mm / 15 min)</span>
                <span className="px-2 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-400 font-bold">
                  +{params.rainfallChangeRate} mm/15min
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={params.rainfallChangeRate}
                onChange={(e) => setParams({ ...params, rainfallChangeRate: Number(e.target.value) })}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
              />
            </div>

            {/* 5. Wind Speed & Historical Similarity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-300">Wind Speed</span>
                  <span className="text-cyan-400 font-bold">{params.windSpeed} km/h</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={params.windSpeed}
                  onChange={(e) => setParams({ ...params, windSpeed: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-slate-300">Historical Match</span>
                  <span className="text-purple-400 font-bold">{params.historicalSimilarity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="99"
                  value={params.historicalSimilarity}
                  onChange={(e) => setParams({ ...params, historicalSimilarity: Number(e.target.value) })}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
              </div>
            </div>
          </div>

          {/* Big Run Button */}
          <button
            onClick={handleRunSimulation}
            id="btn-run-simulation"
            disabled={isSimulating}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl shadow-cyan-950/60 transition-all cursor-pointer disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isSimulating ? 'EXECUTING RANDOM FOREST ENSEMBLE...' : 'RUN AI PREDICTION MODEL'}</span>
          </button>
        </div>

        {/* Right Col: Live Prediction Outcome */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-800 flex items-center justify-between">
              <span>Simulation Result</span>
              <span className="text-emerald-400 font-bold">Sub-20ms Response</span>
            </div>

            {/* Big Probability Gauge */}
            <div className="my-4 text-center">
              <div
                className={`text-5xl sm:text-6xl font-black font-mono tracking-tighter ${
                  result.riskLevel === 'CRITICAL'
                    ? 'text-red-500 animate-pulse'
                    : result.riskLevel === 'HIGH'
                    ? 'text-orange-500'
                    : result.riskLevel === 'MODERATE'
                    ? 'text-yellow-400'
                    : 'text-emerald-400'
                }`}
              >
                {result.cloudburstProbability}%
              </div>
              <div className="text-xs font-bold text-slate-300 mt-1">
                Calculated Cloudburst Probability
              </div>

              <div className="mt-2.5">
                <span
                  className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                    result.riskLevel === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                      : result.riskLevel === 'HIGH'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                      : result.riskLevel === 'MODERATE'
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                  }`}
                >
                  RISK LEVEL: {result.riskLevel}
                </span>
              </div>
            </div>

            {/* Inference Horizon & Confidence */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono mb-4">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Prediction Horizon</div>
                <div className="text-xs font-bold text-amber-300">{result.predictionHorizon}</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Confidence Score</div>
                <div className="text-xs font-bold text-cyan-300">{result.confidenceScore}% High</div>
              </div>
            </div>

            {/* Explainable Factor Bars in Simulator */}
            <div className="space-y-2 text-xs font-mono">
              <div className="text-[11px] font-bold text-slate-300">Feature Contribution Decomposition:</div>
              {result.explainableFactors.map((f, i) => (
                <div key={i} className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-800/80">
                  <div className="flex items-center justify-between text-[11px] mb-0.5">
                    <span className="text-slate-300 truncate">{f.name}</span>
                    <span className="text-cyan-400 font-bold">{f.contribution}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        i === 0 ? 'bg-red-500' : i === 1 ? 'bg-orange-500' : 'bg-cyan-400'
                      }`}
                      style={{ width: `${f.contribution}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trigger Alert Notification CTA */}
          <button
            onClick={() => onTriggerAlertNotification(result, params)}
            className="mt-4 w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/60 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>DISPATCH TEST ALERT TO AUTHORITY DESK</span>
          </button>
        </div>
      </div>
    </div>
  );
};
