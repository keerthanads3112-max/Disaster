import React from 'react';
import {
  Cpu,
  Sparkles,
  HelpCircle,
  AlertOctagon,
  TrendingDown,
  Wind,
  Droplets,
  Layers,
  History,
  ShieldAlert,
  ArrowRight,
  Info,
  CheckCircle
} from 'lucide-react';
import { LocationWeather } from '../types';

interface AIPredictionPanelProps {
  location: LocationWeather;
  onGenerateEarlyWarning: (loc: LocationWeather) => void;
  onOpenSimulator: () => void;
}

export const AIPredictionPanel: React.FC<AIPredictionPanelProps> = ({
  location,
  onGenerateEarlyWarning,
  onOpenSimulator,
}) => {
  const prob = location.cloudburstProbability;

  // Gauge calculations (semi-circle or full circular gauge)
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (prob / 100) * circumference;

  let riskColorClass = 'text-emerald-400 border-emerald-500/30 bg-emerald-950/20';
  let strokeColor = '#10b981';
  let badgeBg = 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';

  if (location.riskLevel === 'CRITICAL') {
    riskColorClass = 'text-red-400 border-red-500/40 bg-red-950/30';
    strokeColor = '#ef4444';
    badgeBg = 'bg-red-500/20 text-red-300 border border-red-500/40';
  } else if (location.riskLevel === 'HIGH') {
    riskColorClass = 'text-orange-400 border-orange-500/40 bg-orange-950/30';
    strokeColor = '#f97316';
    badgeBg = 'bg-orange-500/20 text-orange-300 border border-orange-500/40';
  } else if (location.riskLevel === 'MODERATE') {
    riskColorClass = 'text-amber-400 border-amber-500/40 bg-amber-950/30';
    strokeColor = '#eab308';
    badgeBg = 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40';
  }

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-display font-bold text-base sm:text-lg text-white flex items-center gap-2">
              AI Cloudburst Prediction Engine
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                Random Forest v2.4 (Ensemble)
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Explainable AI (XAI) feature attribution for <span className="text-white font-semibold">{location.name}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onOpenSimulator}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-700 hover:bg-indigo-900 text-indigo-300 text-xs font-semibold transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Launch Simulator</span>
        </button>
      </div>

      <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Gauge & Prediction Horizon */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 rounded-xl bg-slate-950/70 border border-slate-800/90 text-center">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
            Real-Time Probability Score
          </div>

          {/* Circular SVG Gauge */}
          <div className="relative flex items-center justify-center my-2">
            <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 160 160">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Animated Progress Circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={strokeColor}
                strokeWidth="12"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Center Content */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="font-display text-4xl sm:text-5xl font-black text-white font-mono tracking-tighter">
                {prob}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Cloudburst Probability
              </span>
            </div>
          </div>

          {/* Risk Level Badge */}
          <div className="mt-2">
            <span className={`px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest ${badgeBg}`}>
              {location.riskLevel} RISK LEVEL
            </span>
          </div>

          {/* Metrics summary */}
          <div className="mt-4 w-full grid grid-cols-2 gap-2 text-left pt-3 border-t border-slate-800 text-xs font-mono">
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400">Prediction Confidence</div>
              <div className="text-sm font-bold text-cyan-400">{location.confidenceScore}% (High)</div>
            </div>
            <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
              <div className="text-[10px] text-slate-400">Prediction Horizon</div>
              <div className="text-sm font-bold text-amber-400">{location.predictionHorizon}</div>
            </div>
          </div>

          {/* Early Warning Trigger Button */}
          <button
            onClick={() => onGenerateEarlyWarning(location)}
            id="btn-generate-warning-panel"
            className="mt-4 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition-all cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>GENERATE EARLY WARNING BROADCAST</span>
          </button>
        </div>

        {/* Right Col: Explainable AI Breakdown */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="font-display font-bold text-sm sm:text-base text-white">
                  Why is the risk {location.riskLevel.toLowerCase()}? (Explainable AI)
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">SHAP Feature Attribution</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-factor decomposition showing exactly which physical parameters drive the cloudburst risk model:
            </p>
          </div>

          {/* Feature Contribution Bars */}
          <div className="space-y-3">
            {location.explainableFactors.map((factor, index) => (
              <div key={index} className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="flex items-center justify-between text-xs mb-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-200">
                    <span className="text-cyan-400 font-mono text-[10px]">#{index + 1}</span>
                    <span>{factor.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-300 bg-slate-800 px-1.5 py-0.5 rounded">
                      {factor.value}
                    </span>
                    <span className="font-mono font-bold text-cyan-400 text-xs w-10 text-right">
                      {factor.contribution}%
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      index === 0
                        ? 'bg-red-500'
                        : index === 1
                        ? 'bg-orange-500'
                        : index === 2
                        ? 'bg-amber-400'
                        : index === 3
                        ? 'bg-cyan-400'
                        : 'bg-indigo-400'
                    }`}
                    style={{ width: `${factor.contribution}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                  {factor.description}
                </p>
              </div>
            ))}
          </div>

          {/* AI Narrative Synthesis */}
          <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/50 flex items-start gap-2.5 text-xs text-slate-300">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-300">AI Synoptic Summary: </span>
              {prob >= 75
                ? `An extreme mesoscale convective cloud system with heavy vertical updraft is active over the ${location.name} drainage basin. The rapid rate of rainfall accumulation (${location.rainfallIntensity} mm/h) combined with 94% humidity and barometric depression triggers the critical threshold for sudden cloudburst flash flooding within the next 1–3 hours.`
                : `Atmospheric conditions over ${location.name} show moderate convective stability with manageable drainage thresholds, but continue monitoring for localized cloud surges.`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
