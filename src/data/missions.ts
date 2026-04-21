export interface Mision {
  id: string;
  etapa: number;      // 1, 2 o 3
  emoji: string;
  titulo: string;
  descripcion: string;
  pasos: string[];
  mensajeCompletado: string;
  puntos: number;
}

export interface EtapaInfo {
  numero: number;
  nombre: string;
  objetivo: string;
  mensajeFinal: string;
}

export const etapas: EtapaInfo[] = [
  {
    numero: 1,
    nombre: 'Explorador principiante',
    objetivo: 'Enganchar con misiones divertidas y rápidas.',
    mensajeFinal: '¡Increíble! ¡Has descubierto tu primer animal!',
  },
  {
    numero: 2,
    nombre: 'Explorador aventurero',
    objetivo: 'Decisiones, creatividad e historias propias.',
    mensajeFinal: '¡Dos nuevos amigos se unen a la colección!',
  },
  {
    numero: 3,
    nombre: 'Guardián de los animales',
    objetivo: 'Emoción, aprendizaje y cierre fuerte.',
    mensajeFinal: '¡MISIÓN COMPLETADA! ¡Eres un verdadero guardián de los animales!',
  },
];

export const misiones: Mision[] = [

  // ── ETAPA 1 — Explorador principiante ──
  {
    id: 'e1-m1',
    etapa: 1,
    emoji: '🧠',
    titulo: 'Memoria de explorador andino',
    descripcion: 'Pon a prueba tu memoria con el puzzle de Los Andes.',
    pasos: [
      'Mira el rompecabezas de Los Andes por unos segundos…',
      '¡Ahora tápalo!',
      'Dibuja el animal que recuerdes en la montaña',
      '¿Ese animal vivía en lo alto o abajo de la montaña?',
    ],
    mensajeCompletado: '¡Muy bien! Tu memoria está despertando…',
    puntos: 10,
  },
  {
    id: 'e1-m2',
    etapa: 1,
    emoji: '✨',
    titulo: 'Animal mágico de los Andes',
    descripcion: 'Elige un animal y dale un poder especial.',
    pasos: [
      'Elige un animal del puzzle de Los Andes',
      'Dibújalo… pero con un poder especial',
    ],
    mensajeCompletado: '¡Ese animal es único!',
    puntos: 10,
  },
  {
    id: 'e1-m3',
    etapa: 1,
    emoji: '🔍',
    titulo: 'Detective de animales',
    descripcion: 'Dibuja de memoria sin mirar el puzzle.',
    pasos: [
      'Mira el puzzle (Andes o Galápagos)',
      'Sin mirar, dibuja la cara de 2 animales que recuerdes',
    ],
    mensajeCompletado: '¡Tu mente es súper rápida!',
    puntos: 10,
  },
  {
    id: 'e1-m4',
    etapa: 1,
    emoji: '🎨',
    titulo: 'Memoria rápida de colores',
    descripcion: 'Captura un color del puzzle y el animal que lo lleva.',
    pasos: [
      'Mira los colores del puzzle (Andes o Galápagos). ¿Qué color recuerdas?',
      'Dibújalo y di a qué animal pertenece',
    ],
    mensajeCompletado: '¡Memoria de campeón!',
    puntos: 10,
  },

  // ── ETAPA 2 — Explorador aventurero ──
  {
    id: 'e2-m1',
    etapa: 2,
    emoji: '🗺️',
    titulo: 'Elige el camino',
    descripcion: 'Un animal quiere viajar… tú decides su ruta.',
    pasos: [
      'Decide: ¿Va de la montaña al mar? ¿O del mar a la montaña?',
      'Dibuja su viaje. ¿Qué encontró en el camino?',
    ],
    mensajeCompletado: '¡Qué lugar increíble!',
    puntos: 15,
  },
  {
    id: 'e2-m2',
    etapa: 2,
    emoji: '🪄',
    titulo: 'Nuevo habitante',
    descripcion: 'Crea un animal que nadie ha visto antes.',
    pasos: [
      'Inventa y dibuja un animal nuevo para Los Andes o Galápagos',
    ],
    mensajeCompletado: '¡Creaste un nuevo amigo!',
    puntos: 15,
  },
  {
    id: 'e2-m3',
    etapa: 2,
    emoji: '🌊',
    titulo: 'Viaje entre mundos',
    descripcion: 'Un animal quiere explorar y viajar al mar.',
    pasos: [
      'Imagina y dibuja la aventura del paisaje del animal',
    ],
    mensajeCompletado: '¡Qué viaje tan emocionante!',
    puntos: 15,
  },

  // ── ETAPA 3 — Guardián de los animales ──
  {
    id: 'e3-m1',
    etapa: 3,
    emoji: '🛡️',
    titulo: 'El guardián final',
    descripcion: 'Protege a tu animal favorito en su hogar.',
    pasos: [
      'Elige tu animal favorito',
      'Dibújalo en su hogar. ¿Cómo lo cuidarías para que esté a salvo?',
    ],
    mensajeCompletado: '¡Eres un guardián de los animales!',
    puntos: 20,
  },
  {
    id: 'e3-m2',
    etapa: 3,
    emoji: '🧭',
    titulo: 'Explorador del Ecuador',
    descripcion: 'Ubica en el mapa las regiones del país.',
    pasos: [
      'Dibuja un mapa del Ecuador y marca dónde están las Islas Galápagos, los Andes y la Amazonía',
      'Usa colores diferentes para cada zona',
    ],
    mensajeCompletado: '¡Eres el mejor explorador de aventuras!',
    puntos: 20,
  },
  {
    id: 'e3-m3',
    etapa: 3,
    emoji: '💚',
    titulo: 'Guardianes de los animales',
    descripcion: 'Algunos animales necesitan tu ayuda.',
    pasos: [
      'Busca o pregunta por 2 animales en peligro',
      'Dibújalos en su hogar',
    ],
    mensajeCompletado: '¡Increíble! Ahora eres protector de los animales.',
    puntos: 20,
  },
];
