import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  images: string[];
  alt: string;
  initialIndex?: number;
  onClose: () => void;
}

const HISTORY_TAG = 'clubexp-lightbox';

export default function ImageLightbox({ images, alt, initialIndex = 0, onClose }: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  // Ref estable para onClose (evita que el efecto mount-only capture un handler viejo)
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

  const next = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  // ── Montaje: capturar botón atrás (Android), teclas, bloquear scroll ──
  useEffect(() => {
    // Empuja una entrada de historial con un tag propio. Si el usuario presiona
    // atrás en el móvil, el navegador dispara `popstate` y cerramos el visor
    // en vez de abandonar la página.
    history.pushState({ [HISTORY_TAG]: true }, '');

    const handlePop = () => onCloseRef.current();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };

    window.addEventListener('popstate', handlePop);
    window.addEventListener('keydown', handleKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('popstate', handlePop);
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
      // Si la entrada de historial sigue ahí (cerraron con la X), la consumimos
      // para no ensuciar el stack del navegador.
      if ((history.state as Record<string, unknown> | null)?.[HISTORY_TAG]) {
        history.back();
      }
    };
  }, [next, prev]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 120 : -120, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -120 : 120, opacity: 0 }),
  };

  const hasMultiple = images.length > 1;

  return (
    <motion.div
      className="lightbox-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={() => onCloseRef.current()}
      role="dialog"
      aria-modal="true"
      aria-label={`Visor de imagen: ${alt}`}
    >
      {/* Botón cerrar */}
      <button
        className="lightbox-close"
        onClick={(e) => { e.stopPropagation(); onCloseRef.current(); }}
        aria-label="Cerrar visor"
        type="button"
      >
        ✕
      </button>

      {/* Contador */}
      {hasMultiple && (
        <div className="lightbox-counter">
          {index + 1} / {images.length}
        </div>
      )}

      {/* Flecha prev */}
      {hasMultiple && (
        <button
          className="lightbox-arrow lightbox-arrow-left"
          onClick={(e) => { e.stopPropagation(); prev(); }}
          aria-label="Imagen anterior"
          type="button"
        >
          ‹
        </button>
      )}

      {/* Imagen con swipe */}
      <div
        className="lightbox-stage"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait" initial={false} custom={direction}>
          <motion.img
            key={index}
            src={images[index]}
            alt={`${alt} ${index + 1}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeOut' }}
            drag={hasMultiple ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_e, info) => {
              const threshold = 60;
              if (info.offset.x < -threshold) next();
              else if (info.offset.x > threshold) prev();
            }}
            draggable={false}
          />
        </AnimatePresence>
      </div>

      {/* Flecha next */}
      {hasMultiple && (
        <button
          className="lightbox-arrow lightbox-arrow-right"
          onClick={(e) => { e.stopPropagation(); next(); }}
          aria-label="Imagen siguiente"
          type="button"
        >
          ›
        </button>
      )}

      {/* Dots */}
      {hasMultiple && (
        <div className="lightbox-dots" onClick={(e) => e.stopPropagation()}>
          {images.map((_, i) => (
            <button
              key={i}
              className={`lightbox-dot ${i === index ? 'active' : ''}`}
              onClick={() => {
                setDirection(i > index ? 1 : -1);
                setIndex(i);
              }}
              aria-label={`Ir a imagen ${i + 1}`}
              type="button"
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
