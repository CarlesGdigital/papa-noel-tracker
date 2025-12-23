import { Button } from '@/components/ui/button';
import { SnowEffect } from './SnowEffect';

interface HomeScreenProps {
  onStart: () => void;
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <div className="relative min-h-screen gradient-night flex flex-col items-center justify-center p-6 overflow-hidden safe-area-inset">
      <SnowEffect count={40} />
      
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-snow rounded-full animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 animate-fade-in">
        {/* Logo/Title */}
        <div className="text-center">
          <div className="text-7xl mb-4 animate-float">🎅</div>
          <h1 className="text-5xl font-fredoka text-snow mb-2 drop-shadow-lg">
            Loba Ball
          </h1>
          <p className="text-lg text-christmas-gold font-quicksand">
            Seguimiento de Papá Noel
          </p>
        </div>

        {/* Decorative elements */}
        <div className="flex gap-4 text-3xl">
          <span className="animate-bounce-soft" style={{ animationDelay: '0s' }}>🎄</span>
          <span className="animate-bounce-soft" style={{ animationDelay: '0.2s' }}>🎁</span>
          <span className="animate-bounce-soft" style={{ animationDelay: '0.4s' }}>⭐</span>
          <span className="animate-bounce-soft" style={{ animationDelay: '0.6s' }}>🦌</span>
          <span className="animate-bounce-soft" style={{ animationDelay: '0.8s' }}>❄️</span>
        </div>

        {/* Start button */}
        <Button
          onClick={onStart}
          size="lg"
          className="gradient-christmas text-snow text-xl font-fredoka px-10 py-7 rounded-2xl shadow-glow-red animate-pulse-glow hover:scale-105 transition-transform"
        >
          ¡Empezar! 🚀
        </Button>

        {/* Info text */}
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Sigue a Papá Noel en su viaje por todo el mundo
          <br />
          esta Nochebuena
        </p>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-christmas-green/20 to-transparent pointer-events-none" />
    </div>
  );
}
