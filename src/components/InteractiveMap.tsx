import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  MapPin,
  Layers,
  Eye,
  Radio,
  AlertTriangle,
  Wind,
  Droplets,
  Thermometer,
  Gauge,
  Activity,
  Maximize2,
  Sparkles,
  Search,
  Navigation,
  Car,
  X,
  Compass,
  Route
} from 'lucide-react';
import { LocationWeather, RiskLevel } from '../types';
import {
  PRESET_INDIAN_LOCATIONS,
  LocationGeoMatch,
  searchLocationsOnlineAndOffline,
  synthesizeLocationWeather,
  POPULAR_DRIVING_ROUTES
} from '../utils/locationService';

interface InteractiveMapProps {
  locations: LocationWeather[];
  selectedLocation: LocationWeather;
  onSelectLocation: (loc: LocationWeather) => void;
  onAddAndSelectLocation?: (loc: LocationWeather) => void;
  onGenerateEarlyWarning: (loc: LocationWeather) => void;
  userGPSCoords?: { lat: number; lon: number; speed?: number; heading?: number } | null;
  isLiveGPSEnabled?: boolean;
  onToggleLiveGPS?: () => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  locations,
  selectedLocation,
  onSelectLocation,
  onAddAndSelectLocation,
  onGenerateEarlyWarning,
  userGPSCoords,
  isLiveGPSEnabled = false,
  onToggleLiveGPS,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const radarCircleLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.LayerGroup | null>(null);
  const userGpsMarkerRef = useRef<L.Marker | null>(null);

  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [showRadarOverlay, setShowRadarOverlay] = useState<boolean>(true);
  const [showHighwayCorridors, setShowHighwayCorridors] = useState<boolean>(true);
  const [mapViewMode, setMapViewMode] = useState<'DARK' | 'TERRAIN'>('DARK');

  // In-map search
  const [mapSearchQuery, setMapSearchQuery] = useState<string>('');
  const [mapSearchResults, setMapSearchResults] = useState<LocationGeoMatch[]>([]);
  const [showMapSearchResults, setShowMapSearchResults] = useState<boolean>(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Center around Northern India / Uttarakhand Himalayan Zone
      const map = L.map(mapContainerRef.current, {
        center: [30.5, 78.5],
        zoom: 6,
        minZoom: 4,
        maxZoom: 15,
        zoomControl: false,
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Dark CartoDB Tiles for high-tech disaster control aesthetic
      const tileUrl =
        mapViewMode === 'DARK'
          ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
          : 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';

      const baseTile = L.tileLayer(tileUrl, {
        attribution: '&copy; CartoDB &copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      (map as unknown as { _baseTile: L.TileLayer })._baseTile = baseTile;

      const radarGroup = L.layerGroup().addTo(map);
      radarCircleLayerRef.current = radarGroup;

      const routeGroup = L.layerGroup().addTo(map);
      routeLayerRef.current = routeGroup;

      // Click on map to add/inspect custom point
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        const newLocation = synthesizeLocationWeather({
          name: `Sector (${lat.toFixed(2)}°N, ${lng.toFixed(2)}°E)`,
          district: 'Map Direct Pin',
          state: lat > 28 ? 'Himalayan Corridor' : 'India',
          latitude: lat,
          longitude: lng,
          elevationMeters: lat > 28 ? 1650 : 600,
        });

        if (onAddAndSelectLocation) {
          onAddAndSelectLocation(newLocation);
        } else {
          onSelectLocation(newLocation);
        }
      });

      mapInstanceRef.current = map;
    }
  }, []);

  // Update base tile when view mode changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current as unknown as { _baseTile?: L.TileLayer };
    if (map._baseTile) {
      mapInstanceRef.current.removeLayer(map._baseTile);
    }
    const tileUrl =
      mapViewMode === 'DARK'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';

    const newTile = L.tileLayer(tileUrl, {
      attribution: '&copy; CartoDB &copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
    map._baseTile = newTile;
  }, [mapViewMode]);

  // Render & Update Markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Clear old markers
    Object.keys(markersRef.current).forEach((id) => {
      markersRef.current[id]?.remove();
    });
    markersRef.current = {};

    if (radarCircleLayerRef.current) {
      radarCircleLayerRef.current.clearLayers();
    }

    const filtered = locations.filter((loc) => {
      if (filterRisk === 'ALL') return true;
      return loc.riskLevel === filterRisk;
    });

