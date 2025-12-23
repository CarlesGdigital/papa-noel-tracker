import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Settings, Volume2, VolumeX, Trash2 } from 'lucide-react';
import { clearDeviceId } from '@/lib/deviceId';

interface SettingsSheetProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetProfiles: () => void;
}

export function SettingsSheet({ soundEnabled, onToggleSound, onResetProfiles }: SettingsSheetProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleReset = () => {
    if (confirm('¿Eliminar todos los perfiles y datos? Esta acción no se puede deshacer.')) {
      onResetProfiles();
      clearDeviceId();
      setIsOpen(false);
      window.location.reload();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-snow hover:bg-muted/50">
          <Settings className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="glass border-border/50">
        <SheetHeader>
          <SheetTitle className="text-xl font-fredoka text-snow">Ajustes</SheetTitle>
        </SheetHeader>
        
        <div className="flex flex-col gap-4 mt-6">
          {/* Sound toggle */}
          <button
            onClick={onToggleSound}
            className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-christmas-green" />
              ) : (
                <VolumeX className="w-5 h-5 text-muted-foreground" />
              )}
              <span className="text-snow">Sonidos</span>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors ${soundEnabled ? 'bg-christmas-green' : 'bg-muted'}`}>
              <div className={`w-5 h-5 rounded-full bg-snow mt-0.5 transition-transform ${soundEnabled ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </div>
          </button>

          {/* Reset button */}
          <button
            onClick={handleReset}
            className="flex items-center gap-3 p-4 rounded-xl bg-destructive/20 hover:bg-destructive/30 transition-colors text-destructive"
          >
            <Trash2 className="w-5 h-5" />
            <span>Restablecer perfiles</span>
          </button>

          {/* About */}
          <div className="mt-8 text-center">
            <div className="text-4xl mb-2">🎅</div>
            <p className="font-fredoka text-snow">Loba Ball</p>
            <p className="text-xs text-muted-foreground">Seguimiento de Papá Noel</p>
            <p className="text-xs text-muted-foreground mt-2">Hecho con ❤️ para los más pequeños</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
