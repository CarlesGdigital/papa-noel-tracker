import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

interface ProfileChecklist {
  profileId: string;
  items: ChecklistItem[];
}

interface ChecklistState {
  checklists: Record<string, ChecklistItem[]>;
  getChecklist: (profileId: string) => ChecklistItem[];
  toggleItem: (profileId: string, itemId: string) => void;
  resetChecklist: (profileId: string) => void;
}

const DEFAULT_ITEMS: Omit<ChecklistItem, 'checked'>[] = [
  { id: 'zapatos', label: 'Dejar los zapatos bien limpios' },
  { id: 'agua', label: 'Dejar agua para los camellos' },
  { id: 'dulce', label: 'Dejar algo dulce (turrón/galleta)' },
  { id: 'nota', label: 'Escribir una nota a los Reyes' },
];

export const useChecklistStore = create<ChecklistState>()(
  persist(
    (set, get) => ({
      checklists: {},
      
      getChecklist: (profileId: string) => {
        const { checklists } = get();
        if (!checklists[profileId]) {
          return DEFAULT_ITEMS.map(item => ({ ...item, checked: false }));
        }
        return checklists[profileId];
      },
      
      toggleItem: (profileId: string, itemId: string) => {
        set((state) => {
          const currentChecklist = state.checklists[profileId] || 
            DEFAULT_ITEMS.map(item => ({ ...item, checked: false }));
          
          const updatedChecklist = currentChecklist.map(item =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          );
          
          return {
            checklists: {
              ...state.checklists,
              [profileId]: updatedChecklist,
            },
          };
        });
      },
      
      resetChecklist: (profileId: string) => {
        set((state) => ({
          checklists: {
            ...state.checklists,
            [profileId]: DEFAULT_ITEMS.map(item => ({ ...item, checked: false })),
          },
        }));
      },
    }),
    {
      name: 'reyes-checklist-storage',
    }
  )
);
