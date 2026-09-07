import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldAlert,
  Radio,
  Bell,
  Volume2,
  VolumeX,
  Sparkles,
  ChevronDown,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Activity,
  Layers,
  Search,
  MapPin,
  Navigation,
  Car,
  Compass,
  PlusCircle,
  X,
  Loader2
} from 'lucide-react';
import { LocationWeather, EarlyWarningAlert, ActiveTab } from '../types';
import {
  PRESET_INDIAN_LOCATIONS,
  LocationGeoMatch,
  searchLocationsOnlineAndOffline,
  synthesizeLocationWeather,
  reverseGeocodeCoords
} from '../utils/locationService';

interface NavbarProps {
  selectedLocation: LocationWeather;
  locations: LocationWeather[];
  onSelectLocation: (loc: LocationWeather) => void;
  onAddAndSelectLocation: (loc: LocationWeather) => void;
  alerts: EarlyWarningAlert[];
  onNavigateTab: (tab: ActiveTab) => void;
  isAudioEnabled: boolean;
  onToggleAudio: () => void;
  isLiveGPSEnabled: boolean;
  onToggleLiveGPS: () => void;
  userGPSCoords: { lat: number; lon: number; speed?: number; heading?: number } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedLocation,
  locations,
  onSelectLocation,
  onAddAndSelectLocation,
  alerts,
  onNavigateTab,
  isAudioEnabled,
  onToggleAudio,
  isLiveGPSEnabled,
  onToggleLiveGPS,
  userGPSCoords,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  // Search & Geocoding state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<LocationGeoMatch[]>(PRESET_INDIAN_LOCATIONS.slice(0, 12));
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isLocatingUser, setIsLocatingUser] = useState<boolean>(false);
  const [customCoordInput, setCustomCoordInput] = useState<{ lat: string; lon: string; name: string }>({
    lat: '',
    lon: '',
    name: '',
  });
  const [showCoordForm, setShowCoordForm] = useState<boolean>(false);

  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Search handler with debounce
  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);

    if (!q.trim()) {
      filterPresetLocations(selectedCategory);
      return;
    }

    setIsSearching(true);
    searchDebounceRef.current = setTimeout(async () => {
      const results = await searchLocationsOnlineAndOffline(q);
      setSearchResults(results);
      setIsSearching(false);
    }, 250);
  };

  const filterPresetLocations = (category: string) => {
    setSelectedCategory(category);
    if (category === 'ALL') {
      setSearchResults(PRESET_INDIAN_LOCATIONS.slice(0, 20));
    } else {
      setSearchResults(PRESET_INDIAN_LOCATIONS.filter((l) => l.category === category));
    }
  };

  // Select matched location
  const handleSelectMatchedLocation = (match: LocationGeoMatch) => {
    // Check if already in locations list
    const existing = locations.find(
      (l) =>
        l.name.toLowerCase() === match.name.toLowerCase() ||
        (Math.abs(l.latitude - match.latitude) < 0.05 && Math.abs(l.longitude - match.longitude) < 0.05)
    );

    if (existing) {
      onSelectLocation(existing);
    } else {
      const synthesized = synthesizeLocationWeather({
        name: match.name,
        district: match.district,
        state: match.state,
        latitude: match.latitude,
        longitude: match.longitude,
        elevationMeters: match.elevationMeters,
      });
      onAddAndSelectLocation(synthesized);
    }

    setShowLocationDropdown(false);
    setSearchQuery('');
  };

  // Get current browser GPS location
  const handleDetectCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsLocatingUser(false);
        const { latitude, longitude, speed, heading } = pos.coords;
        const geoInfo = await reverseGeocodeCoords(latitude, longitude);

        const liveLocation = synthesizeLocationWeather({
          name: geoInfo.name,
          district: geoInfo.district,
          state: geoInfo.state,
          latitude,
          longitude,
          elevationMeters: geoInfo.elevation,
          isLiveGPS: true,
        });

        onAddAndSelectLocation(liveLocation);
        setShowLocationDropdown(false);
      },
      (err) => {
        setIsLocatingUser(false);
        // Fallback to high-altitude Himalayan route if permission denied
        const fallback = synthesizeLocationWeather({
          name: 'My Himalayan Location (GPS Simulated)',
          district: 'Uttarkashi',
          state: 'Uttarakhand',
          latitude: 30.7268 + (Math.random() - 0.5) * 0.2,
          longitude: 78.4354 + (Math.random() - 0.5) * 0.2,
          elevationMeters: 1450,
          isLiveGPS: true,
        });
        onAddAndSelectLocation(fallback);
        setShowLocationDropdown(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Add custom coordinate point
  const handleAddCustomCoords = (e: React.FormEvent) => {
    e.preventDefault();
    const lat = parseFloat(customCoordInput.lat);
    const lon = parseFloat(customCoordInput.lon);
    if (isNaN(lat) || isNaN(lon)) return;

    const name = customCoordInput.name.trim() || `Coord (${lat.toFixed(2)}, ${lon.toFixed(2)})`;
    const synthesized = synthesizeLocationWeather({
      name,
      district: 'Custom Coordinate Zone',
      state: 'India',
      latitude: lat,
      longitude: lon,
      elevationMeters: lat > 28 ? 1600 : 500,
    });

    onAddAndSelectLocation(synthesized);
    setShowLocationDropdown(false);
    setShowCoordForm(false);
    setCustomCoordInput({ lat: '', lon: '', name: '' });
  };

  const criticalAlertsCount = alerts.filter(
    (a) => a.riskLevel === 'CRITICAL' && a.status !== 'RESOLVED'
  ).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Top Ministry / Early Warning Banner */}
      <div className="bg-slate-950 px-4 py-1 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/60 text-cyan-400 font-semibold text-[11px]">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            National Cloudburst Early Warning Network
          </span>
          <span className="hidden md:inline text-slate-500">•</span>
          <span className="hidden md:inline text-slate-400">
            Ministry of Earth Sciences & Disaster Management Early Warning Grid
          </span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>{timeStr || '14:30:00 IST'}</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            AWS Telemetry Live
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between gap-3">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3 cursor-pointer shrink-0" onClick={() => onNavigateTab('dashboard')}>
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-lg shadow-cyan-900/40 border border-cyan-400/30">
            <ShieldAlert className="w-5 h-5 text-cyan-100" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-lg text-white tracking-tight">
                CloudGuard <span className="text-cyan-400 font-mono">AI</span>
              </span>
              <span className="hidden xl:flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30 items-center gap-1">
                <Radio className="w-2.5 h-2.5 animate-pulse text-red-400" />
                LIVE MONITORING
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              AI-Based Cloudburst Prediction & Early Warning System
            </p>
          </div>
        </div>

        {/* Center / Location Selector & Search Trigger */}
        <div className="relative flex-1 max-w-xl">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              className="flex-1 flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 hover:border-cyan-500/70 transition-all text-xs font-medium text-slate-200 shadow-inner"
            >
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                <span className="text-slate-400 hidden md:inline">Zone:</span>
                <span className="text-white font-bold truncate">{selectedLocation.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                    selectedLocation.riskLevel === 'CRITICAL'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : selectedLocation.riskLevel === 'HIGH'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                      : selectedLocation.riskLevel === 'MODERATE'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {selectedLocation.cloudburstProbability}% Risk
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Search / GPS</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </button>

            {/* Quick GPS button directly next to bar */}
            <button
              onClick={handleDetectCurrentLocation}
              disabled={isLocatingUser}
              title="Detect My Live GPS Location"
              className="p-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-emerald-500 text-emerald-400 transition-colors shrink-0"
            >
              {isLocatingUser ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Location & GPS Search Modal / Dropdown */}
          {showLocationDropdown && (
            <div className="absolute left-0 mt-2 w-full sm:w-[480px] max-h-[560px] overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl z-50 flex flex-col animate-in fade-in zoom-in-95 duration-200">
              {/* Search Bar Input */}
              <div className="p-3 bg-slate-950 border-b border-slate-800 space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search any Indian town, mountain pass, or highway (e.g. Manali, Kedarnath, Munnar)..."
                    className="w-full pl-9 pr-8 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-xs text-white placeholder-slate-400 outline-none"
                    autoFocus
                  />
                  {searchQuery && (
                    <button
                      onClick={() => handleSearchChange('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Quick Actions: Live GPS & Vehicle Mode */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDetectCurrentLocation}
                    disabled={isLocatingUser}
                    className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-950/80 border border-emerald-700/80 hover:bg-emerald-900/80 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    {isLocatingUser ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Navigation className="w-3.5 h-3.5" />
                    )}
                    <span>Access My Live GPS Location</span>
                  </button>

                  <button
                    onClick={() => {
                      onNavigateTab('driving-route');
                      setShowLocationDropdown(false);
                    }}
                    className="py-1.5 px-2.5 rounded-lg bg-indigo-950/80 border border-indigo-700/80 hover:bg-indigo-900/80 text-indigo-300 text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Car className="w-3.5 h-3.5" />
                    <span>Driving Transit Mode</span>
                  </button>
                </div>

                {/* Category Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-[10px] font-medium no-scrollbar">
                  {[
                    { id: 'ALL', label: 'All Regions' },
                    { id: 'HIMALAYAN_VALLEY', label: 'Himalayas & Valleys' },
                    { id: 'PILGRIMAGE_ROUTE', label: 'Pilgrim Routes' },
                    { id: 'HIGHWAY_PASS', label: 'Mountain Passes' },
                    { id: 'WESTERN_GHATS', label: 'Western Ghats' },
                    { id: 'METRO_CITY', label: 'Metros' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => filterPresetLocations(cat.id)}
                      className={`px-2 py-0.5 rounded-md whitespace-nowrap transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-cyan-600 text-white font-bold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location Results List */}
              <div className="flex-1 overflow-y-auto max-h-72 p-2 divide-y divide-slate-800/80">
                {isSearching ? (
                  <div className="py-8 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
                    <span>Searching geospatial database & OpenStreetMap...</span>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No matching location found. Try custom coordinates below.
                  </div>
                ) : (
                  searchResults.map((item) => (
                    <button
                      key={`${item.name}-${item.latitude}`}
                      onClick={() => handleSelectMatchedLocation(item)}
                      className="w-full text-left p-2.5 rounded-xl flex items-center justify-between hover:bg-slate-800/90 transition-colors group"
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 group-hover:bg-cyan-950 transition-colors mt-0.5">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            {item.name}
                            <span className="text-[10px] text-slate-400 font-normal">
                              ({item.district}, {item.state})
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5 font-mono">
                            <span>{item.elevationMeters}m MSL</span>
                            {item.highway && (
                              <span className="px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 font-semibold">
                                {item.highway}
                              </span>
                            )}
                            <span className="text-slate-500">
                              {item.latitude.toFixed(2)}°N, {item.longitude.toFixed(2)}°E
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-cyan-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        Select →
                      </span>
                    </button>
                  ))
                )}
              </div>

              {/* Bottom: Custom Coordinates Toggle */}
              <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-xs">
                {!showCoordForm ? (
                  <button
                    onClick={() => setShowCoordForm(true)}
                    className="w-full py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Enter Custom Latitude & Longitude</span>
                  </button>
                ) : (
                  <form onSubmit={handleAddCustomCoords} className="space-y-2">
                    <div className="text-[11px] font-bold text-slate-300">Custom Coordinate Point</div>
                    <div className="grid grid-cols-3 gap-2">
                      <input
                        type="text"
                        placeholder="Location Name"
                        value={customCoordInput.name}
                        onChange={(e) => setCustomCoordInput({ ...customCoordInput, name: e.target.value })}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                      <input
                        type="number"
                        step="any"
                        placeholder="Latitude"
                        required
                        value={customCoordInput.lat}
                        onChange={(e) => setCustomCoordInput({ ...customCoordInput, lat: e.target.value })}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                      <input
                        type="number"
                        step="any"
                        placeholder="Longitude"
                        required
                        value={customCoordInput.lon}
                        onChange={(e) => setCustomCoordInput({ ...customCoordInput, lon: e.target.value })}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowCoordForm(false)}
                        className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-[11px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px]"
                      >
                        Analyze Coordinates
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Vehicle Transit Mode Navigation Link */}
          <button
            onClick={() => onNavigateTab('driving-route')}
            title="Highway Transit & Driving Route Guard"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 border border-indigo-700/80 hover:bg-indigo-900 text-indigo-300 text-xs font-bold transition-all shadow"
          >
            <Car className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Highway Route Guard</span>
            <span className="sm:hidden">Transit</span>
          </button>

          {/* Audio Chime Toggle */}
          <button
            onClick={onToggleAudio}
            title={isAudioEnabled ? 'Audio Alert Siren: ON' : 'Audio Alert Siren: MUTED'}
            className={`p-2 rounded-lg border transition-colors ${
              isAudioEnabled
                ? 'bg-cyan-950/60 border-cyan-700 text-cyan-400'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Notification Center */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {criticalAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white font-bold text-[9px] flex items-center justify-center animate-bounce">
                  {criticalAlertsCount}
                </span>
              )}
            </button>

            {/* Notifications Flyout */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl z-50 p-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">Emergency Warning Broadcasts</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{alerts.length} Active</span>
                </div>
                <div className="mt-2 max-h-72 overflow-y-auto space-y-2">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        onNavigateTab('early-warnings');
                        setShowNotifications(false);
                      }}
                      className={`p-2.5 rounded-lg border text-xs cursor-pointer hover:bg-slate-800 transition-all ${
                        alert.riskLevel === 'CRITICAL'
                          ? 'bg-red-950/30 border-red-800/60'
                          : alert.riskLevel === 'HIGH'
                          ? 'bg-orange-950/30 border-orange-800/60'
                          : 'bg-amber-950/30 border-amber-800/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              alert.riskLevel === 'CRITICAL'
                                ? 'bg-red-500 animate-ping'
                                : 'bg-orange-400'
                            }`}
                          />
                          {alert.locationName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">{alert.timestamp}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-300 line-clamp-2">
                        {alert.recommendedAction}
                      </p>
                      <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono">
                        <span className="text-red-400 font-bold">
                          Prob: {alert.probability}% | {alert.rainfallIntensity} mm/h
                        </span>
                        <span className="text-cyan-400 underline">View Warning →</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800 text-center">
                  <button
                    onClick={() => {
                      onNavigateTab('early-warnings');
                      setShowNotifications(false);
                    }}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
                  >
                    Open Full Early Warning & Alert Center →
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Authority Profile Badge */}
          <div
            onClick={() => onNavigateTab('authority')}
            className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs cursor-pointer hover:border-cyan-500/50 transition-colors"
          >
            <div className="w-6 h-6 rounded-full bg-cyan-600/30 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
              <UserCheck className="w-3.5 h-3.5" />
            </div>
            <div className="text-left">
              <div className="text-[11px] font-bold text-white">DDMA Officer</div>
              <div className="text-[9px] text-emerald-400 font-mono">NDMA Auth L-4</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
