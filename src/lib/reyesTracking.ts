import {
  getFullRoute,
  getTrackingStart,
  getTrackingEnd,
  ETHIOPIA_START,
  REYES_INFO,
  ReyName,
  Waypoint,
} from './reyesWaypoints';

export interface ReyPosition {
  lat: number;
  lon: number;
  heading: number;
  speed: number;
  altitude: number;
  currentSegmentLabel: string;
  nextStop: string;
  progress: number;
}

export interface AllReyesPositions {
  melchor: ReyPosition;
  gaspar: ReyPosition;
  baltasar: ReyPosition;
}

export interface ReyStats {
  giftsDelivered: number;
  candiesGiven: number;
  starsWatched: number;
}

export interface AllReyesStats {
  melchor: ReyStats;
  gaspar: ReyStats;
  baltasar: ReyStats;
}

export interface ETAResult {
  eta: Date | null;
  distance: number;
  isPassed: boolean;
  isNear: boolean;
}

export interface AllReyesETA {
  melchor: ETAResult;
  gaspar: ETAResult;
  baltasar: ETAResult;
  combined: ETAResult; // La mayor ETA de los 3
}

// Haversine formula para calcular distancia entre dos puntos
export function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
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

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

function calculateBearing(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const dLon = toRad(lon2 - lon1);
  const y = Math.sin(dLon) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLon);
  const bearing = Math.atan2(y, x);
  return ((bearing * 180) / Math.PI + 360) % 360;
}

function getCurrentSegmentIndex(waypoints: Waypoint[], now: Date): number {
  for (let i = 0; i < waypoints.length - 1; i++) {
    const startTime = new Date(waypoints[i].timestamp).getTime();
    const endTime = new Date(waypoints[i + 1].timestamp).getTime();
    const nowTime = now.getTime();
    
    if (nowTime >= startTime && nowTime < endTime) {
      return i;
    }
  }
  
  if (now >= new Date(waypoints[waypoints.length - 1].timestamp)) {
    return waypoints.length - 1;
  }
  
  return 0;
}

// Obtener posición de un Rey en un momento dado
export function getReyPosition(
  rey: ReyName,
  now: Date,
  targetLat: number,
  targetLon: number,
  targetLabel: string
): ReyPosition {
  const startTime = getTrackingStart().getTime();
  const endTime = getTrackingEnd().getTime();
  const nowTime = now.getTime();
  
  const waypoints = getFullRoute(rey, targetLat, targetLon, targetLabel);
  
  // Antes del inicio
  if (nowTime < startTime) {
    return {
      lat: ETHIOPIA_START.lat,
      lon: ETHIOPIA_START.lon,
      heading: 0,
      speed: 0,
      altitude: 0,
      currentSegmentLabel: 'Preparándose para salir',
      nextStop: waypoints[0].label,
      progress: 0,
    };
  }
  
  // Después del final
  if (nowTime >= endTime) {
    return {
      lat: targetLat,
      lon: targetLon,
      heading: 0,
      speed: 0,
      altitude: 0,
      currentSegmentLabel: '¡Ha llegado!',
      nextStop: 'Dejando regalos...',
      progress: 100,
    };
  }
  
  // Encontrar segmento actual
  const segmentIndex = getCurrentSegmentIndex(waypoints, now);
  const currentWaypoint = waypoints[segmentIndex];
  const nextWaypoint = waypoints[Math.min(segmentIndex + 1, waypoints.length - 1)];
  
  const segmentStart = new Date(currentWaypoint.timestamp).getTime();
  const segmentEnd = new Date(nextWaypoint.timestamp).getTime();
  
  const segmentDuration = segmentEnd - segmentStart;
  const elapsed = nowTime - segmentStart;
  const t = segmentDuration > 0 ? Math.min(1, Math.max(0, elapsed / segmentDuration)) : 0;
  
  const lat = lerp(currentWaypoint.lat, nextWaypoint.lat, t);
  const lon = lerp(currentWaypoint.lon, nextWaypoint.lon, t);
  
  const heading = calculateBearing(currentWaypoint.lat, currentWaypoint.lon, nextWaypoint.lat, nextWaypoint.lon);
  
  const segmentDistance = haversineDistance(
    currentWaypoint.lat,
    currentWaypoint.lon,
    nextWaypoint.lat,
    nextWaypoint.lon
  );
  const segmentTimeHours = segmentDuration / (1000 * 60 * 60);
  const speed = segmentTimeHours > 0 ? Math.round(segmentDistance / segmentTimeHours) : 0;
  
  // Altitud ficticia con variación
  const baseAltitude = 8000;
  const altitudeVariation = Math.sin(nowTime / 30000) * 400 + Math.sin(nowTime / 10000 + segmentIndex) * 200;
  const altitude = Math.round(baseAltitude + altitudeVariation);
  
  const overallProgress = (nowTime - startTime) / (endTime - startTime);
  
  const nextStopIndex = segmentIndex + 1;
  const nextStop = nextStopIndex < waypoints.length 
    ? waypoints[nextStopIndex].label 
    : targetLabel;
  
  return {
    lat,
    lon,
    heading,
    speed,
    altitude,
    currentSegmentLabel: currentWaypoint.label,
    nextStop,
    progress: Math.round(overallProgress * 100),
  };
}

