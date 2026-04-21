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
              {/* Pasos de la misión */}
              {mision.pasos && mision.pasos.length > 0 && (
                <div style={{ marginBottom: '0.9rem' }}>
                  <div style={{
                    fontWeight: 800,
                    fontSize: '0.8rem',
                    color: '#111827',
                    marginBottom: '0.4rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}>
                    Pasos de la misión
                  </div>
                  <ul style={{
                    margin: 0,
                    paddingLeft: '1.1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem',
                    fontSize: '0.78rem',
                    color: '#374151',
                    fontWeight: 600,
                    lineHeight: 1.5,
                  }}>
                    {mision.pasos.map((paso, i) => (
                      <li key={i}>{paso}</li>
                    ))}
                  </ul>
                </div>
              )}

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
                Un adulto puede tomar una foto del dibujo realizado para validar la misión.
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

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>

                {!imagenPreview ? (
                  /* ── Estado 1: sin imagen — Subir es el protagonista ── */
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => inputRef.current?.click()}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #22a55b 0%, #16a34a 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '14px',
                      padding: '0.85rem 1.25rem',
                      fontFamily: "'Nunito', sans-serif",
                      fontWeight: 900,
                      fontSize: '1rem',
                      cursor: 'pointer',
                      boxShadow: '0 4px 14px rgba(34,165,91,0.35)',
                    }}
                  >
                    📷 Subir imagen
                  </motion.button>
                ) : (
                  /* ── Estado 2: con imagen — Completar es el protagonista ── */
                  <>
                    <motion.button
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleCompletar}
                      style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #22a55b 0%, #16a34a 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '14px',
                        padding: '0.85rem 1.25rem',
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 900,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 4px 14px rgba(34,165,91,0.35)',
                      }}
                    >
                      ✅ Completar misión +{mision.puntos} pts
                    </motion.button>

                    {/* Cambiar imagen: secundario y discreto */}
                    <button
                      onClick={() => inputRef.current?.click()}
                      style={{
                        width: '100%',
                        background: 'transparent',
                        color: '#9ca3af',
                        border: '2px dashed #e5e7eb',
                        borderRadius: '12px',
                        padding: '0.5rem 1rem',
                        fontFamily: "'Nunito', sans-serif",
                        fontWeight: 700,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                      }}
                    >
                      📷 Cambiar imagen
                    </button>
                  </>
                )}

              </div>

              {/* Input oculto */}
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
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