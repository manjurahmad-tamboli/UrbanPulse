// UrbanPulse Type Definitions
// AI-Powered Mobile Urban Intelligence Platform

export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type IssueStatus = 'open' | 'under_review' | 'assigned' | 'in_progress' | 'repaired' | 'verified' | 'closed';
export type IssueType = 'pothole' | 'damaged_road' | 'waterlogging' | 'missing_sign' | 'damaged_sign' | 'missing_zebra_crossing' | 'damaged_divider' | 'traffic_congestion' | 'road_incident' | 'pedestrian_risk';
export type DeviceStatus = 'online' | 'offline' | 'standby' | 'error';
export type NetworkType = '5G' | '4G' | '3G' | 'offline';
export type RoadHealthCategory = 'good' | 'monitor' | 'poor' | 'critical';

export interface Bus {
  id: string;
  name: string;
  routeId: string;
  currentLat: number;
  currentLng: number;
  heading: number;
  speed: number;
  cameraStatus: DeviceStatus;
  aiDeviceStatus: DeviceStatus;
  gpsStatus: DeviceStatus;
  networkType: NetworkType;
  gpuTemperature: number;
  lastSync: string;
  detectionsToday: number;
  isActive: boolean;
  offlineQueue: number;
  modelVersion: string;
}

export interface Route {
  id: string;
  name: string;
  description: string;
  color: string;
  waypoints: [number, number][];
  stops: RouteStop[];
  busIds: string[];
  distance: number; // km
  estimatedTime: number; // minutes
}

export interface RouteStop {
  name: string;
  lat: number;
  lng: number;
}

export interface Detection {
  id: string;
  busId: string;
  routeId: string;
  type: IssueType;
  confidence: number;
  severity: Severity;
  latitude: number;
  longitude: number;
  timestamp: string;
  frame: string;
  videoClip?: string;
  issueId: string;
  bbox: BoundingBox;
  processingLatency: number; // ms
  modelVersion: string;
  edgeProcessed: boolean;
  privacyFiltered: boolean;
  payloadSize: number; // KB
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
}

export interface UrbanIssue {
  id: string;
  type: IssueType;
  title: string;
  description: string;
  severity: Severity;
  status: IssueStatus;
  latitude: number;
  longitude: number;
  address: string;
  roadSegmentId: string;
  confidence: number;
  sightings: number;
  firstDetected: string;
  lastDetected: string;
  detectionIds: string[];
  assignedDepartment: string;
  assignedTeam?: string;
  estimatedArea?: number; // m²
  impactOnTraffic: 'none' | 'low' | 'moderate' | 'high' | 'severe';
  evidenceImages: string[];
  evidenceVideo?: string;
  timeline: TimelineEvent[];
  repairVerified: boolean;
  healthScoreBefore?: number;
  healthScoreAfter?: number;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: 'detected' | 'repeated' | 'verified' | 'assigned' | 'in_progress' | 'repaired' | 'reverified' | 'closed';
  description: string;
  busId?: string;
  userId?: string;
  metadata?: Record<string, string | number>;
}

export interface RoadSegment {
  id: string;
  name: string;
  healthScore: number;
  category: RoadHealthCategory;
  totalDetections: number;
  potholes: number;
  waterlogging: number;
  infrastructureIssues: number;
  lastScanned: string;
  busCoverage: number; // buses per day
  coordinates: [number, number][];
  length: number; // km
  ward: string;
}

export interface Evidence {
  id: string;
  detectionId: string;
  issueId: string;
  imageUrl: string;
  videoUrl?: string;
  capturedAt: string;
  busId: string;
  gpsLat: number;
  gpsLng: number;
  facesRedacted: number;
  platesRedacted: number;
  fileSizeKB: number;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  activeIssues: number;
  resolvedIssues: number;
  avgResolutionDays: number;
  contactEmail: string;
  contactPhone: string;
}

export interface MaintenanceAction {
  id: string;
  issueId: string;
  departmentId: string;
  assignedDate: string;
  startedDate?: string;
  completedDate?: string;
  status: 'pending' | 'in_progress' | 'completed';
  notes: string;
  teamSize: number;
  estimatedCost: number;
}

export interface RepairVerification {
  id: string;
  issueId: string;
  busId: string;
  verificationDate: string;
  beforeImage: string;
  afterImage: string;
  healthScoreBefore: number;
  healthScoreAfter: number;
  isRepaired: boolean;
  confidence: number;
  notes: string;
}

export interface TrafficData {
  routeId: string;
  timestamp: string;
  vehicleCount: number;
  cars: number;
  twoWheelers: number;
  buses: number;
  trucks: number;
  others: number;
  congestionLevel: 'free' | 'moderate' | 'heavy' | 'gridlock';
  avgSpeed: number;
  pedestrianCount: number;
  incidents: number;
}

export interface Notification {
  id: string;
  type: 'detection' | 'duplicate' | 'repair' | 'fleet' | 'system' | 'congestion';
  title: string;
  message: string;
  severity: Severity;
  timestamp: string;
  read: boolean;
  issueId?: string;
  busId?: string;
  actionUrl?: string;
}

