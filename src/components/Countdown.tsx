import { useState, useEffect } from 'react';
import { TRACKING_START } from '@/lib/waypoints';

interface CountdownProps {
  onTrackingStart: () => void;
}

export function Countdown({ onTrackingStart }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = TRACKING_START.getTime() - now.getTime();

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
    <div className="flex flex-col items-center gap-6">
      <h2 className="text-2xl font-fredoka text-snow text-center">
        Papá Noel sale en...
      </h2>
      
      <div className="flex gap-3">
        <TimeUnit value={timeLeft.days} label="días" />
        <TimeUnit value={timeLeft.hours} label="horas" />
        <TimeUnit value={timeLeft.minutes} label="min" />
        <TimeUnit value={timeLeft.seconds} label="seg" />
      </div>

      <p className="text-muted-foreground text-center text-sm">
        24 de diciembre a las 18:00
      </p>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="glass rounded-xl p-3 min-w-[60px]">
        <span className="text-2xl font-fredoka text-christmas-gold">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs text-muted-foreground mt-1">{label}</span>
    </div>
  );
}
