import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import type { Animal } from '../data/animals';
import type { AnimalStatus } from '../store/explorerStore';
import ImageLightbox from './ImageLightbox';

interface Props {
  animal: Animal;
  status: AnimalStatus;
  points: number;
}

const CAROUSEL_INTERVAL = 3500;
const CELEBRATION_MS = 1600;

export default function AnimalVisor({ animal, status, points }: Props) {
  const canUnlock = points >= animal.costo;
  const esEspecial = !!animal.especial;
  const esProximamente = !!animal.proximamente;

  const imagenes = animal.imagenes ?? [];
  const tieneImagenes = status === 'unlocked' && imagenes.length > 0;

  const [imgIndex, setImgIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);

  // Reset al cambiar de animal
  useEffect(() => {
    setImgIndex(0);
  }, [animal.id]);

  // Detecta el momento exacto en que este animal pasa a unlocked para disparar
  // la animación de celebración (sin dispararla al cambiar de animal).
  const prevStatusRef = useRef(status);
  const prevAnimalIdRef = useRef(animal.id);
  useEffect(() => {
    const mismoAnimal = prevAnimalIdRef.current === animal.id;
    const flip = prevStatusRef.current !== 'unlocked' && status === 'unlocked';
    prevStatusRef.current = status;
    prevAnimalIdRef.current = animal.id;
    if (mismoAnimal && flip) {
      setJustUnlocked(true);
      const t = setTimeout(() => setJustUnlocked(false), CELEBRATION_MS);
      return () => clearTimeout(t);
    }
  }, [status, animal.id]);

  // Auto-rotación del carrusel (solo si hay >1 imagen y el lightbox no está abierto)
  useEffect(() => {
    if (!tieneImagenes || imagenes.length <= 1 || lightboxOpen) return;
    const timer = setInterval(() => {
      setImgIndex((i) => (i + 1) % imagenes.length);
    }, CAROUSEL_INTERVAL);
    return () => clearInterval(timer);
  }, [tieneImagenes, imagenes.length, lightboxOpen]);

  return (
    <>
      <motion.div
        key={animal.id}
        initial={{ opacity: 0, x: -16 }}
        animate={{
          opacity: 1,
          x: 0,
          boxShadow: justUnlocked
            ? [
                esEspecial
                  ? '0 2px 20px rgba(0,0,0,0.09), 0 0 0 3px #fbbf24'
                  : '0 2px 20px rgba(0,0,0,0.09)',
                '0 0 40px rgba(34,197,94,0.55), 0 0 0 4px #86efac',
                esEspecial
                  ? '0 2px 20px rgba(0,0,0,0.09), 0 0 0 3px #fbbf24'
                  : '0 2px 20px rgba(0,0,0,0.09)',
              ]
            : esEspecial
              ? '0 2px 20px rgba(0,0,0,0.09), 0 0 0 3px #fbbf24'
              : '0 2px 20px rgba(0,0,0,0.09)',
        }}
        transition={
          justUnlocked
            ? { boxShadow: { duration: 1.4, ease: 'easeInOut' }, default: { duration: 0.35, ease: 'easeOut' } }
            : { duration: 0.35, ease: 'easeOut' }
        }
        style={{
          background: '#fff',
          borderRadius: '24px',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          fontFamily: "'Nunito', sans-serif",
          position: 'sticky',
          top: '1.5rem',
        }}
      >
        {/* Label */}
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 800,
          letterSpacing: '0.08em',
          color: esEspecial ? '#b45309' : '#22a55b',
          textTransform: 'uppercase',
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
        }}>
          {esEspecial ? '✨ ANIMAL ESPECIAL' : '🔭 VISOR EXPLORADOR'}
        </div>

        {/* Imagen / carrusel */}
        <div
          onClick={() => { if (tieneImagenes) setLightboxOpen(true); }}
          style={{
            borderRadius: '16px',
            height: '200px',
            background: esProximamente
              ? 'linear-gradient(135deg, #fdf4ff 0%, #fce7f3 100%)'
              : status === 'unlocked' ? animal.color : '#e5e7eb',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            gap: '0.5rem',
            overflow: 'hidden',
            border: esProximamente ? '2px dashed #f0abfc' : 'none',
            cursor: tieneImagenes ? 'zoom-in' : 'default',
          }}
        >
          {/* Overlay locked/sin-imágenes — sale con fade+scale cuando el animal
              se desbloquea, revelando el carrusel que entra debajo */}
          <AnimatePresence>
            {!tieneImagenes && (
              <motion.div
                key="locked-overlay"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.85 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                }}
              >
                <span style={{
                  fontSize: '5rem',
                  lineHeight: 1,
                  filter: esProximamente
                    ? 'grayscale(1) blur(5px) opacity(0.35)'
                    : status !== 'unlocked'
                      ? 'grayscale(1) blur(3px) opacity(0.3)'
                      : 'none',
                  transition: 'filter 0.4s',
                }}>
                  {animal.emoji}
                </span>

                {esProximamente && (
                  <span style={{ fontSize: '3rem', position: 'absolute' }}>✨</span>
                )}

                {!esProximamente && status !== 'unlocked' && (
                  <span style={{ fontSize: '2.5rem', position: 'absolute' }}>🔒</span>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Carrusel: fade cross entre imágenes */}
          {tieneImagenes && (
            <AnimatePresence initial={false}>
              <motion.img
                key={imgIndex}
                src={imagenes[imgIndex]}
                alt={`${animal.nombre} ${imgIndex + 1}`}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '16px',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
              />
            </AnimatePresence>
          )}

          {/* Burst de sparkles al desbloquear */}
          <AnimatePresence>
            {justUnlocked && (
              <motion.div
                key="sparkles"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                  zIndex: 2,
                }}
              >
                {[...Array(10)].map((_, i) => {
                  const angle = (i / 10) * Math.PI * 2;
                  const dist = 90 + (i % 2) * 25;
                  return (
                    <motion.span
                      key={i}
                      initial={{ x: 0, y: 0, opacity: 0, scale: 0, rotate: 0 }}
                      animate={{
                        x: Math.cos(angle) * dist,
                        y: Math.sin(angle) * dist,
                        opacity: [0, 1, 1, 0],
                        scale: [0, 1.2, 1, 0.6],
                        rotate: 220,
                      }}
                      transition={{
                        duration: 1.3,
                        ease: 'easeOut',
                        delay: i * 0.03,
                        times: [0, 0.15, 0.75, 1],
                      }}
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        fontSize: '1.4rem',
                        lineHeight: 1,
                        marginTop: '-0.7rem',
                        marginLeft: '-0.7rem',
                      }}
                    >
                      {i % 3 === 0 ? '⭐' : i % 3 === 1 ? '✨' : '💫'}
                    </motion.span>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Indicador de zoom */}
          {tieneImagenes && (
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.25, ease: 'backOut' }}
              style={{
                position: 'absolute',
                top: '0.6rem',
                right: '0.6rem',
                background: 'rgba(0,0,0,0.55)',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '0.3rem 0.6rem',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                backdropFilter: 'blur(6px)',
                zIndex: 1,
              }}
            >
              🔍 Ver
            </motion.div>
          )}

          {/* Dots del carrusel */}
          {tieneImagenes && imagenes.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.35, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                bottom: '0.6rem',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '0.3rem',
                background: 'rgba(0,0,0,0.35)',
                padding: '0.3rem 0.55rem',
                borderRadius: '999px',
                backdropFilter: 'blur(6px)',
                zIndex: 1,
              }}
            >
              {imagenes.map((_, i) => (
                <span
                  key={i}
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    background: i === imgIndex ? '#fff' : 'rgba(255,255,255,0.45)',
                    transition: 'background 0.3s ease, transform 0.3s ease',
                    transform: i === imgIndex ? 'scale(1.2)' : 'scale(1)',
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>

        {/* Tag */}
        <div style={{
          fontSize: '0.78rem',
          fontWeight: 700,
          color: status === 'unlocked' ? animal.accentColor : '#6b7280',
          background: '#f3f4f6',
          padding: '0.25rem 0.75rem',
          borderRadius: '999px',
          width: 'fit-content',
        }}>
          {animal.descripcionCorta}
        </div>

        {/* Nombre */}
        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 900,
          color: '#111827',
          letterSpacing: '-0.02em',
          lineHeight: 1.2,
          margin: 0,
        }}>
          {animal.nombre}
        </h2>

        {/* Descripción */}
        <p style={{
          fontSize: '0.85rem',
          color: '#4b5563',
          lineHeight: 1.6,
          fontWeight: 600,
          margin: 0,
        }}>
          {animal.descripcion}
        </p>

        {/* Proximamente: teaser */}
        {esProximamente && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              background: '#fae8ff',
              color: '#86198f',
              fontSize: '0.8rem',
              fontWeight: 800,
              padding: '0.3rem 0.75rem',
              borderRadius: '8px',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              🎁 Muy pronto
            </span>
            <span style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#86198f',
            }}>
              Sigue completando misiones
            </span>
          </div>
        )}

        {/* Locked: costo */}
        {!esProximamente && status !== 'unlocked' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{
              background: '#f3f4f6',
              color: '#374151',
              fontSize: '0.8rem',
              fontWeight: 800,
              padding: '0.3rem 0.75rem',
              borderRadius: '8px',
            }}>
              Desbloqueo: {animal.costo} pts
            </span>
            {canUnlock && (
              <span style={{
                background: '#dcfce7',
                color: '#15803d',
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '0.3rem 0.75rem',
                borderRadius: '8px',
              }}>
                ¡Tienes los puntos!
              </span>
            )}
          </div>
        )}

        {/* Unlocked: stats */}
        {status === 'unlocked' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', gap: '0.5rem' }}
          >
            {[
              { icon: '⚖️', value: animal.stats.peso, label: 'peso' },
              { icon: '📏', value: animal.stats.longitud, label: 'longitud' },
              { icon: '🌿', value: animal.stats.habitat, label: 'hábitat' },
            ].map((s) => (
              <div key={s.label} style={{
                flex: 1,
                background: '#f9fafb',
                borderRadius: '12px',
                padding: '0.6rem 0.4rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.15rem',
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: 600,
                textAlign: 'center',
              }}>
                <span>{s.icon}</span>
                <strong style={{ fontSize: '0.85rem', fontWeight: 900, color: '#111827' }}>
                  {s.value}
                </strong>
                <span>{s.label}</span>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxOpen && tieneImagenes && (
          <ImageLightbox
            images={imagenes}
            alt={animal.nombre}
            initialIndex={imgIndex}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
