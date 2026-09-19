// UrbanPulse Mock Data
// Realistic demonstration data for SIH 2026 prototype
// All data is illustrative and simulated

import {
  Bus, Route, Detection, UrbanIssue, RoadSegment, Department,
  TrafficData, Notification, SystemStatus, DashboardStats,
  PilotPhase, Evidence, MaintenanceAction, RepairVerification,
  TimelineEvent, ChartDataPoint, TimeSeriesPoint,
  Incident, ODFlow, SchoolZoneRisk,
} from '@/lib/types';

// ============================================================
// CITY CENTER COORDINATES (Kolhapur, Maharashtra)
// ============================================================
export const CITY_CENTER: [number, number] = [16.7050, 74.2433];
export const DEFAULT_ZOOM = 13;

// ============================================================
// DEPARTMENTS
// ============================================================
export const departments: Department[] = [
  { id: 'DEP-01', name: 'Road Maintenance', code: 'RMD', activeIssues: 42, resolvedIssues: 187, avgResolutionDays: 4.2, contactEmail: 'roads@municipality.gov.in', contactPhone: '+91-231-2650001' },
  { id: 'DEP-02', name: 'Drainage Department', code: 'DRN', activeIssues: 18, resolvedIssues: 93, avgResolutionDays: 3.8, contactEmail: 'drainage@municipality.gov.in', contactPhone: '+91-231-2650002' },
  { id: 'DEP-03', name: 'Traffic Management', code: 'TMC', activeIssues: 7, resolvedIssues: 45, avgResolutionDays: 2.1, contactEmail: 'traffic@municipality.gov.in', contactPhone: '+91-231-2650003' },
  { id: 'DEP-04', name: 'Infrastructure & Signage', code: 'INF', activeIssues: 12, resolvedIssues: 67, avgResolutionDays: 5.5, contactEmail: 'infra@municipality.gov.in', contactPhone: '+91-231-2650004' },
  { id: 'DEP-05', name: 'Municipal Corporation', code: 'KMC', activeIssues: 3, resolvedIssues: 21, avgResolutionDays: 7.0, contactEmail: 'commissioner@municipality.gov.in', contactPhone: '+91-231-2650000' },
];

// ============================================================
// ROUTES
// ============================================================
export const routes: Route[] = [
  {
    id: 'R01', name: 'Route R01 - Mahadwar Road', description: 'Mahadwar Rd to Rankala Lake via Station Rd',
    color: '#06b6d4', busIds: ['BUS-042', 'BUS-055'],
    distance: 8.2, estimatedTime: 35,
    waypoints: [[16.7050, 74.2433], [16.7020, 74.2380], [16.6980, 74.2350], [16.6940, 74.2300], [16.6900, 74.2270], [16.6860, 74.2240]],
    stops: [
      { name: 'Mahadwar Road', lat: 16.7050, lng: 74.2433 },
      { name: 'Station Road', lat: 16.7020, lng: 74.2380 },
      { name: 'Shahupuri', lat: 16.6980, lng: 74.2350 },
      { name: 'Rajarampuri', lat: 16.6940, lng: 74.2300 },
      { name: 'Rankala', lat: 16.6900, lng: 74.2270 },
    ],
  },
  {
    id: 'R03', name: 'Route R03 - College Road', description: 'Shivaji University to DKTE via College Rd',
    color: '#8b5cf6', busIds: ['BUS-018', 'BUS-091'],
    distance: 6.5, estimatedTime: 28,
    waypoints: [[16.7120, 74.2500], [16.7100, 74.2460], [16.7070, 74.2420], [16.7040, 74.2390], [16.7010, 74.2360]],
    stops: [
      { name: 'Shivaji University', lat: 16.7120, lng: 74.2500 },
      { name: 'College Road Junction', lat: 16.7100, lng: 74.2460 },
      { name: 'Laxmipuri', lat: 16.7070, lng: 74.2420 },
      { name: 'Tarabai Park', lat: 16.7040, lng: 74.2390 },
    ],
  },
  {
    id: 'R05', name: 'Route R05 - Market Area', description: 'Market Yard to Kalamba via Shivaji Park',
    color: '#f97316', busIds: ['BUS-077'],
    distance: 7.8, estimatedTime: 32,
    waypoints: [[16.6950, 74.2550], [16.6970, 74.2500], [16.6990, 74.2450], [16.7010, 74.2400], [16.7030, 74.2350]],
    stops: [
      { name: 'Market Yard', lat: 16.6950, lng: 74.2550 },
      { name: 'Shivaji Park', lat: 16.6990, lng: 74.2450 },
      { name: 'Kalamba', lat: 16.7030, lng: 74.2350 },
    ],
  },
  {
    id: 'R07', name: 'Route R07 - Station Road', description: 'Railway Station to Panhala via Station Rd',
    color: '#22c55e', busIds: ['BUS-042', 'BUS-105'],
    distance: 12.4, estimatedTime: 48,
    waypoints: [[16.7080, 74.2330], [16.7060, 74.2370], [16.7040, 74.2410], [16.7020, 74.2450], [16.7000, 74.2490], [16.6970, 74.2530], [16.6940, 74.2570]],
    stops: [
      { name: 'Railway Station', lat: 16.7080, lng: 74.2330 },
      { name: 'Dabholkar Corner', lat: 16.7060, lng: 74.2370 },
      { name: 'Bindu Chowk', lat: 16.7040, lng: 74.2410 },
      { name: 'Bhavani Mandap', lat: 16.7020, lng: 74.2450 },
      { name: 'Kasba Bawada', lat: 16.6970, lng: 74.2530 },
    ],
  },
  {
    id: 'R09', name: 'Route R09 - Ring Road', description: 'Circular ring road covering outer city',
    color: '#ec4899', busIds: ['BUS-033'],
    distance: 15.6, estimatedTime: 55,
    waypoints: [[16.7150, 74.2400], [16.7130, 74.2350], [16.7090, 74.2310], [16.7040, 74.2290], [16.6990, 74.2310], [16.6950, 74.2350], [16.6930, 74.2400], [16.6950, 74.2450], [16.6990, 74.2490], [16.7040, 74.2510], [16.7090, 74.2490], [16.7130, 74.2450], [16.7150, 74.2400]],
    stops: [
      { name: 'Shiroli MIDC', lat: 16.7150, lng: 74.2400 },
      { name: 'Morewadi', lat: 16.7090, lng: 74.2310 },
      { name: 'Gandhinagar', lat: 16.6990, lng: 74.2310 },
      { name: 'Ujlaiwadi', lat: 16.6950, lng: 74.2450 },
      { name: 'Nagala Park', lat: 16.7040, lng: 74.2510 },
    ],
  },
  {
    id: 'R12', name: 'Route R12 - Industrial Belt', description: 'Shiroli Industrial Area to Gokul Shirgaon',
    color: '#eab308', busIds: ['BUS-105'],
    distance: 9.1, estimatedTime: 38,
    waypoints: [[16.7200, 74.2350], [16.7170, 74.2400], [16.7140, 74.2450], [16.7110, 74.2500], [16.7080, 74.2550]],
    stops: [
      { name: 'Shiroli MIDC', lat: 16.7200, lng: 74.2350 },
      { name: 'Udyamnagar', lat: 16.7170, lng: 74.2400 },
      { name: 'Gokul Shirgaon', lat: 16.7080, lng: 74.2550 },
    ],
  },
];