// Obtener posiciones de todos los Reyes
export function getAllReyesPositions(
  now: Date,
  targetLat: number,
  targetLon: number,
  targetLabel: string
): AllReyesPositions {
  return {
    melchor: getReyPosition('melchor', now, targetLat, targetLon, targetLabel),
    gaspar: getReyPosition('gaspar', now, targetLat, targetLon, targetLabel),
    baltasar: getReyPosition('baltasar', now, targetLat, targetLon, targetLabel),
  };
}

// Obtener stats ficticios de cada Rey
export function getReyesStats(now: Date): AllReyesStats {
  const startTime = getTrackingStart().getTime();
  const endTime = getTrackingEnd().getTime();
  const nowTime = now.getTime();
  
  const progress = Math.max(0, Math.min(1, (nowTime - startTime) / (endTime - startTime)));
  
  const totalGifts = 2_500_000_000;
  const totalCandies = 5_000_000_000;
  const totalStars = 1_000_000;
  
  return {
    melchor: {
      giftsDelivered: Math.floor(totalGifts * progress * 0.95),
      candiesGiven: Math.floor(totalCandies * progress * 0.9),
      starsWatched: Math.floor(totalStars * progress),
    },
    gaspar: {
      giftsDelivered: Math.floor(totalGifts * progress * 1.02),
      candiesGiven: Math.floor(totalCandies * progress * 1.1),
      starsWatched: Math.floor(totalStars * progress * 0.85),
    },
    baltasar: {
      giftsDelivered: Math.floor(totalGifts * progress * 1.03),
      candiesGiven: Math.floor(totalCandies * progress),
      starsWatched: Math.floor(totalStars * progress * 1.15),
    },
  };
}

// Calcular ETA de un Rey específico
function calculateReyETA(
  rey: ReyName,
  targetLat: number,
  targetLon: number,
  targetLabel: string,
  now: Date,
  proximityRadius: number = 30
): ETAResult {
  const position = getReyPosition(rey, now, targetLat, targetLon, targetLabel);
  const currentDistance = haversineDistance(position.lat, position.lon, targetLat, targetLon);
  
  const endTime = getTrackingEnd();
  const isPassed = now >= endTime;
  const isNear = currentDistance <= proximityRadius;
  
  if (isPassed) {
    return {
      eta: null,
      distance: currentDistance,
      isPassed: true,
      isNear,
    };
  }
  
  // ETA es siempre a las 18:00 (todos llegan juntos)
  return {
    eta: endTime,
    distance: currentDistance,
    isPassed: false,
    isNear,
  };
}

// Calcular ETA de todos los Reyes
export function getAllReyesETA(
  targetLat: number,
  targetLon: number,
  targetLabel: string,
  now: Date,
  proximityRadius: number = 30
): AllReyesETA {
  const melchorETA = calculateReyETA('melchor', targetLat, targetLon, targetLabel, now, proximityRadius);
  const gasparETA = calculateReyETA('gaspar', targetLat, targetLon, targetLabel, now, proximityRadius);
  const baltasarETA = calculateReyETA('baltasar', targetLat, targetLon, targetLabel, now, proximityRadius);
  
  // Calcular ETA combinada (la mayor distancia, mismo tiempo de llegada)
  const maxDistance = Math.max(melchorETA.distance, gasparETA.distance, baltasarETA.distance);
  
  return {
    melchor: melchorETA,
    gaspar: gasparETA,
    baltasar: baltasarETA,
    combined: {
      eta: melchorETA.eta, // Todos llegan a la misma hora
      distance: maxDistance,
      isPassed: melchorETA.isPassed && gasparETA.isPassed && baltasarETA.isPassed,
      isNear: melchorETA.isNear || gasparETA.isNear || baltasarETA.isNear,
    },
  };
}

// Obtener trayectoria de un Rey hasta el momento actual
export function getReyTrajectoryPath(
  rey: ReyName,
  now: Date,
  targetLat: number,
  targetLon: number,
  targetLabel: string
): [number, number][] {
  const waypoints = getFullRoute(rey, targetLat, targetLon, targetLabel);
  const path: [number, number][] = [];
  const nowTime = now.getTime();
  
  for (const waypoint of waypoints) {
    const wpTime = new Date(waypoint.timestamp).getTime();
    if (wpTime <= nowTime) {
      path.push([waypoint.lat, waypoint.lon]);
    } else {
      break;
    }
  }
  
  // Añadir posición actual interpolada
  const position = getReyPosition(rey, now, targetLat, targetLon, targetLabel);
  if (path.length > 0) {
    path.push([position.lat, position.lon]);
  }
  
  return path;
}

// Formatear tiempo restante
export function formatTimeRemaining(eta: Date, now: Date): string {
  const diff = eta.getTime() - now.getTime();
  
  if (diff <= 0) return '¡Ya llegaron!';
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}min`;
  }
  return `${minutes}min`;
}

// Formatear hora exacta
export function formatExactTime(date: Date): string {
  return date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
