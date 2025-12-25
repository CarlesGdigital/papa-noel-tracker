import { ReyName, REYES_INFO } from './reyesWaypoints';

export interface FunMessage {
  id: string;
  type: 'info' | 'fun' | 'warning' | 'arrival';
  message: string;
  emoji: string;
  rey?: ReyName;
}

// Mensajes por personalidad de cada Rey
const MELCHOR_MESSAGES: FunMessage[] = [
  { id: 'melchor-1', type: 'fun', message: 'Melchor repasa su lista de regalos por tercera vez', emoji: '📋', rey: 'melchor' },
  { id: 'melchor-2', type: 'fun', message: 'Melchor ha organizado los regalos por color', emoji: '🎁', rey: 'melchor' },
  { id: 'melchor-3', type: 'fun', message: 'Melchor recuerda: ¡no olvidar los zapatos!', emoji: '👟', rey: 'melchor' },
  { id: 'melchor-4', type: 'fun', message: 'Melchor verifica las coordenadas GPS de cada casa', emoji: '🗺️', rey: 'melchor' },
  { id: 'melchor-5', type: 'fun', message: 'Melchor ya tiene todo calculado perfectamente', emoji: '✅', rey: 'melchor' },
  { id: 'melchor-6', type: 'fun', message: 'Melchor revisa que su camello lleve agua suficiente', emoji: '🐪', rey: 'melchor' },
];

const GASPAR_MESSAGES: FunMessage[] = [
  { id: 'gaspar-1', type: 'fun', message: 'Gaspar está haciendo el payaso con los camellos', emoji: '🤪', rey: 'gaspar' },
  { id: 'gaspar-2', type: 'fun', message: '¿Gaspar ha robado un caramelo? ¡Qué travieso!', emoji: '🍬', rey: 'gaspar' },
  { id: 'gaspar-3', type: 'fun', message: 'Gaspar se pregunta si habrá turrón en las casas', emoji: '🍫', rey: 'gaspar' },
  { id: 'gaspar-4', type: 'fun', message: 'Gaspar acaba de contar un chiste a Baltasar', emoji: '😂', rey: 'gaspar' },
  { id: 'gaspar-5', type: 'fun', message: 'Gaspar intenta hacer trucos con su corona', emoji: '👑', rey: 'gaspar' },
  { id: 'gaspar-6', type: 'fun', message: 'Gaspar silba una canción mientras vuela', emoji: '🎵', rey: 'gaspar' },
];

const BALTASAR_MESSAGES: FunMessage[] = [
  { id: 'baltasar-1', type: 'fun', message: 'Baltasar sigue la estrella con mirada épica', emoji: '⭐', rey: 'baltasar' },
  { id: 'baltasar-2', type: 'fun', message: 'La capa de Baltasar ondea majestuosamente', emoji: '🌟', rey: 'baltasar' },
  { id: 'baltasar-3', type: 'fun', message: 'Baltasar contempla el firmamento nocturno', emoji: '🌌', rey: 'baltasar' },
  { id: 'baltasar-4', type: 'fun', message: 'Baltasar viaja con el poder de las estrellas', emoji: '✨', rey: 'baltasar' },
  { id: 'baltasar-5', type: 'fun', message: 'La magia de Baltasar ilumina el camino', emoji: '💫', rey: 'baltasar' },
  { id: 'baltasar-6', type: 'fun', message: 'Baltasar porta el incienso más precioso', emoji: '🔮', rey: 'baltasar' },
];

// Mensajes por regiones
export const REGION_MESSAGES: Record<string, FunMessage> = {
  'Etiopía': { id: 'region-ethiopia', type: 'info', message: '¡Los Reyes salen de Etiopía! ¡Empieza la aventura!', emoji: '🇪🇹' },
  'Arabia': { id: 'region-arabia', type: 'info', message: '¡Atravesando Arabia! El desierto brilla bajo las estrellas', emoji: '🏜️' },
  'India': { id: 'region-india', type: 'info', message: '¡En India! Los colores de la magia los envuelven', emoji: '🇮🇳' },
  'China': { id: 'region-china', type: 'info', message: '¡Sobre China! ¡Qué país tan grande!', emoji: '🇨🇳' },
  'Japón': { id: 'region-japan', type: 'info', message: '¡En Japón! El sol naciente los saluda', emoji: '🇯🇵' },
  'Australia': { id: 'region-australia', type: 'info', message: '¡Parada en Australia! Los koalas duermen', emoji: '🇦🇺' },
  'USA': { id: 'region-usa', type: 'info', message: '¡En Estados Unidos! ¡Cuántas luces navideñas!', emoji: '🇺🇸' },
  'México': { id: 'region-mexico', type: 'info', message: '¡Volando sobre México! ¡Qué bonitas piñatas!', emoji: '🇲🇽' },
  'Brasil': { id: 'region-brazil', type: 'info', message: '¡En Brasil! ¡Hace calor aquí en verano!', emoji: '🇧🇷' },
  'Europa': { id: 'region-europe', type: 'info', message: '¡Los Reyes han llegado a Europa!', emoji: '🇪🇺' },
  'España': { id: 'region-spain', type: 'info', message: '¡Los Reyes Magos ya están en España!', emoji: '🇪🇸' },
};

