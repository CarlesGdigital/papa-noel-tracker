import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit2, Home } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

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

interface ProfileListProps {
  profiles: Profile[];
  selectedProfile: Profile | null;
  onSelectProfile: (profile: Profile) => void;
  onCreateProfile: () => void;
  onEditProfile: (profile: Profile) => void;
  onProfileDeleted: (id: string) => void;
}

export function ProfileList({
  profiles,
  selectedProfile,
  onSelectProfile,
  onCreateProfile,
  onEditProfile,
  onProfileDeleted,
}: ProfileListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (profile: Profile) => {
    if (!confirm(`¿Eliminar la casa de ${profile.name}?`)) return;
    
    setDeletingId(profile.id);
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', profile.id);
        
      if (error) throw error;
      onProfileDeleted(profile.id);
    } catch (err) {
      console.error('Delete error:', err);
      alert('Error al eliminar el perfil');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-fredoka text-snow flex items-center gap-2">
          <Home className="w-5 h-5" />
          Casas
        </h2>
        <Button
          onClick={onCreateProfile}
          size="sm"
          className="gradient-reyes text-snow"
        >
          <Plus className="w-4 h-4 mr-1" />
          Nueva
        </Button>
      </div>

      {profiles.length === 0 ? (
        <div className="glass rounded-2xl p-6 text-center">
          <div className="text-4xl mb-3">🏠</div>
          <p className="text-muted-foreground text-sm">
            Añade una casa para ver cuándo llegan los Reyes
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {profiles.map((profile) => (
            <div
              key={profile.id}
              className={`glass rounded-xl p-4 flex items-center gap-3 cursor-pointer transition-all ${
                selectedProfile?.id === profile.id
                  ? 'ring-2 ring-reyes-gold bg-reyes-gold/10'
                  : 'hover:bg-muted/30'
              }`}
              onClick={() => onSelectProfile(profile)}
            >
              <div className="text-3xl">{profile.avatar}</div>
              
              <div className="flex-1 min-w-0">
                <p className="font-fredoka text-snow truncate">{profile.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {profile.city_label.split(',')[0]}
                </p>
              </div>
              
              <div className="flex gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditProfile(profile);
                  }}
                  className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(profile);
                  }}
                  disabled={deletingId === profile.id}
                  className="p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
