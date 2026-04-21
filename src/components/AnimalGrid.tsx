import { useEffect, useState } from 'react';
import { animals } from '../data/animals';
import { useExplorerStore } from '../store/explorerStore';
import { useDebugMode } from '../utils/useDebugMode';
import AnimalCard from './AnimalCard';
import AnimalVisor from './AnimalVisor';

export default function AnimalGrid() {
  const { points, animals: animalStates, initAnimals, addPoints, resetAll } = useExplorerStore();
  const debug = useDebugMode();
  const [activeId, setActiveId] = useState<string>(animals[0].id);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initAnimals(animals.map((a) => a.id));
    setReady(true);
  }, [initAnimals]);

  // 👇 Este useEffect adicional re-inicializa tras un reset
  useEffect(() => {
    if (ready && animalStates.length === 0) {
        initAnimals(animals.map((a) => a.id));
    }
  }, [animalStates.length, ready, initAnimals]);

  const unlockedCount = animalStates.filter((a) => a.status === 'unlocked').length;
  const activeAnimal = animals.find((a) => a.id === activeId)!;
  const activeState = animalStates.find((a) => a.id === activeId);
  const activeStatus = activeState?.status ?? 'locked';

  if (!ready) return null;

  return (
    <div className="animal-grid-wrapper">

      {/* Header */}
      <div className="grid-header">
        <div className="points-badge">
          <span>⭐</span>
          <span>{points} puntos</span>
        </div>
        <div className="unlocked-badge">
          🦎 {unlockedCount} de {animals.length} descubiertos
        </div>
        {debug && (
          <div className="test-buttons">
            <button className="test-btn" onClick={() => addPoints(50)}>
              + 50 pts
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
          />
        </div>

        <div className="cards-col">
          <div className="animals-grid">
            {animals.map((animal) => {
              const state = animalStates.find((a) => a.id === animal.id);
              const status = state?.status ?? 'locked';
              return (
                <AnimalCard
                  key={animal.id}
                  animal={animal}
                  status={status}
                  points={points}
                  isActive={animal.id === activeId}
                  onClick={() => setActiveId(animal.id)}
                />
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}