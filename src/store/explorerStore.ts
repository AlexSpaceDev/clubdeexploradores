import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { misiones } from '../data/missions';

export type AnimalStatus = 'locked' | 'unlocking' | 'unlocked';

export interface AnimalState {
  id: string;
  status: AnimalStatus;
  unlockedAt?: number;
}

// ── Helpers de etapas ──────────────────────────────────────────────────────
// El modelo es secuencial: la etapa actual es la primera que aún tiene
// misiones pendientes. No hay tiempo real involucrado.

const TOTAL_ETAPAS = misiones.length > 0 ? Math.max(...misiones.map((m) => m.etapa)) : 1;

function misionesDeEtapa(etapa: number) {
  return misiones.filter((m) => m.etapa === etapa);
}

export function calcularEtapaActual(completadas: string[]): number {
  for (let e = 1; e <= TOTAL_ETAPAS; e++) {
    const ids = misionesDeEtapa(e).map((m) => m.id);
    if (!ids.every((id) => completadas.includes(id))) return e;
  }
  return TOTAL_ETAPAS;
}

export function misionesActivasParaEtapa(etapa: number, completadas: string[]) {
  return misionesDeEtapa(etapa).filter((m) => !completadas.includes(m.id));
}

// ── Store ──────────────────────────────────────────────────────────────────

interface ExplorerStore {
  points: number;
  animals: AnimalState[];
  misionesCompletadas: string[];
  // Timestamp (epoch ms) por misión completada. Paralelo a misionesCompletadas
  // para preservar la API de .includes() sin romper consumidores.
  misionesCompletadasEn: Record<string, number>;

  addPoints: (amount: number) => void;
  initAnimals: (ids: string[]) => void;
  unlockAnimal: (id: string, cost: number) => void;
  setUnlocked: (id: string) => void;

  completarMision: (id: string, puntos: number) => void;
  resetMisiones: () => void;
  resetAll: () => void;
}

export const useExplorerStore = create<ExplorerStore>()(
  persist(
    (set, get) => ({
      points: 0,
      animals: [],
      misionesCompletadas: [],
      misionesCompletadasEn: {},

      addPoints: (amount) => set((s) => ({ points: s.points + amount })),

      initAnimals: (ids) => {
        const current = get().animals;
        const nuevos = ids
          .filter((id) => !current.find((a) => a.id === id))
          .map((id) => ({ id, status: 'locked' as AnimalStatus }));
        if (nuevos.length > 0) {
          set((s) => ({ animals: [...s.animals, ...nuevos] }));
        }
      },

      unlockAnimal: (id, cost) => {
        const { points, animals } = get();
        const animal = animals.find((a) => a.id === id);
        if (!animal || animal.status !== 'locked' || points < cost) return;
        set((s) => ({
          points: s.points - cost,
          animals: s.animals.map((a) =>
            a.id === id ? { ...a, status: 'unlocking' } : a
          ),
        }));
      },

      setUnlocked: (id) =>
        set((s) => ({
          animals: s.animals.map((a) =>
            a.id === id
              ? { ...a, status: 'unlocked', unlockedAt: a.unlockedAt ?? Date.now() }
              : a
          ),
        })),

      completarMision: (id, puntos) => {
        const { misionesCompletadas } = get();
        if (misionesCompletadas.includes(id)) return;
        set((s) => ({
          misionesCompletadas: [...s.misionesCompletadas, id],
          misionesCompletadasEn: { ...s.misionesCompletadasEn, [id]: Date.now() },
          points: s.points + puntos,
        }));
      },

      resetMisiones: () =>
        set(() => ({
          misionesCompletadas: [],
          misionesCompletadasEn: {},
          points: 0,
        })),

      resetAll: () =>
        set(() => ({
          points: 0,
          animals: [],
          misionesCompletadas: [],
          misionesCompletadasEn: {},
        })),
    }),
    {
      name: 'explorer-store',
      // v2: refactor a sistema secuencial de etapas (sin tiempo real)
      // v3: timestamps para analítica futura (unlockedAt, misionesCompletadasEn)
      version: 3,
      migrate: (persisted, version) => {
        const s = (persisted ?? {}) as Partial<ExplorerStore>;
        if (version < 3) {
          return {
            ...s,
            misionesCompletadasEn: s.misionesCompletadasEn ?? {},
          } as ExplorerStore;
        }
        return s as ExplorerStore;
      },
    }
  )
);