// ============================================================
// BUSES
// ============================================================
export const buses: Bus[] = [
  {
    id: 'BUS-042', name: 'MH-10-AB-4242', routeId: 'R07',
    currentLat: 16.7050, currentLng: 74.2433, heading: 180, speed: 28,
    cameraStatus: 'online', aiDeviceStatus: 'online', gpsStatus: 'online',
    networkType: '5G', gpuTemperature: 61, lastSync: '10 sec ago',
    detectionsToday: 14, isActive: true, offlineQueue: 0, modelVersion: 'v3.2.1',
  },
  {
    id: 'BUS-018', name: 'MH-10-CD-1818', routeId: 'R03',
    currentLat: 16.7100, currentLng: 74.2460, heading: 225, speed: 22,
    cameraStatus: 'online', aiDeviceStatus: 'online', gpsStatus: 'online',
    networkType: '5G', gpuTemperature: 58, lastSync: '15 sec ago',
    detectionsToday: 21, isActive: true, offlineQueue: 0, modelVersion: 'v3.2.1',
  },
  {
    id: 'BUS-105', name: 'MH-10-EF-1050', routeId: 'R12',
    currentLat: 16.7170, currentLng: 74.2400, heading: 135, speed: 35,
    cameraStatus: 'online', aiDeviceStatus: 'online', gpsStatus: 'online',
    networkType: '4G', gpuTemperature: 64, lastSync: '8 sec ago',
    detectionsToday: 9, isActive: true, offlineQueue: 2, modelVersion: 'v3.2.1',
  },
  {
    id: 'BUS-077', name: 'MH-10-GH-0770', routeId: 'R05',
    currentLat: 16.6970, currentLng: 74.2500, heading: 315, speed: 18,
    cameraStatus: 'online', aiDeviceStatus: 'online', gpsStatus: 'online',
    networkType: '5G', gpuTemperature: 55, lastSync: '22 sec ago',
    detectionsToday: 17, isActive: true, offlineQueue: 0, modelVersion: 'v3.2.0',
  },
  {
    id: 'BUS-033', name: 'MH-10-IJ-0330', routeId: 'R09',
    currentLat: 16.7090, currentLng: 74.2310, heading: 270, speed: 25,
    cameraStatus: 'online', aiDeviceStatus: 'standby', gpsStatus: 'online',
    networkType: '4G', gpuTemperature: 52, lastSync: '45 sec ago',
    detectionsToday: 6, isActive: true, offlineQueue: 4, modelVersion: 'v3.1.9',
  },
  {
    id: 'BUS-055', name: 'MH-10-KL-5500', routeId: 'R01',
    currentLat: 16.6980, currentLng: 74.2350, heading: 90, speed: 30,
    cameraStatus: 'online', aiDeviceStatus: 'online', gpsStatus: 'online',
    networkType: '5G', gpuTemperature: 59, lastSync: '5 sec ago',
    detectionsToday: 11, isActive: true, offlineQueue: 0, modelVersion: 'v3.2.1',
  },
  {
    id: 'BUS-091', name: 'MH-10-MN-9100', routeId: 'R03',
    currentLat: 16.7070, currentLng: 74.2420, heading: 180, speed: 0,
    cameraStatus: 'online', aiDeviceStatus: 'offline', gpsStatus: 'online',
    networkType: '4G', gpuTemperature: 45, lastSync: '5 min ago',
    detectionsToday: 3, isActive: false, offlineQueue: 12, modelVersion: 'v3.2.0',
  },
];

