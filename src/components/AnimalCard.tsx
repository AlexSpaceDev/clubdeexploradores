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

  useEffect(() => {
    if (status === 'unlocking') {
      const timer = setTimeout(() => {
        setUnlocked(animal.id);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleClick = () => {
    onClick(); // siempre activa el visor

    if (status === 'locked') {
      if (canUnlock) {
        unlockAnimal(animal.id, animal.costo);
      } else {
        // Shake: no tiene puntos
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

  return (
    <motion.div
      layout
      className={`animal-card-wrapper ${isActive ? 'active-card' : ''}`}
      animate={shake ? 'shaking' : 'idle'}
      variants={shakeVariants}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
    >
      {/* ── LOCKED ── */}
      {status === 'locked' && (
        <motion.div
          className={`animal-card locked ${canUnlock ? 'can-unlock' : ''}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="card-emoji blurred">{animal.emoji}</div>
          <div className="lock-icon">🔒</div>
          <div className="card-cost">
            <span className="cost-label">
              {canUnlock ? '¡Toca para desbloquear!' : `${animal.costo} pts`}
            </span>
            <span
              className="cost-badge"
              style={{
                background: canUnlock ? '#22c55e' : '#e5e7eb',
                color: canUnlock ? '#fff' : '#6b7280',
              }}
            >
              ⭐ {animal.costo} pts
            </span>
          </div>
        </motion.div>
      )}

      {/* ── UNLOCKING ── */}
      {status === 'unlocking' && (
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
      {status === 'unlocked' && (
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
            {!animal.imagen && (
                <span className="placeholder-label">Foto próximamente</span>
            )}
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