    filtered.forEach((loc) => {
      // Determine marker color
      let colorClass = '#10b981'; // Green
      let badgeClass = 'bg-emerald-500 text-white';
      let ringColor = 'rgba(16, 185, 129, 0.4)';
      let pulseAnim = '';

      if (loc.riskLevel === 'CRITICAL') {
        colorClass = '#ef4444'; // Red
        badgeClass = 'bg-red-500 text-white';
        ringColor = 'rgba(239, 68, 68, 0.6)';
        pulseAnim = 'critical-pulse';
      } else if (loc.riskLevel === 'HIGH') {
        colorClass = '#f97316'; // Orange
        badgeClass = 'bg-orange-500 text-white';
        ringColor = 'rgba(249, 115, 22, 0.4)';
      } else if (loc.riskLevel === 'MODERATE') {
        colorClass = '#eab308'; // Yellow
        badgeClass = 'bg-yellow-500 text-slate-950 font-bold';
        ringColor = 'rgba(234, 179, 8, 0.4)';
      }

      const isSelected = selectedLocation.id === loc.id;

      // Custom HTML Marker Icon
      const customIcon = L.divIcon({
        className: 'custom-map-pin',
        html: `
          <div class="relative flex items-center justify-center cursor-pointer group">
            ${
              loc.riskLevel === 'CRITICAL'
                ? `<div class="absolute -inset-2 rounded-full bg-red-500/30 animate-ping"></div>`
                : ''
            }
            <div class="w-9 h-9 rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-125 ${pulseAnim}"
                 style="background: ${colorClass}; border: 3px solid ${
                   isSelected ? '#38bdf8' : '#ffffff'
                 }; box-shadow: 0 0 16px ${ringColor};">
              <span class="text-[11px] font-black text-white font-mono">${loc.cloudburstProbability}%</span>
            </div>
            <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded bg-slate-900/90 border border-slate-700 text-[10px] font-bold text-slate-200 shadow-md">
              ${loc.name}
            </div>
          </div>
        `,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
        popupAnchor: [0, -22],
      });

      const marker = L.marker([loc.latitude, loc.longitude], { icon: customIcon }).addTo(map);

      // Rich popup
      const popupHtml = `
        <div class="p-3.5 w-72 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-sans shadow-2xl">
          <div class="flex items-center justify-between pb-2 border-b border-slate-800">
            <div>
              <div class="text-sm font-bold text-white flex items-center gap-1.5">
                ${loc.name}
                <span class="text-[10px] text-slate-400 font-normal">(${loc.district}, ${loc.state})</span>
              </div>
              <div class="text-[10px] text-slate-400 font-mono">Elevation: ${loc.elevationMeters}m MSL</div>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${badgeClass}">
              ${loc.riskLevel}
            </span>
          </div>

          <div class="mt-2.5 grid grid-cols-2 gap-2 text-xs font-mono">
            <div class="p-1.5 rounded bg-slate-800/80 border border-slate-700/60">
              <div class="text-[10px] text-slate-400">Cloudburst Prob</div>
              <div class="text-sm font-extrabold ${
                loc.riskLevel === 'CRITICAL'
                  ? 'text-red-400'
                  : loc.riskLevel === 'HIGH'
                  ? 'text-orange-400'
                  : 'text-emerald-400'
              }">${loc.cloudburstProbability}%</div>
            </div>
            <div class="p-1.5 rounded bg-slate-800/80 border border-slate-700/60">
              <div class="text-[10px] text-slate-400">Rainfall Rate</div>
              <div class="text-sm font-extrabold text-cyan-300">${loc.rainfallIntensity} mm/h</div>
            </div>
            <div class="p-1.5 rounded bg-slate-800/80 border border-slate-700/60">
              <div class="text-[10px] text-slate-400">Relative Humidity</div>
              <div class="text-xs font-bold text-slate-200">${loc.humidity}%</div>
            </div>
            <div class="p-1.5 rounded bg-slate-800/80 border border-slate-700/60">
              <div class="text-[10px] text-slate-400">Barometric P</div>
              <div class="text-xs font-bold text-slate-200">${loc.pressure} hPa</div>
            </div>
          </div>

          <div class="mt-2 flex items-center justify-between text-[11px] text-slate-300 font-mono">
            <span>Wind: ${loc.windSpeed} km/h</span>
            <span>Temp: ${loc.temperature}°C</span>
          </div>

          <div class="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <span>Radar: <b class="text-white">${loc.radarStatus.replace(/_/g, ' ')}</b></span>
            <span>${loc.lastUpdated}</span>
          </div>

          <div class="mt-3 flex items-center gap-2">
            <button id="btn-popup-select-${loc.id}" class="flex-1 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs transition-colors shadow">
              Inspect & Analyze
            </button>
            ${
              loc.riskLevel === 'CRITICAL' || loc.riskLevel === 'HIGH'
                ? `<button id="btn-popup-warn-${loc.id}" class="py-1.5 px-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors">
                     Alert 🚨
                   </button>`
                : ''
            }
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 320 });

      marker.on('popupopen', () => {
        const selectBtn = document.getElementById(`btn-popup-select-${loc.id}`);
        if (selectBtn) {
          selectBtn.onclick = () => {
            onSelectLocation(loc);
            marker.closePopup();
          };
        }
        const warnBtn = document.getElementById(`btn-popup-warn-${loc.id}`);
        if (warnBtn) {
          warnBtn.onclick = () => {
            onGenerateEarlyWarning(loc);
            marker.closePopup();
          };
        }
      });

      marker.on('click', () => {
        onSelectLocation(loc);
      });

      markersRef.current[loc.id] = marker;

      // Radar reflectivity circular buffer overlay
      if (showRadarOverlay && radarCircleLayerRef.current) {
        if (loc.riskLevel === 'CRITICAL' || loc.riskLevel === 'HIGH') {
          const circle = L.circle([loc.latitude, loc.longitude], {
            radius: loc.riskLevel === 'CRITICAL' ? 35000 : 22000,
            color: loc.riskLevel === 'CRITICAL' ? '#ef4444' : '#f97316',
            fillColor: loc.riskLevel === 'CRITICAL' ? '#ef4444' : '#f97316',
            fillOpacity: 0.18,
            weight: 1.5,
            dashArray: '4, 4',
          });
          circle.addTo(radarCircleLayerRef.current);
        }
      }
    });
  }, [locations, filterRisk, showRadarOverlay, selectedLocation]);

  // Render Highway Corridor Polylines
  useEffect(() => {
    if (!mapInstanceRef.current || !routeLayerRef.current) return;
    routeLayerRef.current.clearLayers();

    if (showHighwayCorridors) {
      POPULAR_DRIVING_ROUTES.forEach((route) => {
        const latlngs: [number, number][] = route.waypoints.map((w) => [w.latitude, w.longitude]);
        const polyline = L.polyline(latlngs, {
          color: '#6366f1',
          weight: 4,
          opacity: 0.75,
          dashArray: '6, 6',
        });
        polyline.bindTooltip(
          `<div class="text-xs font-bold text-white font-sans">${route.highwayCode}: ${route.name}</div>`,
          { sticky: true }
        );
        polyline.addTo(routeLayerRef.current!);
      });
    }
  }, [showHighwayCorridors]);

  // Live GPS User Vehicle Marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    if (userGpsMarkerRef.current) {
      userGpsMarkerRef.current.remove();
      userGpsMarkerRef.current = null;
    }

    if (userGPSCoords) {
      const vehicleIcon = L.divIcon({
        className: 'vehicle-gps-marker',
        html: `
          <div class="relative flex items-center justify-center">
            <div class="absolute -inset-3 rounded-full bg-cyan-400/40 animate-ping"></div>
            <div class="w-10 h-10 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-2xl border-2 border-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
            </div>
            <div class="absolute -bottom-5 whitespace-nowrap px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-500 text-[10px] font-bold text-cyan-300">
              Live Vehicle GPS
            </div>
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      const userMarker = L.marker([userGPSCoords.lat, userGPSCoords.lon], { icon: vehicleIcon }).addTo(map);
      userGpsMarkerRef.current = userMarker;
    }
  }, [userGPSCoords]);

  // Center on selected location
  const handleFocusSelected = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([selectedLocation.latitude, selectedLocation.longitude], 9, {
      duration: 1.2,
    });
    const marker = markersRef.current[selectedLocation.id];
    if (marker) {
      marker.openPopup();
    }
  };

  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([30.5, 78.5], 6.5, { duration: 1.0 });
  };

  // Map Search execution
  const handleMapSearch = async (q: string) => {
    setMapSearchQuery(q);
    if (!q.trim()) {
      setShowMapSearchResults(false);
      return;
    }
    const res = await searchLocationsOnlineAndOffline(q);
    setMapSearchResults(res);
    setShowMapSearchResults(true);
  };

  const handleSelectMapSearchResult = (res: LocationGeoMatch) => {
    const synthesized = synthesizeLocationWeather({
      name: res.name,
      district: res.district,
      state: res.state,
      latitude: res.latitude,
      longitude: res.longitude,
      elevationMeters: res.elevationMeters,
    });

    if (onAddAndSelectLocation) {
      onAddAndSelectLocation(synthesized);
    } else {
      onSelectLocation(synthesized);
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([res.latitude, res.longitude], 9, { duration: 1.2 });
    }

    setShowMapSearchResults(false);
    setMapSearchQuery('');
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden flex flex-col">
      {/* Header Bar */}
      <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-800/60 text-cyan-400">
              <MapPin className="w-4 h-4" />
            </span>
            <h2 className="font-display font-bold text-base sm:text-lg text-white">
              Real-Time Cloudburst Risk Map & Highway Transit Corridors
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
              Live Mesh Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time geospatial visualization of convective atmospheric cells, mountain passes & highway transit corridors
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Risk Filter */}
          <div className="flex items-center rounded-lg bg-slate-800/90 border border-slate-700 p-0.5 text-xs">
            {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setFilterRisk(lvl)}
                className={`px-2 py-1 rounded-md transition-colors text-[11px] font-semibold ${
                  filterRisk === lvl
                    ? lvl === 'CRITICAL'
                      ? 'bg-red-600 text-white shadow'
                      : lvl === 'HIGH'
                      ? 'bg-orange-600 text-white shadow'
                      : lvl === 'MODERATE'
                      ? 'bg-yellow-500 text-slate-950 shadow font-bold'
                      : lvl === 'LOW'
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>

          {/* Highway Corridors Overlay */}
          <button
            onClick={() => setShowHighwayCorridors(!showHighwayCorridors)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              showHighwayCorridors
                ? 'bg-indigo-950/80 border-indigo-600 text-indigo-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Route className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Highways & Passes</span>
          </button>

          {/* Radar Overlay Toggle */}
          <button
            onClick={() => setShowRadarOverlay(!showRadarOverlay)}
            className={`px-2.5 py-1 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              showRadarOverlay
                ? 'bg-cyan-950/80 border-cyan-600 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Doppler Buffer</span>
          </button>

          {/* Terrain / Dark Mode */}
          <button
            onClick={() => setMapViewMode(mapViewMode === 'DARK' ? 'TERRAIN' : 'DARK')}
            className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-medium flex items-center gap-1"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>{mapViewMode === 'DARK' ? 'Dark Matrix' : 'Topography'}</span>
          </button>

          {/* Focus Selected */}
          <button
            onClick={handleFocusSelected}
            className="px-2.5 py-1 rounded-lg bg-cyan-950/80 border border-cyan-700 hover:bg-cyan-900 text-cyan-300 text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Focus {selectedLocation.name}</span>
          </button>

          <button
            onClick={handleResetView}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Map Stage */}
      <div className="relative w-full h-[460px] lg:h-[540px] bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Floating Search Bar directly on Map HUD */}
        <div className="absolute top-4 left-4 z-[400] w-72 sm:w-80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
            <input
              type="text"
              value={mapSearchQuery}
              onChange={(e) => handleMapSearch(e.target.value)}
              placeholder="Search location on map..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700 text-xs text-white placeholder-slate-400 shadow-xl focus:border-cyan-500 outline-none"
            />
            {mapSearchQuery && (
              <button
                onClick={() => {
                  setMapSearchQuery('');
                  setShowMapSearchResults(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown on Map */}
          {showMapSearchResults && mapSearchResults.length > 0 && (
            <div className="mt-1.5 max-h-56 overflow-y-auto rounded-xl bg-slate-900/95 backdrop-blur-md border border-slate-700 shadow-2xl p-1.5 space-y-1 text-xs">
              {mapSearchResults.map((res) => (
                <button
                  key={`${res.name}-${res.latitude}`}
                  onClick={() => handleSelectMapSearchResult(res)}
                  className="w-full text-left p-2 rounded-lg hover:bg-slate-800 flex items-center justify-between text-slate-200 transition-colors"
                >
                  <div>
                    <div className="font-bold text-white">{res.name}</div>
                    <div className="text-[10px] text-slate-400">
                      {res.district}, {res.state} • {res.elevationMeters}m MSL
                    </div>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-bold">Inspect →</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Map Click Directive Hint */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[400] hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-[11px] text-slate-300">
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Tip: Tap anywhere on the map to analyze cloudburst risk for that point</span>
        </div>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-[400] p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl text-xs space-y-1.5 max-w-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between pb-1 border-b border-slate-800">
            <span>Risk Classification</span>
            <span className="text-[9px] text-cyan-400 font-mono">0–100% Scale</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
              <span className="text-slate-300">Low: 0–30%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm shadow-yellow-400/50" />
              <span className="text-slate-300">Moderate: 31–50%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500 shadow-sm shadow-orange-500/50" />
              <span className="text-slate-300">High: 51–75%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50 animate-pulse" />
              <span className="text-red-400 font-bold">Critical: 76–100%</span>
            </div>
          </div>
        </div>

        {/* Live Radar Overlay HUD */}
        <div className="absolute top-4 right-4 z-[400] hidden sm:flex items-center gap-3 p-2.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-slate-700/80 text-xs font-mono">
          <div className="relative w-8 h-8 rounded-full border border-cyan-500/40 bg-slate-950 flex items-center justify-center overflow-hidden">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent radar-sweep" />
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400">Doppler Sweep Active</div>
            <div className="text-white font-bold">Mukteshwar DWR (150km)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
