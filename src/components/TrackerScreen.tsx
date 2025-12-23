import { useState, useEffect, useCallback } from 'react';
import { SantaMap } from './SantaMap';
import { StatsBar } from './StatsBar';
import { ProfileList } from './ProfileList';
import { ProfileModal } from './ProfileModal';
import { SettingsSheet } from './SettingsSheet';
import { MessageToast } from './MessageToast';
import { ConfettiEffect } from './ConfettiEffect';
import { Countdown } from './Countdown';
import { SnowEffect } from './SnowEffect';
import { getSantaPosition, calculateETA, SantaPosition, ETAResult } from '@/lib/santaTracking';
import { TRACKING_START, TRACKING_END } from '@/lib/waypoints';
import { getDeviceId } from '@/lib/deviceId';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Users, ChevronUp, ChevronDown } from 'lucide-react';

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

export function TrackerScreen() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isProfilesSheetOpen, setIsProfilesSheetOpen] = useState(false);
  const [isStatsExpanded, setIsStatsExpanded] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [santaPosition, setSantaPosition] = useState<SantaPosition>(getSantaPosition(new Date()));
  const [etaResult, setEtaResult] = useState<ETAResult | null>(null);
  const [trackingStatus, setTrackingStatus] = useState<TrackingStatus>('countdown');

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
      
      // Auto-select first profile or show modal if none
      if (data && data.length > 0) {
        setSelectedProfile(data[0] as Profile);
      } else {
        setIsProfileModalOpen(true);
      }
    };
    
    loadProfiles();
  }, []);

  // Check tracking status
  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      if (now < TRACKING_START) {
        setTrackingStatus('countdown');
      } else if (now >= TRACKING_END) {
        setTrackingStatus('ended');
      } else {
        setTrackingStatus('tracking');
      }
    };
    
    checkStatus();
    const interval = setInterval(checkStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update Santa position every second
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setSantaPosition(getSantaPosition(now));
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Calculate ETA when position or selected profile changes
  useEffect(() => {
    if (selectedProfile && trackingStatus === 'tracking') {
      const eta = calculateETA(selectedProfile.lat, selectedProfile.lon, currentTime);
      setEtaResult(eta);
    } else {
      setEtaResult(null);
    }
  }, [selectedProfile, currentTime, trackingStatus]);

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

  return (
    <div className="relative h-screen flex flex-col overflow-hidden gradient-night">
      <SnowEffect count={15} />
      
      {/* Header */}
      <header className="relative z-20 flex items-center justify-between p-4 safe-area-inset">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎅</span>
          <h1 className="font-fredoka text-lg text-snow">Loba Ball</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Sheet open={isProfilesSheetOpen} onOpenChange={setIsProfilesSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-snow hover:bg-muted/50 relative">
                <Users className="w-5 h-5" />
                {profiles.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-christmas-red text-xs flex items-center justify-center">
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
        {trackingStatus === 'countdown' ? (
          <div className="h-full flex items-center justify-center p-6">
            <Countdown onTrackingStart={handleTrackingStart} />
          </div>
        ) : (
          <SantaMap
            santaPosition={santaPosition}
            currentTime={currentTime}
            selectedProfile={selectedProfile}
            isTracking={isTracking}
          />
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
          <StatsBar
            santaPosition={santaPosition}
            etaResult={etaResult}
            selectedProfile={selectedProfile}
            currentTime={currentTime}
            isTracking={isTracking}
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

      <MessageToast
        isTracking={isTracking}
        santaProgress={santaPosition.progress}
        etaResult={etaResult}
        selectedProfile={selectedProfile}
      />

      <ConfettiEffect
        etaResult={etaResult}
        profileId={selectedProfile?.id || null}
      />
    </div>
  );
}
