import { useEffect, useState, useRef } from 'react';
import { FunMessage, getRandomMessage, EVENT_MESSAGES, ETA_THRESHOLDS } from '@/lib/messages';
import { ETAResult } from '@/lib/santaTracking';
import { X } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
}

interface MessageToastProps {
  isTracking: boolean;
  santaProgress: number;
  etaResult: ETAResult | null;
  selectedProfile: Profile | null;
}

export function MessageToast({ isTracking, santaProgress, etaResult, selectedProfile }: MessageToastProps) {
  const [currentMessage, setCurrentMessage] = useState<FunMessage | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const triggeredEventsRef = useRef<Set<string>>(new Set());
  const lastRandomMessageRef = useRef<number>(0);

  // Show a message
  const showMessage = (message: FunMessage) => {
    setCurrentMessage(message);
    setIsVisible(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 5000);
  };

  // Check for event-based messages
  useEffect(() => {
    if (!isTracking) return;

    const profileKey = selectedProfile?.id || 'default';

    // Departure message
    if (santaProgress > 0 && !triggeredEventsRef.current.has('departure')) {
      triggeredEventsRef.current.add('departure');
      showMessage(EVENT_MESSAGES.departure);
      return;
    }

    // Progress-based events (approximate)
    if (santaProgress > 5 && !triggeredEventsRef.current.has('europeEntry')) {
      triggeredEventsRef.current.add('europeEntry');
      showMessage(EVENT_MESSAGES.europeEntry);
      return;
    }

    if (santaProgress > 20 && !triggeredEventsRef.current.has('spainEntry')) {
      triggeredEventsRef.current.add('spainEntry');
      showMessage(EVENT_MESSAGES.spainEntry);
      return;
    }

    // ETA-based events for selected profile
    if (etaResult && selectedProfile && etaResult.eta) {
      const now = new Date();
      const etaMinutes = (etaResult.eta.getTime() - now.getTime()) / 60000;

      // Check ETA thresholds
      if (etaMinutes <= 1 && !triggeredEventsRef.current.has(`${profileKey}-eta1`)) {
        triggeredEventsRef.current.add(`${profileKey}-eta1`);
        showMessage(EVENT_MESSAGES.eta1min);
        return;
      }
      if (etaMinutes <= 5 && !triggeredEventsRef.current.has(`${profileKey}-eta5`)) {
        triggeredEventsRef.current.add(`${profileKey}-eta5`);
        showMessage(EVENT_MESSAGES.eta5min);
        return;
      }
      if (etaMinutes <= 15 && !triggeredEventsRef.current.has(`${profileKey}-eta15`)) {
        triggeredEventsRef.current.add(`${profileKey}-eta15`);
        showMessage(EVENT_MESSAGES.eta15min);
        return;
      }
      if (etaMinutes <= 60 && !triggeredEventsRef.current.has(`${profileKey}-eta60`)) {
        triggeredEventsRef.current.add(`${profileKey}-eta60`);
        showMessage(EVENT_MESSAGES.eta60min);
        return;
      }
    }

    // Arrival events
    if (etaResult && selectedProfile) {
      if (etaResult.isNear && !triggeredEventsRef.current.has(`${profileKey}-arriving`)) {
        triggeredEventsRef.current.add(`${profileKey}-arriving`);
        showMessage(EVENT_MESSAGES.arriving);
        return;
      }
      if (etaResult.isPassed && !triggeredEventsRef.current.has(`${profileKey}-passed`)) {
        triggeredEventsRef.current.add(`${profileKey}-passed`);
        showMessage(EVENT_MESSAGES.passed);
        return;
      }
    }

  }, [isTracking, santaProgress, etaResult, selectedProfile]);

  // Random messages every few minutes
  useEffect(() => {
    if (!isTracking) return;

    const interval = setInterval(() => {
      const now = Date.now();
      // Show random message every 2-4 minutes
      if (now - lastRandomMessageRef.current > 120000 + Math.random() * 120000) {
        lastRandomMessageRef.current = now;
        const randomMsg = getRandomMessage();
        showMessage(randomMsg);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [isTracking]);

  if (!currentMessage || !isVisible) return null;

  const bgColorClass = {
    info: 'bg-christmas-green/90',
    fun: 'bg-christmas-gold/90',
    warning: 'bg-christmas-red/90',
    arrival: 'bg-gradient-to-r from-christmas-red/90 to-christmas-gold/90',
  }[currentMessage.type];

  return (
    <div className="fixed top-4 left-4 right-4 z-50 animate-slide-in-top">
      <div className={`${bgColorClass} rounded-2xl p-4 shadow-lg flex items-center gap-3`}>
        <span className="text-2xl">{currentMessage.emoji}</span>
        <p className="flex-1 text-snow font-quicksand font-medium">
          {currentMessage.message}
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 rounded-lg hover:bg-white/20"
        >
          <X className="w-5 h-5 text-snow" />
        </button>
      </div>
    </div>
  );
}
