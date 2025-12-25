import { useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { ETAResult } from '@/lib/reyesTracking';

interface ConfettiEffectProps {
  etaResult: ETAResult | null;
  profileId: string | null;
}

export function ConfettiEffect({ etaResult, profileId }: ConfettiEffectProps) {
  const triggerConfetti = useCallback(() => {
    // Reyes Magos colors - gold, purple, blue, red
    const colors = ['#FFD700', '#8B5CF6', '#3498DB', '#E74C3C', '#ffffff'];
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors,
    });

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
    if (etaResult?.isNear && profileId) {
      triggerConfetti();
    }
  }, [etaResult?.isNear, profileId, triggerConfetti]);

  return null;
}
