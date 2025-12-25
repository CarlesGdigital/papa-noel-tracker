// Rutas de los Reyes Magos - Waypoints con timestamps
// Todas las horas en Europe/Madrid (UTC+1 en invierno)

export interface Waypoint {
  lat: number;
  lon: number;
  timestamp: string; // ISO 8601
  label: string;
}

export type ReyName = 'melchor' | 'gaspar' | 'baltasar';

export interface ReyInfo {
  name: string;
  emoji: string;
  color: string;
  personality: 'organizado' | 'bromista' | 'epico';
}

export const REYES_INFO: Record<ReyName, ReyInfo> = {
  melchor: {
    name: 'Melchor',
    emoji: '👑',
    color: '#FFD700', // Gold
    personality: 'organizado',
  },
  gaspar: {
    name: 'Gaspar',
    emoji: '🎁',
    color: '#E74C3C', // Red
    personality: 'bromista',
  },
  baltasar: {
    name: 'Baltasar',
    emoji: '⭐',
    color: '#3498DB', // Blue
    personality: 'epico',
  },
};

// Punto de salida común: Addis Abeba, Etiopía
export const ETHIOPIA_START = {
  lat: 9.0320,
  lon: 38.7469,
  label: 'Addis Abeba, Etiopía',
};

// Evento por defecto: 5 de enero
// Se puede cambiar en ajustes para pruebas
let eventDate = '2025-01-05';

export function setEventDate(date: string) {
  eventDate = date;
}

export function getEventDate(): string {
  return eventDate;
}

// Genera timestamps basados en la fecha del evento
function ts(hours: number, minutes: number = 0): string {
  const h = String(hours).padStart(2, '0');
  const m = String(minutes).padStart(2, '0');
  return `${eventDate}T${h}:${m}:00+01:00`;
}

// Rutas base para cada Rey (sin el punto final - se añade dinámicamente)
// Cada Rey tiene su propia ruta global pasando por diferentes ciudades

export function getMelchorBaseRoute(): Waypoint[] {
  return [
    { lat: 9.0320, lon: 38.7469, timestamp: ts(8, 0), label: 'Addis Abeba, Etiopía' },
    { lat: 24.7136, lon: 46.6753, timestamp: ts(8, 30), label: 'Riad, Arabia Saudí' },
    { lat: 19.0760, lon: 72.8777, timestamp: ts(9, 0), label: 'Mumbai, India' },
    { lat: 31.2304, lon: 121.4737, timestamp: ts(9, 40), label: 'Shanghái, China' },
    { lat: 35.6762, lon: 139.6503, timestamp: ts(10, 15), label: 'Tokio, Japón' },
    { lat: -33.8688, lon: 151.2093, timestamp: ts(11, 0), label: 'Sídney, Australia' },
    { lat: 34.0522, lon: -118.2437, timestamp: ts(12, 0), label: 'Los Ángeles, USA' },
    { lat: 40.7128, lon: -74.0060, timestamp: ts(12, 45), label: 'Nueva York, USA' },
    { lat: 51.5074, lon: -0.1278, timestamp: ts(13, 30), label: 'Londres, Reino Unido' },
    { lat: 48.8566, lon: 2.3522, timestamp: ts(14, 15), label: 'París, Francia' },
    { lat: 40.4168, lon: -3.7038, timestamp: ts(15, 30), label: 'Madrid, España' },
  ];
}

