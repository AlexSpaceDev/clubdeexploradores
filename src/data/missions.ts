export interface Mision {
  id: string;
  semana: number;      // 1–4
  emoji: string;
  titulo: string;
  descripcion: string;
  puntos: number;
}

export const misiones: Mision[] = [

  // ── SEMANA 1 ─────────────────────────────────────────────
  {
    id: 's1-m1',
    semana: 1,
    emoji: '🎨',
    titulo: 'Dibuja tu animal favorito del puzzle',
    descripcion: 'Usa tus colores favoritos y crea tu propia versión del animal. ¡Sé tan creativo como quieras!',
    puntos: 15,
  },
  {
    id: 's1-m2',
    semana: 1,
    emoji: '🏔️',
    titulo: 'Busca algo en tu entorno que se parezca a una montaña',
    descripcion: 'Puede ser una nube, una figura o un objeto en casa. Cuéntale a tu familia por qué te recordó a los Andes.',
    puntos: 15,
  },
  {
    id: 's1-m3',
    semana: 1,
    emoji: '🐾',
    titulo: 'Imita cómo se movería tu animal favorito',
    descripcion: 'Hazlo con energía y conviértelo en un juego divertido con alguien de tu familia.',
    puntos: 15,
  },
  {
    id: 's1-m4',
    semana: 1,
    emoji: '📖',
    titulo: 'Lee en voz alta un dato curioso de un animal',
    descripcion: 'Busca en la página o pregunta a un adulto. ¡Luego cuéntaselo a alguien de tu familia!',
    puntos: 15,
  },

  // ── SEMANA 2 ─────────────────────────────────────────────
  {
    id: 's2-m1',
    semana: 2,
    emoji: '🌿',
    titulo: 'Encuentra una planta o flor en tu barrio',
    descripcion: 'Observa sus colores y forma. ¿Se parece al hábitat de alguno de los animales del puzzle?',
    puntos: 20,
  },
  {
    id: 's2-m2',
    semana: 2,
    emoji: '🔭',
    titulo: 'Mira el cielo durante 5 minutos',
    descripcion: 'Busca aves, nubes o cualquier cosa interesante. ¿Viste algo que se parezca al Cóndor Andino?',
    puntos: 20,
  },
  {
    id: 's2-m3',
    semana: 2,
    emoji: '✏️',
    titulo: 'Escribe 3 palabras que describan a la tortuga',
    descripcion: 'Piensa en cómo es, cómo se mueve y dónde vive. Puedes dibujar las palabras con letras coloridas.',
    puntos: 20,
  },
  {
    id: 's2-m4',
    semana: 2,
    emoji: '🧩',
    titulo: 'Arma el puzzle y nombra todos los animales',
    descripcion: 'Ponlos por nombre uno a uno mientras los ubicas en su lugar. ¡Pídele a alguien que te tome el tiempo!',
    puntos: 20,
  },

  // ── SEMANA 3 ─────────────────────────────────────────────
  {
    id: 's3-m1',
    semana: 3,
    emoji: '🌊',
    titulo: 'Aprende qué son las Islas Galápagos',
    descripcion: 'Pregunta a un adulto o búscalo en un libro. Luego dibuja cómo imaginas que se ven.',
    puntos: 25,
  },
  {
    id: 's3-m2',
    semana: 3,
    emoji: '🦁',
    titulo: 'Cuenta una historia donde un animal del puzzle es el héroe',
    descripcion: 'Puede ser corta, de 3 oraciones. ¡La puedes contar, escribir o dibujar en viñetas!',
    puntos: 25,
  },
  {
    id: 's3-m3',
    semana: 3,
    emoji: '🥗',
    titulo: 'Averigua qué come el Oso de Anteojos',
    descripcion: 'Pista: le encantan las frutas y plantas del bosque nublado. ¡Cuéntaselo a tu familia en la cena!',
    puntos: 25,
  },
  {
    id: 's3-m4',
    semana: 3,
    emoji: '🎭',
    titulo: 'Haz una obra de teatro de 1 minuto con un animal',
    descripcion: 'Elige un animal del puzzle y representa cómo vive su día. Puedes usar juguetes o solo tu cuerpo.',
    puntos: 25,
  },

  // ── SEMANA 4 ─────────────────────────────────────────────
  {
    id: 's4-m1',
    semana: 4,
    emoji: '🗺️',
    titulo: 'Dibuja un mapa del Ecuador con los hábitats',
    descripcion: 'Marca dónde viven: los Andes, la Costa, Galápagos y la Amazonía. Puedes usar colores diferentes para cada zona.',
    puntos: 30,
  },
  {
    id: 's4-m2',
    semana: 4,
    emoji: '💌',
    titulo: 'Escribe una carta a tu animal favorito',
    descripcion: 'Cuéntale por qué te gusta, qué harías si lo conocieras y cómo lo cuidarías.',
    puntos: 30,
  },
  {
    id: 's4-m3',
    semana: 4,
    emoji: '🌍',
    titulo: 'Investiga qué animales del puzzle están en peligro',
    descripcion: 'Pregunta a un adulto o busca en un libro. Comparte lo que aprendiste y piensa en cómo ayudarlos.',
    puntos: 30,
  },
  {
    id: 's4-m4',
    semana: 4,
    emoji: '🏆',
    titulo: '¡Muéstrale la colección completa a alguien especial!',
    descripcion: 'Comparte tu progreso en la página con un familiar o amigo y explícale qué aprendiste de cada animal.',
    puntos: 30,
  },
];