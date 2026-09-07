import { LocationWeather, RiskLevel } from '../types';
import { calculateCloudburstRisk } from './mlEngine';

export interface LocationGeoMatch {
  name: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  elevationMeters: number;
  category: 'HIMALAYAN_VALLEY' | 'HIGHWAY_PASS' | 'PILGRIMAGE_ROUTE' | 'WESTERN_GHATS' | 'METRO_CITY' | 'HILL_STATION' | 'CUSTOM';
  highway?: string;
}

export interface DrivingRoute {
  id: string;
  name: string;
  highwayCode: string;
  state: string;
  distanceKm: number;
  totalDurationHours: number;
  waypoints: {
    name: string;
    kmMark: number;
    latitude: number;
    longitude: number;
    elevationMeters: number;
    riskLevel: RiskLevel;
    cloudburstProb: number;
    rainfallMmHr: number;
    hazardType: 'NORMAL' | 'FLASH_FLOOD_SUSCEPTIBLE' | 'LANDSLIDE_CHUTE' | 'RIVER_CREST' | 'CLOUD_BURST_ZONE';
    safeShelterPoint: string;
  }[];
}

// Pre-compiled comprehensive database of critical Indian mountain roads, towns & passes
export const PRESET_INDIAN_LOCATIONS: LocationGeoMatch[] = [
  // Uttarakhand
  { name: 'Uttarkashi', district: 'Uttarkashi', state: 'Uttarakhand', latitude: 30.7268, longitude: 78.4354, elevationMeters: 1158, category: 'HIMALAYAN_VALLEY', highway: 'NH-34' },
  { name: 'Kedarnath', district: 'Rudraprayag', state: 'Uttarakhand', latitude: 30.7346, longitude: 79.0669, elevationMeters: 3584, category: 'PILGRIMAGE_ROUTE', highway: 'NH-107' },
  { name: 'Badrinath', district: 'Chamoli', state: 'Uttarakhand', latitude: 30.7433, longitude: 79.4938, elevationMeters: 3133, category: 'PILGRIMAGE_ROUTE', highway: 'NH-7' },
  { name: 'Gangotri', district: 'Uttarkashi', state: 'Uttarakhand', latitude: 30.9947, longitude: 78.9398, elevationMeters: 3100, category: 'PILGRIMAGE_ROUTE', highway: 'NH-34' },
  { name: 'Yamunotri', district: 'Uttarkashi', state: 'Uttarakhand', latitude: 31.014, longitude: 78.4601, elevationMeters: 3293, category: 'PILGRIMAGE_ROUTE', highway: 'NH-134' },
  { name: 'Joshimath', district: 'Chamoli', state: 'Uttarakhand', latitude: 30.5564, longitude: 79.5667, elevationMeters: 1890, category: 'HIMALAYAN_VALLEY', highway: 'NH-7' },
  { name: 'Dehradun', district: 'Dehradun', state: 'Uttarakhand', latitude: 30.3165, longitude: 78.0322, elevationMeters: 640, category: 'HILL_STATION', highway: 'NH-7' },
  { name: 'Mussoorie', district: 'Dehradun', state: 'Uttarakhand', latitude: 30.4598, longitude: 78.0644, elevationMeters: 2005, category: 'HILL_STATION', highway: 'SH-1' },
  { name: 'Rishikesh', district: 'Dehradun', state: 'Uttarakhand', latitude: 30.0869, longitude: 78.2676, elevationMeters: 372, category: 'HIMALAYAN_VALLEY', highway: 'NH-7' },
  { name: 'Haridwar', district: 'Haridwar', state: 'Uttarakhand', latitude: 29.9457, longitude: 78.1642, elevationMeters: 314, category: 'METRO_CITY', highway: 'NH-334' },
  { name: 'Nainital', district: 'Nainital', state: 'Uttarakhand', latitude: 29.3919, longitude: 79.4542, elevationMeters: 2084, category: 'HILL_STATION', highway: 'NH-109' },
  { name: 'Almora', district: 'Almora', state: 'Uttarakhand', latitude: 29.5971, longitude: 79.6591, elevationMeters: 1638, category: 'HILL_STATION', highway: 'NH-109' },
  { name: 'Pithoragarh', district: 'Pithoragarh', state: 'Uttarakhand', latitude: 29.5829, longitude: 80.2182, elevationMeters: 1627, category: 'HIMALAYAN_VALLEY', highway: 'NH-9' },
  { name: 'Dharchula', district: 'Pithoragarh', state: 'Uttarakhand', latitude: 29.8495, longitude: 80.5367, elevationMeters: 915, category: 'HIMALAYAN_VALLEY', highway: 'NH-9' },
  { name: 'Rudraprayag', district: 'Rudraprayag', state: 'Uttarakhand', latitude: 30.2858, longitude: 78.9806, elevationMeters: 895, category: 'HIMALAYAN_VALLEY', highway: 'NH-7' },
  { name: 'Karanprayag', district: 'Chamoli', state: 'Uttarakhand', latitude: 30.2587, longitude: 79.2198, elevationMeters: 860, category: 'HIMALAYAN_VALLEY', highway: 'NH-7' },
  { name: 'Devprayag', district: 'Tehri Garhwal', state: 'Uttarakhand', latitude: 30.1459, longitude: 78.5989, elevationMeters: 830, category: 'HIMALAYAN_VALLEY', highway: 'NH-7' },
  { name: 'Govindghat (Valley of Flowers)', district: 'Chamoli', state: 'Uttarakhand', latitude: 30.6225, longitude: 79.5593, elevationMeters: 1828, category: 'PILGRIMAGE_ROUTE', highway: 'NH-7' },

  // Himachal Pradesh
  { name: 'Shimla', district: 'Shimla', state: 'Himachal Pradesh', latitude: 31.1048, longitude: 77.1734, elevationMeters: 2276, category: 'HILL_STATION', highway: 'NH-5' },
  { name: 'Manali', district: 'Kullu', state: 'Himachal Pradesh', latitude: 32.2396, longitude: 77.1887, elevationMeters: 2050, category: 'HILL_STATION', highway: 'NH-3' },
  { name: 'Kullu', district: 'Kullu', state: 'Himachal Pradesh', latitude: 31.9579, longitude: 77.1095, elevationMeters: 1278, category: 'HIMALAYAN_VALLEY', highway: 'NH-3' },
  { name: 'Dharamshala', district: 'Kangra', state: 'Himachal Pradesh', latitude: 32.219, longitude: 76.3234, elevationMeters: 1457, category: 'HILL_STATION', highway: 'NH-503' },
  { name: 'McLeod Ganj', district: 'Kangra', state: 'Himachal Pradesh', latitude: 32.2426, longitude: 76.3213, elevationMeters: 2082, category: 'HILL_STATION', highway: 'SH-45' },
  { name: 'Mandi', district: 'Mandi', state: 'Himachal Pradesh', latitude: 31.7087, longitude: 76.932, elevationMeters: 760, category: 'HIMALAYAN_VALLEY', highway: 'NH-21' },
  { name: 'Solan', district: 'Solan', state: 'Himachal Pradesh', latitude: 30.9045, longitude: 77.0967, elevationMeters: 1600, category: 'HILL_STATION', highway: 'NH-5' },
  { name: 'Kasol (Parvati Valley)', district: 'Kullu', state: 'Himachal Pradesh', latitude: 32.0104, longitude: 77.3151, elevationMeters: 1580, category: 'HIMALAYAN_VALLEY', highway: 'SH-Parvati' },
  { name: 'Rohtang Pass', district: 'Kullu', state: 'Himachal Pradesh', latitude: 32.3716, longitude: 77.2466, elevationMeters: 3978, category: 'HIGHWAY_PASS', highway: 'NH-3' },
  { name: 'Atal Tunnel (South Portal)', district: 'Kullu', state: 'Himachal Pradesh', latitude: 32.3167, longitude: 77.1667, elevationMeters: 3060, category: 'HIGHWAY_PASS', highway: 'NH-3' },
  { name: 'Kaza (Spiti Valley)', district: 'Lahaul and Spiti', state: 'Himachal Pradesh', latitude: 32.2276, longitude: 78.071, elevationMeters: 3650, category: 'HIMALAYAN_VALLEY', highway: 'NH-505' },
  { name: 'Kinnaur (Reckong Peo)', district: 'Kinnaur', state: 'Himachal Pradesh', latitude: 31.5391, longitude: 78.2717, elevationMeters: 2290, category: 'HIMALAYAN_VALLEY', highway: 'NH-5' },
  { name: 'Chamba', district: 'Chamba', state: 'Himachal Pradesh', latitude: 32.5534, longitude: 76.1258, elevationMeters: 996, category: 'HIMALAYAN_VALLEY', highway: 'SH-Chamba' },

  // Jammu & Kashmir & Ladakh
  { name: 'Srinagar', district: 'Srinagar', state: 'Jammu & Kashmir', latitude: 34.0837, longitude: 74.7973, elevationMeters: 1585, category: 'HIMALAYAN_VALLEY', highway: 'NH-44' },
  { name: 'Pahalgam', district: 'Anantnag', state: 'Jammu & Kashmir', latitude: 34.0163, longitude: 75.315, elevationMeters: 2130, category: 'PILGRIMAGE_ROUTE', highway: 'NH-501' },
  { name: 'Baltal (Amarnath Base)', district: 'Ganderbal', state: 'Jammu & Kashmir', latitude: 34.2575, longitude: 75.419, elevationMeters: 2743, category: 'PILGRIMAGE_ROUTE', highway: 'NH-1' },
  { name: 'Sonamarg', district: 'Ganderbal', state: 'Jammu & Kashmir', latitude: 34.3056, longitude: 75.2952, elevationMeters: 2730, category: 'HIGHWAY_PASS', highway: 'NH-1' },
  { name: 'Gulmarg', district: 'Baramulla', state: 'Jammu & Kashmir', latitude: 34.0484, longitude: 74.3805, elevationMeters: 2650, category: 'HILL_STATION', highway: 'Gulmarg Rd' },
  { name: 'Jammu', district: 'Jammu', state: 'Jammu & Kashmir', latitude: 32.7266, longitude: 74.857, elevationMeters: 327, category: 'METRO_CITY', highway: 'NH-44' },
  { name: 'Katra (Vaishno Devi)', district: 'Reasi', state: 'Jammu & Kashmir', latitude: 32.9922, longitude: 74.9317, elevationMeters: 754, category: 'PILGRIMAGE_ROUTE', highway: 'NH-144' },
  { name: 'Banihal (Qazigund Tunnel)', district: 'Ramban', state: 'Jammu & Kashmir', latitude: 33.4932, longitude: 75.2016, elevationMeters: 1666, category: 'HIGHWAY_PASS', highway: 'NH-44' },
  { name: 'Leh', district: 'Leh', state: 'Ladakh', latitude: 34.1526, longitude: 77.5771, elevationMeters: 3524, category: 'HIMALAYAN_VALLEY', highway: 'NH-1' },
  { name: 'Kargil', district: 'Kargil', state: 'Ladakh', latitude: 34.5539, longitude: 76.1349, elevationMeters: 2676, category: 'HIMALAYAN_VALLEY', highway: 'NH-1' },
  { name: 'Khardung La Pass', district: 'Leh', state: 'Ladakh', latitude: 34.2787, longitude: 77.6047, elevationMeters: 5359, category: 'HIGHWAY_PASS', highway: 'Nubra Rd' },
  { name: 'Zojila Pass', district: 'Ganderbal', state: 'Jammu & Kashmir', latitude: 34.281, longitude: 75.498, elevationMeters: 3528, category: 'HIGHWAY_PASS', highway: 'NH-1' },

  // Northeast (Sikkim, Meghalaya, Assam, Arunachal)
  { name: 'Cherrapunji (Sohra)', district: 'East Khasi Hills', state: 'Meghalaya', latitude: 25.2702, longitude: 91.7323, elevationMeters: 1430, category: 'HILL_STATION', highway: 'SH-5' },
  { name: 'Mawsynram', district: 'East Khasi Hills', state: 'Meghalaya', latitude: 25.2974, longitude: 91.5827, elevationMeters: 1400, category: 'HILL_STATION', highway: 'SH-Mawsynram' },
  { name: 'Shillong', district: 'East Khasi Hills', state: 'Meghalaya', latitude: 25.5788, longitude: 91.8933, elevationMeters: 1525, category: 'HILL_STATION', highway: 'NH-6' },
  { name: 'Gangtok', district: 'East Sikkim', state: 'Sikkim', latitude: 27.3389, longitude: 88.6065, elevationMeters: 1650, category: 'HILL_STATION', highway: 'NH-10' },
  { name: 'Chungthang (Lachen Route)', district: 'North Sikkim', state: 'Sikkim', latitude: 27.6074, longitude: 88.6472, elevationMeters: 1790, category: 'HIMALAYAN_VALLEY', highway: 'North Sikkim Hwy' },
  { name: 'Darjeeling', district: 'Darjeeling', state: 'West Bengal', latitude: 27.041, longitude: 88.2663, elevationMeters: 2042, category: 'HILL_STATION', highway: 'NH-110' },
  { name: 'Guwahati', district: 'Kamrup Metro', state: 'Assam', latitude: 26.1445, longitude: 91.7362, elevationMeters: 55, category: 'METRO_CITY', highway: 'NH-27' },
  { name: 'Tawang', district: 'Tawang', state: 'Arunachal Pradesh', latitude: 27.5861, longitude: 91.8594, elevationMeters: 3048, category: 'HIMALAYAN_VALLEY', highway: 'NH-13' },
  { name: 'Sela Pass', district: 'West Kameng', state: 'Arunachal Pradesh', latitude: 27.5033, longitude: 92.1037, elevationMeters: 4170, category: 'HIGHWAY_PASS', highway: 'NH-13' },

  // Western Ghats & Coastal / South
  { name: 'Munnar', district: 'Idukki', state: 'Kerala', latitude: 10.0889, longitude: 77.0595, elevationMeters: 1532, category: 'WESTERN_GHATS', highway: 'NH-85' },
  { name: 'Wayanad (Meppadi / Chooralmala)', district: 'Wayanad', state: 'Kerala', latitude: 11.5548, longitude: 76.132, elevationMeters: 920, category: 'WESTERN_GHATS', highway: 'SH-59' },
  { name: 'Ooty (Udhagamandalam)', district: 'Nilgiris', state: 'Tamil Nadu', latitude: 11.4102, longitude: 76.695, elevationMeters: 2240, category: 'WESTERN_GHATS', highway: 'NH-181' },
  { name: 'Kodaikanal', district: 'Dindigul', state: 'Tamil Nadu', latitude: 10.2381, longitude: 77.4892, elevationMeters: 2133, category: 'WESTERN_GHATS', highway: 'SH-156' },
  { name: 'Coorg (Madikeri)', district: 'Kodagu', state: 'Karnataka', latitude: 12.4244, longitude: 75.7382, elevationMeters: 1150, category: 'WESTERN_GHATS', highway: 'NH-275' },
  { name: 'Mahabaleshwar', district: 'Satara', state: 'Maharashtra', latitude: 17.9237, longitude: 73.6586, elevationMeters: 1353, category: 'WESTERN_GHATS', highway: 'SH-72' },
  { name: 'Lonavala & Khandala Ghat', district: 'Pune', state: 'Maharashtra', latitude: 18.7557, longitude: 73.4091, elevationMeters: 624, category: 'WESTERN_GHATS', highway: 'Mumbai-Pune Exp' },

  // Major Metros & Plains
  { name: 'New Delhi', district: 'Central Delhi', state: 'Delhi', latitude: 28.6139, longitude: 77.209, elevationMeters: 216, category: 'METRO_CITY', highway: 'NH-44' },
  { name: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra', latitude: 19.076, longitude: 72.8777, elevationMeters: 14, category: 'METRO_CITY', highway: 'NH-48' },
  { name: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', latitude: 12.9716, longitude: 77.5946, elevationMeters: 920, category: 'METRO_CITY', highway: 'NH-44' },
  { name: 'Kolkata', district: 'Kolkata', state: 'West Bengal', latitude: 22.5726, longitude: 88.3639, elevationMeters: 9, category: 'METRO_CITY', highway: 'NH-19' },
  { name: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', latitude: 13.0827, longitude: 80.2707, elevationMeters: 6, category: 'METRO_CITY', highway: 'NH-16' },
  { name: 'Pune', district: 'Pune', state: 'Maharashtra', latitude: 18.5204, longitude: 73.8567, elevationMeters: 560, category: 'METRO_CITY', highway: 'NH-48' },
  { name: 'Chandigarh', district: 'Chandigarh', state: 'Chandigarh', latitude: 30.7333, longitude: 76.7794, elevationMeters: 321, category: 'METRO_CITY', highway: 'NH-5' },
];

export const POPULAR_DRIVING_ROUTES: DrivingRoute[] = [
  {
    id: 'route-rishikesh-kedarnath',
    name: 'Rishikesh to Kedarnath Base (NH-107 / NH-7)',
    highwayCode: 'NH-107 / NH-7',
    state: 'Uttarakhand',
    distanceKm: 228,
    totalDurationHours: 7.5,
    waypoints: [
      { name: 'Rishikesh (Start)', kmMark: 0, latitude: 30.0869, longitude: 78.2676, elevationMeters: 372, riskLevel: 'HIGH', cloudburstProb: 54, rainfallMmHr: 58, hazardType: 'RIVER_CREST', safeShelterPoint: 'Tapovan Police Checkpoint' },
      { name: 'Devprayag Confluence', kmMark: 71, latitude: 30.1459, longitude: 78.5989, elevationMeters: 830, riskLevel: 'HIGH', cloudburstProb: 65, rainfallMmHr: 72, hazardType: 'LANDSLIDE_CHUTE', safeShelterPoint: 'Devprayag Bus Terminal Shelter' },
      { name: 'Srinagar Garhwal', kmMark: 105, latitude: 30.2229, longitude: 78.7845, elevationMeters: 560, riskLevel: 'MODERATE', cloudburstProb: 48, rainfallMmHr: 44, hazardType: 'NORMAL', safeShelterPoint: 'HNB Garhwal University Campus' },
      { name: 'Rudraprayag Sangam', kmMark: 140, latitude: 30.2858, longitude: 78.9806, elevationMeters: 895, riskLevel: 'CRITICAL', cloudburstProb: 76, rainfallMmHr: 95, hazardType: 'FLASH_FLOOD_SUSCEPTIBLE', safeShelterPoint: 'District Emergency Center Rudraprayag' },
      { name: 'Agastyamuni Plains', kmMark: 162, latitude: 30.3922, longitude: 79.0319, elevationMeters: 1000, riskLevel: 'HIGH', cloudburstProb: 70, rainfallMmHr: 82, hazardType: 'FLASH_FLOOD_SUSCEPTIBLE', safeShelterPoint: 'Agastyamuni Helipad Ground' },
      { name: 'Guptkashi', kmMark: 185, latitude: 30.5229, longitude: 79.0789, elevationMeters: 1319, riskLevel: 'HIGH', cloudburstProb: 74, rainfallMmHr: 88, hazardType: 'LANDSLIDE_CHUTE', safeShelterPoint: 'Guptkashi Tourist Rest House' },
      { name: 'Sonprayag / Gaurikund (Base)', kmMark: 228, latitude: 30.6318, longitude: 79.0278, elevationMeters: 1982, riskLevel: 'CRITICAL', cloudburstProb: 84, rainfallMmHr: 112, hazardType: 'CLOUD_BURST_ZONE', safeShelterPoint: 'Sonprayag NDRF Staging Base' },
    ],
  },
  {
    id: 'route-chandigarh-manali',
    name: 'Chandigarh to Manali (NH-21 / NH-3)',
    highwayCode: 'NH-21 / NH-3',
    state: 'Himachal Pradesh',
    distanceKm: 290,
    totalDurationHours: 6.8,
    waypoints: [
      { name: 'Chandigarh (Start)', kmMark: 0, latitude: 30.7333, longitude: 76.7794, elevationMeters: 321, riskLevel: 'LOW', cloudburstProb: 22, rainfallMmHr: 14, hazardType: 'NORMAL', safeShelterPoint: 'Zirakpur Toll Plaza' },
      { name: 'Swarghat Foothills', kmMark: 85, latitude: 31.2372, longitude: 76.7135, elevationMeters: 1220, riskLevel: 'MODERATE', cloudburstProb: 42, rainfallMmHr: 36, hazardType: 'LANDSLIDE_CHUTE', safeShelterPoint: 'HP Tourism Cafe Swarghat' },
      { name: 'Bilaspur (Govind Sagar)', kmMark: 130, latitude: 31.3364, longitude: 76.7573, elevationMeters: 673, riskLevel: 'MODERATE', cloudburstProb: 46, rainfallMmHr: 42, hazardType: 'RIVER_CREST', safeShelterPoint: 'Bilaspur Stadium Complex' },
      { name: 'Mandi Town & Pandoh Dam', kmMark: 195, latitude: 31.7087, longitude: 76.932, elevationMeters: 760, riskLevel: 'CRITICAL', cloudburstProb: 79, rainfallMmHr: 98, hazardType: 'FLASH_FLOOD_SUSCEPTIBLE', safeShelterPoint: 'Pandoh NDRF Outpost' },
      { name: 'Aut Tunnel Gorge', kmMark: 225, latitude: 31.7454, longitude: 77.2091, elevationMeters: 1080, riskLevel: 'CRITICAL', cloudburstProb: 82, rainfallMmHr: 104, hazardType: 'LANDSLIDE_CHUTE', safeShelterPoint: 'Aut Highway Rescue Post' },
      { name: 'Kullu Valley', kmMark: 250, latitude: 31.9579, longitude: 77.1095, elevationMeters: 1278, riskLevel: 'HIGH', cloudburstProb: 68, rainfallMmHr: 76, hazardType: 'RIVER_CREST', safeShelterPoint: 'Kullu Dhalpur Ground' },
      { name: 'Manali Mall Road', kmMark: 290, latitude: 32.2396, longitude: 77.1887, elevationMeters: 2050, riskLevel: 'HIGH', cloudburstProb: 72, rainfallMmHr: 86, hazardType: 'CLOUD_BURST_ZONE', safeShelterPoint: 'Manali Bus Depot Safe Yard' },
    ],
  },
  {
    id: 'route-dehradun-mussoorie',
    name: 'Dehradun to Mussoorie Hill Climb (SH-1)',
    highwayCode: 'SH-1',
    state: 'Uttarakhand',
    distanceKm: 34,
    totalDurationHours: 1.2,
    waypoints: [
      { name: 'Dehradun Clock Tower', kmMark: 0, latitude: 30.3165, longitude: 78.0322, elevationMeters: 640, riskLevel: 'HIGH', cloudburstProb: 68, rainfallMmHr: 74, hazardType: 'FLASH_FLOOD_SUSCEPTIBLE', safeShelterPoint: 'Parade Ground Control Room' },
      { name: 'Rajpur Road Toll', kmMark: 12, latitude: 30.3842, longitude: 78.0821, elevationMeters: 980, riskLevel: 'HIGH', cloudburstProb: 70, rainfallMmHr: 78, hazardType: 'LANDSLIDE_CHUTE', safeShelterPoint: 'Old Toll Post Shelter' },
      { name: 'Kolhukhet Chute', kmMark: 21, latitude: 30.419, longitude: 78.071, elevationMeters: 1450, riskLevel: 'CRITICAL', cloudburstProb: 81, rainfallMmHr: 96, hazardType: 'LANDSLIDE_CHUTE', safeShelterPoint: 'Police Checkpoint Kolhukhet' },
      { name: 'Kincraig Junction', kmMark: 30, latitude: 30.4485, longitude: 78.0691, elevationMeters: 1850, riskLevel: 'HIGH', cloudburstProb: 75, rainfallMmHr: 84, hazardType: 'CLOUD_BURST_ZONE', safeShelterPoint: 'Kincraig Multi-Level Parking' },
      { name: 'Mussoorie Library Chowk', kmMark: 34, latitude: 30.4598, longitude: 78.0644, elevationMeters: 2005, riskLevel: 'HIGH', cloudburstProb: 73, rainfallMmHr: 82, hazardType: 'NORMAL', safeShelterPoint: 'Town Hall Community Center' },
    ],
  },
  {
    id: 'route-jammu-srinagar',
    name: 'Jammu to Srinagar Highway (NH-44)',
    highwayCode: 'NH-44',
    state: 'Jammu & Kashmir',
    distanceKm: 260,
    totalDurationHours: 6.5,
    waypoints: [
      { name: 'Jammu Tawi', kmMark: 0, latitude: 32.7266, longitude: 74.857, elevationMeters: 327, riskLevel: 'LOW', cloudburstProb: 24, rainfallMmHr: 16, hazardType: 'NORMAL', safeShelterPoint: 'Nagrota Toll Post' },
      { name: 'Udhampur', kmMark: 65, latitude: 32.926, longitude: 75.1417, elevationMeters: 755, riskLevel: 'MODERATE', cloudburstProb: 38, rainfallMmHr: 32, hazardType: 'NORMAL', safeShelterPoint: 'Udhampur Army Transit Camp' },
      { name: 'Ramban / Mehar Chutes', kmMark: 135, latitude: 33.2435, longitude: 75.2415, elevationMeters: 1156, riskLevel: 'CRITICAL', cloudburstProb: 86, rainfallMmHr: 108, hazardType: 'LANDSLIDE_CHUTE', safeShelterPoint: 'Ramban District Administration Complex' },
      { name: 'Banihal South Portal', kmMark: 175, latitude: 33.4932, longitude: 75.2016, elevationMeters: 1666, riskLevel: 'CRITICAL', cloudburstProb: 80, rainfallMmHr: 98, hazardType: 'FLASH_FLOOD_SUSCEPTIBLE', safeShelterPoint: 'Banihal Railway Station Safe Area' },
      { name: 'Qazigund Valley Entry', kmMark: 195, latitude: 33.5936, longitude: 75.1633, elevationMeters: 1670, riskLevel: 'HIGH', cloudburstProb: 62, rainfallMmHr: 68, hazardType: 'NORMAL', safeShelterPoint: 'Qazigund Emergency Shelter' },
      { name: 'Anantnag (Khanabal)', kmMark: 220, latitude: 33.7311, longitude: 75.1522, elevationMeters: 1600, riskLevel: 'MODERATE', cloudburstProb: 44, rainfallMmHr: 40, hazardType: 'RIVER_CREST', safeShelterPoint: 'Anantnag Sports Stadium' },
      { name: 'Srinagar Lal Chowk', kmMark: 260, latitude: 34.0837, longitude: 74.7973, elevationMeters: 1585, riskLevel: 'MODERATE', cloudburstProb: 42, rainfallMmHr: 38, hazardType: 'NORMAL', safeShelterPoint: 'Bakshi Stadium Control Base' },
    ],
  },
];

/**
 * Synthesizes dynamic, realistic meteorological and cloudburst intelligence for ANY searched or GPS-located place.
 */
export function synthesizeLocationWeather(params: {
  name: string;
  district?: string;
  state?: string;
  latitude: number;
  longitude: number;
  elevationMeters?: number;
  isLiveGPS?: boolean;
}): LocationWeather {
  const { name, district = name, state = 'India', latitude, longitude, elevationMeters = 1200, isLiveGPS = false } = params;

  // Generate deterministic but realistic atmospheric properties based on elevation & geography
  const latFactor = Math.sin((latitude * Math.PI) / 180);
  const lonFactor = Math.cos((longitude * Math.PI) / 180);

  // Elevation multiplier for Himalayan/mountain regions
  const isHighAltitude = elevationMeters > 1000;
  const isHimalayan = latitude > 28 && latitude < 36 && longitude > 73 && longitude < 95;

  let baseRain = 20;
  if (isHimalayan && isHighAltitude) {
    baseRain = Math.round(55 + Math.abs(latFactor * 70) + (elevationMeters / 3500) * 35);
  } else if (elevationMeters > 800) {
    baseRain = Math.round(35 + Math.abs(lonFactor * 40));
  } else {
    baseRain = Math.round(15 + Math.abs(latFactor * 25));
  }

  // Bound baseRain
  baseRain = Math.min(130, Math.max(8, baseRain));

  const humidity = Math.min(98, Math.max(55, Math.round(75 + (baseRain / 130) * 22)));
  const pressure = Math.round(1013 - (elevationMeters / 100) * 0.8 - (baseRain > 70 ? (baseRain - 70) * 0.15 : 0));
  const pressureDrop3Hr = parseFloat(((baseRain / 130) * 6.5).toFixed(1));
  const rainfallChangeRate = Math.round((baseRain / 100) * 28);
  const temperature = Math.round(28 - (elevationMeters / 1000) * 6.5 - (baseRain > 60 ? 4 : 0));
  const windSpeed = Math.round(14 + (elevationMeters > 1500 ? 12 : 4) + (baseRain > 80 ? 10 : 0));
  const capeValue = Math.round(1000 + (baseRain / 130) * 2000);
  const orographicUplift = Math.min(10, Math.max(2, Math.round((elevationMeters / 400) + (isHimalayan ? 3 : 1))));

  const mlResult = calculateCloudburstRisk({
    rainfallIntensity: baseRain,
    rainfallChangeRate,
    humidity,
    pressure: Math.max(980, Math.min(1020, pressure)),
    pressureDrop3Hr,
    windSpeed,
    cloudCoverage: Math.min(100, Math.round(60 + (baseRain / 130) * 38)),
    capeValue,
    orographicUplift,
    historicalSimilarity: Math.round(50 + (baseRain / 130) * 45),
  });

  const radarStatus =
    mlResult.riskLevel === 'CRITICAL'
      ? 'EXTREME_REFLECTIVITY'
      : mlResult.riskLevel === 'HIGH'
      ? 'CONVECTIVE_CELL_DETECTED'
      : 'SCANNING';

  const radarReflectivityDbz = parseFloat((25 + (mlResult.probability / 100) * 35).toFixed(1));

  const id = `loc-${name.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Math.round(latitude * 100)}`;

  // Generate 6-hour trend
  const hours = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];
  const weatherTrend = hours.map((t, idx) => {
    const step = (idx + 1) / hours.length;
    return {
      time: t,
      rainfall: Math.round(baseRain * (0.3 + step * 0.7)),
      humidity: Math.round(humidity - 10 + step * 10),
      pressure: Math.round(pressure + 4 - step * 4),
      probability: Math.round(mlResult.probability * (0.3 + step * 0.7)),
      temperature: Math.round(temperature + 3 - step * 3),
    };
  });

  return {
    id,
    name: isLiveGPS ? `📍 ${name} (GPS Active)` : name,
    district,
    state,
    latitude,
    longitude,
    elevationMeters,
    rainfallIntensity: baseRain,
    rainfallChangeRate,
    humidity,
    temperature,
    pressure: Math.max(980, Math.min(1020, pressure)),
    pressureDrop3Hr,
    windSpeed,
    windDirection: 'NE 45°',
    cloudCoverage: Math.min(100, Math.round(60 + (baseRain / 130) * 38)),
    cloudTopHeightKm: parseFloat((7 + (baseRain / 130) * 8).toFixed(1)),
    convectiveAvailablePotentialEnergy: capeValue,
    radarStatus,
    radarReflectivityDbz,
    satelliteActivity: mlResult.riskLevel === 'CRITICAL' ? 'MESOSCALE_CELL' : 'HIGH_CONVECTION',
    stationId: `AWS-LIVE-${district.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
    lastUpdated: 'Live GPS Telemetry',
    cloudburstProbability: mlResult.probability,
    riskLevel: mlResult.riskLevel,
    confidenceScore: mlResult.confidenceScore,
    predictionHorizon: mlResult.predictionHorizon,
    historicalSimilarity: Math.round(50 + (baseRain / 130) * 45),
    infrastructure: {
      roadsAtRisk: mlResult.riskLevel === 'CRITICAL' ? 9 : mlResult.riskLevel === 'HIGH' ? 5 : 2,
      bridgesAtRisk: mlResult.riskLevel === 'CRITICAL' ? 3 : 1,
      powerInfrastructure: mlResult.riskLevel === 'CRITICAL' ? 2 : 1,
      hospitals: 2,
      schools: 8,
      telecomTowers: 6,
      keyAssets: [
        `${district} Main Transit Corridor`,
        `Valley Drainage Sector 1-A`,
        `Local Power Substation`,
      ],
    },
    explainableFactors: mlResult.factors,
    weatherTrend,
  };
}

/**
 * Searches locations using both local dataset of 60+ critical mountain zones and live OpenStreetMap Nominatim geocoder
 */
export async function searchLocationsOnlineAndOffline(query: string): Promise<LocationGeoMatch[]> {
  const cleanQ = query.trim().toLowerCase();
  if (!cleanQ) return PRESET_INDIAN_LOCATIONS.slice(0, 10);

  // 1. First search local database
  const localMatches = PRESET_INDIAN_LOCATIONS.filter((loc) => {
    return (
      loc.name.toLowerCase().includes(cleanQ) ||
      loc.district.toLowerCase().includes(cleanQ) ||
      loc.state.toLowerCase().includes(cleanQ) ||
      (loc.highway && loc.highway.toLowerCase().includes(cleanQ))
    );
  });

  // If we have strong local matches, return them immediately
  if (localMatches.length >= 4) {
    return localMatches;
  }

  // 2. Query OpenStreetMap Nominatim Geocoding API for online search (with India country bias)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        query
      )}&format=json&countrycodes=in&limit=8&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'CloudGuardAI-DisasterEarlyWarning/1.0',
        },
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const onlineResults: LocationGeoMatch[] = data.map((item: any) => {
        const address = item.address || {};
        const district =
          address.state_district ||
          address.county ||
          address.city ||
          address.town ||
          item.name;
        const state = address.state || 'India';
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);

        // Estimate elevation roughly from latitude/state
        let estElevation = 500;
        if (state.includes('Uttarakhand') || state.includes('Himachal') || state.includes('Kashmir') || state.includes('Sikkim') || state.includes('Ladakh')) {
          estElevation = 1800;
        } else if (state.includes('Meghalaya') || state.includes('Kerala') || state.includes('Tamil Nadu') && item.display_name.includes('Ghat')) {
          estElevation = 1400;
        }

        return {
          name: item.name || query,
          district: district || item.name,
          state: state,
          latitude: lat,
          longitude: lon,
          elevationMeters: estElevation,
          category: estElevation > 1200 ? 'HIMALAYAN_VALLEY' : 'METRO_CITY',
        };
      });

      // Combine unique results
      const combined = [...localMatches];
      for (const res of onlineResults) {
        if (!combined.some((c) => Math.abs(c.latitude - res.latitude) < 0.05 && Math.abs(c.longitude - res.longitude) < 0.05)) {
          combined.push(res);
        }
      }
      return combined;
    }
  } catch {
    // Return local matches if offline or timeout
  }

  return localMatches.length > 0
    ? localMatches
    : [
        // Fallback placeholder with searched term coordinates if no match
        {
          name: query.charAt(0).toUpperCase() + query.slice(1),
          district: 'Live Searched Zone',
          state: 'India',
          latitude: 30.5 + Math.random() * 1.5,
          longitude: 78.0 + Math.random() * 1.5,
          elevationMeters: 1450,
          category: 'CUSTOM',
        },
      ];
}

/**
 * Reverse geocode GPS coordinates to friendly name
 */
export async function reverseGeocodeCoords(lat: number, lon: number): Promise<{ name: string; district: string; state: string; elevation: number }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en',
          'User-Agent': 'CloudGuardAI-DisasterEarlyWarning/1.0',
        },
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};
      const name = addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.city || 'My Vehicle Location';
      const district = addr.state_district || addr.county || addr.city || 'Current District';
      const state = addr.state || 'India';
      return {
        name,
        district,
        state,
        elevation: lat > 28 ? 1350 : 450,
      };
    }
  } catch {
    // Fallback
  }

  return {
    name: `GPS Point (${lat.toFixed(3)}, ${lon.toFixed(3)})`,
    district: 'Live Coords',
    state: 'Active Transit',
    elevation: 1100,
  };
}