// ============================================================
// URBAN ISSUES
// ============================================================
export const urbanIssues: UrbanIssue[] = [
  {
    id: 'PH-2048', type: 'pothole', title: 'Deep Pothole on College Road',
    description: 'Large pothole approximately 0.82m² near College Road Junction. Multiple bus sightings confirm high severity. Located in the left lane affecting traffic flow.',
    severity: 'high', status: 'open',
    latitude: 16.7095, longitude: 74.2455,
    address: 'College Road, near Junction, Kolhapur',
    roadSegmentId: 'RS-003', confidence: 0.94, sightings: 3,
    firstDetected: '2026-09-12T09:15:00', lastDetected: '2026-09-18T14:32:16',
    detectionIds: ['DET-9819', 'DET-9820', 'DET-9821'],
    assignedDepartment: 'Road Maintenance', assignedTeam: 'Team Alpha',
    estimatedArea: 0.82, impactOnTraffic: 'moderate',
    evidenceImages: ['/images/pothole-detection.jpg'],
    timeline: [
      { id: 'TL-01', timestamp: '2026-09-12T09:15:00', type: 'detected', description: 'First detected by BUS-042 on Route R07', busId: 'BUS-042' },
      { id: 'TL-02', timestamp: '2026-09-13T11:42:00', type: 'repeated', description: 'Detected again by BUS-018 on Route R03', busId: 'BUS-018' },
      { id: 'TL-03', timestamp: '2026-09-15T08:30:00', type: 'verified', description: 'Issue verified by system - 2 independent sightings', metadata: { confidence: 0.92 } },
      { id: 'TL-04', timestamp: '2026-09-16T10:00:00', type: 'assigned', description: 'Assigned to Road Maintenance Department - Team Alpha' },
      { id: 'TL-05', timestamp: '2026-09-17T14:00:00', type: 'repaired', description: 'Road repair completed by maintenance team' },
      { id: 'TL-06', timestamp: '2026-09-18T14:32:16', type: 'reverified', description: 'UrbanPulse re-scan by BUS-042 - Repair verified', busId: 'BUS-042', metadata: { healthBefore: 42, healthAfter: 95 } },
    ],
    repairVerified: true, healthScoreBefore: 42, healthScoreAfter: 95,
  },
  {
    id: 'PH-2051', type: 'pothole', title: 'Medium Pothole near Rankala Lake',
    description: 'Medium-sized pothole on the approach road to Rankala Lake. Partially filled but still causes vehicle swerving.',
    severity: 'medium', status: 'assigned',
    latitude: 16.6905, longitude: 74.2275,
    address: 'Rankala Road, Kolhapur',
    roadSegmentId: 'RS-001', confidence: 0.87, sightings: 2,
    firstDetected: '2026-09-14T16:20:00', lastDetected: '2026-09-17T10:45:00',
    detectionIds: ['DET-9835', 'DET-9841'],
    assignedDepartment: 'Road Maintenance',
    estimatedArea: 0.45, impactOnTraffic: 'low',
    evidenceImages: ['/images/pothole-detection.jpg'],
    timeline: [
      { id: 'TL-11', timestamp: '2026-09-14T16:20:00', type: 'detected', description: 'First detected by BUS-055 on Route R01', busId: 'BUS-055' },
      { id: 'TL-12', timestamp: '2026-09-17T10:45:00', type: 'repeated', description: 'Second sighting by BUS-042', busId: 'BUS-042' },
      { id: 'TL-13', timestamp: '2026-09-17T14:00:00', type: 'assigned', description: 'Assigned to Road Maintenance Department' },
    ],
    repairVerified: false,
  },
  {
    id: 'WL-108', type: 'waterlogging', title: 'Severe Waterlogging on Station Road',
    description: 'Persistent waterlogging near Station Road underpass. Water level approximately 15cm. Drainage blockage suspected.',
    severity: 'critical', status: 'under_review',
    latitude: 16.7025, longitude: 74.2385,
    address: 'Station Road, near Railway Underpass, Kolhapur',
    roadSegmentId: 'RS-002', confidence: 0.91, sightings: 5,
    firstDetected: '2026-09-17T07:30:00', lastDetected: '2026-09-18T08:15:00',
    detectionIds: ['DET-9850', 'DET-9851', 'DET-9852', 'DET-9853', 'DET-9854'],
    assignedDepartment: 'Drainage Department',
    impactOnTraffic: 'high',
    evidenceImages: ['/images/waterlogging.jpg'],
    timeline: [
      { id: 'TL-21', timestamp: '2026-09-17T07:30:00', type: 'detected', description: 'First detected during morning rain by BUS-042', busId: 'BUS-042' },
      { id: 'TL-22', timestamp: '2026-09-17T08:45:00', type: 'repeated', description: 'Multiple sightings within 2 hours', busId: 'BUS-018' },
      { id: 'TL-23', timestamp: '2026-09-17T12:00:00', type: 'verified', description: 'Critical waterlogging confirmed - 5 sightings' },
      { id: 'TL-24', timestamp: '2026-09-18T08:15:00', type: 'assigned', description: 'Escalated to Drainage Department for urgent action' },
    ],
    repairVerified: false,
  },
  {
    id: 'RD-305', type: 'damaged_road', title: 'Cracked Road Surface on Market Road',
    description: 'Extensive cracking along a 50m stretch of Market Road. Surface deterioration accelerating.',
    severity: 'high', status: 'in_progress',
    latitude: 16.6960, longitude: 74.2520,
    address: 'Market Road, near Market Yard, Kolhapur',
    roadSegmentId: 'RS-005', confidence: 0.88, sightings: 4,
    firstDetected: '2026-09-10T13:00:00', lastDetected: '2026-09-18T11:30:00',
    detectionIds: ['DET-9800', 'DET-9810', 'DET-9825', 'DET-9840'],
    assignedDepartment: 'Road Maintenance', assignedTeam: 'Team Beta',
    estimatedArea: 12.5, impactOnTraffic: 'moderate',
    evidenceImages: ['/images/road-damage.jpg'],
    timeline: [
      { id: 'TL-31', timestamp: '2026-09-10T13:00:00', type: 'detected', description: 'Surface damage first detected', busId: 'BUS-077' },
      { id: 'TL-32', timestamp: '2026-09-12T09:00:00', type: 'repeated', description: 'Confirmed by multiple buses' },
      { id: 'TL-33', timestamp: '2026-09-14T10:00:00', type: 'assigned', description: 'Assigned to Team Beta' },
      { id: 'TL-34', timestamp: '2026-09-16T08:00:00', type: 'in_progress', description: 'Repair work started' },
    ],
    repairVerified: false,
  },
  {
    id: 'MS-042', type: 'missing_sign', title: 'Missing Speed Limit Sign - Ring Road',
    description: 'Speed limit sign missing at Ring Road curve near Morewadi. High-risk area for accidents.',
    severity: 'high', status: 'assigned',
    latitude: 16.7090, longitude: 74.2310,
    address: 'Ring Road, Morewadi Curve, Kolhapur',
    roadSegmentId: 'RS-009', confidence: 0.85, sightings: 2,
    firstDetected: '2026-09-15T15:30:00', lastDetected: '2026-09-18T09:00:00',
    detectionIds: ['DET-9860', 'DET-9870'],
    assignedDepartment: 'Infrastructure & Signage',
    impactOnTraffic: 'low',
    evidenceImages: ['/images/road-damage.jpg'],
    timeline: [
      { id: 'TL-41', timestamp: '2026-09-15T15:30:00', type: 'detected', description: 'Missing sign detected by BUS-033', busId: 'BUS-033' },
      { id: 'TL-42', timestamp: '2026-09-18T09:00:00', type: 'assigned', description: 'Assigned to Infrastructure & Signage Dept' },
    ],
    repairVerified: false,
  },
  {
    id: 'DD-017', type: 'damaged_divider', title: 'Damaged Road Divider - Shahupuri',
    description: 'Concrete road divider broken at two points near Shahupuri junction. Vehicles crossing over to wrong side.',
    severity: 'critical', status: 'open',
    latitude: 16.6985, longitude: 74.2355,
    address: 'Mahadwar Road, Shahupuri, Kolhapur',
    roadSegmentId: 'RS-001', confidence: 0.92, sightings: 3,
    firstDetected: '2026-09-16T11:00:00', lastDetected: '2026-09-18T13:00:00',
    detectionIds: ['DET-9875', 'DET-9880', 'DET-9885'],
    assignedDepartment: 'Road Maintenance',
    impactOnTraffic: 'severe',
    evidenceImages: ['/images/road-damage.jpg'],
    timeline: [
      { id: 'TL-51', timestamp: '2026-09-16T11:00:00', type: 'detected', description: 'Damaged divider first detected', busId: 'BUS-055' },
      { id: 'TL-52', timestamp: '2026-09-17T08:00:00', type: 'repeated', description: 'Multiple sightings confirmed' },
    ],
    repairVerified: false,
  },
  {
    id: 'PH-2055', type: 'pothole', title: 'Pothole Cluster - Bindu Chowk',
    description: 'Cluster of 3 potholes near Bindu Chowk intersection. Heavy traffic area.',
    severity: 'critical', status: 'assigned',
    latitude: 16.7042, longitude: 74.2415,
    address: 'Bindu Chowk, Kolhapur',
    roadSegmentId: 'RS-004', confidence: 0.96, sightings: 6,
    firstDetected: '2026-09-08T10:00:00', lastDetected: '2026-09-18T16:00:00',
    detectionIds: ['DET-9790', 'DET-9795', 'DET-9801', 'DET-9815', 'DET-9830', 'DET-9845'],
    assignedDepartment: 'Road Maintenance', assignedTeam: 'Team Alpha',
    estimatedArea: 1.5, impactOnTraffic: 'high',
    evidenceImages: ['/images/pothole-detection.jpg'],
    timeline: [
      { id: 'TL-61', timestamp: '2026-09-08T10:00:00', type: 'detected', description: 'Multiple potholes detected in cluster', busId: 'BUS-042' },
      { id: 'TL-62', timestamp: '2026-09-10T09:00:00', type: 'verified', description: 'Cluster verified with 4 independent sightings' },
      { id: 'TL-63', timestamp: '2026-09-12T10:00:00', type: 'assigned', description: 'Priority assignment to Team Alpha' },
    ],
    repairVerified: false,
  },
  {
    id: 'TC-012', type: 'traffic_congestion', title: 'Recurring Congestion - Dabholkar Corner',
    description: 'Daily congestion during peak hours at Dabholkar Corner. Average delay of 12 minutes.',
    severity: 'medium', status: 'under_review',
    latitude: 16.7062, longitude: 74.2372,
    address: 'Dabholkar Corner, Kolhapur',
    roadSegmentId: 'RS-004', confidence: 0.89, sightings: 15,
    firstDetected: '2026-09-05T17:30:00', lastDetected: '2026-09-18T17:45:00',
    detectionIds: [],
    assignedDepartment: 'Traffic Management',
    impactOnTraffic: 'severe',
    evidenceImages: ['/images/traffic-detection.jpg'],
    timeline: [
      { id: 'TL-71', timestamp: '2026-09-05T17:30:00', type: 'detected', description: 'Congestion pattern first identified' },
      { id: 'TL-72', timestamp: '2026-09-10T09:00:00', type: 'verified', description: 'Recurring pattern confirmed over 5 days' },
    ],
    repairVerified: false,
  },
  {
    id: 'PR-007', type: 'pedestrian_risk', title: 'Pedestrian Risk Zone - Tarabai Park',
    description: 'High pedestrian density near school zone with no crossing infrastructure. Multiple near-miss incidents detected.',
    severity: 'high', status: 'under_review',
    latitude: 16.7045, longitude: 74.2395,
    address: 'Tarabai Park Road, near School, Kolhapur',
    roadSegmentId: 'RS-003', confidence: 0.82, sightings: 8,
    firstDetected: '2026-09-11T07:45:00', lastDetected: '2026-09-18T07:50:00',
    detectionIds: [],
    assignedDepartment: 'Traffic Management',
    impactOnTraffic: 'moderate',
    evidenceImages: ['/images/traffic-detection.jpg'],
    timeline: [
      { id: 'TL-81', timestamp: '2026-09-11T07:45:00', type: 'detected', description: 'Pedestrian risk pattern detected near school' },
      { id: 'TL-82', timestamp: '2026-09-15T08:00:00', type: 'verified', description: 'Confirmed high-risk zone with 8 sightings' },
    ],
    repairVerified: false,
  },
  {
    id: 'MZ-003', type: 'missing_zebra_crossing', title: 'Missing Zebra Crossing - Laxmipuri',
    description: 'Faded/missing zebra crossing at busy Laxmipuri intersection. High pedestrian foot traffic area.',
    severity: 'medium', status: 'open',
    latitude: 16.7075, longitude: 74.2425,
    address: 'Laxmipuri Junction, Kolhapur',
    roadSegmentId: 'RS-003', confidence: 0.79, sightings: 3,
    firstDetected: '2026-09-13T14:00:00', lastDetected: '2026-09-18T12:30:00',
    detectionIds: [],
    assignedDepartment: 'Infrastructure & Signage',
    impactOnTraffic: 'low',
    evidenceImages: ['/images/road-damage.jpg'],
    timeline: [
      { id: 'TL-91', timestamp: '2026-09-13T14:00:00', type: 'detected', description: 'Missing zebra crossing detected', busId: 'BUS-018' },
    ],
    repairVerified: false,
  },
  {
    id: 'WL-112', type: 'waterlogging', title: 'Waterlogging - Kasba Bawada Underpass',
    description: 'Recurrent waterlogging at Kasba Bawada underpass after moderate rainfall.',
    severity: 'high', status: 'assigned',
    latitude: 16.6975, longitude: 74.2535,
    address: 'Kasba Bawada Underpass, Kolhapur',
    roadSegmentId: 'RS-007', confidence: 0.90, sightings: 4,
    firstDetected: '2026-09-16T06:30:00', lastDetected: '2026-09-18T07:00:00',
    detectionIds: [],
    assignedDepartment: 'Drainage Department',
    impactOnTraffic: 'high',
    evidenceImages: ['/images/waterlogging.jpg'],
    timeline: [
      { id: 'TL-101', timestamp: '2026-09-16T06:30:00', type: 'detected', description: 'Waterlogging detected during rain', busId: 'BUS-042' },
      { id: 'TL-102', timestamp: '2026-09-17T07:00:00', type: 'repeated', description: 'Recurrence confirmed' },
      { id: 'TL-103', timestamp: '2026-09-18T07:00:00', type: 'assigned', description: 'Assigned to Drainage Department' },
    ],
    repairVerified: false,
  },
  {
    id: 'RI-005', type: 'road_incident', title: 'Vehicle Breakdown - Ring Road',
    description: 'Stalled heavy vehicle partially blocking right lane on Ring Road.',
    severity: 'medium', status: 'open',
    latitude: 16.7130, longitude: 74.2350,
    address: 'Ring Road, near Shiroli, Kolhapur',
    roadSegmentId: 'RS-009', confidence: 0.86, sightings: 1,
    firstDetected: '2026-09-18T15:45:00', lastDetected: '2026-09-18T15:45:00',
    detectionIds: ['DET-9890'],
    assignedDepartment: 'Traffic Management',
    impactOnTraffic: 'moderate',
    evidenceImages: ['/images/traffic-detection.jpg'],
    timeline: [
      { id: 'TL-111', timestamp: '2026-09-18T15:45:00', type: 'detected', description: 'Vehicle breakdown detected by BUS-033', busId: 'BUS-033' },
    ],
    repairVerified: false,
  },
];

