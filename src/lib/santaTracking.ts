import { SANTA_WAYPOINTS, TRACKING_START, TRACKING_END, SANTA_VILLAGE, Waypoint } from './waypoints';

export interface SantaPosition {
  lat: number;
  lon: number;
  heading: number; // degrees
  speed: number; // km/h
  altitude: number; // meters (fictional)
  currentSegmentLabel: string;
  currentLocation: string; // Current waypoint label for country detection
  nextStop: string;
  giftsDelivered: number;
  progress: number; // 0-100
}

export interface ETAResult {
  eta: Date | null;
  distance: number; // km
  isPassed: boolean;
  isNear: boolean; // within threshold
}

// Haversine formula to calculate distance between two points
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

// Linear interpolation
function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

// Calculate bearing between two points
function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  const bearing = Math.atan2(y, x);
  return ((bearing * 180) / Math.PI + 360) % 360;
}

// Get current segment index based on time
function getCurrentSegmentIndex(now: Date): number {
  const waypoints = SANTA_WAYPOINTS;
  for (let i = 0; i < waypoints.length - 1; i++) {
    const startTime = new Date(waypoints[i].timestamp).getTime();
    const endTime = new Date(waypoints[i + 1].timestamp).getTime();
    const nowTime = now.getTime();
    
    if (nowTime >= startTime && nowTime < endTime) {
      return i;
    }
  }
  
  // If past the last waypoint, return the last segment
  if (now >= new Date(waypoints[waypoints.length - 1].timestamp)) {
    return waypoints.length - 1;
  }
  
  return 0;
}

// Get Santa's current position based on time
export function getSantaPosition(now: Date): SantaPosition {
  const startTime = TRACKING_START.getTime();
  const endTime = TRACKING_END.getTime();
  const nowTime = now.getTime();
  
  // Before tracking starts
  if (nowTime < startTime) {
    return {
      lat: SANTA_VILLAGE.lat,
      lon: SANTA_VILLAGE.lon,
      heading: 0,
      speed: 0,
      altitude: 0,
      currentSegmentLabel: 'Preparándose en el taller',
      currentLocation: SANTA_VILLAGE.label,
      nextStop: SANTA_WAYPOINTS[0].label,
      giftsDelivered: 0,
      progress: 0,
    };
  }
  
  // After tracking ends
  if (nowTime >= endTime) {
    return {
      lat: SANTA_VILLAGE.lat,
      lon: SANTA_VILLAGE.lon,
      heading: 0,
      speed: 0,
      altitude: 0,
      currentSegmentLabel: 'Descansando en casa',
      currentLocation: SANTA_VILLAGE.label,
      nextStop: 'Preparando para el próximo año',
      giftsDelivered: 8_500_000_000,
      progress: 100,
    };
  }
  
  // Find current segment
  const segmentIndex = getCurrentSegmentIndex(now);
  const currentWaypoint = SANTA_WAYPOINTS[segmentIndex];
  const nextWaypoint = SANTA_WAYPOINTS[Math.min(segmentIndex + 1, SANTA_WAYPOINTS.length - 1)];
  
  const segmentStart = new Date(currentWaypoint.timestamp).getTime();
  const segmentEnd = new Date(nextWaypoint.timestamp).getTime();
  
  // Calculate progress within segment
  const segmentDuration = segmentEnd - segmentStart;
  const elapsed = nowTime - segmentStart;
  const t = segmentDuration > 0 ? Math.min(1, Math.max(0, elapsed / segmentDuration)) : 0;
  
  // Interpolate position
  const lat = lerp(currentWaypoint.lat, nextWaypoint.lat, t);
  const lon = lerp(currentWaypoint.lon, nextWaypoint.lon, t);
  
  // Calculate heading
  const heading = calculateBearing(currentWaypoint.lat, currentWaypoint.lon, nextWaypoint.lat, nextWaypoint.lon);
  
  // Calculate speed
  const segmentDistance = haversineDistance(
    currentWaypoint.lat,
    currentWaypoint.lon,
    nextWaypoint.lat,
    nextWaypoint.lon
  );
  const segmentTimeHours = segmentDuration / (1000 * 60 * 60);
  const speed = segmentTimeHours > 0 ? Math.round(segmentDistance / segmentTimeHours) : 0;
  
  // Fictional altitude with some variation
  const baseAltitude = 10000;
  const altitudeVariation = Math.sin(nowTime / 30000) * 500 + Math.sin(nowTime / 10000) * 200;
  const altitude = Math.round(baseAltitude + altitudeVariation);
  
  // Calculate gifts delivered (proportional to progress)
  const totalGifts = 8_500_000_000;
  const overallProgress = (nowTime - startTime) / (endTime - startTime);
  const giftsDelivered = Math.floor(totalGifts * overallProgress);
  
  // Find next stop
  const nextStopIndex = segmentIndex + 1;
  const nextStop = nextStopIndex < SANTA_WAYPOINTS.length 
    ? SANTA_WAYPOINTS[nextStopIndex].label 
    : SANTA_VILLAGE.label;
  
  return {
    lat,
    lon,
    heading,
    speed,
    altitude,
    currentSegmentLabel: currentWaypoint.label,
    currentLocation: currentWaypoint.label,
    nextStop,
    giftsDelivered,
    progress: Math.round(overallProgress * 100),
  };
}

