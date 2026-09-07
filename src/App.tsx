import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { KPICards } from './components/KPICards';
import { InteractiveMap } from './components/InteractiveMap';
import { AIPredictionPanel } from './components/AIPredictionPanel';
import { WeatherIntelPanel } from './components/WeatherIntelPanel';
import { TrendCharts } from './components/TrendCharts';
import { EarlyWarningCenter } from './components/EarlyWarningCenter';
import { PredictionSimulator } from './components/PredictionSimulator';
import { HistoricalAnalysis } from './components/HistoricalAnalysis';
import { DataPipelineArchitecture } from './components/DataPipelineArchitecture';
import { AuthorityControlCenter } from './components/AuthorityControlCenter';
import { InfrastructureRisk } from './components/InfrastructureRisk';
import { SystemHealthPanel } from './components/SystemHealthPanel';
import { DrivingRouteAssistant } from './components/DrivingRouteAssistant';

import {
  initialLocations,
  initialAlerts,
  sampleHistoricalEvents,
  systemHealthServices
} from './data/sampleLocations';
import {
  LocationWeather,
  EarlyWarningAlert,
  ActiveTab,
  SimulationResult,
  SimulationParameters,
  RiskLevel
} from './types';
import { playEmergencyAlertSound, calculateCloudburstRisk } from './utils/mlEngine';
import { reverseGeocodeCoords, synthesizeLocationWeather } from './utils/locationService';
import confetti from 'canvas-confetti';
import {
  ShieldAlert,
  Sparkles,
  Flame,
  CheckCircle2,
  Bell,
  X,
  Send,
  AlertTriangle,
  Radio,
  FileDown,
  Navigation,
  Car
} from 'lucide-react';

