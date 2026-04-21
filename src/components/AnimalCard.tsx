import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Animal } from '../data/animals';
import type { AnimalStatus } from '../store/explorerStore';
import { useExplorerStore } from '../store/explorerStore';

interface Props {
  animal: Animal;
  status: AnimalStatus;
  points: number;
  isActive: boolean;
  onClick: () => void;
}

export default function AnimalCard({ animal, status, points, isActive, onClick }: Props) {
  const { unlockAnimal, setUnlocked } = useExplorerStore();
  const [shake, setShake] = useState(false);

  const canUnlock = points >= animal.costo;
  const esEspecial = !!animal.especial;
  const esProximamente = !!animal.proximamente;

  useEffect(() => {
    if (status === 'unlocking') {
      const timer = setTimeout(() => {
        setUnlocked(animal.id);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [status, animal.id, setUnlocked]);

  const handleClick = () => {
    onClick(); // siempre activa el visor

    if (esProximamente) return; // no intenta desbloquear

    if (status === 'locked') {
      if (canUnlock) {
        unlockAnimal(animal.id, animal.costo);
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 600);
      }
    }
  };

  const shakeVariants = {
    idle: { x: 0 },
    shaking: {
      x: [0, -6, 6, -5, 5, -3, 3, 0],
      transition: { duration: 0.5 },
    },
  };

  // Estilos especiales: marco dorado + glow suave
  const especialStyles = esEspecial
    ? {
        boxShadow: '0 0 0 3px #fbbf24, 0 8px 24px rgba(251,191,36,0.28)',
        borderRadius: '22px',
      }
    : {};

  return (
    <motion.div
      layout
      className={`animal-card-wrapper ${isActive ? 'active-card' : ''}`}
      animate={shake ? 'shaking' : 'idle'}
      variants={shakeVariants}
      onClick={handleClick}
      style={{ cursor: 'pointer', ...especialStyles, position: 'relative' }}
    >
      {/* Badge ESPECIAL (esquina superior derecha) */}
      {esEspecial && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '-8px',
          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
          color: '#78350f',
          fontSize: '0.62rem',
          fontWeight: 900,
          letterSpacing: '0.08em',
          padding: '0.25rem 0.6rem',
          borderRadius: '999px',
          boxShadow: '0 3px 10px rgba(245,158,11,0.4)',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '0.2rem',
        }}>
          ✨ ESPECIAL
        </div>
      )}

      {/* ── PROXIMAMENTE (teaser) ── */}
      {esProximamente && (
        <motion.div
          className="animal-card proximamente"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            background: 'linear-gradient(135deg, #fdf4ff 0%, #fce7f3 100%)',
            border: '2px dashed #f0abfc',
            justifyContent: 'center',
          }}
        >
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card-emoji" style={{
              filter: 'grayscale(1) blur(4px) opacity(0.35)',
            }}>
              {animal.emoji}
            </div>
            <span style={{
              position: 'absolute',
              fontSize: '1.8rem',
              lineHeight: 1,
            }}>
              ✨
            </span>
          </div>

          <div className="card-cost" style={{ marginTop: '0.6rem' }}>
            <span style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              color: '#a21caf',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}>
              Muy pronto
            </span>
            <span style={{
              background: '#fae8ff',
              color: '#86198f',
              fontSize: '0.72rem',
              fontWeight: 700,
              padding: '0.3rem 0.7rem',
              borderRadius: '999px',
              lineHeight: 1.3,
            }}>
              🎁 Nuevo explorador
            </span>
          </div>
        </motion.div>
      )}

      {/* ── LOCKED ── */}
      {!esProximamente && status === 'locked' && (
        <motion.div
          className={`animal-card locked ${canUnlock ? 'can-unlock' : ''}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card-emoji blurred">{animal.emoji}</div>
            <span style={{
              position: 'absolute',
              bottom: '-6px',
              right: '-6px',
              fontSize: '1.6rem',
              lineHeight: 1,
            }}>🔒</span>
          </div>

          <div className="card-cost" style={{ marginTop: '0.6rem' }}>
            {canUnlock && (
              <span className="cost-label">¡Toca para desbloquear!</span>
            )}
            <span
              className="cost-badge"
              style={{
                background: canUnlock ? '#22c55e' : '#e5e7eb',
                color: canUnlock ? '#fff' : '#6b7280',
                fontSize: '1rem',
                padding: '0.5rem 1.1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>⭐</span>
              {animal.costo} pts
            </span>
          </div>
        </motion.div>
      )}

      {/* ── UNLOCKING ── */}
      {!esProximamente && status === 'unlocking' && (
        <motion.div
          className="animal-card unlocking"
          initial={{ scale: 1 }}
          animate={{
            scale: [1, 1.05, 0.98, 1.06, 0.99, 1],
            rotate: [0, -3, 3, -2, 2, 0],
            backgroundColor: ['#e5e7eb', '#fef08a', '#bbf7d0', '#e5e7eb'],
          }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
        >
          <motion.div
            className="card-emoji"
            animate={{ scale: [0.8, 1.3, 1], rotate: [0, 15, -10, 0] }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            {animal.emoji}
          </motion.div>
          <motion.p
            className="unlocking-text"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            ✨ ¡Desbloqueado!
          </motion.p>
        </motion.div>
      )}

      {/* ── UNLOCKED ── */}
      {!esProximamente && status === 'unlocked' && (
        <motion.div
          className="animal-card unlocked"
          style={{ background: animal.color }}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="animal-image-placeholder" style={{ position: 'relative', overflow: 'hidden' }}>
            {animal.imagen && (
              <img
                src={animal.imagen}
                alt={animal.nombre}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  borderRadius: '12px',
                  filter: 'brightness(0.72) saturate(0.85) blur(2px)',
                }}
              />
            )}
            <span className="card-emoji" style={{ position: 'relative', zIndex: 1 }}>
              {animal.emoji}
            </span>
          </div>
          <div className="card-info">
            <div className="card-header">
              <h3 className="animal-name">{animal.nombre}</h3>
              <span className="animal-tag" style={{ background: animal.accentColor }}>
                {animal.descripcionCorta}
              </span>
            </div>
            <p className="animal-desc">{animal.descripcion}</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
