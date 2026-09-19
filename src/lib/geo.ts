// Spatial utilities for UrbanPulse
// Simple clustering and distance calculations for prototype

/**
 * Calculate distance between two GPS coordinates in meters
 * Uses the Haversine formula
 */
export function haversineDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Check if a new detection is near an existing issue (within threshold meters)
 * Used for duplicate/recurrence detection
 */
export function isNearExistingIssue(
  newLat: number, newLng: number,
  existingLat: number, existingLng: number,
  thresholdMeters: number = 10
): boolean {
  return haversineDistance(newLat, newLng, existingLat, existingLng) <= thresholdMeters;
}

/**
 * Find the nearest existing issue of the same type
 */
export function findNearestIssue(
  lat: number, lng: number, type: string,
  issues: Array<{ latitude: number; longitude: number; type: string; id: string }>,
  thresholdMeters: number = 10
): { id: string; distance: number } | null {
  let nearest: { id: string; distance: number } | null = null;

  for (const issue of issues) {
    if (issue.type !== type) continue;
    const dist = haversineDistance(lat, lng, issue.latitude, issue.longitude);
    if (dist <= thresholdMeters && (!nearest || dist < nearest.distance)) {
      nearest = { id: issue.id, distance: Math.round(dist * 10) / 10 };
    }
  }

  return nearest;
}

/**
 * Calculate road health score for a segment based on detections
 * Prototype logic — not a validated municipal safety standard
 */
export function calculateRoadHealth(
  potholes: number,
  waterlogging: number,
  infraIssues: number,
  recentRepairs: number = 0
): number {
  const basePenalty = potholes * 5 + waterlogging * 4 + infraIssues * 3;
  const repairBonus = recentRepairs * 8;
  const score = Math.max(0, Math.min(100, 100 - basePenalty + repairBonus));
  return Math.round(score);
}

/**
 * Get road health category from score
 */
export function getRoadHealthCategory(score: number): 'good' | 'monitor' | 'poor' | 'critical' {
  if (score >= 80) return 'good';
  if (score >= 60) return 'monitor';
  if (score >= 40) return 'poor';
  return 'critical';
}

export const roadHealthColors = {
  good: '#22c55e',
  monitor: '#eab308',
  poor: '#f97316',
  critical: '#ef4444',
};

export const roadHealthLabels = {
  good: 'Good',
  monitor: 'Monitor',
  poor: 'Poor',
  critical: 'Critical',
};

export const routeColors: Record<string, string> = {
  R01: '#06b6d4',
  R03: '#8b5cf6',
  R05: '#f97316',
  R07: '#22c55e',
  R09: '#ec4899',
  R12: '#eab308',
};
