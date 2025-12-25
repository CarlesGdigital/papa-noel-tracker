import { useState, useEffect, useCallback } from 'react';
import { ReyesMap } from './ReyesMap';
import { ReyesStatsBar } from './ReyesStatsBar';
import { ProfileList } from './ProfileList';
import { ProfileModal } from './ProfileModal';
import { SettingsSheet } from './SettingsSheet';
import { ReyesMessageToast } from './ReyesMessageToast';
import { ConfettiEffect } from './ConfettiEffect';
import { ReyesCountdown } from './ReyesCountdown';
import { SnowEffect } from './SnowEffect';
import { DemoControls } from './DemoControls';
import { ReyesChecklist } from './ReyesChecklist';
import { 
  getAllReyesPositions, 
  getAllReyesETA, 
  getReyesStats,
  AllReyesPositions, 
  AllReyesETA,
  AllReyesStats,
} from '@/lib/reyesTracking';
import { getTrackingStart, getTrackingEnd, ReyName, ETHIOPIA_START } from '@/lib/reyesWaypoints';
import { getDeviceId } from '@/lib/deviceId';
import { useDemoStore } from '@/lib/demoStore';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Users, ChevronUp, ChevronDown, Crown } from 'lucide-react';

interface Profile {
  id: string;
  device_id: string;
  name: string;
  avatar: string;
  city_label: string;
  lat: number;
  lon: number;
  created_at: string;
}

type TrackingStatus = 'countdown' | 'tracking' | 'ended';
type VisibleReyes = 'all' | ReyName;

