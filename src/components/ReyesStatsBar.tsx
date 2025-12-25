import { 
  AllReyesPositions, 
  AllReyesETA, 
  AllReyesStats,
  formatTimeRemaining, 
  formatExactTime 
} from '@/lib/reyesTracking';
import { REYES_INFO, ReyName } from '@/lib/reyesWaypoints';
import { Gift, Gauge, Mountain, Navigation, Clock, Candy, Star } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  avatar: string;
  city_label: string;
}

type VisibleReyes = 'all' | ReyName;

interface ReyesStatsBarProps {
  reyesPositions: AllReyesPositions | null;
  reyesETA: AllReyesETA | null;
  reyesStats: AllReyesStats | null;
  selectedProfile: Profile | null;
  currentTime: Date;
  isTracking: boolean;
  isWaiting?: boolean;
  visibleReyes: VisibleReyes;
}

const REY_ICONS: Record<ReyName, string> = {
  melchor: '👑',
  gaspar: '🎁',
  baltasar: '⭐',
};

const REY_COLORS: Record<ReyName, string> = {
  melchor: 'bg-reyes-gold/20 text-reyes-gold',
  gaspar: 'bg-reyes-red/20 text-reyes-red',
  baltasar: 'bg-reyes-blue/20 text-reyes-blue',
};

export function ReyesStatsBar({ 
  reyesPositions, 
  reyesETA, 
  reyesStats,
  selectedProfile, 
  currentTime, 
  isTracking, 
  isWaiting,
  visibleReyes,
}: ReyesStatsBarProps) {
  // Waiting state
  if (isWaiting) {
    return (
      <div className="glass rounded-t-3xl p-4">
        <div className="flex items-center gap-4 py-2">
          <div className="flex text-3xl gap-1">
            <span className="animate-bounce-soft" style={{ animationDelay: '0s' }}>👑</span>
            <span className="animate-bounce-soft" style={{ animationDelay: '0.2s' }}>🎁</span>
            <span className="animate-bounce-soft" style={{ animationDelay: '0.4s' }}>⭐</span>
          </div>
          <div className="flex-1">
            <p className="text-lg font-fredoka text-snow">Los Reyes se preparan</p>
            <p className="text-sm text-muted-foreground">en Etiopía, listos para partir</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-2 mt-3">
          {(['melchor', 'gaspar', 'baltasar'] as ReyName[]).map((rey) => (
            <div key={rey} className={`rounded-xl p-3 text-center ${REY_COLORS[rey]}`}>
              <div className="text-2xl mb-1">{REY_ICONS[rey]}</div>
              <p className="text-xs font-fredoka">{REYES_INFO[rey].name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Ended state
  if (!isTracking && !isWaiting) {
    return (
      <div className="glass rounded-t-3xl p-4">
        <div className="text-center py-4">
          <div className="flex justify-center gap-2 text-3xl mb-2">
            <span>👑</span><span>🎁</span><span>⭐</span>
          </div>
          <p className="text-lg font-fredoka text-snow">¡Los Reyes han llegado!</p>
          <p className="text-sm text-muted-foreground">Mira debajo del árbol...</p>
          <p className="text-xs text-reyes-gold mt-2">🎁 ¡Feliz día de Reyes! 🎁</p>
        </div>
      </div>
    );
  }

  if (!reyesPositions || !reyesETA || !reyesStats) {
    return null;
  }

  const reyesToShow: ReyName[] = visibleReyes === 'all' 
    ? ['melchor', 'gaspar', 'baltasar'] 
    : [visibleReyes];

  return (
    <div className="glass rounded-t-3xl p-4 space-y-4 max-h-[50vh] overflow-y-auto">
      {/* Combined ETA */}
      {selectedProfile && reyesETA.combined && (
        <div className="bg-reyes-gold/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{selectedProfile.avatar}</div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">Casa de {selectedProfile.name}</p>
              {reyesETA.combined.isPassed ? (
                <p className="text-lg font-fredoka text-reyes-gold">¡Ya llegaron! 🎁</p>
              ) : reyesETA.combined.isNear ? (
                <p className="text-lg font-fredoka text-reyes-gold animate-pulse">¡Están llegando! 👑</p>
              ) : reyesETA.combined.eta ? (
                <div>
                  <p className="text-lg font-fredoka text-snow">
                    {formatTimeRemaining(reyesETA.combined.eta, currentTime)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Llegada: {formatExactTime(reyesETA.combined.eta)}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* Individual Rey stats */}
      <div className="space-y-3">
        {reyesToShow.map((rey) => (
          <div key={rey} className={`rounded-xl p-3 ${REY_COLORS[rey].replace('text-', 'border-').replace('/20', '/30')} border`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{REY_ICONS[rey]}</span>
              <div className="flex-1">
                <p className="font-fredoka text-snow">{REYES_INFO[rey].name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {reyesPositions[rey].currentSegmentLabel}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-snow">
                  {Math.round(reyesETA[rey].distance).toLocaleString()} km
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="flex items-center gap-1">
                <Gauge className="w-3 h-3 text-muted-foreground" />
                <span>{reyesPositions[rey].speed.toLocaleString()} km/h</span>
              </div>
              <div className="flex items-center gap-1">
                <Mountain className="w-3 h-3 text-muted-foreground" />
                <span>{reyesPositions[rey].altitude.toLocaleString()} m</span>
              </div>
              <div className="flex items-center gap-1">
                <Gift className="w-3 h-3 text-muted-foreground" />
                <span>{formatLargeNumber(reyesStats[rey].giftsDelivered)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Navigation className="w-3 h-3 text-muted-foreground" />
                <span className="truncate">{reyesPositions[rey].nextStop.split(',')[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {reyesPositions && (
        <div>
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Progreso del viaje</span>
            <span>{reyesPositions.melchor.progress}%</span>
          </div>
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <div 
              className="h-full gradient-reyes transition-all duration-1000"
              style={{ width: `${reyesPositions.melchor.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function formatLargeNumber(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
}
