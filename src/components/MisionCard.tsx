import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Mision } from '../data/missions';

interface MisionCardProps {
  mision: Mision;
  completada: boolean;
  onCompletar: () => void;
}

export default function MisionCard({ mision, completada, onCompletar }: MisionCardProps) {
  const [expandida, setExpandida] = useState(false);
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImagenPreview(url);
  };

  const handleCompletar = () => {
    onCompletar();
    setExpandida(false);
    setImagenPreview(null);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: completada ? '#f0fdf4' : '#ffffff',
        border: completada ? '2px solid #86efac' : '2px solid #e5e7eb',
        borderRadius: '20px',
        padding: '1rem 1.1rem',
        fontFamily: "'Nunito', sans-serif",
        transition: 'border-color 0.2s, background 0.2s',
        cursor: completada ? 'default' : 'pointer',
        opacity: completada ? 0.75 : 1,
      }}
      onClick={() => {
        if (!completada) setExpandida((v) => !v);
      }}
    >
      {/* Fila principal */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>

        {/* Emoji */}
        <div style={{
          fontSize: '1.6rem',
          lineHeight: 1,
          flexShrink: 0,
          marginTop: '0.1rem',
          filter: completada ? 'grayscale(0.4)' : 'none',
        }}>
          {completada ? '✅' : mision.emoji}
        </div>

        {/* Texto */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 800,
            fontSize: '0.92rem',
            color: completada ? '#4b7a5a' : '#111827',
            lineHeight: 1.3,
            marginBottom: '0.25rem',
          }}>
            {mision.titulo}
          </div>
          <div style={{
            fontSize: '0.78rem',
            color: '#6b7280',
            lineHeight: 1.5,
            fontWeight: 600,
          }}>
            {mision.descripcion}
          </div>
        </div>

        {/* Badge de puntos */}
        <div style={{
          flexShrink: 0,
          background: completada ? '#dcfce7' : '#fef3c7',
          color: completada ? '#166534' : '#92400e',
          fontWeight: 900,
          fontSize: '0.78rem',
          padding: '0.3rem 0.6rem',
          borderRadius: '10px',
          textAlign: 'center',
          lineHeight: 1.3,
        }}>
          {completada ? '✓' : `+${mision.puntos}`}
          {!completada && <div style={{ fontSize: '0.65rem', fontWeight: 700 }}>pts</div>}
        </div>
      </div>

      {/* Panel expandible con subir imagen */}
      <AnimatePresence>
        {expandida && !completada && (
          <motion.div
            key="expand"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ overflow: 'hidden' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              marginTop: '1rem',
              background: '#f9fafb',
              borderRadius: '14px',
              padding: '0.85rem 1rem',
            }}>
              <div style={{
                fontWeight: 800,
                fontSize: '0.85rem',
                color: '#111827',
                marginBottom: '0.25rem',
              }}>
                Sube una imagen de la actividad
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: '#6b7280',
                fontWeight: 600,
                lineHeight: 1.5,
                marginBottom: '0.75rem',
              }}>
                Un adulto puede tomar una foto del dibujo, manualidad o reto realizado para validar la misión.
              </div>

              {/* Preview o botón de subir */}
              {imagenPreview ? (
                <div style={{ marginBottom: '0.75rem' }}>
                  <img
                    src={imagenPreview}
                    alt="Preview"
                    style={{
                      width: '100%',
                      height: '120px',
                      objectFit: 'cover',
                      borderRadius: '10px',
                      border: '2px solid #d1fae5',
                    }}
                  />
                </div>
              ) : null}

              <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Botón subir */}
                <button
                  onClick={() => inputRef.current?.click()}
                  style={{
                    background: '#22a55b',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.55rem 1.1rem',
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  {imagenPreview ? '📷 Cambiar imagen' : '📷 Subir imagen'}
                </button>

                {/* Botón confirmar — solo visible si hay imagen */}
                {imagenPreview && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={handleCompletar}
                    style={{
                      background: '#dcfce7',
                      color: '#166534',
                      border: '2px solid #86efac',
                      borderRadius: '12px',
                      padding: '0.55rem 1.1rem',
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 900,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                    }}
                  >
                    ✅ ¡Misión cumplida! +{mision.puntos} pts
                  </motion.button>
                )}

                {/* Sin imagen: botón de completar directo (fallback) */}
                {!imagenPreview && (
                  <button
                    onClick={handleCompletar}
                    style={{
                      background: '#f3f4f6',
                      color: '#9ca3af',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      padding: '0.55rem 1.1rem',
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      cursor: 'not-allowed',
                    }}
                    disabled
                  >
                    Sube una imagen para continuar
                  </button>
                )}
              </div>

              {/* Input oculto */}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}