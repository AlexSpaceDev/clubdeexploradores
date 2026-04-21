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
  color: string;
  accentColor: string;
  especial?: boolean;
  proximamente?: boolean;
}

export const animals: Animal[] = [
  {
    id: 'tortuga-galapagos',
    nombre: 'Tortuga Galápagos',
    emoji: '🐢',
    costo: 20,
    descripcion: 'Puede vivir más de 100 años. Es una de las criaturas más antiguas y pacientes del planeta.',
    descripcionCorta: 'Lenta pero sabia',
    stats: { peso: '250 kg', longitud: '1.8 m', habitat: 'Galápagos' },
    color: '#d1fae5',
    accentColor: '#059669',
  },
  {
    id: 'iguana-marina',
    nombre: 'Iguana Marina',
    emoji: '🦎',
    costo: 20,
    descripcion: 'La única iguana del mundo que nada en el océano. Se calienta al sol después de cada zambullida.',
    descripcionCorta: 'Fría y misteriosa',
    stats: { peso: '1.5 kg', longitud: '1.4 m', habitat: 'Galápagos' },
    color: '#f3e8ff',
    accentColor: '#7c3aed',
  },
  {
    id: 'condor-andino',
    nombre: 'Cóndor Andino',
    emoji: '🦅',
    imagen: '/images/condor-andino.jpg',
    costo: 40,
    descripcion: 'El rey de los cielos andinos. Con sus enormes alas planea sobre las montañas sin casi mover un músculo.',
    descripcionCorta: 'Sabio y valiente',
    stats: { peso: '11 kg', longitud: '1.3 m', habitat: 'Andes' },
    color: '#e0f2fe',
    accentColor: '#0284c7',
  },
  {
    id: 'oso-anteojos',
    nombre: 'Oso de Anteojos',
    emoji: '🐻',
    costo: 60,
    descripcion: 'El único oso de Sudamérica. Vive en los bosques nublados y tiene manchas únicas como huellas digitales.',
    descripcionCorta: 'Guardián del bosque',
    stats: { peso: '140 kg', longitud: '1.7 m', habitat: 'Páramo' },
    color: '#fef3c7',
    accentColor: '#d97706',
    especial: true,
  },
  {
    id: 'lobo-paramo',
    nombre: 'Lobo de Páramo',
    emoji: '🦊',
    costo: 0,
    descripcion: 'Un nuevo explorador llegará pronto al Club. Sigue completando misiones para recibir más aventuras.',
    descripcionCorta: 'Muy pronto',
    stats: { peso: '—', longitud: '—', habitat: '—' },
    color: '#fce7f3',
    accentColor: '#db2777',
    proximamente: true,
  },
];
