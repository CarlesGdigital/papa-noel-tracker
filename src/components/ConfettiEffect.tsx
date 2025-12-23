import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ETAResult } from '@/lib/santaTracking';

interface ConfettiEffectProps {
  etaResult: ETAResult | null;
  profileId: string | null;
}

export function ConfettiEffect({ etaResult, profileId }: ConfettiEffectProps) {
  const triggerConfetti = useCallback(() => {
    // Christmas colors confetti
    const colors = ['#c9302c', '#2e7d32', '#ffd700', '#ffffff'];
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    });

    // Second burst
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
    }, 250);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
    }, 400);
  }, []);

  useEffect(() => {
    // Trigger confetti when Santa arrives at the selected house
    if (etaResult?.isNear && profileId) {
      triggerConfetti();
    }
  }, [etaResult?.isNear, profileId, triggerConfetti]);

  return null;
}
