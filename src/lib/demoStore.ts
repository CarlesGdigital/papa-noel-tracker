import { create } from 'zustand';
import { TRACKING_START, TRACKING_END } from './waypoints';

interface DemoState {
  isDemoMode: boolean;
  simulatedTime: Date;
  speedMultiplier: number; // 1x, 10x, 100x, 1000x
  isPlaying: boolean;
  
  enableDemoMode: () => void;
  disableDemoMode: () => void;
  setSpeedMultiplier: (speed: number) => void;
  togglePlayPause: () => void;
  jumpToTime: (date: Date) => void;
  jumpToStart: () => void;
  jumpToSpain: () => void;
  jumpToValencia: () => void;
  jumpToEnd: () => void;
  tick: () => void;
  getCurrentTime: () => Date;
}

export const useDemoStore = create<DemoState>((set, get) => ({
  isDemoMode: false,
  simulatedTime: new Date(TRACKING_START),
  speedMultiplier: 100, // 100x by default in demo
  isPlaying: false,
  
  enableDemoMode: () => set({ 
    isDemoMode: true, 
    simulatedTime: new Date(TRACKING_START),
    isPlaying: true,
  }),
  
  disableDemoMode: () => set({ 
    isDemoMode: false, 
    isPlaying: false,
  }),
  
  setSpeedMultiplier: (speed) => set({ speedMultiplier: speed }),
  
  togglePlayPause: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  jumpToTime: (date) => set({ simulatedTime: date }),
  
  jumpToStart: () => set({ 
    simulatedTime: new Date(TRACKING_START),
    isPlaying: true,
  }),
  
  jumpToSpain: () => set({ 
    // Spain entry is around 21:05
    simulatedTime: new Date('2025-12-24T21:00:00+01:00'),
    isPlaying: true,
  }),
  
  jumpToValencia: () => set({ 
    // Valencia is around 23:25
    simulatedTime: new Date('2025-12-24T23:20:00+01:00'),
    isPlaying: true,
  }),
  
  jumpToEnd: () => set({ 
    simulatedTime: new Date('2025-12-25T07:50:00+01:00'),
    isPlaying: true,
  }),
  
  tick: () => {
    const { isDemoMode, isPlaying, simulatedTime, speedMultiplier } = get();
    if (!isDemoMode || !isPlaying) return;
    
    const newTime = new Date(simulatedTime.getTime() + 1000 * speedMultiplier);
    
    // Stop at end
    if (newTime >= TRACKING_END) {
      set({ simulatedTime: TRACKING_END, isPlaying: false });
      return;
    }
    
    set({ simulatedTime: newTime });
  },
  
  getCurrentTime: () => {
    const { isDemoMode, simulatedTime } = get();
    return isDemoMode ? simulatedTime : new Date();
  },
}));