// ============================================================
// ROAD SEGMENTS
// ============================================================
export const roadSegments: RoadSegment[] = [
  {
    id: 'RS-001', name: 'Mahadwar Road', healthScore: 62, category: 'poor',
    totalDetections: 18, potholes: 5, waterlogging: 2, infrastructureIssues: 3,
    lastScanned: '5 min ago', busCoverage: 8,
    coordinates: [[16.7050, 74.2433], [16.7020, 74.2380], [16.6980, 74.2350]],
    length: 2.8, ward: 'Ward A',
  },
  {
    id: 'RS-002', name: 'Station Road', healthScore: 38, category: 'critical',
    totalDetections: 32, potholes: 8, waterlogging: 6, infrastructureIssues: 4,
    lastScanned: '3 min ago', busCoverage: 12,
    coordinates: [[16.7080, 74.2330], [16.7060, 74.2370], [16.7040, 74.2410]],
    length: 3.2, ward: 'Ward B',
  },
  {
    id: 'RS-003', name: 'College Road', healthScore: 48, category: 'poor',
    totalDetections: 24, potholes: 7, waterlogging: 1, infrastructureIssues: 5,
    lastScanned: '8 min ago', busCoverage: 6,
    coordinates: [[16.7120, 74.2500], [16.7100, 74.2460], [16.7070, 74.2420]],
    length: 2.1, ward: 'Ward C',
  },
  {
    id: 'RS-004', name: 'Dabholkar Corner - Bindu Chowk', healthScore: 35, category: 'critical',
    totalDetections: 41, potholes: 12, waterlogging: 3, infrastructureIssues: 2,
    lastScanned: '2 min ago', busCoverage: 10,
    coordinates: [[16.7060, 74.2370], [16.7042, 74.2415]],
    length: 1.8, ward: 'Ward B',
  },
  {
    id: 'RS-005', name: 'Market Road', healthScore: 55, category: 'poor',
    totalDetections: 15, potholes: 3, waterlogging: 2, infrastructureIssues: 2,
    lastScanned: '12 min ago', busCoverage: 4,
    coordinates: [[16.6950, 74.2550], [16.6970, 74.2500], [16.6990, 74.2450]],
    length: 2.5, ward: 'Ward D',
  },
  {
    id: 'RS-006', name: 'Rajarampuri Road', healthScore: 78, category: 'monitor',
    totalDetections: 6, potholes: 1, waterlogging: 0, infrastructureIssues: 1,
    lastScanned: '15 min ago', busCoverage: 4,
    coordinates: [[16.6940, 74.2300], [16.6900, 74.2270]],
    length: 1.5, ward: 'Ward A',
  },
  {
    id: 'RS-007', name: 'Kasba Bawada Road', healthScore: 42, category: 'poor',
    totalDetections: 22, potholes: 4, waterlogging: 5, infrastructureIssues: 3,
    lastScanned: '6 min ago', busCoverage: 5,
    coordinates: [[16.7000, 74.2490], [16.6970, 74.2530]],
    length: 2.0, ward: 'Ward E',
  },
  {
    id: 'RS-008', name: 'Shivaji Park Road', healthScore: 85, category: 'good',
    totalDetections: 3, potholes: 0, waterlogging: 0, infrastructureIssues: 1,
    lastScanned: '20 min ago', busCoverage: 3,
    coordinates: [[16.6990, 74.2450], [16.7010, 74.2400]],
    length: 1.2, ward: 'Ward D',
  },
  {
    id: 'RS-009', name: 'Ring Road - North', healthScore: 71, category: 'monitor',
    totalDetections: 9, potholes: 2, waterlogging: 0, infrastructureIssues: 3,
    lastScanned: '18 min ago', busCoverage: 3,
    coordinates: [[16.7150, 74.2400], [16.7130, 74.2350], [16.7090, 74.2310]],
    length: 4.1, ward: 'Ward F',
  },
  {
    id: 'RS-010', name: 'Industrial Belt Road', healthScore: 66, category: 'monitor',
    totalDetections: 11, potholes: 3, waterlogging: 1, infrastructureIssues: 2,
    lastScanned: '25 min ago', busCoverage: 2,
    coordinates: [[16.7200, 74.2350], [16.7170, 74.2400], [16.7140, 74.2450]],
    length: 3.5, ward: 'Ward G',
  },
];

