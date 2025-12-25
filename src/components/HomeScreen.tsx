import { Button } from '@/components/ui/button';
import { SnowEffect } from './SnowEffect';

interface HomeScreenProps {
  onStart: () => void;
}

export function HomeScreen({ onStart }: HomeScreenProps) {
  return (
    <div className="relative min-h-screen gradient-night flex flex-col items-center justify-center p-6 overflow-hidden safe-area-inset">
      <SnowEffect count={30} />
      
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-reyes-gold rounded-full animate-sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
              animationDelay: `${Math.random() * 3}s`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
          />
        ))}
        {/* Big guiding star */}
        <div 
          className="absolute text-6xl animate-pulse-glow"
          style={{ left: '70%', top: '10%' }}
        >
          ⭐
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 animate-fade-in">
        {/* Logo/Title */}
        <div className="text-center">
          <div className="flex justify-center gap-2 text-5xl mb-4">
            <span className="animate-float" style={{ animationDelay: '0s' }}>👑</span>
            <span className="animate-float" style={{ animationDelay: '0.3s' }}>🎁</span>
            <span className="animate-float" style={{ animationDelay: '0.6s' }}>⭐</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-fredoka text-snow mb-2 drop-shadow-lg">
            Seguimiento de los
          </h1>
          <h2 className="text-5xl md:text-6xl font-fredoka text-reyes-gold drop-shadow-glow">
            Reyes Magos
          </h2>
        </div>

        {/* Decorative elements - camels and gifts */}
        <div className="flex gap-4 text-3xl">
          <span className="animate-bounce-soft" style={{ animationDelay: '0s' }}>🐪</span>
          <span className="animate-bounce-soft" style={{ animationDelay: '0.2s' }}>🎁</span>
          <span className="animate-bounce-soft" style={{ animationDelay: '0.4s' }}>✨</span>
          <span className="animate-bounce-soft" style={{ animationDelay: '0.6s' }}>🐪</span>
          <span className="animate-bounce-soft" style={{ animationDelay: '0.8s' }}>👑</span>
        </div>

        {/* Kings names */}
        <div className="flex gap-6 text-lg font-fredoka">
          <span className="text-reyes-gold">Melchor</span>
          <span className="text-reyes-red">Gaspar</span>
          <span className="text-reyes-blue">Baltasar</span>
        </div>

        {/* Start button */}
        <Button
          onClick={onStart}
          size="lg"
          className="gradient-reyes text-snow text-xl font-fredoka px-10 py-7 rounded-2xl shadow-glow-gold animate-pulse-glow hover:scale-105 transition-transform"
        >
          ¡Empezar! 🌟
        </Button>

        {/* Info text */}
        <p className="text-sm text-muted-foreground text-center max-w-xs">
          Sigue a Melchor, Gaspar y Baltasar
          <br />
          en su viaje mágico hasta tu casa
        </p>
      </div>

      {/* Bottom decoration - desert */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-reyes-sand/30 to-transparent pointer-events-none" />
    </div>
  );
}
