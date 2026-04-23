import { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { etapas, misiones } from '../data/missions';
import {
  calcularEtapaActual,
  etapaPendienteDeCelebrar,
  misionesActivasParaEtapa,
  useExplorerStore,
} from '../store/explorerStore';
import { useDebugMode } from '../utils/useDebugMode';
import MisionCard from './MisionCard';
import { playSound } from '../lib/sounds';

const TOTAL_ETAPAS = etapas.length;

export default function MisionesGrid() {
  const {
    points,
    misionesCompletadas,
    etapasConfirmadas,
    completarMision,
    confirmarEtapa,
    resetMisiones,
  } = useExplorerStore();
  const debug = useDebugMode();

  // ── Derivados ──
  const etapaActual = useMemo(
    () => calcularEtapaActual(misionesCompletadas),
    [misionesCompletadas]
  );
  const etapaInfo = etapas.find((e) => e.numero === etapaActual)!;
  const misionesActivas = useMemo(
    () => misionesActivasParaEtapa(etapaActual, misionesCompletadas),
    [etapaActual, misionesCompletadas]
  );

  const misionesDeEtapaActual = misiones.filter((m) => m.etapa === etapaActual);
  const completadasEnEtapa = misionesDeEtapaActual.filter((m) =>
    misionesCompletadas.includes(m.id)
  ).length;
  const etapaCompleta = misionesActivas.length === 0;
  const todasCompletadas = misionesCompletadas.length === misiones.length;

  const misionDestacada = misionesActivas[0] ?? null;

  const completadasTotales = misionesCompletadas.length;
  const totalMisiones = misiones.length;

  // ── Celebración de etapa (pendiente de confirmar) ──
  const etapaCelebracion = useMemo(
    () => etapaPendienteDeCelebrar(misionesCompletadas, etapasConfirmadas),
    [misionesCompletadas, etapasConfirmadas]
  );
  const celebracionInfo = etapaCelebracion !== null
    ? etapas.find((e) => e.numero === etapaCelebracion) ?? null
    : null;
  const hayCelebracion = celebracionInfo !== null;

  // ── Toast ──
  const [toast, setToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mostrarToast = (mensaje: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToast(mensaje);
    toastTimerRef.current = setTimeout(() => setToast(null), 2800);
  };

  // ── Completar misión (con toast + sonido) ──
  const completarConToast = (id: string, puntos: number, mensaje: string) => {
    // ¿Esta misión es la última pendiente de su etapa?
    const esUltimaDeEtapa = misionesActivas.length === 1 && misionesActivas[0]?.id === id;

    completarMision(id, puntos);

    if (esUltimaDeEtapa) {
      // La celebración grande se encarga del feedback; no doblamos con toast
      // ni tocamos el sonido de misión completada.
      playSound('etapa-completada');
    } else {
      mostrarToast(mensaje);
      playSound('mision-completada');
    }
  };

  // ── Debug helpers ──
  const handleMasUna = () => {
    const primera = misionesActivas[0];
    if (primera) completarConToast(primera.id, primera.puntos, primera.mensajeCompletado);
  };
  const handleCompletarEtapa = () => {
    misionesActivas.forEach((m) => completarMision(m.id, m.puntos));
    mostrarToast(etapaInfo.mensajeFinal);
  };

  // ── Imagen de la misión destacada ──
  const inputDestacadaRef = useRef<HTMLInputElement>(null);
  const [imagenDestacada, setImagenDestacada] = useState<string | null>(null);
  const handleFileDestacada = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagenDestacada(URL.createObjectURL(file));
  };
  const handleCompletarDestacada = () => {
    if (!misionDestacada) return;
    completarConToast(misionDestacada.id, misionDestacada.puntos, misionDestacada.mensajeCompletado);
    setImagenDestacada(null);
  };

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* ── Barra debug ── */}
      {debug && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
          <button onClick={handleMasUna} disabled={etapaCompleta} style={debugBtn()}>
            +1 misión completada
          </button>
          <button onClick={handleCompletarEtapa} disabled={etapaCompleta} style={debugBtn()}>
            Completar etapa
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
              ✅ {completadasEnEtapa}/{misionesDeEtapaActual.length} de la etapa
            </div>
          </div>

          {/* Card destacada — prioridad: celebración > final > destacada */}
          {hayCelebracion && celebracionInfo ? (
            <HeroCard
              label={`🎉 ETAPA ${celebracionInfo.numero} COMPLETADA`}
              titulo={celebracionInfo.celebracionVisor}
              descripcion={
                celebracionInfo.numero < TOTAL_ETAPAS
                  ? `Prepárate para la siguiente aventura: ${etapas[celebracionInfo.numero].nombre}.`
                  : '¡Has llegado al final del viaje, explorador!'
              }
            />
          ) : todasCompletadas ? (
            <HeroCard
              label="🏆 EXPLORADOR COMPLETO"
              titulo="¡Completaste todas las misiones!"
              descripcion={`Eres un verdadero guardián de los animales. Aún tienes ${points} puntos para desbloquear exploradores.`}
            />
          ) : etapaCompleta ? (
            <HeroCard
              label={`🎉 ETAPA ${etapaActual} COMPLETADA`}
              titulo={etapaInfo.mensajeFinal}
              descripcion={
                etapaActual < TOTAL_ETAPAS
                  ? `Prepárate para la siguiente aventura: ${etapas[etapaActual].nombre}.`
                  : '¡Has llegado al final del viaje!'
              }
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
                MISIÓN DESTACADA · ETAPA {etapaActual}
              </div>
              <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.65rem)', fontWeight: 900, lineHeight: 1.25, marginBottom: '0.6rem' }}>
                {misionDestacada.emoji} {misionDestacada.titulo}
              </div>
              <div style={{ fontSize: '0.92rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '1rem' }}>
                {misionDestacada.descripcion}
              </div>

              {/* Pasos */}
              {misionDestacada.pasos.length > 0 && (
                <ul style={{
                  margin: '0 0 1.25rem 0',
                  paddingLeft: '1.2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.3rem',
                  fontSize: '0.86rem',
                  opacity: 0.95,
                  lineHeight: 1.5,
                  fontWeight: 600,
                }}>
                  {misionDestacada.pasos.map((paso, i) => (
                    <li key={i}>{paso}</li>
                  ))}
                </ul>
              )}

              {/* Preview */}
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
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={() => {
                        playSound('press-button');
                        inputDestacadaRef.current?.click();
                      }}
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
                      onClick={() => {
                        playSound('press-button');
                        inputDestacadaRef.current?.click();
                      }}
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
            <ProgresoBar completadas={completadasTotales} total={totalMisiones} etapa={etapaActual} nombreEtapa={etapaInfo.nombre} />
          </div>
        </div>

        {/* ── Columna derecha ── */}
        <div className="misiones-right">
          <AnimatePresence mode="wait">
            {hayCelebracion && celebracionInfo ? (
              <CelebracionMisiones
                key={`celebracion-${celebracionInfo.numero}`}
                etapa={celebracionInfo.numero}
                mensaje={celebracionInfo.celebracionMisiones}
                esUltima={celebracionInfo.numero >= TOTAL_ETAPAS}
                onContinuar={() => {
                  playSound('press-button');
                  confirmarEtapa(celebracionInfo.numero);
                }}
              />
            ) : (
              <motion.div
                key={`misiones-${etapaActual}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ fontWeight: 900, fontSize: '1.05rem', color: '#111827', marginBottom: '0.25rem' }}>
                  Etapa {etapaActual}: {etapaInfo.nombre}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6b7280', fontWeight: 600, marginBottom: '1rem' }}>
                  {etapaInfo.objetivo}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  {misionesDeEtapaActual.map((m) => (
                    <MisionCard
                      key={m.id}
                      mision={m}
                      completada={misionesCompletadas.includes(m.id)}
                      onCompletar={() => completarConToast(m.id, m.puntos, m.mensajeCompletado)}
                    />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="progreso-desktop" style={{ marginTop: '1.5rem' }}>
            <ProgresoBar completadas={completadasTotales} total={totalMisiones} etapa={etapaActual} nombreEtapa={etapaInfo.nombre} />
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'linear-gradient(135deg, #22a55b 0%, #0ea5e9 100%)',
              color: '#fff',
              padding: '0.9rem 1.6rem',
              borderRadius: '999px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
              fontWeight: 800,
              fontSize: '0.95rem',
              zIndex: 100,
              maxWidth: '90vw',
              textAlign: 'center',
            }}
            role="status"
            aria-live="polite"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
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

function debugBtn(isReset = false): React.CSSProperties {
  return {
    background: '#f3f4f6',
    border: `2px dashed ${isReset ? '#fca5a5' : '#d1d5db'}`,
    color: isReset ? '#ef4444' : '#6b7280',
    fontFamily: "'Nunito', sans-serif",
    fontWeight: 700,
    fontSize: '0.8rem',
    padding: '0.35rem 0.85rem',
    borderRadius: '8px',
    cursor: 'pointer',
  };
}

function CelebracionMisiones({
  etapa,
  mensaje,
  esUltima,
  onContinuar,
}: {
  etapa: number;
  mensaje: string;
  esUltima: boolean;
  onContinuar: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96, y: -8 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        background: '#fff',
        border: '3px solid #fde68a',
        borderRadius: '24px',
        padding: '2.25rem 1.5rem',
        textAlign: 'center',
        boxShadow: '0 10px 30px rgba(245, 158, 11, 0.15)',
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 14 }}
        style={{ fontSize: '4rem', lineHeight: 1, marginBottom: '0.5rem' }}
      >
        🎉
      </motion.div>

      <div
        style={{
          fontSize: '0.72rem',
          fontWeight: 900,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#b45309',
          marginBottom: '0.75rem',
        }}
      >
        Etapa {etapa} completada
      </div>

      <div
        style={{
          fontSize: 'clamp(1.15rem, 3.6vw, 1.45rem)',
          fontWeight: 900,
          lineHeight: 1.3,
          color: '#111827',
          marginBottom: '1.5rem',
          padding: '0 0.5rem',
        }}
      >
        {mensaje}
      </div>

      <motion.button
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.03 }}
        onClick={onContinuar}
        style={{
          background: 'linear-gradient(135deg, #22a55b 0%, #0ea5e9 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: '999px',
          padding: '0.85rem 2.25rem',
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 900,
          fontSize: '1rem',
          cursor: 'pointer',
          boxShadow: '0 8px 20px rgba(34, 165, 91, 0.3)',
        }}
      >
        {esUltima ? '🏁 Ver final' : 'Continuar →'}
      </motion.button>
    </motion.div>
  );
}

function ProgresoBar({ completadas, total, etapa, nombreEtapa }: { completadas: number; total: number; etapa: number; nombreEtapa: string }) {
  const pct = Math.round((completadas / total) * 100);
  return (
    <div style={{ background: '#fff', border: '2px solid #e5e7eb', borderRadius: '16px', padding: '0.85rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <span style={{ fontWeight: 800, fontSize: '0.82rem', color: '#374151' }}>Progreso total</span>
        <span style={{ fontWeight: 700, fontSize: '0.78rem', color: '#6b7280' }}>Etapa {etapa} · {nombreEtapa} · {completadas}/{total}</span>
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