export function TrackerScreen() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfilesSheetOpen, setIsProfilesSheetOpen] = useState(false);
  const [isStatsExpanded, setIsStatsExpanded] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);
  const [visibleReyes, setVisibleReyes] = useState<VisibleReyes>('all');
  const [showChecklist, setShowChecklist] = useState(false);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [reyesPositions, setReyesPositions] = useState<AllReyesPositions | null>(null);
  const [reyesETA, setReyesETA] = useState<AllReyesETA | null>(null);
  const [reyesStats, setReyesStats] = useState<AllReyesStats | null>(null);
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatus>('countdown');

  const isDemoMode = useDemoStore((s) => s.isDemoMode);
  const getCurrentTime = useDemoStore((s) => s.getCurrentTime);
  const tick = useDemoStore((s) => s.tick);

  // Load profiles on mount
  useEffect(() => {
    const loadProfiles = async () => {
      const deviceId = getDeviceId();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('device_id', deviceId)
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error('Error loading profiles:', error);
        return;
      }
      
      setProfiles(data as Profile[]);
      
      if (data && data.length > 0) {
        setSelectedProfile(data[0] as Profile);
      } else {
        setTimeout(() => setShowProfilePrompt(true), 1500);
      }
    };
    
    loadProfiles();
  }, []);

  // Check tracking status
  useEffect(() => {
    const checkStatus = () => {
      const now = getCurrentTime();
      const start = getTrackingStart();
      const end = getTrackingEnd();
      
      if (now < start) {
        setTrackingStatus('countdown');
      } else if (now >= end) {
        setTrackingStatus('ended');
      } else {
        setTrackingStatus('tracking');
      }
    };
    
    checkStatus();
    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, [getCurrentTime, isDemoMode]);

  // Update positions and tick
  useEffect(() => {
    const interval = setInterval(() => {
      tick();
      
      const now = getCurrentTime();
      setCurrentTime(now);
      
      if (selectedProfile) {
        setReyesPositions(getAllReyesPositions(
          now,
          selectedProfile.lat,
          selectedProfile.lon,
          selectedProfile.city_label
        ));
        setReyesETA(getAllReyesETA(
          selectedProfile.lat,
          selectedProfile.lon,
          selectedProfile.city_label,
          now
        ));
      }
      setReyesStats(getReyesStats(now));
    }, 100);
    
    return () => clearInterval(interval);
  }, [getCurrentTime, tick, selectedProfile]);

  const handleProfileCreated = (profile: Profile) => {
    setProfiles(prev => {
      const existing = prev.find(p => p.id === profile.id);
      if (existing) {
        return prev.map(p => p.id === profile.id ? profile : p);
      }
      return [...prev, profile];
    });
    setSelectedProfile(profile);
    setEditingProfile(null);
    setShowProfilePrompt(false);
  };

  const handleProfileDeleted = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id));
    if (selectedProfile?.id === id) {
      setSelectedProfile(profiles.find(p => p.id !== id) || null);
    }
  };

  const handleResetProfiles = async () => {
    const deviceId = getDeviceId();
    await supabase.from('profiles').delete().eq('device_id', deviceId);
    setProfiles([]);
    setSelectedProfile(null);
  };

  const handleTrackingStart = useCallback(() => {
    setTrackingStatus('tracking');
  }, []);

  const isTracking = trackingStatus === 'tracking';
  const isWaiting = trackingStatus === 'countdown';

  return (
    <div className="relative h-screen flex flex-col overflow-hidden gradient-night">
      <SnowEffect count={15} />
      
      <DemoControls />
      
      {/* Header */}
      <header className="relative z-20 flex items-center justify-between p-4 safe-area-inset">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👑</span>
          <h1 className="font-fredoka text-lg text-snow">Reyes Magos</h1>
          {isDemoMode && (
            <span className="text-xs bg-reyes-gold text-accent-foreground px-2 py-0.5 rounded-full">
              DEMO
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {/* Rey selector */}
          <div className="flex bg-muted/50 rounded-xl p-1">
            {(['all', 'melchor', 'gaspar', 'baltasar'] as VisibleReyes[]).map((rey) => (
              <button
                key={rey}
                onClick={() => setVisibleReyes(rey)}
                className={`px-2 py-1 rounded-lg text-sm transition-colors ${
                  visibleReyes === rey 
                    ? 'bg-reyes-gold text-accent-foreground' 
                    : 'text-muted-foreground hover:text-snow'
                }`}
              >
                {rey === 'all' ? '👑' : rey === 'melchor' ? '👑' : rey === 'gaspar' ? '🎁' : '⭐'}
              </button>
            ))}
          </div>

          <Sheet open={isProfilesSheetOpen} onOpenChange={setIsProfilesSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-snow hover:bg-muted/50 relative">
                <Users className="w-5 h-5" />
                {profiles.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-reyes-gold text-xs flex items-center justify-center text-accent-foreground">
                    {profiles.length}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="glass border-border/50 w-80">
              <ProfileList
                profiles={profiles}
                selectedProfile={selectedProfile}
                onSelectProfile={(p) => {
                  setSelectedProfile(p);
                  setIsProfilesSheetOpen(false);
                }}
                onCreateProfile={() => {
                  setEditingProfile(null);
                  setIsProfileModalOpen(true);
                }}
                onEditProfile={(p) => {
                  setEditingProfile(p);
                  setIsProfileModalOpen(true);
                }}
                onProfileDeleted={handleProfileDeleted}
              />
            </SheetContent>
          </Sheet>
          
          <SettingsSheet
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled(!soundEnabled)}
            onResetProfiles={handleResetProfiles}
          />
        </div>
      </header>

      {/* Map */}
      <div className="flex-1 relative z-10">
        <ReyesMap
          currentTime={currentTime}
          selectedProfile={selectedProfile}
          isTracking={isTracking}
          showAtStart={isWaiting || trackingStatus === 'ended'}
          visibleReyes={visibleReyes}
        />
        
        {/* Countdown overlay */}
        {isWaiting && !isDemoMode && (
          <div className="absolute inset-0 flex items-center justify-center z-30 bg-background/60 backdrop-blur-sm">
            <div className="glass rounded-3xl p-8 md:p-12 mx-4 animate-fade-in border border-reyes-gold/30 shadow-2xl">
              <ReyesCountdown onTrackingStart={handleTrackingStart} />
            </div>
          </div>
        )}
        
        {/* Profile prompt */}
        {showProfilePrompt && profiles.length === 0 && !isDemoMode && (
          <div className="absolute bottom-32 left-4 right-4 z-30 animate-slide-up">
            <div className="glass rounded-2xl p-4 flex items-center gap-4">
              <div className="text-3xl">🏠</div>
              <div className="flex-1">
                <p className="text-snow font-fredoka">¡Añade tu casa!</p>
                <p className="text-xs text-muted-foreground">Para saber cuándo llegarán los Reyes</p>
              </div>
              <Button
                onClick={() => setIsProfileModalOpen(true)}
                className="gradient-reyes text-snow"
                size="sm"
              >
                Añadir
              </Button>
            </div>
          </div>
        )}

        {/* Checklist toggle */}
        {selectedProfile && (
          <Button
            onClick={() => setShowChecklist(!showChecklist)}
            className="absolute bottom-4 right-4 z-30 glass"
            size="sm"
          >
            ✅ Checklist
          </Button>
        )}

        {/* Checklist panel */}
        {showChecklist && selectedProfile && (
          <div className="absolute bottom-16 right-4 z-30 animate-slide-up">
            <ReyesChecklist profileId={selectedProfile.id} />
          </div>
        )}
      </div>

      {/* Stats bar */}
      <div className="relative z-20">
        <button
          onClick={() => setIsStatsExpanded(!isStatsExpanded)}
          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-card/80 backdrop-blur rounded-t-xl px-4 py-1"
        >
          {isStatsExpanded ? (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
        
        {isStatsExpanded && (
          <ReyesStatsBar
            reyesPositions={reyesPositions}
            reyesETA={reyesETA}
            reyesStats={reyesStats}
            selectedProfile={selectedProfile}
            currentTime={currentTime}
            isTracking={isTracking}
            isWaiting={isWaiting}
            visibleReyes={visibleReyes}
          />
        )}
      </div>

      {/* Modals and effects */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setEditingProfile(null);
        }}
        onProfileCreated={handleProfileCreated}
        editingProfile={editingProfile}
      />

      <ReyesMessageToast
        isTracking={isTracking}
        reyesPositions={reyesPositions}
        reyesETA={reyesETA}
        selectedProfile={selectedProfile}
      />

      <ConfettiEffect
        etaResult={reyesETA?.combined || null}
        profileId={selectedProfile?.id || null}
      />
    </div>
  );
}
