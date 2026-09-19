// UrbanPulse Simulation Engine
// Handles live bus movement, detection events, and scenario automation

import { buses, routes, urbanIssues, notifications as defaultNotifications } from '@/data/mock-data';
import type { Bus, Detection, Notification, UrbanIssue } from '@/lib/types';

// Scenario steps for the 15-step demo
export const scenarioSteps = [
  { id: 1, title: 'Bus Departure', description: 'BUS-042 departs from Railway Station on Route R07', icon: '🚌', duration: 3000 },
  { id: 2, title: 'Camera Active', description: 'Front-facing camera begins recording road surface', icon: '📹', duration: 2000 },
  { id: 3, title: 'Road Scanning', description: 'AI model processing live video feed at 28 FPS', icon: '🔍', duration: 2500 },
  { id: 4, title: 'Pothole Detected', description: 'YOLOv8 detects pothole — Confidence: 94%', icon: '🕳️', duration: 3000 },
  { id: 5, title: 'Bounding Box', description: 'Detection overlay rendered with POTHOLE label', icon: '🎯', duration: 2000 },
  { id: 6, title: 'GPS Tagging', description: 'Coordinates attached: 16.8524°N, 74.5815°E', icon: '📍', duration: 2000 },
  { id: 7, title: 'Severity Analysis', description: 'Classified as HIGH severity — Area: 0.82 m²', icon: '⚠️', duration: 2500 },
  { id: 8, title: 'Evidence Created', description: 'Frame snapshot + 5-second video clip saved', icon: '📸', duration: 2000 },
  { id: 9, title: 'Metadata Upload', description: 'Only 14.8 KB payload transmitted via 5G', icon: '☁️', duration: 2000 },
  { id: 10, title: 'Duplicate Check', description: 'Previous detection found 2.8 meters away', icon: '🔄', duration: 2500 },
  { id: 11, title: 'Issue Merged', description: 'Issue #PH-2048 updated — Sightings: 3', icon: '🔗', duration: 2000 },
  { id: 12, title: 'Map Updated', description: 'Road Health Map marker updated with new data', icon: '🗺️', duration: 2000 },
  { id: 13, title: 'Authority Notified', description: 'Road Maintenance Dept receives alert', icon: '🔔', duration: 2500 },
  { id: 14, title: 'Repair Completed', description: 'Municipal team patches the pothole', icon: '🔧', duration: 3000 },
  { id: 15, title: 'Repair Verified', description: 'Later bus pass confirms repair — Health: 42→95', icon: '✅', duration: 3000 },
];

// Detection pipeline steps for the AI demo page
export const detectionPipelineSteps = [
  {
    id: 1, title: 'Camera Frame Captured', status: 'pending' as const,
    details: { source: 'Front Bus Camera', resolution: '1920×1080', frame: '#1267' },
  },
  {
    id: 2, title: 'AI Detection', status: 'pending' as const,
    details: { model: 'YOLOv8s-TRT', object: 'Pothole', confidence: '94%', latency: '42ms' },
  },
  {
    id: 3, title: 'GPS Tagging', status: 'pending' as const,
    details: { latitude: '16.8524', longitude: '74.5815', accuracy: '±2.1m', satellites: '12' },
  },
  {
    id: 4, title: 'Severity Calculation', status: 'pending' as const,
    details: { severity: 'HIGH', area: '0.82 m²', position: 'Left Lane', impact: 'Moderate Traffic Impact' },
  },
  {
    id: 5, title: 'Evidence Extraction', status: 'pending' as const,
    details: { frame: 'Saved', videoClip: '5-second clip', facesRedacted: '2', platesRedacted: '1' },
  },
  {
    id: 6, title: 'Upload Metadata', status: 'pending' as const,
    details: { payload: '14.8 KB', network: '5G', items: 'GPS, Timestamp, Bus ID, Route, Confidence, Severity, Evidence' },
  },
  {
    id: 7, title: 'Duplicate / Recurrence Check', status: 'pending' as const,
    details: { searchRadius: '10m', result: 'Previous detection found 2.8m away', matchId: 'PH-2048' },
  },
  {
    id: 8, title: 'Merge Detection', status: 'pending' as const,
    details: { issueId: 'PH-2048', sightings: '3', confidenceUpdated: '94% → 96%', status: 'Updated' },
  },
  {
    id: 9, title: 'Authority Dashboard Updated', status: 'pending' as const,
    details: { department: 'Road Maintenance', notification: 'Sent', priority: 'High', team: 'Team Alpha' },
  },
];

