export type SoundName =
  | 'mision-completada'
  | 'etapa-completada'
  | 'desbloqueo-normal'
  | 'desbloqueo-especial'
  | 'lock'
  | 'press-button';

const STORAGE_KEY = 'clubexp-muted';

const FILES: Record<SoundName, string> = {
  'mision-completada': '/sounds/mision-completada.mp3',
  'etapa-completada': '/sounds/etapa-completada.mp3',
  'desbloqueo-normal': '/sounds/desbloqueo-normal.mp3',
  'desbloqueo-especial': '/sounds/desbloqueo-especial.mp3',
  'lock': '/sounds/lock.mp3',
  'press-button': '/sounds/press-button.mp3',
};

const DEFAULT_VOLUMES: Record<SoundName, number> = {
  'mision-completada': 0.55,
  'etapa-completada': 0.65,
  'desbloqueo-normal': 0.6,
  'desbloqueo-especial': 0.7,
  'lock': 0.4,
  'press-button': 0.35,
};

const isBrowser = typeof window !== 'undefined';

function readMuted(): boolean {
  if (!isBrowser) return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

let muted = readMuted();
const listeners = new Set<(m: boolean) => void>();
const cache = new Map<SoundName, HTMLAudioElement>();

function getBase(name: SoundName): HTMLAudioElement | null {
  if (!isBrowser) return null;
  let a = cache.get(name);
  if (!a) {
    a = new Audio(FILES[name]);
    a.preload = 'auto';
    cache.set(name, a);
  }
  return a;
}

if (isBrowser) {
  (Object.keys(FILES) as SoundName[]).forEach((n) => getBase(n));
}

export function isMuted(): boolean {
  return muted;
}

export function setMuted(value: boolean): void {
  muted = value;
  if (isBrowser) {
    try {
      localStorage.setItem(STORAGE_KEY, value ? '1' : '0');
    } catch {}
  }
  listeners.forEach((fn) => fn(muted));
}

export function toggleMuted(): boolean {
  setMuted(!muted);
  return muted;
}

export function subscribeMuted(fn: (m: boolean) => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function playSound(name: SoundName, volumeOverride?: number): void {
  if (muted || !isBrowser) return;
  const base = getBase(name);
  if (!base) return;
  try {
    const clone = base.cloneNode(true) as HTMLAudioElement;
    clone.volume = volumeOverride ?? DEFAULT_VOLUMES[name] ?? 0.5;
    const p = clone.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});
  } catch {}
}
