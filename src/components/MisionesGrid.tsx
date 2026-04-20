import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { misiones } from '../data/missions';
import { useExplorerStore } from '../store/explorerStore';
import { useDebugMode } from '../utils/useDebugMode';
import MisionCard from './MisionCard';

// Pool ordenado — orden fijo para toda la app
const POOL = [...misiones].sort((a, b) => a.semana - b.semana || a.id.localeCompare(b.id));
const TODAS_LAS_IDS = POOL.map((m) => m.id);

export default function MisionesGrid() {
  const {
    points,
    misionesCompletadas,
    misionesActivasIds,
    semanaInicio,
    completarMision,
    iniciarApp,
    avanzarSemanaDebug,
    resetMisiones,
  } = useExplorerStore();
  const debug = useDebugMode();

  // Al montar y cada vez que semanaInicio se resetea a null (ej: tras resetMisiones)
  useEffect(() => {
    iniciarApp(TODAS_LAS_IDS);
  }, [semanaInicio]);

  // Resolver objetos completos de las misiones activas (orden preservado)
  const misionesActivas = useMemo(
    () => misionesActivasIds.map((id) => POOL.find((m) => m.id === id)).filter(Boolean) as typeof misiones,
    [misionesActivasIds]
  );

  // Estados derivados
  const completadasEstaSemana = misionesActivas.filter((m) => misionesCompletadas.includes(m.id));
  const pendientesEstaSemana  = misionesActivas.filter((m) => !misionesCompletadas.includes(m.id));
  const semanaCompleta        = misionesActivas.length > 0 && pendientesEstaSemana.length === 0;
  const todasCompletadas      = TODAS_LAS_IDS.every((id) => misionesCompletadas.includes(id));

  // Misión destacada = primera pendiente de la semana
  const misionDestacada = pendientesEstaSemana[0] ?? null;

  // Contadores para la barra de progreso
  const totalMisiones   = misiones.length;
  const completadasCount = misionesCompletadas.length;
  // Semana visual = bloque de 4 que estamos viendo actualmente
  const semanaVisual = Math.floor(
    TODAS_LAS_IDS.findIndex((id) => misionesActivasIds[0] === id) / 4
  ) + 1;

  // ── Debug helpers ──────────────────────────────────────────────────────
  const handleMasUna = () => {
    const primera = pendientesEstaSemana[0];
    if (primera) completarMision(primera.id, primera.puntos);
  };

  const handleCompletarSemana = () => {
    pendientesEstaSemana.forEach((m) => completarMision(m.id, m.puntos));
  };

  const handleSiguienteSemana = () => {
    avanzarSemanaDebug(TODAS_LAS_IDS);
  };

  const debugDesactivado = semanaCompleta || todasCompletadas;

  // ── Estado de imagen para la misión destacada ──────────────────────────
  const inputDestacadaRef = useRef<HTMLInputElement>(null);
  const [imagenDestacada, setImagenDestacada] = useState<string | null>(null);

  const handleFileDestacada = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagenDestacada(URL.createObjectURL(file));
  };

  const handleCompletarDestacada = () => {
    if (!misionDestacada) return;
    completarMision(misionDestacada.id, misionDestacada.puntos);
    setImagenDestacada(null);
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* ── Barra debug ── */}
      {debug && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <button onClick={handleMasUna} disabled={debugDesactivado} style={debugBtn()}>
            +1 misión completada
          </button>
          <button onClick={handleCompletarSemana} disabled={debugDesactivado} style={debugBtn()}>
            Completar semana
          </button>
          <button onClick={handleSiguienteSemana} style={debugBtn(false, true)}>
            ⏭ Siguiente semana
          </button>
          <button onClick={resetMisiones} style={debugBtn(true)}>
            🔄 Reset misiones
          </button>
        </div>
      )}

      {/* ── Layout principal ── */}
      <div className="misiones-layout">

        {/* ── Columna izquierda ── */}
        <div className="misiones-left">

          {/* Badges */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            flexWrap: 'wrap', marginBottom: '1.25rem',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: '#fef3c7', color: '#92400e',
              fontWeight: 800, fontSize: '0.95rem',
              padding: '0.4rem 1rem', borderRadius: '999px',
            }}>
              ⭐ {points} puntos
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              background: '#d1fae5', color: '#065f46',
              fontWeight: 800, fontSize: '0.9rem',
              padding: '0.4rem 1rem', borderRadius: '999px',
            }}>
              ✅ {completadasEstaSemana.length}/{misionesActivas.length} misiones
            </div>
          </div>

          {/* Card destacada — tres estados */}
          {todasCompletadas ? (
            <HeroCard
              label="🏆 EXPLORADOR COMPLETO"
              titulo="¡Completaste todas las misiones!"
              descripcion={`Eres un verdadero explorador. Ahora desbloquea todos los animales con tus ${points} puntos.`}
            />
          ) : semanaCompleta ? (
            <HeroCard
              label="🎉 ¡SEMANA COMPLETADA!"
              titulo="¡Lo lograste esta semana!"
              descripcion="Vuelve la siguiente semana para descubrir 4 nuevas misiones y seguir ganando puntos."
            />
          ) : misionDestacada ? (
            <motion.div
              key={misionDestacada.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: 'linear-gradient(135deg, #22a55b 0%, #0ea5e9 100%)',
                borderRadius: '24px', padding: '2rem 1.75rem', color: '#fff',
              }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.85, marginBottom: '0.6rem' }}>
                MISIÓN EXPLORADOR DESTACADA
              </div>
              <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.65rem)', fontWeight: 900, lineHeight: 1.25, marginBottom: '0.75rem' }}>
                {misionDestacada.emoji} {misionDestacada.titulo}
              </div>
              <div style={{ fontSize: '0.92rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {misionDestacada.descripcion}
              </div>

              {/* Preview de imagen si ya se subió */}
              <AnimatePresence>
                {imagenDestacada && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{ overflow: 'hidden', marginBottom: '1rem' }}
                  >
                    <img
                      src={imagenDestacada}
                      alt="Preview"
                      style={{
                        width: '100%',
                        height: '140px',
                        objectFit: 'cover',
                        borderRadius: '14px',
                        border: '3px solid rgba(255,255,255,0.4)',
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Botones */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {!imagenDestacada ? (
                  /* Estado 1: Subir imagen es el protagonista */
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => inputDestacadaRef.current?.click()}
                      style={{
                        background: 'rgba(255,255,255,0.95)',
                        color: '#16a34a',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '0.65rem 1.5rem',
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 900,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                      }}
                    >
                      📷 Subir imagen
                    </motion.button>
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
                ) : (
                  /* Estado 2: Completar misión es el protagonista — fila en desktop, columna en móvil */
                  <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <motion.button
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleCompletarDestacada}
                      style={{
                        background: 'rgba(255,255,255,0.95)',
                        color: '#16a34a',
                        border: 'none',
                        borderRadius: '999px',
                        padding: '0.65rem 1.5rem',
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 900,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                      }}
                    >
                      ✅ Completar misión +{misionDestacada.puntos} pts
                    </motion.button>
                    <button
                      onClick={() => inputDestacadaRef.current?.click()}
                      style={{
                        background: 'transparent',
                        color: 'rgba(255,255,255,0.75)',
                        border: '2px dashed rgba(255,255,255,0.4)',
                        borderRadius: '999px',
                        padding: '0.45rem 1.25rem',
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      📷 Cambiar imagen
                    </button>
                  </div>
                )}
              </div>

              {/* Input oculto */}
              <input
                ref={inputDestacadaRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileDestacada}
              />
            </motion.div>
          ) : null}

          <div className="progreso-mobile" style={{ marginTop: '1.25rem' }}>
            <ProgresoBar completadas={completadasCount} total={totalMisiones} semana={semanaVisual} />
          </div>
        </div>

        {/* ── Columna derecha ── */}
        <div className="misiones-right">
          <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#111827', marginBottom: '1rem' }}>
            Actividades para desbloquear personajes
          </div>

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

          <div className="progreso-desktop" style={{ marginTop: '1.5rem' }}>
            <ProgresoBar completadas={completadasCount} total={totalMisiones} semana={semanaVisual} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Sub-componentes ────────────────────────────────────────────────────────

function HeroCard({ label, titulo, descripcion }: { label: string; titulo: string; descripcion: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        background: 'linear-gradient(135deg, #22a55b 0%, #0ea5e9 100%)',
        borderRadius: '24px', padding: '2rem 1.75rem', color: '#fff',
      }}
    >
      <div style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.85, marginBottom: '0.75rem' }}>
        {label}
      </div>
      <div style={{ fontSize: 'clamp(1.3rem, 4vw, 1.8rem)', fontWeight: 900, lineHeight: 1.25, marginBottom: '0.75rem' }}>
        {titulo}
      </div>
      <div style={{ fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.6 }}>
        {descripcion}
      </div>
    </motion.div>
  );
}

function debugBtn(isReset = false, isAccent = false): React.CSSProperties {
  return {
    background: '#f3f4f6',
    border: `2px dashed ${isReset ? '#fca5a5' : isAccent ? '#93c5fd' : '#d1d5db'}`,
    color: isReset ? '#ef4444' : isAccent ? '#1d4ed8' : '#6b7280',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    fontSize: '0.8rem',
    padding: '0.35rem 0.85rem',
    borderRadius: '8px',
    cursor: 'pointer',
  };
}

function ProgresoBar({ completadas, total, semana }: { completadas: number; total: number; semana: number }) {
  const pct = Math.round((completadas / total) * 100);
  return (
    <div style={{ background: '#fff', border: '2px solid #e5e7eb', borderRadius: '16px', padding: '0.85rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#374151' }}>Progreso total</span>
        <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#6b7280' }}>Semana {semana} · {completadas}/{total} misiones</span>
      </div>
      <div style={{ background: '#f3f4f6', borderRadius: '999px', height: '10px', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          style={{ height: '100%', background: 'linear-gradient(90deg, #22a55b, #0ea5e9)', borderRadius: '999px' }}
        />
      </div>
    </div>
  );
}