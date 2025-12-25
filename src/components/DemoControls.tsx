import { Button } from '@/components/ui/button';
import { useDemoStore } from '@/lib/demoStore';
import { Play, Pause, SkipForward, FastForward, RotateCcw, MapPin, Flag, Home } from 'lucide-react';

export function DemoControls() {
  const isDemoMode = useDemoStore((s) => s.isDemoMode);
  const isPlaying = useDemoStore((s) => s.isPlaying);
  const speedMultiplier = useDemoStore((s) => s.speedMultiplier);
  const simulatedTime = useDemoStore((s) => s.simulatedTime);
  const togglePlayPause = useDemoStore((s) => s.togglePlayPause);
  const setSpeedMultiplier = useDemoStore((s) => s.setSpeedMultiplier);
  const jumpToStart = useDemoStore((s) => s.jumpToStart);
  const jumpToEurope = useDemoStore((s) => s.jumpToEurope);
  const jumpToSpain = useDemoStore((s) => s.jumpToSpain);
  const jumpToEnd = useDemoStore((s) => s.jumpToEnd);
  const disableDemoMode = useDemoStore((s) => s.disableDemoMode);

  if (!isDemoMode) return null;

  const formatTime = (date: Date) => {
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const speeds = [60, 600, 1000, 2000];

  return (
    <div className="fixed top-16 left-4 right-4 z-40 animate-slide-in-top">
      <div className="glass rounded-2xl p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🧪</span>
            <span className="font-fredoka text-snow">Modo Demo</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={disableDemoMode}
            className="text-destructive hover:text-destructive"
          >
            Salir
          </Button>
        </div>

        {/* Current time */}
        <div className="bg-muted/30 rounded-xl p-3 text-center">
          <p className="text-xs text-muted-foreground">Hora simulada</p>
          <p className="text-lg font-mono text-reyes-gold">
            {formatTime(simulatedTime)}
          </p>
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={jumpToStart}
            title="Ir al inicio"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button
            size="icon"
            onClick={togglePlayPause}
            className="gradient-reyes text-snow w-12 h-12"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={jumpToEnd}
            title="Ir al final"
          >
            <SkipForward className="w-4 h-4" />
          </Button>
        </div>

        {/* Speed controls */}
        <div className="flex items-center justify-center gap-1">
          <FastForward className="w-4 h-4 text-muted-foreground mr-1" />
          {speeds.map((speed) => (
            <Button
              key={speed}
              variant={speedMultiplier === speed ? "default" : "outline"}
              size="sm"
              onClick={() => setSpeedMultiplier(speed)}
              className={speedMultiplier === speed ? "gradient-reyes text-snow" : ""}
            >
              x{speed}
            </Button>
          ))}
        </div>

        {/* Quick jumps */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={jumpToStart}
            className="flex items-center gap-1"
          >
            <Home className="w-3 h-3" />
            <span className="text-xs">Salida</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={jumpToEurope}
            className="flex items-center gap-1"
          >
            <MapPin className="w-3 h-3" />
            <span className="text-xs">Europa</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={jumpToSpain}
            className="flex items-center gap-1"
          >
            <Flag className="w-3 h-3" />
            <span className="text-xs">España</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
