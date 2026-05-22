import { useState, useEffect, useRef } from 'react';
import { trackEvent } from '../utils/tracker';

const STORAGE_KEY = 'youyou_visit_count';

export function useVisitCounter() {
  const [count, setCount] = useState(0);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const current = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    const next = current + 1;
    localStorage.setItem(STORAGE_KEY, String(next));
    setCount(next);
    trackEvent('visit', `Visite n°${next}`);
  }, []);

  return count;
}
