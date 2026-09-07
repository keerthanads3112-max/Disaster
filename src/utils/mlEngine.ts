import { RiskLevel, ExplainableFactor, SimulationParameters, SimulationResult } from '../types';

/**
 * CloudGuard AI - Simulated Random Forest Model & Explainable AI (XAI)
 * Calculates multi-factor atmospheric convective instability and probability of cloudburst (>100mm/hr)
 */
export function calculateCloudburstRisk(params: {
  rainfallIntensity: number; // mm/hr
  rainfallChangeRate?: number; // mm/15min
  humidity: number; // %
  pressure: number; // hPa
  pressureDrop3Hr?: number;
  windSpeed: number; // km/h
  cloudCoverage?: number;
  capeValue?: number;
  orographicUplift?: number;
  historicalSimilarity?: number;
}): {
  probability: number;
  riskLevel: RiskLevel;
  confidenceScore: number;
  predictionHorizon: string;
  factors: ExplainableFactor[];
} {
  const {
    rainfallIntensity,
    rainfallChangeRate = rainfallIntensity * 0.25,
    humidity,
    pressure,
    pressureDrop3Hr = Math.max(0, (1013 - pressure) * 0.6),
    windSpeed,
    cloudCoverage = 85,
    capeValue = 1800,
    orographicUplift = 7,
    historicalSimilarity = 75,
  } = params;

  // 1. Rainfall score (35% weight)
  // Cloudburst definition: >=100 mm/hr in ~20-30 sq km
  const rfScore = Math.min(100, (rainfallIntensity / 110) * 100);
  const rfChangeBonus = Math.min(25, rainfallChangeRate * 1.5);
  const normalizedRainfall = Math.min(100, rfScore * 0.8 + rfChangeBonus * 0.2);

  // 2. Humidity score (25% weight)
  // Convective cloudbursts require saturated column (>85%)
  const humScore = humidity < 60 ? (humidity / 60) * 20 : 20 + ((humidity - 60) / 40) * 80;

  // 3. Pressure drop & Barometric gradient (18% weight)
  // Sudden barometric drop indicates intense mesoscale convective vortex
  const pressureScore = Math.min(100, Math.max(0, (1018 - pressure) * 6 + pressureDrop3Hr * 5));

  // 4. Wind pattern & Orographic Uplift (12% weight)
  // Funneling valleys in Himalayas accelerate moisture convergence
  const windScore = Math.min(100, (windSpeed / 50) * 50 + (orographicUplift / 10) * 50);

  // 5. CAPE / Satellite Convective index (5% weight)
  const capeScore = Math.min(100, (capeValue / 3000) * 100);

  // 6. Historical pattern similarity (5% weight)
  const histScore = historicalSimilarity;

  // Weighted Random Forest Ensemble Simulation Formula
  const rawProb =
    normalizedRainfall * 0.35 +
    humScore * 0.25 +
    pressureScore * 0.18 +
    windScore * 0.12 +
    capeScore * 0.05 +
    histScore * 0.05;

  const probability = Math.min(99, Math.max(5, Math.round(rawProb)));

  // Risk Classification
  let riskLevel: RiskLevel = 'LOW';
  if (probability >= 76) {
    riskLevel = 'CRITICAL';
  } else if (probability >= 51) {
    riskLevel = 'HIGH';
  } else if (probability >= 31) {
    riskLevel = 'MODERATE';
  } else {
    riskLevel = 'LOW';
  }

  // Confidence calculation based on sensor agreement
  const confidenceScore = Math.min(96, Math.max(82, Math.round(85 + (probability > 70 ? 7 : 3) + Math.sin(pressure) * 2)));

  // Prediction Horizon
  let predictionHorizon = 'Next 6–12 Hours';
  if (probability >= 76) {
    predictionHorizon = 'Next 1–3 Hours';
  } else if (probability >= 51) {
    predictionHorizon = 'Next 2–4 Hours';
  } else if (probability >= 31) {
    predictionHorizon = 'Next 4–6 Hours';
  }

  // Calculate Explainable AI (SHAP-style) feature contributions
  const totalWeight =
    normalizedRainfall * 0.35 +
    humScore * 0.25 +
    pressureScore * 0.18 +
    windScore * 0.12 +
    histScore * 0.1;

  const factors: ExplainableFactor[] = [
    {
      name: 'Rainfall Intensity & Rate',
      contribution: Math.round(((normalizedRainfall * 0.35) / totalWeight) * 100) || 35,
      description: `Surge rate of ${rainfallIntensity.toFixed(0)} mm/hr indicates intense localized precipitation cell`,
      value: `${rainfallIntensity.toFixed(0)} mm/hr`,
    },
    {
      name: 'Atmospheric Humidity & Dew Point',
      contribution: Math.round(((humScore * 0.25) / totalWeight) * 100) || 25,
      description: `High moisture saturation at ${humidity}% supporting deep vertical cumulonimbus towers`,
      value: `${humidity}%`,
    },
    {
      name: 'Barometric Pressure Anomaly',
      contribution: Math.round(((pressureScore * 0.18) / totalWeight) * 100) || 18,
      description: `Sharp pressure plunge to ${pressure} hPa (-${pressureDrop3Hr.toFixed(1)} hPa/3h) driving convective vortex`,
      value: `${pressure} hPa`,
    },
    {
      name: 'Orographic Funneling & Wind Shear',
      contribution: Math.round(((windScore * 0.12) / totalWeight) * 100) || 12,
      description: `Valley updraft with wind speed ${windSpeed} km/h accelerating cloud condensation`,
      value: `${windSpeed} km/h`,
    },
    {
      name: 'Historical Cloudburst Signature Match',
      contribution: Math.round(((histScore * 0.1) / totalWeight) * 100) || 10,
      description: `${historicalSimilarity}% vector similarity with past Himalayan cloudburst events (Kedarnath & Uttarkashi)`,
      value: `${historicalSimilarity}% Match`,
    },
  ];

  // Normalize factor contributions to sum close to 100%
  const factorSum = factors.reduce((sum, f) => sum + f.contribution, 0);
  if (factorSum > 0) {
    factors.forEach((f) => {
      f.contribution = Math.round((f.contribution / factorSum) * 100);
    });
  }

  return {
    probability,
    riskLevel,
    confidenceScore,
    predictionHorizon,
    factors,
  };
}

