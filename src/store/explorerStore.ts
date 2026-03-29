import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AnimalStatus = 'locked' | 'unlocking' | 'unlocked';

export interface AnimalState {
  id: string;
  status: AnimalStatus;
}

interface ExplorerStore {
  points: number;
  animals: AnimalState[];

  // Acciones
  addPoints: (amount: number) => void;
  initAnimals: (ids: string[]) => void;
  unlockAnimal: (id: string, cost: number) => void;
  setUnlocked: (id: string) => void;
}

export const useExplorerStore = create<ExplorerStore>()(
  persist(
    (set, get) => ({
      points: 0,
      animals: [],

      addPoints: (amount) =>
        set((state) => ({ points: state.points + amount })),

      initAnimals: (ids) => {
        const current = get().animals;
        // Solo inicializa animales que aún no existen en el store
        const newAnimals = ids
          .filter((id) => !current.find((a) => a.id === id))
          .map((id) => ({ id, status: 'locked' as AnimalStatus }));
        if (newAnimals.length > 0) {
          set((state) => ({ animals: [...state.animals, ...newAnimals] }));
        }
      },

      unlockAnimal: (id, cost) => {
        const { points, animals } = get();
        const animal = animals.find((a) => a.id === id);
        if (!animal || animal.status !== 'locked' || points < cost) return;

        set((state) => ({
          points: state.points - cost,
          animals: state.animals.map((a) =>
            a.id === id ? { ...a, status: 'unlocking' } : a
          ),
        }));
      },

      setUnlocked: (id) =>
        set((state) => ({
          animals: state.animals.map((a) =>
            a.id === id ? { ...a, status: 'unlocked' } : a
          ),
        })),
    }),
    {
      name: 'explorer-store', // clave en localStorage
    }
  )
);