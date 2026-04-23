# Club de Exploradores

Sitio web gamificado para pequeños exploradores que aprenden sobre la fauna ecuatoriana. Los niños completan misiones organizadas por etapas, ganan puntos y desbloquean animales en una colección digital que acompaña al puzzle físico.

## 🧭 Cómo funciona

1. **Misiones por etapas** — las misiones están agrupadas en 3 etapas secuenciales (*Explorador principiante* → *Explorador aventurero* → *Guardián de los animales*). La siguiente etapa se habilita cuando se completan todas las misiones de la anterior. Un adulto valida la actividad subiendo una foto desde la card.
2. **Puntos** — cada misión completada suma puntos al explorador. Etapa 1: 5 pts por misión. Etapa 2: 10/20/30. Etapa 3: 20/20/30.
3. **Animales** — los puntos permiten desbloquear animales ecuatorianos (Tortuga Galápagos, Iguana Marina, Cóndor Andino y Oso de Anteojos) en orden de costo ascendente. El Lobo de Páramo aparece como "próximamente".
4. **Celebración de etapas** — al completar todas las misiones de una etapa se dispara una celebración; el usuario debe presionar "Continuar" para avanzar, evitando celebraciones retroactivas tras refrescar.
5. **Descubrimiento de animal** — al desbloquear un animal se abre un modal con confeti, polaroid y un chibi ilustrado.

## 🧱 Stack

- **[Astro 6](https://astro.build)** — sitio estático, islas interactivas con `client:load`.
- **React 19** — componentes interactivos (grids, visor, cards de misión, modales).
- **[Zustand 5](https://github.com/pmndrs/zustand)** con `persist` — estado global (puntos, animales, misiones, etapas confirmadas) en `localStorage` bajo la llave `explorer-store` (versión 4, con migraciones).
- **[Framer Motion 12](https://www.framer.com/motion/)** — animaciones de desbloqueo, shake, confeti, transiciones.
- **Tailwind CSS 4** — vía `@tailwindcss/vite`.
- **TypeScript estricto**.

## 📁 Estructura

```text
src/
├── components/
│   ├── Header.astro           · Cabecera responsive
│   ├── Hero.astro             · Sección de bienvenida + CTAs
│   ├── Steps.astro            · "Cómo jugar" (4 pasos)
│   ├── AnimalesSection.astro  · Sección 1: colección
│   ├── AnimalGrid.tsx         · Isla React — grid de tarjetas + visor
│   ├── AnimalCard.tsx         · Tarjeta (locked / unlocking / unlocked)
│   ├── AnimalVisor.tsx        · Visor detalle del animal activo
│   ├── MisionesSection.astro  · Sección 2: misiones
│   ├── MisionesGrid.tsx       · Isla React — misión destacada + lista + celebración de etapa
│   ├── MisionCard.tsx         · Card expandible con subida de imagen
│   ├── DiscoveryModal.tsx     · Modal de descubrimiento con confeti + chibi
│   ├── ImageLightbox.tsx      · Lightbox para fotos de animales
│   ├── ClickSparkles.astro    · Partículas al hacer click / tap
│   ├── ProximosSection.astro  · Sección 3: próximos descubrimientos
│   └── Footer.astro           · Pie responsive
├── data/
│   ├── animals.ts             · 5 animales ecuatorianos (1 como "próximamente")
│   └── missions.ts            · 10 misiones en 3 etapas (4 + 3 + 3)
├── store/
│   └── explorerStore.ts       · Zustand store — puntos, animales, etapas y helpers
├── lib/
│   └── sounds.ts              · Efectos de sonido (press, unlock, etc.)
├── utils/
│   └── useDebugMode.ts        · Hook para activar UI de debug
├── layouts/
│   └── Layout.astro           · HTML base, fuente Nunito, SEO, global.css
├── pages/
│   └── index.astro            · Única ruta
└── styles/
    └── global.css             · Reset + import de Tailwind + estilos del modal
public/
└── images/
    ├── animals/               · Fotos (.webp) por animal
    └── chibis/                · Ilustraciones chibi (.png) para el modal
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
