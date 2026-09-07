import React, { useState } from 'react';
import {
  Workflow,
  Radio,
  Satellite,
  Radar,
  Database,
  Filter,
  Cpu,
  Gauge,
  MapPin,
  AlertOctagon,
  Users,
  CheckCircle2,
  ArrowDown,
  Layers,
  Sparkles,
  Zap,
  Clock
} from 'lucide-react';

export const DataPipelineArchitecture: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<number>(4);

  const pipelineNodes = [
    {
      id: 1,
      title: '1. Multi-Source Ingestion',
      category: 'Data Feeds',
      description: 'Synchronous polling of 42 IMD Automatic Weather Stations, INSAT-3DR Geostationary TIR channels, and C-Band Polarimetric Doppler Radars.',
      techStack: 'Apache Kafka / MQTT Telemetry Streams',
      latency: '35 ms',
      status: 'ONLINE',
      metrics: ['42 AWS Stations', '3 Sat Channels', '5 Doppler Radars'],
      icon: Radio,
    },
    {
      id: 2,
      title: '2. Cleaning & Quality Control',
      category: 'Preprocessing',
      description: 'Z-score outlier filtration, missing data spatial kriging interpolation, Doppler radar ground clutter rejection, and atmospheric barometric reduction.',
      techStack: 'Apache Flink / NumPy Vectorized Preprocessors',
      latency: '12 ms',
      status: 'OPTIMAL',
      metrics: ['Clutter Rejection: 99.8%', 'Kriging Smoothing', 'Time-Sync: 1 sec'],
      icon: Filter,
    },
    {
      id: 3,
      title: '3. Feature Extraction & Convective Synthesis',
      category: 'Feature Store',
      description: 'Computes derived convective indicators: 3-hour barometric delta (dP/dt), Precipitable Water Vapor (PWV), Convective Available Potential Energy (CAPE), and Orographic slope convergence.',
      techStack: 'TimescaleDB / Python SciPy Feature Pipeline',
      latency: '18 ms',
      status: 'ACTIVE',
      metrics: ['16 Dynamic Features', 'Orographic Funnel Index', 'Dew Point Deficit'],
      icon: Database,
    },
    {
      id: 4,
      title: '4. Random Forest ML Ensemble Engine',
      category: 'Core AI Model',
      description: 'Supervised Random Forest Classifier trained on 25 years of Himalayan convective cloudburst events. Generates calibrated class probabilities and tree variance confidence bounds.',
      techStack: 'Scikit-Learn / ONNX Runtime C++ Engine',
      latency: '15 ms',
      status: 'ACTIVE',
      metrics: ['150 Decision Trees', 'F1-Score: 0.934', 'AUC-ROC: 0.961'],
      icon: Cpu,
    },
    {
      id: 5,
      title: '5. Explainable AI (XAI) & Risk Classification',
      category: 'Decision Logic',
      description: 'TreeSHAP additive feature attribution breaks down exact percentage contributions. Dynamic risk categorizer assigns Green (0–30%), Yellow (31–50%), Orange (51–75%), and Red (76–100%).',
      techStack: 'TreeSHAP / Custom Attribution Framework',
      latency: '8 ms',
      status: 'OPTIMAL',
      metrics: ['SHAP Factor Breakdown', 'Confidence Bound: 91%', '0–100% Normalized Scale'],
      icon: Gauge,
    },
    {
      id: 6,
      title: '6. Common Alerting Protocol (CAP) & Dispatch',
      category: 'Action Layer',
      description: 'Generates OASIS CAP-XML digital warning packets dispatched via automated REST webhooks to SDMA/DDMA war rooms, NDRF Battalion bases, and Telecom SMS gateway relays.',
      techStack: 'OASIS CAP v1.2 / WebSockets / Telecom SMS Gateways',
      latency: '42 ms',
      status: 'ACTIVE',
      metrics: ['DDMA Direct Webhook', 'NDRF Base Alert', 'SMS Gateway API'],
      icon: AlertOctagon,
    },
  ];

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col p-5 space-y-6">
      {/* Header */}
      <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-800/80 text-cyan-400">
            <Workflow className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
              End-to-End Data Pipeline & AI Architecture
              <span className="px-2 py-0.5 rounded-full text-xs font-mono bg-cyan-500/20 text-cyan-400 border border-cyan-500/40">
                Sub-150ms Full Latency
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              High-throughput streaming architecture from sensor ingestion to automated disaster authority alerting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Continuous Real-Time Ingestion</span>
        </div>
      </div>

      {/* Interactive Visual Flowchart */}
      <div className="space-y-4">
        {pipelineNodes.map((node, index) => {
          const Icon = node.icon;
          const isSelected = selectedNode === node.id;

          return (
            <div key={node.id} className="space-y-2">
              <div
                onClick={() => setSelectedNode(node.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-lg ${
                  isSelected
                    ? 'bg-slate-950 border-cyan-500 ring-2 ring-cyan-500/30'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/40'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-bold text-sm sm:text-base text-white">
                          {node.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                          {node.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{node.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono">
                    <div className="text-right hidden sm:block">
                      <div className="text-[10px] text-slate-400">Processing Latency</div>
                      <div className="text-emerald-400 font-bold">{node.latency}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      {node.status}
                    </span>
                  </div>
                </div>

                {/* Expanded Details when selected */}
                {isSelected && (
                  <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-bold text-cyan-300">Architecture Spec:</span>
                      <p className="text-slate-300 mt-1 leading-relaxed">{node.description}</p>
                      <div className="mt-2 text-slate-400 font-mono text-[11px]">
                        Engine: <span className="text-white">{node.techStack}</span>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 font-mono">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Operational Telemetry:
                      </span>
                      {node.metrics.map((m, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Animated Arrow Connector */}
              {index < pipelineNodes.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <div className="flex items-center gap-1 text-[11px] font-mono text-cyan-400/80 bg-slate-900 px-3 py-0.5 rounded-full border border-slate-800">
                    <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
                    <span>Real-Time Stream Buffer</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
