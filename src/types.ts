export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface InfrastructureRisk {
  roadsAtRisk: number;
  bridgesAtRisk: number;
  powerInfrastructure: number;
  hospitals: number;
  schools: number;
  telecomTowers: number;
  keyAssets: string[];
}

export interface ExplainableFactor {
  name: string;
  contribution: number; // percentage, e.g. 35
  description: string;
  value: string;
}

export interface LocationWeather {
  id: string;
  name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  rainfallIntensity: number; // mm/hr
  rainfallChangeRate: number; // mm/15min
  humidity: number; // %
  temperature: number; // °C
  pressure: number; // hPa
  pressureDrop3Hr: number; // hPa drop in 3hr
  windSpeed: number; // km/h
  windDirection: string;
  cloudCoverage: number; // %
  cloudTopHeightKm: number;
  convectiveAvailablePotentialEnergy: number; // CAPE in J/kg
  radarStatus: 'OPTIMAL' | 'SCANNING' | 'CONVECTIVE_CELL_DETECTED' | 'EXTREME_REFLECTIVITY';
  radarReflectivityDbz: number;
  satelliteActivity: 'NORMAL' | 'HIGH_CONVECTION' | 'MESOSCALE_CELL';
  stationId: string;
  lastUpdated: string;
  cloudburstProbability: number; // 0 - 100
  riskLevel: RiskLevel;
  confidenceScore: number; // e.g. 91%
  predictionHorizon: string; // "Next 1–3 Hours"
  historicalSimilarity: number; // %
  infrastructure: InfrastructureRisk;
  explainableFactors: ExplainableFactor[];
  weatherTrend: {
    time: string;
    rainfall: number;
    humidity: number;
    pressure: number;
    probability: number;
    temperature: number;
  }[];
}

export interface EarlyWarningAlert {
  id: string;
  locationId: string;
  locationName: string;
  district: string;
  state: string;
  riskLevel: RiskLevel;
  probability: number;
  rainfallIntensity: number;
  expectedWindow: string;
  timestamp: string;
  recommendedAction: string;
  status: 'PENDING' | 'SENT' | 'ACKNOWLEDGED' | 'DISPATCHED' | 'RESOLVED';
  recipients: string[];
  severity: 'RED' | 'ORANGE' | 'YELLOW';
}

export interface HistoricalCloudburstEvent {
  id: string;
  name: string;
  location: string;
  state: string;
  date: string;
  peakRainfallMmHr: number;
  humidityPeak: number;
  pressureDropHpa: number;
  durationHours: number;
  impactSummary: string;
  casualties: number;
  similarityScore: number;
  meteorologicalSignature: {
    rainfallWeight: number;
    humidityWeight: number;
    pressureDropWeight: number;
    orographicWeight: number;
  };
}

export interface SystemHealthComponent {
  name: string;
  category: string;
  status: 'CONNECTED' | 'ACTIVE' | 'OPTIMAL' | 'DEGRADED';
  latencyMs: number;
  lastPing: string;
  telemetry: string;
}

export interface SimulationParameters {
  rainfallIntensity: number; // 0 - 200 mm/hr
  rainfallChangeRate: number; // 0 - 50 mm/15min
  humidity: number; // 30 - 100%
  temperature: number; // 5 - 45 °C
  pressure: number; // 960 - 1025 hPa
  windSpeed: number; // 0 - 100 km/h
  cloudCoverage: number; // 0 - 100%
  cloudTopHeight: number; // 5 - 20 km
  capeValue: number; // 200 - 4500 J/kg
  orographicUplift: number; // 1 - 10 index
  historicalSimilarity: number; // 10 - 99%
}

export interface SimulationResult {
  cloudburstProbability: number;
  riskLevel: RiskLevel;
  predictionHorizon: string;
  confidenceScore: number;
  explainableFactors: ExplainableFactor[];
  alertGenerated: boolean;
  timestamp: string;
}

export type ActiveTab =
  | 'dashboard'
  | 'map'
  | 'driving-route'
  | 'prediction'
  | 'weather-intel'
  | 'trend-charts'
  | 'early-warnings'
  | 'simulator'
  | 'historical'
  | 'data-pipeline'
  | 'authority'
  | 'infrastructure'
  | 'settings';
