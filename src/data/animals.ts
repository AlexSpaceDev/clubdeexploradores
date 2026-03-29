export interface Animal {
  id: string;
  nombre: string;
  emoji: string;
  imagen?: string;
  costo: number;
  descripcion: string;
  descripcionCorta: string;
  stats: {
    peso: string;
    longitud: string;
    habitat: string;
  };
  color: string;       // fondo de tarjeta desbloqueada
  accentColor: string; // badges y detalles
}

export const animals: Animal[] = [
  {
    id: 'condor-andino',
    nombre: 'Cóndor Andino',
    emoji: '🦅',
    imagen: '/images/condor-andino.jpg',
    costo: 20,
    descripcion: 'El rey de los cielos andinos. Con sus enormes alas planea sobre las montañas sin casi mover un músculo.',
    descripcionCorta: 'Sabio y valiente',
    stats: { peso: '11 kg', longitud: '1.3 m', habitat: 'Andes' },
    color: '#e0f2fe',
    accentColor: '#0284c7',
  },
  {
    id: 'tortuga-galapagos',
    nombre: 'Tortuga Galápagos',
    emoji: '🐢',
    costo: 40,
    descripcion: 'Puede vivir más de 100 años. Es una de las criaturas más antiguas y pacientes del planeta.',
    descripcionCorta: 'Lenta pero sabia',
    stats: { peso: '250 kg', longitud: '1.8 m', habitat: 'Galápagos' },
    color: '#d1fae5',
    accentColor: '#059669',
  },
  {
    id: 'oso-anteojos',
    nombre: 'Oso de Anteojos',
    emoji: '🐻',
    costo: 80,
    descripcion: 'El único oso de Sudamérica. Vive en los bosques nublados y tiene manchas únicas como huellas digitales.',
    descripcionCorta: 'Fuerte y curioso',
    stats: { peso: '140 kg', longitud: '1.7 m', habitat: 'Páramo' },
    color: '#fef3c7',
    accentColor: '#d97706',
  },
  {
    id: 'iguana-marina',
    nombre: 'Iguana Marina',
    emoji: '🦎',
    costo: 120,
    descripcion: 'La única iguana del mundo que nada en el océano. Se calienta al sol después de cada zambullida.',
    descripcionCorta: 'Fría y misteriosa',
    stats: { peso: '1.5 kg', longitud: '1.4 m', habitat: 'Galápagos' },
    color: '#f3e8ff',
    accentColor: '#7c3aed',
  },
  {
    id: 'lobo-paramo',
    nombre: 'Lobo de Páramo',
    emoji: '🦊',
    costo: 180,
    descripcion: 'Ágil y astuto, recorre el páramo andino en busca de alimento. Sus orejas grandes captan el menor sonido.',
    descripcionCorta: 'Curioso y veloz',
    stats: { peso: '7 kg', longitud: '0.9 m', habitat: 'Páramo' },
    color: '#fce7f3',
    accentColor: '#db2777',
  },
  {
    id: 'pinguino-galapagos',
    nombre: 'Pingüino Galápagos',
    emoji: '🐧',
    costo: 260,
    descripcion: 'El único pingüino que vive en el trópico. Nada a gran velocidad y es el más pequeño del Pacífico.',
    descripcionCorta: 'Veloz en el agua',
    stats: { peso: '2.5 kg', longitud: '0.5 m', habitat: 'Galápagos' },
    color: '#e0f2fe',
    accentColor: '#0369a1',
  },
];