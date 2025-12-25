import { useState, useEffect } from 'react';
import { getTrackingStart, getEventDate } from '@/lib/reyesWaypoints';
import { useDemoStore } from '@/lib/demoStore';

interface ReyesCountdownProps {
  onTrackingStart: () => void;
}

export function ReyesCountdown({ onTrackingStart }: ReyesCountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const getCurrentTime = useDemoStore((s) => s.getCurrentTime);
  const isDemoMode = useDemoStore((s) => s.isDemoMode);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = getCurrentTime();
      const target = getTrackingStart();
      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        onTrackingStart();
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, isDemoMode ? 100 : 1000);
    return () => clearInterval(interval);
  }, [onTrackingStart, getCurrentTime, isDemoMode]);

  // Formatear fecha del evento
  const eventDate = getEventDate();
  const formattedDate = new Date(eventDate + 'T00:00:00').toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="text-center">
      <div className="flex justify-center gap-2 text-5xl mb-4">
        <span className="animate-float" style={{ animationDelay: '0s' }}>👑</span>
        <span className="animate-float" style={{ animationDelay: '0.3s' }}>🎁</span>
        <span className="animate-float" style={{ animationDelay: '0.6s' }}>⭐</span>
      </div>
      
      <h2 className="text-2xl font-fredoka text-snow mb-2">
        Los Reyes Magos están descansando
      </h2>
      <p className="text-muted-foreground mb-4">
        🏕️ En su campamento de Etiopía
      </p>
      <p className="text-reyes-gold font-medium mb-6">
        Saldrán el {formattedDate} a las 08:00
      </p>

      <div className="flex justify-center gap-3 mb-6">
        <TimeUnit value={timeLeft.days} label="días" />
        <div className="text-2xl text-reyes-gold/50 self-center">:</div>
        <TimeUnit value={timeLeft.hours} label="horas" />
        <div className="text-2xl text-reyes-gold/50 self-center">:</div>
        <TimeUnit value={timeLeft.minutes} label="min" />
        <div className="text-2xl text-reyes-gold/50 self-center">:</div>
        <TimeUnit value={timeLeft.seconds} label="seg" />
      </div>

      <div className="bg-reyes-gold/10 rounded-xl p-4 border border-reyes-gold/20">
        <p className="text-sm text-muted-foreground">
          🐪 Melchor, Gaspar y Baltasar están preparando
          <br />
          los camellos y cargando los regalos
        </p>
      </div>

      {isDemoMode && (
        <p className="text-xs text-reyes-gold mt-4">
          ⚡ Modo demo activo - usa los controles para saltar al inicio
        </p>
      )}
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-reyes-gold/20 border border-reyes-gold/30 flex items-center justify-center">
        <span className="text-xl md:text-2xl font-fredoka text-reyes-gold">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );
}