// Simulate bus movement along a route
export function interpolateBusPosition(
  waypoints: [number, number][],
  progress: number // 0 to 1
): [number, number] {
  if (waypoints.length < 2) return waypoints[0] || [0, 0];
  
  const totalSegments = waypoints.length - 1;
  const segmentProgress = progress * totalSegments;
  const segmentIndex = Math.min(Math.floor(segmentProgress), totalSegments - 1);
  const t = segmentProgress - segmentIndex;
  
  const start = waypoints[segmentIndex];
  const end = waypoints[segmentIndex + 1];
  
  return [
    start[0] + (end[0] - start[0]) * t,
    start[1] + (end[1] - start[1]) * t,
  ];
}

// Generate a simulated detection
export function generateSimulatedDetection(busId: string, routeId: string): Detection {
  const bus = buses.find(b => b.id === busId);
  const lat = bus?.currentLat || 16.7050;
  const lng = bus?.currentLng || 74.2433;
  
  return {
    id: `DET-${Math.floor(Math.random() * 10000)}`,
    busId,
    routeId,
    type: 'pothole',
    confidence: 0.88 + Math.random() * 0.12,
    severity: 'high',
    latitude: lat + (Math.random() - 0.5) * 0.001,
    longitude: lng + (Math.random() - 0.5) * 0.001,
    timestamp: new Date().toISOString(),
    frame: '/images/pothole-detection.jpg',
    issueId: 'PH-2048',
    bbox: { x: 280 + Math.random() * 100, y: 340 + Math.random() * 80, width: 100 + Math.random() * 40, height: 70 + Math.random() * 30, label: 'POTHOLE', confidence: 0.94 },
    processingLatency: 35 + Math.random() * 20,
    modelVersion: 'v3.2.1',
    edgeProcessed: true,
    privacyFiltered: true,
    payloadSize: 12 + Math.random() * 8,
  };
}

// Generate a notification
export function generateNotification(type: Notification['type'], issueId?: string): Notification {
  const templates: Record<string, { title: string; message: string; severity: Notification['severity'] }> = {
    detection: {
      title: 'New High-Severity Pothole Detected',
      message: 'Pothole detected on College Road near Junction. Confidence: 94%',
      severity: 'high',
    },
    duplicate: {
      title: 'Duplicate Sighting Matched',
      message: 'Detection matched with existing issue. Confidence increased to 96%.',
      severity: 'medium',
    },
    repair: {
      title: 'Road Repair Verified',
      message: 'Pothole repair verified by bus re-scan. Road health restored.',
      severity: 'low',
    },
    fleet: {
      title: 'BUS-042 Status Update',
      message: 'Edge device reconnected. All queued detections synced.',
      severity: 'low',
    },
    congestion: {
      title: 'New Congestion Hotspot',
      message: 'Heavy congestion detected at Dabholkar Corner.',
      severity: 'medium',
    },
    system: {
      title: 'System Update',
      message: 'AI model updated to v3.2.1 across all nodes.',
      severity: 'low',
    },
  };

  const template = templates[type] || templates.detection;
  
  return {
    id: `N-${Date.now()}`,
    type,
    title: template.title,
    message: template.message,
    severity: template.severity,
    timestamp: new Date().toISOString(),
    read: false,
    issueId,
  };
}

// Format timestamp for display
export function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(ts: string): string {
  const now = new Date();
  const then = new Date(ts);
  const diff = now.getTime() - then.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}
