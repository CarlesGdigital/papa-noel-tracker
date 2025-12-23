import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Settings, Volume2, VolumeX, Trash2, FlaskConical } from 'lucide-react';
import { clearDeviceId } from '@/lib/deviceId';
import { useDemoStore } from '@/lib/demoStore';
import { toast } from 'sonner';

const DEMO_PASSWORD = '123456789admin';

interface SettingsSheetProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onResetProfiles: () => void;
}

export function SettingsSheet({ soundEnabled, onToggleSound, onResetProfiles }: SettingsSheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const isDemoMode = useDemoStore((s) => s.isDemoMode);
  const enableDemoMode = useDemoStore((s) => s.enableDemoMode);
  const disableDemoMode = useDemoStore((s) => s.disableDemoMode);

  const handleReset = () => {
    if (confirm('¿Eliminar todos los perfiles y datos? Esta acción no se puede deshacer.')) {
      onResetProfiles();
      clearDeviceId();
      setIsOpen(false);
      window.location.reload();
    }
  };

  const handleToggleDemo = () => {
    if (isDemoMode) {
      disableDemoMode();
      setIsOpen(false);
    } else {
      setIsPasswordDialogOpen(true);
    }
  };

  const handlePasswordSubmit = () => {
    if (password === DEMO_PASSWORD) {
      enableDemoMode();
      setIsPasswordDialogOpen(false);
      setIsOpen(false);
      setPassword('');
      toast.success('Modo demo activado');
    } else {
      toast.error('Contraseña incorrecta');
      setPassword('');
    }
  };

  return (
    <>
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
          {/* Demo mode toggle */}
          <button
            onClick={handleToggleDemo}
            className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
              isDemoMode 
                ? 'bg-christmas-gold/20 ring-2 ring-christmas-gold' 
                : 'bg-muted/30 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <FlaskConical className={`w-5 h-5 ${isDemoMode ? 'text-christmas-gold' : 'text-muted-foreground'}`} />
              <div className="text-left">
                <span className="text-snow block">Modo Demo</span>
                <span className="text-xs text-muted-foreground">
                  Simula el viaje de Papá Noel
                </span>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full transition-colors ${isDemoMode ? 'bg-christmas-gold' : 'bg-muted'}`}>
              <div className={`w-5 h-5 rounded-full bg-snow mt-0.5 transition-transform ${isDemoMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
            </div>
          </button>

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

      {/* Password Dialog */}
      <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
        <DialogContent className="glass border-border/50">
          <DialogHeader>
            <DialogTitle className="font-fredoka text-snow flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-christmas-gold" />
              Modo Demo
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Introduce la contraseña para acceder al modo demo:
            </p>
            <Input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
              className="bg-muted/30 border-border/50"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsPasswordDialogOpen(false);
              setPassword('');
            }}>
              Cancelar
            </Button>
            <Button onClick={handlePasswordSubmit} className="gradient-christmas text-snow">
              Acceder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