// ============================================================
// DETECTIONS
// ============================================================
export const detections: Detection[] = [
  {
    id: 'DET-9821', busId: 'BUS-042', routeId: 'R07', type: 'pothole',
    confidence: 0.94, severity: 'high', latitude: 16.7095, longitude: 74.2455,
    timestamp: '2026-09-18T14:32:16', frame: '/images/pothole-detection.jpg',
    issueId: 'PH-2048', bbox: { x: 320, y: 380, width: 120, height: 90, label: 'POTHOLE', confidence: 0.94 },
    processingLatency: 42, modelVersion: 'v3.2.1', edgeProcessed: true,
    privacyFiltered: true, payloadSize: 14.8,
  },
  {
    id: 'DET-9820', busId: 'BUS-018', routeId: 'R03', type: 'pothole',
    confidence: 0.91, severity: 'high', latitude: 16.7097, longitude: 74.2453,
    timestamp: '2026-09-13T11:42:00', frame: '/images/pothole-detection.jpg',
    issueId: 'PH-2048', bbox: { x: 350, y: 400, width: 110, height: 85, label: 'POTHOLE', confidence: 0.91 },
    processingLatency: 38, modelVersion: 'v3.2.1', edgeProcessed: true,
    privacyFiltered: true, payloadSize: 13.2,
  },
];

// ============================================================
// NOTIFICATIONS
// ============================================================
export const notifications: Notification[] = [
  { id: 'N-001', type: 'detection', title: 'Critical Pothole Detected', message: 'New high-severity pothole detected on Station Road near Railway Underpass', severity: 'critical', timestamp: '2026-09-18T14:32:16', read: false, issueId: 'PH-2048' },
  { id: 'N-002', type: 'duplicate', title: 'Duplicate Sighting Matched', message: 'Waterlogging on Station Road matched with existing issue WL-108. Sightings increased to 5.', severity: 'high', timestamp: '2026-09-18T13:15:00', read: false, issueId: 'WL-108' },
  { id: 'N-003', type: 'repair', title: 'Road Repair Verified', message: 'Pothole PH-2048 on College Road repair verified by BUS-042 re-scan. Health score: 42 → 95', severity: 'low', timestamp: '2026-09-18T12:30:00', read: true, issueId: 'PH-2048' },
  { id: 'N-004', type: 'fleet', title: 'BUS-091 AI Device Offline', message: 'Edge AI device on BUS-091 has gone offline. 12 detections queued for sync.', severity: 'medium', timestamp: '2026-09-18T11:45:00', read: true, busId: 'BUS-091' },
  { id: 'N-005', type: 'congestion', title: 'New Congestion Hotspot', message: 'Heavy traffic congestion detected at Dabholkar Corner. Average delay: 12 minutes.', severity: 'medium', timestamp: '2026-09-18T10:30:00', read: true, issueId: 'TC-012' },
  { id: 'N-006', type: 'fleet', title: 'BUS-042 Reconnected', message: 'BUS-042 re-established 5G connection. All queued data synced successfully.', severity: 'low', timestamp: '2026-09-18T09:15:00', read: true, busId: 'BUS-042' },
  { id: 'N-007', type: 'system', title: 'AI Model Updated', message: 'UrbanPulse RoadVision model updated to v3.2.1 across all active edge nodes.', severity: 'low', timestamp: '2026-09-18T06:00:00', read: true },
  { id: 'N-008', type: 'detection', title: 'Multiple Issues Detected', message: 'BUS-018 uploaded 12 offline detections from Route R03. 3 new issues flagged.', severity: 'high', timestamp: '2026-09-18T08:30:00', read: true, busId: 'BUS-018' },
];