// Get the trajectory path up to current time
export function getTrajectoryPath(now: Date): [number, number][] {
  const path: [number, number][] = [];
  const nowTime = now.getTime();
  
  for (const waypoint of SANTA_WAYPOINTS) {
    const wpTime = new Date(waypoint.timestamp).getTime();
    if (wpTime <= nowTime) {
      path.push([waypoint.lat, waypoint.lon]);
    } else {
      break;
    }
  }
  
  // Add current interpolated position
  const position = getSantaPosition(now);
  if (path.length > 0) {
    path.push([position.lat, position.lon]);
  }
  
  return path;
}

// Calculate ETA to a specific location
export function calculateETA(
  targetLat: number,
  targetLon: number,
  now: Date,
  proximityRadius: number = 30 // km
): ETAResult {
  const nowTime = now.getTime();
  const currentPosition = getSantaPosition(now);
  
  // Current distance
  const currentDistance = haversineDistance(currentPosition.lat, currentPosition.lon, targetLat, targetLon);
  
  // Check if Santa has already passed nearby
  let closestDistance = Infinity;
  let closestTime: Date | null = null;
  let isPassed = false;
  
  // Check all waypoints to find when Santa passes closest
  for (let i = 0; i < SANTA_WAYPOINTS.length - 1; i++) {
    const wp1 = SANTA_WAYPOINTS[i];
    const wp2 = SANTA_WAYPOINTS[i + 1];
    
    const wp1Time = new Date(wp1.timestamp).getTime();
    const wp2Time = new Date(wp2.timestamp).getTime();
    
    // Sample points along the segment
    const numSamples = 10;
    for (let j = 0; j <= numSamples; j++) {
      const t = j / numSamples;
      const sampleLat = lerp(wp1.lat, wp2.lat, t);
      const sampleLon = lerp(wp1.lon, wp2.lon, t);
      const sampleTime = wp1Time + (wp2Time - wp1Time) * t;
      
      const distance = haversineDistance(sampleLat, sampleLon, targetLat, targetLon);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestTime = new Date(sampleTime);
      }
    }
  }
  
  // Check if the closest approach is in the past
  if (closestTime && closestTime.getTime() < nowTime) {
    isPassed = true;
  }
  
  // Find the first future time when Santa will be within proximity
  let eta: Date | null = null;
  
  if (!isPassed) {
    for (let i = 0; i < SANTA_WAYPOINTS.length - 1; i++) {
      const wp1 = SANTA_WAYPOINTS[i];
      const wp2 = SANTA_WAYPOINTS[i + 1];
      
      const wp1Time = new Date(wp1.timestamp).getTime();
      const wp2Time = new Date(wp2.timestamp).getTime();
      
      // Skip past segments
      if (wp2Time < nowTime) continue;
      
      // Sample points along the segment
      const numSamples = 20;
      for (let j = 0; j <= numSamples; j++) {
        const t = j / numSamples;
        const sampleLat = lerp(wp1.lat, wp2.lat, t);
        const sampleLon = lerp(wp1.lon, wp2.lon, t);
        const sampleTime = wp1Time + (wp2Time - wp1Time) * t;
        
        if (sampleTime <= nowTime) continue;
        
        const distance = haversineDistance(sampleLat, sampleLon, targetLat, targetLon);
        
        if (distance <= proximityRadius) {
          eta = new Date(sampleTime);
          break;
        }
      }
      
      if (eta) break;
    }
    
    // If no point within radius found, use closest future approach
    if (!eta && closestTime && closestTime.getTime() > nowTime) {
      eta = closestTime;
    }
  }
  
  return {
    eta,
    distance: currentDistance,
    isPassed,
    isNear: currentDistance <= proximityRadius,
  };
}

// Format time remaining
export function formatTimeRemaining(eta: Date, now: Date): string {
  const diff = eta.getTime() - now.getTime();
  
  if (diff <= 0) return '¡Ya llegó!';
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}min`;
  }
  return `${minutes}min`;
}

// Format exact time
export function formatExactTime(date: Date): string {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
