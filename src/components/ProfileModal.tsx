import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { getDeviceId } from '@/lib/deviceId';
import { PROFILE_AVATARS } from '@/lib/reyesWaypoints';
import { MapPin, Search, Navigation, Loader2 } from 'lucide-react';

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

interface GeocodeResult {
  display_name: string;
  lat: number;
  lon: number;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileCreated: (profile: Profile) => void;
  editingProfile?: Profile | null;
}

export function ProfileModal({ isOpen, onClose, onProfileCreated, editingProfile }: ProfileModalProps) {
  const [step, setStep] = useState<'name' | 'location'>('name');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(PROFILE_AVATARS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<GeocodeResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (editingProfile) {
      setName(editingProfile.name);
      setAvatar(editingProfile.avatar);
      setSelectedLocation({
        display_name: editingProfile.city_label,
        lat: editingProfile.lat,
        lon: editingProfile.lon,
      });
      setStep('name');
    } else {
      setName('');
      setAvatar(PROFILE_AVATARS[Math.floor(Math.random() * PROFILE_AVATARS.length)]);
      setSelectedLocation(null);
      setSearchQuery('');
      setSearchResults([]);
      setStep('name');
    }
  }, [editingProfile, isOpen]);

  const searchCities = useCallback(async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const { data, error } = await supabase.functions.invoke('geocode', {
        body: { query: searchQuery },
      });
      
      if (error) throw error;
      setSearchResults(data || []);
    } catch (err) {
      console.error('Search error:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const useCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }

    setIsLocating(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
        });
      });

      const { latitude, longitude } = position.coords;
      
      const { data, error } = await supabase.functions.invoke('geocode', {
        body: { query: `${latitude},${longitude}` },
      });
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setSelectedLocation(data[0]);
      } else {
        setSelectedLocation({
          display_name: 'Mi ubicación',
          lat: latitude,
          lon: longitude,
        });
      }
    } catch (err) {
      console.error('Location error:', err);
      alert('No se pudo obtener tu ubicación');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !selectedLocation) return;
    
    setIsSaving(true);
    try {
      const deviceId = getDeviceId();
      
      if (editingProfile) {
        const { data, error } = await supabase
          .from('profiles')
          .update({
            name: name.trim(),
            avatar,
            city_label: selectedLocation.display_name,
            lat: selectedLocation.lat,
            lon: selectedLocation.lon,
          })
          .eq('id', editingProfile.id)
          .select()
          .single();
          
        if (error) throw error;
        onProfileCreated(data as Profile);
      } else {
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            device_id: deviceId,
            name: name.trim(),
            avatar,
            city_label: selectedLocation.display_name,
            lat: selectedLocation.lat,
            lon: selectedLocation.lon,
          })
          .select()
          .single();
          
        if (error) throw error;
        onProfileCreated(data as Profile);
      }
      
      onClose();
    } catch (err) {
      console.error('Save error:', err);
      alert('Error al guardar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass border-border/50 max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-2xl font-fredoka text-center text-snow">
            {editingProfile ? 'Editar casa' : '¡Bienvenido! 👑'}
          </DialogTitle>
        </DialogHeader>

        {step === 'name' ? (
          <div className="flex flex-col gap-6 py-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                ¿Quién eres?
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="text-lg bg-muted/50 border-border/50"
                autoFocus
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                Elige tu avatar
              </label>
              <div className="flex flex-wrap gap-2">
                {PROFILE_AVATARS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAvatar(a)}
                    className={`text-3xl p-2 rounded-xl transition-all ${
                      avatar === a
                        ? 'bg-reyes-gold/30 scale-110 ring-2 ring-reyes-gold'
                        : 'bg-muted/30 hover:bg-muted/50'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setStep('location')}
              disabled={!name.trim()}
              className="gradient-reyes text-snow font-fredoka text-lg py-6"
            >
              Siguiente →
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 py-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">
                ¿Dónde vives?
              </label>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && searchCities()}
                    placeholder="Buscar ciudad..."
                    className="bg-muted/50 border-border/50 pr-10"
                  />
                  <button
                    onClick={searchCities}
                    disabled={isSearching}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {isSearching ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={useCurrentLocation}
                  disabled={isLocating}
                  className="shrink-0"
                >
                  {isLocating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Navigation className="w-5 h-5" />
                  )}
                </Button>
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="bg-muted/30 rounded-xl max-h-40 overflow-y-auto">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedLocation(result);
                      setSearchResults([]);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-muted/50 flex items-start gap-2 border-b border-border/30 last:border-0"
                  >
                    <MapPin className="w-4 h-4 mt-1 shrink-0 text-reyes-gold" />
                    <span className="text-sm line-clamp-2">{result.display_name}</span>
                  </button>
                ))}
              </div>
            )}

            {selectedLocation && (
              <div className="bg-reyes-purple/20 rounded-xl p-4 flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-0.5 text-reyes-purple" />
                <div>
                  <p className="text-sm font-medium text-snow">Tu casa</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {selectedLocation.display_name}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-2">
              <Button
                variant="outline"
                onClick={() => setStep('name')}
                className="flex-1"
              >
                ← Atrás
              </Button>
              <Button
                onClick={handleSave}
                disabled={!selectedLocation || isSaving}
                className="flex-1 gradient-reyes text-snow font-fredoka"
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  '¡Guardar! 🏠'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