// Mensajes de evento
export const EVENT_MESSAGES = {
  departure: { id: 'departure', type: 'info' as const, message: '¡Los Reyes Magos han salido de Etiopía! ¡Empieza el viaje!', emoji: '🐪' },
  europeEntry: { id: 'europe-entry', type: 'info' as const, message: '¡Los Reyes han llegado a Europa!', emoji: '🇪🇺' },
  spainEntry: { id: 'spain-entry', type: 'info' as const, message: '¡Los Reyes Magos ya están en España!', emoji: '🇪🇸' },
  eta60min: { id: 'eta-60', type: 'warning' as const, message: '¡Llegarán a tu casa en aproximadamente 1 hora!', emoji: '⏰' },
  eta15min: { id: 'eta-15', type: 'warning' as const, message: '¡Solo 15 minutos para que lleguen!', emoji: '🎄' },
  eta5min: { id: 'eta-5', type: 'warning' as const, message: '¡5 minutos! ¡Prepara los zapatos!', emoji: '👟' },
  eta1min: { id: 'eta-1', type: 'warning' as const, message: '¡1 minuto! ¡A la cama ya!', emoji: '🛏️' },
  arriving: { id: 'arriving', type: 'arrival' as const, message: '¡Los Reyes Magos están llegando a tu casa!', emoji: '👑' },
  passed: { id: 'passed', type: 'arrival' as const, message: '¡Los Reyes Magos han dejado los regalos! ¡Mañana los encontrarás!', emoji: '🎁' },
};

// Banderas de países
export const COUNTRY_FLAGS: Record<string, string> = {
  'Etiopía': '🇪🇹',
  'Arabia Saudí': '🇸🇦',
  'Egipto': '🇪🇬',
  'Kenia': '🇰🇪',
  'Turquía': '🇹🇷',
  'EAU': '🇦🇪',
  'India': '🇮🇳',
  'China': '🇨🇳',
  'Japón': '🇯🇵',
  'Corea del Sur': '🇰🇷',
  'Hong Kong': '🇭🇰',
  'Australia': '🇦🇺',
  'Nueva Zelanda': '🇳🇿',
  'USA': '🇺🇸',
  'Canadá': '🇨🇦',
  'México': '🇲🇽',
  'Brasil': '🇧🇷',
  'Perú': '🇵🇪',
  'Reino Unido': '🇬🇧',
  'Francia': '🇫🇷',
  'Alemania': '🇩🇪',
  'Italia': '🇮🇹',
  'Portugal': '🇵🇹',
  'España': '🇪🇸',
};

// Obtener mensaje aleatorio de un Rey
export function getRandomReyMessage(rey?: ReyName): FunMessage {
  let messages: FunMessage[];
  
  if (rey) {
    switch (rey) {
      case 'melchor':
        messages = MELCHOR_MESSAGES;
        break;
      case 'gaspar':
        messages = GASPAR_MESSAGES;
        break;
      case 'baltasar':
        messages = BALTASAR_MESSAGES;
        break;
    }
  } else {
    // Mensaje aleatorio de cualquier Rey
    const allMessages = [...MELCHOR_MESSAGES, ...GASPAR_MESSAGES, ...BALTASAR_MESSAGES];
    messages = allMessages;
  }
  
  return messages[Math.floor(Math.random() * messages.length)];
}

// Extraer país de un label
export function extractCountry(label: string): string | null {
  const parts = label.split(', ');
  if (parts.length >= 2) {
    return parts[parts.length - 1];
  }
  return null;
}

// Crear mensaje de país
export function createCountryMessage(country: string): FunMessage {
  const flag = COUNTRY_FLAGS[country] || '🌍';
  return {
    id: `country-${country}`,
    type: 'info',
    message: `¡Los Reyes Magos están en ${country}!`,
    emoji: flag,
  };
}

// Umbrales de ETA en minutos
export const ETA_THRESHOLDS = [60, 15, 5, 1];

export function getETAThreshold(etaMinutes: number): number | null {
  for (const threshold of ETA_THRESHOLDS) {
    if (etaMinutes <= threshold) {
      return threshold;
    }
  }
  return null;
}
