# Club de Exploradores

Sitio web gamificado para pequeños exploradores que aprenden sobre la fauna ecuatoriana. Los niños completan misiones semanales, ganan puntos y desbloquean animales en una colección digital que acompaña al puzzle físico.

## 🧭 Cómo funciona

1. **Misiones semanales** — cada semana se habilitan 4 actividades (dibujar, imitar, investigar, leer…). Un adulto valida la actividad subiendo una foto desde la card.
2. **Puntos** — cada misión completada suma puntos al explorador.
3. **Animales** — los puntos permiten desbloquear animales ecuatorianos (Cóndor Andino, Tortuga Galápagos, Oso de Anteojos, Iguana Marina, Lobo de Páramo, Pingüino Galápagos) en orden de costo ascendente.
4. **Progresión** — las misiones no completadas de semanas anteriores se acumulan al frente del bloque actual, nadie se queda atrás.

## 🧱 Stack

- **[Astro 6](https://astro.build)** — sitio estático, islas interactivas con `client:load`.
- **React 19** — componentes interactivos (grids, visor, cards de misión).
- **[Zustand 5](https://github.com/pmndrs/zustand)** con `persist` — estado global (puntos, animales, misiones) en `localStorage` bajo la llave `explorer-store`.
- **[Framer Motion 12](https://www.framer.com/motion/)** — animaciones de desbloqueo, shake, transiciones.
- **Tailwind CSS 4** — vía `@tailwindcss/vite`.
- **TypeScript estricto**.

## 📁 Estructura

```text
src/
├── components/
│   ├── Hero.astro            · Sección de bienvenida + pasos
│   ├── Steps.astro           · "Cómo jugar" (4 pasos)
│   ├── AnimalesSection.astro · Sección 1: colección
│   ├── AnimalGrid.tsx        · Isla React — grid de tarjetas + visor
│   ├── AnimalCard.tsx        · Tarjeta (locked / unlocking / unlocked)
│   ├── AnimalVisor.tsx       · Visor detalle del animal activo
│   ├── MisionesSection.astro · Sección 2: misiones
│   ├── MisionesGrid.tsx      · Isla React — misión destacada + lista
│   ├── MisionCard.tsx        · Card expandible con subida de imagen
│   └── ProximosSection.astro · Sección 3: próximos descubrimientos
├── data/
│   ├── animals.ts            · 6 animales ecuatorianos
│   └── missions.ts           · 16 misiones (4 semanas × 4)
├── store/
│   └── explorerStore.ts      · Zustand store con lógica de semanas
├── layouts/
│   └── Layout.astro          · HTML base, fuente Nunito, global.css
├── pages/
│   └── index.astro           · Única ruta
└── styles/
    └── global.css            · Reset + import de Tailwind
```

## 🧞 Comandos

Todos los comandos se ejecutan desde la raíz del proyecto.

| Comando              | Acción                                          |
| :------------------- | :---------------------------------------------- |
| `npm install`        | Instala dependencias                            |
| `npm run dev`        | Arranca el servidor local en `localhost:4321`   |
| `npm run build`      | Genera el sitio estático en `./dist/`           |
| `npm run preview`    | Previsualiza el build antes de desplegar        |
| `npm run astro ...`  | Ejecuta comandos del CLI de Astro               |

## 🧪 Requisitos

- Node.js **>= 22.12.0**
