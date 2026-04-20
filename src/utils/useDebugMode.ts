import { useEffect, useState } from 'react';

const STORAGE_KEY = 'explorer-debug';

function readStored(): boolean {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(STORAGE_KEY) === '1';
}

// Activa con ?debug=1, desactiva con ?debug=0. La preferencia queda guardada.
export function useDebugMode(): boolean {
  const [enabled, setEnabled] = useState<boolean>(readStored);

  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('debug');
    if (param === '1') {
      window.localStorage.setItem(STORAGE_KEY, '1');
      setEnabled(true);
    } else if (param === '0') {
      window.localStorage.removeItem(STORAGE_KEY);
      setEnabled(false);
    }
  }, []);

  return enabled;
}
