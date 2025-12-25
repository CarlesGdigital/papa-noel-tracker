import { createStore, useStore } from 'zustand';
import { getTrackingStart, getTrackingEnd, getEventDate, setEventDate } from './reyesWaypoints';

interface DemoState {
  isDemoMode: boolean;
  simulatedTime: Date;
  speedMultiplier: number;
  isPlaying: boolean;
  eventDate: string;
}

interface DemoActions {
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  setSpeedMultiplier: (speed: number) => void;
  togglePlayPause: () => void;
  jumpToTime: (date: Date) => void;
  jumpToStart: () => void;
  jumpToEurope: () => void;
  jumpToSpain: () => void;
  jumpToEnd: () => void;
  tick: () => void;
  getCurrentTime: () => Date;
  changeEventDate: (date: string) => void;
}

type DemoStore = DemoState & DemoActions;

const demoStore = createStore<DemoStore>((set, get) => ({
  isDemoMode: false,
  simulatedTime: new Date(),
  speedMultiplier: 600,  // Default speed más rápido
  isPlaying: false,
  eventDate: getEventDate(),
  
  enableDemoMode: () => {
    // Al activar el modo demo, usamos la fecha configurada y empezamos LIGERAMENTE después de las 08:00
    // para evitar problemas de comparación exacta
    const currentEventDate = getEventDate();
    setEventDate(currentEventDate);
    const startTime = new Date(`${currentEventDate}T08:00:01+01:00`); // 1 segundo después del inicio
    set({ 
      isDemoMode: true, 
      simulatedTime: startTime,
      isPlaying: true,
      eventDate: currentEventDate,
    });
  },
  
  disableDemoMode: () => set({ 
    isDemoMode: false, 
    isPlaying: false,
  }),
  
  setSpeedMultiplier: (speed) => set({ speedMultiplier: speed }),
  
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  jumpToTime: (date) => set({ simulatedTime: date }),
  
  jumpToStart: () => {
    const { eventDate } = get();
    set({ 
      simulatedTime: new Date(`${eventDate}T08:00:00+01:00`),
      isPlaying: true,
    });
  },
  
  jumpToEurope: () => {
    const { eventDate } = get();
    set({ 
      simulatedTime: new Date(`${eventDate}T14:00:00+01:00`),
      isPlaying: true,
    });
  },
  
  jumpToSpain: () => {
    const { eventDate } = get();
    set({ 
      simulatedTime: new Date(`${eventDate}T15:30:00+01:00`),
      isPlaying: true,
    });
  },
  
  jumpToEnd: () => {
    const { eventDate } = get();
    set({ 
      simulatedTime: new Date(`${eventDate}T17:55:00+01:00`),
      isPlaying: true,
    });
  },
  
  tick: () => {
    const { isDemoMode, isPlaying, simulatedTime, speedMultiplier } = get();
    if (!isDemoMode || !isPlaying) return;
    
    const newTime = new Date(simulatedTime.getTime() + 1000 * speedMultiplier);
    
    if (newTime >= getTrackingEnd()) {
      set({ simulatedTime: getTrackingEnd(), isPlaying: false });
      return;
    }
    
    set({ simulatedTime: newTime });
  },
  
  getCurrentTime: () => {
    const { isDemoMode, simulatedTime } = get();
    return isDemoMode ? simulatedTime : new Date();
  },
  
  changeEventDate: (date: string) => {
    setEventDate(date);
    set({ 
      eventDate: date,
      simulatedTime: new Date(`${date}T08:00:00+01:00`),
    });
  },
}));

// Hook to use the store in React components
export function useDemoStore(): DemoStore;
export function useDemoStore<T>(selector: (state: DemoStore) => T): T;
export function useDemoStore<T>(selector?: (state: DemoStore) => T) {
  return useStore(demoStore, selector as (state: DemoStore) => T);
}

// Export the store for non-React usage
export { demoStore };