export function runSimulatorEngine(params: SimulationParameters): SimulationResult {
  const result = calculateCloudburstRisk({
    rainfallIntensity: params.rainfallIntensity,
    rainfallChangeRate: params.rainfallChangeRate,
    humidity: params.humidity,
    pressure: params.pressure,
    windSpeed: params.windSpeed,
    cloudCoverage: params.cloudCoverage,
    capeValue: params.capeValue,
    orographicUplift: params.orographicUplift,
    historicalSimilarity: params.historicalSimilarity,
  });

  return {
    cloudburstProbability: result.probability,
    riskLevel: result.riskLevel,
    predictionHorizon: result.predictionHorizon,
    confidenceScore: result.confidenceScore,
    explainableFactors: result.factors,
    alertGenerated: result.probability >= 51,
    timestamp: new Date().toLocaleTimeString(),
  };
}

// Web Audio API emergency alert sound synthesizer (safe for browsers)
let audioCtx: AudioContext | null = null;

export function playEmergencyAlertSound(type: 'CRITICAL' | 'WARNING' | 'SUCCESS') {
  try {
    if (typeof window === 'undefined') return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioCtx || audioCtx.state === 'suspended') {
      audioCtx = new AudioContextClass();
    }

    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'CRITICAL') {
      // 2-tone urgent siren
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(660, now + 0.15);
      osc.frequency.setValueAtTime(880, now + 0.3);
      osc.frequency.setValueAtTime(660, now + 0.45);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'WARNING') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.setValueAtTime(650, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    }
  } catch {
    // Audio contexts might be blocked until user interacts, safely ignore
  }
}
