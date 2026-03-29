import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import type { Animal } from '../data/animals';
import type { AnimalStatus } from '../store/explorerStore';
import { useExplorerStore } from '../store/explorerStore';

interface Props {
  animal: Animal;
  status: AnimalStatus;
  points: number;
}

export default function AnimalCard({ animal, status, points }: Props) {
  const { unlockAnimal, setUnlocked } = useExplorerStore();

  const canUnlock = points >= animal.costo;

  // Cuando termina la animación de desbloqueo, marcamos como unlocked
  useEffect(() => {
    if (status === 'unlocking') {
      const timer = setTimeout(() => {
        setUnlocked(animal.id);
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleClick = () => {
    if (status === 'locked' && canUnlock) {
      unlockAnimal(animal.id, animal.costo);
    }
  };

  return (
    <motion.div
      layout
      className="animal-card-wrapper"
      style={{ '--accent': animal.accentColor, '--bg': animal.color } as React.CSSProperties}
    >
      {/* ── LOCKED ── */}
      {status === 'locked' && (
        <motion.div
          className={`animal-card locked ${canUnlock ? 'can-unlock' : ''}`}
          onClick={handleClick}
          whileHover={canUnlock ? { scale: 1.03 } : {}}
          whileTap={canUnlock ? { scale: 0.97 } : {}}
          title={canUnlock ? 'Toca para desbloquear' : ''}
        >
          <div className="card-emoji blurred">
            {animal.emoji}
          </div>
          <div className="lock-icon">🔒</div>
          <div className="card-cost">
            <span className="cost-label">
              {canUnlock ? '¡Listo para desbloquear!' : `Faltan ${animal.costo - points} pts`}
            </span>
            <span className="cost-badge" style={{ background: canUnlock ? '#22c55e' : '#e5e7eb', color: canUnlock ? '#fff' : '#6b7280' }}>
              ⭐ {animal.costo} pts
            </span>
          </div>
        </motion.div>
      )}

      {/* ── UNLOCKING (animación) ── */}
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
        >
          {/* Imagen placeholder */}
          <div className="animal-image-placeholder">
            <span className="card-emoji">{animal.emoji}</span>
            <span className="placeholder-label">Foto próximamente</span>
          </div>

          <div className="card-info">
            <div className="card-header">
              <h3 className="animal-name">{animal.nombre}</h3>
              <span className="animal-tag" style={{ background: animal.accentColor }}>
                {animal.descripcionCorta}
              </span>
            </div>

            <p className="animal-desc">{animal.descripcion}</p>

            <div className="animal-stats">
              <div className="stat">
                <span className="stat-icon">⚖️</span>
                <span className="stat-value">{animal.stats.peso}</span>
                <span className="stat-label">peso</span>
              </div>
              <div className="stat">
                <span className="stat-icon">📏</span>
                <span className="stat-value">{animal.stats.longitud}</span>
                <span className="stat-label">longitud</span>
              </div>
              <div className="stat">
                <span className="stat-icon">🌿</span>
                <span className="stat-value">{animal.stats.habitat}</span>
                <span className="stat-label">hábitat</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}