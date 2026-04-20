import { motion } from 'framer-motion';
import type { Animal } from '../data/animals';
import type { AnimalStatus } from '../store/explorerStore';

interface Props {
  animal: Animal;
  status: AnimalStatus;
  points: number;
}

export default function AnimalVisor({ animal, status, points }: Props) {
  const canUnlock = points >= animal.costo;

  return (
    <motion.div
      key={animal.id}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      style={{
        background: '#fff',
        borderRadius: '24px',
        padding: '1.25rem',
        boxShadow: '0 2px 20px rgba(0,0,0,0.09)',
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
        color: '#22a55b',
        textTransform: 'uppercase',
        display: 'flex',
        alignItems: 'center',
        gap: '0.35rem',
      }}>
        🔭 VISOR EXPLORADOR
      </div>

      {/* Imagen */}
      <div style={{
        borderRadius: '16px',
        height: '200px',
        background: status === 'unlocked' ? animal.color : '#e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        gap: '0.5rem',
        overflow: 'hidden',
      }}>
        <span style={{
          fontSize: '5rem',
          lineHeight: 1,
          filter: status !== 'unlocked'
            ? 'grayscale(1) blur(3px) opacity(0.3)'
            : 'none',
          transition: 'filter 0.4s',
        }}>
          {animal.emoji}
        </span>

        {status !== 'unlocked' && (
          <span style={{ fontSize: '2.5rem', position: 'absolute' }}>🔒</span>
        )}

        {status === 'unlocked' && animal.imagen && (
          <img
            src={animal.imagen}
            alt={animal.nombre}
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

      {/* Locked: costo */}
      {status !== 'unlocked' && (
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
  );
}