// ============================================================
// SYSTEM STATUS
// ============================================================
export const systemStatus: SystemStatus = {
  edgeNodesOnline: 6,
  edgeNodesTotal: 7,
  serverStatus: 'connected',
  aiProcessingStatus: 'online',
  databaseStatus: 'connected',
  lastHeartbeat: '2 sec ago',
  uptime: 99.7,
  dataProcessedToday: 1.8,
  bandwidthSaved: 98.7,
};

// ============================================================
// DASHBOARD STATS
// ============================================================
export const dashboardStats: DashboardStats = {
  activeBuses: 24,
  routesMonitored: 12,
  issuesDetectedToday: 137,
  criticalIssues: 14,
  roadSegmentsScanned: 428,
  aiConfidence: 91.7,
  dataUploadedToday: 1.8,
  processingFps: 28,
  avgLatency: 42,
  bandwidthSavedPercent: 98.7,
};

// ============================================================
// TRAFFIC DATA
// ============================================================
export const trafficData: TrafficData[] = [
  { routeId: 'R01', timestamp: '2026-09-18T08:00', vehicleCount: 342, cars: 178, twoWheelers: 96, buses: 27, trucks: 24, others: 17, congestionLevel: 'moderate', avgSpeed: 22, pedestrianCount: 85, incidents: 0 },
  { routeId: 'R03', timestamp: '2026-09-18T08:00', vehicleCount: 287, cars: 149, twoWheelers: 80, buses: 23, trucks: 19, others: 16, congestionLevel: 'heavy', avgSpeed: 15, pedestrianCount: 120, incidents: 1 },
  { routeId: 'R05', timestamp: '2026-09-18T08:00', vehicleCount: 198, cars: 103, twoWheelers: 55, buses: 16, trucks: 14, others: 10, congestionLevel: 'moderate', avgSpeed: 25, pedestrianCount: 45, incidents: 0 },
  { routeId: 'R07', timestamp: '2026-09-18T08:00', vehicleCount: 425, cars: 221, twoWheelers: 119, buses: 34, trucks: 30, others: 21, congestionLevel: 'heavy', avgSpeed: 12, pedestrianCount: 150, incidents: 2 },
  { routeId: 'R09', timestamp: '2026-09-18T08:00', vehicleCount: 156, cars: 81, twoWheelers: 44, buses: 12, trucks: 11, others: 8, congestionLevel: 'free', avgSpeed: 38, pedestrianCount: 20, incidents: 0 },
  { routeId: 'R12', timestamp: '2026-09-18T08:00', vehicleCount: 134, cars: 70, twoWheelers: 37, buses: 11, trucks: 9, others: 7, congestionLevel: 'free', avgSpeed: 42, pedestrianCount: 15, incidents: 0 },
];

// ============================================================
// PILOT PHASES
// ============================================================
export const pilotPhases: PilotPhase[] = [
  {
    phase: 1, title: 'Proof of Concept', description: 'Initial deployment with limited fleet to validate core detection pipeline',
    buses: 5, routes: 2, capabilities: ['Pothole Detection', 'Road Damage Detection', 'GPS Tagging', 'Edge Processing'],
    status: 'completed', startDate: '2026-07-01', endDate: '2026-08-31',
    kpis: [
      { name: 'Detection Precision', value: '91.2', unit: '%', target: '>85%', status: 'met', isDemo: true },
      { name: 'Detection Recall', value: '87.8', unit: '%', target: '>80%', status: 'met', isDemo: true },
      { name: 'GPS Localization Error', value: '2.4', unit: 'm', target: '<5m', status: 'met', isDemo: true },
      { name: 'Processing Latency', value: '42', unit: 'ms', target: '<100ms', status: 'met', isDemo: true },
      { name: 'System Uptime', value: '99.2', unit: '%', target: '>99%', status: 'met', isDemo: true },
    ],
  },
  {
    phase: 2, title: 'Extended Pilot', description: 'Expanded fleet with additional detection categories and traffic intelligence',
    buses: 20, routes: 8, capabilities: ['All Phase 1', 'Traffic Intelligence', 'Waterlogging', 'Infrastructure Monitoring', 'Repair Verification'],
    status: 'active', startDate: '2026-09-01',
    kpis: [
      { name: 'Detection Precision', value: '93.5', unit: '%', target: '>90%', status: 'on_track', isDemo: true },
      { name: 'Bandwidth Reduction', value: '98.7', unit: '%', target: '>95%', status: 'met', isDemo: true },
      { name: 'Offline Reliability', value: '99.8', unit: '%', target: '>99%', status: 'met', isDemo: true },
      { name: 'Thermal Stability', value: '64', unit: '°C max', target: '<75°C', status: 'met', isDemo: true },
      { name: 'Data per Detection', value: '14.8', unit: 'KB', target: '<50KB', status: 'met', isDemo: true },
    ],
  },
  {
    phase: 3, title: 'City-Wide Expansion', description: 'Full city deployment with multi-department integration',
    buses: 200, routes: 45, capabilities: ['All Phase 2', 'Multi-Department Integration', 'Predictive Maintenance', 'City-wide Analytics', 'Public Reporting Portal'],
    status: 'planned', startDate: '2027-01-01',
    kpis: [
      { name: 'Fleet Coverage', value: '—', unit: '', target: '200+ buses', status: 'on_track', isDemo: true },
      { name: 'Ward Coverage', value: '—', unit: '', target: 'All wards', status: 'on_track', isDemo: true },
      { name: 'Avg Resolution Time', value: '—', unit: 'days', target: '<3 days', status: 'on_track', isDemo: true },
    ],
  },
];

