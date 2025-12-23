import { useState, useEffect } from 'react';
import { HomeScreen } from '@/components/HomeScreen';
import { TrackerScreen } from '@/components/TrackerScreen';

type AppScreen = 'home' | 'tracker';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [hasStarted, setHasStarted] = useState(false);

  // Check if user has already started before
  useEffect(() => {
    const started = localStorage.getItem('loba_ball_started');
    if (started === 'true') {
      setCurrentScreen('tracker');
      setHasStarted(true);
    }
  }, []);

  const handleStart = () => {
    localStorage.setItem('loba_ball_started', 'true');
    setHasStarted(true);
    setCurrentScreen('tracker');
  };

  if (currentScreen === 'home' && !hasStarted) {
    return <HomeScreen onStart={handleStart} />;
  }

  return <TrackerScreen />;
};

export default Index;
