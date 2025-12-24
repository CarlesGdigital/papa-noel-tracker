// Fun messages for Santa tracking
export interface FunMessage {
  id: string;
  type: 'info' | 'fun' | 'warning' | 'arrival';
  message: string;
  emoji: string;
}

const RANDOM_MESSAGES: FunMessage[] = [
  { id: 'reindeer-snack', type: 'fun', message: '¡Los renos piden chocolate caliente!', emoji: '🦌' },
  { id: 'turbulence', type: 'fun', message: 'Pequeñas turbulencias sobre el Atlántico...', emoji: '🌊' },
  { id: 'cookies', type: 'fun', message: 'Papá Noel acaba de comer unas galletas deliciosas', emoji: '🍪' },
  { id: 'rudolf-nose', type: 'fun', message: 'La nariz de Rudolf brilla más que nunca', emoji: '🔴' },
  { id: 'elves-cheering', type: 'fun', message: 'Los elfos animan desde el Polo Norte', emoji: '🧝' },
  { id: 'snow-clouds', type: 'fun', message: 'Atravesando nubes de nieve mágica', emoji: '❄️' },
  { id: 'chimney-practice', type: 'fun', message: 'Practicando la técnica de bajada por chimeneas', emoji: '🏠' },
  { id: 'gift-check', type: 'fun', message: 'Revisando la lista de regalos... ¡todos verificados!', emoji: '📋' },
  { id: 'starlight', type: 'fun', message: 'Las estrellas iluminan el camino', emoji: '⭐' },
  { id: 'happy-children', type: 'fun', message: 'Millones de niños esperan con ilusión', emoji: '👶' },
  { id: 'hot-cocoa', type: 'fun', message: 'Papá Noel disfruta de un termo de chocolate', emoji: '☕' },
  { id: 'sleigh-speed', type: 'fun', message: '¡El trineo alcanza velocidad supersónica!', emoji: '🚀' },
  { id: 'northern-lights', type: 'fun', message: 'Aurora boreal a la vista', emoji: '🌌' },
  { id: 'reindeer-singing', type: 'fun', message: 'Los renos cantan villancicos', emoji: '🎵' },
  { id: 'gift-wrap', type: 'fun', message: 'Los elfos terminan de envolver el último regalo', emoji: '🎁' },
  { id: 'jingle-bells', type: 'fun', message: '¡Tilín tilín! Suenan los cascabeles', emoji: '🔔' },
  { id: 'cloud-surfing', type: 'fun', message: 'Surfeando nubes esponjosas', emoji: '☁️' },
  { id: 'magic-dust', type: 'fun', message: 'Esparciendo polvo mágico navideño', emoji: '✨' },
  { id: 'sleigh-wax', type: 'fun', message: 'El trineo está recién encerado', emoji: '🛷' },
  { id: 'reindeer-rest', type: 'fun', message: 'Breve parada para que descansen los renos', emoji: '😴' },
];

// Event-based messages
export const EVENT_MESSAGES = {
  departure: { id: 'departure', type: 'info' as const, message: '¡Papá Noel ha salido de Laponia! El viaje comienza', emoji: '🎅' },
  europeEntry: { id: 'europe-entry', type: 'info' as const, message: '¡Papá Noel ha entrado en Europa!', emoji: '🇪🇺' },
  spainEntry: { id: 'spain-entry', type: 'info' as const, message: '¡Papá Noel ha llegado a España!', emoji: '🇪🇸' },
  eta60min: { id: 'eta-60', type: 'warning' as const, message: '¡Llegará a tu casa en aproximadamente 1 hora!', emoji: '⏰' },
  eta15min: { id: 'eta-15', type: 'warning' as const, message: '¡Solo 15 minutos para que llegue!', emoji: '🎄' },
  eta5min: { id: 'eta-5', type: 'warning' as const, message: '¡5 minutos! ¡Prepara las galletas!', emoji: '🍪' },
  eta1min: { id: 'eta-1', type: 'warning' as const, message: '¡1 minuto! ¡A la cama ya!', emoji: '🛏️' },
  arriving: { id: 'arriving', type: 'arrival' as const, message: '¡Papá Noel está llegando a tu casa!', emoji: '🎅' },
  passed: { id: 'passed', type: 'arrival' as const, message: '¡Papá Noel ha pasado por tu casa! ¡Mañana los regalos!', emoji: '🎁' },
  returned: { id: 'returned', type: 'info' as const, message: 'Papá Noel ha vuelto a Laponia. ¡Feliz Navidad!', emoji: '🏠' },
};

// Country flags mapping
export const COUNTRY_FLAGS: Record<string, string> = {
  'Finlandia': '🇫🇮',
  'Suecia': '🇸🇪',
  'Dinamarca': '🇩🇰',
  'Alemania': '🇩🇪',
  'Países Bajos': '🇳🇱',
  'Bélgica': '🇧🇪',
  'Francia': '🇫🇷',
  'España': '🇪🇸',
  'Portugal': '🇵🇹',
  'Marruecos': '🇲🇦',
  'Canarias': '🇮🇨',
  'USA': '🇺🇸',
  'México': '🇲🇽',
  'Brasil': '🇧🇷',
  'Argentina': '🇦🇷',
  'Japón': '🇯🇵',
  'China': '🇨🇳',
  'India': '🇮🇳',
  'EAU': '🇦🇪',
  'Turquía': '🇹🇷',
  'Grecia': '🇬🇷',
  'Italia': '🇮🇹',
  'Suiza': '🇨🇭',
  'Rusia': '🇷🇺',
};

// Extract country from waypoint label
export function extractCountry(label: string): string | null {
  // Handle special cases
  if (label === 'Santa Claus Village') return 'Finlandia';
  if (label.includes('Canarias') || label.includes('Gran Canaria') || label.includes('Tenerife')) return 'Canarias';
  if (label.includes('Santiago de Compostela')) return 'España';
  
  // Standard format: "City, Country"
  const parts = label.split(', ');
  if (parts.length >= 2) {
    return parts[parts.length - 1];
  }
  
  return null;
}

// Create a country entry message
export function createCountryMessage(country: string): FunMessage {
  const flag = COUNTRY_FLAGS[country] || '🌍';
  return {
    id: `country-${country}`,
    type: 'info',
    message: `¡Papá Noel ha llegado a ${country}!`,
    emoji: flag,
  };
}

// Get a random fun message
export function getRandomMessage(): FunMessage {
  const index = Math.floor(Math.random() * RANDOM_MESSAGES.length);
  return RANDOM_MESSAGES[index];
}

// ETA thresholds in minutes
export const ETA_THRESHOLDS = [60, 15, 5, 1];

// Check which ETA threshold has been crossed
export function getETAThreshold(etaMinutes: number): number | null {
  for (const threshold of ETA_THRESHOLDS) {
    if (etaMinutes <= threshold) {
      return threshold;
    }
  }
  return null;
}
