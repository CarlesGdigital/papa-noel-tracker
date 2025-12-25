import { useState, useEffect, useRef } from 'react';
import { AllReyesPositions, AllReyesETA } from '@/lib/reyesTracking';
import { 
  FunMessage, 
  getRandomReyMessage, 
  extractCountry, 
  createCountryMessage, 
  EVENT_MESSAGES,
  ETA_THRESHOLDS,
} from '@/lib/reyesMessages';
import { ReyName } from '@/lib/reyesWaypoints';

interface Profile {
  id: string;
  name: string;
}

interface ReyesMessageToastProps {
  isTracking: boolean;
  reyesPositions: AllReyesPositions | null;
  reyesETA: AllReyesETA | null;
  selectedProfile: Profile | null;
}

export function ReyesMessageToast({
  isTracking,
  reyesPositions,
  reyesETA,
  selectedProfile,
}: ReyesMessageToastProps) {
  const [currentMessage, setCurrentMessage] = useState<FunMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  const triggeredEventsRef = useRef<Set<string>>(new Set());
  const lastCountryRef = useRef<string | null>(null);
  const lastRandomMessageRef = useRef<number>(0);
  const lastETAThresholdRef = useRef<number | null>(null);

  const showMessage = (message: FunMessage) => {
    setCurrentMessage(message);
    setIsVisible(true);
    setTimeout(() => setIsVisible(false), 5000);
  };

  // Track country changes (use Melchor's position as reference)
  useEffect(() => {
    if (!isTracking || !reyesPositions) return;

    const currentLocation = reyesPositions.melchor.currentSegmentLabel;
    const country = extractCountry(currentLocation);
    
    if (country && country !== lastCountryRef.current) {
      lastCountryRef.current = country;
      
      if (country === 'España' && !triggeredEventsRef.current.has('spain')) {
        triggeredEventsRef.current.add('spain');
        showMessage(EVENT_MESSAGES.spainEntry);
      } else if (!triggeredEventsRef.current.has(`country-${country}`)) {
        triggeredEventsRef.current.add(`country-${country}`);
        showMessage(createCountryMessage(country));
      }
    }
  }, [isTracking, reyesPositions?.melchor.currentSegmentLabel]);

  // Track departure and ETA events
  useEffect(() => {
    if (!isTracking) {
      triggeredEventsRef.current.clear();
      lastETAThresholdRef.current = null;
      return;
    }

    // Departure message
    if (reyesPositions && reyesPositions.melchor.progress > 0 && !triggeredEventsRef.current.has('departure')) {
      triggeredEventsRef.current.add('departure');
      showMessage(EVENT_MESSAGES.departure);
    }

    // ETA-based messages
    if (reyesETA && reyesETA.combined.eta && selectedProfile) {
      const now = new Date();
      const etaMinutes = Math.floor((reyesETA.combined.eta.getTime() - now.getTime()) / 60000);
      
      for (const threshold of ETA_THRESHOLDS) {
        if (etaMinutes <= threshold && lastETAThresholdRef.current !== threshold && !triggeredEventsRef.current.has(`eta-${threshold}`)) {
          triggeredEventsRef.current.add(`eta-${threshold}`);
          lastETAThresholdRef.current = threshold;
          
          switch (threshold) {
            case 60: showMessage(EVENT_MESSAGES.eta60min); break;
            case 15: showMessage(EVENT_MESSAGES.eta15min); break;
            case 5: showMessage(EVENT_MESSAGES.eta5min); break;
            case 1: showMessage(EVENT_MESSAGES.eta1min); break;
          }
          break;
        }
      }

      // Arrival message
      if (reyesETA.combined.isNear && !triggeredEventsRef.current.has('arriving')) {
        triggeredEventsRef.current.add('arriving');
        showMessage(EVENT_MESSAGES.arriving);
      }

      // Passed message
      if (reyesETA.combined.isPassed && !triggeredEventsRef.current.has('passed')) {
        triggeredEventsRef.current.add('passed');
        showMessage(EVENT_MESSAGES.passed);
      }
    }
  }, [isTracking, reyesPositions, reyesETA, selectedProfile]);

  // Random messages every 2-3 minutes
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastRandomMessageRef.current > 120000) { // 2 minutes minimum
        lastRandomMessageRef.current = now;
        const reyes: (ReyName | undefined)[] = ['melchor', 'gaspar', 'baltasar', undefined];
        const randomRey = reyes[Math.floor(Math.random() * reyes.length)];
        showMessage(getRandomReyMessage(randomRey));
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isTracking]);

  if (!currentMessage || !isVisible) return null;

  const getBgColor = () => {
    switch (currentMessage.type) {
      case 'arrival': return 'bg-reyes-gold/90';
      case 'warning': return 'bg-reyes-purple/90';
      case 'info': return 'bg-reyes-blue/90';
      default: return 'bg-card/90';
    }
  };

  return (
    <div className="fixed top-20 left-4 right-4 z-50 animate-slide-in-top">
      <div className={`${getBgColor()} backdrop-blur-lg rounded-2xl p-4 shadow-lg flex items-center gap-3`}>
        <span className="text-3xl">{currentMessage.emoji}</span>
        <p className="flex-1 text-snow font-medium">{currentMessage.message}</p>
      </div>
    </div>
  );
}