export function getGasparBaseRoute(): Waypoint[] {
  return [
    { lat: 9.0320, lon: 38.7469, timestamp: ts(8, 0), label: 'Addis Abeba, Etiopía' },
    { lat: 30.0444, lon: 31.2357, timestamp: ts(8, 25), label: 'El Cairo, Egipto' },
    { lat: 41.0082, lon: 28.9784, timestamp: ts(8, 50), label: 'Estambul, Turquía' },
    { lat: 28.6139, lon: 77.2090, timestamp: ts(9, 30), label: 'Nueva Delhi, India' },
    { lat: 39.9042, lon: 116.4074, timestamp: ts(10, 10), label: 'Pekín, China' },
    { lat: 37.5665, lon: 126.9780, timestamp: ts(10, 45), label: 'Seúl, Corea del Sur' },
    { lat: -36.8509, lon: 174.7645, timestamp: ts(11, 30), label: 'Auckland, Nueva Zelanda' },
    { lat: 19.4326, lon: -99.1332, timestamp: ts(12, 30), label: 'Ciudad de México' },
    { lat: 43.6532, lon: -79.3832, timestamp: ts(13, 15), label: 'Toronto, Canadá' },
    { lat: 52.5200, lon: 13.4050, timestamp: ts(14, 0), label: 'Berlín, Alemania' },
    { lat: 41.9028, lon: 12.4964, timestamp: ts(15, 0), label: 'Roma, Italia' },
  ];
}

export function getBaltasarBaseRoute(): Waypoint[] {
  return [
    { lat: 9.0320, lon: 38.7469, timestamp: ts(8, 0), label: 'Addis Abeba, Etiopía' },
    { lat: -1.2921, lon: 36.8219, timestamp: ts(8, 20), label: 'Nairobi, Kenia' },
    { lat: 25.2048, lon: 55.2708, timestamp: ts(8, 50), label: 'Dubái, EAU' },
    { lat: 12.9716, lon: 77.5946, timestamp: ts(9, 25), label: 'Bangalore, India' },
    { lat: 22.3193, lon: 114.1694, timestamp: ts(10, 0), label: 'Hong Kong' },
    { lat: 34.6937, lon: 135.5023, timestamp: ts(10, 35), label: 'Osaka, Japón' },
    { lat: -31.9505, lon: 115.8605, timestamp: ts(11, 20), label: 'Perth, Australia' },
    { lat: -23.5505, lon: -46.6333, timestamp: ts(12, 15), label: 'São Paulo, Brasil' },
    { lat: -12.0464, lon: -77.0428, timestamp: ts(13, 0), label: 'Lima, Perú' },
    { lat: 38.7223, lon: -9.1393, timestamp: ts(14, 0), label: 'Lisboa, Portugal' },
    { lat: 41.3879, lon: 2.1699, timestamp: ts(15, 15), label: 'Barcelona, España' },
  ];
}

// Hora de llegada a la casa (siempre 18:00)
export function getArrivalTime(): Date {
  return new Date(`${eventDate}T18:00:00+01:00`);
}

// Hora de salida (siempre 08:00)
export function getTrackingStart(): Date {
  return new Date(`${eventDate}T08:00:00+01:00`);
}

// Hora final (después de las 18:00, los Reyes quedan en la casa)
export function getTrackingEnd(): Date {
  return new Date(`${eventDate}T18:00:00+01:00`);
}

// Helper para verificar si estamos antes del inicio
export function isBeforeTracking(): boolean {
  return new Date() < getTrackingStart();
}

// Helper para verificar si ya terminó
export function isAfterTracking(): boolean {
  return new Date() >= getTrackingEnd();
}

// Genera la ruta completa para un Rey, añadiendo el destino final (casa del perfil)
export function getFullRoute(
  rey: ReyName,
  targetLat: number,
  targetLon: number,
  targetLabel: string
): Waypoint[] {
  let baseRoute: Waypoint[];
  
  switch (rey) {
    case 'melchor':
      baseRoute = getMelchorBaseRoute();
      break;
    case 'gaspar':
      baseRoute = getGasparBaseRoute();
      break;
    case 'baltasar':
      baseRoute = getBaltasarBaseRoute();
      break;
  }
  
  // Añadir el destino final a las 18:00
  const finalWaypoint: Waypoint = {
    lat: targetLat,
    lon: targetLon,
    timestamp: `${eventDate}T18:00:00+01:00`,
    label: targetLabel,
  };
  
  return [...baseRoute, finalWaypoint];
}

// Avatares disponibles para perfiles
export const PROFILE_AVATARS = ['👶', '👧', '👦', '🧒', '👸', '🤴', '🎁', '⭐', '🐪', '👑'];
