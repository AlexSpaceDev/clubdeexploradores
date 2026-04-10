import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type AnimalStatus = 'locked' | 'unlocking' | 'unlocked';

export interface AnimalState {
  id: string;
  status: AnimalStatus;
}

// ── Utilidad de semana ─────────────────────────────────────────────────────
// Devuelve el número de semana transcurrida desde `inicio` (timestamp ms).
// semanaOffset permite simular semanas en debug (se suma al resultado real).
export function calcularSemana(inicio: number, offsetDebug = 0): number {
  const MS_POR_SEMANA = 7 * 24 * 60 * 60 * 1000;
  const semanaReal = Math.floor((Date.now() - inicio) / MS_POR_SEMANA);
  return semanaReal + offsetDebug;
}
 

interface ExplorerStore {
  points: number;
  animals: AnimalState[];

  // ── Misiones ──
  misionesCompletadas: string[];   // ids de misiones completadas
  misionesActivasIds: string[];   // ids fijas de la semana actual (no cambian hasta completarlas todas)
  semanaInicio: number | null;    // timestamp del primer acceso (ms)
  semanaOffset: number;           // solo para debug: semanas simuladas adicionales

  // Acciones - animales
  addPoints: (amount: number) => void;
  initAnimals: (ids: string[]) => void;
  unlockAnimal: (id: string, cost: number) => void;
  setUnlocked: (id: string) => void;

  // Acciones — misiones
  iniciarApp: (todasLasIds: string[]) => void;  // llama al montar, gestiona semanas
  completarMision: (id: string, puntos: number) => void;
  avanzarSemanaDebug: (todasLasIds: string[]) => void; // solo debug
  resetMisiones: () => void;   // ← solo misiones + puntos, animales intactos
  resetAll: () => void;  
}

// ── Calcula qué 4 misiones corresponden a la semana N ─────────────────────
// Las misiones pendientes se reparten en bloques de 4 en orden.
// Si en semanas anteriores quedaron sin hacer, se acumulan al final.
function calcularActivasParaSemana(
  todasLasIds: string[],        // ids ordenadas del pool total
  completadas: string[],        // historial de completadas
  semanaActual: number          // 0-based
): string[] {
  // Separar completadas y pendientes respetando el orden original
  const pendientes = todasLasIds.filter((id) => !completadas.includes(id));
  const BLOQUE = 4;
 
  // Reconstruimos la historia de bloques semana a semana:
  // - En la semana 0 se asignan las primeras 4 del pool completo (sin filtrar)
  // - Cada semana siguiente: tomamos las primeras 4 del pool completo,
  //   avanzando de bloque según el número de semana.
  // Pero las misiones NO completadas de semanas pasadas se acumulan al frente
  // de los pendientes, NO se saltan. Por tanto:
  //
  // Lo que se muestra en semana N = las 4 pendientes que "tocarían" en esa semana.
  // Implementación: calculamos cuántas misiones debieron haberse completado
  // hasta el inicio de la semana actual (semanaActual * 4), tomamos las que
  // faltan de ese rango + rellenamos hasta 4 con las siguientes pendientes.
 
  const totalEsperadasHastaSemana = semanaActual * BLOQUE; // misiones que "debieron" hacerse
 
  // Pool ordenado completo
  const poolCompleto = [...todasLasIds];
 
  // Misiones que "debieron" haberse visto hasta esta semana
  const vistasHastaSemana = poolCompleto.slice(0, totalEsperadasHastaSemana);
 
  // De esas, ¿cuáles siguen pendientes? (el usuario no las completó)
  const pendientesAtrasadas = vistasHastaSemana.filter((id) => !completadas.includes(id));
 
  // Misiones nuevas de esta semana (el siguiente bloque del pool)
  const nuevasDeLaSemana = poolCompleto
    .slice(totalEsperadasHastaSemana, totalEsperadasHastaSemana + BLOQUE)
    .filter((id) => !completadas.includes(id));
 
  // Combinamos: primero las atrasadas, luego las nuevas, hasta 4
  const candidatas = [...pendientesAtrasadas, ...nuevasDeLaSemana];
  return candidatas.slice(0, BLOQUE);
}

export const useExplorerStore = create<ExplorerStore>()(
  persist(
    (set, get) => ({
      points: 0,
      animals: [],
      misionesCompletadas: [],
      misionesActivasIds: [],
      semanaInicio: null,
      semanaOffset: 0,

      addPoints: (amount) =>
        set((state) => ({ points: state.points + amount })),

      initAnimals: (ids) => {
        const current = get().animals;
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

      // ── iniciarApp ────────────────────────────────────────────────────────
      // Llamar al montar MisionesGrid. Gestiona:
      // 1. Registrar semanaInicio si es el primer acceso
      // 2. Detectar si cambió la semana desde la última visita → refrescar activas
      iniciarApp: (todasLasIds) => {
        const { semanaInicio, semanaOffset, misionesCompletadas } = get();
 
        // Primer acceso: guardar timestamp de inicio
        const inicio = semanaInicio ?? Date.now();
        if (!semanaInicio) set(() => ({ semanaInicio: inicio }));
 
        const semanaActual = calcularSemana(inicio, semanaOffset);
        const activas = calcularActivasParaSemana(todasLasIds, misionesCompletadas, semanaActual);
 
        set(() => ({ misionesActivasIds: activas }));
      },
        
      completarMision: (id, puntos) => {
        const { misionesCompletadas } = get();
        // Evitar completar dos veces
        if (misionesCompletadas.includes(id)) return;
        set((state) => ({
          misionesCompletadas: [...state.misionesCompletadas, id],
          points: state.points + puntos,
        }));
         // NO recalculamos misionesActivasIds aquí → el bloque permanece fijo
      },

            // ── avanzarSemanaDebug ────────────────────────────────────────────────
      // Suma 1 al offset y recalcula las activas como si hubiera pasado una semana
      avanzarSemanaDebug: (todasLasIds) => {
        const { semanaInicio, semanaOffset, misionesCompletadas } = get();
        const inicio = semanaInicio ?? Date.now();
        const nuevoOffset = semanaOffset + 1;
        const semanaActual = calcularSemana(inicio, nuevoOffset);
        const activas = calcularActivasParaSemana(todasLasIds, misionesCompletadas, semanaActual);
        set(() => ({ semanaOffset: nuevoOffset, misionesActivasIds: activas }));
      },

      resetMisiones: () =>
        set(() => ({
          misionesCompletadas: [],
          misionesActivasIds: [],
          semanaInicio: null,
          semanaOffset: 0,
          points: 0,
          // animales se quedan tal cual
        })),

      resetAll: () =>          
        set(() => ({
          points: 0,
          animals: [],
          misionesCompletadas: [],
          misionesActivasIds: [],
          semanaInicio: null,
          semanaOffset: 0,
        })),
    }),
    {
      name: 'explorer-store',
    }
  )
);