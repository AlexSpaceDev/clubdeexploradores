import { useEffect } from 'react';
import { animals } from '../data/animals';
import { useExplorerStore } from '../store/explorerStore';
import AnimalCard from './AnimalCard';

export default function AnimalGrid() {
  const { points, animals: animalStates, initAnimals, addPoints } = useExplorerStore();

  // Registra animales en el store si es primera vez
  useEffect(() => {
    initAnimals(animals.map((a) => a.id));
  }, []);

  const unlockedCount = animalStates.filter((a) => a.status === 'unlocked').length;

  return (
    <div className="animal-grid-wrapper">
      {/* Header con puntos y contador */}
      <div className="grid-header">
        <div className="points-badge">
          <span>⭐</span>
          <span>{points} puntos</span>
        </div>
        <div className="unlocked-badge">
          🦎 {unlockedCount} de {animals.length} descubiertos
        </div>
      </div>

      {/* Botón temporal para testing — quitar en producción */}
      <button
        className="test-btn"
        onClick={() => addPoints(50)}
      >
        + 50 pts (prueba)
      </button>

      {/* Grid de tarjetas */}
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
            />
          );
        })}
      </div>
    </div>
  );
}