export default function App() {
  // State
  const [locations, setLocations] = useState<LocationWeather[]>(initialLocations);
  const [selectedLocation, setSelectedLocation] = useState<LocationWeather>(initialLocations[0]); // Default to Uttarkashi (87% Critical)
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>(initialAlerts);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(true);

  // Live GPS & Driving Transit Mode
  const [isLiveGPSEnabled, setIsLiveGPSEnabled] = useState<boolean>(false);
  const [userGPSCoords, setUserGPSCoords] = useState<{
    lat: number;
    lon: number;
    speed?: number;
    heading?: number;
  } | null>(null);

  const [toast, setToast] = useState<{
    id: string;
    title: string;
    message: string;
    type: 'CRITICAL' | 'SUCCESS' | 'WARNING';
    actionLabel?: string;
    onAction?: () => void;
  } | null>(null);

  const watchIdRef = useRef<number | null>(null);

  // Handle Live GPS Tracking toggle
  const handleToggleLiveGPS = () => {
    if (!isLiveGPSEnabled) {
      if (!navigator.geolocation) {
        showToast('GPS Unsupported', 'Geolocation is not supported by your browser.', 'WARNING');
        return;
      }

      setIsLiveGPSEnabled(true);
      showToast('Live Vehicle GPS Activated', 'Continuously monitoring vehicle path for cloudburst hazards.', 'SUCCESS');

      watchIdRef.current = navigator.geolocation.watchPosition(
        async (pos) => {
          const { latitude, longitude, speed, heading } = pos.coords;
          setUserGPSCoords({
            lat: latitude,
            lon: longitude,
            speed: speed ? Math.round(speed * 3.6) : 42,
            heading: heading || 45,
          });

          // Reverse geocode and update location
          const geo = await reverseGeocodeCoords(latitude, longitude);
          const liveLoc = synthesizeLocationWeather({
            name: geo.name,
            district: geo.district,
            state: geo.state,
            latitude,
            longitude,
            elevationMeters: geo.elevation,
            isLiveGPS: true,
          });

          handleAddAndSelectLocation(liveLoc);

          // If entering high risk, trigger audio alert
          if (liveLoc.riskLevel === 'CRITICAL' || liveLoc.riskLevel === 'HIGH') {
            triggerAudio('CRITICAL');
            showToast(
              `⚠️ HIGH CLOUDBURST RISK AHEAD`,
              `Vehicle entered high risk convective corridor at ${liveLoc.name} (${liveLoc.cloudburstProbability}% Risk).`,
              'CRITICAL',
              'Open Driving Guard',
              () => setActiveTab('driving-route')
            );
          }
        },
        (err) => {
          // Fallback simulation coordinates for Himalayan drive
          const simLat = 30.2858 + (Math.random() - 0.5) * 0.05;
          const simLon = 78.9806 + (Math.random() - 0.5) * 0.05;
          setUserGPSCoords({ lat: simLat, lon: simLon, speed: 48, heading: 60 });
          const liveLoc = synthesizeLocationWeather({
            name: 'Rudraprayag Highway (GPS Sim)',
            district: 'Rudraprayag',
            state: 'Uttarakhand',
            latitude: simLat,
            longitude: simLon,
            elevationMeters: 895,
            isLiveGPS: true,
          });
          handleAddAndSelectLocation(liveLoc);
        },
        { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
      );
    } else {
      setIsLiveGPSEnabled(false);
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      showToast('Live Vehicle GPS Deactivated', 'Switched back to manual location monitoring.', 'SUCCESS');
    }
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Helper to add dynamically searched/detected location to the pool and select it
  const handleAddAndSelectLocation = (newLoc: LocationWeather) => {
    setLocations((prev) => {
      const exists = prev.some((l) => l.id === newLoc.id || l.name === newLoc.name);
      if (exists) {
        return prev.map((l) => (l.id === newLoc.id || l.name === newLoc.name ? newLoc : l));
      }
      return [newLoc, ...prev];
    });
    setSelectedLocation(newLoc);
  };

  // Trigger audio if enabled
  const triggerAudio = (type: 'CRITICAL' | 'WARNING' | 'SUCCESS') => {
    if (isAudioEnabled) {
      playEmergencyAlertSound(type);
    }
  };

  // Helper to show rich toast
  const showToast = (
    title: string,
    message: string,
    type: 'CRITICAL' | 'SUCCESS' | 'WARNING' = 'CRITICAL',
    actionLabel?: string,
    onAction?: () => void
  ) => {
    const id = Date.now().toString();
    setToast({ id, title, message, type, actionLabel, onAction });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 6000);
  };

  // 1. Generate Early Warning Action
  const handleGenerateEarlyWarning = (loc: LocationWeather) => {
    triggerAudio('CRITICAL');

    const alertId = `CB-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';

    const newAlert: EarlyWarningAlert = {
      id: alertId,
      locationId: loc.id,
      locationName: loc.name,
      district: loc.district,
      state: loc.state,
      riskLevel: loc.riskLevel,
      probability: loc.cloudburstProbability,
      rainfallIntensity: loc.rainfallIntensity,
      expectedWindow: loc.predictionHorizon || 'Next 1–3 Hours',
      timestamp: now,
      recommendedAction:
        loc.riskLevel === 'CRITICAL'
          ? `Immediate civil evacuation of ${loc.name} drainage basin floodplains. Halt vehicular movements on connecting highways.`
          : `Activate local storm drainage pumps and place NDRF Quick Response Teams on standby in ${loc.name}.`,
      status: 'SENT',
      recipients: [
        'District Disaster Management Authority (DDMA)',
        'State Disaster Response Force (SDRF)',
        'National Disaster Response Force (NDRF 8th Bn)',
        'Common Alerting Protocol (CAP SMS Gateway)',
      ],
      severity: loc.riskLevel === 'CRITICAL' ? 'RED' : loc.riskLevel === 'HIGH' ? 'ORANGE' : 'YELLOW',
    };

    setAlerts((prev) => [newAlert, ...prev]);

    // Confetti effect
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#ef4444', '#f97316', '#38bdf8'],
      });
    } catch {
      // ignore
    }

    showToast(
      `🚨 Early Warning Generated: ${loc.name}`,
      `Cloudburst probability reached ${loc.cloudburstProbability}%. Alert ID ${alertId} broadcasted to DDMA, NDRF, & SDRF.`,
      'CRITICAL',
      'View in Alert Center',
      () => setActiveTab('early-warnings')
    );
  };

  // 2. Acknowledge Alert Action
  const handleAcknowledgeAlert = (alertId: string) => {
    triggerAudio('SUCCESS');
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'ACKNOWLEDGED' } : a))
    );
    showToast('Alert Acknowledged', `Alert ID ${alertId} acknowledged by Incident Commander.`, 'SUCCESS');
  };

  // 3. Dispatch Teams Action
  const handleDispatchTeams = (alertId: string) => {
    triggerAudio('SUCCESS');
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'DISPATCHED' } : a))
    );
    showToast(
      'NDRF Response Teams Dispatched',
      `Rescue squads and inflatable Gemini boats mobilized for Alert ID ${alertId}.`,
      'SUCCESS',
      'Open War Room',
      () => setActiveTab('authority')
    );
  };

  // 4. Trigger alert from simulator
  const handleSimulatorAlert = (result: SimulationResult, params: SimulationParameters) => {
    triggerAudio('CRITICAL');
    const alertId = `SIM-CB-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST';

    const newAlert: EarlyWarningAlert = {
      id: alertId,
      locationId: selectedLocation.id,
      locationName: `${selectedLocation.name} (Simulated)`,
      district: selectedLocation.district,
      state: selectedLocation.state,
      riskLevel: result.riskLevel,
      probability: result.cloudburstProbability,
      rainfallIntensity: params.rainfallIntensity,
      expectedWindow: result.predictionHorizon,
      timestamp: now,
      recommendedAction: `Simulator Triggered: Extreme convective instability detected (${params.rainfallIntensity} mm/h rainfall rate).`,
      status: 'SENT',
      recipients: ['DDMA Simulator Channel', 'NDRF Sandbox Feed'],
      severity: result.riskLevel === 'CRITICAL' ? 'RED' : 'ORANGE',
    };

    setAlerts((prev) => [newAlert, ...prev]);

    showToast(
      `Sandbox Warning Dispatched: ${result.cloudburstProbability}% Risk`,
      `Simulation test generated Alert ID ${alertId}.`,
      'WARNING',
      'View Alert Center',
      () => setActiveTab('early-warnings')
    );
  };

  const handleSelectHighRiskFromCard = () => {
    const highest = locations.reduce((prev, curr) =>
      prev.cloudburstProbability > curr.cloudburstProbability ? prev : curr
    );
    setSelectedLocation(highest);
    setActiveTab('prediction');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 max-w-md p-4 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl shadow-black/80 flex items-start gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`p-2 rounded-xl shrink-0 ${
              toast.type === 'CRITICAL'
                ? 'bg-red-950 text-red-400 border border-red-800'
                : toast.type === 'SUCCESS'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-amber-950 text-amber-400 border border-amber-800'
            }`}
          >
            {toast.type === 'CRITICAL' ? (
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            ) : toast.type === 'SUCCESS' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1">
            <div className="font-display font-bold text-sm text-white">{toast.title}</div>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{toast.message}</p>
            {toast.actionLabel && toast.onAction && (
              <button
                onClick={() => {
                  toast.onAction?.();
                  setToast(null);
                }}
                className="mt-2 text-xs font-bold text-cyan-400 hover:text-cyan-300 underline"
              >
                {toast.actionLabel} →
              </button>
            )}
          </div>
          <button
            onClick={() => setToast(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        selectedLocation={selectedLocation}
        locations={locations}
        onSelectLocation={setSelectedLocation}
        onAddAndSelectLocation={handleAddAndSelectLocation}
        alerts={alerts}
        onNavigateTab={setActiveTab}
        isAudioEnabled={isAudioEnabled}
        onToggleAudio={() => setIsAudioEnabled(!isAudioEnabled)}
        isLiveGPSEnabled={isLiveGPSEnabled}
        onToggleLiveGPS={handleToggleLiveGPS}
        userGPSCoords={userGPSCoords}
      />

      {/* Main Body with Sidebar + Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeAlertsCount={alerts.filter((a) => a.riskLevel === 'CRITICAL' && a.status !== 'RESOLVED').length}
        />

        {/* Content Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 bg-slate-950 bg-grid-pattern">
          {/* Quick Breadcrumb / Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-800/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Current View:</span>
              <span className="font-bold text-cyan-300 uppercase tracking-wider font-mono">
                {activeTab.replace('-', ' ')}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">
                Focused Zone: <b className="text-white">{selectedLocation.name}</b> ({selectedLocation.state})
              </span>
              {isLiveGPSEnabled && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[10px] border border-emerald-500/40">
                  <Navigation className="w-3 h-3 animate-spin" />
                  Vehicle GPS Active
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('driving-route')}
                className="text-xs font-bold text-indigo-300 hover:text-indigo-200 flex items-center gap-1.5 bg-indigo-950/60 px-3 py-1 rounded-lg border border-indigo-700/60"
              >
                <Car className="w-3.5 h-3.5" />
                <span>Highway Route Guard</span>
              </button>

              <button
                onClick={() => setActiveTab('simulator')}
                className="text-xs font-bold text-cyan-300 hover:text-cyan-200 flex items-center gap-1.5 bg-cyan-950/60 px-3 py-1 rounded-lg border border-cyan-700/60"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Simulator Lab</span>
              </button>
            </div>
          </div>

          {/* TAB 1: MAIN DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Dynamic KPI Cards */}
              <KPICards
                locations={locations}
                alerts={alerts}
                onSelectHighRisk={handleSelectHighRiskFromCard}
              />

              {/* Central Grid: Interactive Map + AIPredictionPanel */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-7">
                  <InteractiveMap
                    locations={locations}
                    selectedLocation={selectedLocation}
                    onSelectLocation={setSelectedLocation}
                    onAddAndSelectLocation={handleAddAndSelectLocation}
                    onGenerateEarlyWarning={handleGenerateEarlyWarning}
                    userGPSCoords={userGPSCoords}
                    isLiveGPSEnabled={isLiveGPSEnabled}
                    onToggleLiveGPS={handleToggleLiveGPS}
                  />
                </div>
                <div className="xl:col-span-5">
                  <AIPredictionPanel
                    location={selectedLocation}
                    onGenerateEarlyWarning={handleGenerateEarlyWarning}
                    onOpenSimulator={() => setActiveTab('simulator')}
                  />
                </div>
              </div>

              {/* Weather Intelligence Data Feeds */}
              <WeatherIntelPanel location={selectedLocation} />

              {/* Weather Trend Escalation Charts */}
              <TrendCharts location={selectedLocation} />

              {/* Active Early Warning Center */}
              <EarlyWarningCenter
                alerts={alerts}
                selectedLocation={selectedLocation}
                onGenerateEarlyWarning={handleGenerateEarlyWarning}
                onAcknowledgeAlert={handleAcknowledgeAlert}
                onDispatchTeams={handleDispatchTeams}
                onViewLocationOnMap={(locId) => {
                  const target = locations.find((l) => l.id === locId);
                  if (target) setSelectedLocation(target);
                  setActiveTab('map');
                }}
              />
            </div>
          )}

          {/* TAB 2: INTERACTIVE RISK MAP */}
          {activeTab === 'map' && (
            <div className="space-y-6">
              <InteractiveMap
                locations={locations}
                selectedLocation={selectedLocation}
                onSelectLocation={setSelectedLocation}
                onAddAndSelectLocation={handleAddAndSelectLocation}
                onGenerateEarlyWarning={handleGenerateEarlyWarning}
                userGPSCoords={userGPSCoords}
                isLiveGPSEnabled={isLiveGPSEnabled}
                onToggleLiveGPS={handleToggleLiveGPS}
              />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AIPredictionPanel
                  location={selectedLocation}
                  onGenerateEarlyWarning={handleGenerateEarlyWarning}
                  onOpenSimulator={() => setActiveTab('simulator')}
                />
                <WeatherIntelPanel location={selectedLocation} />
              </div>
            </div>
          )}

          {/* TAB 3: HIGHWAY & DRIVING ROUTE GUARD */}
          {activeTab === 'driving-route' && (
            <div className="space-y-6">
              <DrivingRouteAssistant
                selectedLocation={selectedLocation}
                onSelectLocation={setSelectedLocation}
                onNavigateTab={setActiveTab}
                onGenerateEarlyWarning={handleGenerateEarlyWarning}
                userGPSCoords={userGPSCoords}
                isLiveGPSEnabled={isLiveGPSEnabled}
                onToggleLiveGPS={handleToggleLiveGPS}
              />
            </div>
          )}

          {/* TAB 4: AI PREDICTION ENGINE */}
          {activeTab === 'prediction' && (
            <div className="space-y-6">
              <AIPredictionPanel
                location={selectedLocation}
                onGenerateEarlyWarning={handleGenerateEarlyWarning}
                onOpenSimulator={() => setActiveTab('simulator')}
              />
              <TrendCharts location={selectedLocation} />
            </div>
          )}

          {/* TAB 5: WEATHER INTELLIGENCE */}
          {activeTab === 'weather-intel' && (
            <div className="space-y-6">
              <WeatherIntelPanel location={selectedLocation} />
              <TrendCharts location={selectedLocation} />
            </div>
          )}

          {/* TAB 6: WEATHER TREND CHARTS */}
          {activeTab === 'trend-charts' && (
            <div className="space-y-6">
              <TrendCharts location={selectedLocation} />
              <AIPredictionPanel
                location={selectedLocation}
                onGenerateEarlyWarning={handleGenerateEarlyWarning}
                onOpenSimulator={() => setActiveTab('simulator')}
              />
            </div>
          )}

          {/* TAB 7: EARLY WARNINGS */}
          {activeTab === 'early-warnings' && (
            <div className="space-y-6">
              <EarlyWarningCenter
                alerts={alerts}
                selectedLocation={selectedLocation}
                onGenerateEarlyWarning={handleGenerateEarlyWarning}
                onAcknowledgeAlert={handleAcknowledgeAlert}
                onDispatchTeams={handleDispatchTeams}
                onViewLocationOnMap={(locId) => {
                  const target = locations.find((l) => l.id === locId);
                  if (target) setSelectedLocation(target);
                  setActiveTab('map');
                }}
              />
            </div>
          )}

          {/* TAB 8: AI PREDICTION SIMULATOR */}
          {activeTab === 'simulator' && (
            <div className="space-y-6">
              <PredictionSimulator onTriggerAlertNotification={handleSimulatorAlert} />
            </div>
          )}

          {/* TAB 9: HISTORICAL ANALYSIS */}
          {activeTab === 'historical' && (
            <div className="space-y-6">
              <HistoricalAnalysis currentLocation={selectedLocation} />
            </div>
          )}

          {/* TAB 10: DATA PIPELINE ARCHITECTURE */}
          {activeTab === 'data-pipeline' && (
            <div className="space-y-6">
              <DataPipelineArchitecture />
            </div>
          )}

          {/* TAB 11: AUTHORITY CONTROL CENTER */}
          {activeTab === 'authority' && (
            <div className="space-y-6">
              <AuthorityControlCenter
                alerts={alerts}
                locations={locations}
                onAcknowledge={handleAcknowledgeAlert}
                onDispatch={handleDispatchTeams}
                onViewMap={(locId) => {
                  const target = locations.find((l) => l.id === locId);
                  if (target) setSelectedLocation(target);
                  setActiveTab('map');
                }}
              />
            </div>
          )}

          {/* TAB 12: INFRASTRUCTURE RISK */}
          {activeTab === 'infrastructure' && (
            <div className="space-y-6">
              <InfrastructureRisk
                location={selectedLocation}
                onSelectLocation={setSelectedLocation}
              />
            </div>
          )}

          {/* TAB 13: SETTINGS & HEALTH */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <SystemHealthPanel />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
