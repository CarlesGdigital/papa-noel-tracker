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
    <div className="flex flex-col items-center gap-8">
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-fredoka text-snow mb-2">
          🎅 Papá Noel sale en...
        </h2>
        <p className="text-muted-foreground text-sm">
          24 de diciembre a las 18:00
        </p>
      </div>
      
      <div className="flex gap-4 md:gap-6">
        <TimeUnit value={timeLeft.days} label="DÍAS" />
        <div className="text-4xl md:text-5xl font-fredoka text-christmas-gold self-center pb-6">:</div>
        <TimeUnit value={timeLeft.hours} label="HORAS" />
        <div className="text-4xl md:text-5xl font-fredoka text-christmas-gold self-center pb-6">:</div>
        <TimeUnit value={timeLeft.minutes} label="MIN" />
        <div className="text-4xl md:text-5xl font-fredoka text-christmas-gold self-center pb-6">:</div>
        <TimeUnit value={timeLeft.seconds} label="SEG" />
      </div>

      <p className="text-center text-sm text-muted-foreground max-w-xs">
        Prepara tus calcetines y espera... ¡pronto comenzará el viaje mágico!
      </p>
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="glass rounded-2xl p-4 md:p-6 min-w-[70px] md:min-w-[90px] border border-christmas-gold/30">
        <span className="text-4xl md:text-6xl font-fredoka text-christmas-gold drop-shadow-glow">
          {value.toString().padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs md:text-sm text-muted-foreground mt-2 font-medium tracking-wider">{label}</span>
    </div>
  );
}
