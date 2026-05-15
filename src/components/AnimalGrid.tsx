import { useEffect, useMemo, useState } from 'react';
import { animals, REGIONES, type Region } from '../data/animals';
import { useExplorerStore } from '../store/explorerStore';
import { useDebugMode } from '../utils/useDebugMode';
import AnimalCard from './AnimalCard';
import AnimalVisor from './AnimalVisor';
import DiscoveryModal from './DiscoveryModal';

const REGION_PARAM_VALUES: Region[] = ['galapagos', 'andes'];

export default function AnimalGrid() {
  const {
    points,
    animals: animalStates,
    regionesDesbloqueadas,
    initAnimals,
    addPoints,
    resetAll,
    desbloquearRegion,
    recienDescubierto,
    cerrarDescubrimiento,
  } = useExplorerStore();
  const debug = useDebugMode();

  // Captura del QR del puzzle físico: ?p=andes | ?p=galapagos.
  // Tras procesarlo limpiamos el parámetro de la URL para que no quede
  // visible (mejor UX y dificulta el copy-paste casual).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const param = url.searchParams.get('p');
    if (!param) return;
    if ((REGION_PARAM_VALUES as string[]).includes(param)) {
      desbloquearRegion(param as Region);
    }
    url.searchParams.delete('p');
    window.history.replaceState({}, '', url.pathname + url.search + url.hash);
  }, [desbloquearRegion]);

  // Solo los animales desbloqueables entran al store — los "proximamente" son teaser visual.
  const desbloqueables = useMemo(() => animals.filter((a) => !a.proximamente), []);

  const [activeId, setActiveId] = useState<string>(desbloqueables[0].id);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initAnimals(desbloqueables.map((a) => a.id));
    setReady(true);
  }, [initAnimals, desbloqueables]);

  // Re-inicializa tras un reset
  useEffect(() => {
    if (ready && animalStates.length === 0) {
      initAnimals(desbloqueables.map((a) => a.id));
    }
  }, [animalStates.length, ready, initAnimals, desbloqueables]);

  const unlockedCount = animalStates.filter((a) => a.status === 'unlocked').length;
  const activeAnimal = animals.find((a) => a.id === activeId)!;
  const activeState = animalStates.find((a) => a.id === activeId);
  const activeStatus = activeState?.status ?? 'locked';
  const activeRegionLocked =
    !!activeAnimal.region && !regionesDesbloqueadas.includes(activeAnimal.region);
  const animalDescubierto = recienDescubierto
    ? animals.find((a) => a.id === recienDescubierto) ?? null
    : null;
  const sinRegiones = regionesDesbloqueadas.length === 0;

  if (!ready) return null;

  return (
    <div className="animal-grid-wrapper">

      {/* Banner: sin ninguna región desbloqueada (entró sin escanear el QR) */}
      {sinRegiones && (
        <div className="region-empty-banner">
          <span className="region-empty-icon" aria-hidden>🧩</span>
          <div className="region-empty-text">
            <strong>Escanea el QR de tu puzzle Print Craft</strong>
            <span>
              Cada caja desbloquea su grupo de animales para empezar la aventura.
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="grid-header">
        <div className="points-badge">
          <span>⭐</span>
          <span>{points} puntos</span>
        </div>
        <div className="unlocked-badge">
          🦎 {unlockedCount} de {desbloqueables.length} descubiertos
        </div>
        {/* Chips de regiones desbloqueadas */}
        {regionesDesbloqueadas.map((r) => (
          <div key={r} className="region-chip">
            <span aria-hidden>{REGIONES[r].emoji}</span>
            <span>{REGIONES[r].puzzle}</span>
          </div>
        ))}
        {debug && (
          <div className="test-buttons">
            <button className="test-btn" onClick={() => addPoints(50)}>
              + 50 pts
            </button>
            <button
              className="test-btn"
              onClick={() => desbloquearRegion('galapagos')}
            >
              🏝️ Galápagos
            </button>
            <button
              className="test-btn"
              onClick={() => desbloquearRegion('andes')}
            >
              🏔️ Andes
            </button>
            <button className="test-btn reset" onClick={resetAll}>
              🔄 Reset
            </button>
          </div>
        )}
      </div>

      {/* Layout principal */}
      <div className="main-layout">

        <div className="visor-col">
          <AnimalVisor
            animal={activeAnimal}
            status={activeStatus}
            points={points}
            regionLocked={activeRegionLocked}
          />
        </div>

        <div className="cards-col">
          <div className="animals-grid">
            {animals.map((animal) => {
              const state = animalStates.find((a) => a.id === animal.id);
              const status = state?.status ?? 'locked';
              const regionLocked =
                !!animal.region && !regionesDesbloqueadas.includes(animal.region);
              return (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  status={status}
                  points={points}
                  isActive={animal.id === activeId}
                  regionLocked={regionLocked}
                  onClick={() => setActiveId(animal.id)}
                />
              );
            })}
          </div>
        </div>

      </div>

      <DiscoveryModal animal={animalDescubierto} onClose={cerrarDescubrimiento} />
    </div>
  );
}
