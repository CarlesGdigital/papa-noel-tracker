import { useState, useEffect } from 'react';
import { getTrackingStart } from '@/lib/reyesWaypoints';

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

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
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
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [onTrackingStart]);

  return (
    <div className="text-center">
      <div className="flex justify-center gap-2 text-5xl mb-4">
        <span className="animate-float" style={{ animationDelay: '0s' }}>👑</span>
        <span className="animate-float" style={{ animationDelay: '0.3s' }}>🎁</span>
        <span className="animate-float" style={{ animationDelay: '0.6s' }}>⭐</span>
      </div>
      
      <h2 className="text-2xl font-fredoka text-snow mb-2">
        Los Reyes Magos saldrán pronto
      </h2>
      <p className="text-muted-foreground mb-6">5 de enero a las 08:00</p>

      <div className="flex justify-center gap-4 mb-6">
        <TimeUnit value={timeLeft.days} label="días" />
        <TimeUnit value={timeLeft.hours} label="horas" />
        <TimeUnit value={timeLeft.minutes} label="min" />
        <TimeUnit value={timeLeft.seconds} label="seg" />
      </div>

      <p className="text-sm text-muted-foreground">
        Melchor, Gaspar y Baltasar viajarán
        <br />
        desde Etiopía hasta tu casa 🐪
      </p>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-16 h-16 rounded-xl bg-reyes-gold/20 border border-reyes-gold/30 flex items-center justify-center">
        <span className="text-2xl font-fredoka text-reyes-gold">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );
}
