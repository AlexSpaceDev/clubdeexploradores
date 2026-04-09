import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { misiones } from '../data/missions';
import { useExplorerStore } from '../store/explorerStore';
import MisionCard from './MisionCard';

const MISIONES_POR_SEMANA = 4;

export default function MisionesGrid() {
  const { points, misionesCompletadas, completarMision } = useExplorerStore();

  // ── Lógica de semana actual ────────────────────────────────
  // Calculamos qué misiones mostrar:
  // - Tomamos las misiones en orden de semana (1→4).
  // - Siempre mostramos un "slot" de hasta 4 misiones no completadas.
  // - Una vez que el usuario completa las 4 disponibles, se avanza al
  //   siguiente bloque de 4 (pudiendo mezclar semanas si quedaron pendientes).

  const misionesOrdenadas = useMemo(
    () => [...misiones].sort((a, b) => a.semana - b.semana || a.id.localeCompare(b.id)),
    []
  );

  const pendientes = useMemo(
    () => misionesOrdenadas.filter((m) => !misionesCompletadas.includes(m.id)),
    [misionesCompletadas]
  );

  // Las 4 misiones activas son las primeras 4 pendientes
  const misionesActivas = pendientes.slice(0, MISIONES_POR_SEMANA);

  // Misión destacada: la primera activa
  const misionDestacada = misionesActivas[0] ?? null;

  // Contadores
  const totalMisiones = misiones.length;
  const completadasCount = misionesCompletadas.length;

  // Número de semana visual (cuántos bloques de 4 han sido completados + 1)
  const semanaVisual = Math.floor(completadasCount / MISIONES_POR_SEMANA) + 1;
  const completadasEstaSemana = misionesActivas.filter((m) =>
    misionesCompletadas.includes(m.id)
  ).length;

  const todasCompletadas = pendientes.length === 0;

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* ── Layout principal ── */}
      <div className="misiones-layout">

        {/* ── Columna izquierda ── */}
        <div className="misiones-left">

          {/* Header con badges */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            flexWrap: 'wrap',
            marginBottom: '1.25rem',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#fef3c7',
              color: '#92400e',
              fontWeight: 800,
              fontSize: '0.95rem',
              padding: '0.4rem 1rem',
              borderRadius: '999px',
            }}>
              ⭐ {points} puntos
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              background: '#d1fae5',
              color: '#065f46',
              fontWeight: 800,
              fontSize: '0.9rem',
              padding: '0.4rem 1rem',
              borderRadius: '999px',
            }}>
              ✅ {completadasEstaSemana}/{misionesActivas.length} misiones
            </div>
          </div>

          {/* Misión destacada */}
          {todasCompletadas ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                background: 'linear-gradient(135deg, #22a55b 0%, #0ea5e9 100%)',
                borderRadius: '24px',
                padding: '2rem 1.75rem',
                color: '#fff',
              }}
            >
              <div style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                opacity: 0.85,
                marginBottom: '0.75rem',
              }}>
                🏆 EXPLORADOR COMPLETO
              </div>
              <div style={{
                fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
                fontWeight: 900,
                lineHeight: 1.25,
                marginBottom: '0.75rem',
              }}>
                ¡Completaste todas las misiones!
              </div>
              <div style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.6 }}>
                Eres un verdadero explorador. Ahora desbloquea todos los animales con tus {points} puntos.
              </div>
            </motion.div>
          ) : misionDestacada ? (
            <motion.div
              key={misionDestacada.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'linear-gradient(135deg, #22a55b 0%, #0ea5e9 100%)',
                borderRadius: '24px',
                padding: '2rem 1.75rem',
                color: '#fff',
              }}
            >
              <div style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                opacity: 0.85,
                marginBottom: '0.6rem',
              }}>
                MISIÓN EXPLORADOR DESTACADA
              </div>
              <div style={{
                fontSize: 'clamp(1.2rem, 4vw, 1.65rem)',
                fontWeight: 900,
                lineHeight: 1.25,
                marginBottom: '0.75rem',
              }}>
                {misionDestacada.emoji} {misionDestacada.titulo}
              </div>
              <div style={{
                fontSize: '0.92rem',
                opacity: 0.9,
                lineHeight: 1.6,
                marginBottom: '1.25rem',
              }}>
                {misionDestacada.descripcion}
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.95)',
                  color: '#111827',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  padding: '0.55rem 1.25rem',
                  borderRadius: '999px',
                  cursor: 'default',
                }}>
                  Ver misión ↓
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  padding: '0.55rem 1.25rem',
                  borderRadius: '999px',
                  border: '2px solid rgba(255,255,255,0.4)',
                }}>
                  +{misionDestacada.puntos} puntos
                </div>
              </div>
            </motion.div>
          ) : null}

          {/* Progreso global — mobile only */}
          <div className="progreso-mobile">
            <ProgresoBar completadas={completadasCount} total={totalMisiones} semana={semanaVisual} />
          </div>
        </div>

        {/* ── Columna derecha ── */}
        <div className="misiones-right">

          <div style={{
            fontWeight: 900,
            fontSize: '1.05rem',
            color: '#111827',
            marginBottom: '1rem',
          }}>
            Actividades para desbloquear personajes
          </div>

          {/* Lista de misiones activas */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {misionesActivas.map((m) => (
              <MisionCard
                key={m.id}
                mision={m}
                completada={misionesCompletadas.includes(m.id)}
                onCompletar={() => completarMision(m.id, m.puntos)}
              />
            ))}
          </div>

          {/* Progreso global — desktop */}
          <div className="progreso-desktop" style={{ marginTop: '1.5rem' }}>
            <ProgresoBar completadas={completadasCount} total={totalMisiones} semana={semanaVisual} />
          </div>

        </div>
      </div>
    </div>
  );
}

// ── Sub-componente: barra de progreso global ─────────────────
function ProgresoBar({
  completadas,
  total,
  semana,
}: {
  completadas: number;
  total: number;
  semana: number;
}) {
  const pct = Math.round((completadas / total) * 100);

  return (
    <div style={{
      background: '#fff',
      border: '2px solid #e5e7eb',
      borderRadius: '16px',
      padding: '0.85rem 1rem',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '0.5rem',
      }}>
        <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#374151' }}>
          Progreso total
        </span>
        <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#6b7280' }}>
          Semana {semana} · {completadas}/{total} misiones
        </span>
      </div>
      <div style={{
        background: '#f3f4f6',
        borderRadius: '999px',
        height: '10px',
        overflow: 'hidden',
      }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{
            height: '100%',
            background: 'linear-gradient(90deg, #22a55b, #0ea5e9)',
            borderRadius: '999px',
          }}
        />
      </div>
    </div>
  );
}