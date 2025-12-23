import { SantaPosition, ETAResult, formatTimeRemaining, formatExactTime } from '@/lib/santaTracking';
import { Clock, MapPin, Gift, Gauge, Mountain, Navigation } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  avatar: string;
  city_label: string;
}

interface StatsBarProps {
  santaPosition: SantaPosition;
  etaResult: ETAResult | null;
  selectedProfile: Profile | null;
  currentTime: Date;
  isTracking: boolean;
  isWaiting?: boolean;
}

export function StatsBar({ santaPosition, etaResult, selectedProfile, currentTime, isTracking, isWaiting }: StatsBarProps) {
  // Waiting state - Santa is at the village
  if (isWaiting) {
    return (
      <div className="glass rounded-t-3xl p-4">
        <div className="flex items-center gap-4 py-2">
          <div className="text-4xl animate-bounce-soft">🎅</div>
          <div className="flex-1">
            <p className="text-lg font-fredoka text-snow">Papá Noel está preparándose</p>
            <p className="text-sm text-muted-foreground">en Santa Claus Village, Laponia</p>
          </div>
        </div>
        
        {/* Stats preview */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-christmas-red/20">
              <Gift className="w-5 h-5 text-christmas-red" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Regalos listos</p>
              <p className="text-sm font-fredoka text-snow">8.5B 🎁</p>
            </div>
          </div>

          <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-christmas-green/20">
              <Navigation className="w-5 h-5 text-christmas-green" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Primera parada</p>
              <p className="text-sm font-fredoka text-snow">Helsinki</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ended state
  if (!isTracking && !isWaiting) {
    return (
      <div className="glass rounded-t-3xl p-4">
        <div className="text-center py-4">
          <div className="text-4xl mb-2">😴</div>
          <p className="text-lg font-fredoka text-snow">Papá Noel está descansando</p>
          <p className="text-sm text-muted-foreground">en Santa Claus Village</p>
          <p className="text-xs text-christmas-gold mt-2">¡Feliz Navidad! 🎄</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-t-3xl p-4 space-y-4">
      {/* ETA Section */}
      {selectedProfile && etaResult && (
        <div className="bg-christmas-red/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{selectedProfile.avatar}</div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Casa de {selectedProfile.name}</p>
              {etaResult.isPassed ? (
                <p className="text-lg font-fredoka text-christmas-gold">
                  ¡Ya pasó! 🎁
                </p>
              ) : etaResult.isNear ? (
                <p className="text-lg font-fredoka text-christmas-gold animate-pulse">
                  ¡Está llegando! 🎅
                </p>
              ) : etaResult.eta ? (
                <div>
                  <p className="text-lg font-fredoka text-snow">
                    {formatTimeRemaining(etaResult.eta, currentTime)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Llegada: {formatExactTime(etaResult.eta)}
                  </p>
                </div>
              ) : (
                <p className="text-lg font-fredoka text-snow">
                  Calculando...
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Distancia</p>
              <p className="text-sm font-medium text-snow">
                {Math.round(etaResult.distance).toLocaleString()} km
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Gifts */}
        <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-christmas-red/20">
            <Gift className="w-5 h-5 text-christmas-red" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Regalos</p>
            <p className="text-sm font-fredoka text-snow">
              {formatLargeNumber(santaPosition.giftsDelivered)}
            </p>
          </div>
        </div>

        {/* Speed */}
        <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-christmas-gold/20">
            <Gauge className="w-5 h-5 text-christmas-gold" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Velocidad</p>
            <p className="text-sm font-fredoka text-snow">
              {santaPosition.speed.toLocaleString()} km/h
            </p>
          </div>
        </div>

        {/* Altitude */}
        <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-ice/20">
            <Mountain className="w-5 h-5 text-ice" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Altitud</p>
            <p className="text-sm font-fredoka text-snow">
              {santaPosition.altitude.toLocaleString()} m
            </p>
          </div>
        </div>

        {/* Next Stop */}
        <div className="bg-muted/30 rounded-xl p-3 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-christmas-green/20">
            <Navigation className="w-5 h-5 text-christmas-green" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Próxima parada</p>
            <p className="text-sm font-fredoka text-snow truncate">
              {santaPosition.nextStop.split(',')[0]}
            </p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Progreso del viaje</span>
          <span>{santaPosition.progress}%</span>
        </div>
        <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
          <div 
            className="h-full gradient-christmas transition-all duration-1000"
            style={{ width: `${santaPosition.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function formatLargeNumber(num: number): string {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + 'B';
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + 'M';
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + 'K';
  }
  return num.toString();
}
