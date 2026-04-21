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

/**
 * Devuelve el número de la etapa más temprana que está totalmente completada
 * pero aún no ha sido confirmada (el usuario no ha tocado "Continuar").
 * null si no hay nada pendiente.
 */
export function etapaPendienteDeCelebrar(
  completadas: string[],
  confirmadas: number[]
): number | null {
  for (let e = 1; e <= TOTAL_ETAPAS; e++) {
    const ids = misionesDeEtapa(e).map((m) => m.id);
    const completa = ids.length > 0 && ids.every((id) => completadas.includes(id));
    if (completa && !confirmadas.includes(e)) return e;
  }
  return null;
}

// ── Store ──────────────────────────────────────────────────────────────────

interface ExplorerStore {
  points: number;
  animals: AnimalState[];
  misionesCompletadas: string[];
  // Timestamp (epoch ms) por misión completada. Paralelo a misionesCompletadas
  // para preservar la API de .includes() sin romper consumidores.
  misionesCompletadasEn: Record<string, number>;
  // Etapas cuya celebración ya fue confirmada por el usuario (botón Continuar).
  etapasConfirmadas: number[];
  // Animal recién desbloqueado pendiente de mostrar en el modal de descubrimiento.
  // Transiente: no se persiste (ver partialize abajo).
  recienDescubierto: string | null;

  addPoints: (amount: number) => void;
  initAnimals: (ids: string[]) => void;
  unlockAnimal: (id: string, cost: number) => void;
  setUnlocked: (id: string) => void;
  cerrarDescubrimiento: () => void;

  completarMision: (id: string, puntos: number) => void;
  confirmarEtapa: (etapa: number) => void;
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
      etapasConfirmadas: [],
      recienDescubierto: null,

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
        set((s) => {
          const prev = s.animals.find((a) => a.id === id);
          const yaEstaba = prev?.status === 'unlocked';
          return {
            animals: s.animals.map((a) =>
              a.id === id
                ? { ...a, status: 'unlocked', unlockedAt: a.unlockedAt ?? Date.now() }
                : a
            ),
            // Solo disparamos el modal si es la primera vez que se desbloquea
            // (evita que un re-render o migración vuelva a abrirlo).
            recienDescubierto: yaEstaba ? s.recienDescubierto : id,
          };
        }),

      cerrarDescubrimiento: () => set({ recienDescubierto: null }),

      completarMision: (id, puntos) => {
        const { misionesCompletadas } = get();
        if (misionesCompletadas.includes(id)) return;
        set((s) => ({
          misionesCompletadas: [...s.misionesCompletadas, id],
          misionesCompletadasEn: { ...s.misionesCompletadasEn, [id]: Date.now() },
          points: s.points + puntos,
        }));
      },

      confirmarEtapa: (etapa) =>
        set((s) =>
          s.etapasConfirmadas.includes(etapa)
            ? s
            : { etapasConfirmadas: [...s.etapasConfirmadas, etapa] }
        ),

      resetMisiones: () =>
        set(() => ({
          misionesCompletadas: [],
          misionesCompletadasEn: {},
          etapasConfirmadas: [],
          points: 0,
        })),

      resetAll: () =>
        set(() => ({
          points: 0,
          animals: [],
          misionesCompletadas: [],
          misionesCompletadasEn: {},
          etapasConfirmadas: [],
          recienDescubierto: null,
        })),
    }),
    {
      name: 'explorer-store',
      // recienDescubierto es transiente — no queremos que un refresh en
      // medio del flujo vuelva a abrir el modal en la siguiente sesión.
      partialize: (state) => {
        const { recienDescubierto: _rd, ...rest } = state;
        return rest;
      },
      // v2: refactor a sistema secuencial de etapas (sin tiempo real)
      // v3: timestamps para analítica futura (unlockedAt, misionesCompletadasEn)
      // v4: etapasConfirmadas — usuario debe dar "Continuar" tras cada etapa
      version: 4,
      migrate: (persisted, version) => {
        let s = (persisted ?? {}) as Partial<ExplorerStore>;
        if (version < 3) {
          s = { ...s, misionesCompletadasEn: s.misionesCompletadasEn ?? {} };
        }
        if (version < 4) {
          // Para usuarios con progreso previo, marcamos todas las etapas ya
          // completadas como confirmadas. Así no reciben celebraciones
          // retroactivas de algo que terminaron en una sesión anterior.
          const completadas = (s.misionesCompletadas ?? []) as string[];
          const confirmadas: number[] = [];
          for (let e = 1; e <= TOTAL_ETAPAS; e++) {
            const ids = misionesDeEtapa(e).map((m) => m.id);
            if (ids.length > 0 && ids.every((id) => completadas.includes(id))) {
              confirmadas.push(e);
            }
          }
          s = { ...s, etapasConfirmadas: s.etapasConfirmadas ?? confirmadas };
        }
        return s as ExplorerStore;
      },
    }
  )
);
