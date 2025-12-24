// Santa's route waypoints with timestamps
// All times are in Europe/Madrid timezone (UTC+1 in winter)
export interface Waypoint {
  lat: number;
  lon: number;
  timestamp: string; // ISO 8601
  label: string;
}

// Santa starts at Santa Claus Village (Rovaniemi, Finland)
// Travels through Europe, reaches Spain between 21:00-00:00
// Valencia around 23:30, returns to Rovaniemi by 08:00 Dec 25

export const SANTA_WAYPOINTS: Waypoint[] = [
  // Start: Santa Claus Village, Rovaniemi, Finland
  { lat: 66.5436, lon: 25.8473, timestamp: '2025-12-24T18:00:00+01:00', label: 'Santa Claus Village' },
  
  // Northern Europe
  { lat: 64.1466, lon: 28.7675, timestamp: '2025-12-24T18:20:00+01:00', label: 'Joensuu, Finlandia' },
  { lat: 60.1699, lon: 24.9384, timestamp: '2025-12-24T18:45:00+01:00', label: 'Helsinki, Finlandia' },
  { lat: 59.3293, lon: 18.0686, timestamp: '2025-12-24T19:05:00+01:00', label: 'Estocolmo, Suecia' },
  { lat: 55.6761, lon: 12.5683, timestamp: '2025-12-24T19:30:00+01:00', label: 'Copenhague, Dinamarca' },
  
  // Central Europe
  { lat: 52.5200, lon: 13.4050, timestamp: '2025-12-24T19:50:00+01:00', label: 'Berlín, Alemania' },
  { lat: 52.3676, lon: 4.9041, timestamp: '2025-12-24T20:10:00+01:00', label: 'Ámsterdam, Países Bajos' },
  { lat: 50.8503, lon: 4.3517, timestamp: '2025-12-24T20:25:00+01:00', label: 'Bruselas, Bélgica' },
  { lat: 48.8566, lon: 2.3522, timestamp: '2025-12-24T20:45:00+01:00', label: 'París, Francia' },
  
  // Entry to Spain (21:00+)
  { lat: 43.2630, lon: -2.9350, timestamp: '2025-12-24T21:05:00+01:00', label: 'Bilbao, España' },
  { lat: 42.8782, lon: -8.5448, timestamp: '2025-12-24T21:25:00+01:00', label: 'Santiago de Compostela' },
  { lat: 41.6488, lon: -0.8891, timestamp: '2025-12-24T21:50:00+01:00', label: 'Zaragoza, España' },
  { lat: 41.3879, lon: 2.1699, timestamp: '2025-12-24T22:10:00+01:00', label: 'Barcelona, España' },
  
  // Madrid around 22:30
  { lat: 40.4168, lon: -3.7038, timestamp: '2025-12-24T22:30:00+01:00', label: 'Madrid, España' },
  
  // Southern Spain
  { lat: 37.3891, lon: -5.9845, timestamp: '2025-12-24T22:55:00+01:00', label: 'Sevilla, España' },
  { lat: 36.7213, lon: -4.4214, timestamp: '2025-12-24T23:10:00+01:00', label: 'Málaga, España' },
  { lat: 38.3452, lon: -0.4810, timestamp: '2025-12-24T23:25:00+01:00', label: 'Alicante, España' },
  
  // Valencia around 23:30
  { lat: 39.4699, lon: -0.3763, timestamp: '2025-12-24T23:30:00+01:00', label: 'Valencia, España' },
  
  // Continue through Spain and exit
  { lat: 39.8628, lon: -4.0273, timestamp: '2025-12-24T23:45:00+01:00', label: 'Toledo, España' },
  { lat: 38.9942, lon: -1.8564, timestamp: '2025-12-24T23:55:00+01:00', label: 'Albacete, España' },
  
  // Portugal and back up
  { lat: 38.7223, lon: -9.1393, timestamp: '2025-12-25T00:15:00+01:00', label: 'Lisboa, Portugal' },
  { lat: 41.1496, lon: -8.6109, timestamp: '2025-12-25T00:35:00+01:00', label: 'Oporto, Portugal' },
  
  // Morocco and Africa (quick stops)
  { lat: 33.9716, lon: -6.8498, timestamp: '2025-12-25T01:00:00+01:00', label: 'Rabat, Marruecos' },
  { lat: 31.6295, lon: -7.9811, timestamp: '2025-12-25T01:20:00+01:00', label: 'Marrakech, Marruecos' },
  
  // Atlantic Islands
  { lat: 28.4636, lon: -16.2518, timestamp: '2025-12-25T01:50:00+01:00', label: 'Tenerife, Canarias' },
  { lat: 28.1235, lon: -15.4363, timestamp: '2025-12-25T02:05:00+01:00', label: 'Gran Canaria' },
  
  // Americas (quick tour)
  { lat: 40.7128, lon: -74.0060, timestamp: '2025-12-25T02:45:00+01:00', label: 'Nueva York, USA' },
  { lat: 34.0522, lon: -118.2437, timestamp: '2025-12-25T03:15:00+01:00', label: 'Los Ángeles, USA' },
  { lat: 19.4326, lon: -99.1332, timestamp: '2025-12-25T03:45:00+01:00', label: 'Ciudad de México' },
  { lat: -22.9068, lon: -43.1729, timestamp: '2025-12-25T04:15:00+01:00', label: 'Río de Janeiro, Brasil' },
  { lat: -34.6037, lon: -58.3816, timestamp: '2025-12-25T04:35:00+01:00', label: 'Buenos Aires, Argentina' },
  
  // Asia quick stops
  { lat: 35.6762, lon: 139.6503, timestamp: '2025-12-25T05:15:00+01:00', label: 'Tokio, Japón' },
  { lat: 31.2304, lon: 121.4737, timestamp: '2025-12-25T05:35:00+01:00', label: 'Shanghái, China' },
  { lat: 28.6139, lon: 77.2090, timestamp: '2025-12-25T05:55:00+01:00', label: 'Nueva Delhi, India' },
  { lat: 25.2048, lon: 55.2708, timestamp: '2025-12-25T06:15:00+01:00', label: 'Dubái, EAU' },
  
  // Back through Europe
  { lat: 41.0082, lon: 28.9784, timestamp: '2025-12-25T06:35:00+01:00', label: 'Estambul, Turquía' },
  { lat: 37.9838, lon: 23.7275, timestamp: '2025-12-25T06:50:00+01:00', label: 'Atenas, Grecia' },
  { lat: 41.9028, lon: 12.4964, timestamp: '2025-12-25T07:05:00+01:00', label: 'Roma, Italia' },
  { lat: 47.3769, lon: 8.5417, timestamp: '2025-12-25T07:20:00+01:00', label: 'Zúrich, Suiza' },
  { lat: 55.7558, lon: 37.6173, timestamp: '2025-12-25T07:40:00+01:00', label: 'Moscú, Rusia' },
  
  // Return to Santa Claus Village
  { lat: 66.5436, lon: 25.8473, timestamp: '2025-12-25T08:00:00+01:00', label: 'Santa Claus Village' },
];

export const SANTA_VILLAGE = {
  lat: 66.5436,
  lon: 25.8473,
  label: 'Santa Claus Village, Rovaniemi',
};

// Event start and end times
// Note: These are fixed dates for the Christmas Eve 2025 event
export const TRACKING_START = new Date('2025-12-24T18:00:00+01:00');
export const TRACKING_END = new Date('2025-12-25T08:00:00+01:00');

// Helper to check if we should show countdown (before tracking starts)
export function isBeforeTracking(): boolean {
  return new Date() < TRACKING_START;
}