export interface SystemStatus {
  edgeNodesOnline: number;
  edgeNodesTotal: number;
  serverStatus: 'connected' | 'degraded' | 'disconnected';
  aiProcessingStatus: 'online' | 'processing' | 'offline';
  databaseStatus: 'connected' | 'disconnected';
  lastHeartbeat: string;
  uptime: number; // hours
  dataProcessedToday: number; // GB
  bandwidthSaved: number; // percentage
}

export interface DashboardStats {
  activeBuses: number;
  routesMonitored: number;
  issuesDetectedToday: number;
  criticalIssues: number;
  roadSegmentsScanned: number;
  aiConfidence: number;
  dataUploadedToday: number; // GB
  processingFps: number;
  avgLatency: number; // ms
  bandwidthSavedPercent: number;
}

export interface PilotPhase {
  phase: number;
  title: string;
  description: string;
  buses: number;
  routes: number;
  capabilities: string[];
  status: 'completed' | 'active' | 'planned';
  startDate: string;
  endDate?: string;
  kpis: PilotKPI[];
}

export interface PilotKPI {
  name: string;
  value: string;
  unit: string;
  target: string;
  status: 'met' | 'on_track' | 'at_risk';
  isDemo: boolean; // true = illustrative demo data
}

export interface SimulationState {
  isRunning: boolean;
  isPresentationMode: boolean;
  currentScenarioStep: number;
  totalScenarioSteps: number;
  busPositions: Map<string, [number, number]>;
  activeDetections: Detection[];
  notifications: Notification[];
  elapsedTime: number;
}

// Chart data types
export interface ChartDataPoint {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface TimeSeriesPoint {
  date: string;
  [key: string]: string | number;
}

// Issue type display helpers
export const issueTypeLabels: Record<IssueType, string> = {
  pothole: 'Pothole',
  damaged_road: 'Damaged Road',
  waterlogging: 'Waterlogging',
  missing_sign: 'Missing Road Sign',
  damaged_sign: 'Damaged Road Sign',
  missing_zebra_crossing: 'Missing Zebra Crossing',
  damaged_divider: 'Damaged Divider',
  traffic_congestion: 'Traffic Congestion',
  road_incident: 'Road Incident',
  pedestrian_risk: 'Pedestrian Risk',
};

export const severityColors: Record<Severity, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
};

export const severityBgColors: Record<Severity, string> = {
  critical: 'bg-red-500/20 text-red-400 border-red-500/30',
  high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  medium: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

export const statusColors: Record<IssueStatus, string> = {
  open: 'bg-red-500/20 text-red-400',
  under_review: 'bg-orange-500/20 text-orange-400',
  assigned: 'bg-yellow-500/20 text-yellow-400',
  in_progress: 'bg-blue-500/20 text-blue-400',
  repaired: 'bg-teal-500/20 text-teal-400',
  verified: 'bg-green-500/20 text-green-400',
  closed: 'bg-gray-500/20 text-gray-400',
};

export const statusLabels: Record<IssueStatus, string> = {
  open: 'Open',
  under_review: 'Under Review',
  assigned: 'Assigned',
  in_progress: 'In Progress',
  repaired: 'Repaired',
  verified: 'Verified',
  closed: 'Closed',
};

export const issueTypeIcons: Record<IssueType, string> = {
  pothole: '🕳️',
  damaged_road: '🚧',
  waterlogging: '🌊',
  missing_sign: '⚠️',
  damaged_sign: '🪧',
  missing_zebra_crossing: '🦓',
  damaged_divider: '🔶',
  traffic_congestion: '🚗',
  road_incident: '🚨',
  pedestrian_risk: '🚶',
};

export type IncidentType = 'hit_and_run' | 'rash_driving' | 'wrong_way' | 'signal_jump';

export interface Incident {
  id: string;
  type: IncidentType;
  title: string;
  offendingVehicle: {
    makeModel: string;
    color: string;
    estimatedSpeed: number; // km/h
    speedLimit: number; // km/h
    vehicleClass: string;
  };
  licensePlate: string;
  ocrConfidence: number; // 0 to 1
  timestamp: string;
  latitude: number;
  longitude: number;
  address: string;
  status: 'under_investigation' | 'alert_dispatched' | 'police_acknowledged' | 'case_closed';
  reportingBusId: string;
  collaboratingBusId?: string; // Handoff bus
  trackingDurationSec: number;
  sha256EvidenceHash: string;
  summary: string;
}

export interface ODFlow {
  id: string;
  originZone: string;
  destinationZone: string;
  vehicleVolumePerHour: number;
  averageTravelTimeMin: number;
  expectedDelayMin: number;
  congestionIndex: 'low' | 'moderate' | 'high';
  primaryBottleneck: string;
}

export interface SchoolZoneRisk {
  id: string;
  schoolName: string;
  routeId: string;
  address: string;
  latitude: number;
  longitude: number;
  vulnerablePedestrianCount: number;
  speedLimitKmH: number;
  activeCrossingAlert: boolean;
  zebraCrossingVisibility: number; // percentage
  infrastructureStatus: 'needs_repainting' | 'good' | 'missing_signage';
  busDriverAdvisory: string;
}