// ============================================================
// CHART DATA
// ============================================================
export const issuesOverTime: TimeSeriesPoint[] = [
  { date: 'Sep 1', potholes: 12, waterlogging: 3, infrastructure: 2, traffic: 5, total: 22 },
  { date: 'Sep 3', potholes: 15, waterlogging: 5, infrastructure: 3, traffic: 4, total: 27 },
  { date: 'Sep 5', potholes: 18, waterlogging: 4, infrastructure: 4, traffic: 7, total: 33 },
  { date: 'Sep 7', potholes: 22, waterlogging: 8, infrastructure: 3, traffic: 6, total: 39 },
  { date: 'Sep 9', potholes: 19, waterlogging: 6, infrastructure: 5, traffic: 8, total: 38 },
  { date: 'Sep 11', potholes: 25, waterlogging: 7, infrastructure: 4, traffic: 9, total: 45 },
  { date: 'Sep 13', potholes: 28, waterlogging: 9, infrastructure: 6, traffic: 7, total: 50 },
  { date: 'Sep 15', potholes: 24, waterlogging: 5, infrastructure: 5, traffic: 10, total: 44 },
  { date: 'Sep 17', potholes: 30, waterlogging: 11, infrastructure: 7, traffic: 8, total: 56 },
  { date: 'Sep 18', potholes: 32, waterlogging: 8, infrastructure: 6, traffic: 11, total: 57 },
];

export const vehicleDistribution: ChartDataPoint[] = [
  { name: 'Cars', value: 52, color: '#06b6d4' },
  { name: 'Two Wheelers', value: 28, color: '#8b5cf6' },
  { name: 'Buses', value: 8, color: '#22c55e' },
  { name: 'Trucks', value: 7, color: '#f97316' },
  { name: 'Others', value: 5, color: '#ec4899' },
];

export const severityDistribution: ChartDataPoint[] = [
  { name: 'Critical', value: 14, color: '#ef4444' },
  { name: 'High', value: 38, color: '#f97316' },
  { name: 'Medium', value: 52, color: '#eab308' },
  { name: 'Low', value: 33, color: '#3b82f6' },
];

export const issuesByRoute: ChartDataPoint[] = [
  { name: 'R07', value: 41, label: 'Station Road' },
  { name: 'R03', value: 24, label: 'College Road' },
  { name: 'R01', value: 18, label: 'Mahadwar Road' },
  { name: 'R05', value: 15, label: 'Market Area' },
  { name: 'R09', value: 9, label: 'Ring Road' },
  { name: 'R12', value: 11, label: 'Industrial Belt' },
];

export const hourlyTraffic: TimeSeriesPoint[] = [
  { date: '6 AM', vehicles: 120, pedestrians: 30 },
  { date: '7 AM', vehicles: 280, pedestrians: 85 },
  { date: '8 AM', vehicles: 425, pedestrians: 150 },
  { date: '9 AM', vehicles: 380, pedestrians: 120 },
  { date: '10 AM', vehicles: 310, pedestrians: 90 },
  { date: '11 AM', vehicles: 290, pedestrians: 75 },
  { date: '12 PM', vehicles: 340, pedestrians: 95 },
  { date: '1 PM', vehicles: 320, pedestrians: 80 },
  { date: '2 PM', vehicles: 290, pedestrians: 70 },
  { date: '3 PM', vehicles: 310, pedestrians: 85 },
  { date: '4 PM', vehicles: 370, pedestrians: 110 },
  { date: '5 PM', vehicles: 450, pedestrians: 140 },
  { date: '6 PM', vehicles: 420, pedestrians: 130 },
  { date: '7 PM', vehicles: 350, pedestrians: 100 },
  { date: '8 PM', vehicles: 250, pedestrians: 60 },
  { date: '9 PM', vehicles: 180, pedestrians: 35 },
];

export const bandwidthComparison: ChartDataPoint[] = [
  { name: 'Traditional\nContinuous Stream', value: 144, unit: 'GB/day/bus', color: '#ef4444' },
  { name: 'UrbanPulse\nEdge Processing', value: 1.8, unit: 'GB/day/bus', color: '#06b6d4' },
];

export const roadHealthTrend: TimeSeriesPoint[] = [
  { date: 'Week 1', avgScore: 58, criticalSegments: 4, goodSegments: 2 },
  { date: 'Week 2', avgScore: 55, criticalSegments: 5, goodSegments: 2 },
  { date: 'Week 3', avgScore: 52, criticalSegments: 5, goodSegments: 1 },
  { date: 'Week 4', avgScore: 56, criticalSegments: 4, goodSegments: 2 },
  { date: 'Week 5', avgScore: 60, criticalSegments: 3, goodSegments: 3 },
  { date: 'Week 6', avgScore: 63, criticalSegments: 2, goodSegments: 3 },
  { date: 'Week 7', avgScore: 61, criticalSegments: 3, goodSegments: 3 },
  { date: 'Week 8', avgScore: 65, criticalSegments: 2, goodSegments: 4 },
];

export const aiConfidenceDistribution: ChartDataPoint[] = [
  { name: '70-75%', value: 5 },
  { name: '75-80%', value: 8 },
  { name: '80-85%', value: 15 },
  { name: '85-90%', value: 28 },
  { name: '90-95%', value: 52 },
  { name: '95-100%', value: 29 },
];

// ============================================================
// REPAIR VERIFICATIONS
// ============================================================
export const repairVerifications: RepairVerification[] = [
  {
    id: 'RV-001', issueId: 'PH-2048', busId: 'BUS-042',
    verificationDate: '2026-09-18T14:32:16',
    beforeImage: '/images/pothole-detection.jpg',
    afterImage: '/images/road-repaired.jpg',
    healthScoreBefore: 42, healthScoreAfter: 95,
    isRepaired: true, confidence: 0.96,
    notes: 'Road surface fully restored. Asphalt patch properly applied.',
  },
];

