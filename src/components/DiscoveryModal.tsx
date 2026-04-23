import { useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Animal } from '../data/animals';
import { playSound } from '../lib/sounds';

interface Props {
  animal: Animal | null;
  onClose: () => void;
}

const HISTORY_TAG = 'clubexp-discovery';

// Paleta alineada con la marca + acentos cálidos para el confeti.
const CONFETTI_COLORS = ['#22a55b', '#0ea5e9', '#fbbf24', '#f97316', '#ec4899', '#a855f7'];

interface Particle {
  id: number;
  left: number;   // % horizontal de inicio
  color: string;
  size: number;   // px
  rotate: number; // deg inicial
  driftX: number; // px desplazamiento horizontal final
  fallY: number;  // px desplazamiento vertical final (positivo = hacia abajo)
  spin: number;   // deg total de giro
  delay: number;  // s
  duration: number; // s
  shape: 'square' | 'circle';
}

function generarConfetti(count: number): Particle[] {
  const rand = (min: number, max: number) => Math.random() * (max - min) + min;
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: rand(0, 100),
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    size: rand(6, 12),
    rotate: rand(0, 360),
    driftX: rand(-80, 80),
    fallY: rand(220, 420),
    spin: rand(180, 720) * (Math.random() < 0.5 ? -1 : 1),
    delay: rand(0, 0.25),
    duration: rand(1.4, 2.2),
    shape: Math.random() < 0.5 ? 'square' : 'circle',
  }));
}

export default function DiscoveryModal({ animal, onClose }: Props) {
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  // Regenera partículas cada vez que se abre con un animal distinto.
  const confetti = useMemo(() => (animal ? generarConfetti(36) : []), [animal?.id]);

  // Captura botón atrás en Android + tecla Escape + bloqueo de scroll mientras
  // el modal está abierto. Mismo patrón que ImageLightbox.
  useEffect(() => {
    if (!animal) return;

    history.pushState({ [HISTORY_TAG]: true }, '');

    const handlePop = () => onCloseRef.current();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
    };

    window.addEventListener('popstate', handlePop);
    window.addEventListener('keydown', handleKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('popstate', handlePop);
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
      if ((history.state as Record<string, unknown> | null)?.[HISTORY_TAG]) {
        history.back();
      }
    };
  }, [animal]);

  return (
    <AnimatePresence>
      {animal && (
        <motion.div
          key="discovery-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => onCloseRef.current()}
          role="dialog"
          aria-modal="true"
          aria-label={`Descubriste ${animal.nombre}`}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            zIndex: 200,
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          <motion.div
            key="discovery-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff',
              borderRadius: '28px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '92vh',
              overflow: 'hidden',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* ── Confeti (cae sobre el header y el cuerpo) ── */}
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                pointerEvents: 'none',
                overflow: 'hidden',
                zIndex: 1,
              }}
            >
              {confetti.map((p) => (
                <motion.div
                  key={p.id}
                  initial={{ x: 0, y: -20, rotate: p.rotate, opacity: 1 }}
                  animate={{
                    x: p.driftX,
                    y: p.fallY,
                    rotate: p.rotate + p.spin,
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    ease: [0.2, 0.6, 0.4, 1],
                    times: [0, 0.75, 1],
                  }}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: `${p.left}%`,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    background: p.color,
                    borderRadius: p.shape === 'circle' ? '50%' : '2px',
                  }}
                />
              ))}
            </div>

            {/* ── Header con gradiente ── */}
            <div
              style={{
                background: 'linear-gradient(135deg, #22a55b 0%, #0ea5e9 100%)',
                color: '#fff',
                padding: '1.5rem 1.5rem 1.25rem',
                textAlign: 'center',
                position: 'relative',
                zIndex: 2,
              }}
            >
              <div
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 900,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  opacity: 0.85,
                  marginBottom: '0.4rem',
                }}
              >
                ✨ Nuevo descubrimiento
              </div>
              <div
                style={{
                  fontSize: 'clamp(1.3rem, 4.5vw, 1.75rem)',
                  fontWeight: 900,
                  lineHeight: 1.2,
                }}
              >
                ¡Descubriste al {animal.nombre}!
              </div>
            </div>

            {/* ── Cuerpo ── */}
            <div className="discovery-body">
              {/* Escenario: polaroid inclinada + chibi superpuesto */}
              <div className="discovery-stage">
                {/* Foto real (polaroid) */}
                {(() => {
                  const idx = animal.polaroidIndex ?? 0;
                  const foto = animal.imagenes?.[idx] ?? animal.imagenes?.[0];
                  if (!foto) return null;
                  return (
                    <motion.div
                      className="discovery-polaroid"
                      initial={{ opacity: 0, x: -30, rotate: -14 }}
                      animate={{ opacity: 1, x: 0, rotate: -6 }}
                      transition={{ delay: 0.15, duration: 0.5, ease: 'easeOut' }}
                    >
                      <img src={foto} alt={animal.nombre} />
                    </motion.div>
                  );
                })()}

                {/* Chibi (o emoji fallback) */}
                <motion.div
                  className="discovery-chibi-wrap"
                  initial={{ scale: 0, rotate: -20, opacity: 0 }}
                  animate={{ scale: 1, rotate: 3, opacity: 1 }}
                  transition={{ delay: 0.3, type: 'spring', stiffness: 170, damping: 13 }}
                >
                  {animal.chibi ? (
                    <img src={animal.chibi} alt={`${animal.nombre} chibi`} />
                  ) : (
                    <span className="discovery-chibi-emoji">{animal.emoji}</span>
                  )}
                </motion.div>
              </div>

              {/* Descripción */}
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.35 }}
                style={{
                  margin: 0,
                  fontSize: '1rem',
                  lineHeight: 1.55,
                  color: '#374151',
                  fontWeight: 600,
                  textAlign: 'center',
                  padding: '0 0.25rem',
                }}
              >
                {animal.descripcion}
              </motion.p>

              {/* Botón Genial */}
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.3 }}
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => {
                  playSound('press-button');
                  onCloseRef.current();
                }}
                type="button"
                style={{
                  alignSelf: 'center',
                  background: 'linear-gradient(135deg, #22a55b 0%, #0ea5e9 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '0.9rem 2.5rem',
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 900,
                  fontSize: '1.05rem',
                  cursor: 'pointer',
                  boxShadow: '0 10px 24px rgba(34, 165, 91, 0.35)',
                  marginTop: '0.25rem',
                }}
              >
                ¡Genial!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