// ============================================================
// INCIDENTS & ANPR TRACKING (BEL PS-26124 REQUIREMENT)
// ============================================================
export const mockIncidents: Incident[] = [
  {
    id: 'INC-2026-089',
    type: 'hit_and_run',
    title: 'Hit-and-Run Collision with Cyclist',
    offendingVehicle: {
      makeModel: 'Black Mahindra Scorpio SUV',
      color: 'Midnight Black',
      estimatedSpeed: 78,
      speedLimit: 40,
      vehicleClass: 'SUV / Light Motor Vehicle',
    },
    licensePlate: 'MH-09-CV-8821',
    ocrConfidence: 0.964,
    timestamp: '2026-09-18T16:42:10',
    latitude: 16.7025,
    longitude: 74.2395,
    address: 'Station Road, Near Central Bus Stand Junction, Kolhapur',
    status: 'alert_dispatched',
    reportingBusId: 'BUS-042',
    collaboratingBusId: 'BUS-103',
    trackingDurationSec: 14.8,
    sha256EvidenceHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    summary: 'Offending black SUV collided with cyclist in curb lane at 78 km/h. Fled westbound towards Railway Station. Bus BUS-042 captured plate crop; Bus BUS-103 650m ahead confirmed fleeing vehicle trajectory.',
  },
  {
    id: 'INC-2026-092',
    type: 'rash_driving',
    title: 'Severe Rash Driving in School Transit Zone',
    offendingVehicle: {
      makeModel: 'White Honda City Sedan',
      color: 'Pearl White',
      estimatedSpeed: 84,
      speedLimit: 40,
      vehicleClass: 'Sedan / Passenger Car',
    },
    licensePlate: 'MH-12-DE-4021',
    ocrConfidence: 0.942,
    timestamp: '2026-09-18T14:15:32',
    latitude: 16.7112,
    longitude: 74.2480,
    address: 'College Road, Opposite St. Xaviers School Zone, Kolhapur',
    status: 'under_investigation',
    reportingBusId: 'BUS-101',
    collaboratingBusId: 'BUS-105',
    trackingDurationSec: 9.2,
    sha256EvidenceHash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    summary: 'Erratic overtaking across double solid center divider at 84 km/h while students were boarding transit buses. High pedestrian hazard score.',
  },
  {
    id: 'INC-2026-095',
    type: 'signal_jump',
    title: 'Red Light Signal Jump at High-Density Junction',
    offendingVehicle: {
      makeModel: 'Tata Ace Delivery Mini-Truck',
      color: 'Bright Yellow',
      estimatedSpeed: 58,
      speedLimit: 30,
      vehicleClass: 'Commercial Mini-Truck',
    },
    licensePlate: 'MH-09-AK-1104',
    ocrConfidence: 0.981,
    timestamp: '2026-09-18T11:28:44',
    latitude: 16.6980,
    longitude: 74.2320,
    address: 'Shivaji Market Main Intersection, Kolhapur',
    status: 'police_acknowledged',
    reportingBusId: 'BUS-104',
    trackingDurationSec: 6.5,
    sha256EvidenceHash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    summary: 'Vehicle accelerated through red signal 4.2 seconds after light transition, forcing crossing pedestrians onto curb.',
  },
  {
    id: 'INC-2026-097',
    type: 'wrong_way',
    title: 'Wrong-Way Contraflow on One-Way Flyover',
    offendingVehicle: {
      makeModel: 'Bajaj Pulsar 220 Motorcycle',
      color: 'Crimson Red',
      estimatedSpeed: 62,
      speedLimit: 40,
      vehicleClass: 'Motorcycle / Two-Wheeler',
    },
    licensePlate: 'MH-09-EQ-5590',
    ocrConfidence: 0.915,
    timestamp: '2026-09-18T09:12:18',
    latitude: 16.7088,
    longitude: 74.2415,
    address: 'Shivaji Bridge Flyover Corridor, Kolhapur',
    status: 'under_investigation',
    reportingBusId: 'BUS-102',
    trackingDurationSec: 8.1,
    sha256EvidenceHash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    summary: 'Two-wheeler traveling contraflow into incoming transit bus lane, creating immediate head-on collision risk.',
  },
];

// ============================================================
// ORIGIN-DESTINATION (OD) TRAFFIC FLOWS (BEL PS-26124 REQUIREMENT)
// ============================================================
export const mockODFlows: ODFlow[] = [
  {
    id: 'OD-01',
    originZone: 'Zone 1: Central Bus Stand',
    destinationZone: 'Zone 3: MIDC Industrial Belt',
    vehicleVolumePerHour: 520,
    averageTravelTimeMin: 24,
    expectedDelayMin: 8.5,
    congestionIndex: 'high',
    primaryBottleneck: 'Station Road Pothole Cluster & Bottleneck',
  },
  {
    id: 'OD-02',
    originZone: 'Zone 4: Railway Station',
    destinationZone: 'Zone 2: Shivaji Market',
    vehicleVolumePerHour: 410,
    averageTravelTimeMin: 18,
    expectedDelayMin: 6.2,
    congestionIndex: 'high',
    primaryBottleneck: 'Market Junction Signal Bottleneck',
  },
  {
    id: 'OD-03',
    originZone: 'Zone 2: Shivaji Market',
    destinationZone: 'Zone 5: University Campus',
    vehicleVolumePerHour: 340,
    averageTravelTimeMin: 22,
    expectedDelayMin: 3.1,
    congestionIndex: 'moderate',
    primaryBottleneck: 'College Road School Zone Slowdown',
  },
  {
    id: 'OD-04',
    originZone: 'Zone 5: University Campus',
    destinationZone: 'Zone 1: Central Bus Stand',
    vehicleVolumePerHour: 390,
    averageTravelTimeMin: 20,
    expectedDelayMin: 4.8,
    congestionIndex: 'moderate',
    primaryBottleneck: 'Mahadwar Road Narrow Corridor',
  },
  {
    id: 'OD-05',
    originZone: 'Zone 3: MIDC Industrial Belt',
    destinationZone: 'Zone 4: Railway Station',
    vehicleVolumePerHour: 280,
    averageTravelTimeMin: 16,
    expectedDelayMin: 1.5,
    congestionIndex: 'low',
    primaryBottleneck: 'Ring Road Free Flow',
  },
];

// ============================================================
// SCHOOL ZONE VULNERABLE PEDESTRIAN RISKS (BEL PS-26124 REQUIREMENT)
// ============================================================
export const mockSchoolZones: SchoolZoneRisk[] = [
  {
    id: 'SZ-001',
    schoolName: "St. Xavier's High School & Junior College",
    routeId: 'R03',
    address: 'College Road, Opp. St. Xaviers Gate, Kolhapur',
    latitude: 16.7115,
    longitude: 74.2482,
    vulnerablePedestrianCount: 14,
    speedLimitKmH: 25,
    activeCrossingAlert: true,
    zebraCrossingVisibility: 38,
    infrastructureStatus: 'needs_repainting',
    busDriverAdvisory: 'CAUTION: Active school dismissal. Reduce bus speed to 20 km/h. Zebra crossing paint faded by 62%.',
  },
  {
    id: 'SZ-002',
    schoolName: 'Kolhapur City Model High School',
    routeId: 'R07',
    address: 'Station Road, Near City High School Chowk, Kolhapur',
    latitude: 16.7032,
    longitude: 74.2401,
    vulnerablePedestrianCount: 22,
    speedLimitKmH: 25,
    activeCrossingAlert: true,
    zebraCrossingVisibility: 84,
    infrastructureStatus: 'good',
    busDriverAdvisory: 'CAUTION: High student crossing density. Zebra crossing clear. Maintain 25 km/h.',
  },
  {
    id: 'SZ-003',
    schoolName: 'Vidya Mandir Primary School',
    routeId: 'R01',
    address: 'Mahadwar Road, Near Vidya Mandir Lane, Kolhapur',
    latitude: 16.6975,
    longitude: 74.2290,
    vulnerablePedestrianCount: 9,
    speedLimitKmH: 20,
    activeCrossingAlert: false,
    zebraCrossingVisibility: 22,
    infrastructureStatus: 'missing_signage',
    busDriverAdvisory: 'ALERT: Missing School Ahead signboard and faded crossing. Extreme caution required.',
  },
];

